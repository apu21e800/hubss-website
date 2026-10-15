/**
 * sanity/structure.ts — Custom Studio sidebar structure for Doug.
 *
 * Plain words for a non-technical editor (15 Oct 2026; Vern: "what does not
 * live mean? What's the difference between insights and insights plan? maybe
 * better to just call it blog"):
 *   📄 Website Pages  → singletons per page (no confusing "create new" list)
 *   📦 Products, Applications
 *   ✍️  Blog posts      (the articles; the site calls the blog "Insights")
 *   💡 Blog ideas      (what the AI writer drafts next)
 *   📷  Job photos for social (become social posts; not on the website)
 *   📣  Sent to Buffer  (read only: what went to Buffer, and its style check)
 *   ⚙️  Site Settings (singleton)
 *
 * The May 2026 "Projects (Map Pins)" list is off the sidebar: the homepage
 * map is built from lib/map-projects.ts, so editing a pin there changed
 * nothing. Its documents are still in the dataset (nothing deleted), and
 * sanity.config.ts keeps it out of the Create menu.
 *
 * Each list keeps the id its old title gave it, so a saved Studio link still
 * opens the same list.
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
} from "@sanity/icons";

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

      S.divider(),

      // ── Products ─────────────────────────────────────────────────────────────
      S.documentTypeListItem("product")
        .title("Products")
        .icon(PackageIcon),

      // ── Applications ─────────────────────────────────────────────────────────
      S.documentTypeListItem("application")
        .title("Applications")
        .icon(BlockContentIcon),

      S.divider(),

      // ── Blog posts ───────────────────────────────────────────────────────────
      // The site's only copy of the blog (lib/blog.ts), shown on hubss.com as
      // "Insights" (Doug's name for it). Newest first. The AI writer's drafts
      // land here unpublished.
      S.listItem()
        .id("insights")
        .title("Blog posts")
        .icon(EditIcon)
        .child(
          S.documentTypeList("blogPost")
            .title("Blog posts · on the site as Insights · drafts wait here for Publish")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),

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
            .title("Blog ideas · the AI writer drafts the top one Tuesday and Thursday")
            .defaultOrdering([{ field: "priority", direction: "asc" }, { field: "_createdAt", direction: "asc" }])
        ),

      S.divider(),

      // ── Job photos for social ────────────────────────────────────────────────
      // Photos of a finished job with a line of facts (sanity/schemas/fieldPost.ts).
      // Publishing one has the next daily social run draft posts from it in Buffer.
      // ("From the field" until 15 Oct 2026; the stream keeps that name in the logs.)
      S.listItem()
        .id("fromTheField")
        .title("Job photos for social")
        .icon(ImagesIcon)
        .child(
          S.documentTypeList("fieldPost")
            .title("Job photos · publish one and it becomes social drafts in Buffer the next day")
            .defaultOrdering([{ field: "date", direction: "desc" }])
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
            .title("Sent to Buffer · read only · approve the posts themselves in Buffer")
            .defaultOrdering([{ field: "createdAt", direction: "desc" }])
            .initialValueTemplates([])
        ),

      S.divider(),

      // ── Site Settings (singleton) ─────────────────────────────────────────────
      S.documentListItem()
        .schemaType("siteSettings")
        .id("siteSettings")
        .title("Site Settings")
        .icon(CogIcon),
    ]);
