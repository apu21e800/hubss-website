/**
 * POST /api/review/notify: "Send to Doug" and "Take it back" in the Studio
 * (sanity/components/ForReviewInput.tsx). Body: { id, on }, the article's
 * published id and whether it was just sent (true) or taken back (false).
 *
 * The Studio saves the switch itself; this only follows it, through
 * lib/review-notify.ts: sent, Doug is emailed once (notifyDoug); taken back,
 * the record is cleared so the next send is a new round (clearDougNotice).
 * Both read the article from Sanity with the server's own token and act only
 * on what is saved there, so the route needs no key: a request from anyone
 * else can at most bring forward an email the morning run would send anyway,
 * never send one for an article nobody sent. Same-site requests only (the
 * Origin must be this host), the id checked before Sanity is asked, nothing
 * about the article in the answer but the outcome.
 *
 * Only production sends (sendsHere). On a preview or a laptop the answer is
 * "elsewhere" and the next daily run on hubss.com sends it.
 */
import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.write";
import { clearDougNotice, notifyDoug } from "@/lib/review-notify";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** A blog post's id, published or draft, as Sanity makes them. */
const ARTICLE_ID = /^(?:drafts\.)?[A-Za-z0-9][A-Za-z0-9._-]{0,150}$/;

/** How long to wait for the Studio to save the switch. */
const WAIT_MS = 12_000;

function sameSite(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!sameSite(req)) return NextResponse.json({ outcome: "refused" }, { status: 403 });
  let body: { id?: unknown; on?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ outcome: "refused" }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  if (!ARTICLE_ID.test(id) || typeof body.on !== "boolean") return NextResponse.json({ outcome: "refused" }, { status: 400 });
  if (!process.env.SANITY_API_WRITE_TOKEN) return NextResponse.json({ outcome: "elsewhere" });

  const client = sanityWriteClient().withConfig({ timeout: 10_000 });
  try {
    const outcome = body.on ? await notifyDoug(client, id, { waitMs: WAIT_MS }) : await clearDougNotice(client, id, { waitMs: WAIT_MS });
    return NextResponse.json({ outcome });
  } catch (err) {
    console.error(`[review] ${body.on ? "sending" : "taking back"} ${id} failed: ${err instanceof Error ? err.message : err}`);
    return NextResponse.json({ outcome: "error" }, { status: 500 });
  }
}
