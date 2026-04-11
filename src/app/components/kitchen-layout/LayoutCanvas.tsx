import { useRef, useState } from 'react';
import { StationItem } from '../../pages/KitchenLayoutEditorPage';
import { ArrowRight } from 'lucide-react';

interface LayoutCanvasProps {
  stations: StationItem[];
  selectedStation: StationItem | null;
  zoom: number;
  tool: 'select' | 'move' | 'rotate' | 'connect';
  onSelectStation: (station: StationItem | null) => void;
  onUpdateStation: (id: string, updates: Partial<StationItem>) => void;
}

export default function LayoutCanvas({
  stations,
  selectedStation,
  zoom,
  tool,
  onSelectStation,
  onUpdateStation,
}: LayoutCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingStation, setDraggingStation] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, station: StationItem) => {
    if (tool === 'select' || tool === 'move') {
      e.stopPropagation();
      onSelectStation(station);
      setDraggingStation(station.id);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingStation && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - dragOffset.x) / (zoom / 100);
      const y = (e.clientY - rect.top - dragOffset.y) / (zoom / 100);
      onUpdateStation(draggingStation, { x: Math.max(0, x), y: Math.max(0, y) });
    }
  };

  const handleMouseUp = () => {
    setDraggingStation(null);
  };

  const handleRotate = (station: StationItem) => {
    if (tool === 'rotate') {
      onUpdateStation(station.id, { rotation: (station.rotation + 45) % 360 });
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectStation(null);
    }
  };

  // Draw grid
  const gridSize = 20;
  const gridLines = [];
  for (let i = 0; i < 50; i++) {
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={i * gridSize}
        y1="0"
        x2={i * gridSize}
        y2="1000"
        stroke="#E5E7EB"
        strokeWidth="1"
      />
    );
    gridLines.push(
      <line
        key={`h-${i}`}
        x1="0"
        y1={i * gridSize}
        x2="1000"
        y2={i * gridSize}
        stroke="#E5E7EB"
        strokeWidth="1"
      />
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-4">
      <div
        ref={canvasRef}
        className="relative bg-white rounded-lg shadow-inner"
        style={{
          width: `${1000 * (zoom / 100)}px`,
          height: `${800 * (zoom / 100)}px`,
          transform: `scale(${zoom / 100})`,
          transformOrigin: '0 0',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Grid Background */}
        <svg className="absolute inset-0 pointer-events-none" width="1000" height="800">
          {gridLines}
        </svg>

        {/* Stations */}
        {stations.map((station) => {
          const isSelected = selectedStation?.id === station.id;
          
          return (
            <div key={station.id}>
              {/* Station Box */}
              <div
                className={`absolute cursor-move rounded-lg border-2 transition-all ${
                  isSelected ? 'border-blue-500 shadow-lg ring-4 ring-blue-200' : 'border-gray-300 hover:border-blue-400'
                }`}
                style={{
                  left: `${station.x}px`,
                  top: `${station.y}px`,
                  width: `${station.width}px`,
                  height: `${station.height}px`,
                  backgroundColor: `${station.color}20`,
                  transform: `rotate(${station.rotation}deg)`,
                }}
                onMouseDown={(e) => handleMouseDown(e, station)}
                onClick={() => {
                  if (tool === 'rotate') {
                    handleRotate(station);
                  }
                }}
              >
                <div className="h-full flex flex-col items-center justify-center p-2">
                  <div 
                    className="w-8 h-8 rounded-full mb-1 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: station.color }}
                  >
                    {station.type.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xs font-semibold text-gray-900 text-center truncate w-full">
                    {station.name}
                  </div>
                  {station.taskType && (
                    <div className="text-xs text-gray-600 text-center truncate w-full bg-white bg-opacity-70 px-1 rounded mt-1">
                      {station.taskType}
                    </div>
                  )}
                  {station.worker && (
                    <div className="text-xs text-gray-600 text-center truncate w-full">
                      {station.worker}
                    </div>
                  )}
                </div>

                {/* Resize Handles */}
                {isSelected && (
                  <>
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize"></div>
                  </>
                )}
              </div>

              {/* Workflow Connections */}
              {station.connections?.map((targetId, idx) => {
                const target = stations.find(s => s.id === targetId);
                if (!target) return null;

                const startX = station.x + station.width / 2;
                const startY = station.y + station.height / 2;
                const endX = target.x + target.width / 2;
                const endY = target.y + target.height / 2;

                return (
                  <svg
                    key={`connection-${station.id}-${targetId}-${idx}`}
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '1000px', height: '800px' }}
                  >
                    <defs>
                      <marker
                        id={`arrowhead-${station.id}-${idx}`}
                        markerWidth="10"
                        markerHeight="10"
                        refX="8"
                        refY="3"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
                      </marker>
                    </defs>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      markerEnd={`url(#arrowhead-${station.id}-${idx})`}
                    />
                  </svg>
                );
              })}
            </div>
          );
        })}

        {/* Info overlay when no stations */}
        {stations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-lg font-medium mb-2">Empty Canvas</div>
              <div className="text-sm">Click components from the left panel to start designing</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}