/**
 * GET /api/cron/social-drafts — daily: Buffer drafts for new Field Notes.
 *
 * Vercel Cron calls it (vercel.json) with `Authorization: Bearer $CRON_SECRET`.
 * Run it now: Vercel → hubss-website → Settings → Cron Jobs → Run.
 * See lib/social-pipeline.ts. Drafts only; nothing is ever posted from here.
 *
 * Needs, in Vercel (Production): CRON_SECRET, BUFFER_API_KEY,
 * ANTHROPIC_API_KEY, SANITY_API_WRITE_TOKEN; BLOG_DRAFT_NOTIFY and
 * RESEND_API_KEY for the email. Until BUFFER_API_KEY is set it does nothing.
 */

import { NextRequest, NextResponse } from "next/server";
import { draftSocialForNewPosts } from "@/lib/social-pipeline";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not configured on this server." }, { status: 500 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BUFFER_API_KEY) return NextResponse.json({ skipped: "BUFFER_API_KEY is not set yet" });
  const missing = ["ANTHROPIC_API_KEY", "SANITY_API_WRITE_TOKEN"].filter((k) => !process.env[k]);
  if (missing.length) return NextResponse.json({ error: `Not configured: ${missing.join(", ")}` }, { status: 500 });

  try {
    return NextResponse.json(await draftSocialForNewPosts());
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[social] run failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
