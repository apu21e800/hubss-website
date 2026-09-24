/**
 * POST /api/revalidate — Sanity calls this when a document is published.
 *
 * It checks Sanity's signature (the webhook's Secret field, sent in the
 * `sanity-webhook-signature` header), waits about 3 s for Sanity's CDN to catch
 * up (next-sanity's parseBody does that), then expires the cache tag for the
 * document's type. The next visitor gets a freshly rendered page.
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
 *   2. sanity.io/manage → project 9dbro2m1 → API → Webhooks → Create webhook:
 *        Name        hubss.com revalidate
 *        URL         https://hubss.com/api/revalidate
 *        Dataset     production
 *        Trigger on  Create, Update, Delete
 *        Filter      _type in ["product", "application", "page", "siteSettings", "blogPost"]
 *        Projection  { _id, _type }
 *        HTTP method POST
 *        Secret      the same string as SANITY_WEBHOOK_SECRET
 */

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody, type ParsedBody } from "next-sanity/webhook";

// Each Sanity type → the cache tag its queries carry in lib/sanity.queries.ts.
const TYPE_TO_TAG: Record<string, string> = {
  product: "products",
  application: "applications",
  page: "pages",
  siteSettings: "siteSettings",
  // No query reads blog posts from Sanity yet. The blog moves there next
  // (claude/HUBSS-next-task.md, Phase C), and its queries will carry "blog".
  blogPost: "blog",
};

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

  return NextResponse.json({
    revalidated: true,
    tag,
    docId,
    docType,
    timestamp: new Date().toISOString(),
  });
}
