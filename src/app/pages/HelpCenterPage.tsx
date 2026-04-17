import { useState } from 'react';
import { BookOpen, Calculator, HelpCircle, FileQuestion, ChevronDown, ChevronRight } from 'lucide-react';

const helpSections = [
  {
    id: 'getting-started',
    title: 'Getting Started with Balansya',
    icon: BookOpen,
    topics: [
      {
        title: 'The Lean Six Sigma Approach',
        content: 'Balansya is a Workforce Optimization System designed for culinary enterprises. It applies Lean Six Sigma methodologies to identify production bottlenecks, eliminate waste (muda), and balance kitchen workloads. By synchronizing live demand with actual worker capabilities, Balansya ensures continuous, efficient operational flow.'
      },
      {
        title: 'The Daily Operations Workflow',
        content: 'For optimal results, managers should follow this daily sequence:\n\n1) Daily Setup: Log active staff in Workforce Availability, select the active Menu, and input Expected Demand.\n2) System Analysis: Review the Skill Matrix to match competencies, check Takt Time Analysis for capacity limits, and monitor live Utilization.\n3) Recommendations: Use the Bottleneck Detector to find constraints, run the Auto-Assigner in Station Assignment, and map the physical flow in the Kitchen Layout Editor.\n4) Monitoring: Track live metrics on the Dashboard and review historical data in Performance Reports.'
      },
      {
        title: 'Navigating the Interface',
        content: 'The left sidebar serves as your primary navigation, grouped logically by the daily workflow stages. The top header displays your progress through the daily setup. If you ever need to quickly jump to a global overview, click the "Balansya" logo to return to the main Dashboard.'
      }
    ]
  },
  {
    id: 'formulas',
    title: 'Lean Six Sigma Formulas',
    icon: Calculator,
    topics: [
      {
        title: 'Takt Time (Pace of Customer Demand)',
        content: 'Takt Time = Net Available Production Time / Expected Customer Demand\n\nExample: If your kitchen operates for 8 hours (28,800 seconds) and you expect 200 orders today:\nTakt Time = 28,800 / 200 = 144 seconds per order.\n\nThis is the critical "heartbeat" of your kitchen. If any single workstation takes longer than 144 seconds (Cycle Time > Takt Time), you will inevitably fall behind and fail to meet customer demand.'
      },
      {
        title: 'Workforce Utilization',
        content: 'Utilization % = (Active Productive Time / Total Shift Duration) × 100\n\nBalansya targets a "Goldilocks Zone" of 75% - 90% utilization.\n• < 75%: Indicates excess idle time and wasted labor capacity. Workers should be reassigned to support other stations.\n• > 90%: Indicates a severe risk of worker fatigue, safety hazards, and quality defects.'
      },
      {
        title: 'Station Capacity Calculation',
        content: 'Max Daily Capacity = (Net Available Time / Station Cycle Time) × Physical Worker Slots\n\nThis formula calculates the absolute maximum number of units a specific physical station can output in a day. If this number is lower than your Expected Demand, that station is a guaranteed bottleneck.'
      }
    ]
  },
  {
    id: 'modules',
    title: 'Module Deep-Dives',
    icon: HelpCircle,
    topics: [
      {
        title: 'Workstation Setup & Kitchen Layout',
        content: 'The Workstation Setup is your global database of physical kitchen zones and their standard tasks. The Kitchen Layout Editor allows you to visually map these stations to minimize physical travel waste (motion waste). Changes made in the Layout Editor automatically sync with the global database.'
      },
      {
        title: 'Demand Input & Event Multipliers',
        content: 'This module establishes your daily target. You can set a baseline expectation and apply Event Multipliers (e.g., 1.5x for Peak Days or 1.8x for Promos). This final "Adjusted Demand" is globally linked to the Takt Time Analysis to instantly show if your current staff can handle the rush.'
      },
      {
        title: 'Skill Matrix Analysis',
        content: 'Not all workers are equally efficient at every task. The Skill Matrix allows you to rate workers on a 1-5 scale across different stations. Balansya uses this data to calculate "Skill Bonuses," which can reduce a station\'s Cycle Time if a highly skilled worker is assigned there.'
      },
      {
        title: 'Station Assignment (Auto-Assigner)',
        content: 'The Station Assignment engine uses a proprietary algorithm to automatically distribute your present workers to the stations where they are most skilled. It actively attempts to balance the workload to prevent any single station from exceeding 90% utilization. Managers can manually click a dropdown to override these suggestions.'
      }
    ]
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    icon: FileQuestion,
    topics: [
      {
        title: 'How does the Bottleneck Detector work?',
        content: 'The system automatically flags a station as a bottleneck (Red Alert) if its calculated Capacity is lower than your Expected Demand, or if its Cycle Time exceeds the global Takt Time. It will issue a Warning (Yellow Alert) if a station is operating above 90% utilization.'
      },
      {
        title: 'Why did my data disappear after refreshing the page?',
        content: 'If you have not connected a backend database (like Firebase), Balansya uses your browser\'s Local Storage to save your data globally across pages. If you clear your browser cache, the system will revert to its default template data.'
      },
      {
        title: 'Can I add custom tasks to a workstation?',
        content: 'Yes! Navigate to the Workstation Setup page. You can click the "Edit" icon on any station to add specific tasks, assign their standard completion times (in minutes), and define their complexity. The sum of these tasks becomes that station\'s total Cycle Time.'
      }
    ]
  }
];

export default function HelpCenterPage() {
  const [expandedSection, setExpandedSection] = useState<string>('getting-started');
  const [expandedTopic, setExpandedTopic] = useState<string>('');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  const toggleTopic = (topicTitle: string) => {
    setExpandedTopic(expandedTopic === topicTitle ? '' : topicTitle);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Balansya Documentation</h2>
        <p className="text-gray-600 mt-1">System guidelines, Lean Six Sigma methodologies, and troubleshooting</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left shadow-sm ${
                expandedSection === section.id
                  ? 'border-blue-500 bg-blue-50/50 shadow-md transform -translate-y-0.5'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <Icon className="w-6 h-6 text-blue-600 mb-3" />
              <div className="font-bold text-gray-900">{section.title}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">{section.topics.length} detailed topics</div>
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {helpSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full px-6 py-5 flex items-center justify-between transition-colors ${isExpanded ? 'bg-gray-50/80 border-b border-gray-100' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isExpanded ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                </div>
                <div className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-gray-200' : 'group-hover:bg-gray-200'}`}>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-6 space-y-3 bg-white">
                  {section.topics.map((topic, index) => {
                    const isTopicExpanded = expandedTopic === `${section.id}-${topic.title}`;

                    return (
                      <div key={index} className={`rounded-lg border transition-all duration-200 overflow-hidden ${isTopicExpanded ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 hover:border-blue-300'}`}>
                        <button
                          onClick={() => toggleTopic(`${section.id}-${topic.title}`)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left"
                        >
                          <span className={`font-semibold text-sm ${isTopicExpanded ? 'text-blue-900' : 'text-gray-800'}`}>{topic.title}</span>
                          {isTopicExpanded ? (
                            <ChevronDown className="w-4 h-4 text-blue-500 flex-shrink-0 ml-2" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                          )}
                        </button>

                        {isTopicExpanded && (
                          <div className="px-5 pb-5 pt-1">
                            <div className="w-8 h-1 bg-blue-200 rounded-full mb-3"></div>
                            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                              {topic.content}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Capstone Footer */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl p-8 text-white shadow-lg mt-8 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Balansya: Workforce Optimization System</h3>
            <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
              Developed as a 2026 Capstone Project. This system is designed to apply industrial engineering principles to culinary operations, demonstrating the practical value of workload balancing and constraint identification.
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-lg text-center">
            <p className="text-xs text-blue-200 uppercase tracking-widest font-bold mb-1">Version</p>
            <p className="text-2xl font-black">2.0.01</p>
          </div>
        </div>
      </div>
    </div>
  );
}