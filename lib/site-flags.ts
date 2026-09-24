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

  // ── Map
  /** Canada project map on the homepage. Toggle off if MapLibre is causing
   *  issues or if map data needs to be updated before showing publicly. */
  showMap: true,

  // ── Theme
  /** The Dark · Mixed · Light switch in the nav.
   *
   *  It is a review control: it exists so Vern and Doug can compare the three
   *  modes on a real page. It shipped visible to the public on 21 Sep, which
   *  was a mistake — a visitor has no reason to be offered the version of the
   *  site we decided against.
   *
   *  Turning it off does NOT turn off the themes. Mixed is still the default,
   *  and ?theme=dark / ?theme=mixed / ?theme=light still switch and still
   *  stick, because that lives in the bootstrap in app/layout.tsx. Set this
   *  true when you want the switch back in the bar. */
  showThemeToggle: false,

  // ── Social proof
  /** Leo Guddemi / Stantec pull-quote on the Lunch & Learn page.
   *  Pending Vernon's approval before going live. */
  showLeoQuote: false,

  // Blog automation has no flag: the AI drafter runs on a schedule and writes
  // unpublished drafts into Studio (lib/field-note-pipeline.ts). The old
  // /admin/blog panel, which saved files Vercel can't write, was removed.

  // ── Social automation
  /** /admin/social post composer. Requires OAuth tokens per platform. */
  showAdminSocial: true,

  // ── Add new flags here
  // e.g. showTestimonials: false,
  // e.g. showPricingPage: false,

} as const;

export type SiteFlags = typeof SITE_FLAGS;
