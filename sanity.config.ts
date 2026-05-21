/**
 * Sanity Studio configuration — HUB Surface Systems CMS.
 * Studio is served at /studio — gated by Basic Auth middleware.
 *
 * Sanity project: 9dbro2m1 / dataset: production
 *
 * Required Vercel environment variables:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID = 9dbro2m1
 *   NEXT_PUBLIC_SANITY_DATASET    = production
 *   SANITY_API_READ_TOKEN         = (create at sanity.io/manage → API → Tokens → Viewer role)
 */
import { defineConfig }  from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool }    from "@sanity/vision";
import { schemaTypes }   from "./sanity/schemas";
import { structure }     from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";

export default defineConfig({
  name:     "hubss-studio",
  title:    "HUB Surface Systems",
  basePath: "/studio",

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    // visionTool removed — GROQ explorer not needed by client editors
  ],

  schema: {
    types: schemaTypes,
  },
});
