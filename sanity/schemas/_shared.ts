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
 * @param name    - Sanity field name (e.g. "heroImage")
 * @param title   - Studio label (e.g. "Hero Image")
 * @param required - Whether alt text is required (default: false)
 *
 * @example
 *   defineField(richImageField("heroImage", "Hero Image", true))
 */
export const richImageField = (
  name: string,
  title: string,
  required = false
) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alt text",
        description: "Describes the image for screen readers and search engines.",
        validation: required ? (r) => r.required() : undefined,
      }),
      defineField({
        name: "caption",
        type: "string",
        title: "Caption (optional)",
        description: "Optional caption shown below the image.",
      }),
    ],
  });
