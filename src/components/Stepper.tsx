// components/Stepper.tsx
import React from "react";

export interface Step<T = number | string> {
  key: T;
  label: string;
  content: React.ReactNode;
}

interface StepperProps<T = number | string> {
  steps: Step<T>[];
  activeStep: T;
  onStepChange?: (stepKey: T) => void; 
}

function Stepper<T = number | string>({ steps, activeStep, onStepChange }: StepperProps<T>) {
  const activeIndex = steps.findIndex((step) => step.key === activeStep);

  return (
    <div className="stepper">
      <div className="stepper-header" style={{ display: "flex", gap: 16 }}>
        {steps.map((step, index) => {
          const isActive = step.key === activeStep;
          const isCompleted = index < activeIndex;

          return (
            <div
              key={String(step.key)}
              onClick={() => onStepChange && onStepChange(step.key)}
              style={{
                cursor: onStepChange ? "pointer" : "default",
                padding: "8px 12px",
                borderRadius: 4,
                backgroundColor: isActive ? "#1976d2" : isCompleted ? "#90caf9" : "#e0e0e0",
                color: isActive ? "white" : "black",
                fontWeight: isActive ? "bold" : "normal",
                userSelect: "none",
              }}
              aria-current={isActive ? "step" : undefined}
              role="button"
              tabIndex={onStepChange ? 0 : -1}
            >
              {step.label}
            </div>
          );
        })}
      </div>
      <div className="stepper-content" style={{ marginTop: 24 }}>
        {activeIndex !== -1 ? steps[activeIndex].content : null}
      </div>
    </div>
  );
}

export default Stepper;