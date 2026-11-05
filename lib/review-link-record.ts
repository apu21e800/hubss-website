/**
 * The private Sanity record that carries Doug's review link into the Studio
 * (4 Nov 2026; the sweep's Studio audit: the link lived only in one email
 * Vern forwarded him once, and changed whenever a secret changed in Vercel).
 * The morning run writes it (lib/review-link.ts, keepDougsLinkInStudio) and
 * the Studio's "Start here" pane reads it with the signed-in editor's own
 * session (sanity/components/GuidePane.tsx). The dot in the id keeps it out
 * of the public API, as the lead counts and the review ticks are kept
 * (lib/lead-counts.ts, lib/review-first.ts). No schema: nothing lists or
 * edits it by hand. Vern's agency link is never written anywhere: it stays
 * email-only.
 *
 * No imports: the Studio's bundle reads the id from here.
 */
export const DOUGS_LINK_ID = "review.dougs-link";
export const DOUGS_LINK_TYPE = "reviewLinkDoug";
