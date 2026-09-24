/**
 * The few Buffer API calls the social pipeline needs (developers.buffer.com,
 * GraphQL at https://api.buffer.com, `Authorization: Bearer <BUFFER_API_KEY>`).
 *
 * Drafts only: every post is created with saveToDraft, so it waits in Buffer
 * until Vern or Doug approves and schedules it. Nothing here posts.
 *
 * Limits (Buffer, Sep 2026): 100 requests per 15 minutes per key; 250 a day on
 * Free and Essentials, 500 on Team. A day's run uses a handful.
 */

const ENDPOINT = "https://api.buffer.com";

export interface BufferChannel {
  id: string;
  name: string;
  displayName?: string | null;
  service: string;
  isQueuePaused?: boolean | null;
}

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const key = process.env.BUFFER_API_KEY;
  if (!key) throw new Error("BUFFER_API_KEY is not set");
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 429) throw new Error(`Buffer rate limit; retry after ${res.headers.get("retry-after") ?? "?"} s`);
  const json = (await res.json().catch(() => null)) as { data?: T; errors?: { message: string }[] } | null;
  if (!res.ok || !json || json.errors?.length) {
    throw new Error(`Buffer API ${res.status}: ${json?.errors?.map((e) => e.message).join("; ") ?? "no response body"}`);
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
      `query { channels(input: { organizationId: ${JSON.stringify(org.id)} }) { id name displayName service isQueuePaused } }`
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
}

/** One draft in one channel's Buffer queue. Returns Buffer's post id. */
export async function createBufferDraft(input: DraftPostInput): Promise<string> {
  const variables = {
    input: {
      channelId: input.channelId,
      text: input.text,
      schedulingType: "automatic",
      mode: "addToQueue",
      saveToDraft: true,
      aiAssisted: true,
      source: "hubss.com Field Notes",
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
