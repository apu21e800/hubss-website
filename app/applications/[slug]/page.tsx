import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import GalleryGrid, { type GalleryImage } from "@/components/ui/GalleryGrid";
import ResidentialDriveways from "@/components/sections/ResidentialDriveways";
import JsonLd from "@/components/ui/JsonLd";
import { applications } from "@/lib/applications";
import { products } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

// Exclude slugs that have their own dedicated page (e.g. /applications/public-art/page.tsx)
const DEDICATED_PAGES = new Set(["public-art"]);

export async function generateStaticParams() {
  return applications
    .filter((a) => !DEDICATED_PAGES.has(a.slug))
    .map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const application = applications.find((a) => a.slug === slug);
  if (!application) return {};
  return buildMetadata({
    title: application.seoTitle ?? application.name,
    description: application.seoDescription ?? (application.shortDesc + " — " + application.description.slice(0, 120) + "…"),
    slug: `applications/${application.slug}`,
  });
}

export default async function ApplicationPage({ params }: Props) {
  const { slug } = await params;
  const application = applications.find((a) => a.slug === slug);
  if (!application) notFound();

  // Gallery — use application.gallery if available, otherwise fall back to featured image
  const appGallery = application.gallery ?? [];
  const galleryLabels = ["Overview", "Installation", "Detail", "Completed", "In Service", "Close-up"];

  const gallerySources = appGallery.length > 0 ? appGallery : [application.imageUrl];
  const gallery: GalleryImage[] = gallerySources.map((src, idx) => ({
    src,
    alt: `${application.name} — ${galleryLabels[idx % galleryLabels.length]}`,
    caption: `${application.name} · ${galleryLabels[idx % galleryLabels.length]}`,
  }));

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
    image: application.imageUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hubss.com" },
      { "@type": "ListItem", position: 2, name: "Applications", item: "https://hubss.com/applications" },
      { "@type": "ListItem", position: 3, name: application.name, item: `https://hubss.com/applications/${application.slug}` },
    ],
  };

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <JsonLd data={applicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Nav />

      {/* Hero banner */}
      <div data-hero className="relative overflow-hidden" style={{ height: "clamp(360px, 52vh, 560px)" }}>
        <Image
          src={application.imageUrl}
          alt={application.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,13,22,0.55) 0%, rgba(8,13,22,0.62) 55%, rgba(8,13,22,0.88) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(92deg, rgba(8,13,22,0.48) 0%, rgba(8,13,22,0.18) 45%, transparent 65%)" }} />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#f97316" }}>
              HUB Application
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
              {application.name}
            </h1>
            <p
              className="text-base sm:text-lg max-w-xl leading-relaxed"
              style={{ color: "rgba(255,255,255,0.78)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
            >
              {application.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative" style={{ background: "var(--bg-dark)" }}>
        {/* Texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/textures/stamped-asphalt-texture.webp')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center top",
            opacity: 0.04,
            mixBlendMode: "luminosity",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">

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
              <p className="font-bold text-lg leading-snug" style={{ color: "var(--text-primary)" }}>Designing for {application.name}?</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Product matching, technical data, and certified installer support across Canada.</p>
            </div>
            <div className="flex flex-wrap gap-3 relative flex-shrink-0">
              <Link href="/lunch-learn"
                className="px-5 rounded-lg text-sm font-semibold transition-all inline-flex items-center"
                style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.14)", minHeight: "44px" }}>
                Book a Lunch &amp; Learn
              </Link>
              <Link href="/contact"
                className="px-5 rounded-lg text-sm font-bold transition-all inline-flex items-center"
                style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 4px 16px rgba(249,115,22,0.32)", minHeight: "44px" }}>
                See the Systems →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left: description + gallery */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold mb-5" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>About {application.name}</h2>
              <p className="mb-12 leading-[1.85]" style={{ color: "var(--text-body)", fontSize: "clamp(1rem, 1.8vw, 1.075rem)", maxWidth: "65ch" }}>
                {application.description}
              </p>

              {/* Gallery */}
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Gallery</h2>
              <GalleryGrid images={gallery} />
            </div>

            {/* Right: related products */}
            <div>
              <div className="rounded-xl p-8 mb-8 sticky top-24 relative overflow-hidden" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* Orange top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />
                <h3 className="font-bold text-lg mb-6" style={{ color: "#F5F0EB" }}>Recommended Products</h3>
                <div className="space-y-3">
                  {relatedProductData.map((product) => (
                    <Link
                      key={product.slug}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-3 px-3 rounded-lg transition-all group hover:bg-white/5"
                      style={{ border: "1px solid rgba(255,255,255,0.06)", minHeight: "52px" }}
                    >
                      <div className="relative overflow-hidden rounded-md flex-shrink-0" style={{ width: 48, height: 48 }}>
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: "#F5F0EB" }}>{product.name}</p>
                        <p className="text-xs truncate" style={{ color: "#6B7280" }}>{product.shortDesc}</p>
                      </div>
                      <svg className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#f97316" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full text-center font-bold py-4 rounded-lg mt-8 transition-all text-sm"
                  style={{
                    background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
                  }}
                >
                  See the Systems
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/lunch-learn"
                  className="flex items-center justify-center gap-2 w-full text-center font-semibold py-3.5 rounded-lg mt-3 transition-all text-sm hover:border-orange-500/40 hover:text-white"
                  style={{ background: "transparent", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  Book a Lunch &amp; Learn
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* Feature callout — residential driveways page only */}
      {slug === "residential-driveways" && <ResidentialDriveways />}
      <LunchLearn />
      <Footer />
    </main>
  );
}
