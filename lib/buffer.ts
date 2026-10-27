/**
 * The few Buffer API calls the social pipeline needs (developers.buffer.com,
 * GraphQL at https://api.buffer.com, `Authorization: Bearer <BUFFER_API_KEY>`).
 *
 * Drafts while Doug reviews first (the default since 27 Oct 2026,
 * lib/review-first.ts): every post waits for someone to press Add to Queue,
 * and his review page reads them back (bufferPostsForReview). With
 * REVIEW_FIRST=off, as from 19 to 27 Oct (Vern: "auto-queue on"), a post
 * goes into the channel's queue and Buffer posts it at the next free slot
 * (Tue, Wed, Thu 11:00 Toronto, docs/buffer-setup.md) unless someone deletes
 * it there first; SOCIAL_AUTO_QUEUE=off then keeps drafts (how it ran from
 * 9 to 19 Oct). Copy the style pass couldn't fix is drafted either way
 * (lib/social-pipeline.ts). The emails say which.
 *
 * The key, from Buffer's docs (checked 9 Oct 2026): every plan has the API,
 * Free included; only the organization's owner can make a key; a key lasts a
 * year at most (pick 1 year when making it); a missing, expired or deleted
 * key gets HTTP 401, and the job then emails the editors
 * (lib/social-outcome.ts, failureHint). Requests per key per 30 days: 3,000
 * on Free, 7,500 on Essentials, 15,000 on Team, with shorter 15-minute and
 * 24-hour windows as well. A day's run uses a handful.
 */

import { reviewFirst } from "@/lib/review-first";

const ENDPOINT = "https://api.buffer.com";

/**
 * Longest wait for one Buffer call. fetch alone would wait until Vercel
 * stops the function (300 s), and the job could no longer settle or report
 * the article it was on (lib/social-pipeline.ts).
 */
const TIMEOUT_MS = 20_000;

export interface BufferChannel {
  id: string;
  name: string;
  displayName?: string | null;
  service: string;
  isQueuePaused?: boolean | null;
  /** Buffer lost its connection to the network: reconnect it in Buffer. */
  isDisconnected?: boolean | null;
  /** More channels than the plan allows: Buffer won't post to it. */
  isLocked?: boolean | null;
}

/** A refusal from Buffer's API, with the HTTP status (401: the key). */
export class BufferApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "BufferApiError";
    this.status = status;
  }
}

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const key = process.env.BUFFER_API_KEY;
  if (!key) throw new Error("BUFFER_API_KEY is not set");
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    // No answer (a timeout, the network): status 0.
    throw new BufferApiError(`Buffer API unreachable: ${err instanceof Error ? err.message : String(err)}`, 0);
  }
  if (res.status === 429) throw new BufferApiError(`Buffer rate limit; retry after ${res.headers.get("retry-after") ?? "?"} s`, 429);
  const json = (await res.json().catch(() => null)) as {
    data?: T;
    errors?: { message: string; extensions?: { code?: string } }[];
  } | null;
  if (!res.ok || !json || json.errors?.length) {
    const why = json?.errors?.map((e) => (e.extensions?.code ? `${e.message} (${e.extensions.code})` : e.message)).join("; ");
    throw new BufferApiError(`Buffer API ${res.status}: ${why || "no response body"}`, res.status);
  }
  return json.data as T;
}

/** Every channel in every organization on the account. */
export async function bufferChannels(): Promise<BufferChannel[]> {
  const { account } = await gql<{ account: { organizations: { id: string }[] } }>(
    `query { account { organizations { id } } }`
  );
  const out: BufferChannel[] = [];
  for (const org of account.organizations) {
    // Organization ids are opaque tokens; JSON.stringify makes a safe GraphQL string.
    const { channels } = await gql<{ channels: BufferChannel[] }>(
      `query { channels(input: { organizationId: ${JSON.stringify(org.id)} }) { id name displayName service isQueuePaused isDisconnected isLocked } }`
    );
    out.push(...channels);
  }
  return out;
}

export interface DraftPostInput {
  channelId: string;
  text: string;
  imageUrl?: string;
  imageAlt?: string;
  metadata?: Record<string, unknown>;
  /** A draft for approval (true) or straight into the queue (false). Unset: socialAutoQueue() decides. */
  draft?: boolean;
}

/**
 * True when posts go straight into Buffer's queue rather than waiting as
 * drafts for approval. Not while Doug reviews first (lib/review-first.ts, the
 * default since 27 Oct 2026): every post then waits as a draft until someone
 * presses Add to Queue in Buffer. With REVIEW_FIRST=off they are queued, as
 * Vern decided on 19 Oct 2026, unless SOCIAL_AUTO_QUEUE=off (or no, false,
 * 0). Only Vern turns either.
 */
export function socialAutoQueue(): boolean {
  if (reviewFirst()) return false;
  const v = (process.env.SOCIAL_AUTO_QUEUE ?? "").trim().toLowerCase();
  return !["off", "no", "false", "0"].includes(v);
}

/**
 * One post in one channel's Buffer queue: a draft for approval, or queued for
 * the next slot when socialAutoQueue(). Returns Buffer's post id.
 */
export async function createBufferDraft(input: DraftPostInput): Promise<string> {
  const variables = {
    input: {
      channelId: input.channelId,
      text: input.text,
      schedulingType: "automatic",
      mode: "addToQueue",
      saveToDraft: input.draft ?? !socialAutoQueue(),
      aiAssisted: true,
      source: "hubss.com",
      assets: input.imageUrl
        ? [{ image: { url: input.imageUrl, ...(input.imageAlt ? { metadata: { altText: input.imageAlt } } : {}) } }]
        : [],
      ...(input.metadata ? { metadata: input.metadata } : {}),
    },
  };
  const data = await gql<{ createPost: { post?: { id: string }; message?: string } }>(
    `mutation CreateDraft($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess { post { id } }
        ... on MutationError { message }
      }
    }`,
    variables
  );
  if (!data.createPost?.post?.id) throw new Error(`Buffer refused the draft: ${data.createPost?.message ?? "no reason given"}`);
  return data.createPost.post.id;
}

/** A post's state in Buffer (its PostStatus): draft and needs_approval wait for someone, scheduled is in a queue. */
export type BufferPostStatus = "draft" | "needs_approval" | "scheduled" | "sending" | "sent" | "error";

export interface BufferPost {
  id: string;
  status: BufferPostStatus;
  text: string;
  /** When a queued post goes out. */
  dueAt?: string | null;
  createdAt?: string | null;
  channelId: string;
  /** linkedin, facebook, instagram, ... */
  channelService: string;
  assets?: { thumbnail?: string | null; source?: string | null; image?: { altText?: string | null } | null }[] | null;
}

/** The review page's question to Buffer, checked against Buffer's published schema (27 Oct 2026). */
export const REVIEW_POSTS_QUERY = `query ReviewPosts($org: OrganizationId!, $after: String, $since: DateTime) {
  posts(first: 50, after: $after, input: { organizationId: $org, filter: { status: [draft, needs_approval, scheduled], createdAt: { start: $since } }, sort: [{ field: createdAt, direction: desc }] }) {
    edges { node { id status text dueAt createdAt channelId channelService assets { thumbnail source ... on ImageAsset { image { altText } } } } }
    pageInfo { hasNextPage endCursor }
  }
}`;

/**
 * Every post waiting for approval or lined up in a queue, made since `since`,
 * newest first: Doug's review page (lib/review-page.ts). Read only. At most
 * four pages of 50 per organization, a handful of the 3,000 requests a month
 * the Free plan allows.
 */
export async function bufferPostsForReview(since: Date): Promise<BufferPost[]> {
  const { account } = await gql<{ account: { organizations: { id: string }[] } }>(
    `query { account { organizations { id } } }`
  );
  const out: BufferPost[] = [];
  for (const org of account.organizations) {
    let after: string | null = null;
    for (let page = 0; page < 4; page++) {
      const data: { posts?: { edges?: ({ node: BufferPost } | null)[] | null; pageInfo?: { hasNextPage: boolean; endCursor?: string | null } | null } | null } = await gql(
        REVIEW_POSTS_QUERY,
        { org: org.id, after, since: since.toISOString() }
      );
      // The schema lets edges and pageInfo be null (no posts): read that as an empty last page.
      for (const edge of data.posts?.edges ?? []) if (edge?.node) out.push(edge.node);
      const next = data.posts?.pageInfo;
      if (!next?.hasNextPage || !next.endCursor) break;
      after = next.endCursor;
    }
  }
  return out;
}
