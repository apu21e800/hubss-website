/**
 * Doug reviews first (27 Oct 2026). Vern: "in the beginning Doug wants to
 * review the Blogs and Socials before they go out, but once we gain his trust
 * not making mistakes and nailing the brand voice, he will leave it in our
 * domain."
 *
 * While it is on (the default), nothing goes out by itself:
 *  - social posts wait in Buffer as drafts, every stream (lib/buffer.ts,
 *    socialAutoQueue), until someone presses Add to Queue there;
 *  - a Projects article written from Doug's job photos is saved held, not
 *    scheduled (lib/project-posts.ts); "Scheduled" on, or Publish, releases it;
 *  - the Insights drafter's drafts wait for Publish, as they always have.
 *
 * The review page (app/review/[key]/page.tsx, lib/review-page.ts) has two
 * links, both made only by the server from one secret:
 *  - Doug's (`client`): what 21e8 has put on his page, nothing else;
 *  - Vern's (`agency`): everything waiting, with 21e8's notes, and a button on
 *    each item that puts it on Doug's page or takes it off (the page's server
 *    action). Nothing on either page publishes or posts.
 * The links reach Vern by email (lib/review-link.ts), never Doug from the
 * site, and nothing on the site links to them.
 *
 * REVIEW_FIRST=off in Vercel (Production, then a redeploy) is the one switch
 * back to how it ran from 19 to 27 Oct: posts queued in Buffer, articles
 * scheduled when both checks are clean. Only Vern turns it.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const OFF = ["off", "no", "false", "0"];

/** True unless REVIEW_FIRST is off (or no, false, 0). */
export function reviewFirst(): boolean {
  const v = (process.env.REVIEW_FIRST ?? "").trim().toLowerCase();
  return !OFF.includes(v);
}

/**
 * What the keys are made from: REVIEW_SECRET when set, else a secret the
 * deployment already has. Changing whichever is used changes both links (the
 * next morning's run emails the new ones), so REVIEW_SECRET, set once, keeps
 * them steady whatever else is rotated.
 */
function reviewSecret(): string | undefined {
  return process.env.REVIEW_SECRET?.trim() || process.env.CRON_SECRET?.trim() || process.env.SANITY_API_WRITE_TOKEN?.trim() || undefined;
}

/** Who a link is for: Doug, or 21e8. */
export type ReviewAudience = "client" | "agency";

/** Bumping a label changes that link, as setting REVIEW_SECRET changes both. */
const LABEL: Record<ReviewAudience, string> = {
  client: "hubss-review-page-v1",
  agency: "hubss-review-page-v1-agency",
};
const KEY_LENGTH = 32;

/**
 * A review link's key: 32 characters (192 bits) of an HMAC of the server's
 * secret, so the same deployment always makes the same link and nobody
 * without the secret can make one, nor one link from the other. Null when the
 * server has no secret: then every key gets the site's 404.
 */
export function reviewKey(secret = reviewSecret(), audience: ReviewAudience = "client"): string | null {
  if (!secret) return null;
  return createHmac("sha256", secret).update(LABEL[audience]).digest("base64url").slice(0, KEY_LENGTH);
}

/** Compares bytes in constant time; a candidate of another length (or not text at all) never matches. */
function sameKey(candidate: unknown, key: string | null): boolean {
  if (!key || typeof candidate !== "string") return false;
  const a = Buffer.from(candidate, "utf8");
  const b = Buffer.from(key, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Whose key this is, or null for anything else. */
export function reviewAudience(candidate: unknown, secret = reviewSecret()): ReviewAudience | null {
  if (sameKey(candidate, reviewKey(secret, "client"))) return "client";
  if (sameKey(candidate, reviewKey(secret, "agency"))) return "agency";
  return null;
}

/** True only for Doug's key. */
export function isReviewKey(candidate: unknown, secret = reviewSecret()): boolean {
  return reviewAudience(candidate, secret) === "client";
}

export const REVIEW_SITE = "https://hubss.com";

/** A review link, or null when the server can't make a key. */
export function reviewLink(secret = reviewSecret(), audience: ReviewAudience = "client"): string | null {
  const key = reviewKey(secret, audience);
  return key ? `${REVIEW_SITE}/review/${key}` : null;
}

/** Vern's link: everything waiting, and the buttons that put it on Doug's page. */
export function agencyLink(secret = reviewSecret()): string | null {
  return reviewLink(secret, "agency");
}

/**
 * The private Sanity document that records the links were emailed: one per
 * key (a short hash of Doug's key, never a key), so new keys are emailed
 * again. The dot keeps it out of the public API, as lead counts are kept
 * (lib/lead-counts.ts).
 */
export function reviewLinkRecordId(key: string): string {
  return `review.link-${createHash("sha256").update(key).digest("hex").slice(0, 12)}`;
}

/**
 * The private record that a group of social posts (one Sent to Buffer record,
 * or a post made by hand in Buffer) is on Doug's page: 21e8 read it first.
 */
export function reviewTickId(groupKey: string): string {
  return `review.ok-${createHash("sha256").update(groupKey).digest("hex").slice(0, 16)}`;
}
