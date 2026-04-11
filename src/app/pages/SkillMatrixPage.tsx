import { useState } from 'react';
import { Save, X, TrendingUp, Clock, Award, BookOpen, UserCheck, BarChart3, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SkillData {
  workerId: string;
  workerName: string;
  stationId: string;
  stationName: string;
  skillLevel: number;
  observedTime: number;
  standardTime: number;
  efficiency: number;
  trainingHours: number;
  supervisorEval: number;
}

interface Worker {
  id: string;
  name: string;
  position: string;
}

interface Station {
  id: string;
  name: string;
}

const workers: Worker[] = [
  { id: 'W001', name: 'Maria Santos', position: 'Assembly Operator' },
  { id: 'W002', name: 'Juan Dela Cruz', position: 'Senior Technician' },
  { id: 'W003', name: 'Ana Reyes', position: 'Quality Inspector' },
  { id: 'W004', name: 'Pedro Garcia', position: 'Machine Operator' },
  { id: 'W005', name: 'Lisa Tan', position: 'Assembly Operator' },
  { id: 'W006', name: 'Carlos Wong', position: 'Line Lead' },
];

const stations: Station[] = [
  { id: 'ST-01', name: 'Component Assembly' },
  { id: 'ST-02', name: 'Welding' },
  { id: 'ST-03', name: 'Quality Check' },
  { id: 'ST-04', name: 'Packaging' },
  { id: 'ST-05', name: 'Machine Setup' },
];

const initialSkillData: SkillData[] = [
  // Maria Santos
  { workerId: 'W001', workerName: 'Maria Santos', stationId: 'ST-01', stationName: 'Component Assembly', skillLevel: 5, observedTime: 42, standardTime: 45, efficiency: 107, trainingHours: 120, supervisorEval: 4.8 },
  { workerId: 'W001', workerName: 'Maria Santos', stationId: 'ST-02', stationName: 'Welding', skillLevel: 3, observedTime: 65, standardTime: 60, efficiency: 92, trainingHours: 40, supervisorEval: 3.5 },
  { workerId: 'W001', workerName: 'Maria Santos', stationId: 'ST-03', stationName: 'Quality Check', skillLevel: 4, observedTime: 28, standardTime: 30, efficiency: 107, trainingHours: 60, supervisorEval: 4.2 },
  { workerId: 'W001', workerName: 'Maria Santos', stationId: 'ST-04', stationName: 'Packaging', skillLevel: 5, observedTime: 22, standardTime: 25, efficiency: 114, trainingHours: 80, supervisorEval: 4.9 },
  { workerId: 'W001', workerName: 'Maria Santos', stationId: 'ST-05', stationName: 'Machine Setup', skillLevel: 2, observedTime: 55, standardTime: 40, efficiency: 73, trainingHours: 20, supervisorEval: 2.8 },
  
  // Juan Dela Cruz
  { workerId: 'W002', workerName: 'Juan Dela Cruz', stationId: 'ST-01', stationName: 'Component Assembly', skillLevel: 4, observedTime: 46, standardTime: 45, efficiency: 98, trainingHours: 100, supervisorEval: 4.0 },
  { workerId: 'W002', workerName: 'Juan Dela Cruz', stationId: 'ST-02', stationName: 'Welding', skillLevel: 5, observedTime: 55, standardTime: 60, efficiency: 109, trainingHours: 150, supervisorEval: 4.9 },
  { workerId: 'W002', workerName: 'Juan Dela Cruz', stationId: 'ST-03', stationName: 'Quality Check', skillLevel: 5, observedTime: 27, standardTime: 30, efficiency: 111, trainingHours: 90, supervisorEval: 4.7 },
  { workerId: 'W002', workerName: 'Juan Dela Cruz', stationId: 'ST-04', stationName: 'Packaging', skillLevel: 3, observedTime: 28, standardTime: 25, efficiency: 89, trainingHours: 30, supervisorEval: 3.2 },
  { workerId: 'W002', workerName: 'Juan Dela Cruz', stationId: 'ST-05', stationName: 'Machine Setup', skillLevel: 4, observedTime: 38, standardTime: 40, efficiency: 105, trainingHours: 70, supervisorEval: 4.3 },
  
  // Ana Reyes
  { workerId: 'W003', workerName: 'Ana Reyes', stationId: 'ST-01', stationName: 'Component Assembly', skillLevel: 3, observedTime: 48, standardTime: 45, efficiency: 94, trainingHours: 60, supervisorEval: 3.5 },
  { workerId: 'W003', workerName: 'Ana Reyes', stationId: 'ST-02', stationName: 'Welding', skillLevel: 2, observedTime: 70, standardTime: 60, efficiency: 86, trainingHours: 25, supervisorEval: 2.5 },
  { workerId: 'W003', workerName: 'Ana Reyes', stationId: 'ST-03', stationName: 'Quality Check', skillLevel: 5, observedTime: 26, standardTime: 30, efficiency: 115, trainingHours: 140, supervisorEval: 4.9 },
  { workerId: 'W003', workerName: 'Ana Reyes', stationId: 'ST-04', stationName: 'Packaging', skillLevel: 4, observedTime: 24, standardTime: 25, efficiency: 104, trainingHours: 50, supervisorEval: 4.1 },
  { workerId: 'W003', workerName: 'Ana Reyes', stationId: 'ST-05', stationName: 'Machine Setup', skillLevel: 3, observedTime: 42, standardTime: 40, efficiency: 95, trainingHours: 45, supervisorEval: 3.4 },
  
  // Pedro Garcia
  { workerId: 'W004', workerName: 'Pedro Garcia', stationId: 'ST-01', stationName: 'Component Assembly', skillLevel: 4, observedTime: 44, standardTime: 45, efficiency: 102, trainingHours: 80, supervisorEval: 4.1 },
  { workerId: 'W004', workerName: 'Pedro Garcia', stationId: 'ST-02', stationName: 'Welding', skillLevel: 4, observedTime: 58, standardTime: 60, efficiency: 103, trainingHours: 90, supervisorEval: 4.0 },
  { workerId: 'W004', workerName: 'Pedro Garcia', stationId: 'ST-03', stationName: 'Quality Check', skillLevel: 3, observedTime: 32, standardTime: 30, efficiency: 94, trainingHours: 40, supervisorEval: 3.3 },
  { workerId: 'W004', workerName: 'Pedro Garcia', stationId: 'ST-04', stationName: 'Packaging', skillLevel: 4, observedTime: 23, standardTime: 25, efficiency: 109, trainingHours: 65, supervisorEval: 4.2 },
  { workerId: 'W004', workerName: 'Pedro Garcia', stationId: 'ST-05', stationName: 'Machine Setup', skillLevel: 5, observedTime: 36, standardTime: 40, efficiency: 111, trainingHours: 130, supervisorEval: 4.8 },
  
  // Lisa Tan
  { workerId: 'W005', workerName: 'Lisa Tan', stationId: 'ST-01', stationName: 'Component Assembly', skillLevel: 5, observedTime: 41, standardTime: 45, efficiency: 110, trainingHours: 110, supervisorEval: 4.6 },
  { workerId: 'W005', workerName: 'Lisa Tan', stationId: 'ST-02', stationName: 'Welding', skillLevel: 3, observedTime: 62, standardTime: 60, efficiency: 97, trainingHours: 50, supervisorEval: 3.6 },
  { workerId: 'W005', workerName: 'Lisa Tan', stationId: 'ST-03', stationName: 'Quality Check', skillLevel: 4, observedTime: 29, standardTime: 30, efficiency: 103, trainingHours: 70, supervisorEval: 4.0 },
  { workerId: 'W005', workerName: 'Lisa Tan', stationId: 'ST-04', stationName: 'Packaging', skillLevel: 5, observedTime: 21, standardTime: 25, efficiency: 119, trainingHours: 95, supervisorEval: 4.8 },
  { workerId: 'W005', workerName: 'Lisa Tan', stationId: 'ST-05', stationName: 'Machine Setup', skillLevel: 2, observedTime: 50, standardTime: 40, efficiency: 80, trainingHours: 15, supervisorEval: 2.5 },
  
  // Carlos Wong
  { workerId: 'W006', workerName: 'Carlos Wong', stationId: 'ST-01', stationName: 'Component Assembly', skillLevel: 4, observedTime: 43, standardTime: 45, efficiency: 105, trainingHours: 90, supervisorEval: 4.2 },
  { workerId: 'W006', workerName: 'Carlos Wong', stationId: 'ST-02', stationName: 'Welding', skillLevel: 5, observedTime: 56, standardTime: 60, efficiency: 107, trainingHours: 125, supervisorEval: 4.7 },
  { workerId: 'W006', workerName: 'Carlos Wong', stationId: 'ST-03', stationName: 'Quality Check', skillLevel: 4, observedTime: 28, standardTime: 30, efficiency: 107, trainingHours: 75, supervisorEval: 4.3 },
  { workerId: 'W006', workerName: 'Carlos Wong', stationId: 'ST-04', stationName: 'Packaging', skillLevel: 3, observedTime: 27, standardTime: 25, efficiency: 93, trainingHours: 35, supervisorEval: 3.4 },
  { workerId: 'W006', workerName: 'Carlos Wong', stationId: 'ST-05', stationName: 'Machine Setup', skillLevel: 5, observedTime: 37, standardTime: 40, efficiency: 108, trainingHours: 140, supervisorEval: 4.8 },
];

export default function SkillMatrixPage() {
  const [skillData, setSkillData] = useState<SkillData[]>(initialSkillData);
  const [selectedCell, setSelectedCell] = useState<SkillData | null>(null);
  const [editingCell, setEditingCell] = useState<{ workerId: string; stationId: string } | null>(null);

  const getSkillLevel = (workerId: string, stationId: string): number => {
    const data = skillData.find(d => d.workerId === workerId && d.stationId === stationId);
    return data?.skillLevel || 0;
  };

  const handleCellClick = (workerId: string, stationId: string) => {
    const data = skillData.find(d => d.workerId === workerId && d.stationId === stationId);
    if (data) {
      setSelectedCell(data);
    }
  };

  const handleSkillLevelChange = (workerId: string, stationId: string, value: number) => {
    const newValue = Math.max(1, Math.min(5, value));
    setSkillData(skillData.map(d => 
      d.workerId === workerId && d.stationId === stationId 
        ? { ...d, skillLevel: newValue }
        : d
    ));
    
    // Update selected cell if it's the one being edited
    if (selectedCell?.workerId === workerId && selectedCell?.stationId === stationId) {
      setSelectedCell({ ...selectedCell, skillLevel: newValue });
    }
  };

  const handleSave = () => {
    console.log('Saving skill matrix data:', skillData);
    alert('Skill matrix data saved successfully!');
  };

  const getCellColor = (level: number): string => {
    if (level === 5) return 'bg-green-500';
    if (level === 4) return 'bg-blue-500';
    if (level === 3) return 'bg-yellow-500';
    if (level === 2) return 'bg-orange-500';
    if (level === 1) return 'bg-red-500';
    return 'bg-gray-200';
  };

  // Calculate worker average
  const getWorkerAverage = (workerId: string): number => {
    const workerSkills = skillData.filter(d => d.workerId === workerId);
    const avg = workerSkills.reduce((sum, d) => sum + d.skillLevel, 0) / workerSkills.length;
    return Math.round(avg * 10) / 10;
  };

  // Calculate station average
  const getStationAverage = (stationId: string): number => {
    const stationSkills = skillData.filter(d => d.stationId === stationId);
    const avg = stationSkills.reduce((sum, d) => sum + d.skillLevel, 0) / stationSkills.length;
    return Math.round(avg * 10) / 10;
  };

  // Prepare radar chart data for selected worker
  const getRadarData = (workerId: string) => {
    return skillData
      .filter(d => d.workerId === workerId)
      .map(d => ({
        station: d.stationName,
        skill: d.skillLevel,
      }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Skill Matrix Analysis</h2>
          <p className="text-gray-600 mt-1">Worker capabilities across workstations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
          <Link
            to="/takt-time"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Next: Takt Time
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Workflow Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">How This Fits the Workflow</h4>
            <p className="text-sm text-blue-800">
              Based on workforce availability and menu requirements from daily setup, this skill matrix shows
              each worker's proficiency at different workstations. Higher skill levels (4-5) indicate workers
              who can handle complex tasks efficiently. This data guides optimal station assignments in the
              next steps.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={`grid gap-6 ${selectedCell ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {/* Skill Matrix Table */}
        <div className={selectedCell ? 'col-span-2' : 'col-span-1'}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase sticky left-0 bg-gray-50 z-10">
                      Worker
                    </th>
                    {stations.map((station) => (
                      <th key={station.id} className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                        {station.name}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                      Avg
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 sticky left-0 bg-white z-10">
                        <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                        <div className="text-xs text-gray-500">{worker.position}</div>
                      </td>
                      {stations.map((station) => {
                        const level = getSkillLevel(worker.id, station.id);
                        const isEditing = editingCell?.workerId === worker.id && editingCell?.stationId === station.id;
                        const isSelected = selectedCell?.workerId === worker.id && selectedCell?.stationId === station.id;
                        
                        return (
                          <td
                            key={`${worker.id}-${station.id}`}
                            className={`px-4 py-3 text-center cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                            onClick={() => handleCellClick(worker.id, station.id)}
                            onDoubleClick={() => setEditingCell({ workerId: worker.id, stationId: station.id })}
                          >
                            {isEditing ? (
                              <input
                                type="number"
                                min="1"
                                max="5"
                                value={level}
                                onChange={(e) => handleSkillLevelChange(worker.id, station.id, Number(e.target.value))}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') setEditingCell(null);
                                }}
                                autoFocus
                                className="w-16 px-2 py-1 text-center border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="flex items-center justify-center">
                                <div className={`w-10 h-10 rounded-lg ${getCellColor(level)} text-white font-semibold flex items-center justify-center text-sm`}>
                                  {level}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {getWorkerAverage(worker.id)}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Station Averages Row */}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-3 text-sm text-gray-900 sticky left-0 bg-gray-50 z-10">
                      Station Avg
                    </td>
                    {stations.map((station) => (
                      <td key={station.id} className="px-4 py-3 text-center text-sm text-gray-900">
                        {getStationAverage(station.id)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center text-sm text-blue-600">
                      {(skillData.reduce((sum, d) => sum + d.skillLevel, 0) / skillData.length).toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-700">Skill Level:</span>
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded ${getCellColor(level)}`}></div>
                  <span className="text-sm text-gray-600">{level} - {
                    level === 5 ? 'Expert' :
                    level === 4 ? 'Advanced' :
                    level === 3 ? 'Competent' :
                    level === 2 ? 'Beginner' :
                    'Novice'
                  }</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Double-click a cell to edit | Click a cell to view details
            </div>
          </div>
        </div>

        {/* Side Panel - Supporting Data */}
        {selectedCell && (
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Supporting Data</h3>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{selectedCell.workerName}</div>
                  <div className="text-xs text-gray-600">{selectedCell.stationName}</div>
                </div>

                {/* Skill Level Display */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Current Skill Level</div>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${getCellColor(selectedCell.skillLevel)} text-white font-bold flex items-center justify-center text-xl`}>
                      {selectedCell.skillLevel}
                    </div>
                    <div className="text-sm text-gray-700">
                      {selectedCell.skillLevel === 5 ? 'Expert' :
                       selectedCell.skillLevel === 4 ? 'Advanced' :
                       selectedCell.skillLevel === 3 ? 'Competent' :
                       selectedCell.skillLevel === 2 ? 'Beginner' :
                       'Novice'}
                    </div>
                  </div>
                </div>

                {/* Observed vs Standard Time */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600">Observed Time</div>
                      <div className="text-lg font-semibold text-blue-600">{selectedCell.observedTime}s</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-600">Standard Time</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedCell.standardTime}s</div>
                    </div>
                  </div>
                </div>

                {/* Efficiency */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="text-sm font-medium text-gray-700">Efficiency</div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{selectedCell.efficiency}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min(selectedCell.efficiency, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Training Hours */}
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Training Hours</div>
                    <div className="text-lg font-semibold text-purple-600">{selectedCell.trainingHours}h</div>
                  </div>
                </div>

                {/* Supervisor Evaluation */}
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Supervisor Evaluation</div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-semibold text-yellow-600">{selectedCell.supervisorEval}</div>
                      <div className="text-xs text-gray-600">/ 5.0</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-yellow-500 h-1.5 rounded-full"
                        style={{ width: `${(selectedCell.supervisorEval / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Worker Skill Radar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Worker Skill Profile</h3>
          </div>
          <div className="mb-4">
            <select
              onChange={(e) => {
                const worker = workers.find(w => w.id === e.target.value);
                if (worker) {
                  const firstSkill = skillData.find(d => d.workerId === worker.id);
                  if (firstSkill) setSelectedCell(firstSkill);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={getRadarData(selectedCell?.workerId || workers[0].id)}>
              <PolarGrid stroke="#E5E7EB" key="polar-grid-skill" />
              <PolarAngleAxis dataKey="station" tick={{ fill: '#6B7280', fontSize: 11 }} key="polar-angle-skill" />
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#6B7280', fontSize: 10 }} key="polar-radius-skill" />
              <Radar name="Skill Level" dataKey="skill" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} key="radar-skill" />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Station Skill Heatmap */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Station Skill Heatmap</h3>
          </div>
          <div className="space-y-3">
            {stations.map((station) => {
              const avg = getStationAverage(station.id);
              const workers = skillData.filter(d => d.stationId === station.id);
              
              return (
                <div key={station.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{station.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{avg}</span>
                  </div>
                  <div className="flex gap-1">
                    {workers.map((w) => (
                      <div
                        key={w.workerId}
                        className={`flex-1 h-8 rounded ${getCellColor(w.skillLevel)} cursor-pointer hover:opacity-80 transition-opacity`}
                        title={`${w.workerName}: Level ${w.skillLevel}`}
                        onClick={() => setSelectedCell(w)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Each bar represents a worker's skill level at this station</div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Lowest Coverage</span>
              <span>Highest Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}