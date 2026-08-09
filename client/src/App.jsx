import { useState } from "react";

import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import Research from "./pages/Research";
import Results from "./pages/Results";
import RestaurantDetail from "./pages/RestaurantDetail";

import { requestResearch } from "./services/research.api";

function App() {
  const [page, setPage] = useState("home");
  const [researchResult, setResearchResult] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [researchQuery, setResearchQuery] = useState("");
  const [error, setError] = useState("");

  const handleResearch = async (message) => {
    try {
      setError("");
      setResearchQuery(message);
      setPage("research");

      const response = await requestResearch(message);

      console.log("FULL RESEARCH RESPONSE:", response);
      console.log("RESEARCH DATA:", response.data);

      setResearchResult(response.data);
      setPage("results");
    } catch (err) {
      console.error("Research failed:", err);

      setError(
        err.message || "Something went wrong while researching."
      );

      setPage("home");
    }
  };

  const handleExploreRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setPage("detail");
  };

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
          <Hero onResearch={handleResearch} />

          {error && (
            <div className="mx-auto max-w-2xl px-5 pb-10">
              <div className="border border-[#631d21]/20 bg-[#631d21]/5 p-5">
                <p className="text-sm leading-6 text-[#631d21]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => setError("")}
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
        <Research query={researchQuery} />
      )}

      {/* RESULTS */}
      {page === "results" && (
        <Results
          researchResult={researchResult}
          onBack={handleBackHome}
          onExplore={handleExploreRestaurant}
        />
      )}

      {/* RESTAURANT DETAIL */}
      {page === "detail" && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onBack={() => setPage("results")}
        />
      )}
    </div>
  );
}

export default App;