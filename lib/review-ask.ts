/**
 * The Studio's ask (the review of PR #141, 12 Nov 2026): before "Send to
 * Doug" or "Take it back" asks the site to email Doug or clear his notice
 * (POST /api/review/notify), the Studio creates a private record with the
 * editor's own session, `review.ask-<random>`, saying which article and which
 * way. Only a signed-in editor can make one, so the route acts only for an
 * editor and tells nobody else anything about drafts (lib/review-notify.ts,
 * takeAsk). The dot keeps the record out of the public API.
 *
 * No imports: the Studio's bundle reads it from here.
 */
export const ASK_TYPE = "reviewAsk";
export const ASK_PREFIX = "review.ask-";
/** The random part, as newAskKey makes it. */
export const ASK_KEY = /^[a-f0-9]{32,64}$/;

/** 160 random bits as hex: an ask's key, which nobody can guess. */
export function newAskKey(): string {
  const bytes = new Uint8Array(20);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
