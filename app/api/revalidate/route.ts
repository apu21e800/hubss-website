/**
 * POST /api/revalidate — Sanity calls this when a document is published.
 *
 * It checks Sanity's signature (the webhook's Secret field, sent in the
 * `sanity-webhook-signature` header), waits about 3 s for the Content Lake to
 * settle (next-sanity's parseBody does that), then expires the cache tag for
 * the document's type. The next visitor gets a page rendered from the API
 * itself, not Sanity's CDN (lib/sanity.client.ts says why). Measured on
 * 24 Sep 2026: Publish to live in 5 s.
 *
 * Until 24 Sep 2026 this route could never have worked:
 *   - it expected `Authorization: Bearer <secret>`, which Sanity does not send;
 *   - it had no entry for `page`, so the homepage, About, Contact and Lunch &
 *     Learn copy never refreshed on publish;
 *   - it expired "site-settings" while the cache is tagged "siteSettings";
 *   - and SANITY_WEBHOOK_SECRET was not set, so it answered 401 to everything.
 *
 * Setup, once:
 *   1. Vercel → hubss-website → Settings → Environment Variables:
 *      SANITY_WEBHOOK_SECRET (Production) = a long random string. Redeploy.
 *   2. One webhook in project 9dbro2m1, created through the API on 24 Sep 2026
 *      (the manage page's edits of the Secret didn't take, and an old duplicate
 *      had been firing unsigned). Exactly one should point here:
 *        Name        hubss.com revalidate
 *        URL         https://hubss.com/api/revalidate
 *        Dataset     production
 *        Trigger on  Create, Update, Delete
 *        Filter      _type in ["product", "application", "page", "siteSettings", "blogPost"]
 *        Projection  { _id, _type }
 *        HTTP method POST
 *        Secret      the same string as SANITY_WEBHOOK_SECRET
 *   3. For blog posts (below): a Vercel Deploy Hook on main, its URL in
 *      VERCEL_DEPLOY_HOOK_URL (Production). `vercel deploy-hooks create
 *      sanity-blog --ref main` prints one.
 *
 * NEW BLOG POSTS NEED A REBUILD
 * /blog/[slug] only serves the posts its build knew about (dynamicParams =
 * false; an unknown address has to be a real 404), and lib/blog.ts keeps every
 * listing to the same list, lib/blog-index.json. An edit to a live post just
 * expires the "blog" tag like any other document. A post this deployment didn't
 * build (a new one, or one whose slug changed), or a built post that is no
 * longer published, also starts a rebuild through the Deploy Hook: about five
 * minutes later the post and its page appear, or go, together.
 */

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody, type ParsedBody } from "next-sanity/webhook";
import { clientNoCache } from "@/lib/sanity.client";
import blogIndex from "@/lib/blog-index.json";

// Each Sanity type → the cache tag its queries carry in lib/sanity.queries.ts.
const TYPE_TO_TAG: Record<string, string> = {
  product: "products",
  application: "applications",
  page: "pages",
  siteSettings: "siteSettings",
  blogPost: "blog",
};

const BUILT_POSTS = blogIndex as { _id: string; slug: string }[];

/**
 * Why this blog post needs a rebuild, or null when it doesn't. The conditions
 * match scripts/gen-blog-index.ts, which decides what a build includes.
 */
async function blogRebuildReason(docId: string): Promise<string | null> {
  const built = BUILT_POSTS.find((p) => p._id === docId);
  const now = await clientNoCache.fetch<{ slug?: string | null } | null>(
    `*[_id == $id && _type == "blogPost" && defined(slug.current) && defined(title) && defined(publishedAt)][0]{ "slug": slug.current }`,
    { id: docId }
  );
  if (now?.slug && !built) return `new post "${now.slug}"`;
  if (now?.slug && built && built.slug !== now.slug) return `slug changed from "${built.slug}" to "${now.slug}"`;
  if (!now && built) return `post "${built.slug}" is no longer published`;
  return null;
}

/** Asks Vercel for a production build of main. */
async function rebuild(reason: string): Promise<string> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) {
    console.error(`[revalidate] ${reason} needs a rebuild, but VERCEL_DEPLOY_HOOK_URL is not set. It appears on the next deploy.`);
    return "needed, but VERCEL_DEPLOY_HOOK_URL is not set";
  }
  const res = await fetch(hook, { method: "POST" });
  if (!res.ok) {
    console.error(`[revalidate] ${reason}: the deploy hook answered ${res.status}`);
    return `deploy hook failed (${res.status})`;
  }
  console.log(`[revalidate] ${reason}: rebuild started`);
  return "started";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[revalidate] SANITY_WEBHOOK_SECRET is not set; nothing can be revalidated");
    return NextResponse.json(
      { error: "SANITY_WEBHOOK_SECRET is not configured on this server." },
      { status: 401 }
    );
  }

  let parsed: ParsedBody<{ _id?: string; _type?: string }>;
  try {
    parsed = await parseBody<{ _id?: string; _type?: string }>(req, secret);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // null means the signature header was missing; false means it didn't match.
  if (parsed.isValidSignature !== true) {
    console.error("[revalidate] rejected: missing or invalid Sanity signature");
    return NextResponse.json({ error: "Invalid or missing Sanity webhook signature." }, { status: 401 });
  }

  const docType = parsed.body?._type;
  const docId = parsed.body?._id ?? "unknown";
  if (!docType) {
    return NextResponse.json({ error: "Missing _type in webhook body." }, { status: 400 });
  }

  const tag = TYPE_TO_TAG[docType];
  if (!tag) {
    return NextResponse.json({
      revalidated: false,
      message: `No cache tag mapped for _type "${docType}". No action taken.`,
    });
  }

  // expire: 0 means the next request renders fresh. With "max"
  // (stale-while-revalidate) the first refresh after Publish would still show
  // the old copy, and an editor would decide the site is broken.
  revalidateTag(tag, { expire: 0 });
  console.log(`[revalidate] ${docType} ${docId}: expired tag "${tag}"`);

  let rebuildStatus: string | undefined;
  if (docType === "blogPost" && !docId.startsWith("drafts.")) {
    try {
      const reason = await blogRebuildReason(docId);
      if (reason) rebuildStatus = await rebuild(reason);
    } catch (err) {
      // The tag is already expired; only the rebuild check failed. Say so
      // loudly, and still answer 200 so Sanity doesn't resend the event.
      console.error(`[revalidate] blog rebuild check for ${docId} failed:`, err);
      rebuildStatus = "check failed; see the function log";
    }
  }

  return NextResponse.json({
    revalidated: true,
    tag,
    docId,
    docType,
    ...(rebuildStatus ? { rebuild: rebuildStatus } : {}),
    timestamp: new Date().toISOString(),
  });
}
