/**
 * Sanity client + image URL builder.
 *
 * TODO: Vernon — create a project at sanity.io/manage, then add these
 * env vars in Vercel → Settings → Environment Variables:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID   (from Sanity project settings)
 *   NEXT_PUBLIC_SANITY_DATASET      (usually "production")
 *   SANITY_API_READ_TOKEN           (create at sanity.io/manage → API → Tokens → Add)
 */

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
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
