import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { day: 'Mon', utilized: 45, available: 60, efficiency: 75 },
  { day: 'Tue', utilized: 48, available: 60, efficiency: 80 },
  { day: 'Wed', utilized: 52, available: 60, efficiency: 87 },
  { day: 'Thu', utilized: 50, available: 60, efficiency: 83 },
  { day: 'Fri', utilized: 48, available: 60, efficiency: 80 },
  { day: 'Sat', utilized: 35, available: 60, efficiency: 58 },
  { day: 'Sun', utilized: 30, available: 60, efficiency: 50 },
];

export default function UtilizationChart() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Workstation Utilization Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" key="grid-utilization" />
          <XAxis 
            dataKey="day" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            key="xaxis-utilization"
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            key="yaxis-utilization"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '12px'
            }}
            key="tooltip-utilization"
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
            key="legend-utilization"
          />
          <Line 
            type="monotone" 
            dataKey="utilized" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            name="Utilized Stations"
            id="line-utilized"
          />
          <Line 
            type="monotone" 
            dataKey="available" 
            stroke="#93C5FD" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#93C5FD', r: 4 }}
            name="Available Stations"
            id="line-available"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}