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
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
export const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";
export const apiVersion = "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Read token — only needed for draft/private content
  token: process.env.SANITY_API_READ_TOKEN,
});

/** For server-side fetches that bypass CDN (e.g. ISR revalidation handlers) */
export const clientNoCache = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
