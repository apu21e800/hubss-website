/**
 * What the review page shows (app/review/[key]/page.tsx; lib/review-first.ts
 * says why it exists and who each link is for).
 *
 * Doug's link shows only what 21e8 has read and put on his page: the drafts
 * marked "Ready for Doug's review" (blogPost `forReview`, the Studio tick and
 * Vern's button write the same field), and the social posts whose group 21e8
 * put on his page (a private `review.ok-*` record per group, reviewTickId).
 * What is already set to go (a scheduled article, a queued post) shows too,
 * with its time, since it goes out anyway. Vern's link shows everything
 * waiting, with the checks' notes, and which of it Doug can see.
 *
 * Read only here. The articles are unpublished drafts, read with the server's
 * Sanity token (never through the public API, which can't see them), and only
 * until they are published. The posts are Buffer's own list (lib/buffer.ts,
 * bufferPostsForReview), matched to their Sent to Buffer records (socialLog)
 * by Buffer's post ids, so what the page shows is what Buffer would post,
 * edits made in Buffer included.
 *
 * This file is the pure part (the selection, the grouping, the times), for
 * `npm run test:review`; lib/review-page.server.ts reads Sanity and Buffer.
 */
import { badgeFor } from "@/lib/field-notes-taxonomy";
import type { BufferPost } from "@/lib/buffer";
import type { ReviewAudience } from "@/lib/review-first";
import type { PostBodyNode } from "@/components/blog/PostBody";

const TORONTO = "America/Toronto";
/** How far back the page looks for social posts: a draft older than this is Vern's to clear in Buffer. */
export const SOCIAL_WINDOW_DAYS = 14;
/** The daily run's hour and its grace (lib/project-posts.ts RUN_HOUR_UTC and DUE_GRACE_MS; test:review keeps them equal). */
export const RUN_HOUR_UTC = 14;
export const DUE_GRACE_MS = 10 * 60_000;

// ── what the page renders ───────────────────────────────────────────────────

export interface ReviewPhoto {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ReviewArticle {
  id: string;
  title: string;
  excerpt: string;
  /** Project or Guide, as the site prints it. */
  kind: string;
  photo?: ReviewPhoto;
  body: PostBodyNode[];
  /** Set when "Scheduled" is on: the morning run that publishes it. */
  goesLive?: string;
  /** Ticked "Ready for Doug's review", or scheduled: on Doug's link. */
  onDougsPage: boolean;
  /** Vern's link only: the draft's notes for the editor. */
  notes?: string;
  updatedAt?: string;
}

export interface ReviewSocialPost {
  id: string;
  /** LinkedIn, Facebook, Instagram... */
  network: string;
  text: string;
  photo?: { url: string; alt: string };
  /** Waiting for Doug's OK, or lined up to go out at `dueAt`. */
  state: "waiting" | "lined up";
  dueAt?: string;
}

export interface ReviewSocialGroup {
  /** What the tick is kept under: the Sent to Buffer record's key, or post:<Buffer id>. */
  key: string;
  /** "For the article", "From the job photos", ... */
  about: string;
  title: string;
  posts: ReviewSocialPost[];
  createdAt?: string;
  /** 21e8 put it on Doug's page. */
  onDougsPage: boolean;
  /** Vern's link only: the record's style check, and whether it was clean. */
  styleCheck?: string;
  styleClean?: boolean;
}

export interface ReviewData {
  audience: ReviewAudience;
  articles: ReviewArticle[];
  social: ReviewSocialGroup[];
  /** The articles couldn't be read (no token, Sanity down). */
  articlesError?: boolean;
  /** Buffer couldn't be read (no key, Buffer down): the page says so instead of "nothing waiting". */
  socialError?: boolean;
  /** When Buffer was read (its answer is kept up to five minutes). */
  socialAsOf?: string;
  /** Vern's link only: Doug's link, to send him. */
  dougsLink?: string;
}

// ── when an article goes live ───────────────────────────────────────────────

/**
 * The morning run that publishes a scheduled draft: the first daily run at
 * RUN_HOUR_UTC that is still to come and that finds it due (a draft is due
 * DUE_GRACE_MS before its time, as publishDueDrafts reads it). A time already
 * past goes at the next run; a time after the run's hour waits for the next
 * day's.
 */
export function publishRun(scheduledFor: string, now: Date): string | undefined {
  const s = new Date(scheduledFor).getTime();
  if (Number.isNaN(s)) return undefined;
  const from = Math.max(now.getTime(), s - DUE_GRACE_MS);
  const d = new Date(from);
  let run = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), RUN_HOUR_UTC);
  if (run < from) run += 86_400_000;
  return new Date(run).toISOString();
}

// ── articles ────────────────────────────────────────────────────────────────

export interface RawReviewDraft {
  _id: string;
  _updatedAt?: string | null;
  title?: string | null;
  excerpt?: string | null;
  category?: string | null;
  forReview?: boolean | null;
  scheduled?: boolean | null;
  scheduledFor?: string | null;
  editorNotes?: string | null;
  featured?: { alt?: string | null; url?: string | null; width?: number | null; height?: number | null } | null;
  body?: PostBodyNode[] | null;
}

/**
 * The new articles: never published (a draft of a live post is an edit, not
 * a new article), with a title. Doug's link has the ones on his page; Vern's
 * has them all. Scheduled ones first, soonest first; then, for Vern, the ones
 * on Doug's page; then the rest, newest first.
 */
export function selectArticles(drafts: RawReviewDraft[], liveIds: Iterable<string>, opts: { audience: ReviewAudience; now: Date }): ReviewArticle[] {
  const live = new Set(liveIds);
  const fresh = drafts.filter((d) => d._id.startsWith("drafts.") && !live.has(d._id.slice("drafts.".length)) && d.title?.trim());
  const articles = fresh.map((d): ReviewArticle => {
    const url = d.featured?.url?.trim();
    const goesLive = d.scheduled === true && d.scheduledFor ? publishRun(d.scheduledFor, opts.now) : undefined;
    return {
      id: d._id,
      title: d.title!.trim(),
      excerpt: d.excerpt?.trim() ?? "",
      kind: badgeFor(d.category),
      photo: url ? { url, alt: d.featured?.alt?.trim() || d.title!.trim(), width: d.featured?.width ?? undefined, height: d.featured?.height ?? undefined } : undefined,
      body: d.body ?? [],
      goesLive,
      onDougsPage: d.forReview === true || Boolean(goesLive),
      ...(opts.audience === "agency" && d.editorNotes?.trim() ? { notes: d.editorNotes.trim() } : {}),
      updatedAt: d._updatedAt ?? undefined,
    };
  });
  const shown = opts.audience === "client" ? articles.filter((a) => a.onDougsPage) : articles;
  return shown.sort((a, b) => {
    if (a.goesLive && b.goesLive) return a.goesLive.localeCompare(b.goesLive);
    if (a.goesLive) return -1;
    if (b.goesLive) return 1;
    if (a.onDougsPage !== b.onDougsPage) return a.onDougsPage ? -1 : 1;
    return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
  });
}

// ── social posts ────────────────────────────────────────────────────────────

export interface RawSocialLog {
  slug?: string | null;
  title?: string | null;
  /** The stream: "Article", "From the field" or "From the library". */
  source?: string | null;
  createdAt?: string | null;
  styleCheck?: string | null;
  postIds?: (string | null)[] | null;
}

const NETWORKS: Record<string, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X",
  threads: "Threads",
  bluesky: "Bluesky",
  mastodon: "Mastodon",
  googlebusiness: "Google Business Profile",
  pinterest: "Pinterest",
  tiktok: "TikTok",
  youtube: "YouTube",
};
const NETWORK_ORDER = ["linkedin", "facebook", "instagram"];

export function networkName(service: string): string {
  return NETWORKS[service.toLowerCase()] ?? service.charAt(0).toUpperCase() + service.slice(1);
}

/** How a group is introduced, by the stream that made its posts. */
export function aboutLine(source: string | null | undefined): string {
  if (source === "Article") return "For the article";
  if (source === "From the field") return "From the job photos";
  if (source === "From the library") return "From HUB's projects and the Product Portfolio Book";
  return "Social posts";
}

/**
 * A group's heading. A job photos record's title is masked where its Where
 * shows an address ("StreetPrint in [address], Oakville": the record is in
 * the public dataset), so on the page it becomes "StreetPrint job".
 */
export function groupTitle(title: string | null | undefined): string {
  const t = title?.trim() ?? "";
  if (!/\[[a-z ]+\]/i.test(t)) return t;
  const system = t.split(/ in /)[0]?.trim();
  return system && !/\[/.test(system) ? `${system} job` : "A job";
}

/** The photo the post carries: the copy HUB sent (Sanity's CDN or hubss.com) when Buffer says so, else Buffer's thumbnail. */
function photoOf(post: BufferPost): { url: string; alt: string } | undefined {
  const asset = post.assets?.find((a) => a && (a.source || a.thumbnail));
  if (!asset) return undefined;
  const own = asset.source && /^https:\/\/(cdn\.sanity\.io|(www\.)?hubss\.com)\//.test(asset.source) ? asset.source : undefined;
  const url = own ?? asset.thumbnail ?? undefined;
  if (!url || !/^https:\/\//.test(url)) return undefined;
  return { url, alt: asset.image?.altText?.trim() || "The post's photo" };
}

/** Clean, as the pipeline's style report says it: "STYLE CHECK: clean...". */
export function styleIsClean(styleCheck: string | null | undefined): boolean {
  return /^STYLE CHECK: clean\b/.test(styleCheck?.trim() ?? "");
}

/**
 * Buffer's waiting and queued posts, in groups: one per Sent to Buffer record
 * (an article, a job, a library item), in the order LinkedIn, Facebook,
 * Instagram; a post no record names (made by hand in Buffer) is a group of
 * its own. On Doug's link a group's waiting posts show only once 21e8 has put
 * it on his page (`ticks`); its queued posts show either way. Groups with a
 * post waiting come first, newest first; then the ones only lined up, soonest
 * first. Sent, sending and failed posts aren't shown.
 */
export function groupSocialPosts(posts: BufferPost[], logs: RawSocialLog[], opts: { audience: ReviewAudience; ticks: ReadonlySet<string> }): ReviewSocialGroup[] {
  const logFor = new Map<string, RawSocialLog>();
  for (const log of logs) for (const id of log.postIds ?? []) if (id && log.slug) logFor.set(id, log);
  const groups = new Map<string, ReviewSocialGroup>();
  for (const post of posts) {
    const state = post.status === "draft" || post.status === "needs_approval" ? "waiting" : post.status === "scheduled" ? "lined up" : null;
    if (!state || !post.text?.trim()) continue;
    const log = logFor.get(post.id);
    const key = log?.slug ?? `post:${post.id}`;
    let group = groups.get(key);
    if (!group) {
      group = log
        ? { key, about: aboutLine(log.source), title: groupTitle(log.title) || "Social posts", posts: [], createdAt: log.createdAt ?? undefined, onDougsPage: opts.ticks.has(key) }
        : { key, about: "Other social posts", title: opts.audience === "agency" ? "Made by hand in Buffer" : "", posts: [], createdAt: post.createdAt ?? undefined, onDougsPage: opts.ticks.has(key) };
      if (opts.audience === "agency" && log) {
        group.styleCheck = log.styleCheck?.trim() || undefined;
        group.styleClean = styleIsClean(log.styleCheck);
      }
      groups.set(key, group);
    }
    group.posts.push({
      id: post.id,
      network: networkName(post.channelService),
      text: post.text.trim(),
      photo: photoOf(post),
      state,
      dueAt: state === "lined up" ? post.dueAt ?? undefined : undefined,
    });
  }
  const rank = (network: string) => {
    const i = NETWORK_ORDER.findIndex((s) => NETWORKS[s] === network);
    return i < 0 ? NETWORK_ORDER.length : i;
  };
  let out = [...groups.values()];
  for (const g of out) g.posts.sort((a, b) => rank(a.network) - rank(b.network) || a.network.localeCompare(b.network));
  if (opts.audience === "client") {
    out = out
      .map((g) => (g.onDougsPage ? g : { ...g, posts: g.posts.filter((p) => p.state === "lined up") }))
      .filter((g) => g.posts.length > 0);
  }
  const waiting = (g: ReviewSocialGroup) => g.posts.some((p) => p.state === "waiting");
  const soonest = (g: ReviewSocialGroup) => g.posts.map((p) => p.dueAt ?? "").filter(Boolean).sort()[0] ?? "";
  return out.sort((a, b) => {
    if (waiting(a) !== waiting(b)) return waiting(a) ? -1 : 1;
    if (waiting(a)) return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
    return soonest(a).localeCompare(soonest(b));
  });
}

// ── dates as Doug reads them ────────────────────────────────────────────────

/** "Thursday 5 November, 10:00 a.m.", Toronto time. */
export function reviewWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const period = get("dayPeriod").toLowerCase().replace(/\s/g, "").replace(/^am$/, "a.m.").replace(/^pm$/, "p.m.");
  return `${get("weekday")} ${get("day")} ${get("month")}, ${get("hour")}:${get("minute")} ${period}`.trim();
}

/** The id a card carries on the page, so Vern's button brings him back to it. */
export function anchorFor(kind: "article" | "social", id: string): string {
  return `${kind}-${id.replace(/[^A-Za-z0-9_-]+/g, "-")}`.slice(0, 120);
}
