import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  standardTime: number;
  requiredSkill: string;
  workstation: string;
}

const initialTasks: Task[] = [
  { id: 'T001', name: 'Component Assembly', standardTime: 45, requiredSkill: 'Assembly', workstation: 'ST-01' },
  { id: 'T002', name: 'Welding Operation', standardTime: 60, requiredSkill: 'Welding', workstation: 'ST-02' },
  { id: 'T003', name: 'Quality Inspection', standardTime: 30, requiredSkill: 'Quality Control', workstation: 'ST-03' },
  { id: 'T004', name: 'Packaging', standardTime: 25, requiredSkill: 'Packaging', workstation: 'ST-04' },
  { id: 'T005', name: 'Machine Setup', standardTime: 40, requiredSkill: 'Maintenance', workstation: 'ST-05' },
];

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({
    id: '',
    name: '',
    standardTime: 0,
    requiredSkill: '',
    workstation: '',
  });

  const handleAddTask = () => {
    setEditingTask(null);
    setFormData({ id: '', name: '', standardTime: 0, requiredSkill: '', workstation: '' });
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData(task);
    setShowModal(true);
  };

  const handleSaveTask = () => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? formData as Task : t));
    } else {
      setTasks([...tasks, formData as Task]);
    }
    setShowModal(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Task Manager</h2>
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Task ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Task Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Standard Time (s)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Required Skill</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Workstation</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{task.standardTime}s</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{task.requiredSkill}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{task.workstation}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task ID</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="T001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Component Assembly"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard Time (seconds)</label>
                <input
                  type="number"
                  value={formData.standardTime}
                  onChange={(e) => setFormData({ ...formData, standardTime: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="45"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skill</label>
                <select
                  value={formData.requiredSkill}
                  onChange={(e) => setFormData({ ...formData, requiredSkill: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select skill</option>
                  <option value="Assembly">Assembly</option>
                  <option value="Welding">Welding</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Workstation</label>
                <input
                  type="text"
                  value={formData.workstation}
                  onChange={(e) => setFormData({ ...formData, workstation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ST-01"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTask ? 'Update' : 'Add'} Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
