import { StationItem } from '../../pages/KitchenLayoutEditorPage';
import { User, Clock, Tag, Trash2, RotateCw, Maximize2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedStation: StationItem | null;
  onUpdateStation: (updates: Partial<StationItem>) => void;
  onDelete: () => void;
}

const workers = [
  'Maria Santos',
  'Juan Dela Cruz',
  'Ana Reyes',
  'Pedro Garcia',
  'Lisa Tan',
  'Carlos Wong',
];

const taskTypes = [
  'Component Assembly',
  'Welding Operation',
  'Quality Inspection',
  'Packaging',
  'Machine Setup',
  'Prep Work',
  'Cooking',
  'Plating',
];

export default function PropertiesPanel({
  selectedStation,
  onUpdateStation,
  onDelete,
}: PropertiesPanelProps) {
  if (!selectedStation) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-400 mt-20">
          <div className="text-lg font-medium mb-2">No Selection</div>
          <div className="text-sm">Select a station to edit its properties</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Properties</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Station Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Station Name</label>
          <input
            type="text"
            value={selectedStation.name}
            onChange={(e) => onUpdateStation({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <input
            type="text"
            value={selectedStation.type}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Worker Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Assigned Worker
          </label>
          <select
            value={selectedStation.worker || ''}
            onChange={(e) => onUpdateStation({ worker: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            {workers.map((worker) => (
              <option key={worker} value={worker}>
                {worker}
              </option>
            ))}
          </select>
        </div>

        {/* Task Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Task Name
          </label>
          <select
            value={selectedStation.taskType || ''}
            onChange={(e) => onUpdateStation({ taskType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select task</option>
            {taskTypes.map((task) => (
              <option key={task} value={task}>
                {task}
              </option>
            ))}
          </select>
        </div>

        {/* Cycle Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Cycle Time (seconds)
          </label>
          <input
            type="number"
            value={selectedStation.cycleTime || 0}
            onChange={(e) => onUpdateStation({ cycleTime: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        {/* Position & Size */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Transform</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">X Position</label>
              <input
                type="number"
                value={Math.round(selectedStation.x)}
                onChange={(e) => onUpdateStation({ x: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Y Position</label>
              <input
                type="number"
                value={Math.round(selectedStation.y)}
                onChange={(e) => onUpdateStation({ y: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                <Maximize2 className="w-3 h-3 inline mr-1" />
                Width
              </label>
              <input
                type="number"
                value={selectedStation.width}
                onChange={(e) => onUpdateStation({ width: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="40"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Height</label>
              <input
                type="number"
                value={selectedStation.height}
                onChange={(e) => onUpdateStation({ height: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="40"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs text-gray-600 mb-1">
              <RotateCw className="w-3 h-3 inline mr-1" />
              Rotation
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="360"
                step="45"
                value={selectedStation.rotation}
                onChange={(e) => onUpdateStation({ rotation: Number(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-gray-700 w-12">{selectedStation.rotation}°</span>
            </div>
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedStation.color}
              onChange={(e) => onUpdateStation({ color: e.target.value })}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedStation.color}
              onChange={(e) => onUpdateStation({ color: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Delete Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Station
          </button>
        </div>
      </div>
    </div>
  );
}