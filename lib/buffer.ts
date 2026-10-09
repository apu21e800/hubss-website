/**
 * The few Buffer API calls the social pipeline needs (developers.buffer.com,
 * GraphQL at https://api.buffer.com, `Authorization: Bearer <BUFFER_API_KEY>`).
 *
 * Drafts only: every post is created with saveToDraft, so it waits in Buffer
 * until Vern or Doug approves and schedules it. Nothing here posts.
 *
 * The key, from Buffer's docs (checked 9 Oct 2026): every plan has the API,
 * Free included; only the organization's owner can make a key; a key lasts a
 * year at most (pick 1 year when making it); a missing, expired or deleted
 * key gets HTTP 401, and the job then emails the editors
 * (lib/social-outcome.ts, failureHint). Requests per key per 30 days: 3,000
 * on Free, 7,500 on Essentials, 15,000 on Team, with shorter 15-minute and
 * 24-hour windows as well. A day's run uses a handful.
 */

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
      source: "hubss.com Insights",
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
