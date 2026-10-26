import { permanentRedirect } from "next/navigation";

// Rendered on request, never at build: nothing should reach this page while
// the next.config.ts rule stands, and a prerendered redirect would count as a
// built page that answers 308 in scripts/verify-site.mjs (check 2).
export const dynamic = "force-dynamic";

/**
 * /blog/articles was the Articles section from 28 Sep 2026, when the five
 * Insights types became three sections, to 26 Oct 2026, when the three
 * became two (lib/field-notes-taxonomy.ts): the eight "Blog" posts it listed
 * are with the Guides now. next.config.ts answers this address with a 308 at
 * the edge; this page is the fallback if that rule is ever removed, as
 * app/blog/posts/page.tsx is for the address before it. Keep the
 * destinations the same.
 */
export default function Page() {
  permanentRedirect("/blog/guides");
}
