import type { ProductFaqEntry } from "@/lib/product-faqs";

/**
 * The product FAQ, rendered as native <details> disclosures.
 *
 * WHY <details> AND NOT A CLIENT ACCORDION: the answers must exist in the
 * server-rendered HTML — that is the entire point. Google renders collapsed
 * <details> content and indexes it; AI crawlers read it straight out of the
 * document; and a reader gets a scannable list of nine questions instead of a
 * wall of paragraphs. No JavaScript, no hydration cost, nothing to break.
 *
 * The first entry ships open. It is the "what is this" answer — the one a
 * skimming visitor and a snippet crawler both want first, and an all-closed
 * stack reads as a dead end.
 *
 * Copy source: lib/product-faqs.ts — the client's own FAQ documents,
 * transcribed. This component adds no words of its own.
 */
export default function ProductFaq({
  productName,
  faqs,
}: {
  productName: string;
  faqs: ProductFaqEntry[];
}) {
  return (
    <section aria-labelledby="product-faq" className="mb-14">
      <h2
        id="product-faq"
        className="text-xl sm:text-2xl font-bold mb-2"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        {productName} — common questions
      </h2>
      <p className="mb-7 text-sm" style={{ color: "var(--text-secondary)" }}>
        Answers from HUB&apos;s field and technical documentation.
      </p>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border-color)", background: "var(--bg-card-neutral)" }}
      >
        {faqs.map((f, i) => (
          <details
            key={f.q}
            open={i === 0}
            className="group"
            style={{ borderTop: i === 0 ? "none" : "1px solid var(--border-color)" }}
          >
            <summary
              className="flex items-baseline justify-between gap-4 cursor-pointer list-none px-5 py-4 sm:px-6"
              style={{ color: "var(--text-primary)" }}
            >
              <span className="font-semibold" style={{ fontSize: "0.98rem", lineHeight: 1.45 }}>
                {f.q}
              </span>
              {/* Plus that becomes a minus — drawn, not a glyph, so it can't
                  fall back to a tofu box on any platform. */}
              <svg
                aria-hidden
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="flex-shrink-0 translate-y-[2px] transition-transform duration-200 group-open:rotate-45"
                style={{ color: "#F97316" }}
              >
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <p
              className="px-5 pb-5 sm:px-6 leading-[1.75]"
              style={{ color: "var(--text-body)", fontSize: "0.95rem", maxWidth: "68ch" }}
            >
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
