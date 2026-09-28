/**
 * The photo plan: what each product, application and page shows today, with
 * the alt text and captions the site writes for it. One module, read by
 * scripts/sync-photos-to-sanity.ts (uploads and sets whole photos) and
 * scripts/plan-photo-text.ts (sets only the words on photos already there),
 * so the two can never disagree about what a caption should say.
 */
import { products } from "../../lib/products";
import { applications } from "../../lib/applications";
import { galleryFor, altFor } from "../../lib/asset-scan";
import { seoCaption, heroAlt } from "../../lib/image-seo";
import { productImages, applicationImages, resolveImage } from "../../lib/featured-images";

export interface PlannedPhoto { src: string; alt: string; caption?: string }
export interface Target {
  label: string;            // slug, or "homepage" / "about"
  docId: string;
  heroField: string;        // path of the hero image field in the document
  hero: PlannedPhoto;
  gallery: PlannedPhoto[] | null;  // null: this document has no gallery (pages)
}

export function planProducts(): Target[] {
  return products.filter((p) => !p.comingSoon).map((p) => {
    const featured = productImages[p.slug] ? resolveImage(productImages[p.slug]) : null;
    const bannerSrc = featured?.src ?? p.imageUrl;
    const fromFolder = galleryFor(bannerSrc, p.gallery, `images/products/${p.slug}`);
    return {
      label: p.slug,
      docId: `product-${p.slug}`,
      heroField: "heroImage",
      hero: { src: bannerSrc, alt: featured?.alt ?? `${p.name}: ${p.shortDesc}` },
      gallery: (fromFolder.length > 0 ? fromFolder : [bannerSrc]).map((src) => ({
        src,
        alt: altFor(src, `${p.name} decorative pavement by HUB Surface Systems`),
        caption: seoCaption(src) ?? altFor(src, p.name),
      })),
    };
  });
}

export function planApplications(): Target[] {
  return applications.map((a) => {
    // The application's hero is its applicationImages entry since 28 Sep 2026,
    // the same rule as productImages for products (app/applications/[slug]).
    const featured = applicationImages[a.slug] ? resolveImage(applicationImages[a.slug]) : null;
    const bannerSrc = featured?.src ?? a.imageUrl;
    const fromFolder = galleryFor(bannerSrc, a.gallery, `images/applications/${a.slug}`);
    return {
      label: a.slug,
      docId: `application-${a.slug}`,
      heroField: "heroImage",
      hero: { src: bannerSrc, alt: featured?.alt ?? altFor(bannerSrc, `${a.name} surface systems by HUB, Canadian installation`) },
      gallery: (fromFolder.length > 0 ? fromFolder : [bannerSrc]).map((src) => ({
        src,
        alt: altFor(src, `${a.name} surface systems by HUB, Canadian installation`),
        caption: seoCaption(src) ?? altFor(src, a.name),
      })),
    };
  });
}

export function planPages(): Target[] {
  // The photos app/page.tsx (HeroSlideshow) and app/about/page.tsx show today.
  return [
    { label: "homepage", docId: "page-homepage", heroField: "homepageHero.heroImage1",
      hero: { src: "/images/hero/hero-1.jpg", alt: heroAlt("/images/hero/hero-1.jpg") }, gallery: null },
    { label: "about", docId: "page-about", heroField: "aboutHero.heroImage",
      hero: { src: "/images/hero/hero-3.jpg", alt: "HUB Surface Systems, decorative pavement across Canada" }, gallery: null },
  ];
}

