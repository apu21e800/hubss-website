/**
 * The sitemap's contents. app/sitemap.ts serves it; scripts/gen-search-images.ts
 * reads it (with no Sanity data) to know which /public photos to bake.
 */
import type { MetadataRoute } from "next";
import { catalogueReady, ideaBook } from "@/lib/catalogue";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { projects } from "@/lib/projects";
import type { PostMeta } from "@/lib/blog";
import { FIELD_NOTE_TYPES } from "@/lib/field-notes-taxonomy";
import { productImages, applicationImages, resolveImage } from "@/lib/featured-images";
import { galleryFor } from "@/lib/asset-scan";
import { sitemapImages } from "@/lib/image-seo";
import { withSearchImages } from "@/lib/search-images";
import type { MergedProduct } from "@/lib/products.server";
import type { MergedApplication } from "@/lib/applications.server";
import { isSanityImage, sanitySearchImage, type Photo } from "@/lib/photos";

const BASE_URL = "https://hubss.com";

const abs = (p: string) => (p.startsWith("http") ? p : `${BASE_URL}${p.startsWith("/") ? "" : "/"}${p}`);

type PhotoSources = {
  products: Map<string, Pick<MergedProduct, "heroPhoto" | "galleryPhotos">>;
  applications: Map<string, Pick<MergedApplication, "heroPhoto" | "galleryPhotos">>;
};

/** Sanity photos go to Google as 1200px WebP (lib/photos.ts); /public paths as they are. */
const photoUrl = (src: string) => (isSanityImage(src) ? sanitySearchImage(src) : src);

/**
 * The sitemap, from whatever photo data it is given. Galleries and heroes come
 * from Sanity where it has them (lib/photos.ts), so the route below passes the
 * merged products and applications and the image sitemap lists the photos each
 * page actually shows, and the blog posts, which live in Sanity (lib/blog.ts).
 * scripts/gen-search-images.ts calls this with no Sanity data: it only bakes
 * /public photos, and it runs outside Next, where the cached Sanity queries
 * can't.
 */
export function buildSitemap(photos?: PhotoSources, posts: PostMeta[] = []): MetadataRoute.Sitemap {
  const productPhotos = photos?.products ?? new Map();
  const applicationPhotos = photos?.applications ?? new Map();

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
    // Field Notes type hubs (Aug 2026) — each is an indexable collection page
    // carrying its own CollectionPage/ItemList schema, so they belong in the
    // sitemap alongside /blog rather than being discovered only by crawl.
    ...FIELD_NOTE_TYPES.map((t) => ({
      url: `${BASE_URL}/blog/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // The reader gets one entry, not 144. Every page route exists and is
    // prerendered, but they are 144 near-identical images of one book and
    // listing them all would drown the rest of the sitemap in them.
    ...(catalogueReady
      ? [
          { url: `${BASE_URL}${ideaBook.href}`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.7 },
          // The book's words on one page, for search engines and screen readers.
          { url: `${BASE_URL}${ideaBook.href}/contents`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.5 },
        ]
      : []),
    { url: `${BASE_URL}${ideaBook.requestHref}`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
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
      // Every photo in the product's folder, not the first three.
      //
      // This is the only route by which most of the library reaches Google
      // Images. The galleries render seven tiles and load the rest behind a
      // button, and a crawler never presses the button — so for a folder like
      // /images/products/traffic-patterns-xd (138 photos) the sitemap was
      // offering four and hiding 134. Google accepts up to 1,000 image entries
      // per URL; the largest folder here is 141.
      const merged = productPhotos.get(p.slug);
      const heroSrc = photoUrl(merged?.heroPhoto?.src ?? featured);
      const galleryImgs = sitemapImages(
        merged?.galleryPhotos?.map((g: Photo) => photoUrl(g.src)) ?? galleryFor(featured, p.gallery, `images/products/${p.slug}`)
      );
      const images = [abs(heroSrc), ...galleryImgs].filter((v, i, a) => a.indexOf(v) === i);
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
    // Full folder, same reasoning as productRoutes above.
    const merged = applicationPhotos.get(a.slug);
    const heroSrc = photoUrl(merged?.heroPhoto?.src ?? featured);
    const galleryImgs = sitemapImages(
      merged?.galleryPhotos?.map((g: Photo) => photoUrl(g.src)) ?? galleryFor(featured, a.gallery, `images/applications/${a.slug}`)
    );
    const images = [abs(heroSrc), ...galleryImgs].filter((v, i, arr) => arr.indexOf(v) === i);
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

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: p.featuredImage ? [abs(photoUrl(p.featuredImage))] : undefined,
  }));

  // Every image above is named by its original, and the originals are the
  // heaviest files on the site (median 1 MB). withSearchImages points Google
  // at the 1200px WebP copies the build baked instead — see
  // lib/search-images.ts. scripts/gen-search-images.ts calls this function to
  // learn what to bake, so this list is the only list.
  return withSearchImages([
    ...staticRoutes,
    ...productRoutes,
    ...applicationRoutes,
    ...projectRoutes,
    ...blogRoutes,
  ]);
}
