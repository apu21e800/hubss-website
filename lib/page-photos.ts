/**
 * Which photographs a page shows, and the address each one has on it: one
 * answer for the page and for the image sitemap (lib/sitemap.ts).
 *
 * Until 20 Oct 2026 the sitemap worked the photos out on its own and named
 * each by a copy no page renders (1200px WebP, `fm=webp`), so none of its
 * 1,478 Sanity entries was an image Google found on the page it was listed
 * for, and two pages listed a photo they don't show (ChipFill's 640px Studio
 * hero, which the page swaps for the code's photo, and AggreFill's, which it
 * draws as a panel). The client's SEO brief, 20 Oct 2026: the sitemap lists,
 * for each page, an image the page actually uses, with the same name and the
 * same transform. So the product, application and post pages pick their
 * photos here, and the sitemap reads the same picks and the same addresses
 * (lib/photos.ts: heroImageSrc, galleryImageSrc).
 *
 * Pure: no Sanity, no fs. scripts/gen-search-images.ts reaches it through
 * lib/sitemap.ts, outside Next.
 */
import { galleryFor, altFor } from "@/lib/asset-scan";
import { applicationImages, productImages, resolveImage } from "@/lib/featured-images";
import { honestPhoto, seoCaption } from "@/lib/image-seo";
import { heroImageSrc, isSanityImage, sanitySized, type Photo } from "@/lib/photos";
import type { Product } from "@/lib/products";
import type { Application } from "@/lib/applications";
import type { PostMeta } from "@/lib/blog";

/** The Sanity photos a merged product or application carries (lib/products.server.ts, lib/applications.server.ts). */
type StudioPhotos = { heroPhoto?: Photo; galleryPhotos?: Photo[] };

/**
 * Widths of the code's own hero photos that may stand in for a Studio hero
 * that is too small to fill the banner (productPagePhotos). Measured on
 * 17 Oct 2026; add a line when a bigger photo lands in /public.
 */
const CODE_HERO_WIDTHS: Record<string, number> = {
  "/images/products/chipfill/chipfill-application.jpg": 1200,
};

/**
 * A photo under 1000 px wide cannot fill a 1440 px banner (QA B1): the
 * product page draws a dark panel instead. Only a Studio photo carries its
 * width; a /public fallback is shown as before.
 */
export function heroTooSmall(photo: Pick<Photo, "width">): boolean {
  return typeof photo.width === "number" && photo.width < 1000;
}

/** The folder fallback, when Studio holds no gallery: the page's /public folder, less the banner photo. */
function folderGallery(bannerSrc: string, gallery: string[] | undefined, folder: string, name: string): Photo[] {
  const fromFolder = galleryFor(bannerSrc, gallery, folder);
  return (fromFolder.length > 0 ? fromFolder : [bannerSrc]).map((src) => ({
    src,
    alt: altFor(src, name),
    caption: seoCaption(src) ?? altFor(src, name),
  }));
}

/**
 * A product page's hero and gallery (app/products/[slug]/page.tsx).
 *
 * The hero photo and the gallery come from Sanity, where Doug curates them
 * (lib/photos.ts). A product whose Sanity document has none falls back to
 * exactly what the page showed before: the audited featured image, and the
 * product's /public folder scanned at build time (docs/IMAGE-WORKFLOW.md).
 *
 * The folder fallback excludes the photo the hero banner ACTUALLY shows,
 * featuredImg when one is configured, not product.imageUrl. Keying it on
 * imageUrl meant every product with a distinct featured image (seven of
 * eleven) repeated its banner photo inside "The work" while the imageUrl
 * photo, shown nowhere, was silently dropped from the gallery.
 *
 * honestPhoto (lib/image-seo.ts, 30 Sep 2026, QA E10): the photo sync wrote
 * the old templates' invented settings into Studio ("at a civic plaza",
 * "150 mil ..."), so the Sanity alt and caption are replaced at render by
 * what the photo's folder proves; a line a person wrote in Studio stays.
 * A Studio hero under 1000px wide is passed over for the code's photo when
 * the code has one at least that wide (17 Oct 2026, Vern: "make sure
 * images are clear and well positioned including all hero images"):
 * ChipFill's Studio hero is a 640px file, and chipfill-application.jpg
 * (1200px, the chips poured into the hole) is the photograph of what the
 * product is. With no large photo anywhere (AggreFill) the hatched panel
 * stays (`heroShown` false), which is honest until one is taken.
 */
export function productPagePhotos(
  product: Pick<Product, "slug" | "name" | "imageUrl" | "gallery"> & StudioPhotos,
): { hero: Photo; heroShown: boolean; gallery: Photo[] } {
  const featuredImg = productImages[product.slug] ? resolveImage(productImages[product.slug]) : null;
  const codeHero = { src: featuredImg?.src ?? product.imageUrl, alt: featuredImg?.alt ?? product.name };
  const studioHero = product.heroPhoto;
  const codeHeroWidth = CODE_HERO_WIDTHS[codeHero.src];
  const hero: Photo = honestPhoto(
    studioHero && !(heroTooSmall(studioHero) && codeHeroWidth && codeHeroWidth >= 1000) ? studioHero : codeHero,
  );
  const gallery: Photo[] =
    product.galleryPhotos?.map(honestPhoto) ??
    folderGallery(featuredImg?.src ?? product.imageUrl, product.gallery, `images/products/${product.slug}`, product.name);
  return { hero, heroShown: !heroTooSmall(hero), gallery };
}

/**
 * An application page's hero and gallery (app/applications/[slug]/page.tsx).
 *
 * Since 28 Sep 2026 the code's hero for an application is its entry in
 * applicationImages (lib/featured-images.ts), as a product's is in
 * productImages; imageUrl is only the last fallback. One photo per
 * application everywhere: the banner, the Sanity hero the photo sync writes
 * (scripts/lib/photo-plan.ts), the homepage card and the sitemap. honestPhoto
 * as on the product pages.
 */
export function applicationPagePhotos(
  application: Pick<Application, "slug" | "name" | "imageUrl" | "gallery"> & StudioPhotos,
): { hero: Photo; gallery: Photo[] } {
  const featured = applicationImages[application.slug] ? resolveImage(applicationImages[application.slug]) : null;
  const bannerSrc = featured?.src ?? application.imageUrl;
  const hero: Photo = honestPhoto(application.heroPhoto ?? { src: bannerSrc, alt: featured?.alt ?? application.name });
  const gallery: Photo[] =
    application.galleryPhotos?.map(honestPhoto) ??
    folderGallery(bannerSrc, application.gallery, `images/applications/${application.slug}`, application.name);
  return { hero, gallery };
}

/**
 * A featured photo narrower than this is not stretched across a post's hero
 * (QA rest#13): the White Rock Pier photo is 206 px wide and was blown up to
 * 1440, and seventeen more under 1200 px looked soft. Those get the inset
 * hero (app/blog/[slug]/page.tsx).
 */
export const FULL_BLEED_MIN_WIDTH = 1200;

type PostPhoto = Pick<PostMeta, "title" | "featuredImage" | "featuredImageAlt" | "featuredImageWidth" | "featuredImageHeight">;

/**
 * The hero photograph's alt: Studio's alt for the featured image when it says
 * something the title does not, else the title (QA D21, 30 Sep 2026: "the
 * hero img alt is the post title"). Checked against Sanity on 30 Sep 2026: 73
 * of 74 posts carry the title itself as the image's alt (the import copied it
 * across), so on those the two are the same string either way (73 of 77 on
 * 20 Oct 2026). A real description of the photo is typed into the featured
 * image's alt in Studio; nothing here invents one. It is also the words of
 * the photo's filename on the post's page and in the sitemap.
 */
export function postHeroAlt(post: Pick<PostMeta, "title" | "featuredImageAlt">): string {
  const alt = post.featuredImageAlt?.trim();
  const title = post.title.trim();
  return alt && alt.toLowerCase() !== title.toLowerCase() ? alt : title;
}

/** True when the post's photo is shown inset beside the title rather than full-bleed. */
export function postHeroInset(post: PostPhoto): boolean {
  const w = post.featuredImageWidth;
  return !!post.featuredImage && !!w && !!post.featuredImageHeight && w < FULL_BLEED_MIN_WIDTH;
}

/**
 * The post hero's <img src> as the page serves it: the inset photo at its own
 * width (at most 1040), else the full-bleed hero (components/ui/HeroPhoto.tsx),
 * both named by postHeroAlt. A /public photo is its own path.
 */
export function postHeroSrc(post: PostPhoto): string | undefined {
  const src = post.featuredImage;
  if (!src) return undefined;
  if (!isSanityImage(src)) return src;
  const alt = postHeroAlt(post);
  return postHeroInset(post)
    ? sanitySized(src, Math.min(post.featuredImageWidth!, 1040), 80, alt)
    : heroImageSrc({ src, alt });
}
