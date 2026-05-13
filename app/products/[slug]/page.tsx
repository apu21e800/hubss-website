import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import DocumentDownloads from "@/components/sections/DocumentDownloads";
import GalleryGrid, { type GalleryImage } from "@/components/ui/GalleryGrid";
import ComparisonTable from "@/components/sections/ComparisonTable";
import JsonLd from "@/components/ui/JsonLd";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { productImages, resolveImage } from "@/lib/featured-images";
import { buildMetadata } from "@/lib/seo";
import { getProductFamily } from "@/lib/product-taxonomy";

export async function generateStaticParams() {
  return products.filter((p) => !p.comingSoon).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return buildMetadata({
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? (product.shortDesc + " — " + product.description.slice(0, 120) + "…"),
    slug: `products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product || product.comingSoon) notFound();

  // Gallery — use product.gallery if available, otherwise fall back to featured image
  const productGallery = product.gallery ?? [];
  const featuredImg = productImages[product.slug] ? resolveImage(productImages[product.slug]) : null;
  const galleryLabels = ["Overview", "Installation", "Detail", "Completed", "In Service", "Close-up"];

  // Prefer product.gallery, fall back to featured image or product imageUrl
  const gallerySources = productGallery.length > 0 ? productGallery : (featuredImg ? [featuredImg.src] : [product.imageUrl]);
  const gallery: GalleryImage[] = gallerySources.map((src, idx) => ({
    src,
    alt: `${product.name} — ${galleryLabels[idx % galleryLabels.length]}`,
    caption: `${product.name} · ${galleryLabels[idx % galleryLabels.length]}`,
  }));

  const relatedAppData = product.relatedApplications
    .map((s) => applications.find((a) => a.slug === s))
    .filter(Boolean) as typeof applications;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "HUB Surface Systems" },
    url: `https://hubss.com/products/${product.slug}`,
    image: product.imageUrl,
  };

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
      <Nav />

      {/* Hero banner */}
      <div data-hero className="relative overflow-hidden" style={{ height: "clamp(360px, 52vh, 560px)" }}>
        {/* TODO: doug-review-image — Doug flagged the TPXD hero/overview ("This is TrafficPatterns, not TPXD — no stamping"). Confirm correct TPXD image and replace product.imageUrl for traffic-patterns-xd in lib/products.ts. */}
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          // Subject-bias crop — pavement surface is the subject, sky/context is background.
          className="object-cover"
          style={{ objectPosition: product.heroPosition ?? "center 62%" }}
          priority
          sizes="100vw"
        />
        {/* Hero overlays lightened per Doug review (TPXD specifically — applied product-wide for consistency) */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,13,22,0.4) 0%, rgba(8,13,22,0.5) 55%, rgba(8,13,22,0.82) 100%)" }} />
        {/* Left text scrim for legibility */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(92deg, rgba(8,13,22,0.38) 0%, rgba(8,13,22,0.14) 45%, transparent 65%)" }} />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#f97316" }}>
              {product.eyebrow ?? getProductFamily(product.slug)}
            </p>
            <h1
              className="font-black leading-[1.05] mb-3"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.75rem)",
                color: "#F5F0EB",
                textShadow: "0 2px 24px rgba(0,0,0,0.5)",
                letterSpacing: "-0.025em",
              }}
            >
              {product.name}
            </h1>
            <p
              className="text-base sm:text-lg max-w-xl leading-relaxed"
              style={{ color: "rgba(255,255,255,0.78)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
            >
              {product.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative" style={{ background: "var(--bg-dark)" }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

        {/* Specify CTA bar */}
        <div
          className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-10 relative overflow-hidden"
          style={{
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.22)",
            boxShadow: "0 1px 24px rgba(249,115,22,0.08)",
          }}
        >
          {/* Left accent bar */}
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
              style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.14)", minHeight: "44px" }}>
              Book a Lunch &amp; Learn
            </Link>
            {/* Product page secondary CTA: "See the Systems" is wrong here (already on one) — link to gallery instead. */}
            <Link href="/gallery"
              className="px-5 rounded-lg text-sm font-bold transition-all inline-flex items-center"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(249,115,22,0.32)", minHeight: "44px" }}>
              See Project Gallery →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: description + gallery */}
          <div className="lg:col-span-2">

            {/* Brand mark — shown above the description when a brandLogo is defined */}
            {product.brandLogo && (
              <div className="mb-6">
                <Image
                  src={product.brandLogo.src}
                  alt={product.brandLogo.alt}
                  width={product.brandLogo.width}
                  height={product.brandLogo.height}
                  style={{ width: product.brandLogo.width, height: "auto", objectFit: "contain", objectPosition: "left center" }}
                  unoptimized
                />
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl font-bold mb-5" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>About {product.name}</h2>
            <p className="mb-12 leading-[1.85]" style={{ color: "var(--text-body)", fontSize: "clamp(1rem, 1.8vw, 1.075rem)", maxWidth: "65ch" }}>
              {product.description}
            </p>

            {/* Gallery */}
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Gallery</h2>
            {/* TODO: doug-review-image — Doug flagged /products/premark detail image #2 (premark-03.jpg) as "Not PreMark". Audit each product's gallery[] in lib/products.ts and remove or replace incorrect images. */}
            <GalleryGrid images={gallery} />

            <DocumentDownloads slug={product.slug} />
          </div>

          {/* Right: specs + CTA */}
          <div>
            {/* Brand logo badge in sidebar */}
            {product.brandLogo && (
              <div
                className="rounded-xl mb-6 flex items-center justify-start"
                style={{
                  padding: "0.5rem 0",
                }}
              >
                <Image
                  src={product.brandLogo.src}
                  alt={product.brandLogo.alt}
                  width={320}
                  height={120}
                  style={{ width: "100%", height: "auto", maxWidth: 320, objectFit: "contain", objectPosition: "left center" }}
                  unoptimized
                />
              </div>
            )}
            <div className="rounded-xl p-8 mb-8 sticky top-24 relative overflow-hidden" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Orange top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />
              <h3 className="font-bold text-lg mb-6" style={{ color: "#F5F0EB" }}>Product Features</h3>
              <div className="space-y-4">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between text-sm" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "12px" }}>
                    <span style={{ color: "#9CA3AF" }}>{spec.label}</span>
                    <span className="font-semibold text-right max-w-[60%]" style={{ color: "#F5F0EB" }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
              {/* CTAs removed per Doug review — quote and L&L now live in the sticky bottom bar. */}
            </div>
          </div>
        </div>

        {/* Paint Fades comparison — StreetBond + TrafficPatterns only */}
        {(slug === "streetbond" || slug === "traffic-patterns") && (
          <div className="mt-16">
            <ComparisonTable />
          </div>
        )}

        {/* StreetBondSR LEED callout */}
        {slug === "streetbondsr" && (
          <div
            className="mt-16 rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(134,197,82,0.25)", background: "rgba(134,197,82,0.04)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left — copy */}
              <div className="p-10 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/products/streetbondsr/leed-logo.svg"
                    alt="LEED — U.S. Green Building Council"
                    style={{ width: 72, height: 72, objectFit: "contain", filter: "invert(1) brightness(0.75) sepia(1) hue-rotate(60deg) saturate(2)" }}
                  />
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#86c552" }}>Green Building Credentials</p>
                    <h3 className="text-2xl font-bold" style={{ color: "#F5F0EB", letterSpacing: "-0.02em" }}>
                      Contributes to LEED Points
                    </h3>
                  </div>
                </div>
                <p className="leading-[1.8] mb-6" style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)", maxWidth: "52ch" }}>
                  StreetBondSR&apos;s high Solar Reflectance Index (SRI) qualifies for{" "}
                  <strong style={{ color: "#F5F0EB" }}>LEED v4 SS Credit: Heat Island Reduction</strong> under the
                  U.S. Green Building Council framework. The coating reflects solar radiation rather than absorbing it,
                  reducing surface temperature relative to standard dark asphalt and lowering radiant heat loads on adjacent buildings.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Credit Category", value: "Sustainable Sites" },
                    { label: "Applicable Rating", value: "LEED BD+C, ID+C, O+M" },
                    { label: "Credit Pathway", value: "High-SRI paving materials" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl p-4" style={{ background: "rgba(134,197,82,0.08)", border: "1px solid rgba(134,197,82,0.15)" }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(134,197,82,0.7)" }}>{label}</p>
                      <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="px-6 py-3 rounded-xl text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, #86c552 0%, #6aad3a 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(134,197,82,0.3)" }}
                  >
                    Request LEED Documentation →
                  </Link>
                  <Link
                    href="/lunch-learn"
                    className="px-6 py-3 rounded-xl text-sm font-semibold"
                    style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.14)" }}
                  >
                    Book a Lunch &amp; Learn
                  </Link>
                </div>
              </div>

              {/* Right — stat pillars. borderTop on mobile (stacked), borderLeft on lg+ (side-by-side). */}
              <div
                className="p-10 lg:p-12 flex flex-col justify-center gap-5 border-t border-t-[rgba(134,197,82,0.15)] lg:border-t-0 lg:border-l lg:border-l-[rgba(134,197,82,0.15)]"
              >
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(134,197,82,0.6)" }}>
                  Why It Matters
                </p>
                {[
                  {
                    icon: "🌡️",
                    heading: "Cooler Surfaces",
                    body: "Dark asphalt can reach 60–70°C in direct sun. High-SRI coatings reflect solar energy off the surface, reducing pavement temperature and the heat radiated back to pedestrians and cyclists.",
                  },
                  {
                    icon: "🏙️",
                    heading: "Urban Heat Island Mitigation",
                    body: "Cities run 2–4°C warmer than surrounding rural areas due to heat-absorbing surfaces. High-SRI pavement coatings are one of the established mitigation strategies in municipal climate action plans.",
                  },
                  {
                    icon: "⚡",
                    heading: "Building Energy Performance",
                    body: "Cooler adjacent pavement reduces radiant heat loads on nearby buildings, contributing to lower cooling energy consumption — recognized as a co-benefit in LEED whole-building assessments.",
                  },
                ].map(({ icon, heading, body }) => (
                  <div key={heading} className="flex gap-4">
                    <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                    <div>
                      <p className="font-bold mb-1" style={{ color: "#F5F0EB", fontSize: "0.95rem" }}>{heading}</p>
                      <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.58)", fontSize: "0.875rem" }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Applications this product is used for */}
        {relatedAppData.length > 0 && (
          <div className="mt-16 pt-16" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p
                  className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
                  style={{ color: "#f97316" }}
                >
                  Where It&apos;s Used
                </p>
                <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Applications
                </h2>
              </div>
              <Link
                href="/applications"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150 hover:text-white"
                style={{ color: "var(--text-muted)" }}
              >
                All applications
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedAppData.map((app) => (
                <Link
                  key={app.slug}
                  href={`/applications/${app.slug}`}
                  className="group relative overflow-hidden rounded-lg flex flex-col"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-faint)" }}
                >
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden" style={{ height: 130 }}>
                    {/* TODO: doug-review-image — Doug noted certain related-app card images don't match the parent product:
                          • /products/traffic-patterns + "crosswalks" card → shown image is TPXD work, swap to a TP install
                          • /products/traffic-patterns-xd + "bike-lanes" card → swap to a non-bike-lane install (Doug suggested Winners entrance)
                          • /products/decomark + "crosswalks" card → was TPXD work; crosswalks dropped from DM relatedApplications, but verify image source
                        Image source is application.imageUrl shared site-wide; a per-product override would require a schema change. */}
                    <Image
                      src={app.imageUrl}
                      alt={app.name}
                      fill
                      style={{ objectPosition: "center 60%" }}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-300 opacity-50 group-hover:opacity-70"
                      style={{ background: "rgba(0,0,0,0.4)" }}
                    />
                    {/* Name badge overlaid */}
                    <div className="absolute inset-0 flex items-end p-3">
                      <div>
                        <div
                          className="w-5 h-px mb-2 transition-all duration-200 group-hover:w-8"
                          style={{ background: "#f97316" }}
                        />
                        <p
                          className="font-bold text-sm leading-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {app.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Desc */}
                  <div className="px-4 py-3 flex-1 flex flex-col">
                    <p
                      className="text-xs leading-relaxed flex-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {app.shortDesc.slice(0, 80)}{app.shortDesc.length > 80 ? "…" : ""}
                    </p>
                    <span
                      className="mt-2 text-[11px] font-semibold flex items-center gap-1 uppercase tracking-wider transition-colors duration-150 group-hover:text-[#fb923c]"
                      style={{ color: "#f97316" }}
                    >
                      Explore
                      <svg className="w-2.5 h-2.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>{/* /max-w-7xl content */}
      </div>{/* /texture outer wrapper */}
      <LunchLearn />
      <Footer />
    </main>
  );
}
