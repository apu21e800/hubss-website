/**
 * LunchLearn — the site-wide Lunch & Learn conversion section.
 *
 * Vernon (Aug 2026): "the L&L page is not looking professional enough yet…
 * 2 or 3 options would be good even" → three options were built and reviewed
 * (Boardroom / Ticket / Proof), then "just choose the best of the 3 and run
 * with it." Boardroom won: it is the one design that stays quiet and
 * professional across every page this section renders on (landing, blog
 * index, blog posts, project pages, contact) — one elevated card, the pitch
 * and the form side by side, Moose on the corner. The Ticket option's
 * session-format picker was grafted into its form, so Doug and Cleve see
 * In-person / Virtual / Either right in the request email.
 *
 * The full three-variant component lives in LunchLearnV2.tsx.
 */
import LunchLearnV2 from "@/components/sections/LunchLearnV2";

export default function LunchLearn({ hideMoose: _hideMoose }: { hideMoose?: boolean } = {}) {
  return <LunchLearnV2 variant="boardroom" />;
}
