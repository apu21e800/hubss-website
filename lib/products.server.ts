/**
 * Server-only merge layer for product content, and the only one.
 *
 * Used by the homepage grid (getMergedProducts) and by every product page,
 * /products/[slug] (getMergedProduct): page body, H1, spec table, JSON-LD and
 * <title>/<meta description> all read the merged product. The /products index
 * is code-only by design and does not come through here.
 *
 * Reads Sanity (via lib/sanity.queries) and falls back to the lib/products.ts
 * baseline field by field, with the rule in lib/cms-merge.ts: a blank Sanity
 * value falls back to the code.
 *
 * Fields that can come from Sanity: name, eyebrow, shortDesc, description,
 * specs, seoTitle, seoDescription, homepageBlurb (with PRODUCT_WHAT in
 * components/sections/ProductsGrid.tsx as the fallback). Images, gallery,
 * related applications, brand logo and the rest of the UI metadata come from
 * lib/products.ts only.
 */
import { products, type Product } from "@/lib/products";
import { blocksToPlainText } from "@/lib/portable-text";
import { cmsList, cmsText } from "@/lib/cms-merge";
import {
  getAllSanityProducts,
  getProductBySlug,
} from "@/lib/sanity.queries";
import type { SanityProduct } from "@/types/sanity";

// GROQ projection aliases slug.current to a string; runtime shape differs from
// the typed Sanity document shape on this field.
type SanityProductProjected = Omit<SanityProduct, "slug"> & { slug: string };

export type MergedProduct = Product & { homepageBlurb?: string };

function merge(code: Product, sanity: SanityProductProjected | null | undefined): MergedProduct {
  if (!sanity) return code;
  // A spec row counts only when both halves are filled in, so a half-typed row
  // in Studio cannot put a blank line in the spec table.
  const sanitySpecs = sanity.specs?.filter((s) => s?.label?.trim() && s?.value?.trim());
  return {
    ...code,
    name: cmsText(sanity.name, code.name),
    eyebrow: cmsText(sanity.eyebrow, code.eyebrow),
    shortDesc: cmsText(sanity.shortDesc, code.shortDesc),
    description: cmsText(blocksToPlainText(sanity.description), code.description),
    specs: cmsList(sanitySpecs, code.specs),
    seoTitle: cmsText(sanity.seo?.title, code.seoTitle),
    seoDescription: cmsText(sanity.seo?.description, code.seoDescription),
    homepageBlurb: cmsText(sanity.homepageBlurb, undefined),
  };
}

/** Fetch one product, merging Sanity values over the lib baseline. */
export async function getMergedProduct(slug: string): Promise<MergedProduct | undefined> {
  const code = products.find((p) => p.slug === slug);
  if (!code) return undefined;
  const sanity = (await getProductBySlug(slug).catch(() => null)) as SanityProductProjected | null;
  return merge(code, sanity);
}

/** Fetch all products, merging Sanity values over the lib baseline. */
export async function getMergedProducts(): Promise<MergedProduct[]> {
  const sanityList = (await getAllSanityProducts().catch(() => [])) as SanityProductProjected[];
  const bySlug = new Map<string, SanityProductProjected>(sanityList.map((s) => [s.slug, s]));
  return products.map((code) => merge(code, bySlug.get(code.slug)));
}
