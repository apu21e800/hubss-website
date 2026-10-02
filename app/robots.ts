import type { MetadataRoute } from "next";

const DISALLOW = ["/admin/", "/api/", "/studio/"];

// 2 Oct 2026. Vern: "when I search Perplexity for key words like stamped
// asphalt, I get zero results for hubss. we should fix that too, be searchable
// on all LLM models." The "*" rule below already lets every crawler in; these
// groups name the AI and answer-engine crawlers so the intent is written down
// and nobody reads their absence as an oversight. A crawler that finds its own
// group ignores "*", so each group repeats the same three disallows. Tokens as
// each vendor documents them; robots.txt matching is case-insensitive.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI, model training
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // fetches a page a ChatGPT user asked about
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // fetches a page a Perplexity user asked about
  "ClaudeBot", // Anthropic, model training
  "Claude-SearchBot", // Claude search index
  "Claude-User", // fetches a page a Claude user asked about
  "Google-Extended", // Gemini use of Google's crawl (not Search ranking)
  "Bingbot", // Bing index, which ChatGPT search and Perplexity also draw on
  "Applebot", // Siri and Spotlight
  "Amazonbot", // Alexa
  "CCBot", // Common Crawl, a source for many models
  "Meta-ExternalAgent", // Meta AI
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: "https://hubss.com/sitemap.xml",
  };
}
