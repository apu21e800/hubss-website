/**
 * The daily social job's decisions that need no network, kept apart from
 * lib/social-pipeline.ts so `npm run test:social` can check them.
 *
 * Each article ends a run in one of four ways (decideOutcome):
 *  - "drafted": at least one draft reached Buffer. Done.
 *  - "nothing-possible": no channel could ever take it (only networks the job
 *    doesn't write for, or Instagram and no photo). Done, nothing drafted.
 *  - "retry": every channel failed for a reason that can clear (Buffer
 *    refused the draft, a channel is disconnected). Not done: the next daily
 *    run writes it again, and the email says why.
 *  - "gave-up": as "retry", but its first failed try was more than
 *    GIVE_UP_DAYS ago. Done, so a stuck article can't send an email every day
 *    for ever. Counted from the first failure, not the article's date, so an
 *    article first tried late (after a long outage, or when Buffer was first
 *    switched on) still gets its full stretch of retries.
 * A done article keeps its socialLog and is never drafted again.
 *
 * Until 9 Oct 2026 every article was logged whatever happened, so one bad run
 * would have used it up for good, and a run that stopped (an expired key)
 * told nobody.
 */

import { BufferApiError, type BufferChannel } from "@/lib/buffer";

/** "lasting": this article will never draft there. "retry": it can clear. */
export type SkipKind = "lasting" | "retry";

export interface ChannelSkip {
  service: string;
  channel: string;
  why: string;
  kind: SkipKind;
}

export type Outcome = "drafted" | "nothing-possible" | "retry" | "gave-up";

/** Days after an article's first failed try during which the job keeps retrying it. */
export const GIVE_UP_DAYS = 14;

/** Why a connected channel can't take a draft today, or null when it can. */
export function unusableReason(ch: Pick<BufferChannel, "isDisconnected" | "isLocked">): string | null {
  if (ch.isDisconnected) return "disconnected in Buffer: reconnect it there";
  if (ch.isLocked) return "locked by Buffer: the account has more channels than its plan allows";
  return null;
}

/**
 * See the header. `failingDays`: days since the article's first failed try,
 * or null when it has never failed before (so a first failure is always a
 * retry). `skipped` is never empty with nothing drafted: the pipeline stops
 * first when Buffer has no usable channel.
 */
export function decideOutcome(drafted: number, skipped: readonly Pick<ChannelSkip, "kind">[], failingDays: number | null): Outcome {
  if (drafted > 0) return "drafted";
  if (skipped.every((s) => s.kind === "lasting")) return "nothing-possible";
  return failingDays !== null && failingDays > GIVE_UP_DAYS ? "gave-up" : "retry";
}

/** Days since a date ("2026-10-07" or a full timestamp); 0 when it can't be read or is in the future. */
export function daysSince(date: string, now: Date): number {
  const t = Date.parse(date);
  return Number.isNaN(t) ? 0 : Math.max(0, (now.getTime() - t) / 86_400_000);
}

/** Sanity refused a create because the document exists: another run has the article. */
export function isConflict(err: unknown): boolean {
  const statusCode = typeof err === "object" && err !== null ? (err as { statusCode?: unknown }).statusCode : undefined;
  return statusCode === 409 || /already exists/i.test(err instanceof Error ? err.message : String(err));
}

export const NO_CHANNELS = "Buffer has no channel this job can draft for";

/**
 * What to do about a failed run or an undrafted article, for the email. Four
 * credentials can be refused, and each refusal names its own service:
 * Buffer's key (lib/buffer.ts writes "Buffer API 401"), Anthropic's
 * ("authentication_error", "invalid x-api-key"), and Sanity's two tokens
 * ("Unauthorized - Session not found", statusCode 401): the read token behind
 * the site's queries (lib/sanity.queries.ts wraps those as `Sanity query
 * "..." failed`) and the job's write token. Checked on 9 Oct 2026 against the
 * real services.
 */
export function failureHint(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  const status = err instanceof BufferApiError ? err.status : undefined;
  const statusCode = typeof err === "object" && err !== null ? (err as { statusCode?: unknown }).statusCode : undefined;
  const sanityRefused = statusCode === 401 || /Session not found/i.test(message);
  if (status === 401 || status === 403 || /Buffer API 40[13]\b|\((UNAUTHENTICATED|UNAUTHORIZED|FORBIDDEN)\)/.test(message)) {
    return "Buffer refused the API key: it has expired (a key lasts a year at most) or was deleted. Make a new one at publish.buffer.com/settings/api (choose 1 year), replace BUFFER_API_KEY in Vercel (Production) and redeploy.";
  }
  if (/authentication_error|x-api-key/i.test(message)) {
    return "Anthropic refused ANTHROPIC_API_KEY (expired or deleted). Make a new key at console.anthropic.com, replace it in Vercel (Production) and redeploy. The Insights drafter and the forms' spam screen use the same key.";
  }
  if (sanityRefused && /^Sanity query "/.test(message)) {
    return "Sanity refused SANITY_API_READ_TOKEN, the site's read token (expired or deleted). Make a new Viewer token at sanity.io/manage (project 9dbro2m1, API, Tokens), replace it in Vercel (Production) and redeploy.";
  }
  if (sanityRefused) {
    return "Sanity refused SANITY_API_WRITE_TOKEN (expired or deleted). Make a new Editor token at sanity.io/manage (project 9dbro2m1, API, Tokens), replace it in Vercel (Production) and redeploy.";
  }
  if (message.startsWith(NO_CHANNELS)) {
    return "Connect HUB's channels in Buffer: the LinkedIn page, the Facebook page and Instagram.";
  }
  if (/disconnected in Buffer/.test(message)) {
    return "Reconnect the channel in Buffer; the next daily run drafts into it.";
  }
  if (/locked by Buffer/.test(message)) {
    return "Buffer has more channels connected than the plan allows: remove one in Buffer or upgrade the plan.";
  }
  if (status === 429 || /rate limit/i.test(message)) {
    return "Buffer's request limit was reached. Nothing to do: the next daily run tries again.";
  }
  if (/Buffer API unreachable/.test(message)) {
    return "Buffer didn't answer in time. Nothing to do: the next daily run tries again.";
  }
  if (/Not configured|is not set/.test(message)) {
    const names = [...new Set(message.match(/\b[A-Z][A-Z0-9_]*_(?:KEY|TOKEN|SECRET)\b/g) ?? [])];
    const which = names.length ? `${names.join(" and ")} ${names.length > 1 ? "are" : "is"}` : "A key is";
    return `${which} missing in Vercel (Production). Add it and redeploy.`;
  }
  return "The error is above; the full record is in Vercel → hubss-website → Logs, filtered on [social].";
}
