/**
 * sanity/structure.ts — Custom Studio sidebar structure for Doug.
 *
 * Groups content logically for a non-technical editor:
 *   📄 Website Pages  → singletons per page (no confusing "create new" list)
 *   📦 Products & Applications
 *   ✍️  Blog / Field Notes
 *   📍  Projects (Map Pins)
 *   ⚙️  Site Settings (singleton)
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
  PinIcon,
  CogIcon,
  BulbOutlineIcon,
  ImagesIcon,
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

      // ── Field Notes plan ─────────────────────────────────────────────────────
      // What to write next. The Tuesday drafter takes the top "Ready" item.
      S.listItem()
        .title("Field Notes plan")
        .icon(BulbOutlineIcon)
        .child(
          S.documentTypeList("storyIdea")
            .title("Field Notes plan")
            .defaultOrdering([{ field: "priority", direction: "asc" }, { field: "_createdAt", direction: "asc" }])
        ),

      // ── Blog / Field Notes ───────────────────────────────────────────────────
      // The site's only copy of the blog (lib/blog.ts). Newest first.
      S.listItem()
        .title("Blog / Field Notes")
        .icon(EditIcon)
        .child(
          S.documentTypeList("blogPost")
            .title("Blog / Field Notes")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),

      // ── Projects (Map Pins) ──────────────────────────────────────────────────
      // Not read by the site yet: the map's pins are still lib/map-projects.ts.
      // Said in the title so nobody edits a pin and waits for it to change.
      S.documentTypeListItem("project")
        .title("Projects (Map Pins) — not live yet")
        .icon(PinIcon),

      S.divider(),

      // ── Site Settings (singleton) ─────────────────────────────────────────────
      S.documentListItem()
        .schemaType("siteSettings")
        .id("siteSettings")
        .title("Site Settings")
        .icon(CogIcon),
    ]);
