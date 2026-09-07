import Link from "next/link";
import type { ApplicationCatalogueEntry } from "@/lib/application-catalogue";
import { products } from "@/lib/products";

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
      <h2
        id="application-positioning"
        className="font-black mb-2.5"
        style={{
          color: "var(--text-primary)",
          fontSize: "clamp(1.75rem, 3.4vw, 2.6rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
        }}
      >
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
        className="mb-9 leading-[1.8]"
        style={{
          color: "var(--text-body)",
          fontSize: "clamp(1rem, 1.7vw, 1.0625rem)",
          maxWidth: "62ch",
        }}
      >
        {entry.body}
      </p>

      {/* Specify — the catalogue's own product selection for this work. */}
      <div style={{ borderTop: "1px solid var(--border-color)" }}>
        <h3
          className="text-[11px] font-bold uppercase pt-7 pb-4"
          style={{ color: "#f97316", letterSpacing: "0.18em" }}
        >
          Specify
          <span className="sr-only"> these systems for {applicationName}</span>
        </h3>
        <ul className="flex flex-col">
          {entry.specify.map((s) => (
            <li key={s.slug} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Link
                href={`/products/${s.slug}`}
                className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4 transition-colors hover:bg-white/[0.03] -mx-3 px-3 rounded-lg"
              >
                <span
                  className="font-bold flex-shrink-0 transition-colors group-hover:text-orange-400"
                  style={{ color: "var(--text-primary)", fontSize: "1.0625rem", minWidth: "11rem" }}
                >
                  {nameOf(s.slug)}
                </span>
                <span
                  className="leading-snug"
                  style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}
                >
                  {s.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
