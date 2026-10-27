import { stegaClean } from "@sanity/client/stega";
import { current } from "@/lib/copy-superseded";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearnFunnel from "@/components/sections/LunchLearnFunnel";
import LunchLearn from "@/components/sections/LunchLearn";
import IdeaBookCard from "@/components/sections/IdeaBookCard";
import JsonLd from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getSanityPageContent } from "@/lib/sanity.queries";
import { LUNCH_LEARN_FAQS } from "@/lib/lunch-learn-content";
import { mergeHomepageCopy } from "@/lib/homepage-copy";

export const metadata = buildMetadata({
  // The audience named in full since 26 Oct 2026: the MediaEdge display ads
  // of November 2026 run to landscape architects (OALA), and the page they
  // land on said "Engineers & Planners".
  title: "Lunch & Learn for engineers, landscape architects and planners",
  description: "A free Lunch & Learn for engineering, landscape architecture and planning teams: Canadian case studies, spec language and samples. Your office or online.",
  slug: "lunch-learn",
});

// Service schema: Lunch & Learn is a free technical session, eligible for
// SERP enrichment with offer + provider linkage to the home-page Organization.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://hubss.com/lunch-learn#service",
  name: "HUB Lunch & Learn · Decorative Pavement Spec Session",
  serviceType: "Technical Lunch & Learn Presentation",
  description:
    "Free 60-minute presentation for engineering, architecture, and municipal-procurement teams covering decorative pavement systems, thermoplastic markings, and coloured coatings. Includes material samples, spec sheets, and regional installer contacts.",
  provider: { "@id": "https://hubss.com/#organization" },
  areaServed: { "@type": "Country", name: "Canada" },
  audience: {
    "@type": "Audience",
    audienceType: "Engineers, landscape architects, municipal procurement, transportation planners",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
    availability: "https://schema.org/InStock",
    url: "https://hubss.com/lunch-learn",
  },
};

export default async function LunchLearnPage() {
  // The homepage's sections too, for the Product Portfolio Book card's words
  // (IdeaBookCard reads the homepage strip's heading and line, Studio first).
  const [sanityPage, homePage] = await Promise.all([getSanityPageContent("lunch-learn"), getSanityPageContent("homepage")]);
  const bookCopy = mergeHomepageCopy(homePage?.homepageSections).ideaBook;
  // Body-section shim (Aug 2026): Sanity's lunch-learn doc was seeded from
  // the launch-era defaults. If a section is untouched since the seed (every
  // title/question still matches), serve the revised copy from the component
  // defaults; the moment the client edits anything in Studio, their content
  // wins wholesale. Delete after the Studio doc is refreshed.
  //
  // The doc's hero fields (eyebrow, heading lines, form labels) are not read
  // any more: since Aug 2026 the top of the page is the boardroom card, whose
  // copy is in components/sections/LunchLearnV2.tsx, and the hero they fed
  // was hidden. The Sanity fields are still in the schema; wiring them into
  // the shared card would change the homepage too, so it is not done here
  // (30 Sep 2026).
  //
  // 2 Oct 2026: the page reads only the FAQ list and the FAQ heading now. The
  // persona cards made way for the session topic tiles (code, in
  // LunchLearnTopics.tsx), and the "What You Walk Away With" cards have not
  // been rendered since 30 Sep; both fields are hidden in Studio, and
  // `npm run sync:pages` writes only what this page reads.
  const STALE_FAQ_QS = ["How long is the session?", "Is this actually free?", "Do we get continuing education credits?", "In-person or virtual?"];
  function freshArray<T extends Record<string, unknown>>(arr: T[] | undefined, key: string, staleVals: string[]): T[] | undefined {
    if (!arr?.length) return undefined;
    // stegaClean: Studio's preview marks every string (lib/sanity.preview.ts).
    const untouched = arr.every((item) => staleVals.includes(stegaClean(String(item[key] ?? ""))));
    return untouched ? undefined : arr;
  }
  // Keyed on the one heading the page reads (it was keyed on the seed's
  // "What You Get" heading, which the sync no longer writes, so an edited
  // FAQ heading could never have reached the page).
  function freshHeadings(h: { faqHeading?: string } | undefined) {
    if (!h?.faqHeading) return undefined;
    return stegaClean(h.faqHeading) === "Everything You Need to Know" ? undefined : { faqHeading: h.faqHeading };
  }
  // current(): three answers the 17 Oct 2026 copy review rewrote print as
  // the new lines until the clean-up script has run (lib/copy-superseded.ts).
  const faqs = (freshArray(sanityPage?.lunchLearnFaqs, "q", STALE_FAQ_QS) ?? LUNCH_LEARN_FAQS).map((f) => ({ ...f, a: String(current(f.a)) }));

  // FAQPage schema, built from the list the page shows so the two cannot
  // drift (they had: the schema asked "Is the session in-person or virtual?"
  // while the page asked "In-person or virtual?"). Eligible for rich-result
  // FAQ snippets in Google SERPs.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />
      <Nav />

      {/* The page leads with the same card every other page uses.
          LunchLearn -> LunchLearnV2 variant="boardroom" is the design that was
          chosen in Aug 2026 after three were built and reviewed ("just choose
          the best of the 3 and run with it"). The pitch and the form sit side
          by side above the fold; what follows is depth for anyone who wants
          it rather than a gate in front of the thing they came to do.

          #book stays live as an anchor (plenty of links across the site point
          at it) and lands on the form at the top. */}
      {/* scrollMarginTop: on a phone the card starts at the nav's height, so
          a #book landing put its top rule flush under the nav (30 Sep 2026). */}
      <div id="book" style={{ scrollMarginTop: 16 }}>
        {/* The card's heading is this page's h1 (QA, 28 Sep 2026: none). */}
        <LunchLearn titleAs="h1" />
      </div>

      {/* The Product Portfolio Book's large call to action, right under the
          card (Vern, 27 Oct 2026: "Doug will want a large CTA, I'd say under
          the L&L card to the Product Portfolio book"). */}
      <IdeaBookCard copy={bookCopy} />

      {/* Two sections under the card since 30 Sep 2026 (Vern: "clean up the
          lunch and learn page too. it's a bit messy"): the session topics
          (since 2 Oct 2026; the audiences before that), and the common
          questions. See the note in LunchLearnFunnel.tsx. */}
      <LunchLearnFunnel
        faqs={faqs}
        sectionHeadings={freshHeadings(sanityPage?.lunchLearnSectionHeadings)}
      />
      <Footer />
    </main>
  );
}
