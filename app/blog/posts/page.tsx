import { permanentRedirect } from "next/navigation";

// Rendered on request, never at build: nothing should reach this page while
// the next.config.ts rule stands, and a prerendered redirect would count as a
// built page that answers 308 in scripts/verify-site.mjs (check 2).
export const dynamic = "force-dynamic";

/**
 * /blog/posts was the "Blog" type's hub until 28 Sep 2026, when the five
 * Insights types became three sections, and /blog/articles until 26 Oct
 * 2026, when the three became two (lib/field-notes-taxonomy.ts): those posts
 * are listed with the Guides. next.config.ts answers this address with a 308
 * at the edge; this page is the fallback if that rule is ever removed, as
 * app/projects/page.tsx is for /projects. Keep the two destinations the same.
 */
export default function Page() {
  permanentRedirect("/blog/guides");
}
