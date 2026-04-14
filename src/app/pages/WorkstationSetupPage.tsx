import { useState } from 'react';
import { Plus, Edit, Trash2, Settings2, Clock, CheckCircle2, AlertCircle, Users, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useWorkforce } from '../components/WorkforceState';
import { useWorkstations, Workstation, Task } from '../components/WorkstationContext';

export default function WorkstationSetupPage() {
  const { workstations, setWorkstations } = useWorkstations(); 
  
  const [editingStation, setEditingStation] = useState<Workstation | null>(null);
  const [editingTask, setEditingTask] = useState<{ stationId: string; task: Task | null }>({ stationId: '', task: null });
  const [isStationDialogOpen, setIsStationDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const { workers } = useWorkforce();

  const handleAddStation = () => {
    setEditingStation({
      id: `ST-${String(workstations.length + 1).padStart(2, '0')}`,
      stationName: '',
      stationType: 'Back of House',
      capacity: 1,
      notes: '',
      tasks: []
    });
    setIsStationDialogOpen(true);
  };

  const handleEditStation = (station: Workstation) => {
    setEditingStation({ ...station });
    setIsStationDialogOpen(true);
  };

  const handleSaveStation = () => {
    if (editingStation && editingStation.stationName.trim() !== '') {
      const existingIndex = workstations.findIndex(s => s.id === editingStation.id);
      if (existingIndex >= 0) {
        const newStations = [...workstations];
        newStations[existingIndex] = editingStation;
        setWorkstations(newStations);
        toast.success('Station updated successfully');
      } else {
        setWorkstations([...workstations, editingStation]);
        toast.success('New station added');
      }
      setIsStationDialogOpen(false);
      setEditingStation(null);
    } else {
      toast.error('Station name is required');
    }
  };

  const handleDeleteStation = (stationId: string) => {
    setWorkstations(workstations.filter(s => s.id !== stationId));
    toast.info('Station removed');
  };

  const handleAddTask = (stationId: string) => {
    setEditingTask({
      stationId,
      task: {
        id: `T${String(Date.now()).slice(-3)}`,
        taskName: '',
        avgTime: 0,
        skillRequired: '',
        complexity: 'Low'
      }
    });
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (stationId: string, task: Task) => {
    setEditingTask({ stationId, task: { ...task } });
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (editingTask.task && editingTask.task.taskName.trim() !== '') {
      const stationIndex = workstations.findIndex(s => s.id === editingTask.stationId);
      if (stationIndex >= 0) {
        const newStations = [...workstations];
        const taskIndex = newStations[stationIndex].tasks.findIndex(t => t.id === editingTask.task?.id);

        if (taskIndex >= 0) {
          newStations[stationIndex].tasks[taskIndex] = editingTask.task;
          toast.success('Task updated');
        } else {
          newStations[stationIndex].tasks.push(editingTask.task);
          toast.success('Task added to station');
        }
        setWorkstations(newStations);
      }
      setIsTaskDialogOpen(false);
      setEditingTask({ stationId: '', task: null });
    } else {
      toast.error('Task name is required');
    }
  };

  const handleDeleteTask = (stationId: string, taskId: string) => {
    const newStations = workstations.map(station => {
      if (station.id === stationId) {
        return {
          ...station,
          tasks: station.tasks.filter(t => t.id !== taskId)
        };
      }
      return station;
    });
    setWorkstations(newStations);
    toast.info('Task removed');
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Workstation & Task Setup</h2>
          <p className="text-sm text-gray-500 mt-1">Configure physical stations and define operational tasks for line balancing.</p>
        </div>
        <Button onClick={handleAddStation} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Workstation
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Settings2 className="w-4 h-4" />
            <span className="text-sm font-medium">Total Stations</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{workstations.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Total Tasks</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">
            {workstations.reduce((sum, s) => sum + s.tasks.length, 0)}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Total Capacity</span>
          </div>
          <div className="text-3xl font-bold text-green-700">
            {workstations.reduce((sum, s) => sum + s.capacity, 0)} <span className="text-sm font-normal text-gray-500">slots</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Avg Task Time</span>
          </div>
          <div className="text-3xl font-bold text-purple-700">
            {(workstations.reduce((sum, s) =>
              sum + s.tasks.reduce((taskSum, t) => taskSum + t.avgTime, 0), 0) /
              Math.max(1, workstations.reduce((sum, s) => sum + s.tasks.length, 0))).toFixed(1)} <span className="text-sm font-normal text-gray-500">min</span>
          </div>
        </div>
      </div>

      {/* Workstations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {workstations.map((station) => {
          const totalStationTime = station.tasks.reduce((sum, task) => sum + task.avgTime, 0);
          const assignedWorkers = workers.filter(w => w.station === station.id && w.status === 'present');
          const isOverCapacity = assignedWorkers.length > station.capacity;

          return (
            <div key={station.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{station.stationName}</h3>
                      <Badge variant="outline" className="text-xs bg-white text-gray-600">{station.id}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium text-blue-600">{station.stationType}</span>
                      <span className="text-gray-300">•</span>
                      <span>Capacity: <strong className="text-gray-900">{station.capacity}</strong></span>
                      <span className="text-gray-300">•</span>
                      <span>Total Cycle: <strong className="text-gray-900">{totalStationTime}m</strong></span>
                    </div>
                  </div>
                  <div className="flex gap-1 bg-white rounded-md border shadow-sm">
                    <Button variant="ghost" size="sm" onClick={() => handleEditStation(station)} className="px-2 h-8 hover:bg-blue-50 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <div className="w-px bg-gray-200 my-1" />
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteStation(station.id)} className="px-2 h-8 text-gray-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {station.notes && (
                  <p className="text-sm text-gray-500 mt-3 bg-white p-2.5 rounded border border-gray-100 italic">"{station.notes}"</p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <UserCheck className="w-3.5 h-3.5" />
                      Active Staff ({assignedWorkers.length}/{station.capacity}):
                    </span>
                    {assignedWorkers.length > 0 ? (
                      assignedWorkers.map(w => (
                        <Badge key={w.id} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-default">
                          {w.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">No staff present today</span>
                    )}
                  </div>
                  
                  {isOverCapacity && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                      <AlertCircle className="w-4 h-4" />
                      <strong>Warning:</strong> Station exceeds maximum worker capacity. Physical crowding may reduce efficiency.
                    </div>
                  )}
                </div>

              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    Assigned Tasks 
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">{station.tasks.length}</Badge>
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTask(station.id)}
                    className="h-8 gap-1 border-dashed hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="w-3 h-3" />
                    Add Task
                  </Button>
                </div>

                {station.tasks.length > 0 ? (
                  <div className="space-y-2.5 flex-1">
                    {station.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="group relative p-3.5 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-gray-900 truncate">{task.taskName}</span>
                              <Badge className={`${getComplexityColor(task.complexity)} text-[10px] uppercase tracking-wider px-2 py-0.5 border`}>
                                {task.complexity}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1 font-medium text-gray-700">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                {task.avgTime} min
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                {task.skillRequired}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-sm border absolute right-2 top-1/2 -translate-y-1/2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(station.id, task)}
                              className="h-7 w-7 p-0 hover:text-blue-600"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(station.id, task.id)}
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900">No tasks assigned</p>
                    <p className="text-xs text-gray-500 text-center mt-1">Add tasks to calculate workstation cycle time and balance the line.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isStationDialogOpen} onOpenChange={setIsStationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingStation?.stationName ? 'Edit Workstation' : 'Add New Workstation'}</DialogTitle>
            <DialogDescription>
              Configure the physical location and capacity for this workstation.
            </DialogDescription>
          </DialogHeader>
          {editingStation && (
            <div className="space-y-5 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="stationName" className="text-xs uppercase text-gray-500 font-bold">Station Name <span className="text-red-500">*</span></Label>
                <Input
                  id="stationName"
                  value={editingStation.stationName}
                  onChange={(e) => setEditingStation({ ...editingStation, stationName: e.target.value })}
                  placeholder="e.g., Cooking Station"
                  className="focus-visible:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="stationType" className="text-xs uppercase text-gray-500 font-bold">Location Type</Label>
                  <Select
                    value={editingStation.stationType}
                    onValueChange={(value) => setEditingStation({ ...editingStation, stationType: value })}
                  >
                    <SelectTrigger className="focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Front of House">Front of House</SelectItem>
                      <SelectItem value="Back of House">Back of House</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="capacity" className="text-xs uppercase text-gray-500 font-bold">Max Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={editingStation.capacity}
                    onChange={(e) => setEditingStation({ ...editingStation, capacity: parseInt(e.target.value) || 1 })}
                    className="focus-visible:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs uppercase text-gray-500 font-bold">Operational Notes</Label>
                <Textarea
                  id="notes"
                  value={editingStation.notes}
                  onChange={(e) => setEditingStation({ ...editingStation, notes: e.target.value })}
                  placeholder="Additional context or safety requirements..."
                  rows={3}
                  className="resize-none focus-visible:ring-blue-500"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsStationDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStation} disabled={!editingStation?.stationName} className="bg-blue-600 hover:bg-blue-700">Save Workstation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTask.task?.taskName ? 'Edit Task details' : 'Add New Task'}</DialogTitle>
            <DialogDescription>
              Define the requirements and standard time for this operation.
            </DialogDescription>
          </DialogHeader>
          {editingTask.task && (
            <div className="space-y-5 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="taskName" className="text-xs uppercase text-gray-500 font-bold">Task Name <span className="text-red-500">*</span></Label>
                <Input
                  id="taskName"
                  value={editingTask.task.taskName}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    task: editingTask.task ? { ...editingTask.task, taskName: e.target.value } : null
                  })}
                  placeholder="e.g., Grill proteins"
                  className="focus-visible:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="avgTime" className="text-xs uppercase text-gray-500 font-bold">Standard Time (min)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="avgTime"
                      type="number"
                      min="0"
                      step="0.5"
                      value={editingTask.task.avgTime}
                      onChange={(e) => setEditingTask({
                        ...editingTask,
                        task: editingTask.task ? { ...editingTask.task, avgTime: parseFloat(e.target.value) || 0 } : null
                      })}
                      className="pl-9 focus-visible:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="complexity" className="text-xs uppercase text-gray-500 font-bold">Complexity</Label>
                  <Select
                    value={editingTask.task.complexity}
                    onValueChange={(value: any) => setEditingTask({
                      ...editingTask,
                      task: editingTask.task ? { ...editingTask.task, complexity: value } : null
                    })}
                  >
                    <SelectTrigger className="focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skillRequired" className="text-xs uppercase text-gray-500 font-bold">Core Skill Required</Label>
                <Input
                  id="skillRequired"
                  value={editingTask.task.skillRequired}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    task: editingTask.task ? { ...editingTask.task, skillRequired: e.target.value } : null
                  })}
                  placeholder="e.g., Knife Skills, Grilling"
                  className="focus-visible:ring-blue-500"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTask} disabled={!editingTask.task?.taskName} className="bg-blue-600 hover:bg-blue-700">Save Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}