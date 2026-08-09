import { ChevronDown } from "lucide-react";
import { useState } from "react";

const MenuHighlights = ({ items = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[#e5ddd7]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-14 w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
          Menu highlights
        </span>

        <ChevronDown
          size={17}
          strokeWidth={1.4}
          className={`shrink-0 text-[#766b65] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="pb-5">
          {items.length > 0 ? (
            <div className="divide-y divide-[#e5ddd7]">
              {items.map((item, index) => (
                <div
                  key={item.id || item.name || index}
                  className="flex items-center justify-between gap-5 py-3"
                >
                  <div>
                    <p className="text-sm text-[#1a1a1a]">
                      {item.name}
                    </p>

                    {item.description && (
                      <p className="mt-1 text-xs leading-5 text-[#766b65]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {item.price && (
                    <span className="shrink-0 font-editorial text-base text-[#4a5d4e]">
                      {item.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#766b65]">
              No menu highlights available for this restaurant.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuHighlights;