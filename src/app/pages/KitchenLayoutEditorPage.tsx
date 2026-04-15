import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Save, Undo, Redo, Trash2, Copy, Download,
  ZoomIn, ZoomOut, Move, RotateCw, Maximize2, Activity, Hand
} from 'lucide-react';
import { toast } from 'sonner'; 
import { useWorkstations } from '../components/WorkstationContext'; 
import { useWorkforce } from '../components/WorkforceState';

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

export default function KitchenLayoutEditorPage() {
  const { workstations, setWorkstations } = useWorkstations();
  const { workers } = useWorkforce();

  const [stations, setStations] = useState<StationItem[]>([]);
  const [selectedStation, setSelectedStation] = useState<StationItem | null>(null);
  const [tool, setTool] = useState<'select' | 'move' | 'rotate' | 'connect' | 'pan'>('select');
  const [zoom, setZoom] = useState(100);
  const [showAnalytics, setShowAnalytics] = useState(true);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || tool === 'pan') {
      e.preventDefault();
      setIsDraggingMap(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingMap) {
      setPan(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleCanvasMouseUp = () => setIsDraggingMap(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) {
      setPan(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  // Maps existing Global Workstations to the canvas on load
  useEffect(() => {
    if (workstations.length > 0 && stations.length === 0) {
      const mappedStations: StationItem[] = workstations.map((ws, index) => ({
        id: ws.id,
        type: ws.stationType, 
        name: ws.stationName,
        x: 100 + (index * 160), 
        y: 100 + ((index % 2) * 120),
        width: 100,
        height: 100,
        rotation: 0,
        color: ws.stationType.includes('Back') ? '#EF4444' : ws.stationType.includes('Front') ? '#3B82F6' : '#8B5CF6',
        worker: workers.find(w => w.station === ws.id)?.name || 'Unassigned',
        cycleTime: ws.tasks.reduce((sum, t) => sum + t.avgTime, 0),
        connections: [] 
      }));
      setStations(mappedStations);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workstations]); 

  // CHANGED: Now accepts the exact global station object from the sidebar
  const handleAddStation = (globalWs: any) => {
    const newStation: StationItem = {
      id: globalWs.id,
      type: globalWs.stationType,
      name: globalWs.stationName,
      x: Math.abs(pan.x) + 100, 
      y: Math.abs(pan.y) + 100,
      width: 100,
      height: 100,
      rotation: 0,
      color: globalWs.stationType.includes('Back') ? '#EF4444' : globalWs.stationType.includes('Front') ? '#3B82F6' : '#8B5CF6',
      worker: workers.find(w => w.station === globalWs.id)?.name || 'Unassigned',
      cycleTime: globalWs.tasks.reduce((sum: any, t: any) => sum + t.avgTime, 0),
      connections: [],
    };
    setStations([...stations, newStation]);
    setSelectedStation(newStation);
  };

  const handleUpdateStation = (id: string, updates: Partial<StationItem>) => {
    setStations(stations.map(s => s.id === id ? { ...s, ...updates } : s));
    if (selectedStation?.id === id) setSelectedStation({ ...selectedStation, ...updates });
  };

  const handleDeleteStation = (id: string) => {
    setStations(stations.filter(s => s.id !== id));
    if (selectedStation?.id === id) setSelectedStation(null);
  };

  const handleDuplicateStation = () => {
    if (selectedStation) {
      const newStation = {
        ...selectedStation,
        id: `ST-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, // Duplicates get a new ID so they don't break the global link
        x: selectedStation.x + 20,
        y: selectedStation.y + 20,
      };
      setStations([...stations, newStation]);
      setSelectedStation(newStation);
    }
  };

  // CHANGED: Safer save logic that preserves unplaced stations
  const handleSave = () => {
    // 1. Find duplicated stations that aren't in the global DB yet and add them
    const newStationsToPush = stations
      .filter(s => !workstations.find(w => w.id === s.id))
      .map(localWs => ({
        id: localWs.id,
        stationName: localWs.name,
        stationType: localWs.type || 'Back of House', 
        capacity: 1, 
        notes: 'Duplicated from Visual Editor',
        tasks: [] 
      }));

    // 2. Update names of existing ones, but leave unplaced ones alone!
    const updatedGlobal = workstations.map(globalWs => {
      const localWs = stations.find(s => s.id === globalWs.id);
      if (localWs) {
        return { ...globalWs, stationName: localWs.name };
      }
      return globalWs; // Preserves unplaced stations
    });

    setWorkstations([...updatedGlobal, ...newStationsToPush]);
    toast.success('Physical layout synchronized with the global system!');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">Kitchen Layout Editor</h2>
                <p className="text-xs text-gray-500">Design physical workflow to minimize travel waste</p>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-1.5">
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm">
                  <Save className="w-4 h-4" /> Save & Sync
                </button>
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Undo"><Undo className="w-4 h-4 text-gray-600" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Redo"><Redo className="w-4 h-4 text-gray-600" /></button>
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                <button onClick={handleDuplicateStation} disabled={!selectedStation} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" title="Duplicate">
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => selectedStation && handleDeleteStation(selectedStation.id)} disabled={!selectedStation} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200">
                <button onClick={() => setTool('select')} className={`p-1.5 rounded ${tool === 'select' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-200'} transition-colors`} title="Select / Move">
                  <Move className="w-4 h-4" />
                </button>
                <button onClick={() => setTool('rotate')} className={`p-1.5 rounded ${tool === 'rotate' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-200'} transition-colors`} title="Rotate">
                  <RotateCw className="w-4 h-4" />
                </button>
                <button onClick={() => setTool('move')} className={`p-1.5 rounded ${tool === 'move' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-200'} transition-colors`} title="Resize">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                <button onClick={() => setTool('pan')} className={`p-1.5 rounded ${tool === 'pan' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-200'} transition-colors`} title="Pan Map">
                  <Hand className="w-4 h-4" />
                </button>
              </div>

              <div className="h-6 w-px bg-gray-200"></div>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600"><ZoomOut className="w-4 h-4" /></button>
                <button onClick={() => { setZoom(100); setPan({ x: 0, y: 0 }); }} className="text-xs font-semibold text-gray-700 w-10 text-center hover:bg-white hover:shadow-sm rounded py-1 cursor-pointer transition-all" title="Reset View">
                  {zoom}%
                </button>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600"><ZoomIn className="w-4 h-4" /></button>
              </div>

              <div className="h-6 w-px bg-gray-200"></div>

              <button onClick={() => setShowAnalytics(!showAnalytics)} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border ${showAnalytics ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                <Activity className="w-4 h-4" /> Flow Analytics
              </button>
              
              <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" title="Export Layout">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* CHANGED: Passing placed station IDs so the sidebar can grey them out! */}
          <ComponentLibrary 
            onAddStation={handleAddStation} 
            placedStationIds={stations.map(s => s.id)} 
          />

          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div 
              className={`flex-1 relative overflow-hidden ${tool === 'pan' || isDraggingMap ? 'cursor-grab active:cursor-grabbing' : ''}`}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onWheel={handleWheel}
            >
              <div className="absolute inset-0 w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px)`, transition: isDraggingMap ? 'none' : 'transform 0.05s linear' }}>
                <LayoutCanvas
                  stations={stations}
                  selectedStation={selectedStation}
                  zoom={zoom}
                  tool={tool}
                  onSelectStation={setSelectedStation}
                  onUpdateStation={handleUpdateStation}
                />
              </div>
            </div>

            {showAnalytics && <AnalyticsPanel stations={stations} onClose={() => setShowAnalytics(false)} />}
          </div>

          {selectedStation && (
            <PropertiesPanel
              selectedStation={selectedStation}
              onUpdateStation={(updates) => {
                if (selectedStation) handleUpdateStation(selectedStation.id, updates);
              }}
              onDelete={() => {
                if (selectedStation) handleDeleteStation(selectedStation.id);
              }}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}