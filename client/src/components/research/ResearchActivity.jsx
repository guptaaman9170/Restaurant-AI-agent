import { Activity, Search } from "lucide-react";

const ResearchActivity = ({
  activities = [],
  currentMessage,
}) => {
  return (
    <div className="border border-[#e5ddd7] bg-[#fdfbf8]">
      <div className="flex items-center justify-between border-b border-[#e5ddd7] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Activity
            size={17}
            strokeWidth={1.5}
            className="text-[#a64d32]"
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
            Research activity
          </span>
        </div>

        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#766b65]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#a64d32]" />
          Live
        </span>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {currentMessage && (
          <div className="mb-5 flex gap-3 border-b border-[#e5ddd7] pb-5">
            <Search
              size={15}
              strokeWidth={1.5}
              className="mt-1 shrink-0 text-[#a64d32]"
            />

            <p className="text-sm leading-6 text-[#1a1a1a]">
              {currentMessage}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id || index}
              className="flex gap-3 text-sm"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b7aaa1]" />

              <p className="leading-6 text-[#766b65]">
                {activity.message}
              </p>
            </div>
          ))}
        </div>

        {!activities.length && !currentMessage && (
          <p className="text-sm text-[#766b65]">
            Preparing research...
          </p>
        )}
      </div>
    </div>
  );
};

export default ResearchActivity;