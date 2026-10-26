/**
 * Lunch & Learn copy that lives in both the page and Sanity: the questions
 * and answers under the booking card on /lunch-learn.
 *
 * One source for the page (components/sections/LunchLearnFunnel.tsx), its
 * FAQPage schema (app/lunch-learn/page.tsx builds it from the list the
 * visitor sees) and `npm run sync:pages`, which pushes this list into the
 * Sanity page document so Studio holds what the site shows. The page serves
 * this list until the client edits the questions in Studio (the shim in
 * app/lunch-learn/page.tsx); after that, Studio wins.
 *
 * 2 Oct 2026: cut back from session B's file to the one list the shipped
 * page reads. The persona cards, the "What you walk away with" items and
 * the topic tiles' data are not here: the first two are not rendered, the
 * tiles are code (components/sections/LunchLearnTopics.tsx). The copy is
 * A's (30 Sep 2026); the facts are the site's own: a 60-minute session (Doug,
 * 26 Oct 2026: "60 mins, across the board"; the printed book: "Got an
 * hour?"; it was 45 until then), in person or virtual, lunch on HUB. No CE credit claims, ever: HUB does not
 * offer them (the launch-era Sanity copy claimed they did).
 *
 * Pure data: safe in server and client components, and importable by the
 * sync script under tsx.
 */

export interface LunchLearnFaq { q: string; a: string }

export const LUNCH_LEARN_FAQS: LunchLearnFaq[] = [
  {
    q: "How long is the session?",
    a: "Sixty minutes, then questions for as long as you want. We stick to the time we agree on.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. No invoice, no minimum order, no follow-up pressure. It is how we introduce the systems to the people who write the specs.",
  },
  {
    q: "Who should be in the room?",
    a: "Engineers, planners, landscape architects, project managers, procurement: anyone who touches the surface spec. Sessions are built for mixed teams, and there's no cap on seats.",
  },
  {
    q: "In-person or virtual?",
    a: "Both. In-person sessions are available across Canada through our certified installers. Virtual sessions use Zoom or Teams, and we mail the sample kit ahead.",
  },
];

/** The FAQ heading the page prints until Studio changes it. */
export const LUNCH_LEARN_FAQ_HEADING = "Common questions";
