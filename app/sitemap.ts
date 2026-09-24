import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/sitemap";
import { getMergedProducts } from "@/lib/products.server";
import { getMergedApplications } from "@/lib/applications.server";
import { getAllPosts } from "@/lib/blog";

/**
 * Galleries and heroes come from Sanity where it has them (lib/photos.ts), and
 * so do the blog posts (lib/blog.ts), so the sitemap lists the pages and
 * photos the site actually shows.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, applications, posts] = await Promise.all([getMergedProducts(), getMergedApplications(), getAllPosts()]);
  return buildSitemap(
    {
      products: new Map(products.map((p) => [p.slug, p])),
      applications: new Map(applications.map((a) => [a.slug, a])),
    },
    posts
  );
}
