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
 * A's (30 Sep 2026); the facts are the site's own: a 45-minute session, in
 * person or virtual, lunch on HUB. No CE credit claims, ever: HUB does not
 * offer them (the launch-era Sanity copy claimed they did).
 *
 * Pure data: safe in server and client components, and importable by the
 * sync script under tsx.
 */

export interface LunchLearnFaq { q: string; a: string }

export const LUNCH_LEARN_FAQS: LunchLearnFaq[] = [
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

/** The FAQ heading the page prints until Studio changes it. */
export const LUNCH_LEARN_FAQ_HEADING = "Common questions";
