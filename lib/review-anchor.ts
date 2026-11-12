/**
 * The id an item's card carries on the review page (components/review/
 * ReviewView.tsx), so a button or an email lands on it: Vern's button
 * (app/review/[key]/actions.ts), Doug's email (lib/review-notify.ts) and the
 * Studio's "View Doug's page" link (sanity/components/ForReviewInput.tsx).
 *
 * No imports: the Studio's bundle reads it from here.
 */
export function anchorFor(kind: "article" | "social", id: string): string {
  return `${kind}-${id.replace(/[^A-Za-z0-9_-]+/g, "-")}`.slice(0, 120);
}
