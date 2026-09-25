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
 * The full component lives in LunchLearnV2.tsx.
 *
 * Since 25 Sep 2026 (Doug's round) the boardroom card runs only on the
 * homepage and /lunch-learn. Every other template passes `compact` and gets
 * the band: Moose, one line, one button, pointing at /lunch-learn.
 */
import LunchLearnV2 from "@/components/sections/LunchLearnV2";

export default function LunchLearn({
  hideMoose: _hideMoose,
  hideForm = false,
  compact = false,
}: { hideMoose?: boolean; hideForm?: boolean; compact?: boolean } = {}) {
  if (compact) return <LunchLearnV2 variant="band" />;
  return <LunchLearnV2 variant="boardroom" hideForm={hideForm} />;
}
