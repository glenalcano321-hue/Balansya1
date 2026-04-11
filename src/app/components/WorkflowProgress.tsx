import { Check, Circle } from 'lucide-react';
import { useLocation } from 'react-router';

const workflowSteps = [
  { stage: 1, label: 'Daily Setup', paths: ['/workforce-availability', '/menu-input', '/demand-input'] },
  { stage: 2, label: 'System Analysis', paths: ['/skill-matrix', '/takt-time', '/utilization', '/bottleneck'] },
  { stage: 3, label: 'Recommendations', paths: ['/station-assignment', '/kitchen-layout'] },
  { stage: 4, label: 'Monitoring', paths: ['/', '/performance'] },
];

export default function WorkflowProgress() {
  const location = useLocation();

  const getCurrentStage = () => {
    const step = workflowSteps.find(step =>
      step.paths.some(path => location.pathname === path)
    );
    return step?.stage || 0;
  };

  const currentStage = getCurrentStage();

  return (
    <div className="bg-white border-b border-gray-200 w-full shadow-sm">
      <div className="max-w-6xl mx-auto">
        {/* Responsive wrapper: allows swiping on mobile, hides the scrollbar, and spaces out on desktop */}
        <div 
          className="flex items-center px-4 py-4 md:px-8 overflow-x-auto whitespace-nowrap w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Custom style to hide the webkit scrollbar on Chrome/Safari */}
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {workflowSteps.map((step, index) => (
            /* flex-shrink-0 ensures it doesn't squash on mobile, md:flex-1 spreads it evenly on desktop */
            <div key={step.stage} className="flex items-center flex-shrink-0 md:flex-1">
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`
                  w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm
                  ${currentStage > step.stage ? 'bg-blue-600 text-white' :
                    currentStage === step.stage ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600' :
                    'bg-gray-100 text-gray-400'}
                `}>
                  {currentStage > step.stage ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <span>{step.stage}</span>
                  )}
                </div>
                
                <span className={`text-xs sm:text-sm font-medium ${
                  currentStage >= step.stage ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>

              {/* Connector line: Fixed width on mobile, flexible on desktop */}
              {index < workflowSteps.length - 1 && (
                <div className={`h-0.5 w-6 sm:w-10 md:flex-1 mx-2 sm:mx-4 ${
                  currentStage > step.stage ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}