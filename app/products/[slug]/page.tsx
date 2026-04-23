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
  // Include comingSoon products so they get a proper page instead of a 404
  return products.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return buildMetadata({
    title: product.name,
    description: product.shortDesc + " — " + product.description.slice(0, 120) + "…",
    slug: `products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  // Coming-soon products get a placeholder page
  if (product.comingSoon) {
    return (
      <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
            Coming Soon
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {product.name}
          </h1>
          <p className="text-lg max-w-xl mb-4" style={{ color: "var(--text-secondary)" }}>
            {product.shortDesc}
          </p>
          <p className="text-base max-w-2xl mb-10" style={{ color: "var(--text-secondary)" }}>
            {product.description}
          </p>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Full product details and specifications are coming soon. Contact us for availability.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/contact" className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:brightness-110"
              style={{ background: "linear-gradient(90deg, #F97316, #ea8c00)" }}>
              Contact Us
            </Link>
            <Link href="/products" className="px-6 py-3 rounded-lg font-medium transition-colors"
              style={{ color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
              ← All Products
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

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

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <JsonLd data={productSchema} />
      <Nav />

      {/* Hero banner — prefer curated featured image, fall back to product.imageUrl */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={featuredImg?.src ?? product.imageUrl}
          alt={featuredImg?.alt ?? product.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(26,26,26,0.7)" }} />{/* overlay — keep hardcoded */}
        <div className="absolute inset-0 flex items-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#f97316" }}>
              {getProductFamily(product.slug)}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: "var(--text-primary)" }}>
              {product.name}
            </h1>
            <p className="text-lg mt-2" style={{ color: "var(--text-body)" }}>
              {product.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Main content — dark section with subtle asphalt texture overlay */}
      <div className="relative" style={{ background: "var(--bg-dark)" }}>
        {/* Texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/textures/stamped-asphalt-texture.webp')",
            backgroundSize: "480px auto",
            backgroundRepeat: "repeat",
            opacity: 0.02,
            mixBlendMode: "luminosity",
          }}
        />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">

        {/* Specify CTA bar */}
        <div className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2a1500 0%, #1a1000 60%)", border: "1px solid rgba(249,115,22,0.5)", boxShadow: "0 0 0 1px rgba(249,115,22,0.1), 0 4px 24px rgba(249,115,22,0.12)" }}>
          {/* Left orange accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: "linear-gradient(180deg, #F97316 0%, #EAB308 100%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(249,115,22,0.12) 0%, transparent 55%)" }} />
          <div className="relative pl-2">
            <p className="font-bold text-base" style={{ color: "#F5F0EB" }}>Ready to specify {product.name}?</p>
            <p className="text-sm mt-0.5" style={{ color: "#D1D5DB" }}>Get technical documentation, pricing, and installation support from our team.</p>
          </div>
          <div className="flex flex-wrap gap-3 relative">
            <Link href="/resources" className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:text-white"
              style={{ color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.18)" }}>
              Spec Sheets
            </Link>
            <Link href="/lunch-learn" className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:brightness-110"
              style={{ background: "linear-gradient(90deg, #F97316, #ea8c00)", color: "#fff", boxShadow: "0 2px 12px rgba(249,115,22,0.35)" }}>
              Book Lunch &amp; Learn →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: description + gallery */}
          <div className="lg:col-span-2">

            <h2 className="text-2xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>About {product.name}</h2>
            <p className="text-[16px] leading-relaxed mb-12" style={{ color: "var(--text-body)" }}>
              {product.description}
            </p>

            {/* Gallery */}
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Gallery</h2>
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
              <h3 className="font-bold text-lg mb-6" style={{ color: "#F5F0EB" }}>Specifications</h3>
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

              <Link
                href="/contact"
                className="block w-full text-center font-semibold py-4 rounded-lg mt-8 transition-all text-sm hover:brightness-110"
                style={{ background: "#f97316", color: "#fff" }}
              >
                Request Spec Sheet
              </Link>
              <Link
                href="/lunch-learn"
                className="block w-full text-center font-semibold py-4 rounded-lg mt-3 transition-all text-sm hover:border-[#F97316]/50 hover:text-white"
                style={{ background: "transparent", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                Book Lunch &amp; Learn
              </Link>
            </div>
          </div>
        </div>

        {/* Paint Fades comparison — StreetBond + TrafficPatterns only */}
        {(slug === "streetbond" || slug === "traffic-patterns") && (
          <div className="mt-16">
            <ComparisonTable />
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
                    <Image
                      src={app.imageUrl}
                      alt={app.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div
                      className="absolute inset-0 transition-