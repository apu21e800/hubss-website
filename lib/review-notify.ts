/**
 * Doug hears when an article is waiting for him (12 Nov 2026; Vern: "it might
 * be ideal if he gets an email when there is a blog ready for him to review").
 *
 * Until then the step was Vern's to remember: switch on "Ready for Doug's
 * review" (or press "Put on Doug's page" on his own review page), then tell
 * Doug. Now sending it to Doug emails him: the article's title and opening
 * line and one button to it on his review page (lib/review-first.ts,
 * reviewLink), in plain words, nothing about how the article was made or
 * where it waits. His reply goes to Vern, and Vern gets a copy of each one.
 *
 * Three ways in, one function (notifyDoug), so it never goes twice:
 *  - "Send to Doug" in the Studio (sanity/components/ForReviewInput.tsx,
 *    through POST /api/review/notify, app/api/review/notify/route.ts);
 *  - Vern's button on his review page (app/review/[key]/actions.ts);
 *  - the daily run (app/api/cron/social-drafts, notifyMissedReviews), the
 *    safety net for a send the other two missed: a phone that lost its
 *    signal, the mail service saying no, a Studio opened on a preview.
 *
 * One private record per article, `review.mailed-<hash>` (the dot keeps it
 * out of the public API, as the review links and the lead counts are kept),
 * type "reviewMailed", with the article's published id in `articleId` (the
 * Studio reads it by that field): created before the email goes (a create
 * fails when the record exists, so two presses at once send one email),
 * marked sent after, and cleared when the article is taken back or
 * published. Sent again after that, it is a second round: "Ready again for
 * your OK". Only a new article counts: Doug's page shows drafts of articles
 * that were never published (lib/review-page.ts, selectArticles), and so
 * does this.
 *
 * Only the production site sends (sendsHere): the link's key is made from
 * the deployment's own secret, and a preview's or a laptop's would open
 * nothing on hubss.com. A send made anywhere else goes with the next daily
 * run. Off with REVIEW_FIRST=off (Doug no longer reviews) or
 * REVIEW_EMAIL_TO=off. REVIEW_EMAIL_TO is Doug's address
 * (doug.bain@hubss.com when not set); REVIEW_REPLY_TO is where his reply
 * goes (the first BLOG_DRAFT_NOTIFY address when not set).
 */
import { createHash } from "node:crypto";
import type { SanityClient } from "@sanity/client";
import { editorAddresses, sendMail, type Mail } from "@/lib/editor-mail";
import { reviewFirst, reviewLink } from "@/lib/review-first";
import { anchorFor } from "@/lib/review-page";
import { ASK_KEY, ASK_PREFIX, ASK_TYPE } from "@/lib/review-ask";

/** The record's type. sanity/components/ForReviewInput.tsx reads it by this name. */
export const MAILED_TYPE = "reviewMailed";

/** Doug's address when REVIEW_EMAIL_TO is not set: his own, at the East office. */
export const DOUGS_ADDRESS = "doug.bain@hubss.com";

/** Who signs the email: the name Doug knows the review by (his page says to reply to Vern). */
const SIGNED = "Vern";
export const DOUG_EMAIL_FROM = `${SIGNED} via hubss.com <noreply@hubss.com>`;

const OFF = ["off", "no", "false", "0", "none"];

const publishedIdOf = (id: string) => id.replace(/^drafts\./, "");
const draftIdOf = (id: string) => `drafts.${publishedIdOf(id)}`;

/** The record's id for an article: a short hash of its published id, so it stays short whatever the slug. */
export function mailedRecordId(articleId: string): string {
  return `review.mailed-${createHash("sha256").update(publishedIdOf(articleId)).digest("hex").slice(0, 16)}`;
}

/** Doug's address(es), or none when the email is switched off. */
export function dougsAddresses(env: Record<string, string | undefined> = process.env): string[] {
  const v = (env.REVIEW_EMAIL_TO ?? "").trim();
  if (OFF.includes(v.toLowerCase())) return [];
  return (v || DOUGS_ADDRESS)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(s));
}

/** Where Doug's reply goes: REVIEW_REPLY_TO, else the first editor (Vern). */
export function replyToAddress(env: Record<string, string | undefined> = process.env): string | undefined {
  const v = (env.REVIEW_REPLY_TO ?? "").trim();
  if (v) return v;
  return (env.BLOG_DRAFT_NOTIFY ?? "").split(",").map((s) => s.trim()).filter(Boolean)[0];
}

/**
 * Whether this deployment sends: production only, by the runtime's
 * VERCEL_ENV, else the build's (as lib/lead-counts.ts countingOn).
 */
export function sendsHere(env: Record<string, string | undefined> = process.env): boolean {
  return (env.VERCEL_ENV || env.NEXT_PUBLIC_VERCEL_ENV) === "production";
}

export interface DougEmail {
  subject: string;
  text: string;
  html: string;
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** One line of a title or excerpt: spaces tidied, no line breaks. */
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

/** An excerpt cut at a word, so a long one doesn't fill the email. */
export function shortExcerpt(s: string, max = 240): string {
  const line = oneLine(s);
  if (line.length <= max) return line;
  const cut = line.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, "")}...`;
}

/**
 * The email, pure for `npm run test:review`: plain words, the article, one
 * button. `round` 2 and up: an article he has been sent before.
 */
export function dougArticleEmail(article: { title: string; excerpt?: string | null; link: string }, round = 1): DougEmail {
  const title = oneLine(article.title);
  const excerpt = shortExcerpt(article.excerpt ?? "");
  const again = round > 1;
  const subject = `${again ? "Ready again for your OK" : "Ready for your OK"}: ${title}`;
  const opening = again
    ? "An article you have seen before is ready for you to read again:"
    : "A new article for hubss.com is ready for you to read:";
  const close = "Reply to this email with OK, or with anything you'd change. Nothing goes on the site without your OK.";
  const text = [
    "Hi Doug,",
    "",
    opening,
    "",
    title,
    ...(excerpt ? [excerpt] : []),
    "",
    `Read it here: ${article.link}`,
    "",
    close,
    "",
    SIGNED,
  ].join("\n");
  const html = [
    "<!doctype html>",
    '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>',
    '<body style="margin:0;padding:0;background:#f4f2ee;">',
    '<div style="max-width:560px;margin:0 auto;padding:28px 20px 36px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#1f1f1f;">',
    '<p style="margin:0 0 16px;">Hi Doug,</p>',
    `<p style="margin:0 0 20px;">${escapeHtml(opening)}</p>`,
    '<div style="border-left:3px solid #F97316;padding:2px 0 2px 16px;margin:0 0 24px;">',
    `<p style="margin:0;font-size:19px;font-weight:700;line-height:1.3;">${escapeHtml(title)}</p>`,
    ...(excerpt ? [`<p style="margin:8px 0 0;color:#4a4a4a;">${escapeHtml(excerpt)}</p>`] : []),
    "</div>",
    `<p style="margin:0 0 24px;"><a href="${escapeHtml(article.link)}" style="display:inline-block;background:#F97316;color:#1A0E05;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:8px;">Read the article</a></p>`,
    `<p style="margin:0 0 16px;">${escapeHtml(close)}</p>`,
    `<p style="margin:0;">${SIGNED}</p>`,
    "</div></body></html>",
  ].join("\n");
  return { subject, text, html };
}

export type NotifyOutcome =
  | "sent"
  | "already sent"
  | "busy"
  | "not ticked"
  | "already on the site"
  | "not found"
  | "not sent"
  | "elsewhere"
  | "off";

interface Article {
  _id: string;
  _type?: string;
  title?: string | null;
  excerpt?: string | null;
  forReview?: boolean | null;
}

interface MailedRecord {
  _id: string;
  _rev: string;
  round?: number;
  state?: "sending" | "sent" | "failed";
  cleared?: boolean;
  at?: string;
}

const STATE_QUERY = `{
  "article": *[_id == $draft][0]{ _id, _type, title, excerpt, forReview },
  "live": defined(*[_id == $published][0]._id),
  "record": *[_id == $record][0]{ _id, _rev, round, state, cleared, at }
}`;

interface State {
  article: Article | null;
  live: boolean;
  record: MailedRecord | null;
}

/** A claim older than this is a send that died between the claim and the email: it may be taken again. */
const STALE_CLAIM_MS = 10 * 60_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Reads the article and its record. With `waitMs`, waits that long at most for
 * the article's switch to read as `want` (the Studio saves a change a moment
 * after it is made); an article that isn't there is answered at once.
 */
async function readState(client: SanityClient, id: string, want: boolean, waitMs: number): Promise<State> {
  const params = { draft: draftIdOf(id), published: publishedIdOf(id), record: mailedRecordId(id) };
  const until = Date.now() + waitMs;
  for (;;) {
    const state = await client.fetch<State>(STATE_QUERY, params);
    if (!state.article || (state.article.forReview === true) === want || Date.now() >= until) return state;
    await sleep(1000);
  }
}

export interface NotifyOptions {
  now?: Date;
  /** How long to wait for a fresh send to be saved. */
  waitMs?: number;
  /** The mail service (sendMail); `npm run test:review` passes its own. */
  send?: (mail: Mail, tag?: string) => Promise<string[]>;
}

/** An article whose round this send has taken: its email goes next. */
interface Claim {
  draftId: string;
  recordId: string;
  round: number;
  title: string;
  excerpt?: string | null;
}

/**
 * Takes the article's round, so nobody else emails Doug about it: the claim,
 * or why there is nothing to send. One email per round, whoever asks first.
 */
async function claimRound(client: SanityClient, id: string, now: Date, waitMs: number): Promise<Claim | NotifyOutcome> {
  const { article, live, record } = await readState(client, id, true, waitMs);
  if (!article || article._type !== "blogPost") return "not found";
  if (live) return "already on the site";
  if (article.forReview !== true) return "not ticked";
  const title = article.title?.trim();
  if (!title) return "not found";

  const recordId = mailedRecordId(id);
  let round = 1;
  try {
    if (!record) {
      await client.create({ _id: recordId, _type: MAILED_TYPE, articleId: publishedIdOf(id), round, state: "sending", at: now.toISOString() });
    } else {
      const fresh = record.state === "sending" && !(record.at && now.getTime() - Date.parse(record.at) > STALE_CLAIM_MS);
      if (fresh) return "busy";
      if (record.state === "sent" && !record.cleared) return "already sent";
      round = record.state === "sent" ? (record.round ?? 1) + 1 : record.round ?? 1;
      await client.patch(recordId).ifRevisionId(record._rev).set({ round, state: "sending", cleared: false, at: now.toISOString() }).commit();
    }
  } catch {
    // Someone else took it a moment ago.
    return "busy";
  }
  return { draftId: draftIdOf(id), recordId, round, title, excerpt: article.excerpt };
}

/**
 * Marks the round sent, or failed so the next press or run sends it. An
 * article taken back while its email was on its way is cleared here (and
 * clearDougNotice clears a round still sending), so sending it again is a
 * new round whichever happened first (the review of PR #141).
 */
async function finishRound(client: SanityClient, claim: Claim, sent: boolean, now: Date): Promise<void> {
  // Whether it was taken back meanwhile. If Sanity can't say, the round is
  // still marked sent (never left "sending", which a later run would take for
  // a send that died, and email again); the morning run clears it if the
  // article was taken back.
  let takenBack = false;
  if (sent) {
    try {
      takenBack = (await readState(client, claim.draftId, true, 0)).article?.forReview !== true;
    } catch (err) {
      console.error(`[review] couldn't read ${claim.draftId} after its email: ${err instanceof Error ? err.message : err}`);
    }
  }
  const fields = sent
    ? { state: "sent", mailedAt: now.toISOString(), title: claim.title, ...(takenBack ? { cleared: true, clearedAt: now.toISOString() } : {}) }
    : { state: "failed", failedAt: now.toISOString() };
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await client.patch(claim.recordId).set(fields).commit();
      break;
    } catch (err) {
      if (attempt === 3) console.error(`[review] the email record for ${claim.draftId} wasn't saved: ${err instanceof Error ? err.message : err}`);
      else await sleep(400 * attempt);
    }
  }
  if (sent) console.log(`[review] Doug was emailed about ${claim.draftId} (round ${claim.round})`);
}

function mailTo(email: DougEmail): Mail {
  return { to: dougsAddresses(), subject: email.subject, text: email.text, html: email.html, replyTo: replyToAddress(), bcc: editorAddresses(), from: DOUG_EMAIL_FROM };
}

/**
 * Emails Doug that the article (`id`: its draft's id or its published id) is
 * on his page, once per round. Never throws for the article's sake: the
 * outcome says what happened.
 */
export async function notifyDoug(client: SanityClient, id: string, opts: NotifyOptions = {}): Promise<NotifyOutcome> {
  if (!reviewFirst() || !dougsAddresses().length) return "off";
  if (!sendsHere()) return "elsewhere";
  const page = reviewLink();
  if (!page) return "off";
  const now = opts.now ?? new Date();
  const claim = await claimRound(client, id, now, opts.waitMs ?? 0);
  if (typeof claim === "string") return claim;
  const email = dougArticleEmail({ title: claim.title, excerpt: claim.excerpt, link: `${page}#${anchorFor("article", claim.draftId)}` }, claim.round);
  const sent = (await (opts.send ?? sendMail)(mailTo(email), "review")).length > 0;
  await finishRound(client, claim, sent, now);
  return sent ? "sent" : "not sent";
}

const NUMBER_WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

/**
 * Several articles in one email, for the morning run (notifyMissedReviews):
 * the articles already on his page the first morning, or a few sent where the
 * Studio couldn't email. Each title goes to its card. Pure, for the tests.
 */
export function dougDigestEmail(articles: { title: string; link: string }[], page: string): DougEmail {
  const count = NUMBER_WORDS[articles.length] ?? String(articles.length);
  const titles = articles.map((a) => ({ title: oneLine(a.title), link: a.link }));
  const subject = `${count} articles ready for your OK`;
  const opening = `${count} articles for hubss.com are ready for you to read:`;
  const close = "Reply to this email with OK, or with anything you'd change. Nothing goes on the site without your OK.";
  const text = ["Hi Doug,", "", opening, "", ...titles.map((a) => `- ${a.title}`), "", `Read them here: ${page}`, "", close, "", SIGNED].join("\n");
  const html = [
    "<!doctype html>",
    '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>',
    '<body style="margin:0;padding:0;background:#f4f2ee;">',
    '<div style="max-width:560px;margin:0 auto;padding:28px 20px 36px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#1f1f1f;">',
    '<p style="margin:0 0 16px;">Hi Doug,</p>',
    `<p style="margin:0 0 20px;">${escapeHtml(opening)}</p>`,
    '<div style="border-left:3px solid #F97316;padding:2px 0 2px 16px;margin:0 0 24px;">',
    ...titles.map((a, i) => `<p style="margin:${i ? "10px" : "0"} 0 0;font-size:17px;font-weight:700;line-height:1.3;"><a href="${escapeHtml(a.link)}" style="color:#1f1f1f;text-decoration:underline;">${escapeHtml(a.title)}</a></p>`),
    "</div>",
    `<p style="margin:0 0 24px;"><a href="${escapeHtml(page)}" style="display:inline-block;background:#F97316;color:#1A0E05;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:8px;">Read the articles</a></p>`,
    `<p style="margin:0 0 16px;">${escapeHtml(close)}</p>`,
    `<p style="margin:0;">${SIGNED}</p>`,
    "</div></body></html>",
  ].join("\n");
  return { subject, text, html };
}

// ── The Studio's ask (the review of PR #141) ─────────────────────────────────
//
// POST /api/review/notify must act only for a signed-in editor and say
// nothing about drafts to anyone else (draft ids follow their slugs, so they
// can be guessed). The Studio panel first creates a private record with its
// own session, `review.ask-<32 to 64 random hex>` (type reviewAsk: the
// article's published id, on or off, when), which only an editor can make,
// then posts the random part. The route takes the record once (takeAsk) and
// acts on what it says; a key nobody made, an old one or a used one is
// refused before any article is read. The outcome is written back to the
// record, which the panel can read.

/** An ask older than this is refused. */
export const ASK_MAX_AGE_MS = 5 * 60_000;
/** A blog post's id, published or draft, as Sanity makes them. */
const ARTICLE_ID = /^(?:drafts\.)?[A-Za-z0-9][A-Za-z0-9._-]{0,150}$/;

export interface Ask {
  id: string;
  articleId: string;
  on: boolean;
}

/** Takes an editor's ask once: what to do, or null for a key nobody made, an old or used one, or anything odd. */
export async function takeAsk(client: SanityClient, key: unknown, now = new Date()): Promise<Ask | null> {
  if (typeof key !== "string" || !ASK_KEY.test(key)) return null;
  const id = `${ASK_PREFIX}${key}`;
  const ask = await client.fetch<{ _id: string; _type?: string; _rev?: string; articleId?: unknown; on?: unknown; at?: unknown; used?: unknown } | null>(
    `*[_id == $id][0]{ _id, _type, _rev, articleId, on, at, used }`,
    { id }
  );
  if (!ask || ask._type !== ASK_TYPE || ask.used === true || !ask._rev) return null;
  if (typeof ask.articleId !== "string" || !ARTICLE_ID.test(ask.articleId) || typeof ask.on !== "boolean") return null;
  const at = typeof ask.at === "string" ? Date.parse(ask.at) : NaN;
  if (Number.isNaN(at) || now.getTime() - at > ASK_MAX_AGE_MS || at - now.getTime() > 60_000) return null;
  try {
    await client.patch(id).ifRevisionId(ask._rev).set({ used: true, usedAt: now.toISOString() }).commit();
  } catch {
    return null;
  }
  return { id, articleId: ask.articleId, on: ask.on };
}

/** Writes what came of an ask into it, for the panel. Never throws. */
export async function answerAsk(client: SanityClient, ask: Ask, outcome: string): Promise<void> {
  try {
    await client.patch(ask.id).set({ outcome }).commit();
  } catch (err) {
    console.error(`[review] the ask's answer wasn't saved: ${err instanceof Error ? err.message : err}`);
  }
}

export type ClearOutcome = "cleared" | "nothing to clear" | "still ticked";

/** The article was taken back: the next send is a new round. Waits up to `waitMs` for the change to be saved. */
export async function clearDougNotice(client: SanityClient, id: string, opts: { now?: Date; waitMs?: number } = {}): Promise<ClearOutcome> {
  const { article, record } = await readState(client, id, false, opts.waitMs ?? 0);
  if (article?.forReview === true) return "still ticked";
  // A round still sending is cleared too: its email may yet go, but sending
  // the article again must be a new round (finishRound keeps it cleared).
  if (!record || record.cleared || (record.state !== "sent" && record.state !== "sending")) return "nothing to clear";
  await client.patch(record._id).set({ cleared: true, clearedAt: (opts.now ?? new Date()).toISOString() }).commit();
  return "cleared";
}

/**
 * Which blog posts carry `forReview` though their article is live: switched
 * on before 12 Nov 2026, when publishing began to switch it off
 * (sanity.config.ts, lib/project-posts.ts toPublished), or on an edit of a
 * live post. Pure, for `npm run test:review`.
 */
export function staleReviewFlags(flagged: string[], live: string[]): string[] {
  const isLive = new Set(live);
  return flagged.filter((id) => isLive.has(publishedIdOf(id)));
}

/** At most this many old switches are put right in one run. */
const TIDY_PER_RUN = 25;

/**
 * The daily run's safety net: every new article sent to Doug and not yet
 * emailed is emailed now (one email for one article; one that lists them for
 * more, dougDigestEmail), and every record whose article was taken back or
 * published since is cleared, so a send the Studio couldn't finish still
 * reaches Doug by the next morning. Its first morning, it is the email for
 * the articles already on his page. It also switches the review off on live
 * articles (staleReviewFlags), so none of them reads "With Doug" in the
 * Studio.
 */
export async function notifyMissedReviews(
  client: SanityClient,
  now = new Date(),
  send?: NotifyOptions["send"]
): Promise<{ sent: string[]; cleared: number; failed: string[]; tidied: number }> {
  const out = { sent: [] as string[], cleared: 0, failed: [] as string[], tidied: 0 };
  if (!reviewFirst() || !dougsAddresses().length || !sendsHere() || !reviewLink()) return out;
  const state = await client.fetch<{
    ticked: { _id: string; title?: string }[];
    open: { _id: string; ticked: boolean; live: boolean }[];
    flagged: string[];
    live: string[];
  }>(
    `{
      "ticked": *[_type == "blogPost" && _id in path("drafts.**") && forReview == true]{ _id, title },
      "open": *[_type == $type && state == "sent" && cleared != true]{
        _id,
        "ticked": *[_id == "drafts." + ^.articleId][0].forReview == true,
        "live": defined(*[_id == ^.articleId][0]._id)
      },
      "flagged": *[_type == "blogPost" && forReview == true]._id,
      "live": *[_type == "blogPost" && !(_id in path("drafts.**"))]._id
    }`,
    { type: MAILED_TYPE }
  );
  const stale = staleReviewFlags(state.flagged, state.live);
  const staleSet = new Set(stale);
  const page = reviewLink() as string;
  const claims: Claim[] = [];
  for (const article of state.ticked) {
    if (staleSet.has(article._id)) continue;
    const claim = await claimRound(client, article._id, now, 0);
    if (typeof claim !== "string") claims.push(claim);
  }
  // One article, its own email; more than one, one email that lists them.
  if (claims.length) {
    const link = (c: Claim) => `${page}#${anchorFor("article", c.draftId)}`;
    const email =
      claims.length === 1
        ? dougArticleEmail({ title: claims[0].title, excerpt: claims[0].excerpt, link: link(claims[0]) }, claims[0].round)
        : dougDigestEmail(claims.map((c) => ({ title: c.title, link: link(c) })), page);
    const sent = (await (send ?? sendMail)(mailTo(email), "review")).length > 0;
    for (const claim of claims) {
      await finishRound(client, claim, sent, now);
      (sent ? out.sent : out.failed).push(claim.title);
    }
  }
  for (const record of state.open) {
    if (record.ticked && !record.live) continue;
    await client.patch(record._id).set({ cleared: true, clearedAt: now.toISOString() }).commit();
    out.cleared++;
  }
  for (const id of stale.slice(0, TIDY_PER_RUN)) {
    await client.patch(id).unset(["forReview"]).commit();
    out.tidied++;
  }
  return out;
}
