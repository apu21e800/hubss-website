/**
 * sanity/schemas/_shared.ts
 *
 * Reusable field helpers for Sanity schemas.
 * Import these helpers instead of repeating boilerplate across schema files.
 */

import { defineField, type ArrayRule, type CustomValidator, type Path, type StringRule, type ValidationError } from "sanity";
import { describeIssue, lintCopy, lintHeading, type StyleIssue } from "../../lib/style-lint";

// ── House style warnings ────────────────────────────────────────────────────
// A yellow warning under any field whose words break the house style: an em
// dash, a machine tell ("not just X", "seamless", "Fast. Durable. Proven."),
// "catalogue" for the Idea Book, "Field Notes" for Insights, Title Case in a
// heading. Warnings only, never errors: Doug can always publish, and the
// warning says what to do. The rules live in lib/style-lint.ts, shared with
// the AI drafters; docs/HOW-TO-PUBLISH.md explains each one to Doug.

const warnings = (issues: StyleIssue[], path?: Path): ValidationError[] =>
  issues.map((i) => ({ message: describeIssue(i), ...(path ? { path } : {}) }));

const checkCopy: CustomValidator<string | undefined> = (value) => {
  const found = typeof value === "string" ? warnings(lintCopy(value)) : [];
  return found.length ? found : true;
};

const checkHeading: CustomValidator<string | undefined> = (value) => {
  const found = typeof value === "string" ? warnings([...lintCopy(value), ...lintHeading(value)]) : [];
  return found.length ? found : true;
};

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null;

/**
 * A portable text body: each paragraph's words, headings in sentence case,
 * photo alt text and captions, table cells. Each warning points at its block,
 * so Studio marks the paragraph that needs the fix.
 */
const checkBody: CustomValidator<unknown[] | undefined> = (value) => {
  if (!Array.isArray(value)) return true;
  const found: ValidationError[] = [];
  for (const block of value) {
    if (!isObj(block) || typeof block._key !== "string") continue;
    const at: Path = [{ _key: block._key }];
    if (block._type === "block" && Array.isArray(block.children)) {
      const text = block.children.map((c) => (isObj(c) && typeof c.text === "string" ? c.text : "")).join("");
      const heading = typeof block.style === "string" && /^h[1-6]$/.test(block.style);
      found.push(...warnings([...lintCopy(text), ...(heading ? lintHeading(text) : [])], at));
    } else if (block._type === "image") {
      for (const f of ["alt", "caption"]) {
        const text = block[f];
        if (typeof text === "string") found.push(...warnings(lintCopy(text), [...at, f]));
      }
    } else if (block._type === "table" && Array.isArray(block.rows)) {
      for (const row of block.rows) {
        if (!isObj(row) || typeof row._key !== "string" || !Array.isArray(row.cells)) continue;
        const rowKey = row._key;
        row.cells.forEach((cell, n) => {
          if (typeof cell === "string") found.push(...warnings(lintCopy(cell), [...at, "rows", { _key: rowKey }, "cells", n]));
        });
      }
    }
  }
  return found.length ? found : true;
};

/** House style warnings for a string or text field of prose. */
export const copyStyle = (rule: StringRule) => rule.custom(checkCopy).warning();

/** House style warnings for a heading, title, eyebrow or button label: the prose rules plus sentence case. */
export const headingStyle = (rule: StringRule) => rule.custom(checkHeading).warning();

/** House style warnings for a portable text body. */
export const bodyStyle = (rule: ArrayRule<unknown[]>) => rule.custom(checkBody).warning();

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
    description: "Use the hotspot tool (crosshair icon) to mark the focal point, so the right area is visible on all screen sizes.",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alt text",
        description: "Describe the image for screen readers and SEO (e.g. 'Stamped asphalt crosswalk in Vancouver'). Required for AODA compliance.",
        validation: required
          ? (r) => [r.required().error("Alt text is required for accessibility (AODA compliance)"), copyStyle(r)]
          : (r) => [r.warning("All images should have alt text for accessibility"), copyStyle(r)],
      }),
      defineField({
        name: "caption",
        type: "string",
        title: "Caption (optional)",
        description: "Short caption shown below the image in some contexts.",
        validation: (r) => copyStyle(r),
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
      validation: (Rule) => [Rule.required().error("Every photo needs alt text before it can be published (AODA)"), copyStyle(Rule)],
    }),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
      description: "Shown under the photo when a visitor opens it full screen. Leave blank to show the alt text there instead.",
      validation: (Rule) => copyStyle(Rule),
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
