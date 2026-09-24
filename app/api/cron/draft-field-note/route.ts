/**
 * GET /api/cron/draft-field-note — the Tuesday Field Notes drafter.
 *
 * Vercel Cron calls it (vercel.json) with `Authorization: Bearer $CRON_SECRET`.
 * To run it now: Vercel → hubss-website → Settings → Cron Jobs → Run. To draft
 * one particular plan item: add ?idea=<its document id>.
 *
 * It takes the top "Ready" item in Studio's Field Notes plan, has Claude write
 * and then fact-check a draft, saves it as an UNPUBLISHED Blog / Field Notes
 * draft, and emails BLOG_DRAFT_NOTIFY. See lib/field-note-pipeline.ts.
 *
 * Needs, in Vercel (Production): CRON_SECRET, ANTHROPIC_API_KEY,
 * SANITY_API_WRITE_TOKEN (an Editor token), BLOG_DRAFT_NOTIFY, RESEND_API_KEY.
 */

import { NextRequest, NextResponse } from "next/server";
import { draftNextFieldNote } from "@/lib/field-note-pipeline";

// Two long Claude calls: writing (about a minute) and checking.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[field-notes] CRON_SECRET is not set");
    return NextResponse.json({ error: "CRON_SECRET is not configured on this server." }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const missing = ["ANTHROPIC_API_KEY", "SANITY_API_WRITE_TOKEN"].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`[field-notes] not configured: ${missing.join(", ")}`);
    return NextResponse.json({ error: `Not configured: ${missing.join(", ")}` }, { status: 500 });
  }

  try {
    const result = await draftNextFieldNote({ ideaId: req.nextUrl.searchParams.get("idea") ?? undefined });
    return NextResponse.json(result);
  } catch (err) {
    // The plan item stays "Ready", so the next run tries again.
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[field-notes] draft failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
