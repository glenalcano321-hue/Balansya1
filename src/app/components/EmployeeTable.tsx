import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const employees = [
  { name: 'Sarah Johnson', station: 'WS-01', performance: 3, productivity: 95, status: 'active' },
  { name: 'Michael Chen', station: 'WS-05', performance: 2, productivity: 78, status: 'active' },
  { name: 'Emily Rodriguez', station: 'WS-08', performance: 3, productivity: 92, status: 'active' },
  { name: 'David Kim', station: 'WS-12', performance: 2, productivity: 68, status: 'break' },
  { name: 'Lisa Anderson', station: 'WS-15', performance: 3, productivity: 88, status: 'active' },
  { name: 'James Wilson', station: 'WS-18', performance: 1, productivity: 52, status: 'idle' },
];

export default function EmployeeTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'break':
        return 'bg-amber-100 text-amber-700';
      case 'idle':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 90) return 'bg-green-500';
    if (productivity >= 70) return 'bg-teal-500';
    if (productivity >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Employee Performance</h3>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Employee</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Station</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Performance</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Productivity</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{employee.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{employee.station}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < employee.performance
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                      <div
                        className={`h-2 rounded-full ${getProductivityColor(employee.productivity)}`}
                        style={{ width: `${employee.productivity}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-10">{employee.productivity}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
