import { useMemo } from 'react';
import { Clock, Users, AlertTriangle, TrendingUp, ArrowUp, ArrowDown, ChevronRight, Play, UserCheck, UtensilsCrossed, Activity } from 'lucide-react';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Import Global Contexts
import { useWorkforce } from '../components/WorkforceState';
import { useDemand } from '../components/DemandContext';
import { useWorkstations } from '../components/WorkstationContext';

export default function DashboardPage() {
  // Pull live data
  const { workers } = useWorkforce();
  const { demandData } = useDemand();
  const { workstations } = useWorkstations();

  // --- Dynamic Calculations ---

  // 1. Workforce Metrics
  const activeWorkers = workers.filter(w => w.status === 'present');
  const absentWorkers = workers.filter(w => w.status === 'absent').length;
  
  // 2. Demand Metrics
  const liveDemand = demandData.adjustedDemand;
  
  // 3. Takt Time Calculation (Assuming an 8-hour / 28,800 sec production day for the dashboard summary)
  const productionSeconds = 28800; 
  const taktTime = liveDemand > 0 ? (productionSeconds / liveDemand).toFixed(1) : '0';

  // 4. Global Utilization
  const totalWorkTime = activeWorkers.reduce((acc, w) => acc + w.workTimeMinutes, 0);
  const totalShiftTime = activeWorkers.reduce((acc, w) => acc + w.shiftDurationMinutes, 0);
  const globalUtilization = totalShiftTime > 0 ? Math.round((totalWorkTime / totalShiftTime) * 100) : 0;

  // 5. Generate Chart Data
  const workloadData = useMemo(() => {
    return workstations.map(ws => {
      const cycleTime = ws.tasks.reduce((sum, t) => sum + t.avgTime, 0);
      // Rough workload estimation for the chart based on demand and cycle time
      const estimatedWorkload = Math.min(100, Math.round((liveDemand * (cycleTime / 60)) / (8 * ws.capacity)));
      return {
        station: ws.id,
        workload: estimatedWorkload,
        capacity: 100
      };
    });
  }, [workstations, liveDemand]);

  const utilizationData = useMemo(() => {
    return activeWorkers.map(w => {
      const util = w.shiftDurationMinutes > 0 ? Math.round((w.workTimeMinutes / w.shiftDurationMinutes) * 100) : 0;
      return {
        name: w.name,
        station: w.station !== 'Unassigned' ? w.station : 'Unassigned',
        utilization: util,
        idle: Math.max(0, 100 - util)
      };
    }).slice(0, 4); // Show top 4 on dashboard
  }, [activeWorkers]);

  // 6. Dynamic Alerts
  const liveAlerts = useMemo(() => {
    const generatedAlerts = [];
    
    // Check for overworked staff
    activeWorkers.forEach(w => {
      const util = w.shiftDurationMinutes > 0 ? Math.round((w.workTimeMinutes / w.shiftDurationMinutes) * 100) : 0;
      if (util > 90) {
        generatedAlerts.push({
          type: 'warning',
          message: `Worker ${w.name} showing ${util}% utilization - consider task redistribution`
        });
      }
    });

    // Check for bottlenecks (workload > 95)
    workloadData.forEach(ws => {
      if (ws.workload > 95) {
        generatedAlerts.push({
          type: 'critical',
          message: `Station ${ws.station} operating near capacity - immediate rebalancing required`
        });
      }
    });

    if (generatedAlerts.length === 0) {
       generatedAlerts.push({ type: 'info', message: 'All systems operating within normal parameters.' });
    }

    return generatedAlerts;
  }, [activeWorkers, workloadData]);


  const kpiData = [
    { label: 'Available Workers Today', value: activeWorkers.length.toString(), subtext: `${absentWorkers} absent`, icon: UserCheck, status: 'info' },
    // Active Dishes relies on a Menu Context we haven't built yet, so we'll leave it static for now, or you can build a MenuContext next!
    { label: 'Active Dishes', value: '24', subtext: '8 categories', icon: UtensilsCrossed, status: 'info' }, 
    { label: 'Expected Demand', value: liveDemand.toString(), subtext: 'orders today', icon: TrendingUp, status: 'info' },
    { label: 'Avg Service Time', value: '12m', subtext: 'per order', icon: Clock, status: 'info' },
    { label: 'Takt Time', value: `${taktTime}s`, status: 'good', icon: Clock },
    { label: 'Workforce Utilization', value: `${globalUtilization}%`, status: globalUtilization > 90 ? 'warning' : 'good', icon: Activity },
    { label: 'Line Efficiency', value: '92%', status: 'good', icon: TrendingUp },
    { label: 'Bottleneck Alert', value: liveAlerts.filter(a => a.type === 'critical').length.toString(), subtext: 'stations', icon: AlertTriangle, status: liveAlerts.filter(a => a.type === 'critical').length > 0 ? 'warning' : 'good' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Quick Start */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Operations Dashboard</h2>
          <p className="text-gray-600 mt-1">Real-time monitoring and system status</p>
        </div>
        <Link
          to="/workforce-availability"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Play className="w-4 h-4" />
          Start Daily Setup
        </Link>
      </div>

      {/* Workflow Quick Access */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-4">Daily Operations Workflow</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Link to="/workforce-availability" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">1. Workforce Setup</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-xs text-gray-600">Set daily attendance</p>
          </Link>

          <Link to="/menu-input" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">2. Menu Input</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-xs text-gray-600">Select active items</p>
          </Link>

          <Link to="/demand-input" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">3. Demand Input</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-xs text-gray-600">Set expected orders</p>
          </Link>

          <Link to="/station-assignment" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">4. View Results</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-xs text-gray-600">Get recommendations</p>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  kpi.status === 'warning' ? 'bg-yellow-50' :
                  kpi.status === 'good' ? 'bg-green-50' : 'bg-blue-50'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    kpi.status === 'warning' ? 'text-yellow-600' :
                    kpi.status === 'good' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-1">{kpi.label}</div>
              <div className="text-3xl font-semibold text-gray-900">{kpi.value}</div>
              {kpi.subtext && (
                <div className="text-xs text-gray-500 mt-1">{kpi.subtext}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Visualization */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Workload Distribution</h3>
          {workloadData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" key="grid-workload" />
                <XAxis dataKey="station" tick={{ fill: '#6B7280', fontSize: 12 }} key="xaxis-workload" />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} key="yaxis-workload" />
                <Tooltip key="tooltip-workload" />
                <Bar dataKey="workload" fill="#3B82F6" radius={[4, 4, 0, 0]} key="bar-workload" />
                <Bar dataKey="capacity" fill="#E5E7EB" radius={[4, 4, 0, 0]} key="bar-capacity" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              No workstation data available.
            </div>
          )}
        </div>

        {/* Workforce Utilization Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workforce Utilization (Active)</h3>
          <div className="space-y-4">
            {utilizationData.length > 0 ? (
              utilizationData.map((worker, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{worker.name}</div>
                      <div className="text-gray-500">{worker.station}</div>
                    </div>
                    <div className="font-semibold text-gray-900">{worker.utilization}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        worker.utilization >= 90 ? 'bg-red-500' :
                        worker.utilization >= 75 ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${worker.utilization}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No active workers logged today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Panel */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Alerts & Recommendations</h3>
        <div className="space-y-3">
          {liveAlerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                alert.type === 'critical' ? 'bg-red-50 border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.type === 'critical' ? 'text-red-600' :
                  alert.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}