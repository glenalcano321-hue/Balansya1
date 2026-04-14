import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, Info, AlertTriangle, CheckCircle, Settings2 } from 'lucide-react';
import { Link } from 'react-router';
import { useWorkstations } from '../components/WorkstationContext'; 
import { useDemand } from '../components/DemandContext';

export default function TaktTimeAnalysisPage() {
  const { workstations } = useWorkstations(); 
  const { demandData } = useDemand();
  
  const [workingTime, setWorkingTime] = useState(28800); 
  const [productionHours, setProductionHours] = useState(8);
  const [selectedStationId, setSelectedStationId] = useState('');
  const demand = demandData.adjustedDemand;

  useEffect(() => {
    if (workstations.length > 0 && !selectedStationId) {
      setSelectedStationId(workstations[0].id);
    }
  }, [workstations, selectedStationId]);

  if (!workstations || workstations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Settings2 className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Workstations Found</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          To perform Takt Time Analysis, the system needs physical workstations and tasks to analyze.
        </p>
        <Link to="/workstation-setup" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
          Go to Workstation Setup
        </Link>
      </div>
    );
  }

  const dynamicStations = workstations.map(ws => {
    const totalMinutes = ws.tasks.reduce((sum, task) => sum + task.avgTime, 0);
    const cycleTimeSeconds = totalMinutes > 0 ? totalMinutes * 60 : 60; 

    return {
      id: ws.id,
      name: ws.stationName,
      cycleTime: cycleTimeSeconds,
      capacitySlots: ws.capacity 
    };
  });

  const activeStation = dynamicStations.find(s => s.id === selectedStationId) || dynamicStations[0];

  useEffect(() => {
    setWorkingTime(productionHours * 3600);
  }, [productionHours]);

  const taktTime = demand > 0 ? workingTime / demand : 0;
  
  const stationMaxCapacity = Math.floor((workingTime / activeStation.cycleTime) * activeStation.capacitySlots);
  const utilizationPercentage = stationMaxCapacity > 0 ? ((demand / stationMaxCapacity) * 100).toFixed(0) : '0';
  const isOverCapacity = Number(utilizationPercentage) > 100;

  const chartData = [
    { name: 'Target Demand', value: demand, fill: '#3B82F6' },
    { name: `${activeStation.name} Max Capacity`, value: stationMaxCapacity, fill: isOverCapacity ? '#EF4444' : '#10B981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Takt Time Analysis</h2>
          <p className="text-gray-600 mt-1">Compare required production pace against live workstation capabilities</p>
        </div>
        <Link
          to="/utilization"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
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
              <strong>Takt Time</strong> ({taktTime.toFixed(1)}s) is the pace you <em>must</em> maintain to satisfy the customer demand of <strong>{demand} orders</strong> (synced from your Demand Input). 
              The system calculates <strong>Cycle Time</strong> based on the tasks you assigned in the Setup module. If a station's Cycle Time exceeds Takt Time, it becomes a bottleneck.
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
                  min="1"
                  max="24"
                  value={productionHours}
                  onChange={(e) => setProductionHours(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* DYNAMIC READ-ONLY DEMAND FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  Expected Demand
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Live Linked</span>
                </label>
                <div className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg font-medium">
                  {demand} Units
                </div>
                <p className="text-xs text-gray-500 mt-1">To change this, update the <Link to="/demand-input" className="text-blue-600 hover:underline">Demand Input</Link> page.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Analyze Specific Workstation
              </label>
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
              >
                {dynamicStations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name} (Cycle: {station.cycleTime}s | Capacity: {station.capacitySlots} slots)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-sm text-gray-600 mb-1">Global Takt Time</div>
                <div className="text-3xl font-bold text-blue-600">{taktTime.toFixed(1)}s</div>
                <div className="text-xs text-blue-800 mt-1">Required pace per unit</div>
              </div>
              
              <div className={`rounded-lg p-4 border ${isOverCapacity ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-sm text-gray-600 mb-1">Station Utilization</div>
                <div className={`text-3xl font-bold ${isOverCapacity ? 'text-red-600' : 'text-gray-900'}`}>
                  {utilizationPercentage}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Of theoretical max</div>
              </div>
            </div>
          </div>
        </div>

        {/* Demand vs Capacity Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Capacity Analysis</h3>
            {isOverCapacity ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full border border-red-200">
                <AlertTriangle className="w-3 h-3" /> BOTTLENECK
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full border border-green-200">
                <CheckCircle className="w-3 h-3" /> CAPABLE
              </span>
            )}
          </div>
          
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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
            <div className={`flex items-center justify-between text-sm p-2.5 rounded-lg border ${isOverCapacity ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
              <span className={`font-medium ${isOverCapacity ? 'text-red-700' : 'text-green-700'}`}>
                {isOverCapacity ? 'Capacity Shortfall' : 'Surplus Capacity'}
              </span>
              <span className={`font-bold ${isOverCapacity ? 'text-red-700' : 'text-green-700'}`}>
                {Math.abs(stationMaxCapacity - demand)} units/day
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}