import { ArrowUpRight, Mic } from "lucide-react";
import { useState } from "react";

const ResearchInput = ({ onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSubmit?.(trimmedMessage);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="border border-[#1a1a1a]/20 bg-[#fdfbf8] transition-colors focus-within:border-[#a64d32]">
        <div className="p-5 sm:p-6">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            placeholder="Tell me what you're looking for..."
            className="w-full resize-none bg-transparent text-base leading-7 text-[#1a1a1a] outline-none placeholder:text-[#766b65]/70 sm:text-lg"
            aria-label="Restaurant research request"
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#e5ddd7] px-4 py-3 sm:px-5">
          <button
            type="button"
            aria-label="Use microphone"
            className="flex h-10 w-10 items-center justify-center text-[#766b65] transition-colors hover:text-[#a64d32]"
          >
            <Mic size={19} strokeWidth={1.5} />
          </button>

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