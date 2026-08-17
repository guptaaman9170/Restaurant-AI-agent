import {
  ArrowUpRight,
  Mic,
  MapPin,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const ResearchInput = ({ onSubmit }) => {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] =
    useState("idle");
  const [locationError, setLocationError] =
    useState("");

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setLocationStatus("loading");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } =
          position.coords;

        setLocation({
          latitude,
          longitude,
          accuracy,
        });

        setLocationStatus("success");
      },
      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        setLocationStatus("error");

        if (error.code === 1) {
          setLocationError(
            "Location permission was denied. You can continue by entering a city."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Your location could not be determined. Please enter a city instead."
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationError(
            "Unable to access your location."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) return;

    onSubmit?.(
      trimmedMessage,
      location
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="border border-[#1a1a1a]/20 bg-[#fdfbf8] transition-colors focus-within:border-[#a64d32]">

        {/* INPUT */}

        <div className="p-5 sm:p-6">
          <textarea
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            rows={3}
            placeholder="Tell me what you're looking for..."
            className="w-full resize-none bg-transparent text-base leading-7 text-[#1a1a1a] outline-none placeholder:text-[#766b65]/70 sm:text-lg"
            aria-label="Restaurant research request"
          />
        </div>

        {/* LOCATION STATUS */}

        {locationStatus === "success" && (
          <div className="mx-5 mb-4 flex items-center gap-2 border border-[#4a5d4e]/20 bg-[#4a5d4e]/5 px-3 py-2 text-xs text-[#4a5d4e] sm:mx-6">
            <MapPin
              size={14}
              strokeWidth={1.6}
            />

            <span>
              Current location enabled
            </span>
          </div>
        )}

        {locationStatus === "error" && (
          <div className="mx-5 mb-4 border border-[#631d21]/20 bg-[#631d21]/5 px-3 py-2 text-xs leading-5 text-[#631d21] sm:mx-6">
            {locationError}
          </div>
        )}

        {/* ACTIONS */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5ddd7] px-4 py-3 sm:px-5">

          <div className="flex items-center gap-2">

            {/* MICROPHONE */}

            <button
              type="button"
              aria-label="Use microphone"
              className="flex h-10 w-10 items-center justify-center text-[#766b65] transition-colors hover:text-[#a64d32]"
            >
              <Mic
                size={19}
                strokeWidth={1.5}
              />
            </button>

            {/* LOCATION */}

            <button
              type="button"
              onClick={handleLocation}
              disabled={
                locationStatus ===
                "loading"
              }
              className={`flex h-10 items-center gap-2 border px-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                locationStatus ===
                "success"
                  ? "border-[#4a5d4e]/30 bg-[#4a5d4e]/5 text-[#4a5d4e]"
                  : "border-[#1a1a1a]/10 text-[#766b65] hover:border-[#a64d32] hover:text-[#a64d32]"
              }`}
            >
              {locationStatus ===
              "loading" ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <MapPin
                  size={14}
                  strokeWidth={1.5}
                />
              )}

              {locationStatus ===
              "success"
                ? "Location enabled"
                : locationStatus ===
                  "loading"
                ? "Locating..."
                : "Use my location"}
            </button>
          </div>

          {/* RESEARCH */}

          <button
            type="submit"
            disabled={!message.trim()}
            className="group flex items-center gap-2 bg-[#a64d32] px-5 py-3 text-xs font-semibold tracking-[0.14em] text-white transition-all hover:bg-[#631d21] disabled:cursor-not-allowed disabled:opacity-40"
          >
            RESEARCH

            <ArrowUpRight
              size={15}
              strokeWidth={1.7}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ResearchInput;