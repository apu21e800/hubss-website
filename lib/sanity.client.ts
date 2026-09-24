/**
 * Sanity client + image URL builder.
 *
 * Sanity project ID: 9dbro2m1
 * Add these in Vercel → Settings → Environment Variables:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID = 9dbro2m1
 *   NEXT_PUBLIC_SANITY_DATASET    = production  (confirm with Vernon)
 *   SANITY_API_READ_TOKEN         = (create at sanity.io/manage → API → Tokens → Add → Viewer)
 */

import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
export const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";
export const apiVersion = "2024-01-01";

// Published documents only. Without this, a request that carries a token gets
// the "raw" perspective (the default for API versions before 2025-02-19), which
// returns drafts alongside published documents. Every query takes [0], and a
// draft's _id ("drafts.…") sorts first, so an unpublished Studio edit went live.
// That is how /products/mmax kept an old subtitle from an abandoned draft on
// 24 Sep 2026 while the published document and the code both had the new one.
// Pressing Publish in Studio is what puts copy on the site.
const perspective = "published" as const;

// Straight to the API, not Sanity's CDN. Next's Data Cache (unstable_cache,
// lib/sanity.queries.ts) is the site's cache, and the webhook empties it on
// Publish; the fetch that refills it must see what was just published. The CDN
// can lag a publish by seconds. Measured 24 Sep 2026 08:30 UTC: an edit went
// live in 5 s, but a second publish 6 s later was rendered from the CDN's copy
// of the first, and /contact showed the wrong text until someone published
// again. Uncached reads only happen when a page is rebuilt, so the API load is
// small.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective,
  // Read token. With perspective "published" it cannot expose drafts.
  token: process.env.SANITY_API_READ_TOKEN,
});

/** The same client; kept so older imports keep working. */
export const clientNoCache = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective,
  token: process.env.SANITY_API_READ_TOKEN,
});

// Image URL builder
const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
