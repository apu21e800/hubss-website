/**
 * Server-only merge layer for product content.
 *
 * Reads from Sanity (via lib/sanity.queries) and falls back to the static
 * lib/products.ts baseline per field. The returned shape matches the
 * existing Product interface plus an optional `homepageBlurb` from Sanity
 * (with PRODUCT_WHAT in components/sections/ProductsGrid.tsx as fallback).
 *
 * Fields merged from Sanity (when present): name, eyebrow, shortDesc,
 * description, specs, seoTitle, seoDescription, homepageBlurb. Images,
 * gallery, related applications, brand logo, and other UI metadata keep
 * coming from the static lib in phase 2.
 */
import { products, type Product } from "@/lib/products";
import { blocksToPlainText } from "@/lib/portable-text";
import {
  getAllSanityProducts,
  getProductBySlug,
} from "@/lib/sanity.queries";
import type { SanityProduct } from "@/types/sanity";

// GROQ projection aliases slug.current to a string; runtime shape differs from
// the typed Sanity document shape on this field.
type SanityProductProjected = Omit<SanityProduct, "slug"> & { slug: string };

export type MergedProduct = Product & { homepageBlurb?: string };

function merge(libProduct: Product, sanity: SanityProductProjected | null | undefined): MergedProduct {
  if (!sanity) return libProduct;
  const sanityDescription = blocksToPlainText(sanity.description);
  const sanitySpecs = sanity.specs?.length ? sanity.specs : undefined;
  return {
    ...libProduct,
    name: sanity.name?.trim() || libProduct.name,
    eyebrow: sanity.eyebrow?.trim() || libProduct.eyebrow,
    shortDesc: sanity.shortDesc?.trim() || libProduct.shortDesc,
    description: sanityDescription || libProduct.description,
    specs: sanitySpecs ?? libProduct.specs,
    seoTitle: sanity.seo?.title || libProduct.seoTitle,
    seoDescription: sanity.seo?.description || libProduct.seoDescription,
    homepageBlurb: sanity.homepageBlurb?.trim() || undefined,
  };
}

/** Fetch one product, merging Sanity values over the lib baseline. */
export async function getMergedProduct(slug: string): Promise<MergedProduct | undefined> {
  const libProduct = products.find((p) => p.slug === slug);
  if (!libProduct) return undefined;
  const sanity = (await getProductBySlug(slug).catch(() => null)) as SanityProductProjected | null;
  return merge(libProduct, sanity);
}

/** Fetch all products, merging Sanity values over the lib baseline. */
export async function getMergedProducts(): Promise<MergedProduct[]> {
  const sanityList = (await getAllSanityProducts().catch(() => [])) as SanityProductProjected[];
  const bySlug = new Map<string, SanityProductProjected>(sanityList.map((s) => [s.slug, s]));
  return products.map((libProduct) => merge(libProduct, bySlug.get(libProduct.slug)));
}
