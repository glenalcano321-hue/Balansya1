import { Monitor, Clock, AlertCircle, Zap } from 'lucide-react';

const workstations = [
  { id: 'WS-01', employee: 'Sarah J.', status: 'active', duration: '4:30', productivity: 95 },
  { id: 'WS-02', employee: 'Michael C.', status: 'active', duration: '3:45', productivity: 88 },
  { id: 'WS-03', employee: null, status: 'idle', duration: '2:15', productivity: 0 },
  { id: 'WS-04', employee: 'Emily R.', status: 'active', duration: '5:20', productivity: 92 },
  { id: 'WS-05', employee: 'David K.', status: 'break', duration: '0:15', productivity: 68 },
  { id: 'WS-06', employee: 'Lisa A.', status: 'active', duration: '6:10', productivity: 90 },
  { id: 'WS-07', employee: null, status: 'idle', duration: '1:30', productivity: 0 },
  { id: 'WS-08', employee: 'James W.', status: 'overloaded', duration: '7:45', productivity: 105 },
];

export default function WorkstationGrid() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-teal-300 bg-teal-50';
      case 'idle':
        return 'border-gray-300 bg-gray-50';
      case 'break':
        return 'border-amber-300 bg-amber-50';
      case 'overloaded':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Monitor className="w-4 h-4 text-teal-500" />;
      case 'idle':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      case 'break':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'overloaded':
        return <Zap className="w-4 h-4 text-red-500" />;
      default:
        return <Monitor className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string, productivity: number) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-block px-2 py-1 bg-teal-500 text-white text-xs font-medium rounded">
            {productivity}%
          </span>
        );
      case 'overloaded':
        return (
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
              {productivity}%
            </span>
          </div>
        );
      case 'break':
        return (
          <span className="inline-block px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
            On Break
          </span>
        );
      default:
        return (
          <span className="inline-block px-2 py-1 bg-gray-300 text-gray-600 text-xs font-medium rounded">
            Idle
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Workstation Monitor</h3>
      <div className="grid grid-cols-4 gap-4">
        {workstations.map((station) => (
          <div
            key={station.id}
            className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getStatusStyle(station.status)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(station.status)}
                <span className="text-sm font-semibold text-gray-900">{station.id}</span>
              </div>
              {getStatusBadge(station.status, station.productivity)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                  {station.employee ? station.employee.split(' ')[0].slice(0, 2).toUpperCase() : '--'}
                </div>
                <span className="text-sm text-gray-700">
                  {station.employee || 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{station.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
