import { useEffect } from 'react';
import { AlertTriangle, CheckCircle, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router';
import { useNotification } from '../components/NotificationsContext';

const stations = [
  { id: 'ST-01', name: 'Order Taking', cycleTime: 3, utilization: 65, status: 'normal', workload: 180, avgTaskTime: 3, queuePressure: 'Low' },
  { id: 'ST-02', name: 'Ingredient Preparation', cycleTime: 8, utilization: 88, status: 'normal', workload: 1440, avgTaskTime: 8, queuePressure: 'Medium' },
  { id: 'ST-03', name: 'Cooking Station', cycleTime: 12, utilization: 105, status: 'bottleneck', workload: 2160, avgTaskTime: 12, queuePressure: 'High' },
  { id: 'ST-04', name: 'Plating Station', cycleTime: 4, utilization: 78, status: 'normal', workload: 720, avgTaskTime: 4, queuePressure: 'Low' },
  { id: 'ST-05', name: 'Serving Station', cycleTime: 4, utilization: 72, status: 'normal', workload: 720, avgTaskTime: 4, queuePressure: 'Low' },
  { id: 'ST-06', name: 'Beverage Station', cycleTime: 6, utilization: 92, status: 'warning', workload: 1080, avgTaskTime: 6, queuePressure: 'Medium' },
];

export default function BottleneckDetectorPage() {
  const { addNotification } = useNotification();

  // Trigger notifications automatically when the page loads
  useEffect(() => {
    stations.forEach((station) => {
      if (station.status === 'bottleneck' || station.utilization > 100) {
        addNotification(
          'error', 
          `Critical Bottleneck: ${station.name} is over capacity (${station.utilization}%)`
        );
      } else if (station.status === 'warning' || station.utilization >= 90) {
        addNotification(
          'warning', 
          `Warning: ${station.name} is nearing maximum capacity (${station.utilization}%)`
        );
      }
    });
  }, [addNotification]);

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
    <div className="space-y-6">
      {/* Header - Stack on mobile, side-by-side on larger screens */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Bottleneck Detector</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Identify constraints and capacity issues</p>
        </div>
        <Link
          to="/station-assignment"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
        >
          Next: Station Assignment
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

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
              A station is identified as a bottleneck when it meets any of these criteria:
            </p>
            <ul className="text-sm text-yellow-800 space-y-1 mb-3 list-disc list-inside">
              <li><strong>Utilization {'>'} 95%</strong> - Station is at or near maximum capacity</li>
              <li><strong>Task time {'>'} Takt time</strong> - Station cannot keep pace with required production rate</li>
              <li><strong>High queue pressure</strong> - Work is accumulating at this station</li>
              <li><strong>Slowest processing time</strong> - Station takes longest to complete its work</li>
            </ul>
            <div className="bg-yellow-100/50 rounded-lg p-3 border border-yellow-200">
              <p className="text-sm text-yellow-900 leading-relaxed">
                <strong>Current Analysis:</strong> Cooking Station is operating at 105% utilization with 12s cycle time
                (takt time: 45s). High queue pressure indicates work is backing up at this station, making it the primary bottleneck.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Flow Diagram */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Production Flow</h3>
        
        {/* Responsive Diagram Container */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 overflow-x-auto pb-4">
          {stations.map((station, index) => (
            <div key={station.id} className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
              
              {/* Station Card */}
              <div className={`
                relative p-4 sm:p-6 rounded-lg border-2 w-full max-w-[250px] lg:min-w-[180px] transition-all
                ${getStatusColor(station.status)}
                ${station.status === 'bottleneck' ? 'shadow-lg scale-100 lg:scale-105 ring-4 ring-red-100' : ''}
              `}>
                <div className="text-center">
                  <div className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 opacity-80">{station.id}</div>
                  <div className="text-sm font-bold mb-2 sm:mb-3 leading-tight">{station.name}</div>
                  <div className="text-xl sm:text-2xl font-bold mb-1">{station.avgTaskTime}m</div>
                  <div className="text-[10px] sm:text-xs mb-2 opacity-80 uppercase tracking-wider">Avg Time</div>
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

              {/* Connecting Arrows (Down arrow on mobile, Right arrow on desktop) */}
              {index < stations.length - 1 && (
                <div className="flex flex-col lg:flex-row items-center justify-center opacity-50 py-2 lg:py-0">
                  {/* Desktop Right Arrow */}
                  <div className="hidden lg:block w-8 h-1 bg-gray-400"></div>
                  <div className="hidden lg:block w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-gray-400"></div>
                  
                  {/* Mobile Down Arrow */}
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
        
        {/* Table wrapper for horizontal scrolling on mobile */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Station ID</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Time</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Workload</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">Utilization</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Queue Pressure</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stations.map((station) => (
                <tr 
                  key={station.id} 
                  className={`
                    ${station.utilization > 100 ? 'bg-red-50/50' : 'hover:bg-gray-50'}
                    transition-colors
                  `}
                >
                  <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">{station.id}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-700">{station.name}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{station.avgTaskTime}m</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{station.workload}m</td>
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

      {/* Alerts - Stack on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2 bg-red-100 rounded-full w-max">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="w-full">
              <h4 className="text-lg font-bold text-red-900 mb-2">Critical Bottleneck Detected</h4>
              <p className="text-sm text-red-800 mb-4 leading-relaxed">
                <strong>Cooking Station (ST-03)</strong> is operating at 105% utilization.
                This is causing delays in the entire kitchen workflow.
              </p>
              <div className="bg-white/60 rounded p-3 text-sm text-red-900 space-y-2 border border-red-100">
                <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
                  <span className="opacity-80">Workload:</span> <strong>2160 mins</strong>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
                  <span className="opacity-80">Avg Task Time:</span> <strong>12 mins/order</strong>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
                  <span className="opacity-80">Queue Pressure:</span> <strong>High (Backing up)</strong>
                </div>
                <div className="pt-2 mt-2 border-t border-red-200/50">
                  <p className="font-semibold mb-1">Recommendation:</p>
                  <p className="opacity-90">Add another cook or redistribute prep tasks to other stations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2 bg-green-100 rounded-full w-max">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-green-900 mb-2">Optimization Opportunity</h4>
              <p className="text-sm text-green-800 leading-relaxed mb-4">
                <strong>Serving Station (ST-05)</strong> has 28% spare capacity.
                Consider shifting some packaging or light prep tasks to this station to improve overall throughput and relieve upstream pressure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}