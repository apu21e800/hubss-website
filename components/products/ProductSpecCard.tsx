import Link from "next/link";
import type { CatalogueEntry } from "@/lib/product-catalogue";
import { products } from "@/lib/products";

/** The product page a cross-sell name points to, when the name is a product. */
const productHref = (name: string): string | null => {
  const p = products.find((x) => x.name === name);
  return p ? `/products/${p.slug}` : null;
};

/**
 * Names the printed cross-sell strip carries that are not what its heading
 * says. PreMark's strip is headed "Surface repair and maintenance" and lists
 * AirMark, an airfield marking, beside the three repair products (QA B16,
 * E26, 30 Sep 2026). The book's words stay as printed in
 * lib/product-catalogue.ts; the web strip just leaves AirMark out.
 */
const NOT_UNDER_THIS_HEADING = new Set(["AirMark"]);

/**
 * The catalogue's product spread, rendered for the web.
 *
 * WHAT THIS REPLACES: the product page opened its body with an `<h2>About
 * StreetBond</h2>` and a paragraph. "About X" is a filing label — it tells a
 * municipal engineer nothing, it ranks for nothing, and it wastes the one
 * position on the page where a reader is still deciding whether to keep going.
 *
 * The print catalogue does not make that mistake. Every product spread opens
 * with a positioning line ("The colour system."), qualifies it in one subhead,
 * earns it in one paragraph, proves it in a four-cell spec grid, and closes
 * with where the system goes. That sequence is doing real work — claim,
 * qualification, evidence, application — and it is already approved. This
 * component is that spread, in HTML.
 *
 * The four specs here are deliberately the headline four, not the full table.
 * The complete specification still lives in the sidebar; leading with four is
 * what makes them legible. A specifier who wants thickness and skid resistance
 * gets them in the first screen instead of scrolling past a twelve-row table.
 */
export default function ProductSpecCard({
  entry,
  productName,
}: {
  entry: CatalogueEntry;
  productName: string;
}) {
  return (
    <section aria-labelledby="product-positioning" className="mb-14">
      {/* Claim */}
      <h2
        id="product-positioning"
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

      {/* Qualification */}
      <p
        className="mb-6"
        style={{
          color: "var(--text-secondary)",
          fontSize: "clamp(1.05rem, 1.9vw, 1.25rem)",
          lineHeight: 1.45,
          maxWidth: "48ch",
        }}
      >
        {entry.subhead}
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
        {entry.description}
      </p>

      {/* The four that matter. Two columns on anything wider than a phone —
          the catalogue runs them 2×2 and the pairing is part of how they read. */}
      <dl
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 py-8"
        style={{
          borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        {entry.specs.map((s) => (
          <div key={s.label}>
            <dt
              className="text-[11px] font-bold uppercase mb-1.5"
              style={{ color: "var(--text-faint)", letterSpacing: "0.14em" }}
            >
              {s.label}
            </dt>
            <dd
              className="font-semibold"
              style={{ color: "var(--text-primary)", fontSize: "0.975rem", lineHeight: 1.4 }}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Where it goes — the catalogue's footer strip, middot-separated. */}
      <p
        className="mt-6 text-[11px] font-bold uppercase"
        style={{ color: "var(--text-faint)", letterSpacing: "0.16em" }}
      >
        <span className="sr-only">{productName} is specified for: </span>
        {entry.uses.join("  ·  ")}
      </p>

      {/* Cross-sell, where the printed page carries one. */}
      {entry.alsoNeed && (
        <div
          className="mt-8 rounded-xl px-5 py-4"
          style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}
        >
          <p
            className="text-[10px] font-bold uppercase mb-1.5"
            style={{ color: "var(--accent-text-lg)", letterSpacing: "0.16em" }}
          >
            You may also need · {entry.alsoNeed.heading}
          </p>
          {/* The names are links (QA, 27 Sep 2026): on the printed page a
              reader turns to the product; here they could only read its name
              and go looking. The words are the book's and stay as printed.
              44 px rows on phones, natural height with a mouse. */}
          <ul className="flex flex-wrap items-center text-sm font-medium" style={{ color: "var(--text-body)" }}>
            {entry.alsoNeed.items.filter((name) => !NOT_UNDER_THIS_HEADING.has(name)).map((name, i) => {
              const href = productHref(name);
              return (
                <li key={name} className="flex items-center">
                  {i > 0 && (
                    <span aria-hidden="true" className="px-2" style={{ color: "var(--text-faint)" }}>
                      ·
                    </span>
                  )}
                  {href ? (
                    <Link
                      href={href}
                      data-tap="44"
                      className="inline-flex items-center min-h-11 sm:min-h-0 text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--ink-25)] transition-colors hover:text-[var(--accent-text-lg)] hover:decoration-current"
                    >
                      {name}
                    </Link>
                  ) : (
                    <span>{name}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
