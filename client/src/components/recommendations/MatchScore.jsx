const MatchScore = ({
  score = 0,
  breakdown = {},
}) => {
  const breakdownLabels = {
    budget: "Budget",
    dietary: "Dietary",
    cuisine: "Cuisine",
    quietness: "Quietness",
    menu: "Menu",
    evidence: "Evidence",
  };

  const breakdownItems = Array.isArray(breakdown)
    ? breakdown
    : Object.entries(breakdown || {}).map(
        ([key, value]) => ({
          label:
            breakdownLabels[key] ||
            key.charAt(0).toUpperCase() +
              key.slice(1),

          value:
            typeof value === "object"
              ? value?.score ?? 0
              : value ?? 0,

          reason:
            typeof value === "object"
              ? value?.reason || ""
              : "",
        })
      );

  return (
    <div className="mt-8 border-y border-[#d8cec6] py-6">

      {/* Overall score */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#766b65]">
            Match score
          </p>

          <p className="mt-1 font-editorial text-4xl leading-none text-[#a64d32]">
            {Math.round(score)}%
          </p>
        </div>

        <p className="pb-1 text-right text-[10px] uppercase tracking-[0.14em] text-[#766b65]">
          Preference alignment
        </p>
      </div>

      {/* Breakdown */}
      {breakdownItems.length > 0 && (
        <div className="mt-6 space-y-5">
          {breakdownItems.map((item) => {
            const value = Math.min(
              Math.max(Number(item.value) || 0, 0),
              100
            );

            return (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#766b65]">
                    {item.label}
                  </span>

                  <span className="text-[10px] font-medium text-[#1a1a1a]">
                    {value}%
                  </span>
                </div>

                <div className="h-px w-full bg-[#ded5ce]">
                  <div
                    className="h-px bg-[#4a5d4e] transition-all duration-700"
                    style={{
                      width: `${value}%`,
                    }}
                  />
                </div>

                {/* Reason */}
                {item.reason && (
                  <p className="mt-1.5 text-[10px] leading-5 text-[#8a7d75]">
                    {item.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchScore;