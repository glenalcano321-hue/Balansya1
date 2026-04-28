import { useState, useEffect } from 'react';
import { Play, User, Clock, ListChecks, ChevronRight, CheckCircle, Star, Save, Calendar, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router';
import { useSkills } from '../components/SkillContext'; 
import { useWorkstations } from '../components/WorkstationContext'; 
import { useWorkforce } from '../components/WorkforceState'; 
import { useDemand } from '../components/DemandContext'; // Imported Demand Context
import { toast } from 'sonner';

interface AssignedWorker {
  name: string;
  skill: number;
}

interface Assignment {
  stationId: string;
  stationName: string;
  workers: AssignedWorker[]; 
  tasks: string[];
  cycleTime: number;
  utilization: number;
  capacity: number; 
}

export default function StationAssignmentPage() {
  const { globalSkills } = useSkills(); 
  const { workstations } = useWorkstations(); 
  const { workers, setWorkers, targetDate, setTargetDate, saveWorkforceToFirebase } = useWorkforce();
  
  // Fetch live demand data
  const { demandData } = useDemand();
  const liveDemand = demandData?.adjustedDemand || 0;
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Safely filter workers
  const activeWorkers = (workers || []).filter(w => w?.status === 'present');

  useEffect(() => {
    if (workstations && workers) {
      setAssignments(workstations.map(ws => {
        const assignedWorkers = workers.filter(w => w.station === ws.id && w.status === 'present');
        
        let cycleTime = 0;
        let utilization = 0;
        
        const workersData: AssignedWorker[] = assignedWorkers.map(w => {
          const specificSkill = globalSkills?.find(s => s.worker === w.name)?.skills?.[ws.id];
          return {
            name: w.name,
            skill: specificSkill !== undefined ? specificSkill : (w.skillLevel || 1)
          };
        });

        const baseCycleTime = ws.tasks?.reduce((sum, task) => sum + (task.avgTime || 0), 0) || 0;

        if (workersData.length > 0 && baseCycleTime > 0) {
          const avgSkill = workersData.reduce((sum, w) => sum + w.skill, 0) / workersData.length;
          const parallelCycleTime = baseCycleTime / workersData.length;
          const skillBonus = avgSkill * (parallelCycleTime * 0.10);
          
          cycleTime = Math.max(1, Math.round(parallelCycleTime - skillBonus));
          
          // REAL MATH APPLIED: (Total Workload Minutes) / (Total Shift Capacity Minutes)
          if (liveDemand > 0) {
            const workloadMinutes = liveDemand * cycleTime;
            const capacityMinutes = 480 * (ws.capacity || 1); // 480 mins = 8 hours
            utilization = Math.round((workloadMinutes / capacityMinutes) * 100);
          } else {
            utilization = 0;
          }
        }

        return {
          stationId: ws.id,
          stationName: ws.stationName || 'Unknown Station',
          workers: workersData,
          tasks: ws.tasks?.map(t => t.taskName) || [],
          cycleTime,
          utilization,
          capacity: ws.capacity || 1 
        };
      }));
    }
  }, [workstations, workers, globalSkills, targetDate, liveDemand]); // Added liveDemand as dependency

  const handleOptimize = () => {
    if (activeWorkers.length === 0) {
      toast.error("No workers are marked as 'Present' today! Go to Workforce Setup first.");
      return;
    }

    setOptimizing(true);
    
    setTimeout(() => {
      let pool = [...activeWorkers]; 
      const newWorkerAssignments: { workerName: string, stationId: string }[] = [];
      
      (workstations || []).forEach(station => {
        const capacity = station.capacity || 1;
        
        for (let i = 0; i < capacity; i++) {
          if (pool.length === 0) break; 

          let bestWorkerIndex = 0;
          let highestSkill = -1;

          pool.forEach((worker, index) => {
            const specificSkill = globalSkills?.find(s => s.worker === worker.name)?.skills?.[station.id];
            const skillToUse = specificSkill !== undefined ? specificSkill : (worker.skillLevel || 1);

            if (skillToUse > highestSkill) {
              highestSkill = skillToUse;
              bestWorkerIndex = index;
            }
          });

          const selectedWorker = pool[bestWorkerIndex];
          if (selectedWorker) {
             newWorkerAssignments.push({ workerName: selectedWorker.name, stationId: station.id });
             // Remove from pool immediately to prevent duplicate assignments across stations
             pool.splice(bestWorkerIndex, 1); 
          }
        }
      });

      const updatedWorkers = (workers || []).map(w => {
        if (w.status !== 'present') return { ...w, station: 'Unassigned' };
        const match = newWorkerAssignments.find(a => a.workerName === w.name);
        return { ...w, station: match ? match.stationId : 'Unassigned' };
      });
      
      setWorkers(updatedWorkers);
      setOptimizing(false);
      toast.success('Workers optimally assigned without duplicates!');
    }, 1500); 
  };

  const handleManualOverride = (stationId: string, oldWorkerName: string, newWorkerName: string) => {
    const updatedWorkers = (workers || []).map(w => {
      if (w.name === newWorkerName && newWorkerName !== 'Unassigned') {
        return { ...w, station: stationId }; 
      }
      if (w.name === oldWorkerName && oldWorkerName !== 'Unassigned') {
        return { ...w, station: 'Unassigned' }; 
      }
      return w;
    });
    setWorkers(updatedWorkers);
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      await saveWorkforceToFirebase();
      toast.success(`Assignments for ${targetDate} saved to database!`);
    } catch (error) {
      toast.error('Failed to save to Firebase.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Station Assignment</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Capacity-aware automated distribution for today's roster</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="border-none outline-none text-sm font-medium text-gray-700 bg-transparent cursor-pointer w-full"
            />
          </div>

          <button
            onClick={handleOptimize}
            disabled={optimizing || activeWorkers.length === 0}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-lg transition-colors shadow-sm w-full sm:w-auto
              ${optimizing || activeWorkers.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <Play className="w-4 h-4" />
            {optimizing ? 'Calculating...' : 'Auto-Assign'}
          </button>

          <button
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Assignments'}
          </button>
        </div>
      </div>

      {activeWorkers.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">No Workers Present Today</h4>
            <p className="text-sm text-yellow-800 mt-1">
              There are no workers marked as "Present" for {targetDate}. Please go back to the Workforce Availability page to log attendance.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5 hidden sm:block" />
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
               <CheckCircle className="w-5 h-5 text-green-600 sm:hidden" />
               <h4 className="font-semibold text-green-900">Dynamic Capacity Optimization Engine</h4>
            </div>
            <p className="text-sm text-green-800 mb-4">
              The algorithm automatically finds the highest-skilled present workers to fill <strong>each available slot</strong> up to the station's capacity.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {(assignments || []).map((assignment) => (
          <div
            key={assignment.stationId}
            className={`
              bg-white rounded-lg shadow-sm p-4 sm:p-6 border-2 transition-all hover:shadow-md
              ${assignment.utilization > 100 ? 'border-red-300 bg-red-50' : 
                assignment.utilization > 90 ? 'border-yellow-300 bg-yellow-50' : 
                (assignment.workers?.length || 0) > 0 ? 'border-blue-200 bg-white' : 'border-gray-200'}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{assignment.stationName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-600">{assignment.stationId}</p>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold border border-gray-200">
                    Cap: {assignment.capacity || 1}
                  </span>
                </div>
              </div>
              <div className={`
                px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                ${assignment.utilization > 100 ? 'bg-red-100 text-red-700' : 
                  assignment.utilization > 90 ? 'bg-yellow-100 text-yellow-700' : 
                  assignment.utilization === 0 ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}
              `}>
                {assignment.utilization === 0 ? 'Pending' : `${assignment.utilization}% Util`}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                {Array.from({ length: assignment.capacity || 1 }).map((_, slotIndex) => {
                  const assignedWorker = assignment.workers?.[slotIndex];
                  const currentWorkerName = assignedWorker ? assignedWorker.name : 'Unassigned';

                  return (
                    <div key={slotIndex} className={`flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:border-blue-300 transition-colors ${currentWorkerName === 'Unassigned' ? 'bg-gray-100' : 'bg-blue-50'}`}>
                      <User className={`w-4 h-4 flex-shrink-0 ${currentWorkerName === 'Unassigned' ? 'text-gray-400' : 'text-blue-600'}`} />
                      <div className="flex-1 min-w-0">
                        <select
                          value={currentWorkerName}
                          onChange={(e) => handleManualOverride(assignment.stationId, currentWorkerName, e.target.value)}
                          className={`w-full bg-transparent text-sm font-bold truncate focus:outline-none cursor-pointer appearance-none
                            ${currentWorkerName === 'Unassigned' ? 'text-gray-400 font-medium' : 'text-blue-900'}
                          `}
                        >
                          <option value="Unassigned">Select Worker...</option>
                          {activeWorkers.map((worker) => {
                            const isCurrentlyInThisSlot = worker.name === currentWorkerName;
                            const isAvailable = worker.station === 'Unassigned';
                            const isAssignedElsewhere = !isAvailable && !isCurrentlyInThisSlot;

                            return (
                              <option 
                                key={worker.id} 
                                value={worker.name}
                                disabled={isAssignedElsewhere}
                              >
                                {worker.name} (Lvl {worker.skillLevel || 1}) {isAssignedElsewhere ? `— at ${worker.station}` : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {assignedWorker && (
                        <div className={`flex items-center bg-white px-2 py-0.5 rounded border flex-shrink-0 ${assignedWorker.skill < 3 ? 'border-red-200 text-red-700' : 'border-blue-100 text-gray-700'}`}>
                          <Star className={`w-3 h-3 mr-1 ${assignedWorker.skill < 3 ? 'text-red-500 fill-red-500' : 'text-yellow-500 fill-yellow-500'}`} />
                          <span className="text-xs font-bold">Lvl {assignedWorker.skill}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-600">Predicted Team Cycle Time</div>
                  <div className="text-sm font-medium text-gray-900">
                    {assignment.cycleTime === 0 ? '--' : `${assignment.cycleTime} min`}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ListChecks className="w-4 h-4 text-gray-600" />
                  <div className="text-xs text-gray-600">Live Station Tasks</div>
                </div>
                <div className="flex flex-wrap gap-1.5 ml-6">
                  {(assignment.tasks?.length || 0) > 0 ? assignment.tasks.map((task, index) => (
                    <span
                      key={index}
                      className="text-[11px] text-gray-700 px-2 py-0.5 bg-white border border-gray-200 rounded shadow-sm"
                    >
                      {task}
                    </span>
                  )) : (
                    <span className="text-xs text-red-500 italic">No tasks configured</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
         <Link
            to="/performance"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
          >
            Finalize & View Reports
            <ChevronRight className="w-5 h-5" />
          </Link>
      </div>
    </div>
  );
}