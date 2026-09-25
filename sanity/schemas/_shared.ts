/**
 * sanity/schemas/_shared.ts
 *
 * Reusable field helpers for Sanity schemas.
 * Import these helpers instead of repeating boilerplate across schema files.
 */

import { defineField } from "sanity";

/**
 * Rich image field with hotspot, alt text, and optional caption.
 *
 * @param name     - Sanity field name (e.g. "heroImage")
 * @param title    - Studio label (e.g. "Hero Image")
 * @param required - Whether alt text is required (default: false)
 * @param group    - Field group name for Studio tabs (e.g. "media")
 *
 * @example
 *   richImageField("heroImage", "Hero Image", true, "media")
 */
export const richImageField = (
  name: string,
  title: string,
  required = false,
  group?: string
) =>
  defineField({
    name,
    title,
    type: "image",
    ...(group ? { group } : {}),
    description: "Use the hotspot tool (crosshair icon) to mark the focal point — ensures the right area is visible on all screen sizes.",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alt text",
        description: "Describe the image for screen readers and SEO (e.g. 'Stamped asphalt crosswalk in Vancouver'). Required for AODA compliance.",
        validation: required
          ? (r) => r.required().error("Alt text is required for accessibility (AODA compliance)")
          : (r) => r.warning("All images should have alt text for accessibility"),
      }),
      defineField({
        name: "caption",
        type: "string",
        title: "Caption (optional)",
        description: "Short caption shown below the image in some contexts.",
      }),
      defineField({
        name: "origin",
        title: "Original file",
        type: "string",
        hidden: true,
        readOnly: true,
        description: "The /public path this photo was migrated from. Set by scripts/sync-photos-to-sanity.ts: the same file can live in two folders, and each page reads SEO text from its own (lib/photos.ts).",
      }),
      defineField({ name: "originAsset", title: "Asset the original file was uploaded as", type: "string", hidden: true, readOnly: true }),
    ],
  });

/**
 * Gallery image item — for use in array fields.
 * Includes hotspot, alt text (required), and optional caption.
 *
 * @example
 *   defineField({
 *     name: "gallery",
 *     title: "Gallery images",
 *     type: "array",
 *     of: [galleryImageItem],
 *   })
 */
export const galleryImageItem = {
  type: "image" as const,
  title: "Gallery image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the photo for screen readers and Google Images, e.g. 'Red brick-pattern crosswalk at a Toronto intersection'. Required for AODA compliance.",
      validation: (Rule) => Rule.required().error("Every photo needs alt text before it can be published (AODA)"),
    }),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
      description: "Shown under the photo when a visitor opens it full screen. Leave blank to show the alt text there instead.",
    }),
    defineField({
      name: "origin",
      title: "Original file",
      type: "string",
      hidden: true,
      readOnly: true,
      description: "The /public path this photo was migrated from. Set by scripts/sync-photos-to-sanity.ts: the same file can live in two folders, and each page reads SEO text from its own (lib/photos.ts).",
    }),
    defineField({ name: "originAsset", title: "Asset the original file was uploaded as", type: "string", hidden: true, readOnly: true }),
  ],
};
