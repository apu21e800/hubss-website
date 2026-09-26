import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import PhotoImage from "@/components/ui/PhotoImage";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import DocumentDownloads from "@/components/sections/DocumentDownloads";
import ColourSystem from "@/components/sections/ColourSystem";
import PavingPatterns from "@/components/sections/PavingPatterns";
import PatternGalleryCTA from "@/components/sections/PatternGalleryCTA";
import { familiesFor, colourSectionFor } from "@/lib/colours";
import { galleryFor, altFor } from "@/lib/asset-scan";
import GalleryGrid, { type GalleryImage } from "@/components/ui/GalleryGrid";
import JsonLd from "@/components/ui/JsonLd";
import RichText from "@/components/ui/RichText";
import { photoObject, seoCaption } from "@/lib/image-seo";
import { isSanityImage, sanityOgImage, type Photo } from "@/lib/photos";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { productImages, resolveImage } from "@/lib/featured-images";
import { buildMetadata } from "@/lib/seo";
import { getProductFamily } from "@/lib/product-taxonomy";
import { catalogueFor } from "@/lib/product-catalogue";
import ProductSpecCard from "@/components/products/ProductSpecCard";
import ProductFaq from "@/components/products/ProductFaq";
import { faqsFor } from "@/lib/product-faqs";
import { getMergedProduct } from "@/lib/products.server";
import { getMergedApplications, type MergedApplication } from "@/lib/applications.server";

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
    description: product.seoDescription || (product.shortDesc + " " + product.description.slice(0, 120) + "…"),
    slug: `products/${product.slug}`,
    image: isSanityImage(heroSrc) ? sanityOgImage(heroSrc) : heroSrc,
  });
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

  // Catalogue editorial for this product, where the print book covers it.
  const catalogue = catalogueFor(slug);
  // FAQ content, where the product's own documents provide it.
  const faqs = faqsFor(slug);

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
  const hero: Photo = product.heroPhoto ?? {
    src: featuredImg?.src ?? product.imageUrl,
    alt: featuredImg?.alt ?? `${product.name}: ${product.shortDesc}`,
  };
  const galleryPhotos: Photo[] = product.galleryPhotos ?? (() => {
    const bannerSrc = featuredImg?.src ?? product.imageUrl;
    const fromFolder = galleryFor(bannerSrc, product.gallery, `images/products/${product.slug}`);
    return (fromFolder.length > 0 ? fromFolder : [bannerSrc]).map((src) => ({
      src,
      alt: altFor(src, `${product.name} decorative pavement by HUB Surface Systems`),
      // A caption that repeats the alt word for word is wasted surface. This one
      // is written for a reader looking at the photo in the lightbox — and
      // visible text beside an image is weighted more heavily by Google Images
      // and by AI crawlers than the alt attribute is.
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
    image: [
      photoObject(hero, { representativeOfPage: true }),
      ...galleryPhotos.slice(1, 12).map((p) => photoObject(p)),
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
            value: s.value,
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
    name: `${product.name} installation photographs`,
    description: `Field photography of ${product.name} installations by HUB Surface Systems across Canada.`,
    url: `https://hubss.com/products/${product.slug}`,
    isPartOf: { "@id": `https://hubss.com/products/${product.slug}` },
    numberOfItems: gallery.length,
    associatedMedia: galleryPhotos
      .slice(0, 40)
      .map((p) => photoObject({ ...p, caption: p.caption ?? p.alt }, { ownText: true })),
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

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      {gallerySchema && <JsonLd data={gallerySchema} />}
      {faqSchema && <JsonLd data={faqSchema} />}
      <Nav />

      {/* Hero banner */}
      <div data-hero className="relative overflow-hidden" style={{ height: "clamp(360px, 52vh, 560px)" }}>
        <PhotoImage
          src={hero.src}
          alt={hero.alt}
          fill
          className="object-cover"
          style={{ objectPosition: product.heroPosition ?? "center 62%" }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,13,22,0.4) 0%, rgba(8,13,22,0.5) 55%, rgba(8,13,22,0.82) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(92deg, rgba(8,13,22,0.38) 0%, rgba(8,13,22,0.14) 45%, transparent 65%)" }} />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "var(--accent-text-lg)" }}>
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
              className="mb-4"
              style={{ width: 56, height: 3, background: "#f97316", borderRadius: 2 }}
              aria-hidden="true"
            />
            <p
              className="text-base sm:text-lg max-w-xl leading-relaxed"
              style={{ color: "var(--ink-78)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
            >
              {product.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative" style={{ background: "var(--bg-dark)" }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 sm:pb-28">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: description + gallery */}
          <div className="lg:col-span-2">
            {/* Lead with the catalogue's positioning spread where we have one.
                The heading used to read "About <product>" — a filing label, in
                the one position on the page where a specifier is still deciding
                whether to keep reading. */}
            {catalogue ? (
              <>
                <ProductSpecCard entry={catalogue} productName={product.name} />
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
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold mb-5" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  What {product.name} is
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

            {/* The ask, after the argument.

                This bar used to sit above everything — the first thing on the
                page after the hero was a request to book a session, before the
                page had said what the product is or why it holds up. Moving it
                below the positioning spread and the "How it works" copy means a
                specifier meets it having just read the thickness, the skid
                rating and the service life, which is the moment the offer is
                worth anything. */}
        <div
          className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-10 relative overflow-hidden"
          style={{
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.22)",
            boxShadow: "0 1px 24px rgba(249,115,22,0.08)",
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: "linear-gradient(180deg, #F97316, #EAB308)" }} />
          <div className="relative pl-3">
            <p className="font-bold text-lg leading-snug" style={{ color: "var(--text-primary)" }}>
              Specify {product.name}.
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Technical data sheets, pricing, and certified installer support across Canada.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 relative flex-shrink-0">
            <Link href="/lunch-learn"
              className="px-5 rounded-lg text-sm font-semibold transition-all inline-flex items-center"
              style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--ink-14)", minHeight: "44px" }}>
              Book a Lunch &amp; Learn
            </Link>
            <Link href="/gallery"
              className="px-5 rounded-lg text-sm font-bold transition-all inline-flex items-center"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "var(--on-accent)", boxShadow: "0 4px 16px rgba(249,115,22,0.32)", minHeight: "44px" }}>
              See Project Gallery →
            </Link>
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
            {(product.slug === "streetbond" || product.slug === "traffic-patterns-xd") && <PatternGalleryCTA />}

          </div>

          {/* Right: specs */}
          <div>
            <div className="rounded-xl p-8 mb-8 sticky top-24 relative overflow-hidden" style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--ink-08)" }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />
              {/* Was an <h3> sitting under the Downloads <h2>, which filed the
                  spec table inside "Downloads" for every screen reader and for
                  Google's outline. It is its own section and now says so. */}
              <h2 className="font-bold text-lg mb-6" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                Full specification
              </h2>
              <div className="space-y-4">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between text-sm" style={{ borderBottom: "1px solid var(--ink-06)", paddingBottom: "12px" }}>
                    <span style={{ color: "var(--text-muted)" }}>{spec.label}</span>
                    <span className="font-semibold text-right max-w-[60%]" style={{ color: "var(--text-primary)" }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vern, 21 Sep: the dark holds at the top of this page — hero, the
            argument, the spec card — and then the work, the documents and the
            applications want relief.

            This band used to sit inside the left column of the grid above,
            which made it two thirds of a screen wide with a dark gutter beside
            it: a white panel that looked cropped rather than placed. Lifting
            it out of the grid lets it run edge to edge, which is the whole
            point of a band — Powershifter's blocks span the page, and that is
            why they read as structure rather than as a stray card.

            The intro row above keeps the spec card beside the argument, which
            is where a specifier wants it anyway. */}
        <div className="mt-16 pt-16 pb-16 px-6 sm:px-10 -mx-4 sm:-mx-6 lg:-mx-8 rounded-2xl" style={{ background: "var(--bg-primary)" }}>
          {/* "Gallery" is what a CMS calls a folder. The catalogue calls its
              photography "The Work" — better, and already the client's own
              word for it. The standfirst keeps it unambiguous for a reader
              and for search. */}
          <h2 className="text-2xl font-bold mb-1.5" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            The work
          </h2>
          <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            {product.name} installations photographed on site across Canada.
          </p>
          <GalleryGrid images={gallery} />

          {/* The questions people search, answered in the client's own
              words, above the fold of the documents section — a visitor
              who scrolled this far is evaluating, and evaluation is made
              of questions. Source: lib/product-faqs.ts. */}
          {faqs && <ProductFaq productName={product.name} faqs={faqs} />}

          <DocumentDownloads slug={product.slug} />
        </div>

        {/* StreetBondSR LEED callout — the book's facts, and only those.
            Until 25 Sep 2026 this block said "LEED v4" (the Idea Book says
            V5), listed rating systems and quoted surface and city
            temperatures that appear in no HUB document. Doug's round: the
            book wins, nothing invented, one call to action. */}
        {slug === "streetbondsr" && (
          <div
            className="mt-16 rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(134,197,82,0.25)", background: "rgba(134,197,82,0.04)" }}
          >
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
              {/* SVG source — the optimizer 400s on SVG unless
                  dangerouslyAllowSVG is set in next.config, so this opts
                  out of optimization. Fixed 72x72, no `sizes` needed. */}
              <Image
                src="/images/products/streetbondsr/leed-logo.svg"
                alt="LEED, U.S. Green Building Council"
                width={72}
                height={72}
                unoptimized
                style={{ width: 72, height: 72, objectFit: "contain", flexShrink: 0, filter: "invert(1) brightness(0.75) sepia(1) hue-rotate(60deg) saturate(2)" }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Contributes to LEED v5 urban heat-island credits
                </h3>
                <p className="mt-3 leading-relaxed" style={{ color: "var(--ink-72)", fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)", maxWidth: "60ch" }}>
                  Twelve colours carry a solar reflectance of 0.33 or higher and can contribute to the LEED v5
                  Sustainable Sites credit for urban heat island (non-roof).
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex flex-shrink-0 items-center px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: "linear-gradient(135deg, #86c552 0%, #6aad3a 100%)", color: "var(--on-accent)", boxShadow: "0 4px 16px rgba(134,197,82,0.3)" }}
              >
                Request LEED documentation →
              </Link>
            </div>
          </div>
        )}

        {/* Applications this product is used for */}
        {relatedAppData.length > 0 && (
          <div className="mt-16 pt-16 pb-16 px-6 sm:px-10 -mx-4 sm:-mx-6 lg:-mx-8 rounded-2xl" style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--ink-08)" }}>
            <div className="flex items-end justify-between mb-8">
              <div>
                {/* One heading, no eyebrow: "Specified for" above "Where X
                    goes" said the same thing twice (Doug's round, 25 Sep 2026). */}
                <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Where {product.name} goes
                </h2>
              </div>
              <Link
                href="/applications"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150 hover:text-[var(--text-primary)]"
                style={{ color: "var(--text-muted)" }}
              >
                All applications
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedAppData.map((app) => {
                const photo: Photo | null = app.heroPhoto ?? null;
                return (
                  <Link
                    key={app.slug}
                    href={`/applications/${app.slug}`}
                    className="group relative overflow-hidden rounded-lg"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-faint)" }}
                  >
                    {/* Names first (Doug's round, 25 Sep 2026): the card used to
                        carry the application's line, cut mid-word at eighty
                        characters, and an "Explore" label. The name over the
                        photograph is the whole card; the line lives on the
                        application's own page. The title sits on a 40% scrim,
                        so it stays light whatever the page's surface. */}
                    <div className="relative overflow-hidden" style={{ height: 150 }}>
                      <PhotoImage
                        src={photo?.src ?? app.imageUrl}
                        alt={photo?.alt ?? app.name}
                        fill
                        style={{ objectPosition: "center 60%" }}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                      <div
                        className="absolute inset-0 transition-opacity duration-300 opacity-50 group-hover:opacity-70"
                        style={{ background: "rgba(0,0,0,0.4)" }}
                      />
                      <div className="absolute inset-0 flex items-end p-3">
                        <div>
                          <div className="w-5 h-px mb-2 transition-all duration-200 group-hover:w-8" style={{ background: "#f97316" }} />
                          <p className="font-bold text-sm leading-tight" style={{ color: "#fff" }}>
                            {app.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </div>
      <LunchLearn compact />
      <Footer />
    </main>
  );
}
