import { buildLlmsTxt } from "./llms-content";

// 2 Oct 2026 (Vern: "be searchable on all LLM models"): /llms.txt is built
// from the merged product and application data (./llms-content.ts) instead of
// the stale hand-written public/llms.txt. Static, rebuilt at most daily.
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
