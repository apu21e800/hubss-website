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
 * too, and "Send to Doug" read oddly on his own screen. The review is HUB's
 * own step, not one person's (Vern, the same evening: "let make it more about
 * hubss ops and less about Doug, moving forward. just need to satisfy dougs
 * needs"), so the Studio says "the HUB team"; the email itself greets its
 * people by name (lib/review-notify.ts greetingFor). `npm run test:review`
 * keeps every address the email goes to at hubss.com, so the words stay true.
 */

/** Who reads a new article before it goes live (lower case: it sits mid-sentence; upFirst starts one). */
export const REVIEWERS = "the HUB team";

/** The same words at the start of a sentence: "The HUB team". */
export const upFirst = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** The button that sends a new article for their OK. */
export const SEND_FOR_REVIEW = "Send for review";

/** The badge, the list's line and the panel while it waits for their OK. */
export const IN_REVIEW = "In review";
