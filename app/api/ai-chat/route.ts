import { NextResponse } from "next/server";

/**
 * Closed 6 Oct 2026. This route streamed Claude Opus to anyone who posted
 * {"message": "..."} to it, billed to HUB's Anthropic key (the one the
 * Insights drafter uses), with no check on who was asking. Nothing on the site
 * calls it: components/ai/ChatAssistant.tsx, its only caller, is rendered by
 * no page. Found while closing the contact form to spam bots.
 *
 * The old handler is in git history (before this commit) if a chat assistant
 * is ever wanted; it would need BotID and a budget before going back up.
 */
export function POST() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}
