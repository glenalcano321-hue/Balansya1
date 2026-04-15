import { Store, ChefHat, Package, Plus, Check } from 'lucide-react';
import { useWorkstations } from '../WorkstationContext';

interface ComponentLibraryProps {
  onAddStation: (station: any) => void;
  placedStationIds: string[];
}

export default function ComponentLibrary({ onAddStation, placedStationIds }: ComponentLibraryProps) {
  const { workstations } = useWorkstations();

  const getIcon = (type: string) => {
    if (type.includes('Back')) return ChefHat;
    if (type.includes('Front')) return Store;
    return Package;
  };

  const getColor = (type: string) => {
    if (type.includes('Back')) return '#EF4444';
    if (type.includes('Front')) return '#3B82F6';
    return '#8B5CF6';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)]">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-bold text-gray-900">Live Stations</h3>
        <p className="text-xs text-gray-500 mt-1">Place unassigned stations onto your layout canvas</p>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto">
        {workstations.map((ws) => {
          const isPlaced = placedStationIds.includes(ws.id);
          const Icon = getIcon(ws.stationType);
          const color = getColor(ws.stationType);

          return (
            <button
              key={ws.id}
              onClick={() => !isPlaced && onAddStation(ws)}
              disabled={isPlaced}
              className={`w-full text-left group flex flex-col gap-2 p-4 rounded-xl border-2 transition-all relative overflow-hidden
                ${isPlaced 
                  ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' 
                  : 'border-gray-100 bg-white hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform shadow-sm
                    ${!isPlaced && 'group-hover:scale-110'}
                  `}
                  style={{ backgroundColor: `${color}15`, color: color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`font-bold text-sm transition-colors truncate
                  ${isPlaced ? 'text-gray-500' : 'text-gray-900 group-hover:text-blue-700'}
                `}>
                  {ws.stationName}
                </div>
              </div>

              <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                {ws.stationType}
              </div>

              <div className="absolute right-3 top-4 transition-opacity">
                {isPlaced ? (
                  <div className="bg-gray-200 text-gray-500 p-1.5 rounded-md">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="bg-blue-50 text-blue-600 p-1.5 rounded-md opacity-0 group-hover:opacity-100">
                    <Plus className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
        
        {workstations.length === 0 && (
          <div className="text-center p-4 text-sm text-gray-500 italic">
            No stations found. Add some in the Workstation Setup page first!
          </div>
        )}
      </div>
    </div>
  );
}