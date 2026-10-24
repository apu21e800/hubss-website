/**
 * Put the page back at `y` at once, whatever html's `scroll-behavior: smooth`
 * (app/globals.css) says. The phone menu and the map's project sheet lock the
 * page by fixing the body, and on close they restore the scroll; under smooth
 * scrolling that restore glided from the top of the page back down (phone QA,
 * 23 and 24 Oct 2026).
 *
 * `window.scrollTo({ behavior: "instant" })` says the same thing, but
 * "instant" is a later addition to the scroll options, and a browser whose
 * list does not have it throws a TypeError instead of scrolling; thrown in a
 * close handler, that would leave the page fixed. Switching html's own
 * behavior to auto for the one call works everywhere (Next.js's router does
 * the same).
 */
export function scrollWindowInstantly(y: number): void {
  const html = document.documentElement;
  const before = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  html.style.scrollBehavior = before;
}
