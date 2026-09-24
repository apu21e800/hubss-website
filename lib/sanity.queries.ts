/**
 * Sanity GROQ query helpers for the HUBSS website.
 *
 * All fetch functions use unstable_cache with revalidation tags so that
 * the Sanity webhook at POST /api/revalidate can surgically bust only the
 * affected cache entries.
 *
 * "Not found" and "failed" are different answers. A query that matches nothing
 * returns null (or []), and the caller falls back to the code field by field.
 * A request that fails THROWS, through sanityFetch below; it is never turned
 * into null. Until Sep 2026 every failure became null, so a Sanity outage looked
 * exactly like an empty dataset: every page quietly served code fallbacks and
 * nothing logged a line.
 */

import { unstable_cache } from "next/cache";
import { client } from "@/lib/sanity.client";
import type { SanityProduct, SanityApplication } from "@/types/sanity";
import type { ResourceDocument } from "@/lib/resource-documents";

/**
 * Every Sanity read goes through here. On failure it logs and throws:
 *  - during `next build` the build fails, and Vercel keeps serving the last
 *    good deployment instead of shipping pages with the CMS copy missing;
 *  - during an ISR refresh the error is logged and Next keeps serving the last
 *    good page;
 *  - unstable_cache never stores a failure, so the next request tries again.
 */
async function sanityFetch<T>(label: string, query: string, params: Record<string, unknown> = {}): Promise<T> {
  try {
    return await client.fetch<T>(query, params);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`[sanity] ${label} failed: ${reason}`);
    throw new Error(`Sanity query "${label}" failed: ${reason}`, { cause: err });
  }
}

// Every cache key below carries this version. Vercel's Data Cache outlives
// deploys, so changing it makes every entry refetch from Sanity on the next
// deploy. It was bumped on 24 Sep 2026 while chasing a stale /products/mmax
// subtitle; the real cause was a Studio draft (see lib/sanity.client.ts).
const CACHE_VERSION = "2026-09-24";

// ── Products ──────────────────────────────────────────────────────────

// Only fields the dataset really has. heroImageUrl (nulled on every doc by
// scripts/sanity-strip-legacy-fields.mjs), galleryUrls (never a schema field)
// and relatedApplicationSlugs (unset by the same script) were dropped in Sep
// 2026: nothing read them, and `npm run verify` failed on them. The images live
// in heroImage and gallery, which nothing queries yet.
const PRODUCT_FIELDS = `
  _id,
  _type,
  name,
  "slug": slug.current,
  eyebrow,
  shortDesc,
  description,
  homepageBlurb,
  heroPosition,
  specs,
  seo
`;

/** Fetch a single product by slug from Sanity. Returns null if not found. */
export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<SanityProduct | null> =>
    sanityFetch<SanityProduct | null>(
      `product ${slug}`,
      `*[_type == "product" && slug.current == $slug][0]{${PRODUCT_FIELDS}}`,
      { slug }
    ),
  [`product-by-slug:${CACHE_VERSION}`],
  { tags: ["products"], revalidate: 3600 }
);

/** Fetch all products from Sanity. Returns empty array if unavailable. */
export const getAllSanityProducts = unstable_cache(
  async (): Promise<SanityProduct[]> =>
    sanityFetch<SanityProduct[]>(
      "all products",
      `*[_type == "product"] | order(name asc) {${PRODUCT_FIELDS}}`
    ),
  [`all-products:${CACHE_VERSION}`],
  { tags: ["products"], revalidate: 3600 }
);

// ── Applications ──────────────────────────────────────────────────────

// Same clean-up as PRODUCT_FIELDS: heroImageUrl, galleryUrls and
// relatedProductSlugs are gone from the dataset.
const APPLICATION_FIELDS = `
  _id,
  _type,
  name,
  "slug": slug.current,
  shortDesc,
  description,
  seo
`;

/** Fetch a single application by slug from Sanity. */
export const getApplicationBySlug = unstable_cache(
  async (slug: string): Promise<SanityApplication | null> =>
    sanityFetch<SanityApplication | null>(
      `application ${slug}`,
      `*[_type == "application" && slug.current == $slug][0]{${APPLICATION_FIELDS}}`,
      { slug }
    ),
  [`application-by-slug:${CACHE_VERSION}`],
  { tags: ["applications"], revalidate: 3600 }
);

/** Fetch all applications from Sanity. */
export const getAllSanityApplications = unstable_cache(
  async (): Promise<SanityApplication[]> =>
    sanityFetch<SanityApplication[]>(
      "all applications",
      `*[_type == "application"] | order(name asc) {${APPLICATION_FIELDS}}`
    ),
  [`all-applications:${CACHE_VERSION}`],
  { tags: ["applications"], revalidate: 3600 }
);

// ── Pages ───────────────────────────────────────────────────────────

export interface SanityPageContent {
  _id: string;
  _type: "page";
  title: string;
  slug: { current: string };
  // Homepage
  homepageHero?: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    tagline?: string;
    cta1Label?: string;
    cta1Href?: string;
    cta2Label?: string;
    cta2Href?: string;
  };
  // About
  aboutHero?: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
  };
  aboutMission?: string;
  aboutStory?: string[];
  aboutStoryAside?: string;
  aboutValues?: Array<{ heading: string; body: string }>;
  aboutWhyHub?: Array<{ title: string; desc: string }>;
  aboutPartnersIntro?: string;
  aboutPartners?: Array<{ key: string; desc: string }>;
  // Contact
  contactHero?: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
  };
  // Lunch & Learn
  lunchLearnHero?: {
    eyebrow?: string;
    headingLine1?: string;
    headingLine2?: string;
    subheading?: string;
    ctaLabel?: string;
    formHeading?: string;
    formSubheading?: string;
    submitLabel?: string;
  };
  lunchLearnWhatYouGet?: Array<{ num: string; title: string; desc: string }>;
  lunchLearnPersonas?: Array<{ title: string; desc: string; badge: string }>;
  lunchLearnFaqs?: Array<{ q: string; a: string }>;
  lunchLearnSectionHeadings?: {
    whatYouGetEyebrow?: string;
    whatYouGetHeading?: string;
    personasEyebrow?: string;
    personasHeading?: string;
    faqEyebrow?: string;
    faqHeading?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

/**
 * Fetch a single page document by slug from Sanity.
 * Returns null if not found; throws if Sanity fails.
 *
 * Slugs in use: "homepage" | "about" | "contact" | "lunch-learn"
 */
export const getSanityPageContent = unstable_cache(
  async (slug: string): Promise<SanityPageContent | null> =>
    sanityFetch<SanityPageContent | null>(
      `page ${slug}`,
      `*[_type == "page" && slug.current == $slug][0]`,
      { slug }
    ),
  [`page-by-slug:${CACHE_VERSION}`],
  { tags: ["pages"], revalidate: 3600 }
);

// ── Resource Documents (siteSettings) ───────────────────────────────────

/**
 * Fetch the resource documents array from the siteSettings singleton.
 * Returns null if there are none — callers fall back to the static
 * lib/resource-documents.ts array. Throws if Sanity fails.
 */
export const getResourceDocuments = unstable_cache(
  async (): Promise<ResourceDocument[] | null> => {
    // The Studio schema calls this field `docType`; the app's ResourceDocument
    // calls it `type`. Projecting it across here is the whole fix for the
    // /resources search crashing: every one of the 67 Sanity documents was
    // arriving with `type: undefined`, and the client filter calls
    // `doc.type.toLowerCase()` — so the first keystroke threw a TypeError and
    // the error boundary swallowed the page. `applications` is likewise
    // required by the interface but absent in Studio, so it defaults to [].
    const result = await sanityFetch<{ resourceDocuments: ResourceDocument[] } | null>(
      "resource documents",
      `*[_type == "siteSettings"][0]{
         "resourceDocuments": resourceDocuments[]{
           ...,
           "type": coalesce(docType, type, "Other"),
           "applications": coalesce(applications, [])
         }
       }`
    );
    if (!result?.resourceDocuments?.length) return null;
    // Belt and braces: a document added in Studio tomorrow with the field left
    // blank must not be able to take the page down again.
    return result.resourceDocuments.map((d) => ({
      ...d,
      type: typeof d.type === "string" && d.type ? d.type : "Other",
      title: typeof d.title === "string" ? d.title : "",
      productName: typeof d.productName === "string" ? d.productName : "",
      applications: Array.isArray(d.applications) ? d.applications : [],
    }));
  },
  ["resource-documents"],
  { tags: ["siteSettings"], revalidate: 3600 }
);

// ── Sanity availability check ─────────────────────────────────────────

/**
 * Returns true if the Sanity project ID env var is set.
 * Use this as a gate before making Sanity fetches in pages.
 */
export function isSanityConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    // Default project ID is always configured
    true
  );
}
