import {
  Activity,
  Search,
  Check,
} from "lucide-react";

const ResearchActivity = ({
  activities = [],
  completedActivities = [],
  currentMessage,
  currentStep,
}) => {
  return (
    <div className="border border-[#e5ddd7] bg-[#fbf9f6]">

      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-[#e5ddd7] px-5 py-4 sm:px-6">

        <div className="flex items-center gap-3">
          <Activity
            size={14}
            strokeWidth={1.5}
            className="text-[#a64d32]"
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
            Research activity
          </span>
        </div>

        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#766b65]">

          <span
            className={`h-1.5 w-1.5 rounded-full ${
              currentStep
                ? "animate-pulse bg-[#a64d32]"
                : "bg-[#4a5d4e]"
            }`}
          />

          {currentStep
            ? "Live"
            : "Complete"}
        </span>
      </div>

      {/* BODY */}

      <div className="px-5 py-5 sm:px-6">

        {/* CURRENT TASK */}

        {currentMessage && (
          <div className="mb-5 flex gap-3 border-b border-[#e5ddd7] pb-5">

            <Search
              size={15}
              strokeWidth={1.5}
              className="mt-1 shrink-0 text-[#a64d32]"
            />

            <div className="min-w-0">
              <p className="text-sm leading-6 text-[#1a1a1a]">
                {currentMessage}
              </p>

              {currentStep && (
                <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-[#a64d32]">
                  In progress
                </p>
              )}
            </div>

          </div>
        )}

        {/* COMPLETED RESEARCH STEPS */}

        {completedActivities.length >
          0 && (
          <div className="mb-6">

            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#766b65]">
              Completed tasks
            </p>

            <div className="space-y-3">

              {completedActivities.map(
                (activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3"
                  >

                    {/* CHECK */}

                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#4a5d4e]">
                      <Check
                        size={10}
                        strokeWidth={2}
                        className="text-white"
                      />
                    </span>

                    {/* CONTENT */}

                    <div className="min-w-0">
                      <p className="text-sm leading-5 text-[#766b65]">
                        {activity.message}
                      </p>

                      {activity.timestamp && (
                        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#a64d32]">
                          Completed at{" "}
                          {activity.timestamp}
                        </p>
                      )}
                    </div>

                  </div>
                )
              )}

            </div>
          </div>
        )}

        {/* RESEARCH METADATA */}

        {activities.length >
          0 && (
          <div
            className={`${
              completedActivities.length >
              0
                ? "border-t border-[#e5ddd7] pt-5"
                : ""
            }`}
          >

            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#766b65]">
              Research signals
            </p>

            <div className="space-y-3">

              {activities.map(
                (activity, index) => (
                  <div
                    key={
                      activity.id ||
                      index
                    }
                    className="flex gap-3 text-sm"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b7aaa1]" />

                    <p className="leading-6 text-[#766b65]">
                      {activity.message}
                    </p>
                  </div>
                )
              )}

            </div>
          </div>
        )}

        {/* EMPTY STATE */}

        {!activities.length &&
          !completedActivities.length &&
          !currentMessage && (
            <p className="text-sm text-[#766b65]">
              Preparing research...
            </p>
          )}

      </div>
    </div>
  );
};

export default ResearchActivity;