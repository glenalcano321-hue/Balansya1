import { useState } from 'react';
import { Plus, Edit, Archive, Search, Filter, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

interface Worker {
  id: string;
  fullName: string;
  role: string;
  status: 'active' | 'absent' | 'day-off' | 'resigned' | 'unavailable';
  experience: string;
  competency: string[];
  preferredStation: string;
  training: string;
  remarks: string;
}

const initialWorkers: Worker[] = [
  {
    id: 'W001',
    fullName: 'Maria Santos',
    role: 'Head Chef',
    status: 'active',
    experience: '5 years',
    competency: ['Cooking', 'Plating', 'Menu Planning'],
    preferredStation: 'Cooking Station',
    training: 'Culinary Arts Certification, Food Safety Level 3',
    remarks: 'Excellent leadership skills'
  },
  {
    id: 'W002',
    fullName: 'Juan Dela Cruz',
    role: 'Prep Cook',
    status: 'active',
    experience: '3 years',
    competency: ['Ingredient Preparation', 'Inventory'],
    preferredStation: 'Prep Station',
    training: 'Basic Food Handling',
    remarks: 'Fast and efficient'
  },
  {
    id: 'W003',
    fullName: 'Ana Reyes',
    role: 'Line Cook',
    status: 'active',
    experience: '2 years',
    competency: ['Cooking', 'Grilling'],
    preferredStation: 'Grill Station',
    training: 'Food Safety Level 2',
    remarks: 'Good under pressure'
  },
  {
    id: 'W004',
    fullName: 'Pedro Garcia',
    role: 'Dishwasher',
    status: 'active',
    experience: '1 year',
    competency: ['Cleaning', 'Organization'],
    preferredStation: 'Cleaning Station',
    training: 'Basic Food Handling',
    remarks: 'Reliable and punctual'
  },
  {
    id: 'W005',
    fullName: 'Carmen Lopez',
    role: 'Server',
    status: 'day-off',
    experience: '4 years',
    competency: ['Customer Service', 'Order Taking'],
    preferredStation: 'Service Station',
    training: 'Customer Service Excellence',
    remarks: 'Excellent with customers'
  }
];

export default function WorkforceManagementPage() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || worker.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddWorker = () => {
    setEditingWorker({
      id: `W${String(workers.length + 1).padStart(3, '0')}`,
      fullName: '',
      role: '',
      status: 'active',
      experience: '',
      competency: [],
      preferredStation: '',
      training: '',
      remarks: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditWorker = (worker: Worker) => {
    setEditingWorker({ ...worker });
    setIsDialogOpen(true);
  };

  const handleSaveWorker = () => {
    if (editingWorker) {
      const existingIndex = workers.findIndex(w => w.id === editingWorker.id);
      if (existingIndex >= 0) {
        const newWorkers = [...workers];
        newWorkers[existingIndex] = editingWorker;
        setWorkers(newWorkers);
        toast.success('Worker updated successfully');
      } else {
        setWorkers([...workers, editingWorker]);
        toast.success('Worker added successfully');
      }
    }
    setIsDialogOpen(false);
    setEditingWorker(null);
  };

  const handleArchiveWorker = (workerId: string) => {
    const newWorkers = workers.map(w =>
      w.id === workerId ? { ...w, status: 'resigned' as const } : w
    );
    setWorkers(newWorkers);
    toast.success('Worker archived');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'day-off': return 'bg-blue-100 text-blue-800';
      case 'resigned': return 'bg-gray-100 text-gray-800';
      case 'unavailable': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeWorkersCount = workers.filter(w => w.status === 'active').length;
  const totalWorkers = workers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Workforce Management</h2>
          <p className="text-gray-600 mt-1">Manage worker profiles, skills, and employment status</p>
        </div>
        <Button onClick={handleAddWorker} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add New Worker
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingWorker?.fullName ? 'Edit Worker' : 'Add New Worker'}</DialogTitle>
            </DialogHeader>
            {editingWorker && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={editingWorker.fullName}
                      onChange={(e) => setEditingWorker({ ...editingWorker, fullName: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Current Role *</Label>
                    <Input
                      id="role"
                      value={editingWorker.role}
                      onChange={(e) => setEditingWorker({ ...editingWorker, role: e.target.value })}
                      placeholder="e.g., Head Chef, Line Cook"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Employment Status *</Label>
                    <Select
                      value={editingWorker.status}
                      onValueChange={(value: any) => setEditingWorker({ ...editingWorker, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="day-off">Day Off</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                        <SelectItem value="resigned">Resigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      value={editingWorker.experience}
                      onChange={(e) => setEditingWorker({ ...editingWorker, experience: e.target.value })}
                      placeholder="e.g., 3 years, 6 months"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competency">Competency & Skills</Label>
                  <Input
                    id="competency"
                    value={editingWorker.competency.join(', ')}
                    onChange={(e) => setEditingWorker({
                      ...editingWorker,
                      competency: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    placeholder="e.g., Cooking, Plating, Grilling (comma separated)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredStation">Preferred Station</Label>
                  <Input
                    id="preferredStation"
                    value={editingWorker.preferredStation}
                    onChange={(e) => setEditingWorker({ ...editingWorker, preferredStation: e.target.value })}
                    placeholder="e.g., Cooking Station, Prep Station"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="training">Training Record</Label>
                  <Textarea
                    id="training"
                    value={editingWorker.training}
                    onChange={(e) => setEditingWorker({ ...editingWorker, training: e.target.value })}
                    placeholder="List certifications, training programs attended..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={editingWorker.remarks}
                    onChange={(e) => setEditingWorker({ ...editingWorker, remarks: e.target.value })}
                    placeholder="Additional notes or comments..."
                    rows={2}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveWorker}>Save Worker</Button>
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
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="day-off">Day Off</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
              <SelectItem value="resigned">Resigned</SelectItem>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{worker.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{worker.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(worker.status)}>
                      {worker.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{worker.experience}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {worker.competency.slice(0, 2).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {worker.competency.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{worker.competency.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditWorker(worker)}
                        className="gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      {worker.status !== 'resigned' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchiveWorker(worker.id)}
                          className="gap-1 text-red-600 hover:text-red-700"
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
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No workers found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
