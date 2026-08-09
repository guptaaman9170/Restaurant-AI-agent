const suggestions = [
  "Quiet date night",
  "Best local pasta",
  "Vegetarian dinner",
  "Under €30",
  "Family dinner",
];

const SuggestionLinks = ({ onSelect }) => {
  return (
    <div className="mt-6">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#766b65]">
        Or explore a starting point
      </p>

      <div className="flex gap-x-5 gap-y-2 overflow-x-auto pb-2 scrollbar-none">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect?.(suggestion)}
            className="shrink-0 border-b border-[#1a1a1a]/25 pb-1 text-sm text-[#1a1a1a] transition-colors hover:border-[#a64d32] hover:text-[#a64d32]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionLinks;