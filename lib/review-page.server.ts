/**
 * The review page's reads (lib/review-page.ts says what it shows and why):
 * Buffer's waiting and queued posts first, then, from Sanity with the
 * server's token, the new drafts, the Sent to Buffer records those posts
 * belong to (by Buffer's post ids) and the ticks that put a group on Doug's
 * page. Server only.
 */
import { createClient } from "@sanity/client";
import { unstable_cache } from "next/cache";
import { projectId, dataset } from "@/lib/sanity.client";
import { previewToken } from "@/lib/sanity.preview";
import { BODY_FIELD } from "@/lib/blog";
import { bufferPostsForReview, type BufferPost } from "@/lib/buffer";
import { reviewLink, reviewTickId, type ReviewAudience } from "@/lib/review-first";
import { groupSocialPosts, selectArticles, SOCIAL_WINDOW_DAYS, type RawReviewDraft, type RawSocialLog, type ReviewData } from "@/lib/review-page";

const DRAFTS_QUERY = `{
  "drafts": *[_type == "blogPost" && _id in path("drafts.**")]{
    _id, _updatedAt, title, excerpt, category, forReview, scheduled, scheduledFor, editorNotes,
    "featured": featuredImage{ alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height },
    ${BODY_FIELD}
  },
  "liveIds": *[_type == "blogPost" && !(_id in path("drafts.**"))]._id
}`;

/** The records that made these posts, by Buffer's ids (not by date: a post and its record are read over the same window). */
const LOGS_QUERY = `*[_type == "socialLog" && count(drafts[bufferPostId in $ids]) > 0]{ slug, title, source, createdAt, styleCheck, "postIds": drafts[].bufferPostId }`;

/** Which groups 21e8 has put on Doug's page (private records, lib/review-first.ts reviewTickId). */
const TICKS_QUERY = `*[_type == "reviewTick" && _id in $tickIds].groupKey`;

/** Five minutes: the window Buffer's answer is kept for. */
const BUCKET_MS = 300_000;

/**
 * Buffer's answer, kept for the five minutes it was read in and never served
 * after: the bucket is the key, so a new five minutes is a new read, never a
 * stale copy handed back while a fresh one is fetched. A page left open and
 * reloaded can't spend the plan's requests.
 */
const cachedBufferPosts = unstable_cache(
  async (bucket: number) => {
    const since = new Date(bucket * BUCKET_MS - SOCIAL_WINDOW_DAYS * 86_400_000);
    const posts = await bufferPostsForReview(since);
    return { posts, asOf: new Date().toISOString() };
  },
  ["review-buffer-posts-v2"],
  { revalidate: 300 }
);

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Everything the page shows, for Doug's link or Vern's. Never throws: what can't be read is marked, and the page says so. */
export async function loadReview(audience: ReviewAudience, now = new Date()): Promise<ReviewData> {
  const data: ReviewData = { audience, articles: [], social: [] };
  if (audience === "agency") data.dougsLink = reviewLink() ?? undefined;

  let posts: BufferPost[] = [];
  if (!process.env.BUFFER_API_KEY) {
    data.socialError = true;
  } else {
    try {
      const read = await cachedBufferPosts(Math.floor(now.getTime() / BUCKET_MS));
      posts = read.posts;
      data.socialAsOf = read.asOf;
    } catch (err) {
      console.error(`[review] couldn't read Buffer: ${errorText(err)}`);
      data.socialError = true;
    }
  }

  const token = previewToken();
  if (!token) {
    console.error("[review] no Sanity token: the review page can't read the drafts");
    // Without Sanity there are no ticks either, so no post can be shown as 21e8's.
    return { ...data, articlesError: true, socialError: true };
  }
  const client = createClient({ projectId, dataset, apiVersion: "2025-02-19", useCdn: false, perspective: "raw", token });
  try {
    const raw = await client.fetch<{ drafts: RawReviewDraft[]; liveIds: string[] }>(DRAFTS_QUERY, {}, { cache: "no-store" });
    data.articles = selectArticles(raw.drafts ?? [], raw.liveIds ?? [], { audience, now });
  } catch (err) {
    console.error(`[review] couldn't read the drafts: ${errorText(err)}`);
    data.articlesError = true;
  }
  if (!data.socialError) {
    try {
      const logs = posts.length
        ? await client.fetch<RawSocialLog[]>(LOGS_QUERY, { ids: posts.map((p) => p.id) }, { cache: "no-store" })
        : [];
      const logged = new Map<string, string>();
      for (const log of logs) for (const id of log.postIds ?? []) if (id && log.slug) logged.set(id, log.slug);
      const keys = [...new Set(posts.map((p) => logged.get(p.id) ?? `post:${p.id}`))];
      const ticks = keys.length
        ? await client.fetch<(string | null)[]>(TICKS_QUERY, { tickIds: keys.map(reviewTickId) }, { cache: "no-store" })
        : [];
      data.social = groupSocialPosts(posts, logs, { audience, ticks: new Set(ticks.filter((t): t is string => !!t)) });
    } catch (err) {
      console.error(`[review] couldn't match the social posts: ${errorText(err)}`);
      data.socialError = true;
    }
  }
  return data;
}
