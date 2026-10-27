/**
 * What Doug's review page shows (app/review/[key]/page.tsx; lib/review-first.ts
 * says why it exists): the articles 21e8 has marked ready for him, and the
 * social posts waiting for approval or lined up in Buffer, each group named by
 * what it is about.
 *
 * Read only. The articles are unpublished drafts, read with the server's
 * Sanity token (never through the public API, which can't see them): a draft
 * shows only once "Ready for Doug's review" is ticked on it in Studio, and
 * only until it is published. The posts are Buffer's own list (lib/buffer.ts,
 * bufferPostsForReview), matched to the Sent to Buffer records
 * (socialLog) for their titles, so what the page shows is what Buffer would
 * post, edits made in Buffer included.
 *
 * This file is the pure part (the selection, the grouping, the dates), for
 * `npm run test:review`; lib/review-page.server.ts reads Sanity and Buffer.
 */
import { badgeFor } from "@/lib/field-notes-taxonomy";
import type { BufferPost } from "@/lib/buffer";
import type { PostBodyNode } from "@/components/blog/PostBody";

const TORONTO = "America/Toronto";
/** How far back the page looks for social posts: a draft older than this is Vern's to clear in Buffer. */
export const SOCIAL_WINDOW_DAYS = 14;

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
  /** Set when "Scheduled" is on: when it goes live. */
  goesLive?: string;
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
  key: string;
  /** "For the article", "From HUB's projects and the Product Portfolio Book", ... */
  about: string;
  title: string;
  posts: ReviewSocialPost[];
  createdAt?: string;
}

export interface ReviewData {
  articles: ReviewArticle[];
  social: ReviewSocialGroup[];
  /** The articles couldn't be read (no token, Sanity down). */
  articlesError?: boolean;
  /** Buffer couldn't be read (no key, Buffer down): the page says so instead of "nothing waiting". */
  socialError?: boolean;
  /** When Buffer was read (its answer is kept five minutes). */
  socialAsOf?: string;
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
  featured?: { alt?: string | null; url?: string | null; width?: number | null; height?: number | null } | null;
  body?: PostBodyNode[] | null;
}

/**
 * The drafts Doug sees: ticked "Ready for Doug's review", never published (a
 * draft of a live post is an edit, not a new article), with a title. The ones
 * already scheduled come first, soonest first; then the rest, newest first.
 */
export function selectArticles(drafts: RawReviewDraft[], liveIds: Iterable<string>): ReviewArticle[] {
  const live = new Set(liveIds);
  const picked = drafts.filter((d) => d.forReview === true && d._id.startsWith("drafts.") && !live.has(d._id.slice("drafts.".length)) && d.title?.trim());
  const articles = picked.map((d): ReviewArticle => {
    const url = d.featured?.url?.trim();
    return {
      id: d._id,
      title: d.title!.trim(),
      excerpt: d.excerpt?.trim() ?? "",
      kind: badgeFor(d.category),
      photo: url ? { url, alt: d.featured?.alt?.trim() || d.title!.trim(), width: d.featured?.width ?? undefined, height: d.featured?.height ?? undefined } : undefined,
      body: d.body ?? [],
      goesLive: d.scheduled === true && d.scheduledFor ? d.scheduledFor : undefined,
      updatedAt: d._updatedAt ?? undefined,
    };
  });
  return articles.sort((a, b) => {
    if (a.goesLive && b.goesLive) return a.goesLive.localeCompare(b.goesLive);
    if (a.goesLive) return -1;
    if (b.goesLive) return 1;
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
  return "Social post";
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

/**
 * Buffer's waiting and queued posts, in groups: one per Sent to Buffer record
 * (an article, a job, a library item), in that record's order of networks; a
 * post no record names (made by hand in Buffer) goes under "Other social
 * posts". Groups with a post waiting come first, newest first; then the ones
 * only lined up, soonest first. Sent, sending and failed posts aren't shown.
 */
export function groupSocialPosts(posts: BufferPost[], logs: RawSocialLog[]): ReviewSocialGroup[] {
  const logFor = new Map<string, RawSocialLog>();
  for (const log of logs) for (const id of log.postIds ?? []) if (id) logFor.set(id, log);
  const groups = new Map<string, ReviewSocialGroup>();
  for (const post of posts) {
    const state = post.status === "draft" || post.status === "needs_approval" ? "waiting" : post.status === "scheduled" ? "lined up" : null;
    if (!state || !post.text?.trim()) continue;
    const log = logFor.get(post.id);
    const key = log?.slug ?? "other";
    let group = groups.get(key);
    if (!group) {
      group = log
        ? { key, about: aboutLine(log.source), title: log.title?.trim() || "Social posts", posts: [], createdAt: log.createdAt ?? undefined }
        : { key, about: "Other social posts", title: "Made in the social account", posts: [], createdAt: undefined };
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
    if (!log && post.createdAt && (!group.createdAt || post.createdAt > group.createdAt)) group.createdAt = post.createdAt;
  }
  const rank = (network: string) => {
    const i = NETWORK_ORDER.findIndex((s) => NETWORKS[s] === network);
    return i < 0 ? NETWORK_ORDER.length : i;
  };
  const out = [...groups.values()];
  for (const g of out) g.posts.sort((a, b) => rank(a.network) - rank(b.network) || a.network.localeCompare(b.network));
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
