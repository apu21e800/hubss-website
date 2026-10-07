/**
 * GET /api/draft-mode/enable — Studio's "Edit on the page" opens the site
 * through here (sanity.config.ts, presentationTool).
 *
 * Studio sends a one-time secret that only a signed-in Studio user can create;
 * this route checks it against Sanity with the server's token and only then
 * turns on Next's draft mode for that browser, then redirects to the page
 * being edited. A request without a valid secret gets 401 and nothing changes.
 * What draft mode does is described in lib/sanity.preview.ts.
 */

import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/lib/sanity.client";
import { previewToken } from "@/lib/sanity.preview";

export async function GET(request: Request): Promise<Response> {
  const token = previewToken();
  if (!token) {
    // Say why, rather than a bare 500, if the server has no Sanity token.
    console.error("[draft-mode] no SANITY_API_READ_TOKEN or SANITY_API_WRITE_TOKEN; Edit on the page can't open");
    return new Response("Edit on the page isn't set up on this server: it has no Sanity token.", { status: 503 });
  }
  const { GET: enable } = defineEnableDraftMode({ client: client.withConfig({ token, apiVersion: "2025-02-19" }) });
  return enable(request);
}
