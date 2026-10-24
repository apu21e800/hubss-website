import Link from "next/link";
import type { ApplicationCatalogueEntry } from "@/lib/application-catalogue";
import { products } from "@/lib/products";
import { plainNote } from "@/lib/plain-specs";

/**
 * The catalogue's application spread, rendered for the web.
 *
 * The sibling of components/products/ProductSpecCard — same sequence, same
 * grammar, one level up the hierarchy: claim, pull line, the paragraph that
 * earns it, and then SPECIFY.
 *
 * SPECIFY is the part that matters. A municipal engineer arriving on
 * /applications/crosswalks does not need to be told what a crosswalk is; they
 * need to know which system to write into the spec and why that one. The
 * printed catalogue answers that in three lines per spread, and the client
 * approved those answers. Here each line is also a link, so the page hands a
 * reader straight to the product it just recommended.
 *
 * Copy source: lib/application-catalogue.ts. This component adds no words of
 * its own beyond the "Specify" label the catalogue itself prints.
 */
export default function ApplicationSpread({
  entry,
  applicationName,
}: {
  entry: ApplicationCatalogueEntry;
  applicationName: string;
}) {
  const nameOf = (slug: string) => products.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <section aria-labelledby="application-positioning" className="mb-14">
      {/* Claim */}
      <h2 id="application-positioning" className="h2-section mb-2.5" style={{ color: "var(--text-primary)" }}>
        {entry.title}
      </h2>

      {/* The pull line */}
      <p
        className="mb-6"
        style={{
          color: "var(--text-secondary)",
          fontSize: "clamp(1.05rem, 1.9vw, 1.25rem)",
          lineHeight: 1.45,
          maxWidth: "48ch",
        }}
      >
        {entry.statement}
      </p>

      {/* Evidence */}
      <p
        className="mb-9 leading-(--lh-read)"
        style={{
          color: "var(--text-body)",
          fontSize: "clamp(1.0625rem, 1.8vw, 1.125rem)",
          maxWidth: "62ch",
        }}
      >
        {entry.body}
      </p>

      {/* Specify — the catalogue's own product selection for this work. */}
      <div style={{ borderTop: "1px solid var(--border-color)" }}>
        <h3
          className="text-[12px] font-bold uppercase pt-7 pb-4"
          style={{ color: "var(--accent-text-lg)", letterSpacing: "0.18em" }}
        >
          Specify
          <span className="sr-only"> these systems for {applicationName}</span>
        </h3>
        <ul className="flex flex-col">
          {entry.specify.map((s) => (
            <li key={s.slug} style={{ borderTop: "1px solid var(--ink-06)" }}>
              <Link
                href={`/products/${s.slug}`}
                className="group flex items-center gap-3 py-4 transition-colors hover:bg-[var(--ink-03)] -mx-3 px-3 rounded-lg"
              >
                <span className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 min-w-0 flex-1">
                  <span
                    className="font-bold flex-shrink-0 transition-colors group-hover:text-[var(--accent-text)]"
                    style={{ color: "var(--text-primary)", fontSize: "1.0625rem", minWidth: "11rem" }}
                  >
                    {nameOf(s.slug)}
                  </span>
                  <span
                    className="leading-snug"
                    style={{ color: "var(--text-secondary)", fontSize: "1rem" }}
                  >
                    {plainNote(s.note)}
                  </span>
                </span>
                {/* The chevron says the row is a link; on a phone the hover
                    colour never showed and the list read as plain specs
                    (phone review, 17 Oct 2026). */}
                <svg className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--ink-35)" }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
