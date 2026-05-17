/**
 * Sanity Studio configuration.
 * Studio is served at /studio — gated by Basic Auth middleware.
 *
 * Sanity project ID: 9dbro2m1
 * Vernon: add these in Vercel → Settings → Environment Variables:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID = 9dbro2m1
 *   NEXT_PUBLIC_SANITY_DATASET    = production
 *   SANITY_API_READ_TOKEN         = (create at sanity.io/manage → API → Tokens → Viewer)
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool }    from "@sanity/vision";
import { schemaTypes }   from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
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
