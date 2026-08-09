import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  MapPin,
  Share2,
} from "lucide-react";
import MenuHighlights from "../components/recommendations/MenuHighlights";
import ReviewInsights from "../components/recommendations/ReviewInsights";
import Evidence from "../components/recommendations/Evidence";
import MatchScore from "../components/recommendations/MatchScore";

const mockRestaurant = {
  name: "Vegetalia",
  image:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=85",
  location: "Barcelona",
  cuisine: "Vegetarian · Mediterranean",
  priceRange: "€20–30",
  score: 92,

  description:
    "A strong fit for a relaxed vegetarian dinner, with a generous selection of plant-based dishes and an atmosphere that suits a quieter evening.",

  matchReason:
    "Vegetalia aligns particularly well with your vegetarian preference and budget. Reviews also consistently mention a relaxed atmosphere, making it a strong choice for the evening.",

  breakdown: [
    { label: "Vegetarian", value: 100 },
    { label: "Budget", value: 90 },
    { label: "Dinner", value: 100 },
    { label: "Quiet atmosphere", value: 90 },
    { label: "Spanish cuisine", value: 80 },
  ],

  menuHighlights: [
    {
      name: "Vegetable Paella",
      price: "€14",
      description: "Seasonal vegetables and saffron rice",
    },
    {
      name: "Patatas Bravas",
      price: "€8",
      description: "Crispy potatoes with house bravas sauce",
    },
    {
      name: "Seasonal Tapas",
      price: "€10",
      description: "Rotating vegetarian selection",
    },
  ],

  reviewInsights: {
    positive: [
      "Quiet atmosphere",
      "Strong vegetarian selection",
      "Friendly service",
    ],
    concerns: [
      "Can get busy during peak hours",
      "Service may slow down at dinner",
    ],
  },

  evidence: [
    {
      claim: "Vegetalia offers a broad selection of vegetarian dishes.",
      source: "Restaurant website",
      url: "https://example.com",
    },
    {
      claim: "The restaurant offers dishes within the requested budget range.",
      source: "Menu",
      url: "https://example.com",
    },
    {
      claim: "Reviews frequently mention a calm atmosphere.",
      source: "Review source",
      url: "https://example.com",
    },
  ],
};

const RestaurantDetail = ({
  restaurant = mockRestaurant,
  onBack,
}) => {
  return (
    <main className="min-h-screen bg-[#f8f5f1]">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12 lg:pb-24">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="group mb-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#766b65] transition-colors hover:text-[#a64d32]"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.4}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to research
        </button>

        {/* Hero */}
        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          {/* Image */}
          <div className="relative overflow-hidden bg-[#e9e0d8]">
            <div className="aspect-[4/3] lg:aspect-[16/10]">
              {restaurant.image ? (
                <img
                  src={restaurant.image}
                  alt={`${restaurant.name} restaurant`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-editorial text-3xl italic text-[#766b65]">
                    {restaurant.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Intro */}
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a64d32]">
              Restaurant detail
            </p>

            <h1 className="mt-4 font-editorial text-5xl leading-[0.98] tracking-[-0.035em] text-[#1a1a1a] sm:text-6xl lg:text-7xl">
              {restaurant.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#766b65]">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} strokeWidth={1.4} />
                {restaurant.location}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#b7aaa1]" />

              <span>{restaurant.cuisine}</span>

              <span className="h-1 w-1 rounded-full bg-[#b7aaa1]" />

              <span>{restaurant.priceRange}</span>
            </div>

            <div className="mt-8 flex items-end justify-between border-y border-[#d8cec6] py-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#766b65]">
                  Match
                </p>

                <p className="mt-1 font-editorial text-5xl text-[#a64d32]">
                  {restaurant.score}%
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Save restaurant"
                  className="flex h-11 w-11 items-center justify-center border border-[#d8cec6] text-[#1a1a1a] transition-colors hover:border-[#a64d32] hover:text-[#a64d32]"
                >
                  <Bookmark size={17} strokeWidth={1.4} />
                </button>

                <button
                  type="button"
                  aria-label="Share restaurant"
                  className="flex h-11 w-11 items-center justify-center border border-[#d8cec6] text-[#1a1a1a] transition-colors hover:border-[#a64d32] hover:text-[#a64d32]"
                >
                  <Share2 size={17} strokeWidth={1.4} />
                </button>
              </div>
            </div>

            <p className="mt-7 font-editorial text-xl italic leading-8 text-[#4a5d4e] sm:text-2xl">
              "{restaurant.description}"
            </p>
          </div>
        </section>

        {/* Research explanation */}
        <section className="mt-16 grid gap-12 border-t border-[#d8cec6] pt-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#766b65]">
              Why we chose it
            </p>

            <h2 className="mt-3 font-editorial text-3xl text-[#1a1a1a] sm:text-4xl">
              A strong match for your evening.
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-base leading-8 text-[#766b65]">
              {restaurant.matchReason}
            </p>

            <div className="mt-8 max-w-2xl">
              <MatchScore
                score={restaurant.score}
                breakdown={restaurant.breakdown}
              />
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="mt-16 grid gap-12 border-t border-[#d8cec6] pt-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#766b65]">
              Menu
            </p>

            <MenuHighlights items={restaurant.menuHighlights} />
          </div>

          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#766b65]">
              Reviews
            </p>

            <ReviewInsights
              positive={restaurant.reviewInsights?.positive || []}
              concerns={restaurant.reviewInsights?.concerns || []}
            />
          </div>
        </section>

        {/* Evidence */}
        <section className="mt-16 max-w-4xl border-t border-[#d8cec6] pt-12">
          <Evidence evidence={restaurant.evidence} />
        </section>

        {/* External action */}
        <section className="mt-14 border-t border-[#d8cec6] pt-8">
          <button
            type="button"
            className="group inline-flex items-center gap-2 bg-[#a64d32] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition-colors hover:bg-[#631d21]"
          >
            Visit restaurant
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </section>
      </div>
    </main>
  );
};

export default RestaurantDetail;