import { useState } from 'react';
import { ArrowRight, ArrowDown, Database, Brain, Target, BarChart3, Settings as SettingsIcon, HelpCircle } from 'lucide-react';

export default function SystemArchitecturePage() {
  const [activeView, setActiveView] = useState<'sitemap' | 'userflow' | 'dataflow'>('userflow');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">System Architecture & Information Flow</h2>
        <p className="text-gray-600 mt-1">Connected workflow visualization for Balansya system</p>
      </div>

      {/* View Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 flex gap-2">
        <button
          onClick={() => setActiveView('userflow')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'userflow'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          User Flow Diagram
        </button>
        <button
          onClick={() => setActiveView('sitemap')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'sitemap'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Site Map
        </button>
        <button
          onClick={() => setActiveView('dataflow')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'dataflow'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Data Relationship Flow
        </button>
      </div>

      {/* User Flow Diagram */}
      {activeView === 'userflow' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Connected User Flow: Input → Analysis → Decision → Output</h3>

          <div className="space-y-8">
            {/* Authentication */}
            <div className="text-center">
              <div className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-medium">
                Login / Authentication
              </div>
              <div className="flex justify-center mt-2">
                <ArrowDown className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            {/* Dashboard Entry Point */}
            <div className="text-center">
              <div className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg">
                Dashboard (Overview & Quick Access)
              </div>
              <div className="flex justify-center mt-2">
                <ArrowDown className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            {/* Layer 1: Input Layer */}
            <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">LAYER 1: Input Layer (Daily Operations Setup)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border-2 border-green-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Workforce Management</div>
                  <div className="text-xs text-gray-600">Worker profiles & skills</div>
                </div>
                <div className="bg-white border-2 border-green-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Daily Workforce Availability</div>
                  <div className="text-xs text-gray-600">Attendance & status</div>
                </div>
                <div className="bg-white border-2 border-green-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Daily Menu Input</div>
                  <div className="text-xs text-gray-600">Active dishes & times</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white border-2 border-green-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Workstation & Task Setup</div>
                  <div className="text-xs text-gray-600">Station config & tasks</div>
                </div>
                <div className="bg-white border-2 border-green-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Demand & Event Input</div>
                  <div className="text-xs text-gray-600">Expected orders & conditions</div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <ArrowDown className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            {/* Layer 2: Analysis Layer */}
            <div className="border-2 border-purple-500 rounded-lg p-6 bg-purple-50">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900">LAYER 2: Analysis Layer (System Computation)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border-2 border-purple-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Skill Matrix</div>
                  <div className="text-xs text-gray-600">Worker-station matching</div>
                </div>
                <div className="bg-white border-2 border-purple-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Takt Time Analysis</div>
                  <div className="text-xs text-gray-600">Production pace required</div>
                </div>
                <div className="bg-white border-2 border-purple-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Utilization Monitor</div>
                  <div className="text-xs text-gray-600">Worker efficiency</div>
                </div>
                <div className="bg-white border-2 border-purple-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Bottleneck Detector</div>
                  <div className="text-xs text-gray-600">Capacity constraints</div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <ArrowDown className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            {/* Layer 3: Decision Layer */}
            <div className="border-2 border-orange-500 rounded-lg p-6 bg-orange-50">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-900">LAYER 3: Decision Layer (Recommendations)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-orange-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Station Assignment</div>
                  <div className="text-xs text-gray-600">Worker-to-station allocation</div>
                </div>
                <div className="bg-white border-2 border-orange-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Rebalancing Actions</div>
                  <div className="text-xs text-gray-600">Task redistribution</div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <ArrowDown className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            {/* Layer 4: Monitoring & Reporting Layer */}
            <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">LAYER 4: Monitoring & Reporting (Results & Review)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border-2 border-blue-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Dashboard</div>
                  <div className="text-xs text-gray-600">Real-time overview</div>
                </div>
                <div className="bg-white border-2 border-blue-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Performance Report</div>
                  <div className="text-xs text-gray-600">Historical trends</div>
                </div>
                <div className="bg-white border-2 border-blue-500 rounded-lg p-4 text-center">
                  <div className="font-medium text-gray-900 mb-1">Kitchen Layout Editor</div>
                  <div className="text-xs text-gray-600">Visual workflow</div>
                </div>
              </div>
            </div>

            {/* Support Layer */}
            <div className="border-2 border-gray-400 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <SettingsIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-800">Support Layer (Accessible from All Pages)</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-gray-400 rounded-lg p-3 text-center text-sm">
                  <HelpCircle className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <div className="font-medium text-gray-800">Help Center</div>
                </div>
                <div className="bg-white border border-gray-400 rounded-lg p-3 text-center text-sm">
                  <SettingsIcon className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                  <div className="font-medium text-gray-800">Settings</div>
                </div>
                <div className="bg-white border border-gray-400 rounded-lg p-3 text-center text-sm">
                  <div className="w-4 h-4 mx-auto mb-1 text-gray-600">🔔</div>
                  <div className="font-medium text-gray-800">Notifications</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Site Map */}
      {activeView === 'sitemap' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Complete Site Map</h3>

          <div className="space-y-6">
            {/* Authentication */}
            <div>
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg inline-block font-medium mb-2">
                Authentication Layer
              </div>
              <div className="ml-6 space-y-2">
                <div className="bg-gray-100 px-4 py-2 rounded-lg inline-block">Login Page</div>
              </div>
            </div>

            {/* Overview */}
            <div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block font-medium mb-2">
                Overview
              </div>
              <div className="ml-6 space-y-2">
                <div className="bg-blue-100 px-4 py-2 rounded-lg inline-block">Dashboard</div>
              </div>
            </div>

            {/* Workforce Setup */}
            <div>
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg inline-block font-medium mb-2">
                Workforce Setup
              </div>
              <div className="ml-6 grid grid-cols-2 gap-2">
                <div className="bg-green-100 px-4 py-2 rounded-lg">Workforce Management</div>
                <div className="bg-green-100 px-4 py-2 rounded-lg">Daily Workforce Availability</div>
              </div>
            </div>

            {/* Daily Operations */}
            <div>
              <div className="bg-teal-600 text-white px-4 py-2 rounded-lg inline-block font-medium mb-2">
                Daily Operations
              </div>
              <div className="ml-6 grid grid-cols-3 gap-2">
                <div className="bg-teal-100 px-4 py-2 rounded-lg">Daily Menu Input</div>
                <div className="bg-teal-100 px-4 py-2 rounded-lg">Workstation & Task Setup</div>
                <div className="bg-teal-100 px-4 py-2 rounded-lg">Demand & Event Input</div>
              </div>
            </div>

            {/* System Analysis */}
            <div>
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg inline-block font-medium mb-2">
                System Analysis
              </div>
              <div className="ml-6 grid grid-cols-4 gap-2">
                <div className="bg-purple-100 px-4 py-2 rounded-lg">Skill Matrix</div>
                <div className="bg-purple-100 px-4 py-2 rounded-lg">Takt Time Analysis</div>
                <div className="bg-purple-100 px-4 py-2 rounded-lg">Utilization Monitor</div>
                <div className="bg-purple-100 px-4 py-2 rounded-lg">Bottleneck Detector</div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="bg-orange-600 text-white px-4 py-2 rounded-lg inline-block font-medium mb-2">
                Recommendations
              </div>
              <div className="ml-6 space-y-2">
                <div className="bg-orange-100 px-4 py-2 rounded-lg inline-block">Station Assignment & Rebalancing</div>
              </div>
            </div>

            {/* Reports */}
            <div>
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg inline-block font-medium mb-2">
                Reports
              </div>
              <div className="ml-6 grid grid-cols-2 gap-2">
                <div className="bg-indigo-100 px-4 py-2 rounded-lg">Performance Reports</div>
                <div className="bg-indigo-100 px-4 py-2 rounded-lg">Kitchen Layout Editor</div>
              </div>
            </div>

            {/* Support */}
            <div>
              <div className="bg-gray-600 text-white px-4 py-2 rounded-lg inline-block font-medium mb-2">
                Support & Utilities
              </div>
              <div className="ml-6 grid grid-cols-3 gap-2">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">Help Center</div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">Settings</div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">Notifications</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Flow */}
      {activeView === 'dataflow' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Relationship Flow: How Inputs Drive Decisions</h3>

          <div className="space-y-8">
            {/* Data Flow Diagram */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column: Inputs */}
              <div className="space-y-4">
                <h4 className="font-semibold text-green-900 text-center mb-4">INPUT DATA</h4>

                <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                  <div className="font-semibold text-green-900 mb-2">Worker Data</div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Attendance status</li>
                    <li>• Skills & experience</li>
                    <li>• Preferred stations</li>
                    <li>• Training records</li>
                  </ul>
                </div>

                <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                  <div className="font-semibold text-green-900 mb-2">Menu Data</div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Active dishes</li>
                    <li>• Prep time per dish</li>
                    <li>• Cooking time</li>
                    <li>• Complexity level</li>
                  </ul>
                </div>

                <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                  <div className="font-semibold text-green-900 mb-2">Demand Data</div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Expected orders</li>
                    <li>• Peak hours</li>
                    <li>• Event type</li>
                    <li>• Service mode</li>
                  </ul>
                </div>

                <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                  <div className="font-semibold text-green-900 mb-2">Station Data</div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Station types</li>
                    <li>• Task definitions</li>
                    <li>• Capacity limits</li>
                    <li>• Required skills</li>
                  </ul>
                </div>
              </div>

              {/* Middle Column: Processing */}
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-900 text-center mb-4">CALCULATIONS</h4>

                <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-4">
                  <div className="font-semibold text-purple-900 mb-2">Skill Matching</div>
                  <div className="text-xs text-purple-800">
                    Worker skills × Station requirements → Compatibility scores
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-purple-600" />
                </div>

                <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-4">
                  <div className="font-semibold text-purple-900 mb-2">Takt Time</div>
                  <div className="text-xs text-purple-800">
                    Working time ÷ Demand → Required pace
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-purple-600" />
                </div>

                <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-4">
                  <div className="font-semibold text-purple-900 mb-2">Utilization</div>
                  <div className="text-xs text-purple-800">
                    Work time ÷ Available time → Efficiency %
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-purple-600" />
                </div>

                <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-4">
                  <div className="font-semibold text-purple-900 mb-2">Bottleneck Analysis</div>
                  <div className="text-xs text-purple-800">
                    Station load vs capacity → Constraint identification
                  </div>
                </div>
              </div>

              {/* Right Column: Outputs */}
              <div className="space-y-4">
                <h4 className="font-semibold text-orange-900 text-center mb-4">RECOMMENDATIONS</h4>

                <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-4">
                  <div className="font-semibold text-orange-900 mb-2">Station Assignments</div>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Worker-to-station mapping</li>
                    <li>• Skill match scores</li>
                    <li>• Load distribution</li>
                  </ul>
                </div>

                <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-4">
                  <div className="font-semibold text-orange-900 mb-2">Rebalancing Actions</div>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Task redistribution</li>
                    <li>• Worker reassignments</li>
                    <li>• Priority adjustments</li>
                  </ul>
                </div>

                <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-4">
                  <div className="font-semibold text-orange-900 mb-2">Alerts & Warnings</div>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Bottleneck locations</li>
                    <li>• Overutilization warnings</li>
                    <li>• Capacity issues</li>
                  </ul>
                </div>

                <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4">
                  <div className="font-semibold text-blue-900 mb-2">Dashboard Updates</div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• KPI updates</li>
                    <li>• Real-time metrics</li>
                    <li>• Status overview</li>
                  </ul>
                </div>

                <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4">
                  <div className="font-semibold text-blue-900 mb-2">Performance Reports</div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Daily summaries</li>
                    <li>• Trend analysis</li>
                    <li>• Efficiency metrics</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Relationships */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Key Data Relationships</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-900 mb-1">Worker Availability → Skill Matrix</div>
                  <div className="text-gray-600">Only present workers are prioritized for assignments</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-900 mb-1">Menu Items → Takt Time</div>
                  <div className="text-gray-600">Dish complexity affects required production pace</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-900 mb-1">Demand → Station Load</div>
                  <div className="text-gray-600">Order volume determines workload distribution</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-900 mb-1">Utilization + Bottlenecks → Assignments</div>
                  <div className="text-gray-600">Analysis results drive rebalancing decisions</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-900 mb-1">Station Setup → Line Efficiency</div>
                  <div className="text-gray-600">Workstation configuration impacts flow optimization</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-900 mb-1">Assignments → Dashboard</div>
                  <div className="text-gray-600">Changes update real-time monitoring displays</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">System Design Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-900 mb-1">🔗 Connected System</div>
            <div className="text-blue-800">Every input flows through analysis layers to generate actionable recommendations</div>
          </div>
          <div>
            <div className="font-medium text-blue-900 mb-1">📊 Transparent Logic</div>
            <div className="text-blue-800">Managers can see exactly how inputs affect calculations and outputs</div>
          </div>
          <div>
            <div className="font-medium text-blue-900 mb-1">✏️ Editable & Practical</div>
            <div className="text-blue-800">All data inputs can be updated daily; recommendations can be manually overridden</div>
          </div>
        </div>
      </div>
    </div>
  );
}
