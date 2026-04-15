import { useState, useEffect } from 'react';
import { Play, User, Clock, ListChecks, ChevronRight, CheckCircle, Star, Edit2 } from 'lucide-react';
import { Link } from 'react-router';
import { useSkills } from '../components/SkillContext'; 
import { useWorkstations } from '../components/WorkstationContext'; 
import { useWorkforce } from '../components/WorkforceState'; // <-- 1. Import the global workforce!

interface Assignment {
  stationId: string;
  stationName: string;
  worker: string;
  tasks: string[];
  cycleTime: number;
  utilization: number;
  skillMatch?: number; 
}

export default function StationAssignmentPage() {
  const { globalSkills } = useSkills(); 
  const { workstations } = useWorkstations(); 
  const { workers, setWorkers } = useWorkforce(); // <-- 2. Pull in the live workers database
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  // Initialize the UI with the live workstations
  useEffect(() => {
    if (!isOptimized && workstations) {
      setAssignments(workstations.map(ws => {
        // Look to see if someone is ALREADY assigned in the global database
        const existingWorker = workers.find(w => w.station === ws.id);
        
        return {
          stationId: ws.id,
          stationName: ws.stationName,
          worker: existingWorker ? existingWorker.name : 'Unassigned',
          tasks: ws.tasks.map(t => t.taskName),
          cycleTime: 0,
          utilization: 0,
          skillMatch: existingWorker ? globalSkills.find(s => s.worker === existingWorker.name)?.skills[ws.id] : undefined
        };
      }));
    }
  }, [workstations, isOptimized, workers, globalSkills]);

  // 1. THE AUTO-ASSIGN ALGORITHM
  const handleOptimize = () => {
    setOptimizing(true);
    
    setTimeout(() => {
      let availableWorkers = [...globalSkills]; 
      
      const newAssignments = workstations.map(station => {
        let bestWorkerIndex = 0;
        let highestSkill = -1;

        availableWorkers.forEach((worker, index) => {
          const skillLevel = worker.skills[station.id] || 1;
          if (skillLevel > highestSkill) {
            highestSkill = skillLevel;
            bestWorkerIndex = index;
          }
        });

        const selectedWorker = availableWorkers[bestWorkerIndex];
        
        if (!selectedWorker) {
          return {
            stationId: station.id,
            stationName: station.stationName,
            worker: 'Unassigned',
            tasks: station.tasks.map(t => t.taskName),
            cycleTime: 0,
            utilization: 0
          };
        }
        
        availableWorkers.splice(bestWorkerIndex, 1); 

        const baseCycleTime = station.tasks.reduce((sum, task) => sum + task.avgTime, 0);
        const skillBonus = highestSkill * (baseCycleTime * 0.10); 
        
        return {
          stationId: station.id,
          stationName: station.stationName,
          worker: selectedWorker.worker,
          skillMatch: highestSkill,
          tasks: station.tasks.map(t => t.taskName),
          cycleTime: Math.max(1, Math.round(baseCycleTime - skillBonus)), 
          utilization: Math.floor(75 + (Math.random() * 20)), 
        };
      });

      // 3. PUSH TO GLOBAL DATABASE: Update the workers array so the Layout Editor can see it!
      const updatedWorkers = workers.map(w => {
        const matchingAssignment = newAssignments.find(a => a.worker === w.name);
        if (matchingAssignment) {
          return { ...w, station: matchingAssignment.stationId };
        }
        return { ...w, station: 'Unassigned' };
      });
      
      setWorkers(updatedWorkers);
      setAssignments(newAssignments);
      setIsOptimized(true);
      setOptimizing(false);
    }, 1500); 
  };

  // 2. THE MANUAL OVERRIDE LOGIC
  const handleManualOverride = (stationId: string, newWorkerName: string) => {
    // A. Update local UI state
    setAssignments(prevAssignments => prevAssignments.map(assignment => {
      if (assignment.stationId !== stationId) return assignment;

      if (newWorkerName === 'Unassigned') {
        return { ...assignment, worker: 'Unassigned', skillMatch: undefined, cycleTime: 0, utilization: 0 };
      }

      const workerData = globalSkills.find(w => w.worker === newWorkerName);
      const newSkillLevel = workerData?.skills[stationId] || 1; 

      const stationData = workstations.find(ws => ws.id === stationId);
      const baseCycleTime = stationData?.tasks.reduce((sum, task) => sum + task.avgTime, 0) || 50;
      const skillBonus = newSkillLevel * (baseCycleTime * 0.10);

      return {
        ...assignment,
        worker: newWorkerName,
        skillMatch: newSkillLevel,
        cycleTime: Math.max(1, Math.round(baseCycleTime - skillBonus)),
        utilization: newSkillLevel < 3 ? Math.floor(95 + (Math.random() * 15)) : Math.floor(70 + (Math.random() * 20)),
      };
    }));

    // B. Push the manual override to the global database!
    const updatedWorkers = workers.map(w => {
      if (w.name === newWorkerName) {
        return { ...w, station: stationId }; // Assign new worker
      }
      if (w.station === stationId && w.name !== newWorkerName) {
        return { ...w, station: 'Unassigned' }; // Evict the old worker from this station
      }
      return w;
    });
    
    setWorkers(updatedWorkers);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Station Assignment</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Skill-based automated distribution</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleOptimize}
            disabled={optimizing || isOptimized}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg transition-colors shadow-sm w-full sm:w-auto
              ${optimizing || isOptimized ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <Play className="w-5 h-5" />
            {optimizing ? 'Calculating Best Fits...' : 'Auto-Assign Workers'}
          </button>
          <Link
            to="/performance"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
          >
            View Reports
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5 hidden sm:block" />
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
               <CheckCircle className="w-5 h-5 text-green-600 sm:hidden" />
               <h4 className="font-semibold text-green-900">Dynamic Task Optimization Engine</h4>
            </div>
            <p className="text-sm text-green-800 mb-4">
              The algorithm automatically finds the highest-skilled worker to minimize cycle time. <strong>Managers can click any assigned worker's name to manually override the assignment. Changes made here automatically update the Kitchen Layout Editor.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment.stationId}
            className={`
              bg-white rounded-lg shadow-sm p-4 sm:p-6 border-2 transition-all hover:shadow-md
              ${assignment.utilization > 100 ? 'border-red-300 bg-red-50' : 
                assignment.utilization > 90 ? 'border-yellow-300 bg-yellow-50' : 
                assignment.worker !== 'Unassigned' ? 'border-blue-200 bg-white' : 'border-gray-200'}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{assignment.stationName}</h3>
                <p className="text-sm text-gray-600">{assignment.stationId}</p>
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
              {/* THE MANUAL DROPDOWN UI */}
              <div className={`flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-blue-300 transition-colors ${assignment.worker === 'Unassigned' ? 'bg-gray-100' : 'bg-blue-50'}`}>
                <User className={`w-5 h-5 flex-shrink-0 ${assignment.worker === 'Unassigned' ? 'text-gray-400' : 'text-blue-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-600 mb-0.5 flex items-center gap-1">
                    Assigned Worker <Edit2 className="w-3 h-3 opacity-50" />
                  </div>
                  
                  {/* Select Dropdown to override worker */}
                  <select
                    value={assignment.worker}
                    onChange={(e) => handleManualOverride(assignment.stationId, e.target.value)}
                    className={`w-full bg-transparent text-sm font-bold truncate focus:outline-none cursor-pointer appearance-none
                      ${assignment.worker === 'Unassigned' ? 'text-gray-400' : 'text-blue-900'}
                    `}
                  >
                    <option value="Unassigned">Select Worker...</option>
                    {globalSkills.map((worker) => (
                      <option key={worker.worker} value={worker.worker}>
                        {worker.worker}
                      </option>
                    ))}
                  </select>
                </div>

                {assignment.skillMatch && (
                  <div className={`flex items-center bg-white px-2 py-1 rounded border flex-shrink-0 ${assignment.skillMatch < 3 ? 'border-red-200 text-red-700' : 'border-blue-100 text-gray-700'}`}>
                    <Star className={`w-3 h-3 mr-1 ${assignment.skillMatch < 3 ? 'text-red-500 fill-red-500' : 'text-yellow-500 fill-yellow-500'}`} />
                    <span className="text-xs font-bold">Lvl {assignment.skillMatch}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-600">Predicted Cycle Time</div>
                  <div className={`text-sm font-medium ${assignment.skillMatch && assignment.skillMatch < 3 ? 'text-red-600' : 'text-gray-900'}`}>
                    {assignment.cycleTime === 0 ? '--' : `${assignment.cycleTime} min`}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ListChecks className="w-5 h-5 text-gray-600" />
                  <div className="text-xs text-gray-600">Live Station Tasks</div>
                </div>
                <div className="flex flex-wrap gap-2 ml-7">
                  {assignment.tasks.length > 0 ? assignment.tasks.map((task, index) => (
                    <span
                      key={index}
                      className="text-xs sm:text-sm text-gray-700 px-2 py-1 bg-white border border-gray-200 rounded shadow-sm"
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
    </div>
  );
}