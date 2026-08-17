import { useState } from "react";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import Research from "./pages/Research";
import Results from "./pages/Results";
import RestaurantDetail from "./pages/RestaurantDetail";

import { requestResearch } from "./services/research.api";

function App() {
  const [page, setPage] =
    useState("home");

  const [researchResult, setResearchResult] =
    useState(null);

  const [selectedRestaurant, setSelectedRestaurant] =
    useState(null);

  const [researchQuery, setResearchQuery] =
    useState("");

  const [error, setError] =
    useState("");

  const [researchProgress, setResearchProgress] =
    useState([]);

  const [researchStartedAt, setResearchStartedAt] =
    useState(null);

  /*
   * ------------------------------------------------
   * START RESEARCH
   * ------------------------------------------------
   */

  const handleResearch = async (
    message,
    location = null
  ) => {
    try {
      setError("");
      setResearchQuery(message);
      setResearchResult(null);
      setResearchProgress([]);

      setResearchStartedAt(
        Date.now()
      );

      setPage("research");

      console.log(
        "RESEARCH LOCATION:",
        location
      );

      const response =
        await requestResearch(
          message,
          (progress) => {
            console.log(
              "RESEARCH PROGRESS:",
              progress
            );

            if (
              progress?.type ===
                "progress" &&
              Array.isArray(
                progress.researchSteps
              )
            ) {
              setResearchProgress(
                progress.researchSteps
              );
            }

            if (
              progress?.type ===
              "started"
            ) {
              setResearchStartedAt(
                Date.now()
              );
            }

            if (
              progress?.type ===
              "complete"
            ) {
              if (
                Array.isArray(
                  progress?.data
                    ?.researchSteps
                )
              ) {
                setResearchProgress(
                  progress.data
                    .researchSteps
                );
              }
            }
          },
          location
        );

      console.log(
        "FULL RESEARCH RESPONSE:",
        response
      );

      console.log(
        "RESEARCH DATA:",
        response.data
      );

      setResearchResult(
        response.data
      );

      setPage("results");
    } catch (err) {
      console.error(
        "Research failed:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while researching."
      );

      setPage("home");
    }
  };

  /*
   * ------------------------------------------------
   * RESTAURANT DETAIL
   * ------------------------------------------------
   */

  const handleExploreRestaurant = (
    restaurant
  ) => {
    setSelectedRestaurant(
      restaurant
    );

    setPage("detail");
  };

  /*
   * ------------------------------------------------
   * BACK HOME
   * ------------------------------------------------
   */

  const handleBackHome = () => {
    setPage("home");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f8f5f1]">

      <Navbar
        onHome={() => {
          setPage("home");
          setError("");
        }}
        onResearch={() => {
          setPage("research");

          if (!researchQuery) {
            setResearchQuery(
              "Explore restaurants based on my preferences"
            );
          }
        }}
      />

      {/* HOME */}

      {page === "home" && (
        <>
          <Hero
            onResearch={
              handleResearch
            }
          />

          {error && (
            <div className="mx-auto max-w-2xl px-5 pb-10">
              <div className="border border-[#631d21]/20 bg-[#631d21]/5 p-5">

                <p className="text-sm leading-6 text-[#631d21]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setError("")
                  }
                  className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#631d21] underline underline-offset-4"
                >
                  Dismiss
                </button>

              </div>
            </div>
          )}
        </>
      )}

      {/* RESEARCH */}

      {page === "research" && (
        <Research
          query={researchQuery}
          researchProgress={
            researchProgress
          }
          researchStartedAt={
            researchStartedAt
          }
        />
      )}

      {/* RESULTS */}

      {page === "results" && (
        <Results
          researchResult={
            researchResult
          }
          onBack={
            handleBackHome
          }
          onExplore={
            handleExploreRestaurant
          }
        />
      )}

      {/* RESTAURANT DETAIL */}

      {page === "detail" && (
        <RestaurantDetail
          restaurant={
            selectedRestaurant
          }
          onBack={() =>
            setPage("results")
          }
        />
      )}
    </div>
  );
}

export default App;