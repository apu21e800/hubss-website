/**
 * Draft preview for Studio's "Edit on the page" view (Sanity's Presentation
 * tool, configured in sanity.config.ts).
 *
 * How it works, in one pass:
 *  1. In Studio, Doug opens "Edit on the page". Studio loads hubss.com in a
 *     frame through /api/draft-mode/enable, which checks a one-time secret that
 *     only a signed-in Studio user can create, and turns on Next's draft mode
 *     for that browser (a cookie). Nobody else ever sees draft mode.
 *  2. With draft mode on, every Sanity read (lib/sanity.queries.ts,
 *     sanityFetch) comes here instead: unpublished edits included, and every
 *     text Studio can edit carries invisible markers (Sanity's "stega"
 *     encoding) that tell the overlay which field it came from.
 *  3. app/layout.tsx renders <VisualEditing />, which draws the outlines Doug
 *     clicks to open a field, and refreshes the page as he types.
 *  4. Publish works as it always has: the webhook expires the cache and the
 *     live site changes in about five seconds.
 *
 * Next never caches a draft-mode read (unstable_cache skips both reading and
 * writing while draft mode is on), so a draft can't leak to visitors.
 *
 * Stega only goes on fields that are shown as visible text (STEGA_FIELDS).
 * Never on slugs, links, phone numbers, emails, alt text or anything the code
 * compares or puts in an attribute: the markers would break a tel: link or a
 * lookup. Add a field name here when it becomes editable text on the page.
 *
 * The token: a Viewer token in SANITY_API_READ_TOKEN when there is one, else
 * the drafter's Editor token (SANITY_API_WRITE_TOKEN). Either way it stays on
 * the server; it is used to read drafts and to check the preview secret.
 */

import { draftMode } from "next/headers";
import { createClient, type QueryParams, type SanityClient } from "@sanity/client";
import { createDataAttribute } from "next-sanity";
import { projectId, dataset } from "@/lib/sanity.client";

/** Where Studio lives on this site. */
export const STUDIO_URL = "/studio";

/** The "drafts" perspective needs an API version from 2025-02-19 on. */
const PREVIEW_API_VERSION = "2025-02-19";

/**
 * The fields whose text Doug can click on the page. Matched against the last
 * named segment of a value's path in its document, so "text" covers the words
 * of every rich-text field (product and application descriptions, post
 * bodies) and "heading" covers every heading field.
 */
export const STEGA_FIELDS: ReadonlySet<string> = new Set([
  // products and applications
  "name", "eyebrow", "shortDesc", "homepageBlurb", "value", "caption",
  // rich text (descriptions, About story, post bodies): each span's words
  "text",
  // pages: heroes, sections, questions
  "heading", "subheading", "tagline", "cta1Label", "cta2Label", "intro",
  "headingAccent", "aboutStory", "aboutPartnersIntro", "title", "desc",
  "q", "a", "faqHeading", "faqEyebrow", "label", "body",
  // Insights
  "excerpt",
  // Site Settings: names and places only (phones and emails go in links)
  "place", "footerTagline",
]);

/** The token preview reads with: Viewer if set, else the Editor token. */
export function previewToken(): string | undefined {
  return process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || undefined;
}

let cached: SanityClient | null = null;

/** The draft-reading client, with stega markers on STEGA_FIELDS. */
export function previewClient(): SanityClient {
  if (cached) return cached;
  cached = createClient({
    projectId,
    dataset,
    apiVersion: PREVIEW_API_VERSION,
    useCdn: false,
    perspective: "drafts",
    token: previewToken(),
    stega: {
      enabled: true,
      studioUrl: STUDIO_URL,
      filter: (props) => {
        const segments = props.sourcePath;
        let key: string | undefined;
        for (let i = segments.length - 1; i >= 0; i--) {
          const s = segments[i];
          if (typeof s === "string") { key = s; break; }
        }
        if (!key || !STEGA_FIELDS.has(key)) return false;
        return props.filterDefault(props);
      },
    },
  });
  return cached;
}

/**
 * True when this request is a Studio preview. False during a build, an ISR
 * refresh, a script, or anything else without a request.
 */
export async function isPreview(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

/** A draft-mode read. Throws on failure; sanityFetch falls back to published. */
export async function previewFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  return previewClient().fetch<T>(query, params);
}

/**
 * The data-sanity attribute that makes a photo (or anything that isn't text)
 * clickable in "Edit on the page": it names the document and the field.
 * Pages only add it while previewing, so the live site's HTML doesn't change.
 * `path` is the field's path in the document, e.g. "heroImage" or
 * "homepageHero.heroImage1".
 */
export function editAttr(doc: { id?: string | null; type?: string | null } | null | undefined, path: string): string | undefined {
  if (!doc?.id || !doc.type) return undefined;
  const id = doc.id.replace(/^drafts\./, "");
  return createDataAttribute({ projectId, dataset, baseUrl: STUDIO_URL, id, type: doc.type, path }).toString();
}
