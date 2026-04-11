import { ChefHat, Flame, Refrigerator, UtensilsCrossed, Package, Drill } from 'lucide-react';

interface ComponentLibraryProps {
  onAddStation: (type: string, name: string, color: string) => void;
}

const equipmentTypes = [
  { type: 'stove', name: 'Cooking Station', icon: Flame, color: '#EF4444' },
  { type: 'prep', name: 'Prep Station', icon: ChefHat, color: '#3B82F6' },
  { type: 'storage', name: 'Storage', icon: Refrigerator, color: '#8B5CF6' },
  { type: 'counter', name: 'Counter', icon: UtensilsCrossed, color: '#10B981' },
  { type: 'packaging', name: 'Packaging', icon: Package, color: '#F59E0B' },
  { type: 'equipment', name: 'Equipment', icon: Drill, color: '#6B7280' },
];

export default function ComponentLibrary({ onAddStation }: ComponentLibraryProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Components</h3>
        <p className="text-xs text-gray-600 mt-1">Drag to add to canvas</p>
      </div>
      
      <div className="p-4 space-y-2">
        {equipmentTypes.map((equipment) => {
          const Icon = equipment.icon;
          return (
            <button
              key={equipment.type}
              onClick={() => onAddStation(equipment.type, equipment.name, equipment.color)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${equipment.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: equipment.color }} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
                <div className="text-xs text-gray-500">{equipment.type}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Tips</h4>
        <ul className="space-y-2 text-xs text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Click a component to add it to the canvas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Drag stations to reposition them</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Select a station to edit properties</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Use toolbar for rotation and resizing</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
