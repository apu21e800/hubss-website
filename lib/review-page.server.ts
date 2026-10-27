/**
 * The review page's reads (lib/review-page.ts says what it shows and why):
 * the ticked drafts and the Sent to Buffer records from Sanity, with the
 * server's token, and Buffer's waiting and queued posts. Server only.
 */
import { createClient } from "@sanity/client";
import { unstable_cache } from "next/cache";
import { projectId, dataset } from "@/lib/sanity.client";
import { previewToken } from "@/lib/sanity.preview";
import { BODY_FIELD } from "@/lib/blog";
import { bufferPostsForReview } from "@/lib/buffer";
import { groupSocialPosts, selectArticles, SOCIAL_WINDOW_DAYS, type RawReviewDraft, type RawSocialLog, type ReviewData } from "@/lib/review-page";

const REVIEW_QUERY = `{
  "drafts": *[_type == "blogPost" && _id in path("drafts.**") && forReview == true]{
    _id, _updatedAt, title, excerpt, category, forReview, scheduled, scheduledFor,
    "featured": featuredImage{ alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height },
    ${BODY_FIELD}
  },
  "liveIds": *[_type == "blogPost" && !(_id in path("drafts.**"))]._id,
  "logs": *[_type == "socialLog" && dateTime(createdAt) >= dateTime($since)]{ slug, title, source, createdAt, "postIds": drafts[].bufferPostId }
}`;

function daysAgo(days: number, now = new Date()): Date {
  return new Date(now.getTime() - days * 86_400_000);
}

/**
 * Buffer's answer, kept five minutes in the data cache, so a page left open
 * and reloaded can't spend the plan's requests. Keyed by the day, so the
 * window moves with it.
 */
const cachedBufferPosts = unstable_cache(
  async (day: string) => ({ posts: await bufferPostsForReview(daysAgo(SOCIAL_WINDOW_DAYS, new Date(`${day}T00:00:00Z`))), asOf: new Date().toISOString() }),
  ["review-buffer-posts-v1"],
  { revalidate: 300 }
);

/** Everything the page shows. Never throws: what can't be read is marked, and the page says so. */
export async function loadReview(now = new Date()): Promise<ReviewData> {
  const data: ReviewData = { articles: [], social: [] };
  const since = daysAgo(SOCIAL_WINDOW_DAYS, now).toISOString();
  let logs: RawSocialLog[] = [];
  const token = previewToken();
  if (!token) {
    console.error("[review] no Sanity token: the review page can't read the drafts");
    data.articlesError = true;
  } else {
    try {
      const client = createClient({ projectId, dataset, apiVersion: "2025-02-19", useCdn: false, perspective: "raw", token });
      const raw = await client.fetch<{ drafts: RawReviewDraft[]; liveIds: string[]; logs: RawSocialLog[] }>(REVIEW_QUERY, { since }, { cache: "no-store" });
      data.articles = selectArticles(raw.drafts ?? [], raw.liveIds ?? []);
      logs = raw.logs ?? [];
    } catch (err) {
      console.error(`[review] couldn't read the drafts: ${err instanceof Error ? err.message : String(err)}`);
      data.articlesError = true;
    }
  }
  if (!process.env.BUFFER_API_KEY) {
    data.socialError = true;
  } else {
    try {
      const { posts, asOf } = await cachedBufferPosts(now.toISOString().slice(0, 10));
      data.social = groupSocialPosts(posts, logs);
      data.socialAsOf = asOf;
    } catch (err) {
      console.error(`[review] couldn't read Buffer: ${err instanceof Error ? err.message : String(err)}`);
      data.socialError = true;
    }
  }
  return data;
}
