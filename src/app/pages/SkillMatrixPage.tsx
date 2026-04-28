import { useState, useEffect } from 'react';
import { Save, X, TrendingUp, Clock, Award, BookOpen, UserCheck, BarChart3, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useSkills } from '../components/SkillContext';
import { useWorkforce } from '../components/WorkforceState';
import { useWorkstations } from '../components/WorkstationContext';
import { toast } from 'sonner';

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

export default function SkillMatrixPage() {
  const { globalSkills, updateGlobalSkills } = useSkills();
  const { workers } = useWorkforce();
  const { workstations } = useWorkstations();

  const [skillData, setSkillData] = useState<SkillData[]>([]);
  const [selectedCell, setSelectedCell] = useState<SkillData | null>(null);
  const [editingCell, setEditingCell] = useState<{ workerId: string; stationId: string } | null>(null);

  // 1. GENERATE SKILL MATRIX DYNAMICALLY
  useEffect(() => {
    if ((workers || []).length > 0 && (workstations || []).length > 0) {
      const generatedData: SkillData[] = [];
      
      workers.forEach(worker => {
        const savedProfile = (globalSkills || []).find(s => s.worker === worker.name);

        workstations.forEach(station => {
          const specificSkill = savedProfile?.skills?.[station.id];
          const finalSkill = specificSkill !== undefined ? specificSkill : (worker.skillLevel || 1);
          
          const standardTime = station.tasks?.reduce((sum, t) => sum + (t.avgTime || 0), 0) || 50;
          const observedTime = finalSkill >= 4 ? standardTime * 0.8 : (finalSkill <= 2 ? standardTime * 1.3 : standardTime);
          const efficiency = Math.round((standardTime / observedTime) * 100);

          generatedData.push({
            workerId: worker.id,
            workerName: worker.name,
            stationId: station.id,
            stationName: station.stationName || 'Unknown',
            skillLevel: finalSkill,
            observedTime: Math.round(observedTime),
            standardTime: Math.round(standardTime),
            efficiency,
            trainingHours: finalSkill * 20,
            supervisorEval: finalSkill === 5 ? 4.8 : finalSkill === 4 ? 4.2 : finalSkill === 3 ? 3.5 : 2.5
          });
        });
      });
      setSkillData(generatedData);
    }
  }, [workers, workstations, globalSkills]); 

  const getSkillLevel = (workerId: string, stationId: string): number => {
    const data = skillData.find(d => d.workerId === workerId && d.stationId === stationId);
    return data?.skillLevel || 0; // Returns 0 if temporarily cleared by user
  };

  const handleCellClick = (workerId: string, stationId: string) => {
    const data = skillData.find(d => d.workerId === workerId && d.stationId === stationId);
    if (data) setSelectedCell(data);
  };

  const handleSkillLevelChange = (workerId: string, stationId: string, value: number) => {
    // Allow 0 temporarily while typing (empty string evaluates to 0)
    const newValue = value === 0 ? 0 : Math.max(1, Math.min(5, value));
    
    setSkillData(skillData.map(d => 
      d.workerId === workerId && d.stationId === stationId 
        ? { ...d, skillLevel: newValue }
        : d
    ));
    
    if (selectedCell?.workerId === workerId && selectedCell?.stationId === stationId) {
      setSelectedCell({ ...selectedCell, skillLevel: newValue });
    }
  };

  // 2. SAVE BACK TO GLOBAL CONTEXT
  const handleSave = () => {
    const formattedData = (workers || []).map(worker => {
      const workerSkills: Record<string, number> = {};
      (workstations || []).forEach(station => {
        let lvl = getSkillLevel(worker.id, station.id);
        if (lvl === 0) lvl = 1; // Fallback to 1 if left empty
        workerSkills[station.id] = lvl;
      });
      return { worker: worker.name, skills: workerSkills };
    });

    updateGlobalSkills(formattedData);
    toast.success('Skill matrix synchronized successfully! The Auto-Assigner will now use these values.');
  };

  const getCellColor = (level: number): string => {
    if (level === 5) return 'bg-green-500';
    if (level === 4) return 'bg-blue-500';
    if (level === 3) return 'bg-yellow-500';
    if (level === 2) return 'bg-orange-500';
    if (level === 1) return 'bg-red-500';
    return 'bg-gray-200'; // Gray for empty/typing state
  };

  const getWorkerAverage = (workerId: string): number => {
    const workerSkills = skillData.filter(d => d.workerId === workerId);
    if (workerSkills.length === 0) return 0;
    const avg = workerSkills.reduce((sum, d) => sum + (d.skillLevel === 0 ? 1 : d.skillLevel), 0) / workerSkills.length;
    return Math.round(avg * 10) / 10;
  };

  const getStationAverage = (stationId: string): number => {
    const stationSkills = skillData.filter(d => d.stationId === stationId);
    if (stationSkills.length === 0) return 0;
    const avg = stationSkills.reduce((sum, d) => sum + (d.skillLevel === 0 ? 1 : d.skillLevel), 0) / stationSkills.length;
    return Math.round(avg * 10) / 10;
  };

  const getRadarData = (workerId: string) => {
    return skillData
      .filter(d => d.workerId === workerId)
      .map(d => ({
        station: d.stationName ? d.stationName.split(' ')[0] : 'ST',
        skill: d.skillLevel === 0 ? 1 : d.skillLevel,
      }));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Detailed Skill Matrix</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Granular worker capabilities across specific workstations</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleSave}
            disabled={(workers || []).length === 0}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Save Skills Globally
          </button>
          <Link
            to="/takt-time"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Next: Takt Time
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {(workers || []).length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">No Roster Loaded</h4>
            <p className="text-sm text-yellow-800 mt-1">
              There are no workers in the system to analyze. Please go back to the Workforce Management page and add workers.
            </p>
          </div>
        </div>
      )}

      {(workers || []).length > 0 && (workstations || []).length > 0 && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 hidden sm:block" />
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <Info className="w-5 h-5 text-blue-600 sm:hidden" />
                  <h4 className="font-semibold text-blue-900">How This Fits the Workflow</h4>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  This matrix automatically pulls your <strong>entire workforce roster</strong> (not just present workers) and maps them against your active workstations. Double-click any cell to fine-tune a worker's specific skill at a specific station before running the Auto-Assign algorithm.
                </p>
              </div>
            </div>
          </div>

          <div className={`grid gap-6 ${selectedCell ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
            <div className={selectedCell ? 'col-span-1 lg:col-span-2' : 'col-span-1'}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase sticky left-0 bg-gray-50 z-10 shadow-[1px_0_0_0_#e5e7eb]">
                          Worker
                        </th>
                        {workstations.map((station) => (
                          <th key={station.id} className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase max-w-[100px] whitespace-normal">
                            {station.stationName}
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
                          <td className="px-4 py-3 sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#e5e7eb]">
                            <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500">{worker.position}</div>
                          </td>
                          {workstations.map((station) => {
                            const level = getSkillLevel(worker.id, station.id);
                            const isEditing = editingCell?.workerId === worker.id && editingCell?.stationId === station.id;
                            const isSelected = selectedCell?.workerId === worker.id && selectedCell?.stationId === station.id;
                            
                            return (
                              <td
                                key={`${worker.id}-${station.id}`}
                                className={`px-2 py-3 text-center cursor-pointer ${isSelected ? 'bg-blue-50 ring-inset ring-2 ring-blue-500' : ''}`}
                                onClick={() => handleCellClick(worker.id, station.id)}
                                onDoubleClick={() => setEditingCell({ workerId: worker.id, stationId: station.id })}
                              >
                                {isEditing ? (
                                  <div className="flex justify-center">
                                    <input
                                      type="number"
                                      min="1"
                                      max="5"
                                      value={level === 0 ? '' : level} // UX Fix: Allows empty string visually while typing
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        handleSkillLevelChange(worker.id, station.id, val === '' ? 0 : Number(val));
                                      }}
                                      onBlur={() => {
                                        if (level === 0) handleSkillLevelChange(worker.id, station.id, 1); // Clamp empty to 1
                                        setEditingCell(null);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          if (level === 0) handleSkillLevelChange(worker.id, station.id, 1);
                                          setEditingCell(null);
                                        }
                                      }}
                                      autoFocus
                                      className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${getCellColor(level)} text-white font-semibold flex items-center justify-center text-xs sm:text-sm shadow-sm`}>
                                      {level === 0 ? '-' : level}
                                    </div>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-center bg-gray-50/50">
                            <div className="text-sm font-semibold text-gray-900">
                              {getWorkerAverage(worker.id)}
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
                        <td className="px-4 py-3 text-sm text-gray-900 sticky left-0 bg-gray-50 z-10 shadow-[1px_0_0_0_#e5e7eb]">
                          Station Avg
                        </td>
                        {workstations.map((station) => (
                          <td key={station.id} className="px-2 py-3 text-center text-sm text-gray-900">
                            {getStationAverage(station.id)}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center text-sm text-blue-600 font-bold bg-blue-50">
                          {skillData.length > 0 ? (skillData.reduce((sum, d) => sum + (d.skillLevel === 0 ? 1 : d.skillLevel), 0) / skillData.length).toFixed(1) : 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <span className="text-sm font-medium text-gray-700">Skill Level:</span>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} className="flex items-center gap-1.5 sm:gap-2">
                      <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded shadow-sm ${getCellColor(level)}`}></div>
                      <span className="text-xs sm:text-sm text-gray-600">{level} - {
                        level === 5 ? 'Expert' :
                        level === 4 ? 'Advanced' :
                        level === 3 ? 'Competent' :
                        level === 2 ? 'Beginner' :
                        'Novice'
                      }</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                  Double-click a cell to edit | Click a cell to view details
                </div>
              </div>
            </div>

            {selectedCell && (
              <div className="col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:sticky lg:top-24">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg">
                    <h3 className="font-semibold text-gray-900">Supporting Data</h3>
                    <button
                      onClick={() => setSelectedCell(null)}
                      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="pb-3 border-b border-gray-100">
                      <div className="text-base font-bold text-gray-900 mb-0.5">{selectedCell.workerName}</div>
                      <div className="text-sm font-medium text-blue-600">{selectedCell.stationName}</div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Current Skill Level</div>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg shadow-md ${getCellColor(selectedCell.skillLevel === 0 ? 1 : selectedCell.skillLevel)} text-white font-bold flex items-center justify-center text-xl`}>
                          {selectedCell.skillLevel === 0 ? 1 : selectedCell.skillLevel}
                        </div>
                        <div className="text-base font-semibold text-gray-700">
                          {selectedCell.skillLevel === 5 ? 'Expert' :
                          selectedCell.skillLevel === 4 ? 'Advanced' :
                          selectedCell.skillLevel === 3 ? 'Competent' :
                          selectedCell.skillLevel === 2 ? 'Beginner' :
                          'Novice'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 flex justify-between items-center">
                          <div className="text-sm font-medium text-gray-700">Estimated Time</div>
                          <div className="text-lg font-bold text-blue-700">{selectedCell.observedTime}s</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 flex justify-between items-center">
                          <div className="text-sm font-medium text-gray-600">Standard Time</div>
                          <div className="text-lg font-bold text-gray-700">{selectedCell.standardTime}s</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <div className="text-sm font-bold text-green-900">Efficiency Rate</div>
                        </div>
                        <div className="text-xl font-black text-green-700">{selectedCell.efficiency}%</div>
                      </div>
                      <div className="w-full bg-green-200/50 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(selectedCell.efficiency, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Worker Profile</h3>
                </div>
                <select
                  onChange={(e) => {
                    const worker = workers.find(w => w.id === e.target.value);
                    if (worker) {
                      const firstSkill = skillData.find(d => d.workerId === worker.id);
                      if (firstSkill) setSelectedCell(firstSkill);
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto bg-gray-50"
                >
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData(selectedCell?.workerId || (workers || [])[0]?.id)}>
                    <PolarGrid stroke="#E5E7EB" key="polar-grid-skill" />
                    <PolarAngleAxis dataKey="station" tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 600 }} key="polar-angle-skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#9CA3AF', fontSize: 10 }} key="polar-radius-skill" />
                    <Radar name="Skill Level" dataKey="skill" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.5} key="radar-skill" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Station Heatmap</h3>
              </div>
              <div className="space-y-4 flex-1">
                {workstations.map((station) => {
                  const avg = getStationAverage(station.id);
                  const workersData = skillData.filter(d => d.stationId === station.id);
                  
                  return (
                    <div key={station.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2">{station.stationName}</span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{avg} Avg</span>
                      </div>
                      <div className="flex gap-1 h-6 sm:h-8">
                        {workersData.map((w) => (
                          <div
                            key={w.workerId}
                            className={`flex-1 rounded-sm shadow-sm ${getCellColor(w.skillLevel === 0 ? 1 : w.skillLevel)} cursor-pointer hover:opacity-80 transition-opacity`}
                            title={`${w.workerName}: Level ${w.skillLevel === 0 ? 1 : w.skillLevel}`}
                            onClick={() => setSelectedCell(w)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}