import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { projects } from "@/lib/projects";
import { getAllPosts } from "@/lib/mdx";
import { productImages, applicationImages, resolveImage } from "@/lib/featured-images";

const BASE_URL = "https://hubss.com";

const abs = (p: string) => (p.startsWith("http") ? p : `${BASE_URL}${p.startsWith("/") ? "" : "/"}${p}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      images: [abs("/images/hero/hero-1.jpg"), abs("/images/hero/hero-bg.jpg"), abs("/images/hero/hero-2.jpg"), abs("/images/hero/hero-3.jpg")],
    },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/applications`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    // /applications/public-art — sub-route not covered by the [slug] map below
    {
      url: `${BASE_URL}/applications/public-art`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: [
        abs("/images/blog/best-crosswalks-canada/featured.jpg"),
        abs("/images/blog/ubc-musqueam-crosswalk/featured.jpg"),
      ],
    },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/patterns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/lunch-learn`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => !p.comingSoon)
    .map((p) => {
      // Use the featured image from featured-images.ts (audited, correct) over the raw imageUrl
      const featured = productImages[p.slug] ? resolveImage(productImages[p.slug]).src : p.imageUrl;
      // Include first 3 gallery images so Google Image indexes installation photos
      const galleryImgs = (p.gallery ?? []).slice(0, 3).map(abs);
      const images = [abs(featured), ...galleryImgs].filter((v, i, a) => a.indexOf(v) === i);
      return {
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
        images,
      };
    });

  const applicationRoutes: MetadataRoute.Sitemap = applications.map((a) => {
    const featured = applicationImages[a.slug] ? resolveImage(applicationImages[a.slug]).src : a.imageUrl;
    // Include first 3 gallery images (parity with productRoutes above) so
    // Google Images indexes real installation photography per application.
    const galleryImgs = (a.gallery ?? []).slice(0, 3).map(abs);
    const images = [abs(featured), ...galleryImgs].filter((v, i, arr) => arr.indexOf(v) === i);
    return {
      url: `${BASE_URL}/applications/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images,
    };
  });

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: p.imageUrl ? [abs(p.imageUrl)] : undefined,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: p.featuredImage ? [abs(p.featuredImage)] : undefined,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...applicationRoutes,
    ...projectRoutes,
    ...blogRoutes,
  ];
}
