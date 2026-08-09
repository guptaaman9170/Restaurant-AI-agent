import { ArrowDown } from "lucide-react";
import ResearchInput from "./ResearchInput";
import SuggestionLinks from "./SuggestionLinks";

const Hero = ({ onResearch }) => {
  const handleSuggestion = (suggestion) => {
    onResearch?.(suggestion);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          {/* Editorial Content */}
          <div className="max-w-2xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a64d32]">
              AI restaurant research
            </p>

            <h1 className="font-editorial text-[3.4rem] leading-[0.98] tracking-[-0.035em] text-[#1a1a1a] sm:text-6xl lg:text-[5.4rem] xl:text-[6.2rem]">
              Find somewhere
              <br />
              <span className="italic">worth remembering.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#766b65] sm:text-lg sm:leading-8">
              Tell us where, what, and how you want to dine. DineScout
              researches restaurants, menus and reviews before making a
              recommendation.
            </p>

            <div className="mt-9 max-w-2xl">
              <ResearchInput onSubmit={onResearch} />

              <SuggestionLinks onSelect={handleSuggestion} />
            </div>

            <div className="mt-8 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#766b65]">
              <span className="h-px w-8 bg-[#a64d32]" />
              <span>Web research</span>
              <span>·</span>
              <span>Menu analysis</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">Review insights</span>
            </div>
          </div>

          {/* Editorial Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e0d8]">
              <img
                src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85"
                alt="Elegant restaurant dining room"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/30 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em]">
                    Curated by research
                  </p>
                  <p className="mt-1 font-editorial text-xl italic sm:text-2xl">
                    Not just rankings.
                  </p>
                </div>

                <ArrowDown
                  size={19}
                  strokeWidth={1.3}
                  className="mb-1"
                />
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden h-24 w-24 border-l border-b border-[#a64d32] sm:block lg:-bottom-7 lg:-left-7" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;