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
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {workflowSteps.map((step, index) => (
            <div key={step.stage} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                  ${currentStage > step.stage ? 'bg-blue-600 text-white' :
                    currentStage === step.stage ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600' :
                    'bg-gray-100 text-gray-400'}
                `}>
                  {currentStage > step.stage ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{step.stage}</span>
                  )}
                </div>
                <span className={`text-sm font-medium whitespace-nowrap ${
                  currentStage >= step.stage ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-4 ${
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
