import { Check, Circle } from "lucide-react";

const ResearchTimeline = ({ steps = [] }) => {
  return (
    <div className="relative">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id || index} className="relative flex gap-5">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[7px] top-7 h-[calc(100%-4px)] w-px bg-[#d8cec6]" />
            )}

            {/* Status */}
            <div className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center bg-[#f8f5f1]">
              {step.status === "completed" && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#4a5d4e] text-white">
                  <Check size={10} strokeWidth={2.5} />
                </span>
              )}

              {step.status === "running" && (
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute h-4 w-4 animate-ping rounded-full bg-[#a64d32]/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#a64d32]" />
                </span>
              )}

              {step.status === "pending" && (
                <Circle
                  size={13}
                  strokeWidth={1.2}
                  className="text-[#b7aaa1]"
                />
              )}

              {step.status === "failed" && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#631d21]" />
              )}
            </div>

            {/* Content */}
            <div className="pb-9">
              <p
                className={`text-sm ${
                  step.status === "running"
                    ? "font-medium text-[#1a1a1a]"
                    : step.status === "completed"
                      ? "text-[#4a5d4e]"
                      : "text-[#766b65]"
                }`}
              >
                {step.label}
              </p>

              {step.status === "running" && step.description && (
                <p className="mt-2 max-w-md text-sm leading-6 text-[#766b65]">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResearchTimeline;