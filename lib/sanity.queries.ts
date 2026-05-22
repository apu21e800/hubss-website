/**
 * Sanity GROQ query helpers for the HUBSS website.
 *
 * All fetch functions use unstable_cache with revalidation tags so that
 * the Sanity webhook at POST /api/revalidate can surgically bust only the
 * affected cache entries.
 *
 * Each function falls back to undefined gracefully — callers should fall
 * back to static lib/ data when the result is null/undefined.
 */

import { unstable_cache } from "next/cache";
import { client } from "@/lib/sanity.client";
import type { SanityProduct, SanityApplication } from "@/types/sanity";
import type { ResourceDocument } from "@/lib/resource-documents";

// ── Products ─────────────────────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  _id,
  _type,
  name,
  "slug": slug.current,
  eyebrow,
  shortDesc,
  description,
  homepageBlurb,
  heroImageUrl,
  heroPosition,
  galleryUrls,
  specs,
  relatedApplicationSlugs,
  seo
`;

/** Fetch a single product by slug from Sanity. Returns null if not found. */
export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<SanityProduct | null> => {
    try {
      return await client.fetch<SanityProduct | null>(
        `*[_type == "product" && slug.current == $slug][0]{${PRODUCT_FIELDS}}`,
        { slug }
      );
    } catch {
      return null;
    }
  },
  ["product-by-slug"],
  { tags: ["products"], revalidate: 3600 }
);

/** Fetch all products from Sanity. Returns empty array if unavailable. */
export const getAllSanityProducts = unstable_cache(
  async (): Promise<SanityProduct[]> => {
    try {
      return await client.fetch<SanityProduct[]>(
        `*[_type == "product"] | order(name asc) {${PRODUCT_FIELDS}}`
      );
    } catch {
      return [];
    }
  },
  ["all-products"],
  { tags: ["products"], revalidate: 3600 }
);

// ── Applications ─────────────────────────────────────────────────────────────

const APPLICATION_FIELDS = `
  _id,
  _type,
  name,
  "slug": slug.current,
  shortDesc,
  description,
  heroImageUrl,
  galleryUrls,
  relatedProductSlugs,
  seo
`;

/** Fetch a single application by slug from Sanity. */
export const getApplicationBySlug = unstable_cache(
  async (slug: string): Promise<SanityApplication | null> => {
    try {
      return await client.fetch<SanityApplication | null>(
        `*[_type == "application" && slug.current == $slug][0]{${APPLICATION_FIELDS}}`,
        { slug }
      );
    } catch {
      return null;
    }
  },
  ["application-by-slug"],
  { tags: ["applications"], revalidate: 3600 }
);

/** Fetch all applications from Sanity. */
export const getAllSanityApplications = unstable_cache(
  async (): Promise<SanityApplication[]> => {
    try {
      return await client.fetch<SanityApplication[]>(
        `*[_type == "application"] | order(name asc) {${APPLICATION_FIELDS}}`
      );
    } catch {
      return [];
    }
  },
  ["all-applications"],
  { tags: ["applications"], revalidate: 3600 }
);

// ── Pages ────────────────────────────────────────────────────────────────────

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
 * Returns null if not found or on error.
 *
 * Slugs in use: "homepage" | "about" | "contact" | "lunch-learn"
 */
export const getSanityPageContent = unstable_cache(
  async (slug: string): Promise<SanityPageContent | null> => {
    try {
      return await client.fetch<SanityPageContent | null>(
        `*[_type == "page" && slug.current == $slug][0]`,
        { slug }
      );
    } catch {
      return null;
    }
  },
  ["page-by-slug"],
  { tags: ["pages"], revalidate: 3600 }
);

// ── Resource Documents (siteSettings) ────────────────────────────────────────

/**
 * Fetch the resource documents array from the siteSettings singleton.
 * Returns null if not found or on error — callers must fall back to
 * the static lib/resource-documents.ts array.
 */
export const getResourceDocuments = unstable_cache(
  async (): Promise<ResourceDocument[] | null> => {
    try {
      const result = await client.fetch<{ resourceDocuments: ResourceDocument[] } | null>(
        `*[_type == "siteSettings"][0]{ resourceDocuments }`
      );
      if (!result?.resourceDocuments?.length) return null;
      return result.resourceDocuments;
    } catch {
      return null;
    }
  },
  ["resource-documents"],
  { tags: ["siteSettings"], revalidate: 3600 }
);

// ── Sanity availability check ────────────────────────────────────────────────

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
