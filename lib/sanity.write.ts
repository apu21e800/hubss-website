/**
 * A Sanity client that can write. Server-only: it carries
 * SANITY_API_WRITE_TOKEN, which must never reach a browser bundle, so import it
 * only from route handlers and scripts. Used by the Field Notes drafter
 * (lib/field-note-pipeline.ts), which only ever creates drafts.
 *
 * "raw" perspective, so it sees drafts as well as published documents: the
 * drafter must not pick a slug an unpublished draft already uses.
 */
import { createClient, type SanityClient } from "@sanity/client";
import { projectId, dataset, apiVersion } from "@/lib/sanity.client";

export function sanityWriteClient(): SanityClient {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is not set on this server");
  return createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "raw", token });
}
