/**
 * POST /api/review/notify: "Send for review" and "Take it back" in the Studio
 * (sanity/components/ForReviewInput.tsx). Body: { ask }, the random key of a
 * private record the Studio has just made with the editor's own session
 * (lib/review-ask.ts): which article, and whether it was sent (true) or taken
 * back (false).
 *
 * Only for a signed-in editor (the review of PR #141: the first version
 * answered anyone who sent this site's Origin, and its answers told whether a
 * guessed draft existed and was with Doug). An ask nobody made, an old one or
 * a used one gets the same refusal, before any article is read. A good one is
 * taken once (takeAsk) and followed through lib/review-notify.ts: sent, Doug
 * is emailed once (notifyDoug, which still acts only on what Sanity holds);
 * taken back, the notice is cleared so the next send is a new round
 * (clearDougNotice). The outcome goes back to the editor, and into the ask.
 *
 * Only production sends (sendsHere). On a preview or a laptop the answer is
 * "elsewhere" and the next daily run on hubss.com sends it.
 */
import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.write";
import { answerAsk, clearDougNotice, notifyDoug, takeAsk } from "@/lib/review-notify";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

const refused = (status = 403) => NextResponse.json({ outcome: "refused" }, { status });

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!sameSite(req)) return refused();
  let body: { ask?: unknown };
  try {
    body = await req.json();
  } catch {
    return refused(400);
  }
  if (!process.env.SANITY_API_WRITE_TOKEN) return refused();

  const client = sanityWriteClient().withConfig({ timeout: 10_000 });
  try {
    const ask = await takeAsk(client, body.ask);
    if (!ask) return refused();
    const outcome = ask.on ? await notifyDoug(client, ask.articleId, { waitMs: WAIT_MS }) : await clearDougNotice(client, ask.articleId, { waitMs: WAIT_MS });
    await answerAsk(client, ask, outcome);
    return NextResponse.json({ outcome });
  } catch (err) {
    console.error(`[review] an ask failed: ${err instanceof Error ? err.message : err}`);
    return NextResponse.json({ outcome: "error" }, { status: 500 });
  }
}
