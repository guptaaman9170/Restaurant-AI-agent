import MatchScore from "./MatchScore";
import MenuHighlights from "./MenuHighlights";
import ReviewInsights from "./ReviewInsights";

const RecommendationCard = ({
  restaurant,
  rank,
  onExplore,
}) => {
  const reviewInsights =
    restaurant?.reviewInsights || {};

  const menuHighlights =
    restaurant?.menuHighlights || [];

  const evidence =
    restaurant?.evidence || [];

  return (
    <article className="border-b border-[#d8cec6] py-10 sm:py-14">

      {/* Top section */}
      <div className="grid gap-8 lg:grid-cols-[120px_1fr_auto] lg:items-start">

        {/* Rank */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#766b65]">
            Rank
          </p>

          <p className="mt-2 font-editorial text-5xl leading-none text-[#a64d32]">
            {String(rank).padStart(2, "0")}
          </p>
        </div>

        {/* Restaurant information */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a64d32]">
              Recommendation
            </p>

            {restaurant?.rating !== null &&
              restaurant?.rating !== undefined && (
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#766b65]">
                  ★ {restaurant.rating}
                </span>
              )}
          </div>

          <h2 className="mt-3 font-editorial text-4xl leading-[0.95] tracking-[-0.025em] text-[#1a1a1a] sm:text-5xl">
            {restaurant?.name || "Restaurant"}
          </h2>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#766b65]">
            {restaurant?.location && (
              <span>
                {restaurant.location}
              </span>
            )}

            {restaurant?.cuisine && (
              <span>
                {restaurant.cuisine}
              </span>
            )}

            {restaurant?.priceRange && (
              <span>
                {typeof restaurant.priceRange ===
                "object"
                  ? `${restaurant.priceRange.currency || ""}${
                      restaurant.priceRange.min ??
                      ""
                    }–${
                      restaurant.priceRange.max ??
                      ""
                    }`
                  : restaurant.priceRange}
              </span>
            )}
          </div>

          {restaurant?.description && (
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#766b65]">
              {restaurant.description}
            </p>
          )}

          {restaurant?.matchReason && (
            <div className="mt-6 max-w-2xl border-l border-[#a64d32] pl-4">
              <p className="text-sm leading-7 text-[#4a5d4e]">
                {restaurant.matchReason}
              </p>
            </div>
          )}
        </div>

        {/* Explore */}
        <div className="lg:pt-6">
          <button
            type="button"
            onClick={() =>
              onExplore?.(restaurant)
            }
            className="border border-[#1a1a1a] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f8f5f1]"
          >
            Explore
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">

        {/* Match score */}
        <MatchScore
          score={restaurant?.score ?? 0}
          breakdown={restaurant?.breakdown || {}}
        />

        {/* Menu */}
        <MenuHighlights
          items={menuHighlights}
        />
      </div>

      {/* Review insights */}
      <div className="mt-8">
        <ReviewInsights
          positive={
            reviewInsights?.positive || []
          }
          concerns={
            reviewInsights?.concerns || []
          }
          atmosphere={
            reviewInsights?.atmosphere
          }
          service={
            reviewInsights?.service
          }
          foodQuality={
            reviewInsights?.foodQuality
          }
          dietaryExperience={
            reviewInsights?.dietaryExperience
          }
        />
      </div>

      {/* Evidence */}
      {evidence.length > 0 && (
        <div className="mt-8 border-t border-[#d8cec6] pt-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#766b65]">
            Research evidence
          </p>

          <div className="mt-3 space-y-2">
            {evidence.map(
              (item, index) => (
                <div
                  key={`${item?.sourceUrl || "source"}-${index}`}
                  className="text-xs leading-5 text-[#766b65]"
                >
                  <span>
                    {item?.claim ||
                      "Supporting evidence"}
                  </span>

                  {item?.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 underline underline-offset-2 hover:text-[#a64d32]"
                    >
                      Source
                    </a>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Restaurant links */}
      {(restaurant?.websiteUrl ||
        restaurant?.menuUrl) && (
        <div className="mt-8 flex flex-wrap gap-5 border-t border-[#d8cec6] pt-6">
          {restaurant.websiteUrl && (
            <a
              href={restaurant.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#766b65] underline underline-offset-4 hover:text-[#a64d32]"
            >
              Restaurant website
            </a>
          )}

          {restaurant.menuUrl && (
            <a
              href={restaurant.menuUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#766b65] underline underline-offset-4 hover:text-[#a64d32]"
            >
              View menu
            </a>
          )}
        </div>
      )}
    </article>
  );
};

export default RecommendationCard;