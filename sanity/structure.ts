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
  UtensilsIcon,
  PackageIcon,
  BlockContentIcon,
  EditIcon,
  PinIcon,
  CogIcon,
  ImagesIcon,
} from "@sanity/icons";

// Page document IDs — set by migrate-to-sanity.ts
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
                .icon(UtensilsIcon),
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

      // ── Blog / Field Notes ───────────────────────────────────────────────────
      S.documentTypeListItem("blogPost")
        .title("Blog / Field Notes")
        .icon(EditIcon),

      // ── Projects (Map Pins) ──────────────────────────────────────────────────
      S.documentTypeListItem("project")
        .title("Projects (Map Pins)")
        .icon(PinIcon),

      S.divider(),

      // ── Site Settings (singleton) ─────────────────────────────────────────────
      S.documentListItem()
        .schemaType("siteSettings")
        .id("siteSettings")
        .title("Site Settings")
        .icon(CogIcon),
    ]);
