import { useState } from 'react';
import { BookOpen, Calculator, HelpCircle, FileQuestion, ChevronDown, ChevronRight } from 'lucide-react';

const helpSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    topics: [
      {
        title: 'How to Use Balansya',
        content: 'Balansya is a daily operations tool for culinary enterprises. Start by setting up your workforce availability, then input your daily menu and expected demand. The system will analyze workload distribution and provide station assignment recommendations.'
      },
      {
        title: 'Daily Workflow',
        content: 'Follow this sequence: 1) Update Workforce Availability → 2) Input Daily Menu → 3) Set Demand & Events → 4) Review Skill Matrix → 5) Check Takt Time Analysis → 6) Monitor Utilization → 7) Identify Bottlenecks → 8) Review Station Assignments → 9) Monitor Dashboard'
      },
      {
        title: 'Navigating the System',
        content: 'Use the left sidebar to access different modules. The workflow progress bar at the top shows your current position in the daily setup process. Click on any module to jump directly to that page.'
      }
    ]
  },
  {
    id: 'formulas',
    title: 'System Formulas',
    icon: Calculator,
    topics: [
      {
        title: 'Takt Time Formula',
        content: 'Takt Time = Available Working Time / Expected Demand\n\nExample: If you have 480 minutes (8 hours) of available working time and expect 200 orders:\nTakt Time = 480 minutes / 200 orders = 2.4 minutes per order (144 seconds)\n\nThis tells you how frequently you need to complete an order to meet demand.'
      },
      {
        title: 'Utilization Formula',
        content: 'Utilization % = (Total Work Time / Available Time) × 100\n\nExample: If a worker has 6 hours (360 minutes) of tasks and 8 hours (480 minutes) available:\nUtilization = (360 / 480) × 100 = 75%\n\nGood utilization range: 75-90%. Below 75% indicates idle time, above 90% may cause burnout.'
      },
      {
        title: 'Line Efficiency Formula',
        content: 'Line Efficiency % = (Actual Output / Theoretical Maximum Output) × 100\n\nExample: If your kitchen can theoretically produce 250 orders but actually produces 230:\nLine Efficiency = (230 / 250) × 100 = 92%\n\nHigher efficiency means better use of resources and less waste.'
      },
      {
        title: 'Bottleneck Identification',
        content: 'A station is identified as a bottleneck when:\n\n1. Utilization > 95%\n2. Task time > Takt time\n3. Queue pressure is high\n4. Processing time is slowest in the line\n\nThe system highlights these stations for immediate attention and rebalancing.'
      }
    ]
  },
  {
    id: 'modules',
    title: 'Module Instructions',
    icon: HelpCircle,
    topics: [
      {
        title: 'Workforce Management',
        content: 'Add and manage worker profiles including skills, experience, and employment status. This data feeds into skill matrix and assignment recommendations.\n\nKey Actions:\n- Add new workers with complete profiles\n- Edit existing worker information\n- Archive resigned workers\n- Track training and competencies'
      },
      {
        title: 'Daily Availability',
        content: 'Mark which workers are present, absent, or on leave for the current day. This affects all downstream calculations.\n\nKey Actions:\n- Update attendance status daily\n- Set work schedules\n- Note special conditions (half-day, training, etc.)'
      },
      {
        title: 'Menu Input',
        content: 'Define dishes, preparation times, and complexity. Active menu items affect workload calculations.\n\nKey Actions:\n- Add new menu items\n- Set preparation, cooking, and plating times\n- Mark items as active for the day\n- Specify required skills and stations'
      },
      {
        title: 'Demand & Events',
        content: 'Input expected orders and special conditions that affect workload and timing.\n\nKey Actions:\n- Set expected order count\n- Define peak hours\n- Select event type (normal, promo, holiday, catering)\n- Set service mode (dine-in, takeout, mixed)'
      },
      {
        title: 'Skill Matrix',
        content: 'View and edit worker skill ratings for each station type. The system prioritizes available workers.\n\nKey Actions:\n- Rate worker skills (1-5 scale)\n- Review skill gaps\n- Filter by availability\n- Update competency levels'
      },
      {
        title: 'Station Assignment',
        content: 'View system recommendations and manually adjust worker-to-station assignments.\n\nKey Actions:\n- Review recommended assignments\n- Override with manual assignments\n- Check skill match levels\n- Save changes for the day'
      }
    ]
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    icon: FileQuestion,
    topics: [
      {
        title: 'What is a good utilization percentage?',
        content: 'Optimal utilization is 75-90%. Below 75% means idle time and potential for more work. Above 90% risks worker fatigue and errors. At 100%, workers have no buffer for breaks or unexpected issues.'
      },
      {
        title: 'How do I handle bottlenecks?',
        content: 'When the system identifies a bottleneck:\n\n1. Check if you can reassign tasks to other stations\n2. Add another worker to that station if available\n3. Simplify or streamline the process\n4. Consider if some prep work can be done in advance\n5. Use the Station Assignment page to implement changes'
      },
      {
        title: 'Why does takt time matter?',
        content: 'Takt time sets the rhythm for your kitchen. If any station takes longer than takt time, you\'ll fall behind on orders. All stations should complete their work within the takt time to maintain smooth flow.'
      },
      {
        title: 'Can I override system recommendations?',
        content: 'Yes! Balansya provides recommendations based on data, but you can manually override any assignment. The system shows both the recommended and your custom assignments.'
      },
      {
        title: 'How often should I update the system?',
        content: 'Update daily before service begins:\n\n- Morning: Set workforce availability\n- Before service: Input menu and demand\n- During service: Monitor dashboard for issues\n- End of day: Review performance reports'
      },
      {
        title: 'What if I don\'t have exact time data?',
        content: 'Start with estimates. Observe actual performance and refine your numbers over time. Even approximate data helps identify patterns and improvement opportunities.'
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
        <h2 className="text-2xl font-semibold text-gray-900">Help Center</h2>
        <p className="text-gray-600 mt-1">Comprehensive guide to using Balansya effectively</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                expandedSection === section.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <Icon className="w-6 h-6 text-blue-600 mb-2" />
              <div className="font-medium text-gray-900">{section.title}</div>
              <div className="text-xs text-gray-500 mt-1">{section.topics.length} topics</div>
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
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-4 space-y-2">
                  {section.topics.map((topic, index) => {
                    const isTopicExpanded = expandedTopic === `${section.id}-${topic.title}`;

                    return (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleTopic(`${section.id}-${topic.title}`)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="font-medium text-gray-900 text-sm">{topic.title}</span>
                          {isTopicExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                          )}
                        </button>

                        {isTopicExpanded && (
                          <div className="px-4 pb-4 pt-2">
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

      {/* Contact Support */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Need More Help?</h3>
        <p className="text-sm text-blue-800 mb-4">
          If you can't find the answer you're looking for, please contact your system administrator or capstone project team.
        </p>
        <div className="text-xs text-blue-700">
          <p>Balansya - Workforce Optimization System for Culinary Enterprises</p>
          <p className="mt-1">Capstone Project 2026</p>
        </div>
      </div>
    </div>
  );
}
