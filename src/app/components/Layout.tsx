import { useState } from 'react';
import { Outlet, NavLink } from 'react-router';
import {
  LayoutDashboard,
  Grid3x3,
  ClipboardList,
  Clock,
  Activity,
  AlertTriangle,
  MapPin,
  BarChart3,
  Bell,
  Settings,
  User,
  Menu,
  X,
  Layers,
  Users,
  UtensilsCrossed,
  TrendingUp,
  ChevronDown,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import WorkflowProgress from './WorkflowProgress';
import NotificationPopover from './NotificationsPopover';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Workforce Setup',
    items: [
      { path: '/workforce-management', label: 'Workforce Management', icon: Briefcase },
      { path: '/workforce-availability', label: 'Daily Availability', icon: Users },
    ]
  },
  {
    label: 'Daily Operations',
    items: [
      { path: '/menu-input', label: 'Menu Input', icon: UtensilsCrossed },
      { path: '/workstation-setup', label: 'Workstation Setup', icon: Layers },
      { path: '/demand-input', label: 'Demand & Events', icon: TrendingUp },
    ]
  },
  {
    label: 'System Analysis',
    items: [
      { path: '/skill-matrix', label: 'Skill Matrix', icon: Grid3x3 },
      { path: '/takt-time', label: 'Takt Time Analysis', icon: Clock },
      { path: '/utilization', label: 'Utilization Monitor', icon: Activity },
      { path: '/bottleneck', label: 'Bottleneck Detector', icon: AlertTriangle },
    ]
  },
  {
    label: 'Recommendations',
    items: [
      { path: '/station-assignment', label: 'Station Assignment', icon: MapPin },
      { path: '/kitchen-layout', label: 'Kitchen Layout Editor', icon: Layers },
    ]
  },
  {
    label: 'Reports',
    items: [
      { path: '/performance', label: 'Performance Reports', icon: BarChart3 },
    ]
  },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (label: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(label)) {
      newCollapsed.delete(label);
    } else {
      newCollapsed.add(label);
    }
    setCollapsedGroups(newCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Balansya</h1>
              <p className="text-xs text-gray-600">Workforce Optimization System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/help-center"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Help Center"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </NavLink>
            
            {/* The new functional bell goes here */}
            <NotificationPopover /> 
            
            <NavLink
              to="/settings"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </NavLink>
            <button className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Workflow Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40">
        <WorkflowProgress />
      </div>

      <div className="flex pt-[120px]">
        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-[120px] bottom-0 w-64 bg-white border-r border-gray-200
            transition-transform duration-300 z-40 overflow-y-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          <nav className="p-4">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-6">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                >
                  {group.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    collapsedGroups.has(group.label) ? '-rotate-90' : ''
                  }`} />
                </button>

                {!collapsedGroups.has(group.label) && (
                  <div className="mt-1 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.path === '/'}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`
                          }
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}