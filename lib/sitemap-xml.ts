/**
 * The sitemap's addresses as XML text. No imports, so `npm run test:sitemap`
 * runs without the build's generated files (as lib/pinned-post.ts does).
 *
 * Next's sitemap renderer prints <loc> and <image:loc> values as given
 * (next/dist/build/webpack/loaders/metadata/resolve-route-data.js), so a
 * Sanity address with `?w=1920&q=75&auto=format` put a bare "&" in the file:
 * 4,439 of them on 3 Nov 2026, and /sitemap.xml was not well-formed XML
 * (Semrush: "Invalid sitemap.xml format"; an XML parser stops at line 6).
 * app/sitemap.ts passes every address through xmlSafeSitemap; the data
 * buildSitemap (lib/sitemap.ts) returns stays plain, since
 * scripts/gen-search-images.ts fetches those addresses. scripts/verify-site.mjs
 * unescapes before comparing a listed photo with its page's <img>.
 */
import type { MetadataRoute } from "next";

export function xmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** The sitemap's entries with every address made XML-safe, for the route to serve. */
export function xmlSafeSitemap(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  return entries.map((e) => ({
    ...e,
    url: xmlText(e.url),
    ...(e.images ? { images: e.images.map(xmlText) } : {}),
  }));
}
