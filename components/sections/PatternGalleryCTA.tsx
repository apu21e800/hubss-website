import Link from "next/link";
import Image from "next/image";
import { PATTERN_TEMPLATES, patternSrc } from "@/lib/pattern-templates";

/**
 * PatternGalleryCTA — one slim band linking to /patterns, for product pages
 * where patterns matter but a full template grid would crowd the page
 * (StreetBond, TrafficPatternsXD). StreetPrint keeps its inline six-tile
 * PavingPatterns preview — it's the stamping product, the templates ARE the
 * pitch there. Server component, no client JS.
 *
 * Deliberately ~90px tall: Vernon's brief was "should not take up too much
 * screen real-estate ... a button that takes the user to the pattern gallery
 * page." This is that button, dressed for the part — three fanned template
 * sheets, one line of copy, one arrow.
 */

const PREVIEW_SLUGS = ["herringbone", "british-cobble", "ashlar-slate"];

export default function PatternGalleryCTA() {
  const previews = PREVIEW_SLUGS
    .map((slug) => PATTERN_TEMPLATES.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <Link
      href="/patterns"
      className="group mt-14 flex items-center gap-4 sm:gap-5 rounded-xl px-4 sm:px-5 py-4 transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_8px_24px_-12px_rgba(249,115,22,0.35)]"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Three fanned template sheets — decorative; the text carries the meaning */}
      <div className="relative flex flex-shrink-0 -space-x-4" aria-hidden="true">
        {previews.map((t, i) => (
          <div
            key={t.slug}
            className="relative rounded-md overflow-hidden transition-transform duration-200 group-hover:rotate-0"
            style={{
              width: 62,
              height: 48,
              background: "#151b26",
              border: "1px solid rgba(255,255,255,0.12)",
              transform: `rotate(${(i - 1) * 4}deg)`,
              zIndex: 3 - i,
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            <Image
              src={patternSrc(t)}
              alt=""
              width={124}
              height={96}
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: "#F97316" }}>
          StreetPrint templates
        </p>
        <p className="text-[15px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
          Pattern gallery
        </p>
        <p className="text-[12px] mt-0.5 hidden sm:block" style={{ color: "var(--text-secondary)" }}>
          16 dimensioned stamping templates — herringbone, cobble, ashlar, fan
        </p>
      </div>

      {/* Desktop: pill button. Mobile: plain arrow — the whole band is the link. */}
      <span
        className="hidden sm:inline-flex flex-shrink-0 items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-transform duration-200 group-hover:translate-x-0.5"
        style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(249,115,22,0.3)" }}
      >
        Browse patterns
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <svg width="16" height="16" fill="none" stroke="#F97316" viewBox="0 0 24 24" className="sm:hidden flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Link>
  );
}
