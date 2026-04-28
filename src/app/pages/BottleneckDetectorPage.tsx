import { useEffect, useMemo } from 'react';
import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useNotification } from '../components/NotificationsContext';
import { useWorkstations } from '../components/WorkstationContext';
import { useDemand } from '../components/DemandContext';

export default function BottleneckDetectorPage() {
  const { addNotification } = useNotification();
  const { workstations } = useWorkstations();
  const { demandData } = useDemand();

  // 1. DYNAMICALLY CALCULATE STATION METRICS
  const analyzedStations = useMemo(() => {
    const liveDemand = demandData.adjustedDemand || 0;

    return (workstations || []).map((ws) => {
      // Calculate total cycle time from assigned tasks
      const cycleTime = ws.tasks?.reduce((sum, t) => sum + (t.avgTime || 0), 0) || 0;
      
      // Total minutes of work required to meet today's demand
      const workloadMinutes = liveDemand * cycleTime;
      
      // Total minutes available (8 hours * 60 mins * physical capacity)
      const capacityMinutes = 8 * 60 * (ws.capacity || 1);
      
      // Utilization percentage
      const utilization = capacityMinutes > 0 ? Math.round((workloadMinutes / capacityMinutes) * 100) : 0;

      let status = 'normal';
      let queuePressure = 'Low';

      if (utilization > 100) {
        status = 'bottleneck';
        queuePressure = 'High';
      } else if (utilization > 90) {
        status = 'warning';
        queuePressure = 'Medium';
      }

      return {
        id: ws.id,
        name: ws.stationName || 'Unknown Station',
        cycleTime,
        utilization,
        status,
        workload: workloadMinutes,
        avgTaskTime: cycleTime, 
        queuePressure,
        spareCapacity: Math.max(0, 100 - utilization)
      };
    });
  }, [workstations, demandData]);

  // 2. IDENTIFY EXTREMES FOR DYNAMIC RECOMMENDATIONS
  const primaryBottleneck = useMemo(() => {
    if (analyzedStations.length === 0) return null;
    return [...analyzedStations].sort((a, b) => b.utilization - a.utilization)[0];
  }, [analyzedStations]);

  const primaryOpportunity = useMemo(() => {
    if (analyzedStations.length === 0) return null;
    return [...analyzedStations].sort((a, b) => a.utilization - b.utilization)[0];
  }, [analyzedStations]);

  // 3. TRIGGER NOTIFICATIONS
  useEffect(() => {
    analyzedStations.forEach((station) => {
      if (station.status === 'bottleneck') {
        addNotification(
          'error', 
          `Critical Bottleneck: ${station.name} is over capacity (${station.utilization}%)`
        );
      } else if (station.status === 'warning') {
        addNotification(
          'warning', 
          `Warning: ${station.name} is nearing maximum capacity (${station.utilization}%)`
        );
      }
    });
  }, [analyzedStations, addNotification]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bottleneck': return 'bg-red-100 border-red-500 text-red-700';
      case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default: return 'bg-green-100 border-green-500 text-green-700';
    }
  };

  const getStatusBadge = (status: string, utilization: number) => {
    if (utilization > 100) {
      return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full whitespace-nowrap">BOTTLENECK</span>;
    }
    if (utilization > 90) {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full whitespace-nowrap">AT RISK</span>;
    }
    return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">NORMAL</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Bottleneck Detector</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Identify constraints and capacity issues based on live demand</p>
        </div>
        <Link
          to="/station-assignment"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto font-medium"
        >
          Next: Auto-Assign Staff
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {analyzedStations.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center text-yellow-800">
          No workstations found. Please configure your kitchen in the Workstation Setup module first.
        </div>
      ) : (
        <>
          {/* Workflow Context */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 hidden sm:block" />
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                   <AlertTriangle className="w-5 h-5 text-yellow-600 sm:hidden" />
                   <h4 className="font-semibold text-yellow-900">Bottleneck Detection Logic</h4>
                </div>
                <p className="text-sm text-yellow-800 mb-3">
                  A station is automatically flagged based on your current Expected Demand of <strong>{demandData.adjustedDemand || 0} orders</strong>:
                </p>
                <ul className="text-sm text-yellow-800 space-y-1 mb-3 list-disc list-inside">
                  <li><strong>Utilization {'>'} 100% (Bottleneck)</strong> - Impossible to meet demand with current capacity.</li>
                  <li><strong>Utilization {'>'} 90% (Warning)</strong> - Operating at dangerous limits; high risk of delays.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Process Flow Diagram */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Live Production Flow Map</h3>
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 overflow-x-auto pb-4">
              {analyzedStations.map((station, index) => (
                <div key={station.id} className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
                  
                  <div className={`
                    relative p-4 sm:p-6 rounded-lg border-2 w-full max-w-[250px] lg:min-w-[180px] transition-all
                    ${getStatusColor(station.status)}
                    ${station.status === 'bottleneck' ? 'shadow-lg scale-100 lg:scale-105 ring-4 ring-red-100' : ''}
                  `}>
                    <div className="text-center">
                      <div className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 opacity-80">{station.id}</div>
                      <div className="text-sm font-bold mb-2 sm:mb-3 leading-tight">{station.name}</div>
                      <div className="text-xl sm:text-2xl font-bold mb-1">{station.avgTaskTime}m</div>
                      <div className="text-[10px] sm:text-xs mb-2 opacity-80 uppercase tracking-wider">Cycle Time</div>
                      <div className={`text-lg sm:text-xl font-bold ${
                        station.utilization > 100 ? 'text-red-600' :
                        station.utilization > 90 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {station.utilization}%
                      </div>
                      {station.status === 'bottleneck' && (
                        <div className="mt-2 sm:mt-3 animate-pulse">
                          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-red-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  {index < analyzedStations.length - 1 && (
                    <div className="flex flex-col lg:flex-row items-center justify-center opacity-50 py-2 lg:py-0">
                      <div className="hidden lg:block w-8 h-1 bg-gray-400"></div>
                      <div className="hidden lg:block w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-gray-400"></div>
                      <div className="block lg:hidden w-1 h-6 bg-gray-400"></div>
                      <div className="block lg:hidden w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-gray-400"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Station Analysis Details</h3>
            </div>
            
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Station</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cycle Time</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Workload</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">Utilization</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Queue Pressure</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analyzedStations.map((station) => (
                    <tr 
                      key={station.id} 
                      className={`
                        ${station.utilization > 100 ? 'bg-red-50/50' : 'hover:bg-gray-50'}
                        transition-colors
                      `}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{station.id}</div>
                        <div className="text-xs text-gray-500">{station.name}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-600">{station.avgTaskTime}m</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{station.workload}m required</td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px] sm:max-w-[120px] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                station.utilization > 100 ? 'bg-red-500' :
                                station.utilization > 90 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(station.utilization, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${
                            station.utilization > 100 ? 'text-red-600' :
                            station.utilization > 90 ? 'text-yellow-600' :
                            'text-gray-700'
                          }`}>
                            {station.utilization}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md whitespace-nowrap ${
                          station.queuePressure === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
                          station.queuePressure === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {station.queuePressure}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getStatusBadge(station.status, station.utilization)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dynamic Recommendations based on actual extremes */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Bottleneck Alert */}
            {primaryBottleneck && primaryBottleneck.utilization > 90 ? (
              <div className={`${primaryBottleneck.utilization > 100 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4 sm:p-6 shadow-sm`}>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className={`p-2 rounded-full w-max ${primaryBottleneck.utilization > 100 ? 'bg-red-100' : 'bg-yellow-100'}`}>
                    <AlertTriangle className={`w-6 h-6 ${primaryBottleneck.utilization > 100 ? 'text-red-600' : 'text-yellow-600'}`} />
                  </div>
                  <div className="w-full">
                    <h4 className={`text-lg font-bold mb-2 ${primaryBottleneck.utilization > 100 ? 'text-red-900' : 'text-yellow-900'}`}>
                      {primaryBottleneck.utilization > 100 ? 'Critical Bottleneck Detected' : 'Warning: Capacity Risk'}
                    </h4>
                    <p className={`text-sm mb-4 leading-relaxed ${primaryBottleneck.utilization > 100 ? 'text-red-800' : 'text-yellow-800'}`}>
                      <strong>{primaryBottleneck.name} ({primaryBottleneck.id})</strong> is operating at {primaryBottleneck.utilization}% utilization.
                      This is causing delays in the entire kitchen workflow.
                    </p>
                    <div className="bg-white/60 rounded p-3 text-sm space-y-2 border border-black/10 text-gray-800">
                      <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
                        <span className="opacity-80">Required Workload:</span> <strong>{primaryBottleneck.workload} mins</strong>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
                        <span className="opacity-80">Avg Cycle Time:</span> <strong>{primaryBottleneck.avgTaskTime} mins/order</strong>
                      </div>
                      <div className="pt-2 mt-2 border-t border-black/10">
                        <p className="font-semibold mb-1">System Recommendation:</p>
                        <p className="opacity-90">Assign your highest-skilled worker to this station in the Auto-Assigner, or redistribute its tasks to other stations.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
               <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 shadow-sm flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-full w-max">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-green-900 mb-1">No Bottlenecks Detected</h4>
                    <p className="text-sm text-green-800">All stations are operating within safe capacity limits for today's demand.</p>
                  </div>
               </div>
            )}

            {/* Optimization Opportunity */}
            {primaryOpportunity && primaryOpportunity.utilization < 75 && primaryOpportunity.id !== primaryBottleneck?.id && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-full w-max">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-blue-900 mb-2">Optimization Opportunity</h4>
                    <p className="text-sm text-blue-800 leading-relaxed mb-4">
                      <strong>{primaryOpportunity.name} ({primaryOpportunity.id})</strong> has {primaryOpportunity.spareCapacity}% spare capacity (Current Util: {primaryOpportunity.utilization}%).
                    </p>
                    <div className="pt-2 mt-2 border-t border-blue-200">
                        <p className="text-sm text-blue-900 font-semibold mb-1">Action to consider:</p>
                        <p className="text-sm text-blue-800 opacity-90">Shift prep tasks or reassign a worker from this station to assist your bottleneck ({primaryBottleneck?.name || 'other stations'}).</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}