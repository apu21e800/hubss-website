import type { ColourFamily } from "@/lib/colours";

/**
 * ColourSystem — the official StreetBond colour palette, rendered as chip
 * grids per family. Mirrors the catalogue §4 colour spread archetype.
 * Server component — pure markup, no client JS.
 */
export default function ColourSystem({
  families,
  heading = "The colour system.",
  intro,
}: {
  families: ColourFamily[];
  heading?: string;
  intro?: string;
}) {
  if (!families.length) return null;
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        {heading}
      </h2>
      {intro && (
        <p className="text-sm leading-relaxed mb-8 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          {intro}
        </p>
      )}

      <div className="space-y-10">
        {families.map((family) => (
          <div key={family.key}>
            <div className="flex items-baseline gap-3 mb-1">
              <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                {family.name}
              </h3>
              <span
                className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                {family.colours.length} colours
              </span>
            </div>
            <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              {family.blurb}
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-5">
              {family.colours.map((c) => (
                <div key={c.name}>
                  <div
                    className="w-full rounded-lg"
                    style={{
                      aspectRatio: "4 / 3",
                      background: c.hex,
                      border: c.keyline
                        ? "1px solid rgba(255,255,255,0.35)"
                        : "1px solid rgba(255,255,255,0.06)",
                    }}
                    aria-label={`${c.name} colour swatch`}
                  />
                  <p className="mt-2 text-[0.8rem] font-medium leading-tight" style={{ color: "var(--text-body)" }}>
                    {c.name}
                  </p>
                  {c.sri !== undefined ? (
                    <p className="text-[0.66rem] tracking-wide mt-0.5" style={{ color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
                      SRI {c.sri} · R {c.r?.toFixed(2)} · E {c.e?.toFixed(2)}
                    </p>
                  ) : (
                    <p className="text-[0.66rem] uppercase tracking-wide mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {c.hex}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-[0.72rem] leading-relaxed max-w-2xl" style={{ color: "var(--text-faint)" }}>
        Screen-reference values. Specification and print work use supplier colour formulas —
        request the current StreetBond colour card for physical samples. Full Pantone custom
        matching available.
      </p>
    </section>
  );
}
