import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ReviewInsights = ({
  positive = [],
  concerns = [],
  atmosphere = null,
  service = null,
  foodQuality = null,
  dietaryExperience = null,
}) => {
  const [open, setOpen] = useState(false);

  const hasDetailedInsights =
    atmosphere ||
    service ||
    foodQuality ||
    dietaryExperience;

  return (
    <div className="border-t border-[#d8cec6]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-14 w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
          Review insights
        </span>

        <ChevronDown
          size={17}
          strokeWidth={1.4}
          className={`shrink-0 text-[#766b65] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="pb-6">

          {/* Detailed review analysis */}
          {hasDetailedInsights && (
            <div className="grid gap-5 border-b border-[#e2d9d2] pb-6 sm:grid-cols-2">

              {/* Atmosphere */}
              {atmosphere && (
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4a5d4e]">
                    Atmosphere
                  </p>

                  <div className="mt-2 space-y-1">
                    {atmosphere.quiet !== null &&
                      atmosphere.quiet !== undefined && (
                        <p className="text-sm leading-6 text-[#766b65]">
                          {atmosphere.quiet
                            ? "Quiet atmosphere"
                            : "May be lively or less quiet"}
                        </p>
                      )}

                    {atmosphere.description && (
                      <p className="text-xs leading-5 text-[#8a7d75]">
                        {atmosphere.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Service */}
              {service && (
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4a5d4e]">
                    Service
                  </p>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm capitalize leading-6 text-[#766b65]">
                      {service.sentiment || "Unknown"}
                    </p>

                    {service.description && (
                      <p className="text-xs leading-5 text-[#8a7d75]">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Food quality */}
              {foodQuality && (
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4a5d4e]">
                    Food quality
                  </p>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm capitalize leading-6 text-[#766b65]">
                      {foodQuality.sentiment || "Unknown"}
                    </p>

                    {foodQuality.description && (
                      <p className="text-xs leading-5 text-[#8a7d75]">
                        {foodQuality.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Dietary experience */}
              {dietaryExperience && (
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4a5d4e]">
                    Dietary experience
                  </p>

                  <div className="mt-2 space-y-1">
                    {dietaryExperience.vegetarianFriendly !==
                      null &&
                      dietaryExperience.vegetarianFriendly !==
                        undefined && (
                        <p className="text-sm leading-6 text-[#766b65]">
                          {dietaryExperience.vegetarianFriendly
                            ? "Vegetarian-friendly"
                            : "Vegetarian friendliness not established"}
                        </p>
                      )}

                    {dietaryExperience.description && (
                      <p className="text-xs leading-5 text-[#8a7d75]">
                        {dietaryExperience.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Positive insights / concerns */}
          <div className="grid gap-6 pt-6 sm:grid-cols-2">

            {/* Positive */}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#4a5d4e]">
                People appreciate
              </p>

              <ul className="mt-3 space-y-2">
                {positive.length > 0 ? (
                  positive.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-sm leading-6 text-[#766b65]"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#4a5d4e]" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[#766b65]">
                    No positive review insights available.
                  </li>
                )}
              </ul>
            </div>

            {/* Concerns */}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#631d21]">
                Worth knowing
              </p>

              <ul className="mt-3 space-y-2">
                {concerns.length > 0 ? (
                  concerns.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-sm leading-6 text-[#766b65]"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#631d21]" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[#766b65]">
                    No concerns reported.
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewInsights;