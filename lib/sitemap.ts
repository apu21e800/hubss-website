/**
 * The sitemap's contents. app/sitemap.ts serves it; scripts/gen-search-images.ts
 * reads it (with no Sanity data) to know which /public photos to bake.
 */
import type { MetadataRoute } from "next";
import { catalogueReady, ideaBook } from "@/lib/catalogue";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import type { PostMeta } from "@/lib/blog";
import { INSIGHTS_SECTIONS, isArchivedPost } from "@/lib/field-notes-taxonomy";
import { heroAlt, sitemapImages } from "@/lib/image-seo";
import { withSearchImages } from "@/lib/search-images";
import type { MergedProduct } from "@/lib/products.server";
import type { MergedApplication } from "@/lib/applications.server";
import { galleryImageSrc, heroImageSrc, homeHeroSrc, isSanityImage, type Photo } from "@/lib/photos";
import { sanityAssetFile } from "@/lib/sanity-image";
import { applicationPagePhotos, postHeroSrc, productPagePhotos } from "@/lib/page-photos";

const BASE_URL = "https://hubss.com";

const abs = (p: string) => (p.startsWith("http") ? p : `${BASE_URL}${p.startsWith("/") ? "" : "/"}${p}`);

type PhotoSources = {
  products: Map<string, Pick<MergedProduct, "heroPhoto" | "galleryPhotos">>;
  applications: Map<string, Pick<MergedApplication, "heroPhoto" | "galleryPhotos">>;
  /** The homepage hero as Studio holds it (page-homepage, homepageHeroImage). */
  homeHero?: Pick<Photo, "src" | "alt"> | null;
};

/**
 * Each photo a page shows, at the address the page shows it (20 Oct 2026, the
 * client's image-search brief): a Sanity photo by its descriptive filename and
 * the exact transform in the page's <img> (lib/page-photos.ts, lib/photos.ts),
 * so the entry Google reads is the image it finds on the page. Until then the
 * sitemap offered a 1200px WebP copy (fm=webp) that no page renders. A
 * /public photo is its path, which withSearchImages swaps for the copy the
 * build baked (lib/search-images.ts). One entry per photo: a photo that is
 * the hero and also in the gallery is listed once, at the hero's address.
 */
function onePerPhoto(urls: string[]): string[] {
  const seen = new Set<string>();
  return urls.filter((u) => {
    const key = sanityAssetFile(u) || u.split("?")[0];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** A gallery as the page serves it: every photo, the first ones as tiles and the rest in the crawlable fallback (GalleryGrid). */
function galleryUrls(gallery: Photo[]): string[] {
  return gallery.map((g, i) => (isSanityImage(g.src) ? galleryImageSrc(g.src, g.alt, i, gallery.length) : g.src));
}

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

  // The homepage shows one photograph in its hero (components/sections/HeroSlideshow.tsx):
  // Studio's, or /images/hero/hero-1.jpg when Studio has none. Until 20 Oct 2026
  // this entry named four /public files (hero-1, hero-bg, hero-2, hero-3) that
  // the page no longer shows.
  const homeHero = photos?.homeHero?.src ? photos.homeHero : null;
  const homeImages = homeHero
    ? [abs(homeHeroSrc(homeHero.src, homeHero.alt || heroAlt(homeHero.src)))]
    : [abs("/images/hero/hero-1.jpg")];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      images: homeImages,
    },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/applications`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    // /applications/public-art is in lib/applications.ts since round 3, so the
    // application routes below list it with its own photos. Its hand-made entry
    // here listed it twice (QA, 28 Sep 2026).
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/patterns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    // The Insights sections (Projects and Guides; three, with Articles, from
    // 28 Sep to 26 Oct 2026; the five type hubs before). Each is an indexable collection page
    // carrying its own CollectionPage/ItemList schema, so they belong in the
    // sitemap alongside /blog rather than being discovered only by crawl.
    // The old hub addresses redirect, so they are not listed.
    ...INSIGHTS_SECTIONS.map((s) => ({
      url: `${BASE_URL}/blog/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // The edition (every word of the book in HTML) and the printed reader's
    // first page: two entries, not 144. Every page route exists and is
    // prerendered, but they are 144 near-identical images of one book and
    // listing them all would drown the rest of the sitemap in them.
    ...(catalogueReady
      ? [
          { url: `${BASE_URL}${ideaBook.href}`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.7 },
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
      // Every photo in the product's gallery, not the first three.
      //
      // This is the only route by which most of the library reaches Google
      // Images. The galleries render seven tiles and load the rest behind a
      // button, and a crawler never presses the button — so for a folder like
      // /images/products/traffic-patterns-xd (138 photos) the sitemap was
      // offering four and hiding 134. Google accepts up to 1,000 image entries
      // per URL; the largest folder here is 141.
      //
      // The hero and the gallery the page itself picks (lib/page-photos.ts),
      // from the merged product the route passes (Studio over the code, as the
      // page gets it), so a hero the page swaps (ChipFill) or draws as a panel
      // (AggreFill) is not offered.
      const { hero, heroShown, gallery } = productPagePhotos({ ...p, ...productPhotos.get(p.slug) });
      const heroUrls = heroShown ? [isSanityImage(hero.src) ? heroImageSrc(hero) : hero.src] : [];
      const images = onePerPhoto([...heroUrls.map(abs), ...sitemapImages(galleryUrls(gallery))]);
      return {
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
        images,
      };
    });

  const applicationRoutes: MetadataRoute.Sitemap = applications.map((a) => {
    // Full gallery, same reasoning as productRoutes above.
    const { hero, gallery } = applicationPagePhotos({ ...a, ...applicationPhotos.get(a.slug) });
    const heroUrl = isSanityImage(hero.src) ? heroImageSrc(hero) : hero.src;
    const images = onePerPhoto([abs(heroUrl), ...sitemapImages(galleryUrls(gallery))]);
    return {
      url: `${BASE_URL}/applications/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images,
    };
  });

  // No /projects/<slug> entries since 28 Sep 2026: those pages redirect to
  // their write-ups in Insights (next.config.ts), which are listed below, and
  // a sitemap that lists redirects fails scripts/verify-site.mjs (check 1).

  // lib/blog.ts already leaves archived posts out; this holds if a caller
  // passes a list from anywhere else. Each post lists its featured photo at
  // the address its hero shows it (inset or full-bleed, lib/page-photos.ts).
  const blogRoutes: MetadataRoute.Sitemap = posts.filter((p) => !isArchivedPost(p.slug)).map((p) => {
    const hero = postHeroSrc(p);
    return {
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: hero ? [abs(hero)] : undefined,
    };
  });

  // A /public photo above is named by its original, and the originals are the
  // heaviest files on the site (median 1 MB). withSearchImages points Google
  // at the 1200px WebP copies the build baked instead — see
  // lib/search-images.ts. scripts/gen-search-images.ts calls this function to
  // learn what to bake, so this list is the only list.
  return withSearchImages([
    ...staticRoutes,
    ...productRoutes,
    ...applicationRoutes,
    ...blogRoutes,
  ]);
}
