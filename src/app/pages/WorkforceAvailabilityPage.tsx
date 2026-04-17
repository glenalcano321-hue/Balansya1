import { useState } from 'react';
import { Users, CheckCircle, XCircle, Coffee, Calendar, ChevronRight, Settings, Save } from 'lucide-react';
import { Link } from 'react-router';
import { useWorkforce, WorkerStatus } from '../components/WorkforceState';
import { toast } from 'sonner';

const statusConfig = {
  present: { label: 'Present', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  absent: { label: 'Absent', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  'day-off': { label: 'Day Off', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Calendar },
  unavailable: { label: 'Unavailable', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Coffee },
};

export default function WorkforceAvailabilityPage() {
  const { workers, setWorkers, targetDate, setTargetDate, saveWorkforceToFirebase } = useWorkforce();
  const [isSaving, setIsSaving] = useState(false);
  const [viewFilter, setViewFilter] = useState<'all' | 'present' | 'absent' | 'day-off'>('all');
  const updateWorkerStatus = (workerId: string, newStatus: WorkerStatus) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, status: newStatus } : w));
  };
  const updateWorkerTime = (workerId: string, field: 'workTimeMinutes' | 'shiftDurationMinutes', value: number) => {
    setWorkers(workers.map(w => {
      if (w.id === workerId) {
        const newWorker = { ...w, [field]: value };
        newWorker.idleTimeMinutes = Math.max(0, newWorker.shiftDurationMinutes - newWorker.workTimeMinutes);
        return newWorker;
      }
      return w;
    }));
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      await saveWorkforceToFirebase();
      toast.success(`Workforce availability for ${targetDate} saved!`);
    } catch (error) {
      toast.error('Failed to save to Firebase.');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = {
    total: workers.length,
    present: workers.filter(w => w.status === 'present').length,
    absent: workers.filter(w => w.status === 'absent').length,
    dayOff: workers.filter(w => w.status === 'day-off').length,
  };

  const displayedWorkers = workers.filter(w => {
    if (viewFilter === 'all') return w.status !== 'unavailable';
    return w.status === viewFilter;
  });

  return (
    <div className="space-y-6 relative pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Daily Workforce Availability</h2>
          <p className="text-gray-600 mt-1">Set worker attendance and record active time for utilization tracking</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          <Link
            to="/workforce-management"
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Settings className="w-4 h-4" />
            Manage Staff
          </Link>

          <button
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Availability'}
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Operating Date</label>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <span className="text-sm text-gray-500 italic">Changing dates will load historical/future rosters.</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Workers</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-3xl font-semibold text-green-600 mt-1">{stats.present}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-3xl font-semibold text-red-600 mt-1">{stats.absent}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Day Off</p>
              <p className="text-3xl font-semibold text-blue-600 mt-1">{stats.dayOff}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Worker Status Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Worker Status & Time Logging</h3>
            <p className="text-sm text-gray-600 mt-1">Update availability and log active work minutes for utilization metrics</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
            <button 
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${viewFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              All Staff
            </button>
            <button 
              onClick={() => setViewFilter('present')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${viewFilter === 'present' ? 'bg-green-100 text-green-800 shadow-sm' : 'text-gray-600 hover:text-green-700'}`}
            >
              Present Only
            </button>
            <button 
              onClick={() => setViewFilter('absent')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${viewFilter === 'absent' ? 'bg-red-100 text-red-800 shadow-sm' : 'text-gray-600 hover:text-red-700'}`}
            >
              Absent/Leave
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {displayedWorkers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">
              No workers match this filter for {targetDate}.
            </div>
          ) : (
            displayedWorkers.map((worker) => {
              const config = statusConfig[worker.status] || statusConfig['unavailable'];
              
              const utilizationPercent = worker.shiftDurationMinutes > 0 
                ? Math.min(100, Math.round((worker.workTimeMinutes / worker.shiftDurationMinutes) * 100))
                : 0;

              return (
                <div key={worker.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
                    
                    {/* Worker Info */}
                    <div className="lg:col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-gray-700">{worker.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{worker.name}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{worker.position} • Level {worker.skillLevel}</div>
                      </div>
                    </div>

                    {/* Status Toggles */}
                    <div className="lg:col-span-4 flex flex-wrap gap-2">
                      {(Object.keys(statusConfig) as WorkerStatus[]).filter(s => s !== 'unavailable').map((status) => {
                        const cfg = statusConfig[status];
                        const Icon = cfg.icon;
                        const isActive = worker.status === status;

                        return (
                          <button
                            key={status}
                            onClick={() => updateWorkerStatus(worker.id, status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              isActive
                                ? cfg.color
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              <Icon className="w-3.5 h-3.5 hidden sm:block" />
                              {cfg.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Time Tracking */}
                    <div className="lg:col-span-4">
                      {worker.status === 'present' ? (
                        <div className="flex items-center gap-2 sm:gap-4 bg-white border border-gray-200 p-2 sm:p-3 rounded-lg">
                          <div className="flex-1">
                            <label className="block text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Work (min)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={worker.workTimeMinutes}
                              onChange={(e) => updateWorkerTime(worker.id, 'workTimeMinutes', Number(e.target.value))}
                              className="w-full text-xs sm:text-sm p-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-blue-700 bg-blue-50/50"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <label className="block text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Shift (min)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={worker.shiftDurationMinutes}
                              onChange={(e) => updateWorkerTime(worker.id, 'shiftDurationMinutes', Number(e.target.value))}
                              className="w-full text-xs sm:text-sm p-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          {/* Utilization Mini-Display */}
                          <div className="flex-1 text-center border-l pl-2 sm:pl-3">
                            <div className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Idle</div>
                            <div className="text-xs sm:text-sm font-bold text-orange-600">{worker.idleTimeMinutes}m</div>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div 
                                className={`h-1 rounded-full ${utilizationPercent > 90 ? 'bg-red-500' : utilizationPercent < 50 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                style={{ width: `${utilizationPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs sm:text-sm text-gray-400 italic text-center p-3 border border-dashed border-gray-200 rounded-lg">
                          Time tracking disabled ({config?.label || 'Unknown'})
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Link
          to="/menu-input"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
        >
          Proceed to Menu Input
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}