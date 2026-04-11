import { useState } from 'react';
import { Users, Clock, Activity, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router';
import { useWorkforce } from '../components/WorkforceState';

export default function UtilizationMonitorPage() {
  const [hoveredWorker, setHoveredWorker] = useState<string | null>(null);
  
  // Pull live data from global context
  const { workers } = useWorkforce();
  
  // Filter out absent/day-off workers
  const activeWorkers = workers.filter(w => w.status === 'present');

  // Calculate dynamic utilization data for active workers
  const workersWithUtilization = activeWorkers.map(w => ({
    ...w,
    utilizationPercent: w.shiftDurationMinutes > 0 
      ? Math.round((w.workTimeMinutes / w.shiftDurationMinutes) * 100) 
      : 0
  }));

  // Aggregate Metrics
  const avgUtilization = workersWithUtilization.length > 0
    ? workersWithUtilization.reduce((acc, w) => acc + w.utilizationPercent, 0) / workersWithUtilization.length
    : 0;
    
  const totalIdleTime = workersWithUtilization.reduce((acc, w) => acc + w.idleTimeMinutes, 0);

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-500';   // Overworked / Fatigue risk
    if (utilization >= 75) return 'bg-green-500'; // Optimal
    if (utilization >= 60) return 'bg-yellow-500'; // Underutilized
    return 'bg-blue-500'; // Highly idle
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Utilization Monitor</h2>
          <p className="text-gray-600 mt-1">Worker productivity and idle time analysis</p>
        </div>
        <Link
          to="/bottleneck"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next: Bottleneck Detection
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Workflow Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">Utilization Formula & Calculation</h4>
            <div className="bg-white rounded-lg p-4 mb-3">
              <div className="text-center font-mono text-lg font-semibold text-blue-900">
                Utilization = (Active Work Time ÷ Total Shift Duration) × 100
              </div>
            </div>
            <p className="text-sm text-blue-800">
              Worker utilization measures how effectively each worker's time is being used based on the logs from the Availability page.
              Optimal range is 75-90%. Lower utilization indicates idle time that could be reassigned.
              Higher utilization (above 90%) may lead to worker fatigue and reduced quality.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Average Utilization</div>
              <div className="text-3xl font-semibold text-gray-900">{avgUtilization.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Idle Time</div>
              <div className="text-3xl font-semibold text-gray-900">{totalIdleTime}m</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Workers</div>
              <div className="text-3xl font-semibold text-gray-900">{activeWorkers.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Worker Utilization Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Worker Utilization Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Worker</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Station</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Work Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Idle Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tasks Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workersWithUtilization.length > 0 ? (
                workersWithUtilization.map((worker) => (
                  <tr
                    key={worker.id}
                    onMouseEnter={() => setHoveredWorker(worker.id)}
                    onMouseLeave={() => setHoveredWorker(null)}
                    className={`transition-colors cursor-default ${
                      hoveredWorker === worker.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{worker.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{worker.station}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5 max-w-[200px]">
                            <div
                              className={`h-2.5 rounded-full ${getUtilizationColor(worker.utilizationPercent)} transition-all duration-300`}
                              style={{ width: `${worker.utilizationPercent}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12">{worker.utilizationPercent}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{worker.workTimeMinutes} min</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${worker.idleTimeMinutes > 60 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                        {worker.idleTimeMinutes} min
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{worker.tasksCompleted}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No active workers found. Please ensure workers are marked as 'Present' on the Availability page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Utilization Distribution */}
      {hoveredWorker && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 transition-all">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed Breakdown: {workersWithUtilization.find(w => w.id === hoveredWorker)?.name}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="text-sm text-gray-600 mb-1">Productive Time</div>
              <div className="text-2xl font-semibold text-green-600">
                {workersWithUtilization.find(w => w.id === hoveredWorker)?.workTimeMinutes} min
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="text-sm text-gray-600 mb-1">Idle Time</div>
              <div className="text-2xl font-semibold text-red-600">
                {workersWithUtilization.find(w => w.id === hoveredWorker)?.idleTimeMinutes} min
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}