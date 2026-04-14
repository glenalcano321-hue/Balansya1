import { useState } from 'react';
import { Edit, Archive, Search, Filter, UserPlus, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

import { useWorkforce, WorkerStatus } from '../components/WorkforceState';

export default function WorkforceManagementPage() {
  const { workers, setWorkers } = useWorkforce();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingWorker, setEditingWorker] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || worker.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddWorker = () => {
    setEditingWorker({
      id: `W-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: '',
      position: '',
      skillLevel: 1,
      status: 'present',
      workTimeMinutes: 0,
      shiftDurationMinutes: 480,
      idleTimeMinutes: 480,
      station: 'Unassigned',
      tasksCompleted: 0
    });
    setIsDialogOpen(true);
  };

  const handleEditWorker = (worker: any) => {
    setEditingWorker({ ...worker });
    setIsDialogOpen(true);
  };

  const handleSaveWorker = () => {
    if (editingWorker && editingWorker.name.trim() !== '') {
      const existingIndex = workers.findIndex(w => w.id === editingWorker.id);
      
      if (existingIndex >= 0) {
        const newWorkers = [...workers];
        newWorkers[existingIndex] = editingWorker;
        setWorkers(newWorkers);
        toast.success('Worker updated successfully');
      } else {
        setWorkers([...workers, editingWorker]);
        toast.success('Worker added successfully. They are now available for assignment.');
      }
    } else {
      toast.error('Worker Name is required');
      return;
    }
    setIsDialogOpen(false);
    setEditingWorker(null);
  };

  const handleArchiveWorker = (workerId: string) => {
    const newWorkers = workers.map(w =>
      w.id === workerId ? { ...w, status: 'unavailable' as WorkerStatus } : w
    );
    setWorkers(newWorkers);
    toast.success('Worker archived');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'day-off': return 'bg-blue-100 text-blue-800';
      case 'unavailable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeWorkersCount = workers.filter(w => w.status === 'present').length;
  const totalWorkers = workers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Workforce Management</h2>
          <p className="text-gray-600 mt-1">Manage global worker profiles, base skills, and employment status</p>
        </div>
        <Button onClick={handleAddWorker} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4" />
          Add New Worker
        </Button>
        
        {/* ADD/EDIT WORKER MODAL */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingWorker?.name ? 'Edit Worker Profile' : 'Register New Worker'}</DialogTitle>
            </DialogHeader>
            {editingWorker && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      value={editingWorker.name}
                      onChange={(e) => setEditingWorker({ ...editingWorker, name: e.target.value })}
                      placeholder="e.g. Maria Santos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Role <span className="text-red-500">*</span></Label>
                    <Input
                      id="position"
                      value={editingWorker.position}
                      onChange={(e) => setEditingWorker({ ...editingWorker, position: e.target.value })}
                      placeholder="e.g. Line Cook"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                    <Select
                      value={editingWorker.status}
                      onValueChange={(value: any) => setEditingWorker({ ...editingWorker, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present (Active)</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="day-off">Day Off</SelectItem>
                        <SelectItem value="unavailable">Archived/Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skillLevel">Base Skill Level (1-5)</Label>
                    <Select
                      value={editingWorker.skillLevel.toString()}
                      onValueChange={(value) => setEditingWorker({ ...editingWorker, skillLevel: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Level 1 (Novice)</SelectItem>
                        <SelectItem value="2">Level 2 (Beginner)</SelectItem>
                        <SelectItem value="3">Level 3 (Competent)</SelectItem>
                        <SelectItem value="4">Level 4 (Advanced)</SelectItem>
                        <SelectItem value="5">Level 5 (Expert)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mt-4 text-sm text-blue-800">
                  <strong>Note:</strong> Saving this profile makes the worker immediately available in the Daily Availability grid and Station Assignment algorithm.
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveWorker} className="bg-blue-600 hover:bg-blue-700 text-white">Save Profile</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Workers</div>
          <div className="text-3xl font-semibold text-gray-900">{totalWorkers}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Active Today</div>
          <div className="text-3xl font-semibold text-green-600">{activeWorkersCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">On Leave</div>
          <div className="text-3xl font-semibold text-blue-600">
            {workers.filter(w => w.status === 'day-off').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Absent</div>
          <div className="text-3xl font-semibold text-red-600">
            {workers.filter(w => w.status === 'absent').length}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus-visible:ring-blue-500"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48 focus:ring-blue-500">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="day-off">Day Off</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Skill</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
                        {worker.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{worker.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Level {worker.skillLevel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(worker.status)}>
                      {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditWorker(worker)}
                        className="gap-1 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      {worker.status !== 'unavailable' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchiveWorker(worker.id)}
                          className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Archive className="w-3 h-3" />
                          Archive
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredWorkers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
          <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No workers found in the database.</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or add a new worker.</p>
        </div>
      )}
    </div>
  );
}