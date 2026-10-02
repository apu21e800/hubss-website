import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PhotoImage from "@/components/ui/PhotoImage";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import GalleryGrid, { type GalleryImage } from "@/components/ui/GalleryGrid";
import { galleryFor, altFor } from "@/lib/asset-scan";
import ResidentialDriveways from "@/components/sections/ResidentialDriveways";
import JsonLd from "@/components/ui/JsonLd";
import { photoObject, seoCaption } from "@/lib/image-seo";
import { isSanityImage, sanityOgImage, type Photo } from "@/lib/photos";
import { applications } from "@/lib/applications";
import { getMergedApplication } from "@/lib/applications.server";
import RichText from "@/components/ui/RichText";
import { products } from "@/lib/products";
import { applicationImages, resolveImage } from "@/lib/featured-images";
import ApplicationSpread from "@/components/applications/ApplicationSpread";
import { applicationCatalogueFor } from "@/lib/application-catalogue";
import { buildMetadata } from "@/lib/seo";
import { HERO_POSITION, heroColourClass } from "@/lib/hero-framing";
import { lunchLearnHref } from "@/lib/lunch-learn";
import type { SanityBlock } from "@/types/sanity";

// Sanity is the CMS for this page's copy, so the page has to be allowed to go
// and re-read it. Without a revalidate the route is prerendered once at build
// and never asks Sanity again — an editor's change sits invisible until the
// next deploy. One hour, matching the product pages.
export const revalidate = 3600;

// Only the applications in lib/applications.ts exist. Left at the default (true), an unknown
// slug was rendered on demand behind the root loading.tsx Suspense boundary,
// so a 200 had already gone out before notFound() ran: /applications/<anything>
// answered 200 with the homepage's title and canonical, and Google kept
// crawling old WordPress addresses like /applications/bike-bus-lanes as pages.
// The same fix /blog/[slug] got in PR #54. It is safe here because the page
// can only render a slug the code knows: Sanity overrides fields on an
// existing entry and cannot add one (checked 23 Sep 2026: Sanity holds 14
// products and 20 applications, all of them in the code).
export const dynamicParams = false;

// Slugs whose folder route exists beside [slug]. public-art/page.tsx only hands
// its slug back to this template (since 28 Sep 2026), so the page is the same.
const DEDICATED_PAGES = new Set(["public-art"]);

export async function generateStaticParams() {
  return applications
    .filter((a) => !DEDICATED_PAGES.has(a.slug))
    .map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const application = await getMergedApplication(slug);
  if (!application) return {};
  const featured = applicationImages[slug] ? resolveImage(applicationImages[slug]) : null;
  const heroSrc = application.heroPhoto?.src ?? featured?.src ?? application.imageUrl;
  return buildMetadata({
    title: application.seoTitle ?? application.name,
    // The SEO description from Studio (or the code's) when it fits in whole
    // sentences, else the application's own one-liner: at most 155 characters,
    // never cut mid-word. Until 30 Sep 2026 the fallback was the one-liner
    // plus the first 120 characters of the body, cut mid-word and ending in
    // "…" (QA E1, on 22 pages).
    description: metaDescription(application.seoDescription, application.shortDesc),
    slug: `applications/${application.slug}`,
    image: isSanityImage(heroSrc) ? sanityOgImage(heroSrc) : heroSrc,
  });
}

/**
 * A meta description of whole sentences, at most `max` characters: the SEO
 * field when it fits, or cut back to the last sentence end that fits; when
 * its one sentence runs past the limit, the page's one-liner stands in, by
 * the same rule. Never mid-word, never "…". Twin of the helper in
 * app/products/[slug]/page.tsx (a page file cannot export it; 30 Sep 2026).
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

export default async function ApplicationPage({ params }: Props) {
  const { slug } = await params;
  const application = await getMergedApplication(slug);
  if (!application) notFound();

  const spread = applicationCatalogueFor(application.slug);

  // The hero photo and the gallery come from Sanity, where Doug curates them
  // (lib/photos.ts). An application whose Sanity document has none falls back
  // to exactly what this page showed before: imageUrl, and the application's
  // /public folder scanned at build time (lib/asset-scan.ts,
  // docs/IMAGE-WORKFLOW.md).
  //
  // Since 28 Sep 2026 the code's hero for an application is its entry in
  // applicationImages (lib/featured-images.ts), as a product's is in
  // productImages; imageUrl is only the last fallback. One photo per
  // application everywhere: this banner, the Sanity hero the photo sync
  // writes (scripts/lib/photo-plan.ts), the homepage card and the sitemap.
  const featured = applicationImages[application.slug] ? resolveImage(applicationImages[application.slug]) : null;
  const bannerSrc = featured?.src ?? application.imageUrl;
  const hero: Photo = application.heroPhoto ?? { src: bannerSrc, alt: featured?.alt ?? application.name };
  const galleryPhotos: Photo[] = application.galleryPhotos ?? (() => {
    const fromFolder = galleryFor(bannerSrc, application.gallery, `images/applications/${application.slug}`);
    return (fromFolder.length > 0 ? fromFolder : [bannerSrc]).map((src) => ({
      src,
      alt: altFor(src, `${application.name} surface systems by HUB, Canadian installation`),
      // Written for a reader looking at the photo, not a copy of the alt. Visible
      // text beside an image outweighs the alt attribute for Google Images and
      // for the AI crawlers.
      caption: seoCaption(src) ?? altFor(src, application.name),
    }));
  })();
  const gallery: GalleryImage[] = galleryPhotos.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption ?? p.alt }));

  const relatedProductData = application.relatedProducts
    .map((s) => products.find((p) => p.slug === s))
    .filter(Boolean) as typeof products;

  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: application.name,
    description: application.description,
    provider: { "@type": "Organization", name: "HUB Surface Systems" },
    url: `https://hubss.com/applications/${application.slug}`,
    // ImageObject nodes rather than a bare URL — see the note on the product
    // page. A URL string is eligible for a rich result and nothing else; these
    // carry the caption, credit, keywords, and licence that make the photo
    // competitive in Google Images.
    image: [
      photoObject(hero, { representativeOfPage: true }),
      ...galleryPhotos.slice(1, 12).map((p) => photoObject(p)),
    ],
  };

  /** The gallery as a named, addressable set — see the product page note. */
  const gallerySchema = gallery.length > 1 ? {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `https://hubss.com/applications/${application.slug}#gallery`,
    name: `${application.name} installation photographs`,
    description: `Field photography of ${application.name.toLowerCase()} installed by HUB Surface Systems across Canada.`,
    url: `https://hubss.com/applications/${application.slug}`,
    isPartOf: { "@id": `https://hubss.com/applications/${application.slug}` },
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
      { "@type": "ListItem", position: 2, name: "Applications", item: "https://hubss.com/applications" },
      { "@type": "ListItem", position: 3, name: application.name, item: `https://hubss.com/applications/${application.slug}` },
    ],
  };

  // Hero framing follows the photo (lib/hero-framing.ts).
  const heroPosition = HERO_POSITION[hero.origin ?? hero.src] ?? "center 55%";

  // "How it works" without the sentence the spread just said. Public Art's
  // description opens with the spread's pull line word for word ("The street
  // is one of the largest untapped canvases in any city."), so the page said
  // it twice in one screen (QA B4, E19, 30 Sep 2026). Only a whole opening
  // sentence that matches is dropped; Parking Lots and Townhomes extend the
  // pull line with a colon and keep theirs.
  const body = spread ? withoutRepeatedOpening(application.description, application.descriptionBlocks, [spread.statement, spread.title]) : { text: application.description, blocks: application.descriptionBlocks };
  // The application's name inside a sentence: "Designing for Parking Lots"
  // read as a heading pasted into prose (QA pa#33).
  const nameInSentence = inSentence(application.name);
  // The ask and the session topic, hand-written where the template reads
  // wrong: "Planning airports?", "Planning LEED & urban heat island?" (QA C6).
  const ask = ASKS[application.slug] ?? { prompt: `Planning ${nameInSentence}?`, topic: nameInSentence };

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <JsonLd data={applicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      {gallerySchema && <JsonLd data={gallerySchema} />}
      <Nav />

      {/* Hero banner: darkened only where the type sits, with a light colour
          lift (Vern, 27 Sep 2026: "hero images... quite dark and muted"). */}
      <div data-hero className="relative overflow-hidden" style={{ height: "clamp(360px, 52vh, 560px)" }}>
        <PhotoImage
          src={hero.src}
          alt={hero.alt}
          fill
          className={`object-cover ${heroColourClass(hero)}`}
          style={{ objectPosition: heroPosition }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,13,22,0.12) 0%, rgba(8,13,22,0.04) 38%, rgba(8,13,22,0.36) 64%, rgba(8,13,22,0.84) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(8,13,22,0.46) 0%, rgba(8,13,22,0.16) 40%, transparent 62%)" }} />
        {/* Phones only. On a phone the name wraps and the text block climbs to
            about 40% of the banner's height, where the scrims above are at
            their lightest: on LEED & Urban Heat Island the label and the first
            line of the name sat on a white planter at about 2.5:1 (QA, 28 Sep
            2026). This band darkens that height; from sm up it is not drawn,
            so the desktop photo keeps its colour. */}
        <div className="absolute inset-0 sm:hidden" style={{ background: "linear-gradient(180deg, rgba(8,13,22,0) 16%, rgba(8,13,22,0.5) 34%, rgba(8,13,22,0.56) 62%, rgba(8,13,22,0.3) 100%)" }} />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
            {/* Cream, not orange: the orange label measured 2 to 3:1 over the
                photos (QA pa#13). */}
            <p
              className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "rgba(245,240,235,0.92)", textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}
            >
              HUB application
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
              {application.name}
            </h1>
            <div className="mb-4" style={{ width: 56, height: 3, background: "#f97316", borderRadius: 2 }} aria-hidden="true" />
            <p
              className="text-base sm:text-lg max-w-xl leading-relaxed"
              style={{ color: "rgba(245,240,235,0.9)", textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
            >
              {application.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Under the hero, the reading sits on paper, as on the product pages
          (Vern, 27 Sep 2026). */}
      <div data-surface="paper">
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 min-w-0">
              {/* The catalogue's spread first, where the printed book has one:
                  headline, pull line, and the SPECIFY list naming which systems
                  go in this work and why, each a link to its product. */}
              {spread && <ApplicationSpread entry={spread} applicationName={application.name} />}

              {/* "How it works", matching the product pages. */}
              <h2 className="text-2xl sm:text-3xl font-bold mb-5" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                How it works
              </h2>
              {body.blocks ? (
                <RichText value={body.blocks} />
              ) : (
                <p className="mb-12 leading-[1.85]" style={{ color: "var(--text-body)", fontSize: "clamp(1rem, 1.8vw, 1.075rem)", maxWidth: "65ch" }}>
                  {body.text}
                </p>
              )}

              {/* The ask, after the copy, as on the product pages. Until
                  28 Sep 2026 this bar sat straight under the hero and its
                  orange "See the systems" button went to /contact (QA pa#1,
                  pa#22). The session is booked about this work: the topic
                  rides into the form and the request email. */}
              <div
                className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-2 relative overflow-hidden"
                style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.24)" }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: "linear-gradient(180deg, #F97316, #EAB308)" }} />
                <div className="relative pl-3">
                  <p className="font-bold text-lg leading-snug" style={{ color: "var(--text-primary)" }}>
                    {ask.prompt}
                  </p>
                  <p className="text-sm mt-1 max-w-md" style={{ color: "var(--text-secondary)" }}>
                    A free Lunch &amp; Learn takes your team through the systems for this work, with samples on the table.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 relative flex-shrink-0">
                  <Link href={lunchLearnHref(ask.topic, "application")}
                    className="px-5 rounded-lg text-sm font-bold transition-[filter] hover:brightness-110 inline-flex items-center"
                    style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "var(--on-accent)", boxShadow: "0 4px 16px rgba(249,115,22,0.28)", minHeight: "44px" }}>
                    Book a Lunch &amp; Learn
                  </Link>
                  <Link href="/contact"
                    className="px-5 rounded-lg text-sm font-semibold transition-colors inline-flex items-center hover:bg-[var(--ink-04)]"
                    style={{ background: "transparent", color: "var(--text-primary)", border: "1px solid var(--ink-15)", minHeight: "44px" }}>
                    Talk to a specifier
                  </Link>
                </div>
              </div>
            </div>

            {/* Right. Where the book's spread lists the systems (SPECIFY, with
                reasons and links), the sidebar no longer lists them again (QA
                pa#22); it carries the way to a price instead. Pages without a
                spread keep the systems here. The thumbnails went through
                /_next/image, so the list is typographic now (QA pa#40). */}
            <aside className="min-w-0">
              {/* Two cards on the four pages without a spread, one on the
                  sixteen with one: the systems list used to sit inside the
                  pricing card with "Pricing and installers" folded in under
                  it, so those four sidebars read as a different design
                  (QA C25, 30 Sep 2026). The pricing card is now the same
                  card everywhere; the systems get their own. */}
              <div className="lg:sticky lg:top-24 space-y-4">
              {!spread && relatedProductData.length > 0 && (
                <div className="rounded-xl p-6 sm:p-7 relative overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />
                  <h2 className="font-bold text-lg mb-4" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    Systems for {nameInSentence}
                  </h2>
                  <ul>
                    {relatedProductData.map((product, i) => (
                      <li key={product.slug} style={{ borderTop: "1px solid var(--ink-06)", borderBottom: i === relatedProductData.length - 1 ? "1px solid var(--ink-06)" : undefined }}>
                        <Link
                          href={`/products/${product.slug}`}
                          className="group flex items-center gap-3 py-3 transition-colors"
                          style={{ minHeight: 52 }}
                        >
                          <span className="flex-1 min-w-0">
                            <span className="block font-semibold text-sm transition-colors group-hover:text-[var(--accent-text)]" style={{ color: "var(--text-primary)" }}>{product.name}</span>
                            <span className="block text-xs leading-snug mt-0.5" style={{ color: "var(--text-secondary)" }}>{product.shortDesc}</span>
                          </span>
                          <svg className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "var(--accent-text)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="rounded-xl p-6 sm:p-7 relative overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />
                <h2 className="font-bold text-base mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Pricing and installers
                </h2>
                <p className="text-[13.5px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  Your regional office prices the project, matches the system to the site and puts you in touch with a certified installer.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <a href="tel:+14165409287" className="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--ink-04)]" style={{ border: "1px solid var(--border-color)", minHeight: 44 }}>
                    <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>East</span>
                    <span className="block text-[13.5px] font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>416-540-9287</span>
                  </a>
                  <a href="tel:+16043098212" className="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--ink-04)]" style={{ border: "1px solid var(--border-color)", minHeight: 44 }}>
                    <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>West</span>
                    <span className="block text-[13.5px] font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>604-309-8212</span>
                  </a>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold hover:underline underline-offset-2" style={{ color: "var(--accent-text)", minHeight: 44 }}>
                  Send a project enquiry
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* The work, full width on the second paper tone, as on the product
          pages. The line under it was "{Name} photographed on site across
          Canada" (QA pa#32). */}
      <section style={{ background: "var(--bg-section-asphalt)", borderTop: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1.5" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            The work
          </h2>
          <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            HUB installations, photographed on site.
          </p>
          <GalleryGrid images={gallery} />
        </div>
      </section>

      {/* Feature callout: residential driveways page only */}
      {slug === "residential-driveways" && <ResidentialDriveways />}
      </div>
      <LunchLearn compact topic={ask.topic} from="application" />
      <Footer />
    </main>
  );
}

/**
 * The "Planning X?" line of the ask bar, and the session topic the Lunch &
 * Learn band and the booking link carry ("A free working session on X for
 * your team", the chip on the form, the request email), where the name
 * dropped into the template read wrong (QA C6, 30 Sep 2026): "Planning
 * airports?", "Planning LEED & urban heat island?", "Planning townhomes?".
 * The other fifteen pages keep the template.
 */
const ASKS: Record<string, { prompt: string; topic: string }> = {
  airports: { prompt: "Planning an airfield re-marking?", topic: "airfield re-marking" },
  "pedestrian-safety": { prompt: "Planning a pedestrian safety upgrade?", topic: "pedestrian safety upgrades" },
  "leed-urban-heat-island": { prompt: "Working toward LEED v5 credits?", topic: "LEED v5 credits" },
  townhomes: { prompt: "Planning a townhome development?", topic: "townhome developments" },
  "commercial-spaces": { prompt: "Planning a commercial entry or plaza?", topic: "commercial entries and plazas" },
};

/**
 * The description without an opening sentence the spread already printed.
 * `said` are the spread's lines; a match is the whole first sentence, after
 * case, punctuation and spacing are ignored. Works on the plain text and on
 * the Studio rich text alike: in the blocks, the first span of the first
 * block loses that prefix (and an emptied block goes), nothing else changes.
 */
function withoutRepeatedOpening(
  text: string,
  blocks: SanityBlock[] | undefined,
  said: string[],
): { text: string; blocks?: SanityBlock[] } {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const firstSentence = (s: string) => s.match(/^\s*[^.!?]+[.!?]+/)?.[0] ?? "";
  const repeated = (s: string) => {
    const first = firstSentence(s);
    return first && said.some((line) => norm(line) === norm(first)) ? first : "";
  };
  const strip = (s: string) => s.slice(repeated(s).length).replace(/^\s+/, "");
  if (!blocks?.length) return { text: strip(text) };
  const [first, ...rest] = blocks;
  const span = first.children?.[0];
  if (!span?.text || !repeated(span.text)) return { text, blocks };
  const trimmed = strip(span.text);
  const children = trimmed ? [{ ...span, text: trimmed }, ...first.children.slice(1)] : first.children.slice(1);
  const kept = children.some((c) => c.text.trim()) ? [{ ...first, children }, ...rest] : rest;
  return { text: strip(text), blocks: kept.length ? kept : undefined };
}

/**
 * An application name as it reads inside a sentence: "Parking Lots" becomes
 * "parking lots", "LEED & Urban Heat Island" keeps LEED. Words in capitals
 * (acronyms) and the proper nouns below keep their case.
 */
const KEEP_CASE = new Set(["LEED", "HUB", "BRT", "Canada", "Canadian"]);
function inSentence(name: string): string {
  return name
    .split(" ")
    .map((w) => (KEEP_CASE.has(w) || (w.length > 1 && w === w.toUpperCase()) ? w : w.toLowerCase()))
    .join(" ");
}
