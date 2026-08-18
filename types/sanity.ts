/**
 * TypeScript types for Sanity document shapes.
 * Matches schemas in sanity/schemas/*.ts exactly.
 */

// ── Portable Text block ─────────────────────────────────────────────────────
export interface SanityBlock {
  _type: "block";
  _key: string;
  style?: string;
  children: Array<{
    _type: "span";
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{ _type: string; _key: string; [key: string]: unknown }>;
}

// ── Image reference ─────────────────────────────────────────────────────────
export interface SanityImageRef {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// ── Slug ────────────────────────────────────────────────────────────────────
export interface SanitySlug {
  _type: "slug";
  current: string;
}

// ── Document reference ──────────────────────────────────────────────────────
export interface SanityRef {
  _type: "reference";
  _ref: string;
  _key?: string;
}

// ── siteSettings ────────────────────────────────────────────────────────────
export interface SanitySiteSettings {
  _id: "siteSettings";
  _type: "siteSettings";
  offices: {
    east: { phone: string; email: string; name: string };
    west: { phone: string; email: string; name: string };
  };
  social: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    facebook?: string;
    x?: string;
  };
  footerTagline?: string;
  foundedYear?: number;
}

// ── product ─────────────────────────────────────────────────────────────────
export interface SanityProduct {
  _id: string;
  _type: "product";
  name: string;
  slug: SanitySlug;
  eyebrow?: string;
  shortDesc?: string;
  description?: SanityBlock[];
  homepageBlurb?: string;
  heroImage?: SanityImageRef;
  heroPosition?: string;
  gallery?: SanityImageRef[];
  specs?: Array<{ label: string; value: string }>;
  relatedApplications?: SanityRef[];
  seo?: { title?: string; description?: string };
  // External URL fields used during migration (before CDN upload)
  heroImageUrl?: string;
  galleryUrls?: string[];
  relatedApplicationSlugs?: string[];
}

// ── application ─────────────────────────────────────────────────────────────
export interface SanityApplication {
  _id: string;
  _type: "application";
  name: string;
  slug: SanitySlug;
  shortDesc?: string;
  description?: SanityBlock[];
  heroImage?: SanityImageRef;
  gallery?: SanityImageRef[];
  relatedProducts?: SanityRef[];
  seo?: { title?: string; description?: string };
  // External URL fields used during migration
  heroImageUrl?: string;
  galleryUrls?: string[];
  relatedProductSlugs?: string[];
}

// ── blogPost ────────────────────────────────────────────────────────────────
export interface SanityBlogPost {
  _id: string;
  _type: "blogPost";
  title: string;
  slug: SanitySlug;
  publishedAt: string; // ISO datetime
  excerpt?: string;
  readTime?: string;
  featuredImage?: SanityImageRef;
  body?: SanityBlock[];
  tags?: string[];
  relatedProducts?: SanityRef[];
  seo?: { metaTitle?: string; metaDescription?: string };
  // External URL fields used during migration
  featuredImageUrl?: string;
}

// ── project (map pin) ───────────────────────────────────────────────────────
export interface SanityProject {
  _id: string;
  _type: "project";
  title: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  year?: string;
  product?: SanityRef;
  application?: string;
  image?: SanityImageRef;
  excerpt?: string;
  problem?: string;
  solution?: string;
  // External URL fields used during migration
  imageUrl?: string;
}
