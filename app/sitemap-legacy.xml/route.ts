/**
 * /sitemap-legacy.xml: the old WordPress site's addresses that earned search
 * traffic, every one of which now redirects (next.config.ts,
 * lib/legacy-doc-redirects.ts). 16 Oct 2026.
 *
 * Why: Search Console showed clicks from Google down about a third on last
 * summer, more than half of the loss on old spec-sheet addresses that went to
 * the library page until 15 Oct (claude/HUBSS-search-baseline-2026-10-15.md
 * in the project). Google only learns that an old address moved when it
 * re-crawls it, which for a little-visited PDF can take months. A sitemap of
 * the old addresses, submitted in Search Console (Sitemaps, "sitemap-legacy.xml"),
 * has it re-read them sooner; Google's site-move steps keep the old URLs'
 * sitemap during a move for the same reason, and say Search Console's
 * warnings that its URLs redirect can be ignored.
 *
 * Not linked from /sitemap.xml or robots.txt on purpose: only Search Console
 * (and Bing Webmaster Tools) are given it. Remove it, and this route, in
 * April 2027, once Search Console shows the old addresses dropped.
 */
import legacy from "@/lib/legacy-addresses.json";

export const dynamic = "force-static";

const SITE = "https://hubss.com";

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const urls = (legacy.paths as string[]).map((p) => `  <url><loc>${xml(SITE + p)}</loc></url>`).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
