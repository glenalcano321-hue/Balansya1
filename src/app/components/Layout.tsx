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
  // 1. Default to false so it doesn't cover mobile screens on initial load
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="Toggle Menu"
            >
              {sidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">Balansya</h1>
              <p className="hidden sm:block text-xs text-gray-600">Workforce Optimization System</p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <NavLink
              to="/help-center"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
              title="Help Center"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </NavLink>
            
            <NotificationPopover /> 
            
            <NavLink
              to="/settings"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </NavLink>
            <button className="w-8 h-8 md:w-9 md:h-9 ml-1 md:ml-0 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
              <User className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Workflow Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-gray-50 shadow-sm md:shadow-none">
        <WorkflowProgress />
      </div>

      <div className="flex flex-1 pt-[130px] md:pt-[120px]">
        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-[120px] bottom-0 w-64 bg-white border-r border-gray-200
            transition-transform duration-300 ease-in-out z-50 overflow-y-auto
            ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            lg:translate-x-0 lg:shadow-none lg:z-30
          `}
        >
          <nav className="p-4 pb-24 lg:pb-4">
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
                          onClick={() => setSidebarOpen(false)} // 2. Auto-close sidebar on mobile after clicking
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

        {/* Main Content Area */}
        {/* 3. min-w-0 prevents horizontal blowout, lg:ml-64 permanently offsets on desktop */}
        <main className="flex-1 w-full min-w-0 lg:ml-64 flex flex-col">
          {/* Responsive padding: p-4 on mobile, p-8 on desktop */}
          <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay Background - Clicking this closes the menu */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}