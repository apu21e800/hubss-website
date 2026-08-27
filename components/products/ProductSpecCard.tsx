import type { CatalogueEntry } from "@/lib/product-catalogue";

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
            style={{ color: "#f97316", letterSpacing: "0.16em" }}
          >
            You may also need · {entry.alsoNeed.heading}
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--text-body)" }}>
            {entry.alsoNeed.items.join("  ·  ")}
          </p>
        </div>
      )}
    </section>
  );
}
