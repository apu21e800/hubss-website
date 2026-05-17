/**
 * Sanity Studio configuration.
 * Studio is served at /studio — gated by Basic Auth middleware.
 *
 * TODO: Vernon — set these env vars in Vercel (Settings → Environment Variables):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID   your Sanity project ID (sanity.io/manage)
 *   NEXT_PUBLIC_SANITY_DATASET      usually "production"
 *   SANITY_API_READ_TOKEN           API token with read access
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool }    from "@sanity/vision";
import { schemaTypes }   from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "PLACEHOLDER";
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";

export default defineConfig({
  name:    "hubss-studio",
  title:   "HUB Surface Systems",
  basePath: "/studio",

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(), // GROQ query explorer — dev only, safe to remove post-launch
  ],

  schema: {
    types: schemaTypes,
  },
});
