import Link from "next/link";
import Image from "next/image";
import { PATTERN_TEMPLATES, patternSrc } from "@/lib/pattern-templates";

/**
 * PavingPatterns — StreetPrint product-page preview of the real stamping
 * templates (dimensioned CAD sheets, white-on-charcoal). Full set lives
 * at /patterns. Server component — no client JS.
 */

const FEATURED = [
  "herringbone",
  "diagonal-herringbone",
  "offset-brick-vertical",
  "ashlar-slate",
  "british-cobble",
  "tiles-8in",
];

export default function PavingPatterns() {
  const featured = FEATURED.map((slug) => PATTERN_TEMPLATES.find((t) => t.slug === slug)!).filter(Boolean);
  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4 mb-2">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Standard templates.
        </h2>
        <Link
          href="/patterns"
          className="text-sm font-bold flex-shrink-0 hover:translate-x-0.5 transition-transform"
          style={{ color: "#FB923C" }}
        >
          All 16 templates →
        </Link>
      </div>
      <p className="text-sm leading-relaxed mb-8 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
        The stamping templates as installed — dimensioned to the inch. Field patterns combine
        with border courses; fully custom designs cut to order.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((t) => (
          <Link
            key={t.slug}
            href="/patterns"
            className="rounded-xl overflow-hidden group transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--bg-card-neutral)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="p-3 sm:p-4">
              <Image
                src={patternSrc(t)}
                alt={`${t.name} — StreetPrint stamping template`}
                width={1600}
                height={1238}
                className="w-full h-auto"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="px-4 pb-3.5 pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="font-semibold text-[13px]" style={{ color: "var(--text-primary)" }}>{t.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
