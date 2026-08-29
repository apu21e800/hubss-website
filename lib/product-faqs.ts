/**
 * Product FAQs — the client's own answers, restructured for the web.
 *
 * WHY THIS EXISTS. Semrush (CA, Aug 2026): of the 58 keywords hubss.com ranks
 * for, 45 trigger People Also Ask boxes and 35 trigger AI Overviews. Those
 * surfaces are built from question-shaped content — and every question people
 * actually search ("what is stamped asphalt", "how long does stamped asphalt
 * last", "can you stamp existing asphalt") already had an approved answer
 * sitting in a PDF crawlers cannot quote: public/docs/streetprint/
 * streetprint-faq.pdf.
 *
 * So this file is that PDF, transcribed. The answers are HUB's own, lightly
 * edited from print to web register. Nothing here is invented — no prices
 * (the PDF names none), no service-life claims beyond what the product pages
 * already state, no credit claims of any kind.
 *
 * ADDING A PRODUCT: only from that product's own published documents. The
 * moment an answer needs a fact no HUB document states, it does not go in.
 *
 * Rendered by components/products/ProductFaq.tsx; emitted as FAQPage JSON-LD
 * by app/products/[slug]/page.tsx. Keep the visible text and the schema fed
 * from this single source so they can never drift apart.
 */

export interface ProductFaqEntry {
  /** The question, phrased the way a person searches it. */
  q: string;
  /** The answer, complete in itself — assume it is read with no page around it. */
  a: string;
}

export const PRODUCT_FAQS: Record<string, ProductFaqEntry[]> = {
  streetprint: [
    {
      q: "What is StreetPrint stamped asphalt?",
      a: "StreetPrint is stamped asphalt — the original decorative asphalt system, installed in Canada since 1992. A pattern is pressed into asphalt using heat, a stamping template, and a plate compactor, then the surface is coloured and sealed with StreetBond coatings. The result gives the look of brick, cobblestone, or stone while keeping the flexibility and flush surface of asphalt.",
    },
    {
      q: "Can you stamp existing asphalt, or only new asphalt?",
      a: "Both. New asphalt can be stamped while it is still hot behind the paver, and existing asphalt in good condition can be reheated in place with infrared asphalt-reheating technology and then stamped. Reheating is what makes retrofits possible — a sound existing driveway or intersection does not need to be repaved to be patterned.",
    },
    {
      q: "How long does stamped asphalt last?",
      a: "The print is as durable as the asphalt it is stamped into — installed correctly on sound pavement, it lasts the life of the surface itself. In Canadian municipal service that is a 10–20 year range, and StreetPrint installations have been performing on public streets for over 30 years.",
    },
    {
      q: "Does stamped asphalt need maintenance?",
      a: "The stamped pattern itself requires no maintenance. Where a finishing system such as StreetBond coating is applied, the coating can be refreshed on its own cycle — a recoat, not a rebuild — following the coating manufacturer's guidelines.",
    },
    {
      q: "When can stamped asphalt be opened to traffic?",
      a: "Left uncoated, StreetPrint can be opened to traffic immediately after stamping. When a coating system is applied, opening follows the coating's cure time rather than the stamping — for StreetBond, that is measured in hours, not days.",
    },
    {
      q: "Is stamped asphalt cheaper than brick or interlocking pavers?",
      a: "StreetPrint carries a significant cost advantage over brick and paver alternatives, and installs faster — there is no excavation, no unit placement, and no jointing. It also avoids the long-term costs pavers accumulate: no joints for weeds, no units to settle or heave, and nothing for a snowplow blade to catch.",
    },
    {
      q: "Can StreetPrint be used on speed bumps and raised crosswalks?",
      a: "Yes. StreetPrint can be applied to any speed table or raised feature built from stable asphalt, which is how many municipalities pattern traffic-calming installations — the calming geometry and the visual treatment go in as one surface.",
    },
    {
      q: "How thick does the asphalt need to be?",
      a: "StreetPrint should go onto stable asphalt designed for its application and installed to specification — for most hot-mix designs that is a compacted thickness of 1.5 to 2 inches. Stamping into significantly thinner asphalt risks cracking along the grout lines unless the pavement was specifically engineered for that thickness.",
    },
    {
      q: "Can StreetPrint be installed on a patio or over seal-coat?",
      a: "Neither is recommended. Patios and pool decks are better served by concrete or patio stone, because asphalt can take indents from furniture point loads. Seal-coated surfaces should not be stamped at all — most sealers become unsafe to work and sticky when heated, so the seal-coat would need to be removed first.",
    },
  ],
};

export function faqsFor(slug: string): ProductFaqEntry[] | undefined {
  return PRODUCT_FAQS[slug];
}
