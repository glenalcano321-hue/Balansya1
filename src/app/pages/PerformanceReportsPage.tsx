import { useState } from 'react';
import { Download, Calendar, Info, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const efficiencyData = [
  { date: 'Mar 1', efficiency: 88 },
  { date: 'Mar 2', efficiency: 90 },
  { date: 'Mar 3', efficiency: 87 },
  { date: 'Mar 4', efficiency: 92 },
  { date: 'Mar 5', efficiency: 91 },
  { date: 'Mar 6', efficiency: 94 },
  { date: 'Mar 7', efficiency: 93 },
];

const utilizationData = [
  { week: 'Week 1', utilization: 82 },
  { week: 'Week 2', utilization: 85 },
  { week: 'Week 3', utilization: 87 },
  { week: 'Week 4', utilization: 89 },
];

const idleTimeData = [
  { month: 'Jan', idleTime: 420, target: 300 },
  { month: 'Feb', idleTime: 380, target: 300 },
  { month: 'Mar', idleTime: 310, target: 300 },
];

export default function PerformanceReportsPage() {
  const [dateRange, setDateRange] = useState('7days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Performance Reports</h2>
          <p className="text-gray-600 mt-1">Historical trends and system effectiveness</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm text-gray-700"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Workflow Completion Summary */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-2">End-to-End Workflow Summary</h4>
            <p className="text-sm text-green-800 mb-3">
              These reports show the outcomes of daily optimization cycles. Each data point represents the result of
              the complete workflow: workforce setup → menu input → demand forecasting → system analysis →
              station assignments. Track improvements over time to validate balancing strategies.
            </p>
            <Link
              to="/workforce-availability"
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900"
            >
              Start new daily cycle →
            </Link>
          </div>
        </div>
      </div>

      {/* Line Efficiency Trend */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Line Efficiency Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" key="grid-efficiency" />
            <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} key="xaxis-efficiency" />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} domain={[0, 100]} key="yaxis-efficiency" />
            <Tooltip key="tooltip-efficiency" />
            <Legend key="legend-efficiency" />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 5 }}
              name="Efficiency %"
              key="line-efficiency"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Current</div>
            <div className="text-2xl font-semibold text-blue-600">93%</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Average</div>
            <div className="text-2xl font-semibold text-green-600">90.7%</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Target</div>
            <div className="text-2xl font-semibold text-purple-600">92%</div>
          </div>
        </div>
      </div>

      {/* Utilization and Idle Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilization Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" key="grid-utilization-trend" />
              <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 12 }} key="xaxis-utilization-trend" />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} domain={[0, 100]} key="yaxis-utilization-trend" />
              <Tooltip key="tooltip-utilization-trend" />
              <Bar dataKey="utilization" fill="#10B981" radius={[4, 4, 0, 0]} name="Utilization %" key="bar-utilization-trend" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-600">4-Week Average</span>
            <span className="text-xl font-semibold text-green-600">85.75%</span>
          </div>
        </div>

        {/* Idle Time Reduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Idle Time Reduction</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={idleTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" key="grid-idle" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} key="xaxis-idle" />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} key="yaxis-idle" />
              <Tooltip key="tooltip-idle" />
              <Legend key="legend-idle" />
              <Bar dataKey="idleTime" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Actual (min)" key="bar-idle-actual" />
              <Bar dataKey="target" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Target (min)" key="bar-idle-target" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm text-gray-600">Total Reduction</span>
            <span className="text-xl font-semibold text-yellow-600">110 min</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Overall Equipment Effectiveness (OEE)</div>
            <div className="text-3xl font-semibold text-gray-900">87.5%</div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>↑ 2.3%</span>
              <span className="text-gray-500">vs last period</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-600">Production Output</div>
            <div className="text-3xl font-semibold text-gray-900">4,482</div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>↑ 5.1%</span>
              <span className="text-gray-500">vs last period</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-600">Quality Rate</div>
            <div className="text-3xl font-semibold text-gray-900">98.2%</div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>↑ 0.8%</span>
              <span className="text-gray-500">vs last period</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-600">Downtime Hours</div>
            <div className="text-3xl font-semibold text-gray-900">12.5h</div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>↓ 18%</span>
              <span className="text-gray-500">vs last period</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}