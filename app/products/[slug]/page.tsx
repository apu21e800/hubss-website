import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PhotoImage from "@/components/ui/PhotoImage";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import DocumentDownloads from "@/components/sections/DocumentDownloads";
import { getDocsForProduct } from "@/lib/documents";
import ColourSystem from "@/components/sections/ColourSystem";
import PavingPatterns from "@/components/sections/PavingPatterns";
import PatternGalleryCTA from "@/components/sections/PatternGalleryCTA";
import { familiesFor, colourSectionFor } from "@/lib/colours";
import { galleryFor, altFor } from "@/lib/asset-scan";
import GalleryGrid, { type GalleryImage } from "@/components/ui/GalleryGrid";
import JsonLd from "@/components/ui/JsonLd";
import RichText from "@/components/ui/RichText";
import { photoObject, seoCaption, honestPhoto, HUB_ORGANIZATION } from "@/lib/image-seo";
import { isSanityImage, sanityOgImage, type Photo } from "@/lib/photos";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { productImages, resolveImage } from "@/lib/featured-images";
import { buildMetadata } from "@/lib/seo";
import { getProductFamily } from "@/lib/product-taxonomy";
import { catalogueFor } from "@/lib/product-catalogue";
import ProductSpecCard, { fixPrint } from "@/components/products/ProductSpecCard";
import ProductFaq from "@/components/products/ProductFaq";
import { faqsFor } from "@/lib/product-faqs";
import { getMergedProduct } from "@/lib/products.server";
import { getMergedApplications, type MergedApplication } from "@/lib/applications.server";
import { heroObjectPosition, heroColourClass } from "@/lib/hero-framing";
import { editAttr, isPreview } from "@/lib/sanity.preview";
import { getSiteSettings } from "@/lib/sanity.queries";
import { telHref } from "@/lib/site-settings";
import { lunchLearnHref } from "@/lib/lunch-learn";

export const revalidate = 3600;

// Only the products in lib/products.ts exist. Left at the default (true), an unknown
// slug was rendered on demand behind the root loading.tsx Suspense boundary,
// so a 200 had already gone out before notFound() ran: /products/<anything>
// answered 200 with the homepage's title and canonical, and Google kept
// crawling old WordPress addresses like /applications/bike-bus-lanes as pages.
// The same fix /blog/[slug] got in PR #54. It is safe here because the page
// can only render a slug the code knows: Sanity overrides fields on an
// existing entry and cannot add one (checked 23 Sep 2026: Sanity holds 14
// products and 20 applications, all of them in the code).
export const dynamicParams = false;

export async function generateStaticParams() {
  return products.filter((p) => !p.comingSoon).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // The same merged product the page renders, so <title> and the meta
  // description follow the SEO fields in Studio like the rest of the page does.
  const product = await getMergedProduct(slug);
  if (!product) return {};
  const featuredImg = productImages[slug] ? resolveImage(productImages[slug]) : null;
  const heroSrc = product.heroPhoto?.src ?? featuredImg?.src ?? product.imageUrl;
  return buildMetadata({
    title: product.seoTitle || product.name,
    // The SEO description from Studio (or the code's) when it fits in whole
    // sentences, else the product's own one-liner: at most 155 characters,
    // never cut mid-word. Until 30 Sep 2026 the fallback was the one-liner
    // plus the first 120 characters of the body, cut mid-word and ending in
    // "…" (QA E1, on 22 pages).
    description: metaDescription(product.seoDescription, product.shortDesc),
    slug: `products/${product.slug}`,
    image: isSanityImage(heroSrc) ? sanityOgImage(heroSrc) : heroSrc,
  });
}

/**
 * A meta description of whole sentences, at most `max` characters: the SEO
 * field when it fits, or cut back to the last sentence end that fits; when
 * its one sentence runs past the limit (seven of the ported product
 * descriptions do), the page's one-liner stands in, by the same rule. Never mid-word, never
 * "…" (Google adds its own). The same helper lives in
 * app/applications/[slug]/page.tsx: a page file cannot export it, and
 * lib/seo.ts belongs to another worker tonight (30 Sep 2026).
 */
function metaDescription(seo: string | undefined, oneLiner: string, max = 155): string {
  for (const text of [seo, oneLiner]) {
    const clean = (text ?? "").replace(/\s+/g, " ").trim();
    if (!clean) continue;
    if (clean.length <= max) return clean;
    const head = clean.slice(0, max + 1);
    const end = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
    if (end >= 40) return clean.slice(0, end + 1);
  }
  // Both run past the limit in one sentence (none does today): the one-liner
  // to its last whole word, with a full stop.
  const clean = oneLiner.replace(/\s+/g, " ").trim();
  const cut = clean.slice(0, max).lastIndexOf(" ");
  return clean.slice(0, cut > 0 ? cut : max).replace(/[,;:\s]+$/, "") + ".";
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // lib/products.ts merged with Sanity, field by field, by the one merge in
  // lib/products.server.ts: name, eyebrow, shortDesc, description, specs and the
  // SEO fields follow Studio, and a blank Studio field falls back to the code.
  // Until Sep 2026 this page had its own inline merge that took shortDesc alone,
  // so `npm run sync:products` changed nothing here.
  const product = await getMergedProduct(slug);

  if (!product || product.comingSoon) notFound();

  // Studio's "Edit on the page" (lib/sanity.preview.ts): while previewing, the
  // hero banner names its Studio field, so clicking the photo opens it.
  const preview = await isPreview();
  // The two offices' phones in the "Pricing and installers" card, from Studio's Site Settings.
  const { offices } = await getSiteSettings();
  const heroEdit = preview ? editAttr({ id: product.sanityId, type: "product" }, "heroImage") : undefined;
  const galleryEdit = preview ? editAttr({ id: product.sanityId, type: "product" }, "gallery") : undefined;

  // Catalogue editorial for this product, where the print book covers it.
  const catalogue = catalogueFor(slug);
  // FAQ content, where the product's own documents provide it.
  const faqs = faqsFor(slug);
  // Fast Patch has no documents yet: its "Spec sheets" button led to an empty
  // band (QA, 28 Sep 2026). The button and the section show only when there is
  // something to open.
  const hasDocs = getDocsForProduct(product.slug).length > 0;

  // Featured image from lib/featured-images.ts (audited, correct per product)
  const featuredImg = productImages[slug] ? resolveImage(productImages[slug]) : null;

  // The hero photo and the gallery come from Sanity, where Doug curates them
  // (lib/photos.ts). A product whose Sanity document has none falls back to
  // exactly what this page showed before: the audited featured image, and the
  // product's /public folder scanned at build time (docs/IMAGE-WORKFLOW.md).
  //
  // The folder fallback excludes the photo the hero banner ACTUALLY shows —
  // featuredImg when one is configured, not product.imageUrl. Keying it on
  // imageUrl meant every product with a distinct featured image (seven of
  // eleven) repeated its banner photo inside "The work" while the imageUrl
  // photo, shown nowhere, was silently dropped from the gallery.
  //
  // honestPhoto (lib/image-seo.ts, 30 Sep 2026, QA E10): the photo sync wrote
  // the old templates' invented settings into Studio ("at a civic plaza",
  // "150 mil ..."), so the Sanity alt and caption are replaced at render by
  // what the photo's folder proves; a line a person wrote in Studio stays.
  const hero: Photo = honestPhoto(product.heroPhoto ?? {
    src: featuredImg?.src ?? product.imageUrl,
    alt: featuredImg?.alt ?? product.name,
  });
  const galleryPhotos: Photo[] = product.galleryPhotos?.map(honestPhoto) ?? (() => {
    const bannerSrc = featuredImg?.src ?? product.imageUrl;
    const fromFolder = galleryFor(bannerSrc, product.gallery, `images/products/${product.slug}`);
    return (fromFolder.length > 0 ? fromFolder : [bannerSrc]).map((src) => ({
      src,
      alt: altFor(src, product.name),
      caption: seoCaption(src) ?? altFor(src, product.name),
    }));
  })();
  const gallery: GalleryImage[] = galleryPhotos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption ?? p.alt }));

  // The related applications, merged with Sanity so each card can carry the
  // application's own hero from cdn.sanity.io through the PhotoImage loader.
  // Until 25 Sep 2026 the cards used the /public photo through next/image,
  // which was the last big source of /_next/image transforms on the site
  // (35 on this page for MMAX).
  const mergedApps = await getMergedApplications();
  const relatedAppData: MergedApplication[] = product.relatedApplications
    .map((s) => mergedApps.find((a) => a.slug === s) ?? applications.find((a) => a.slug === s))
    .filter((a): a is MergedApplication => Boolean(a));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "HUB Surface Systems" },
    url: `https://hubss.com/products/${product.slug}`,
    // `image` used to be a bare URL string. Google accepts that, but a bare
    // string carries no caption, no credit, no licence and no keywords — so
    // the photo was eligible for a rich result and nothing else. As ImageObject
    // nodes each photo arrives with the words that describe it and the licence
    // terms that make it eligible for the Licensable badge in Google Images.
    // First entry is the hero, which is what a rich result will show.
    // creatorRef: the Organization is the `manufacturer` node below, once,
    // and each photo points at its @id (30 Sep 2026).
    image: [
      photoObject(hero, { representativeOfPage: true, creatorRef: true }),
      ...galleryPhotos.slice(1, 12).map((p) => photoObject(p, { creatorRef: true })),
    ],
    manufacturer: {
      "@type": "Organization",
      "@id": "https://hubss.com/#organization",
      name: "HUB Surface Systems",
    },
    // The catalogue's four headline specs, as machine-readable properties.
    // These are the values a specifier searches by — "150 mil", "60 BPN",
    // "8–9 Mohs" — and until now they existed only as visible text. As
    // PropertyValue nodes they are quotable by AI engines and eligible for
    // spec-style treatment in product results. Same source as the visible
    // spec grid (lib/product-catalogue.ts), so they cannot disagree with
    // what the page shows.
    ...(catalogue
      ? {
          additionalProperty: catalogue.specs.map((s) => ({
            "@type": "PropertyValue",
            name: s.label,
            value: fixPrint(s.value), // the same print fixes the spread shows (30 Sep 2026)
          })),
        }
      : {}),
  };

  /**
   * The FAQ as schema.org FAQPage. Of the 58 keywords this site ranks for in
   * Canada, 45 trigger People Also Ask and 35 trigger AI Overviews (Semrush,
   * Aug 2026) — question-shaped surfaces that quote question-shaped markup.
   * Built from the same lib/product-faqs.ts data the visible section renders,
   * so the markup can never claim what the page does not show. Google's
   * FAQPage rich result is restricted to government and health sites since
   * 2023 — that is not why this exists. It exists because the schema makes
   * each Q&A pair an addressable, quotable unit for answer engines.
   */
  const faqSchema = faqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  /**
   * The gallery as an addressable collection. Without this the photographs are
   * loose <img> elements that happen to share a page; with it they are a named
   * set about a named subject, which is the shape an AI crawler can actually
   * cite ("HUB's TrafficPatternsXD installation photographs") rather than
   * merely scrape.
   */
  const gallerySchema = gallery.length > 1 ? {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `https://hubss.com/products/${product.slug}#gallery`,
    // Named for what it is (QA E10, 30 Sep 2026): it said "Field photography
    // of X installations by HUB Surface Systems across Canada", which the
    // repair products' product shots and the US photos made untrue. The
    // Organization is one node here, `creator`, and the forty photos point at
    // its @id: the StreetPrint script carried 52 copies of it.
    name: `${product.name} photographs`,
    description: `The photographs on the ${product.name} page.`,
    url: `https://hubss.com/products/${product.slug}`,
    isPartOf: { "@id": `https://hubss.com/products/${product.slug}` },
    creator: HUB_ORGANIZATION,
    numberOfItems: gallery.length,
    associatedMedia: galleryPhotos
      .slice(0, 40)
      .map((p) => photoObject({ ...p, caption: p.caption ?? p.alt }, { ownText: true, creatorRef: true })),
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hubss.com" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://hubss.com/products" },
      { "@type": "ListItem", position: 3, name: product.name, item: `https://hubss.com/products/${product.slug}` },
    ],
  };

  // Hero framing follows the photo, not the page (lib/hero-framing.ts): a
  // Sanity hero records the /public path it came from as `origin`.
  // Studio's focal point (hotspot) comes first: heroObjectPosition.
  const heroPosition = heroObjectPosition(hero, product.heroPosition ?? "center 62%");
  // A photo under 1000 px wide cannot fill a 1440 px banner (QA B1); the band
  // becomes a dark panel below. Only a Studio photo carries its width.
  const heroTooSmall = typeof hero.width === "number" && hero.width < 1000;

  // The spread (ProductSpecCard) prints the book's four headline specs; the
  // sidebar used to print the same four again beside them in other words
  // ("60 BPN (ASTM E303)" next to "60 BPN · ASTM E303"). The sidebar now keeps
  // only the rows the spread doesn't show (QA pa#21, 27 Sep 2026).
  const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
  const inSpread = new Set((catalogue?.specs ?? []).map((sp) => norm(sp.label)));
  const sideSpecs = product.specs.filter((sp) => !inSpread.has(norm(sp.label)));

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      {gallerySchema && <JsonLd data={gallerySchema} />}
      {faqSchema && <JsonLd data={faqSchema} />}
      <Nav />

      {/* Hero banner. Vern, 27 Sep 2026: the product heroes were "quite dark
          and muted". The scrims now darken only where the type sits (the foot
          and the left edge), and the photo gets a light colour lift. */}
      <div data-hero data-sanity={heroEdit} className="relative overflow-hidden" style={{ height: "clamp(360px, 52vh, 560px)" }}>
        {heroTooSmall ? (
          /* A dark panel instead of the photo: the hatching an engineer draws
             through a section (the Products menu's ruled tile) over the dark
             ground, with the name on it. ChipFill's Studio hero is a 640 px
             file and AggreFill's 476 px, and at 1440 wide both were a blur
             (QA B1, 30 Sep 2026). The width comes from the Studio photo
             record; a /public fallback carries none and is shown as before. */
          <div
            className="absolute inset-0"
            style={{ background: `${HATCH}, linear-gradient(180deg, #1c1c1f 0%, var(--bg-dark) 100%)` }}
            aria-hidden="true"
          />
        ) : (
          <>
            <PhotoImage
              src={hero.src}
              alt={hero.alt}
              fill
              className={`object-cover ${heroColourClass(hero)}`}
              style={{ objectPosition: heroPosition }}
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,13,22,0.12) 0%, rgba(8,13,22,0.04) 38%, rgba(8,13,22,0.34) 64%, rgba(8,13,22,0.82) 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(8,13,22,0.46) 0%, rgba(8,13,22,0.16) 40%, transparent 62%)" }} />
          </>
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
            {/* The label was orange on the photo and measured 2 to 3:1 on red,
                orange and grey heroes (QA pa#13). Cream on the scrim reads on
                all of them; the orange stays in the dash under the name. */}
            <p
              className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "rgba(245,240,235,0.92)", textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}
            >
              {product.eyebrow ?? getProductFamily(product.slug)}
            </p>
            <h1
              className="font-black leading-[1.05] mb-3"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.75rem)",
                color: "var(--text-primary)",
                textShadow: "0 2px 24px rgba(0,0,0,0.5)",
                letterSpacing: "-0.025em",
              }}
            >
              {product.name}
            </h1>
            {/* The orange signature dash from the catalogue's product spread —
                the one piece of the printed page that makes a product name read
                as a masthead rather than a label. */}
            <div
              className={catalogue ? "" : "mb-4"}
              style={{ width: 56, height: 3, background: "#f97316", borderRadius: 2 }}
              aria-hidden="true"
            />
            {/* Where the Idea Book spread follows, it opens with this same line
                in the book's words, so the hero no longer says it first (QA
                pa#20: StreetPrint said "stamped asphalt" three times in two
                screens). Products without a spread keep their line here. */}
            {!catalogue && (
              <p
                className="text-base sm:text-lg max-w-xl leading-relaxed"
                style={{ color: "rgba(245,240,235,0.9)", textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
              >
                {product.shortDesc}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Everything under the hero is reading, on paper (Vern, 27 Sep 2026:
          "keep the dark section at the top but bring in some light sections
          under it so the site starts to feel more consistent"). Sections
          alternate two paper tones so each one reads as its own chapter; the
          Lunch & Learn band and the footer close the page in the dark. */}
      <div data-surface="paper">
      <section style={{ background: "var(--bg-primary)" }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left: description + gallery */}
          <div className="lg:col-span-2 min-w-0">
            {/* Lead with the catalogue's positioning spread where we have one.
                The heading used to read "About <product>" — a filing label, in
                the one position on the page where a specifier is still deciding
                whether to keep reading. */}
            {catalogue ? (
              /* The spread alone. Until 30 Sep 2026 a "How it works" paragraph
                 followed it: `description` (Studio, synced from lib/products.ts),
                 which was written from the same printed page as the spread's
                 `description` (lib/product-catalogue.ts) and repeated its
                 sentences one screen later on all ten pages (QA B4, E19:
                 TrafficPatterns' aggregate sentence, StreetPrint's flush
                 surface, PreMark's whole paragraph). The book's spread is the
                 approved copy, so it stands and the paragraph does not. The
                 field still feeds the Product JSON-LD, and the four products
                 without a spread still show it below. */
              <ProductSpecCard entry={catalogue} productName={product.name} />
            ) : (
              <>
                {/* The same heading as the spread pages and the application
                    pages. "What AirMark is" and a sidebar "Specification" made
                    the four products without a spread read as a second
                    template (QA B2, C3, 30 Sep 2026). */}
                <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  How it works
                </h2>
                {product.descriptionBlocks ? (
                  <RichText value={product.descriptionBlocks} />
                ) : (
                  <p className="mb-12 leading-[1.85]" style={{ color: "var(--text-body)", fontSize: "clamp(1rem, 1.8vw, 1.075rem)", maxWidth: "65ch" }}>
                    {product.description}
                  </p>
                )}
              </>
            )}

            {/* The ask, after the argument. A specifier meets it having just
                read the thickness, the skid rating and the service life, which
                is the moment the offer is worth anything.

                Until 27 Sep 2026 the bar promised "data sheets, pricing and
                installer support" and then offered Lunch & Learn and the
                unfiltered /gallery (QA pa#23). Now the main button books a
                session about this product (the topic rides into the form and
                the request email, lib/lunch-learn.ts), and the second jumps to
                this product's own documents below. */}
        <div
          className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-10 relative overflow-hidden"
          style={{
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.24)",
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: "linear-gradient(180deg, #F97316, #EAB308)" }} />
          <div className="relative pl-3">
            <p className="font-bold text-lg leading-snug" style={{ color: "var(--text-primary)" }}>
              Specify {product.name}.
            </p>
            <p className="text-sm mt-1 max-w-md" style={{ color: "var(--text-secondary)" }}>
              A free Lunch &amp; Learn takes your team through the specification, with samples on the table.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 relative flex-shrink-0">
            <Link href={lunchLearnHref(product.name, "product")}
              className="px-5 rounded-lg text-sm font-bold transition-[filter] hover:brightness-110 inline-flex items-center"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "var(--on-accent)", boxShadow: "0 4px 16px rgba(249,115,22,0.28)", minHeight: "44px" }}>
              Book a Lunch &amp; Learn
            </Link>
            {hasDocs && (
              <a href="#spec-sheets"
                className="px-5 rounded-lg text-sm font-semibold transition-colors inline-flex items-center hover:bg-[var(--ink-04)]"
                style={{ background: "transparent", color: "var(--text-primary)", border: "1px solid var(--ink-15)", minHeight: "44px" }}>
                Spec sheets
              </a>
            )}
          </div>
        </div>


            {familiesFor(product.slug).length > 0 && (
              <ColourSystem
                families={familiesFor(product.slug)}
                heading={colourSectionFor(product.slug)?.heading}
                intro={colourSectionFor(product.slug)?.intro}
                downloadHref={colourSectionFor(product.slug)?.downloadHref}
                downloadLabel={colourSectionFor(product.slug)?.downloadLabel}
              />
            )}
            {product.slug === "streetprint" && <PavingPatterns />}
            {/* StreetBond colours the stamped pattern, so StreetPrint's templates
                belong on its page. TrafficPatternsXD is stamped with its own
                wire grids (its Design Manual), so the band no longer runs there
                (QA pa#37). */}
            {product.slug === "streetbond" && <PatternGalleryCTA />}

          </div>

          {/* Right: the specification rows the spread doesn't already show,
              and the way to a price. Sticky again from 28 Sep 2026, when the
              page stopped clipping with overflow hidden (app/globals.css). */}
          <aside className="min-w-0">
            <div className="rounded-xl p-6 sm:p-7 lg:sticky lg:top-24 relative overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />
              {sideSpecs.length > 0 && (
                <>
                  {/* Its own section, not an <h3> under Downloads. */}
                  <h2 className="font-bold text-lg mb-5" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    Specification details
                  </h2>
                  <dl className="space-y-3.5 mb-7">
                    {sideSpecs.map((spec) => (
                      <div key={spec.label} className="flex justify-between gap-4 text-sm" style={{ borderBottom: "1px solid var(--ink-06)", paddingBottom: "12px" }}>
                        <dt style={{ color: "var(--text-muted)" }}>{spec.label}</dt>
                        <dd className="font-semibold text-right max-w-[62%]" style={{ color: "var(--text-primary)" }}>
                          {/* fixPrint: Studio holds StreetPrint's "Yes: flush surface" row; the
                              punctuation is corrected at render until the sync runs (QA B23). */}
                          {fixPrint(spec.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
              <h2 className="font-bold text-base mb-1.5" style={{ color: "var(--text-primary)" }}>
                Pricing and installers
              </h2>
              <p className="text-[13.5px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                Your regional office prices the project and puts you in touch with a certified {product.name} installer.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <a href={telHref(offices.east.phone)} className="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--ink-04)]" style={{ border: "1px solid var(--border-color)", minHeight: 44 }}>
                  <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>East</span>
                  <span className="block text-[13.5px] font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>{offices.east.phone}</span>
                </a>
                <a href={telHref(offices.west.phone)} className="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--ink-04)]" style={{ border: "1px solid var(--border-color)", minHeight: 44 }}>
                  <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>West</span>
                  <span className="block text-[13.5px] font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>{offices.west.phone}</span>
                </a>
              </div>
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold hover:underline underline-offset-2" style={{ color: "var(--accent-text)", minHeight: 44 }}>
                Send a project enquiry
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </aside>
        </div>
      </div>
      </section>

        {/* The work, on the second paper tone so it reads as its own
            chapter. "Gallery" is what a CMS calls a folder; the catalogue
            calls its photography "The Work". */}
        <section style={{ background: "var(--bg-section-asphalt)", borderTop: "1px solid var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1.5" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              The work
            </h2>
            {/* Was "{Name} installations photographed on site across Canada",
                which the US photos then in the galleries made untrue (QA pa#32). */}
            <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
              HUB installations, photographed on site.
            </p>
            {/* While previewing, the whole gallery opens its Studio field (add,
                remove, reorder, caption): lib/sanity.preview.ts. */}
            <div data-sanity={galleryEdit}>
              <GalleryGrid images={gallery} />
            </div>
          </div>
        </section>

        {/* The questions people search, answered in the client's own words,
            then the documents: a visitor who scrolled this far is evaluating,
            and evaluation is made of questions and data sheets. */}
        {(faqs || hasDocs || slug === "streetbondsr") && (
        <section id="documents" className="scroll-mt-24" style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-14 sm:pb-20">
            {faqs && <ProductFaq productName={product.name} faqs={faqs} />}
            <div className={faqs ? "" : "pt-12"}>
              <DocumentDownloads slug={product.slug} />
            </div>

            {/* StreetBondSR LEED callout: the book's facts, and only those.
                The badge beside it went on 28 Sep 2026: it was a home-made
                drawing styled as the USGBC's mark (QA pa#8). */}
            {slug === "streetbondsr" && (
              <div
                className="mt-14 rounded-2xl p-7 sm:p-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10"
                style={{ border: "1px solid var(--border-color)", background: "var(--bg-card)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--accent-text)" }}>
                    LEED v5
                  </p>
                  <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                    Can contribute to urban heat island credits
                  </h3>
                  <p className="mt-3 leading-relaxed" style={{ color: "var(--text-secondary)", fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)", maxWidth: "60ch" }}>
                    Twelve colours carry a solar reflectance of 0.33 or higher and can contribute to the LEED v5
                    Sustainable Sites credit for urban heat island (non-roof).
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex flex-shrink-0 items-center justify-center gap-2 px-6 rounded-lg text-sm font-bold transition-[filter] hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "var(--on-accent)", minHeight: 44 }}
                >
                  Request LEED documentation
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            )}
          </div>
        </section>
        )}

        {/* Applications this product is used for */}
        {relatedAppData.length > 0 && (
          <section style={{ background: "var(--bg-section-asphalt)", borderTop: "1px solid var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="flex items-end justify-between mb-8">
              {/* One heading, no eyebrow: "Specified for" above "Where X
                  goes" said the same thing twice (Doug's round, 25 Sep 2026). */}
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Where {product.name} goes
              </h2>
              <Link
                href="/applications"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:text-[var(--text-primary)]"
                style={{ color: "var(--text-secondary)", minHeight: 44 }}
              >
                All applications
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* One grid on every product page: four across from lg, two
                below, every card the same size and the same 15 px name. The
                count used to pick 3, 4 or 5 columns, so StreetBond's cards
                were small and DecoMark's large for the same section (QA B8,
                30 Sep 2026). A short last row stays left-aligned. */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {relatedAppData.map((app) => {
                const photo: Photo | null = app.heroPhoto ?? null;
                return (
                  <Link
                    key={app.slug}
                    href={`/applications/${app.slug}`}
                    className="group relative overflow-hidden rounded-xl"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
                  >
                    {/* Names first (Doug's round, 25 Sep 2026). The name sits on
                        a bottom gradient that reaches 0.72 behind it: the old
                        flat scrim was dimmed to 20% by an opacity class, and
                        white names over pale crosswalks and sky went missing
                        (QA pa#14). */}
                    <div className="relative overflow-hidden" style={{ height: 168 }}>
                      <PhotoImage
                        src={photo?.src ?? app.imageUrl}
                        alt={photo?.alt ?? app.name}
                        fill
                        style={{ objectPosition: "center 60%" }}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes={APP_SIZES}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,0.30) 62%, rgba(0,0,0,0.74) 100%)" }}
                      />
                      <div className="absolute inset-0 flex items-end p-3.5">
                        <div>
                          <div className="w-5 h-[2px] mb-2 transition-all duration-200 group-hover:w-8" style={{ background: "#f97316" }} />
                          <p className="font-bold text-[15px] leading-tight" style={{ color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                            {app.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/applications"
              className="sm:hidden mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--accent-text)", minHeight: 44 }}
            >
              All applications
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
          </section>
        )}
      </div>
      <LunchLearn compact topic={product.name} from="product" />
      <Footer />
    </main>
  );
}

/** The ruled-section hatching the Products menu's tile draws (components/sections/Nav.tsx). */
const HATCH = "repeating-linear-gradient(-45deg, var(--ink-08) 0 1px, transparent 1px 9px)";

/**
 * The card's real width in the four-column grid (max-w-7xl less px-8 is
 * 1216 px; gaps 12 px on phones, 16 px from sm), so the browser picks a
 * source at least as wide as the card. "25vw" handed a 598 px card a 384 px
 * image.
 */
const APP_SIZES = "(min-width: 1280px) 292px, (min-width: 1024px) calc((100vw - 112px) / 4), (min-width: 640px) calc(50vw - 32px), calc(50vw - 22px)";
