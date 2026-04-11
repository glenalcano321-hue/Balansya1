import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  HelpCircle, 
  User,
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart3,
  TrendingUp,
  Settings,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Download
} from 'lucide-react';
import KPICard from './KPICard';
import WorkstationGrid from './WorkstationGrid';
import ProductivityChart from './ProductivityChart';
import UtilizationChart from './UtilizationChart';
import EmployeeTable from './EmployeeTable';
import HeatmapChart from './HeatmapChart';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workstations', label: 'Workstation Monitor', icon: Briefcase },
    { id: 'employees', label: 'Employee Tracking', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'productivity', label: 'Productivity Reports', icon: TrendingUp },
    { id: 'utilization', label: 'Utilization Analysis', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">WorkTrack</span>
            </div>
            <h1 className="text-xl text-gray-900">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-10 pr-4 py-2 w-80 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 flex gap-8 border-b border-gray-200">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeNav === item.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-145px)]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeNav === item.id
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* KPIs Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
            <div className="grid grid-cols-5 gap-4">
              <KPICard
                icon={<Activity className="w-5 h-5 text-teal-500" />}
                label="Active Workstations"
                value="48"
                subtext="of 60 total"
                trend={+3}
                trendLabel="3%"
              />
              <KPICard
                icon={<Users className="w-5 h-5 text-teal-500" />}
                label="Employees Logged In"
                value="52"
                subtext="of 65 total"
                trend={+5}
                trendLabel="5%"
              />
              <KPICard
                icon={<Zap className="w-5 h-5 text-amber-500" />}
                label="Avg Productivity"
                value="87%"
                subtext=""
                trend={+2}
                trendLabel="2%"
              />
              <KPICard
                icon={<Clock className="w-5 h-5 text-teal-500" />}
                label="Avg Session Time"
                value="6.5"
                subtext="hours"
                trend={-1}
                trendLabel="1%"
              />
              <KPICard
                icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
                label="Idle Stations"
                value="12"
                subtext=""
                trend={0}
                trendLabel=""
              />
            </div>
          </section>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <ProductivityChart />
            <UtilizationChart />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="col-span-2">
              <EmployeeTable />
            </div>
            <div className="col-span-1">
              <HeatmapChart />
            </div>
          </div>

          {/* Workstation Grid */}
          <WorkstationGrid />

          {/* Alerts */}
          <section className="mt-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">Alerts & Recommendations</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Workstation WS-12</span> has been idle for over 2 hours. Consider reassigning or optimizing allocation.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Employee productivity</span> for Team B has dropped by 15% this week. Review task assignments.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Utilization optimization</span> completed. 3 workstations have been reassigned for better efficiency.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 flex items-center justify-between text-sm text-gray-500">
            <div>Last Updated: Just Now</div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
