import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/sitemap";
import { getMergedProducts } from "@/lib/products.server";
import { getMergedApplications } from "@/lib/applications.server";

/**
 * Galleries and heroes come from Sanity where it has them (lib/photos.ts), so
 * the image sitemap lists the photos each page actually shows.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, applications] = await Promise.all([getMergedProducts(), getMergedApplications()]);
  return buildSitemap({
    products: new Map(products.map((p) => [p.slug, p])),
    applications: new Map(applications.map((a) => [a.slug, a])),
  });
}
