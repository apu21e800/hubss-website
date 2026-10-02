import { buildLlmsFullTxt } from "../llms.txt/llms-content";

// 2 Oct 2026 (Vern: "be searchable on all LLM models"): the long form of
// /llms.txt, from the same data (../llms.txt/llms-content.ts): each product
// and application page's own text, the StreetPrint questions and answers, and
// every Insights post. Static, rebuilt at most daily.
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  return new Response(await buildLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
