import ResearchActivity from "../components/research/ResearchActivity";
import ResearchTimeline from "../components/research/ResearchTimeline";

const defaultSteps = [
  {
    id: "preferences",
    label: "Understanding your preferences",
    status: "completed",
  },
  {
    id: "search",
    label: "Searching for restaurants",
    status: "completed",
  },
  {
    id: "shortlist",
    label: "Comparing candidates",
    status: "running",
    description:
      "Comparing restaurants against your location, cuisine, budget and dining preferences.",
  },
  {
    id: "menus",
    label: "Reading menus",
    status: "pending",
  },
  {
    id: "reviews",
    label: "Analyzing reviews",
    status: "pending",
  },
  {
    id: "ranking",
    label: "Ranking the shortlist",
    status: "pending",
  },
];

const Research = ({
  query = "Quiet vegetarian dinner in Barcelona under €30",
}) => {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f5f1]">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a64d32]">
            DineScout AI
          </p>

          <h1 className="font-editorial text-4xl leading-tight tracking-[-0.025em] text-[#1a1a1a] sm:text-5xl lg:text-6xl">
            Researching your request.
          </h1>

          <p className="mt-6 font-editorial text-xl italic leading-8 text-[#766b65] sm:text-2xl">
            “{query}”
          </p>
        </div>

        {/* Research workspace */}
        <div className="mt-16 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          {/* Timeline */}
          <section>
            <div className="mb-8 border-b border-[#d8cec6] pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#766b65]">
                Research journal
              </p>
            </div>

            <ResearchTimeline steps={defaultSteps} />
          </section>

          {/* Activity */}
          <section>
            <div className="mb-8 border-b border-[#d8cec6] pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#766b65]">
                What we're looking into
              </p>
            </div>

            <ResearchActivity
              currentMessage="Comparing restaurants against your preferences."
              activities={[
                {
                  message: "8 restaurants discovered.",
                },
                {
                  message: "5 restaurants meet the initial criteria.",
                },
                {
                  message: "Checking vegetarian menu options.",
                },
                {
                  message: "Comparing atmosphere and review signals.",
                },
              ]}
            />

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-[#d8cec6] pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="font-editorial text-3xl text-[#1a1a1a]">
                  8
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#766b65]">
                  Discovered
                </p>
              </div>

              <div>
                <p className="font-editorial text-3xl text-[#1a1a1a]">
                  5
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#766b65]">
                  Shortlisted
                </p>
              </div>

              <div>
                <p className="font-editorial text-3xl text-[#1a1a1a]">
                  5
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#766b65]">
                  Menus
                </p>
              </div>

              <div>
                <p className="font-editorial text-3xl text-[#1a1a1a]">
                  12+
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#766b65]">
                  Sources
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Research;