'use client';

interface Step {
  label: string;
  number: number;
}

interface ProgressBarProps {
  currentStep: number;
  steps: Step[];
}

export default function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <div className="mb-8 w-full">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center">
              {/* Step Circle */}
              <div
                className={`flex h-3 w-3 items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isCurrent
                      ? 'border-2 border-emerald-500 bg-white'
                      : 'border-2 border-stone-300 bg-white'
                }`}
              />

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`h-0.5 w-16 transition-all ${
                    isCompleted ? 'bg-emerald-500' : 'bg-stone-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
