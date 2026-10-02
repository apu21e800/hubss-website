/**
 * LunchLearnFunnel: what sits under the boardroom card on /lunch-learn.
 *
 * Until 30 Sep 2026 this file was the whole page: a hero, a stats row, three
 * numbered "What you walk away with" boxes, four persona cards with a chip
 * each, a city marquee, an accordion of framer-motion FAQs and a second form,
 * each in its own visual language. The boardroom card (LunchLearnV2) took
 * over the top of the page in Aug 2026, and the hero and the form here were
 * switched off with hideHero and hideForm but still shipped.
 *
 * Vern, 30 Sep 2026: "clean up the lunch and learn page too. it's a bit
 * messy." The page is now the card, then two sections, then the footer:
 *
 *   1. Session topics (2 Oct 2026, ported from session B's page in place of
 *      the "Your whole team, one session" audience block that stood here for
 *      two days): six photo tiles, one per kind of work, each with a "Book
 *      this topic" that puts the topic into the form's chip and scrolls up
 *      to it (components/sections/LunchLearnTopics.tsx). What everyone
 *      leaves with is the card's ticks; who should be in the room is the
 *      FAQ's own answer.
 *   2. Common questions: the same native <details> list the product pages
 *      use (components/products/ProductFaq.tsx), so the answers are in the
 *      HTML for crawlers and the page needs no client JavaScript for it.
 *
 * The city marquee is gone from this page: it named Ottawa, Calgary and
 * Mississauga, which have no project on the map since the 28 Sep audit, and
 * the page reads better without a third idiom between the audiences and the
 * questions. The homepage keeps TrustedByMarquee, untouched.
 *
 * Both sections sit on data-surface="paper", as the reading under every
 * product, application and Insights hero does (Round 3); the card above and
 * the footer below close the page in the dark.
 *
 * Sanity (sanity/schemas/page.ts, group "Lunch & Learn") still holds the FAQ
 * array and the section headings: app/lunch-learn/page.tsx passes the
 * questions and the FAQ heading through when the client has edited them in
 * Studio, and the defaults below serve until then. The persona array, the
 * "What You Walk Away With" cards, the other headings and the hero fields
 * are read by nothing since 2 Oct 2026 and are hidden in Studio.
 */

import LunchLearnTopics from "@/components/sections/LunchLearnTopics";

export interface LunchLearnFunnelProps {
  faqs?: { q: string; a: string }[];
  sectionHeadings?: { faqHeading?: string };
}

/**
 * The questions and answers, exported so app/lunch-learn/page.tsx builds its
 * FAQPage schema from the list the visitor sees. The schema used to keep its
 * own copy and had drifted ("Is the session in-person or virtual?" against
 * "In-person or virtual?" on the page).
 */
export const LUNCH_LEARN_FAQS = [
  {
    q: "How long is the session?",
    a: "30–45 minutes of presentation, followed by open Q&A. We're respectful of your team's calendar and stick to the time we agree on.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. Sessions are how we introduce our systems to the people who specify them: no invoice, no minimum order, and no follow-up pressure.",
  },
  {
    q: "Who should be in the room?",
    a: "Engineers, planners, landscape architects, project managers, procurement: anyone who touches the surface spec. Sessions are built for mixed teams, and there's no cap on seats.",
  },
  {
    q: "In-person or virtual?",
    a: "Both. In-person sessions are available coast to coast through our certified applicator network. Virtual sessions use Zoom or Teams. We mail sample kits before we connect.",
  },
];

const h2Style: React.CSSProperties = {
  fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
  lineHeight: 1.1,
  letterSpacing: "-0.025em",
  color: "var(--text-primary)",
};

export default function LunchLearnFunnel({ faqs, sectionHeadings }: LunchLearnFunnelProps = {}) {
  const faqItems = faqs?.length ? faqs : LUNCH_LEARN_FAQS;
  const faqHeading = sectionHeadings?.faqHeading ?? "Common questions";

  return (
    <div data-surface="paper" style={{ background: "var(--bg-primary)" }}>
      {/* ── Session topics: pick the work, and the form takes the topic ── */}
      <section aria-labelledby="ll-topics" className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-4 items-end mb-10 lg:mb-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "var(--accent-text)" }}>
                Session topics
              </p>
              <h2 id="ll-topics" className="font-bold" style={h2Style}>
                Pick the work you&apos;re planning.
              </h2>
            </div>
            <p className="lg:col-span-5 text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Pick one and we build the session around it. Or leave it open and we cover the range.
            </p>
          </div>
          <LunchLearnTopics />
        </div>
      </section>

      {/* ── Common questions: the product pages' <details> list ─────── */}
      <section aria-labelledby="ll-faq" className="py-20 lg:py-24" style={{ background: "var(--bg-section-asphalt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="ll-faq" className="font-bold mb-7" style={h2Style}>
            {faqHeading}
          </h2>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-color)", background: "var(--bg-card-neutral)" }}>
            {faqItems.map((f, i) => (
              <details key={f.q} open={i === 0} className="group" style={{ borderTop: i === 0 ? "none" : "1px solid var(--border-color)" }}>
                <summary className="flex items-baseline justify-between gap-4 cursor-pointer list-none px-5 py-4 sm:px-6" style={{ color: "var(--text-primary)" }}>
                  <span className="font-semibold" style={{ fontSize: "0.98rem", lineHeight: 1.45 }}>{f.q}</span>
                  <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0 translate-y-[2px] transition-transform duration-200 group-open:rotate-45" style={{ color: "var(--accent-text-lg)" }}>
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 sm:px-6 leading-[1.75]" style={{ color: "var(--text-body)", fontSize: "0.95rem", maxWidth: "68ch" }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
