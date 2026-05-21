/**
 * site-flags.ts — Central feature toggle for hubss.com
 *
 * HOW TO USE
 * ----------
 * Set a flag to `true` to show a section / feature, `false` to hide it.
 * After changing, do `git commit && git push origin HEAD:main` — Vercel
 * rebuilds automatically (~90 seconds to live).
 *
 * For instant toggle without a code push (advanced):
 * Go to Vercel → hubss-website → Settings → Environment Variables,
 * add `NEXT_PUBLIC_SHOW_MAP=true` etc., then redeploy.
 */

export const SITE_FLAGS = {

  // ── Map ──────────────────────────────────────────────────────────────────
  /** Canada project map on the homepage. Toggle off if MapLibre is causing
   *  issues or if map data needs to be updated before showing publicly. */
  showMap: true,

  // ── Social proof ─────────────────────────────────────────────────────────
  /** Leo Guddemi / Stantec pull-quote on the Lunch & Learn page.
   *  Pending Vernon's approval before going live. */
  showLeoQuote: false,

  // ── Blog automation ──────────────────────────────────────────────────────
  /** /admin/blog AI generation panel. Only useful when ANTHROPIC_API_KEY
   *  is set in Vercel env vars. */
  showAdminBlog: true,

  // ── Social automation ────────────────────────────────────────────────────
  /** /admin/social post composer. Requires OAuth tokens per platform. */
  showAdminSocial: true,

  // ── Add new flags here ────────────────────────────────────────────────────
  // e.g. showTestimonials: false,
  // e.g. showPricingPage: false,

} as const;

export type SiteFlags = typeof SITE_FLAGS;
