/**
 * Sanity Studio configuration — HUB Surface Systems CMS.
 * Studio is served at /studio. It is not behind the site's Basic Auth
 * (middleware.ts exempts it): Sanity's own per-user login protects it.
 *
 * Sanity project: 9dbro2m1 / dataset: production
 *
 * Two ways to edit, both on the same documents:
 *   - "Content" (structureTool): the lists, sanity/structure.ts.
 *   - "Edit on the page" (presentationTool, since 7 Oct 2026): the site itself,
 *     inside Studio. Click any text or photo that comes from Studio and its
 *     field opens beside the page; the page shows the change as you type,
 *     before it's published. How the preview works: lib/sanity.preview.ts.
 *
 * Vercel environment variables:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID = 9dbro2m1
 *   NEXT_PUBLIC_SANITY_DATASET    = production
 *   SANITY_API_READ_TOKEN         = optional Viewer token for the preview;
 *                                   without it the preview reads with
 *                                   SANITY_API_WRITE_TOKEN (server-side only)
 */
import { createElement } from "react";
import { defineConfig, useDocumentOperation, type DocumentActionComponent, type DocumentActionProps } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineDocuments, defineLocations, type DocumentLocation } from "sanity/presentation";
import { EyeOpenIcon } from "@sanity/icons";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";

/** The four page documents and where each lives on the site. */
const PAGE_ROUTES: Record<string, { href: string; title: string }> = {
  homepage:      { href: "/",            title: "Homepage" },
  about:         { href: "/about",       title: "About" },
  contact:       { href: "/contact",     title: "Contact" },
  "lunch-learn": { href: "/lunch-learn", title: "Lunch & Learn" },
};

const HOMEPAGE: DocumentLocation = { title: "Homepage", href: "/" };

/**
 * Where each kind of document shows on the site. Studio prints these at the
 * top of the document ("Used on 3 pages") with a link that opens the page in
 * "Edit on the page".
 */
const locations = {
  page: defineLocations({
    select: { slug: "slug.current" },
    resolve: (doc) => {
      const route = doc?.slug ? PAGE_ROUTES[doc.slug] : undefined;
      return route ? { locations: [route] } : null;
    },
  }),
  product: defineLocations({
    select: { name: "name", slug: "slug.current" },
    resolve: (doc) =>
      doc?.slug
        ? { locations: [{ title: doc.name || "Product page", href: `/products/${doc.slug}` }, HOMEPAGE] }
        : null,
  }),
  application: defineLocations({
    select: { name: "name", slug: "slug.current" },
    resolve: (doc) =>
      doc?.slug
        ? {
            locations: [
              { title: doc.name || "Application page", href: `/applications/${doc.slug}` },
              { title: "Applications", href: "/applications" },
              HOMEPAGE,
            ],
          }
        : null,
  }),
  blogPost: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) =>
      doc?.slug
        ? {
            locations: [
              { title: doc.title || "Article", href: `/blog/${doc.slug}` },
              { title: "Insights", href: "/blog" },
            ],
            message: "A new article appears on the site about five minutes after its first Publish.",
          }
        : null,
  }),
  siteSettings: defineLocations({
    locations: [
      { title: "Every page (footer)", href: "/" },
      { title: "Contact", href: "/contact" },
    ],
  }),
};

/** Which document "Edit on the page" opens beside each address. */
const mainDocuments = defineDocuments([
  ...Object.entries(PAGE_ROUTES).map(([slug, { href }]) => ({
    route: href,
    filter: `_type == "page" && slug.current == "${slug}"`,
  })),
  { route: "/products/:slug", filter: `_type == "product" && slug.current == $slug` },
  { route: "/applications/:slug", filter: `_type == "application" && slug.current == $slug` },
  { route: "/blog/:slug", filter: `_type == "blogPost" && slug.current == $slug` },
]);

/**
 * Publish, for Insights articles: an article that has never been published
 * and whose date is today or earlier gets today's date as it goes out. The
 * Tuesday drafter dates its drafts the day it writes them, and a draft that
 * waited a week used to go live a week old unless someone remembered to
 * change the date. A date in the future, or any later Publish, is left alone.
 */
function datedPublish(original: DocumentActionComponent): DocumentActionComponent {
  const Action: DocumentActionComponent = (props: DocumentActionProps) => {
    const result = original(props);
    const { patch } = useDocumentOperation(props.id, props.type);
    if (!result) return result;
    return {
      ...result,
      onHandle: () => {
        const current = (props.draft ?? props.published) as { publishedAt?: string } | null;
        const date = current?.publishedAt ? Date.parse(current.publishedAt) : NaN;
        if (!props.published && (Number.isNaN(date) || date <= Date.now())) {
          patch.execute([{ set: { publishedAt: new Date().toISOString() } }]);
        }
        result.onHandle?.();
      },
    };
  };
  Action.action = original.action;
  return Action;
}

/** The HUB wheel in Studio's top bar. */
const StudioLogo = () =>
  createElement("img", { src: "/icon.png", alt: "", style: { width: "100%", height: "100%", borderRadius: "50%" } });

export default defineConfig({
  name:     "hubss-studio",
  title:    "HUB Surface Systems",
  basePath: "/studio",
  icon:     StudioLogo,

  projectId,
  dataset,

  plugins: [
    structureTool({ structure, title: "Content" }),
    presentationTool({
      name: "edit-on-the-page",
      title: "Edit on the page",
      icon: EyeOpenIcon,
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: { locations, mainDocuments },
    }),
    // visionTool removed — GROQ explorer not needed by client editors
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) =>
      context.schemaType === "blogPost"
        ? prev.map((action) => (action.action === "publish" ? datedPublish(action) : action))
        : prev,
  },
});
