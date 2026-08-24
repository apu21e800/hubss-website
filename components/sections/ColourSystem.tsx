import type { ColourFamily } from "@/lib/colours";

/**
 * ColourSystem — the official StreetBond colour palette, one collapsible card
 * per family. Mirrors the catalogue §4 colour spread archetype.
 *
 * Collapsed by default (Vernon: "hide the colour palettes in a dropdown, they
 * take up too much vertical space"). Each closed card still shows every colour
 * as a small chip strip, so the palette reads at a glance; opening reveals the
 * full swatch grid with names and SR/PMS values.
 *
 * Native <details>/<summary> — no client JS, keyboard + screen-reader
 * semantics for free, content stays in the DOM for search engines.
 */
export default function ColourSystem({
  families,
  heading = "The colour system.",
  intro,
  downloadHref,
  downloadLabel,
}: {
  families: ColourFamily[];
  heading?: string;
  intro?: string;
  downloadHref?: string;
  downloadLabel?: string;
}) {
  if (!families.length) return null;
  return (
    <section id="colours" className="mt-14 scroll-mt-24">
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        {heading}
      </h2>
      {intro && (
        <p className="text-sm leading-relaxed mb-6 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          {intro}
        </p>
      )}

      <div className="space-y-3">
        {families.map((family) => (
          <details
            key={family.key}
            className="group rounded-xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid var(--border-color)" }}
          >
            <summary className="flex items-center gap-4 px-4 sm:px-5 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden transition-colors hover:bg-white/[0.03]">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                    {family.name}
                  </h3>
                  <span
                    className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {family.colours.length} colours
                  </span>
                </div>
                {/* Chip strip — the whole palette at a glance while collapsed.
                    Decorative: names + values live in the expanded grid. */}
                <div className="mt-2.5 flex flex-wrap gap-1" aria-hidden="true">
                  {family.colours.map((c) => (
                    <span
                      key={c.name}
                      className="rounded-[4px]"
                      style={{
                        width: 20,
                        height: 14,
                        background: c.hex,
                        border: c.keyline
                          ? "1px solid rgba(255,255,255,0.35)"
                          : "1px solid var(--border-color)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <span
                className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold"
                style={{ color: "#FB923C" }}
              >
                <span className="hidden sm:inline group-open:hidden">View colours</span>
                <span className="hidden sm:group-open:inline">Hide</span>
                <svg
                  width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  className="transition-transform duration-200 group-open:rotate-180"
                >
                  <path d="M6 9l6 6 6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </summary>

            <div className="px-4 sm:px-5 pb-5">
              <p className="text-sm mb-5 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
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
                          : "1px solid var(--border-color)",
                      }}
                      /* aria-label was invalid here — a plain <div> has role
                         "generic", which strips aria-label per the ARIA spec, so
                         assistive tech silently got NO name at all (axe:
                         aria-prohibited-attr). The colour name + value are
                         already visible as real text right below, so the swatch
                         itself is decorative and just needs hiding, not a name. */
                      aria-hidden="true"
                    />
                    <p className="mt-2 text-[13px] font-medium leading-tight" style={{ color: "var(--text-body)" }}>
                      {c.name}
                    </p>
                    <p className="text-[11px] tracking-wide mt-0.5" style={{ color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
                      {c.sr !== undefined ? `SR ${c.sr.toFixed(2)}` : c.pms ?? c.hex.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      <p className="mt-6 text-[12px] leading-relaxed max-w-2xl" style={{ color: "var(--text-faint)" }}>
        Screen-reference values — colours vary by monitor and substrate. Specify from physical
        samples.{" "}
        {downloadHref && (
          <a href={downloadHref} className="underline underline-offset-2 hover:text-orange-400 transition-colors" target="_blank" rel="noopener noreferrer">
            {downloadLabel ?? "Download the colour reference (PDF)"}
          </a>
        )}
      </p>
    </section>
  );
}
