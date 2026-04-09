'use client';

import { motion } from 'framer-motion';

interface Step {
  id: string;
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step circle */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    transition-colors duration-300
                    ${isCompleted || isCurrent 
                      ? 'bg-primary-pink text-white' 
                      : 'bg-gray-200 text-gray-500'}
                  `}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 2 }}
                >
                  {isCompleted ? '✓' : index + 1}
                </motion.div>
                
                {/* Step label */}
                <span 
                  className={`
                    absolute -bottom-6 text-xs whitespace-nowrap
                    ${isCurrent ? 'text-primary-pink font-medium' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="w-12 md:w-20 h-0.5 mx-1 relative">
                  <div className="absolute inset-0 bg-gray-200" />
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary-pink"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

