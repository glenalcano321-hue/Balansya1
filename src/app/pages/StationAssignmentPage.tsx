import { useState } from 'react';
import { Play, User, Clock, ListChecks, ChevronRight, Info, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';

interface Assignment {
  stationId: string;
  worker: string;
  tasks: string[];
  cycleTime: number;
  utilization: number;
}

const initialAssignments: Assignment[] = [
  { stationId: 'ST-01', worker: 'Maria Santos', tasks: ['Assembly A', 'Assembly B'], cycleTime: 42, utilization: 85 },
  { stationId: 'ST-02', worker: 'Juan Dela Cruz', tasks: ['Welding X', 'Welding Y'], cycleTime: 58, utilization: 92 },
  { stationId: 'ST-03', worker: 'Ana Reyes', tasks: ['QC Check'], cycleTime: 28, utilization: 78 },
  { stationId: 'ST-04', worker: 'Pedro Garcia', tasks: ['Sub-Assembly 1', 'Sub-Assembly 2', 'Sub-Assembly 3'], cycleTime: 65, utilization: 105 },
  { stationId: 'ST-05', worker: 'Lisa Tan', tasks: ['Packaging'], cycleTime: 35, utilization: 88 },
  { stationId: 'ST-06', worker: 'Carlos Wong', tasks: ['Final Check'], cycleTime: 25, utilization: 72 },
];

export default function StationAssignmentPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [optimizing, setOptimizing] = useState(false);

  const handleOptimize = () => {
    setOptimizing(true);
    
    // Simulate optimization
    setTimeout(() => {
      const optimized = [...assignments];
      // Move one task from ST-04 to ST-06
      optimized[3] = {
        ...optimized[3],
        tasks: ['Sub-Assembly 1', 'Sub-Assembly 2'],
        cycleTime: 50,
        utilization: 85,
      };
      optimized[5] = {
        ...optimized[5],
        tasks: ['Final Check', 'Sub-Assembly 3'],
        cycleTime: 40,
        utilization: 88,
      };
      setAssignments(optimized);
      setOptimizing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Station Assignment & Rebalancing</h2>
          <p className="text-gray-600 mt-1">Optimized worker-to-station recommendations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOptimize}
            disabled={optimizing}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <Play className="w-5 h-5" />
            {optimizing ? 'Optimizing...' : 'Run Optimization'}
          </button>
          <Link
            to="/performance"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Reports
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Computation Logic Explanation */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-2">How the System Reached This Solution</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
              <div>
                <div className="font-medium mb-1">Input Data</div>
                <ul className="space-y-1 text-xs">
                  <li>• 6 workers present today</li>
                  <li>• 8 active menu items</li>
                  <li>• 220 expected orders</li>
                  <li>• Peak day multiplier (1.5x)</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-1">Analysis Applied</div>
                <ul className="space-y-1 text-xs">
                  <li>• Skill matrix compatibility</li>
                  <li>• Takt time targets (45s)</li>
                  <li>• Utilization balancing</li>
                  <li>• Bottleneck mitigation</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-1">Optimization Goal</div>
                <ul className="space-y-1 text-xs">
                  <li>• Minimize cycle time variance</li>
                  <li>• Balance utilization (80-95%)</li>
                  <li>• Match skills to tasks</li>
                  <li>• Eliminate bottlenecks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {optimizing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-blue-700">
              Analyzing workload distribution and skill compatibility...
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment.stationId}
            className={`
              bg-white rounded-lg shadow-sm p-6 border-2 transition-all
              ${assignment.utilization > 100 ? 'border-red-300 bg-red-50' : 
                assignment.utilization > 90 ? 'border-yellow-300 bg-yellow-50' : 
                'border-gray-200'}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{assignment.stationId}</h3>
                <p className="text-sm text-gray-600">Workstation</p>
              </div>
              <div className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${assignment.utilization > 100 ? 'bg-red-100 text-red-700' : 
                  assignment.utilization > 90 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-green-100 text-green-700'}
              `}>
                {assignment.utilization}%
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-600">Assigned Worker</div>
                  <div className="text-sm font-medium text-gray-900">{assignment.worker}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-600">Cycle Time</div>
                  <div className="text-sm font-medium text-gray-900">{assignment.cycleTime}s</div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ListChecks className="w-5 h-5 text-gray-600" />
                  <div className="text-xs text-gray-600">Assigned Tasks</div>
                </div>
                <div className="space-y-1 ml-7">
                  {assignment.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 px-3 py-1.5 bg-white border border-gray-200 rounded"
                    >
                      {task}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-2">Utilization</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      assignment.utilization > 100 ? 'bg-red-500' :
                      assignment.utilization > 90 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(assignment.utilization, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Stations</div>
            <div className="text-2xl font-semibold text-gray-900">{assignments.length}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Avg Utilization</div>
            <div className="text-2xl font-semibold text-gray-900">
              {(assignments.reduce((acc, a) => acc + a.utilization, 0) / assignments.length).toFixed(0)}%
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Bottlenecks</div>
            <div className="text-2xl font-semibold text-red-600">
              {assignments.filter(a => a.utilization > 100).length}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Avg Cycle Time</div>
            <div className="text-2xl font-semibold text-gray-900">
              {(assignments.reduce((acc, a) => acc + a.cycleTime, 0) / assignments.length).toFixed(0)}s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
