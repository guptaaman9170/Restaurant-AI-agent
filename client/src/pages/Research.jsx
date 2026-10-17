import { useEffect, useMemo, useState } from "react";

import ResearchActivity from "../components/research/ResearchActivity";
import ResearchTimeline from "../components/research/ResearchTimeline";

const defaultSteps = [
  {
    id: "preferences",
    label: "Understanding your preferences",
    status: "pending",
  },
  {
    id: "search",
    label: "Searching for restaurants",
    status: "pending",
  },
  {
    id: "shortlist",
    label: "Comparing candidates",
    status: "pending",
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
  {
    id: "final_recommendation",
    label: "Preparing recommendations",
    status: "pending",
  },
];

/*
 * Backend LangGraph step IDs -> UI step IDs
 */
const backendToUiStep = {
  intent: "preferences",
  preferences: "preferences",
  understanding_preferences: "preferences",

  restaurant_discovery: "search",
  discovery: "search",

  shortlisting: "shortlist",
  shortlist: "shortlist",

  menu_research: "menus",
  menu: "menus",

  review_research: "reviews",
  review: "reviews",

  ranking: "ranking",
  recommendation: "ranking",

  final_recommendation: "final_recommendation",
  final: "final_recommendation",
};

/*
 * Convert ISO timestamp into local browser time.
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  ).format(date);
};

const Research = ({
  query = "Quiet vegetarian dinner in Barcelona under €30",
  researchProgress = [],
  researchStartedAt = null,
}) => {
  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  /*
   * ------------------------------------------------
   * LIVE TIMER
   * ------------------------------------------------
   */

  useEffect(() => {
    if (!researchStartedAt) {
      return;
    }

    const updateTimer = () => {
      const elapsed = Math.floor(
        (Date.now() - researchStartedAt) /
          1000
      );

      setElapsedSeconds(
        Math.max(elapsed, 0)
      );
    };

    updateTimer();

    const interval = setInterval(
      updateTimer,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [researchStartedAt]);

  /*
   * ------------------------------------------------
   * FORMAT ELAPSED TIME
   * ------------------------------------------------
   */

  const formatElapsedTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /*
   * ------------------------------------------------
   * BUILD A MAP OF BACKEND STEPS
   * ------------------------------------------------
   *
   * Important:
   * We preserve the backend status and
   * completedAt instead of throwing them away.
   */

  const backendSteps = useMemo(() => {
    const map = new Map();

    if (!Array.isArray(researchProgress)) {
      return map;
    }

    researchProgress.forEach((step) => {
      if (!step?.id) {
        return;
      }

      const uiId =
        backendToUiStep[step.id];

      if (!uiId) {
        return;
      }

      map.set(uiId, {
        ...step,
        uiId,
      });
    });

    return map;
  }, [researchProgress]);

  /*
   * ------------------------------------------------
   * BUILD TIMELINE
   * ------------------------------------------------
   */

  const steps = useMemo(() => {
    const result = defaultSteps.map(
      (defaultStep) => {
        const backendStep =
          backendSteps.get(
            defaultStep.id
          );

        /*
         * If backend has this step,
         * preserve its real status/timestamp.
         */
        if (backendStep) {
          return {
            ...defaultStep,
            ...backendStep,
            id: defaultStep.id,
            label:
              defaultStep.label,
            status:
              backendStep.status ||
              defaultStep.status,
          };
        }

        return {
          ...defaultStep,
        };
      }
    );

    /*
     * If backend has sent completed steps,
     * find the first step that isn't completed.
     *
     * That step becomes the currently running
     * step only when the backend hasn't explicitly
     * marked another step as running.
     */

    const hasExplicitRunningStep =
      result.some(
        (step) =>
          step.status === "running"
      );

    if (!hasExplicitRunningStep) {
      const firstIncompleteIndex =
        result.findIndex(
          (step) =>
            step.status !==
            "completed"
        );

      if (
        firstIncompleteIndex !== -1
      ) {
        result[
          firstIncompleteIndex
        ] = {
          ...result[
            firstIncompleteIndex
          ],
          status: "running",
        };
      }
    }

    return result;
  }, [backendSteps]);

  /*
   * ------------------------------------------------
   * CURRENT STEP
   * ------------------------------------------------
   */

  const currentStep =
    steps.find(
      (step) =>
        step.status === "running"
    ) || null;

  /*
   * ------------------------------------------------
   * COMPLETED ACTIVITY EVENTS
   * ------------------------------------------------
   *
   * These are taken directly from backend
   * completedAt timestamps.
   */

  const completedActivities =
    steps
      .filter(
        (step) =>
          step.status === "completed"
      )
      .map((step) => ({
        id: step.id,
        message: `${step.label} completed`,
        timestamp:
          formatTimestamp(
            step.completedAt
          ),
        status: "completed",
      }))
      .filter(
        (activity) =>
          activity.timestamp
      );

  /*
   * ------------------------------------------------
   * BACKEND METADATA
   * ------------------------------------------------
   */

  const discoveryStep =
    backendSteps.get(
      "search"
    );

  const shortlistStep =
    backendSteps.get(
      "shortlist"
    );

  const menuStep =
    backendSteps.get(
      "menus"
    );

  const reviewStep =
    backendSteps.get(
      "reviews"
    );

  const discoveredCount =
    discoveryStep?.metadata
      ?.resultCount ?? "—";

  const shortlistedCount =
    shortlistStep?.metadata
      ?.restaurantsSelected ??
    "—";

  const menusFound =
    menuStep?.metadata
      ?.menusFound ?? "—";

  const reviewsChecked =
    reviewStep?.metadata
      ?.restaurantsChecked;

  /*
   * ------------------------------------------------
   * ACTIVITY MESSAGES
   * ------------------------------------------------
   */

  const activityMessages = [];

  if (
    discoveryStep?.metadata
      ?.resultCount != null
  ) {
    activityMessages.push({
      id: "discovery-count",
      message: `${discoveredCount} restaurants discovered.`,
    });
  }

  if (
    shortlistStep?.metadata
      ?.restaurantsSelected != null
  ) {
    activityMessages.push({
      id: "shortlist-count",
      message: `${shortlistedCount} restaurants shortlisted.`,
    });
  }

  if (
    menuStep?.metadata
      ?.menusFound != null
  ) {
    activityMessages.push({
      id: "menu-count",
      message: `${menusFound} menus successfully researched.`,
    });
  }

  if (
    reviewsChecked != null
  ) {
    activityMessages.push({
      id: "review-count",
      message: `Review signals analyzed for ${reviewsChecked} restaurants.`,
    });
  }

  /*
   * Research signal count
   */

  const researchSignals =
    researchProgress.reduce(
      (total, step) => {
        return (
          total +
          Number(
            step?.metadata
              ?.resultCount || 0
          )
        );
      },
      0
    );

  /*
   * ------------------------------------------------
   * CURRENT MESSAGE
   * ------------------------------------------------
   */

  const currentMessage =
    currentStep?.description ||
    currentStep?.label ||
    "Preparing research...";

  return (
    <main className="min-h-screen bg-[#f8f5f1]">
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-12">

        {/* HEADER */}

        <div className="max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a64d32]">
            DineScout AI
          </p>

          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-editorial text-4xl leading-tight tracking-[-0.025em] text-[#1a1a1a] sm:text-5xl lg:text-6xl">
              Researching your request.
            </h1>

            {/* TIMER */}

            <div className="shrink-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#766b65]">
                Elapsed
              </p>

              <p className="mt-1 font-mono text-sm text-[#4a5d4e]">
                {formatElapsedTime(
                  elapsedSeconds
                )}
              </p>
            </div>
          </div>

          <p className="mt-6 font-editorial text-xl italic leading-8 text-[#766b65] sm:text-2xl">
            “{query}”
          </p>

          {/* CURRENT TASK */}

          {currentStep && (
            <div className="mt-7 flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a64d32] opacity-60" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#a64d32]" />
              </span>

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#766b65]">
                {currentStep.label}
              </p>
            </div>
          )}
        </div>

        {/* WORKSPACE */}

        <div className="mt-16 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">

          {/* TIMELINE */}

          <section>
            <div className="mb-8 flex items-center justify-between border-b border-[#d8cec6] pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#766b65]">
                Research journal
              </p>

              <p className="font-mono text-[10px] text-[#a64d32]">
                {formatElapsedTime(
                  elapsedSeconds
                )}
              </p>
            </div>

            <ResearchTimeline
              steps={steps}
            />
          </section>

          {/* ACTIVITY */}

          <section>
            <div className="mb-8 border-b border-[#d8cec6] pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#766b65]">
                What we're looking into
              </p>
            </div>

            <ResearchActivity
              currentMessage={
                currentMessage
              }
              currentStep={
                currentStep
              }
              completedActivities={
                completedActivities
              }
              activities={
                activityMessages
              }
            />

            {/* STATS */}

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-[#d8cec6] pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">

              <div>
                <p className="font-editorial text-3xl text-[#1a1a1a]">
                  {discoveredCount}
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#766b65]">
                  Discovered
                </p>
              </div>

              <div>
                <p className="font-editorial text-3xl text-[#1a1a1a]">
                  {shortlistedCount}
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#766b65]">
                  Shortlisted
                </p>
              </div>

              <div>
                <p className="font-editorial text-3xl text-[#1a1a1a]">
                  {menusFound}
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#766b65]">
                  Menus
                </p>
              </div>

              <div>
                <p className="font-editorial text-3xl text-[#1a1a1a]">
                  {researchSignals ||
                    "—"}
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#766b65]">
                  Research signals
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