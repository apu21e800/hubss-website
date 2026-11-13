import { HOMEPAGE_COPY, type AudienceCard } from "@/lib/homepage-copy";
import IntentLink from "@/components/ui/IntentLink";

// The three cards' links, left to right. Their words (who each card is for
// and its line) are in Studio since 7 Oct 2026: lib/homepage-copy.ts.
const HREFS = [
  "/applications",
  "/products",
  // The card is about certification, so it opens the post about the
  // installer network rather than the contact form (QA rest#8, 27 Sep 2026).
  "/blog/hub-certified-installer-network",
];

export default function PersonaEntryPoints({ cards = HOMEPAGE_COPY.audiences }: { cards?: AudienceCard[] }) {
  const PERSONAS = cards.slice(0, HREFS.length).map((card, i) => ({ ...card, href: HREFS[i] }));
  return (
    <section
      /* a choice to read through */
      data-surface="paper"
      style={{
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--ink-06)]">
          {/* IntentLink: these three sit just under the first screen, and a
              plain Link there fetched its page and the page's first photos
              (about 400 KB on a phone) with the first flick of the page,
              tap or no tap. */}
          {PERSONAS.map((p) => (
            <IntentLink
              key={p.label}
              href={p.href}
              className="group flex items-start gap-4 px-0 py-6 sm:px-6 sm:py-8 sm:first:pl-0 sm:last:pr-0 transition-colors duration-200"
            >
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm leading-6 font-bold mb-1 group-hover:text-[var(--accent-text)] transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.label}
                </p>
                {/* 15px: at 13px this was the smallest running copy on the
                    site and the first paragraph after the hero (17 Oct 2026). */}
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.desc}
                </p>
              </div>
              <span className="ml-2 flex h-6 flex-shrink-0 items-center" aria-hidden="true">
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="var(--accent-text-lg)"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </IntentLink>
          ))}
        </div>
      </div>
    </section>
  );
}
