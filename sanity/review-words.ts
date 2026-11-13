/**
 * The review's words in the Studio, in one place (12 Nov 2026, evening; Vern:
 * "instead of 'Send to Doug' button in blog post, say 'set review' or
 * something better, doug.bain@hubss.com, cleve.stordy, and vernon, all get
 * notified"). Read by the panel (sanity/components/ForReviewInput.tsx), the
 * badge (sanity.config.ts), the list's line and the field (sanity/schemas/
 * blogPost.ts), the job photos card (sanity/job-photos-line.ts), the job
 * photos form (sanity/schemas/fieldPost.ts) and the Blog posts list
 * (sanity/structure.ts). No imports, so the tests read it without the Studio.
 *
 * The button says what it does, not who it goes to: Doug sees the Studio
 * too, and "Send to Doug" read oddly on his own screen. REVIEWERS names who
 * the email goes to, lib/review-notify.ts REVIEW_ADDRESSES (`npm run
 * test:review` keeps the two together); Vern gets a copy of each email and
 * their replies.
 */

/** Who reads a new article before it goes live. */
export const REVIEWERS = "Doug and Cleve";

/** The button that sends a new article for their OK. */
export const SEND_FOR_REVIEW = "Send for review";

/** The badge, the list's line and the panel while it waits for their OK. */
export const IN_REVIEW = "In review";
