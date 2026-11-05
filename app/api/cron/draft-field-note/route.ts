/**
 * GET /api/cron/draft-field-note: the Insights drafter, Tuesdays and Thursdays.
 *
 * Vercel Cron calls it (vercel.json) with `Authorization: Bearer $CRON_SECRET`.
 * To run it now: Vercel → hubss-website → Settings → Cron Jobs → Run. To draft
 * one particular plan item: add ?idea=<its document id>.
 *
 * It takes the top "Ready" item in Studio's Insights plan (the top Idea when
 * none is Ready, since 7 Oct 2026), has Claude write
 * a draft, rewrite any sentence that breaks the house style (lib/style-lint.ts)
 * and fact-check it, saves it as an UNPUBLISHED Blog / Field Notes draft with
 * both checks in its notes, and emails BLOG_DRAFT_NOTIFY. See
 * lib/field-note-pipeline.ts.
 *
 * Needs, in Vercel (Production): CRON_SECRET, ANTHROPIC_API_KEY,
 * SANITY_API_WRITE_TOKEN (an Editor token), BLOG_DRAFT_NOTIFY, RESEND_API_KEY.
 */

import { NextRequest, NextResponse } from "next/server";
import { draftNextFieldNote } from "@/lib/field-note-pipeline";
import { emailEditors } from "@/lib/editor-mail";

// Three Claude calls: writing (about a minute), a short style rewrite, and
// checking; then, when the plan is low and there's time, the planner's
// (lib/insights-planner.ts, which gives up after 80 s).
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
    // The plan item stays "Ready", so the next run tries again. The editors
    // hear of it (4 Nov 2026 audit: until then a failed Tuesday or Thursday
    // was one log line, and a run of them looked like "no draft").
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[field-notes] draft failed: ${message}`);
    await emailEditors(
      "No new draft this morning",
      [
        "The Tuesday/Thursday article draft didn't get written.",
        "",
        `What stopped it: ${message}`,
        "",
        "The idea at the top of Blog ideas stays Ready, so the next run tries it again. If this happens twice in a row, open the idea in Studio: a brief the writer can't work from (no facts, a claim it can't support) is the usual cause.",
      ].join("\n"),
      "field-notes",
    );
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
