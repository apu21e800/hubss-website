/**
 * sanity/structure.ts — Custom Studio sidebar structure for Doug.
 *
 * Plain words for a non-technical editor (15 Oct 2026; Vern: "what does not
 * live mean? What's the difference between insights and insights plan? maybe
 * better to just call it blog"), in three groups since 12 Nov 2026 (Vern:
 * "eliminate pain points from the sanity experience ... so everything is made
 * clear"): what Doug and Vern open every week first, the website's own pages
 * next, and the lists the daily work keeps for itself last:
 *   📖 Start here     (Doug's guide, with his review page's button)
 *   ── Blog
 *   ✍️  Blog posts      (the articles; the site calls the blog "Projects")
 *   📷  Job photos      (a finished job: an article with the story, a social
 *                        post without; "Job photos for social" until 12 Nov)
 *   ── Website
 *   📄 Website Pages  → singletons per page (no confusing "create new" list)
 *   📦 Products, Applications
 *   ⚙️  Site Settings (singleton)
 *   ── Behind the scenes
 *   💡 Blog ideas      (what 21e8 writes up next; it keeps the list topped up)
 *   📣  Sent to Buffer  (read only: what went to Buffer, and its style check)
 *
 * The May 2026 "Projects (Map Pins)" list is off the sidebar: the homepage
 * map is built from lib/map-projects.ts, so editing a pin there changed
 * nothing. Its documents are still in the dataset (nothing deleted), and
 * sanity.config.ts keeps it out of the Create menu.
 *
 * Each list keeps the id its old title gave it, so a saved Studio link still
 * opens the same list. The groups are titled dividers, not folders, for the
 * same reason.
 */

import type { StructureResolver } from "sanity/structure";
import {
  HomeIcon,
  InfoOutlineIcon,
  EnvelopeIcon,
  PresentationIcon,
  PackageIcon,
  BlockContentIcon,
  EditIcon,
  CogIcon,
  BulbOutlineIcon,
  ImagesIcon,
  ShareIcon,
  BookIcon,
} from "@sanity/icons";
import GuidePane from "./components/GuidePane";

/** The first item's title: Doug's guide (lib/office-guide.ts). */
export const GUIDE_ITEM_TITLE = "Start here: how to update the site";

// Page document IDs — set by the May 2026 migration
const PAGE_IDS = {
  homepage:   "page-homepage",
  about:      "page-about",
  contact:    "page-contact",
  lunchLearn: "page-lunch-learn",
} as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("HUB Surface Systems")
    .items([
      // ── Start here (4 Nov 2026, as Square One's Studio since 23 Oct) ─────────
      // Doug's one-page guide (lib/office-guide.ts) with his review page's
      // button above it, first; the same guide to bookmark is
      // hubss.com/studio/guide.
      S.listItem()
        .id("guide")
        .title(GUIDE_ITEM_TITLE)
        .icon(BookIcon)
        .child(S.component(GuidePane).id("guide-page").title("How to update the site")),

      // ── Blog: what Doug and Vern open every week ─────────────────────────────
      S.divider().title("Blog"),

      // ── Blog posts ───────────────────────────────────────────────────────────
      // The site's only copy of the blog (lib/blog.ts), shown on hubss.com as
      // "Projects" (BLOG_NAME). Newest first. New drafts land here unpublished;
      // the list's line says "With Doug" while one waits on his review page.
      S.listItem()
        .id("insights")
        .title("Blog posts")
        .icon(EditIcon)
        .child(
          S.documentTypeList("blogPost")
            .title("Blog posts · on the site as Projects · a new article goes to Doug for his OK before it goes live")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),

      // ── Job photos ───────────────────────────────────────────────────────────
      // Photos of a finished job with a line of facts (sanity/schemas/fieldPost.ts).
      // Publishing one has the next daily run write posts from it for Buffer;
      // with the story filled in it becomes a Projects article instead, whose
      // own posts follow once it is live (lib/project-posts.ts, 19 Oct 2026). ("From the field" until 15 Oct
      // 2026; the stream keeps that name in the logs.) Since 6 Nov 2026 the
      // posts are scheduled straight away and only the article waits for
      // Doug's OK (lib/buffer.ts socialAutoQueue). "Job photos" since 12 Nov
      // 2026 ("Job photos for social" until then): with the story a post
      // becomes an article, not a social post, and the old name said otherwise.
      // Its form says which, and how far it has got (JobPhotosInput.tsx).
      S.listItem()
        .id("fromTheField")
        .title("Job photos")
        .icon(ImagesIcon)
        .child(
          S.documentTypeList("fieldPost")
            .title("Job photos · a finished job: with the story it becomes an article, without it a social post")
            .defaultOrdering([{ field: "date", direction: "desc" }])
        ),

      // ── Website: the pages, products and settings ─────────────────────────────
      S.divider().title("Website"),

      // ── Website Pages (singletons per page) ─────────────────────────────────
      S.listItem()
        .title("Website Pages")
        .icon(HomeIcon)
        .child(
          S.list()
            .title("Website Pages")
            .items([
              S.documentListItem()
                .schemaType("page")
                .id(PAGE_IDS.homepage)
                .title("Homepage")
                .icon(HomeIcon),
              S.documentListItem()
                .schemaType("page")
                .id(PAGE_IDS.about)
                .title("About HUB")
                .icon(InfoOutlineIcon),
              S.documentListItem()
                .schemaType("page")
                .id(PAGE_IDS.contact)
                .title("Contact")
                .icon(EnvelopeIcon),
              S.documentListItem()
                .schemaType("page")
                .id(PAGE_IDS.lunchLearn)
                .title("Lunch & Learn")
                .icon(PresentationIcon),
            ])
        ),

      // ── Products ─────────────────────────────────────────────────────────────
      S.documentTypeListItem("product")
        .title("Products")
        .icon(PackageIcon),

      // ── Applications ─────────────────────────────────────────────────────────
      S.documentTypeListItem("application")
        .title("Applications")
        .icon(BlockContentIcon),

      // ── Site Settings (singleton) ─────────────────────────────────────────────
      S.documentListItem()
        .schemaType("siteSettings")
        .id("siteSettings")
        .title("Site Settings")
        .icon(CogIcon),

      // ── Behind the scenes: the lists the daily work keeps ───────────────────
      S.divider().title("Behind the scenes"),

      // ── Blog ideas ───────────────────────────────────────────────────────────
      // What to write next. The drafter (Tuesdays and Thursdays) takes the top
      // "Ready" item, else the top Idea, and tops the list up when it's low
      // (lib/insights-planner.ts). ("Insights plan" until 15 Oct 2026, "Field
      // Notes" before 25 Sep; the document types keep their names.)
      S.listItem()
        .id("insightsPlan")
        .title("Blog ideas")
        .icon(BulbOutlineIcon)
        .child(
          S.documentTypeList("storyIdea")
            .title("Blog ideas · 21e8 writes the top one up on Tuesdays and Thursdays and keeps the list topped up")
            .defaultOrdering([{ field: "priority", direction: "asc" }, { field: "_createdAt", direction: "asc" }])
        ),

      // ── Sent to Buffer ───────────────────────────────────────────────────────
      // What the daily social drafter left in Buffer for each article, job-photos
      // post or library item, with the style check on its copy
      // (lib/social-pipeline.ts). The pipeline writes these; nothing here is
      // created or edited by hand. ("Social drafts" until 15 Oct 2026.)
      S.listItem()
        .id("socialDrafts")
        .title("Sent to Buffer")
        .icon(ShareIcon)
        .child(
          S.documentTypeList("socialLog")
            .title("Sent to Buffer · read only · what was written for social and when it goes out")
            .defaultOrdering([{ field: "createdAt", direction: "desc" }])
            .initialValueTemplates([])
        ),
    ]);
