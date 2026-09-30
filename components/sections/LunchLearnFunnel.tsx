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
 *   1. Who it's for: an h2, one paragraph on what everyone leaves with (the
 *      three "walk away with" points, which the card's ticks also carry),
 *      and the four audiences as plain text blocks in a 2x2. No chips, no
 *      numerals, no boxes.
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
 * Sanity (sanity/schemas/page.ts, group "Lunch & Learn") still holds the
 * persona and FAQ arrays and the section headings: app/lunch-learn/page.tsx
 * passes them through when the client has edited them in Studio, and the
 * defaults below serve until then. A persona's `badge` is accepted and not
 * shown, and the "What You Walk Away With" cards are no longer rendered
 * anywhere; both Studio fields want retiring (not done here).
 */

export interface LunchLearnFunnelProps {
  personas?: { title: string; desc: string; badge?: string }[];
  faqs?: { q: string; a: string }[];
  sectionHeadings?: {
    whatYouGetEyebrow?: string;
    whatYouGetHeading?: string;
    personasEyebrow?: string;
    personasHeading?: string;
    faqEyebrow?: string;
    faqHeading?: string;
  };
}

const PERSONAS = [
  {
    title: "Municipal engineers & planners",
    desc: "Crosswalks, transit corridors, and complete streets that meet Vision Zero and Complete Streets specifications, with accessibility-aware design. Real installation data from Canadian municipalities coast to coast.",
  },
  {
    title: "Landscape architects & designers",
    desc: "12+ StreetPrint patterns, full StreetBond Pantone palette, and decorative surfaces engineered to outlast the design life of the asphalt beneath them. Snowplow-safe and engineering-approved.",
  },
  {
    title: "Engineering & consulting firms",
    desc: "Lifecycle cost data, performance specs, and installation standards you can cite directly in tender documents, plus the certified HUB applicator contacts for your region.",
  },
  {
    title: "Contractors & applicators",
    desc: "Learn about the HUB certified applicator program: territory-protected bidding and direct manufacturer support through the certified program.",
  },
];

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

export default function LunchLearnFunnel({ personas, faqs, sectionHeadings }: LunchLearnFunnelProps = {}) {
  const personaItems = personas?.length ? personas : PERSONAS;
  const faqItems = faqs?.length ? faqs : LUNCH_LEARN_FAQS;
  const personasEyebrow = sectionHeadings?.personasEyebrow ?? "Who it's for";
  const personasHeading = sectionHeadings?.personasHeading ?? "Your whole team, one session.";
  const faqHeading = sectionHeadings?.faqHeading ?? "Common questions";

  return (
    <div data-surface="paper" style={{ background: "var(--bg-primary)" }}>
      {/* ── Who it's for, and what they leave with ─────────────────── */}
      <section aria-labelledby="ll-audience" className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 lg:mb-14">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "var(--accent-text)" }}>
              {personasEyebrow}
            </p>
            <h2 id="ll-audience" className="font-bold mb-5" style={h2Style}>
              {personasHeading}
            </h2>
            {/* The three points of the old "What you walk away with" section,
                in one sentence. The roles are the FAQ's own list. */}
            <p className="text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Engineers, planners, landscape architects, project managers and procurement sit in the same
              session. Everyone leaves with spec language ready for the next RFP, the lifecycle cost math,
              physical samples, current data sheets and the certified applicator list for their region.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-8 lg:gap-y-10">
            {personaItems.map((p) => (
              <div key={p.title} className="pt-5" style={{ borderTop: "1px solid var(--border-color)" }}>
                <h3 className="font-semibold text-[17px] leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  {p.title}
                </h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)", maxWidth: "58ch" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
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
