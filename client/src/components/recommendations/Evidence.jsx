import { ExternalLink, ShieldCheck } from "lucide-react";

const Evidence = ({ evidence = [] }) => {
  return (
    <div className="border-t border-[#e5ddd7]">
      <div className="flex items-center gap-3 py-5">
        <ShieldCheck
          size={17}
          strokeWidth={1.4}
          className="text-[#4a5d4e]"
        />

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
            Research evidence
          </p>

          <p className="mt-1 text-xs text-[#766b65]">
            Sources behind this recommendation
          </p>
        </div>
      </div>

      {evidence.length > 0 ? (
        <div className="divide-y divide-[#e5ddd7] border-y border-[#e5ddd7]">
          {evidence.map((item, index) => (
            <div
              key={item.id || index}
              className="py-4"
            >
              <p className="text-sm leading-6 text-[#1a1a1a]">
                {item.claim}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#766b65]">
                  {item.source || "Source"}
                </span>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a64d32] transition-colors hover:text-[#631d21]"
                  >
                    Open source
                    <ExternalLink size={12} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-y border-[#e5ddd7] py-5">
          <p className="text-sm leading-6 text-[#766b65]">
            Research sources will appear here once the restaurant has been
            investigated.
          </p>
        </div>
      )}
    </div>
  );
};

export default Evidence;