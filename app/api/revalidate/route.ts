/**
 * POST /api/revalidate
 *
 * Called by Sanity webhook on document publish.
 * Verifies SANITY_WEBHOOK_SECRET then revalidates the affected cache tag.
 *
 * Sanity webhook setup (do after merge):
 *   sanity.io/manage → project 9dbro2m1 → API → Webhooks → Add
 *   URL:    https://hubss.com/api/revalidate
 *   Method: POST
 *   Filter: _type in ["product","application","blogPost","project","siteSettings"]
 *   Secret: <value of SANITY_WEBHOOK_SECRET env var>
 *   Projection: { _id, _type }
 */

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const TYPE_TO_TAG: Record<string, string> = {
  product:      "products",
  application:  "applications",
  blogPost:     "blog",
  project:      "projects",
  siteSettings: "site-settings",
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  // Require a shared secret — return 401 if not configured or mismatch
  if (!secret) {
    return NextResponse.json(
      { error: "SANITY_WEBHOOK_SECRET is not configured on this server." },
      { status: 401 }
    );
  }

  // Sanity sends the secret in the Authorization header: "Bearer <secret>"
  const authHeader = req.headers.get("authorization") ?? "";
  const providedSecret = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (providedSecret !== secret) {
    return NextResponse.json({ error: "Invalid webhook secret." }, { status: 401 });
  }

  // Parse body — Sanity sends { _id, _type } by default
  let body: { _id?: string; _type?: string };
  try {
    body = (await req.json()) as { _id?: string; _type?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const docType = body._type;
  if (!docType) {
    return NextResponse.json({ error: "Missing _type in webhook body." }, { status: 400 });
  }

  const tag = TYPE_TO_TAG[docType];
  if (!tag) {
    // Unknown type — acknowledge but do nothing
    return NextResponse.json({
      revalidated: false,
      message: `No cache tag mapped for _type "${docType}". No action taken.`,
    });
  }

  revalidateTag(tag, "max");

  return NextResponse.json({
    revalidated: true,
    tag,
    docId: body._id ?? "unknown",
    docType,
    timestamp: new Date().toISOString(),
  });
}
