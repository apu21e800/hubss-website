/** Shared destinations for the reader's chrome, so the two routes agree. */
export const EXIT_HREF = "/resources";
export const REQUEST_HREF = "/request-idea-book?utm_source=idea-book&utm_medium=reader&utm_campaign=printed_copy";
export const LUNCH_LEARN_HREF = "/lunch-learn?utm_source=idea-book&utm_medium=reader&utm_campaign=web";

/**
 * Close the Idea Book: back to the page the reader came from when that page
 * is on this site, otherwise to `fallback` (EXIT_HREF). QA, Sep 2026: Close
 * always went to /resources, even from the homepage.
 *
 * One step back is the page before the book, because the reader turns pages
 * with replaceState. document.referrer alone can't tell: a link inside the
 * site is a client-side navigation and leaves the referrer at whatever loaded
 * the tab. So the tab's first page decides first (another page of this site
 * means every entry behind the book is ours), then the referrer (a full load
 * from this site). A new tab has nowhere to go back to, hence the length check.
 *
 * Browser only: call it from a click or key handler, never while rendering.
 */
export function leaveIdeaBook(fallback: string = EXIT_HREF): void {
  const here = window.location.origin;
  const insideBook = (u: URL) => u.origin === here && u.pathname.startsWith("/idea-book");
  let fromSite = false;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const firstPage = nav ? new URL(nav.name) : null;
    if (firstPage && firstPage.origin === here && !insideBook(firstPage)) {
      fromSite = true;
    } else if (document.referrer) {
      const ref = new URL(document.referrer);
      fromSite = ref.origin === here && !insideBook(ref);
    }
  } catch {
    fromSite = false;
  }
  if (fromSite && window.history.length > 1) window.history.back();
  else window.location.assign(fallback);
}
