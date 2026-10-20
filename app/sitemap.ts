import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/sitemap";
import { getMergedProducts } from "@/lib/products.server";
import { getMergedApplications } from "@/lib/applications.server";
import { getAllPosts } from "@/lib/blog";
import { getSanityPageContent } from "@/lib/sanity.queries";
import { toPhoto } from "@/lib/photos";

/**
 * Galleries and heroes come from Sanity where it has them (lib/photos.ts), and
 * so do the blog posts (lib/blog.ts) and the homepage hero (page-homepage), so
 * the sitemap lists the pages and photos the site actually shows.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, applications, posts, homepage] = await Promise.all([
    getMergedProducts(),
    getMergedApplications(),
    getAllPosts(),
    getSanityPageContent("homepage"),
  ]);
  return buildSitemap(
    {
      products: new Map(products.map((p) => [p.slug, p])),
      applications: new Map(applications.map((a) => [a.slug, a])),
      // The photo the homepage hero shows (app/page.tsx reads the same field).
      homeHero: toPhoto(homepage?.homepageHeroImage, ""),
    },
    posts
  );
}
