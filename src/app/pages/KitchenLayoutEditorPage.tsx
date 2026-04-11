import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Save, 
  Undo, 
  Redo, 
  Trash2, 
  Copy, 
  Download,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  Maximize2,
  AlertCircle
} from 'lucide-react';
import ComponentLibrary from '../components/kitchen-layout/ComponentLibrary';
import LayoutCanvas from '../components/kitchen-layout/LayoutCanvas';
import PropertiesPanel from '../components/kitchen-layout/PropertiesPanel';
import AnalyticsPanel from '../components/kitchen-layout/AnalyticsPanel';

export interface StationItem {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  worker?: string;
  taskType?: string;
  cycleTime?: number;
  color: string;
  connections?: string[];
}

const initialStations: StationItem[] = [
  { 
    id: 'station-1', 
    type: 'prep', 
    name: 'Prep Station 1', 
    x: 100, 
    y: 100, 
    width: 100, 
    height: 100, 
    rotation: 0, 
    color: '#3B82F6',
    worker: 'Maria Santos',
    taskType: 'Component Assembly',
    cycleTime: 45,
    connections: ['station-2']
  },
  { 
    id: 'station-2', 
    type: 'stove', 
    name: 'Cooking Station', 
    x: 250, 
    y: 100, 
    width: 100, 
    height: 100, 
    rotation: 0, 
    color: '#EF4444',
    worker: 'Juan Dela Cruz',
    taskType: 'Welding Operation',
    cycleTime: 60,
    connections: ['station-3']
  },
  { 
    id: 'station-3', 
    type: 'counter', 
    name: 'Quality Counter', 
    x: 400, 
    y: 100, 
    width: 120, 
    height: 60, 
    rotation: 0, 
    color: '#10B981',
    worker: 'Ana Reyes',
    taskType: 'Quality Inspection',
    cycleTime: 30,
    connections: ['station-4']
  },
  { 
    id: 'station-4', 
    type: 'packaging', 
    name: 'Packaging Station', 
    x: 550, 
    y: 100, 
    width: 100, 
    height: 100, 
    rotation: 0, 
    color: '#F59E0B',
    worker: 'Pedro Garcia',
    taskType: 'Packaging',
    cycleTime: 25,
    connections: []
  },
];

export default function KitchenLayoutEditorPage() {
  const [stations, setStations] = useState<StationItem[]>(initialStations);
  const [selectedStation, setSelectedStation] = useState<StationItem | null>(null);
  const [tool, setTool] = useState<'select' | 'move' | 'rotate' | 'connect'>('select');
  const [zoom, setZoom] = useState(100);
  const [showAnalytics, setShowAnalytics] = useState(true);

  const handleAddStation = (stationType: string, name: string, color: string) => {
    const newStation: StationItem = {
      id: `station-${Date.now()}`,
      type: stationType,
      name,
      x: 100,
      y: 100,
      width: stationType === 'counter' ? 120 : stationType === 'storage' ? 80 : 100,
      height: stationType === 'counter' ? 60 : stationType === 'storage' ? 80 : 100,
      rotation: 0,
      color,
      connections: [],
    };
    setStations([...stations, newStation]);
    setSelectedStation(newStation);
  };

  const handleUpdateStation = (id: string, updates: Partial<StationItem>) => {
    setStations(stations.map(s => s.id === id ? { ...s, ...updates } : s));
    if (selectedStation?.id === id) {
      setSelectedStation({ ...selectedStation, ...updates });
    }
  };

  const handleDeleteStation = (id: string) => {
    setStations(stations.filter(s => s.id !== id));
    if (selectedStation?.id === id) {
      setSelectedStation(null);
    }
  };

  const handleDuplicateStation = () => {
    if (selectedStation) {
      const newStation = {
        ...selectedStation,
        id: `station-${Date.now()}`,
        x: selectedStation.x + 20,
        y: selectedStation.y + 20,
      };
      setStations([...stations, newStation]);
      setSelectedStation(newStation);
    }
  };

  const handleSave = () => {
    const layoutData = JSON.stringify(stations, null, 2);
    console.log('Saving layout:', layoutData);
    // In a real app, this would save to backend
    alert('Layout saved successfully!');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Kitchen Layout Editor</h2>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Undo">
                  <Undo className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Redo">
                  <Redo className="w-5 h-5 text-gray-600" />
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <button 
                  onClick={handleDuplicateStation}
                  disabled={!selectedStation}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="Duplicate"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => selectedStation && handleDeleteStation(selectedStation.id)}
                  disabled={!selectedStation}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Tools */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setTool('select')}
                  className={`p-2 rounded ${tool === 'select' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'} transition-colors`}
                  title="Select"
                >
                  <Move className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => setTool('rotate')}
                  className={`p-2 rounded ${tool === 'rotate' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'} transition-colors`}
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => setTool('move')}
                  className={`p-2 rounded ${tool === 'move' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'} transition-colors`}
                  title="Resize"
                >
                  <Maximize2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ZoomOut className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-sm text-gray-700 w-12 text-center">{zoom}%</span>
                <button 
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Component Library */}
          <ComponentLibrary onAddStation={handleAddStation} />

          {/* Center Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <LayoutCanvas
              stations={stations}
              selectedStation={selectedStation}
              zoom={zoom}
              tool={tool}
              onSelectStation={setSelectedStation}
              onUpdateStation={handleUpdateStation}
            />

            {/* Bottom Analytics Panel */}
            {showAnalytics && (
              <AnalyticsPanel 
                stations={stations}
                onClose={() => setShowAnalytics(false)}
              />
            )}
          </div>

          {/* Right Properties Panel */}
          <PropertiesPanel
            selectedStation={selectedStation}
            onUpdateStation={(updates) => {
              if (selectedStation) {
                handleUpdateStation(selectedStation.id, updates);
              }
            }}
            onDelete={() => {
              if (selectedStation) {
                handleDeleteStation(selectedStation.id);
              }
            }}
          />
        </div>
      </div>
    </DndProvider>
  );
}