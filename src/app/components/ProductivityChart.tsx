import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { time: '8:00', productivity: 45, target: 80 },
  { time: '9:00', productivity: 65, target: 80 },
  { time: '10:00', productivity: 85, target: 80 },
  { time: '11:00', productivity: 90, target: 80 },
  { time: '12:00', productivity: 75, target: 80 },
  { time: '13:00', productivity: 60, target: 80 },
  { time: '14:00', productivity: 82, target: 80 },
  { time: '15:00', productivity: 88, target: 80 },
  { time: '16:00', productivity: 85, target: 80 },
  { time: '17:00', productivity: 70, target: 80 },
];

export default function ProductivityChart() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Productivity Tracking</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" key="grid-productivity" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            key="xaxis-productivity"
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            label={{ value: 'Productivity %', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
            key="yaxis-productivity"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '12px'
            }}
            key="tooltip-productivity"
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
            key="legend-productivity"
          />
          <Bar dataKey="productivity" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Current Productivity" id="bar-productivity" />
          <Bar dataKey="target" fill="#BFDBFE" radius={[4, 4, 0, 0]} name="Target" id="bar-target" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}