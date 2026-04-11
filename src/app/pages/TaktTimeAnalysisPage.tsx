import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronRight, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';

// Station data based on your WorkstationSetupPage tasks and capacities
// Cycle times are calculated by summing the avgTime of tasks at each station
const stationsData = [
  { id: 'GLOBAL', name: 'Global System Average', cycleTime: 45, workers: 1 },
  { id: 'WS001', name: 'Order Taking', cycleTime: 5, workers: 2 },
  { id: 'WS002', name: 'Ingredient Preparation', cycleTime: 16, workers: 3 },
  { id: 'WS003', name: 'Cooking Station', cycleTime: 30, workers: 4 },
  { id: 'WS004', name: 'Plating Station', cycleTime: 7, workers: 2 },
  { id: 'WS005', name: 'Serving Station', cycleTime: 6, workers: 3 }
];

export default function TaktTimeAnalysisPage() {
  const [workingTime, setWorkingTime] = useState(28800); // 8 hours in seconds
  const [demand, setDemand] = useState(640);
  const [productionHours, setProductionHours] = useState(8);
  const [selectedStationId, setSelectedStationId] = useState('GLOBAL');
  
  // Find the currently selected station object
  const activeStation = stationsData.find(s => s.id === selectedStationId) || stationsData[0];

  // Core Calculations
  const taktTime = workingTime / demand;
  
  // Calculate max capacity for the selected station based on its cycle time and number of workers
  // Formula: (Total Time / Station Cycle Time) * Number of Workers
  const stationMaxCapacity = Math.floor((workingTime / activeStation.cycleTime) * activeStation.workers);
  const utilizationPercentage = ((demand / stationMaxCapacity) * 100).toFixed(0);
  const isOverCapacity = Number(utilizationPercentage) > 100;

  const chartData = [
    { name: 'Target Demand', value: demand, fill: '#3B82F6' }, // Blue
    { name: `${activeStation.name} Capacity`, value: stationMaxCapacity, fill: isOverCapacity ? '#EF4444' : '#10B981' }, // Red if over, Green if under
  ];

  useEffect(() => {
    setWorkingTime(productionHours * 3600);
  }, [productionHours]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Takt Time Analysis</h2>
          <p className="text-gray-600 mt-1">Compare required production pace against workstation capabilities</p>
        </div>
        <Link
          to="/utilization"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next: Utilization
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Workflow Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Takt Time vs. Station Cycle Time</h4>
            <p className="text-sm text-blue-800">
              <strong>Takt Time</strong> ({taktTime.toFixed(1)}s) is the pace you <em>must</em> maintain to satisfy customer demand ({demand} orders). 
              Use the dropdown below to select a specific workstation. If a station's <strong>Cycle Time</strong> exceeds the Takt Time, it becomes a bottleneck and cannot meet the daily demand.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Parameters</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Production Hours/Day
                </label>
                <input
                  type="number"
                  value={productionHours}
                  onChange={(e) => setProductionHours(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Demand
                </label>
                <input
                  type="number"
                  value={demand}
                  onChange={(e) => setDemand(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Analyze Specific Workstation
              </label>
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {stationsData.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name} (Cycle: {station.cycleTime}s | Workers: {station.workers})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-sm text-gray-600 mb-1">Global Takt Time</div>
                <div className="text-3xl font-bold text-blue-600">{taktTime.toFixed(1)}s</div>
                <div className="text-xs text-blue-800 mt-1">Required pace</div>
              </div>
              
              <div className={`rounded-lg p-4 border ${isOverCapacity ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-sm text-gray-600 mb-1">Station Utilization</div>
                <div className={`text-3xl font-bold ${isOverCapacity ? 'text-red-600' : 'text-gray-900'}`}>
                  {utilizationPercentage}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Of max capacity</div>
              </div>
            </div>
          </div>
        </div>

        {/* Demand vs Capacity Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Demand vs {activeStation.name} Capacity</h3>
            {isOverCapacity ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                <AlertTriangle className="w-3 h-3" /> BOTTLENECK
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" /> CAPABLE
              </span>
            )}
          </div>
          
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Required Production Rate</span>
              <span className="font-semibold text-gray-900">
                {(demand / productionHours).toFixed(1)} units/hour
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{activeStation.name} Maximum Rate</span>
              <span className="font-semibold text-gray-900">
                {(stationMaxCapacity / productionHours).toFixed(1)} units/hour
              </span>
            </div>
            <div className={`flex items-center justify-between text-sm p-2 rounded ${isOverCapacity ? 'bg-red-50' : 'bg-green-50'}`}>
              <span className={isOverCapacity ? 'text-red-700' : 'text-green-700'}>
                {isOverCapacity ? 'Capacity Shortfall' : 'Surplus Capacity'}
              </span>
              <span className={`font-semibold ${isOverCapacity ? 'text-red-700' : 'text-green-700'}`}>
                {Math.abs(stationMaxCapacity - demand)} units/day
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}