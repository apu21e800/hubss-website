import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { PATTERN_TEMPLATES, patternSrc } from "@/lib/pattern-templates";

/**
 * PavingPatterns: a product page's preview of the real stamping templates
 * (dimensioned CAD sheets, white-on-charcoal). The full set lives at
 * /patterns. StreetPrint's page, and since 23 Oct 2026 TrafficPatternsXD's
 * (Vern: "templates apply to TPXD too"; its Design Manual stamps the same
 * six patterns with its own wire-rope grids), each with its own intro and
 * link label. Server component, no client JS.
 */

const FEATURED = [
  "herringbone",
  "diagonal-herringbone",
  "offset-brick-vertical",
  "ashlar-slate",
  "british-cobble",
  "tiles-8in",
];

export default function PavingPatterns({ intro, moreLabel = "All 16 templates" }: { intro?: ReactNode; moreLabel?: string } = {}) {
  const featured = FEATURED.map((slug) => PATTERN_TEMPLATES.find((t) => t.slug === slug)!).filter(Boolean);
  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4 mb-2">
        <h2 className="h2-sub" style={{ color: "var(--text-primary)" }}>
          Standard templates
        </h2>
        <Link href="/patterns" className="link-arrow flex-shrink-0">
          {moreLabel}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
      <p className="text-sm leading-relaxed mb-8 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
        {intro ?? (
          <>
            The stamping templates as installed, dimensioned to the inch. Field patterns combine
            with border courses; fully custom designs cut to order.
          </>
        )}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((t) => (
          <Link
            key={t.slug}
            href="/patterns"
            className="rounded-xl overflow-hidden group transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}
          >
            <div className="p-3 sm:p-4">
              <Image
                src={patternSrc(t)}
                alt={`${t.name}, StreetPrint stamping template`}
                width={1600}
                height={1238}
                // White line art drawn for the dark ground; pattern-sheet
                // inverts it to charcoal on paper (app/globals.css). Without
                // it the drawings vanished when the page went light (28 Sep 2026).
                className="w-full h-auto pattern-sheet"
                // Three across inside the product page's main column: about
                // 220px each at 1440 (the 24 Oct 2026 review found a 475px
                // file in a 218px slot with the old 33vw).
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 260px"
              />
            </div>
            <div className="px-4 pb-3.5 pt-2.5" style={{ borderTop: "1px solid var(--border-color)" }}>
              <p className="font-semibold text-[14.5px]" style={{ color: "var(--text-primary)" }}>{t.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
