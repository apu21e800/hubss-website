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
 *     Every document with a page has an "Edit on the page" button above its
 *     form that opens its own page (21 Oct 2026, sanity/components/EditOnThePage.tsx);
 *     the tool in the top bar starts on the homepage.
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
import { EDIT_ON_THE_PAGE_TOOL, PAGE_ROUTES, documentPage } from "./sanity/studio-pages";
import { EditOnThePageInput } from "./sanity/components/EditOnThePage";
import { withoutLockedActions } from "./sanity/document-locks";
import { BLOG_NAME } from "./lib/field-notes-taxonomy";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";

const HOMEPAGE: DocumentLocation = { title: "Homepage", href: "/" };

/**
 * Where each kind of document shows on the site. Studio prints these at the
 * top of the document ("Used on 3 pages") with a link that opens the page in
 * "Edit on the page". The first location of each is the document's own page,
 * from sanity/studio-pages.ts, which the button above the form opens too.
 */
const locations = {
  page: defineLocations({
    select: { slug: "slug.current" },
    resolve: (doc) => {
      const own = documentPage("page", doc);
      return own ? { locations: [own] } : null;
    },
  }),
  product: defineLocations({
    select: { name: "name", slug: "slug.current" },
    resolve: (doc) => {
      const own = documentPage("product", doc);
      return own ? { locations: [own, HOMEPAGE] } : null;
    },
  }),
  application: defineLocations({
    select: { name: "name", slug: "slug.current" },
    resolve: (doc) => {
      const own = documentPage("application", doc);
      return own ? { locations: [own, { title: "Applications", href: "/applications" }, HOMEPAGE] } : null;
    },
  }),
  blogPost: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => {
      const own = documentPage("blogPost", doc);
      return own
        ? {
            locations: [own, { title: BLOG_NAME, href: "/blog" }],
            message: "A new article appears on the site about five minutes after its first Publish.",
          }
        : null;
    },
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
 *
 * A scheduled draft (lib/project-posts.ts) that someone publishes by hand
 * is no longer set to go by itself as it goes out: otherwise its next edit
 * would sit in a draft still marked to go live by itself, at a time already
 * past, and the daily run would publish the half-made edit.
 */
function datedPublish(original: DocumentActionComponent): DocumentActionComponent {
  const Action: DocumentActionComponent = (props: DocumentActionProps) => {
    const result = original(props);
    const { patch } = useDocumentOperation(props.id, props.type);
    if (!result) return result;
    return {
      ...result,
      onHandle: () => {
        const current = (props.draft ?? props.published) as { publishedAt?: string; scheduled?: boolean } | null;
        const date = current?.publishedAt ? Date.parse(current.publishedAt) : NaN;
        if (!props.published && (Number.isNaN(date) || date <= Date.now())) {
          patch.execute([{ set: { publishedAt: new Date().toISOString() } }]);
        }
        if (current?.scheduled) {
          patch.execute([{ set: { scheduled: false } }, { unset: ["scheduledFor"] }]);
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


/** Document types left out of the global Create menu (newDocumentOptions below). */
const NOT_CREATED_BY_HAND = new Set(["page", "siteSettings", "socialLog", "project"]);

export default defineConfig({
  name:     "hubss-studio",
  title:    "HUB Surface Systems",
  basePath: "/studio",
  icon:     StudioLogo,

  projectId,
  dataset,

  // Only what HUB's Sanity plan includes, so nothing in Doug's way leads to
  // an "Upgrade to unlock" screen (23 Oct 2026, as Square One's Studio). The
  // project is on Sanity's free plan: its features (api.sanity.io
  // /projects/9dbro2m1/features) include Edit on the page
  // (contentSourceMapping) but not Content Releases, scheduled drafts or
  // publishing, comments or Tasks, all on by default in Sanity 5. Off: the
  // Releases tool and its picker in the top bar, Sanity's own scheduling (an
  // article goes live at its time through its own fields, "Scheduled" and
  // "Goes live at", lib/project-posts.ts) and Tasks; comments are off in
  // `document` below. Turn one on only with a plan that includes it.
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  scheduledPublishing: { enabled: false },
  tasks: { enabled: false },

  plugins: [
    structureTool({ structure, title: "Content" }),
    presentationTool({
      name: EDIT_ON_THE_PAGE_TOOL,
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

  // The "Edit on the page" button above the form of every document that has
  // a page (sanity/components/EditOnThePage.tsx); other inputs are unchanged.
  form: {
    components: { input: EditOnThePageInput },
  },

  document: {
    // Not on HUB's plan (above).
    comments: { enabled: false },
    // Studio's global Create menu offers only what an editor makes by hand
    // (15 Oct 2026). Pages and Site Settings are one of each, "Sent to
    // Buffer" is written by the social job, and the old map pins aren't read
    // by the site.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global" ? prev.filter((t) => !NOT_CREATED_BY_HAND.has(t.templateId)) : prev,
    // No Delete, Unpublish or Duplicate on the pages, Site Settings or a
    // "Sent to Buffer" record (sanity/document-locks.ts, 23 Oct 2026).
    actions: (prev, context) => {
      const kept = withoutLockedActions(prev, context.schemaType);
      return context.schemaType === "blogPost"
        ? kept.map((action) => (action.action === "publish" ? datedPublish(action) : action))
        : kept;
    },
  },
});
