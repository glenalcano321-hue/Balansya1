import { StationItem } from '../../pages/KitchenLayoutEditorPage';
import { TrendingUp, Navigation, AlertTriangle, X } from 'lucide-react';

interface AnalyticsPanelProps {
  stations: StationItem[];
  onClose: () => void;
}

export default function AnalyticsPanel({ stations, onClose }: AnalyticsPanelProps) {
  // Calculate analytics
  const calculateTravelDistance = () => {
    if (stations.length === 0) return 0;
    
    let totalDistance = 0;
    
    // Calculate distance based on workflow connections
    stations.forEach(station => {
      if (station.connections && station.connections.length > 0) {
        station.connections.forEach(targetId => {
          const target = stations.find(s => s.id === targetId);
          if (target) {
            const distance = Math.sqrt(
              Math.pow(target.x - station.x, 2) + Math.pow(target.y - station.y, 2)
            );
            totalDistance += distance;
          }
        });
      }
    });
    
    // If no connections, calculate sequential distance
    if (totalDistance === 0 && stations.length > 1) {
      for (let i = 0; i < stations.length - 1; i++) {
        const current = stations[i];
        const next = stations[i + 1];
        const distance = Math.sqrt(
          Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
        );
        totalDistance += distance;
      }
    }
    
    return Math.round(totalDistance);
  };

  const calculateCongestionAreas = () => {
    // Simple clustering algorithm - count stations within proximity
    const congestionThreshold = 150;
    let congestionCount = 0;

    for (let i = 0; i < stations.length; i++) {
      let nearbyStations = 0;
      for (let j = 0; j < stations.length; j++) {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(stations[j].x - stations[i].x, 2) +
            Math.pow(stations[j].y - stations[i].y, 2)
          );
          if (distance < congestionThreshold) {
            nearbyStations++;
          }
        }
      }
      if (nearbyStations >= 2) {
        congestionCount++;
      }
    }
    return congestionCount;
  };

  const calculateEfficiency = () => {
    if (stations.length === 0) return 0;
    
    const travelDistance = calculateTravelDistance();
    const congestion = calculateCongestionAreas();
    const avgCycleTime = stations.reduce((sum, s) => sum + (s.cycleTime || 0), 0) / stations.length;
    
    // Simple efficiency score (higher is better)
    const distanceScore = Math.max(0, 100 - (travelDistance / 50));
    const congestionScore = Math.max(0, 100 - (congestion * 15));
    const cycleScore = avgCycleTime > 0 ? Math.min(100, (45 / avgCycleTime) * 100) : 50;
    
    return Math.round((distanceScore + congestionScore + cycleScore) / 3);
  };

  const travelDistance = calculateTravelDistance();
  const congestionAreas = calculateCongestionAreas();
  const efficiency = calculateEfficiency();

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Layout Analytics</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Travel Distance */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Travel Distance</span>
          </div>
          <div className="text-2xl font-semibold text-blue-600">{travelDistance}</div>
          <div className="text-xs text-gray-600 mt-1">pixels</div>
          <div className="mt-2 text-xs text-gray-600">
            {travelDistance < 500 ? '✓ Optimized' : travelDistance < 800 ? '⚠ Fair' : '✗ High'}
          </div>
        </div>

        {/* Congestion Areas */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Congestion Zones</span>
          </div>
          <div className="text-2xl font-semibold text-yellow-600">{congestionAreas}</div>
          <div className="text-xs text-gray-600 mt-1">areas detected</div>
          <div className="mt-2 text-xs text-gray-600">
            {congestionAreas === 0 ? '✓ None' : congestionAreas < 3 ? '⚠ Low' : '✗ High'}
          </div>
        </div>

        {/* Layout Efficiency */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Layout Efficiency</span>
          </div>
          <div className="text-2xl font-semibold text-green-600">{efficiency}%</div>
          <div className="text-xs text-gray-600 mt-1">overall score</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${
                efficiency >= 80 ? 'bg-green-500' :
                efficiency >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${efficiency}%` }}
            />
          </div>
        </div>

        {/* Station Count */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
              #
            </div>
            <span className="text-sm font-medium text-gray-700">Total Stations</span>
          </div>
          <div className="text-2xl font-semibold text-purple-600">{stations.length}</div>
          <div className="text-xs text-gray-600 mt-1">active stations</div>
          <div className="mt-2 text-xs text-gray-600">
            {stations.filter(s => s.taskType).length} with tasks
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {(travelDistance > 800 || congestionAreas > 2 || efficiency < 60) && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-900">
              <span className="font-semibold">Optimization Suggestions:</span>
              <ul className="mt-1 space-y-1 text-xs text-orange-800">
                {travelDistance > 800 && <li>• Reduce travel distance by grouping related stations closer</li>}
                {congestionAreas > 2 && <li>• Spread out clustered stations to reduce congestion</li>}
                {efficiency < 60 && <li>• Review cycle times and worker assignments for better balance</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}