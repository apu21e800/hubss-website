// Trusted-by logos / municipality names — standalone social-proof marquee.
// Extracted from the original WhyHubss section so it can run on the homepage
// without the stats / numbered claims block that Doug asked us to drop.

const TRUSTED = [
  "City of Toronto",
  "York Region",
  "City of Vancouver",
  "University of British Columbia",
  "City of Ottawa",
  "City of Calgary",
  "City of Brampton",
  "City of Mississauga",
  "TransLink",
  "City of Surrey",
  "City of Edmonton",
  "City of Winnipeg",
  "City of Burnaby",
  "City of Richmond Hill",
];

// Duplicate the list so the marquee can scroll seamlessly via -50% translate.
const TICKER = [...TRUSTED, ...TRUSTED];

export default function TrustedByMarquee() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#0D0D0D",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
        paddingTop: "3.25rem",
        paddingBottom: "3.25rem",
      }}
      aria-label="Trusted by Canadian municipalities and institutions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p
          className="text-[10px] font-bold tracking-[0.22em] uppercase text-center"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Trusted by
        </p>
      </div>

      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "hubss-trusted-marquee 42s linear infinite" }}
        >
          {TICKER.map((name, i) => (
            <span
              key={`${name}-${i}`}
              style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}
            >
              <span
                className="text-sm font-medium px-6"
                style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1 }}
              >
                {name}
              </span>
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(249,115,22,0.55)",
                  flexShrink: 0,
                }}
              />
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes hubss-trusted-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
