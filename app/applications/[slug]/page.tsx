import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import GalleryGrid, { type GalleryImage } from "@/components/ui/GalleryGrid";
import JsonLd from "@/components/ui/JsonLd";
import { applications } from "@/lib/applications";
import { products } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return applications.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const application = applications.find((a) => a.slug === slug);
  if (!application) return {};
  return buildMetadata({
    title: application.name,
    description: application.shortDesc + " — " + application.description.slice(0, 120) + "…",
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

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <JsonLd data={applicationSchema} />
      <Nav />

      {/* Hero banner */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={application.imageUrl}
          alt={application.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(26,26,26,0.7)" }} />
        <div className="absolute inset-0 flex items-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#f97316" }}>
              HUB Application
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: "var(--text-primary)" }}>
              {application.name}
            </h1>
            <p className="text-lg mt-2" style={{ color: "var(--text-body)" }}>
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
            backgroundImage: "url('/images/assets/details/asphalt-closeup-01.jpg')",
            backgroundSize: "480px auto",
            backgroundRepeat: "repeat",
            opacity: 0.04,
            mixBlendMode: "luminosity",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">

          {/* Specify CTA bar */}
          <div className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
            style={{ background: "#111111", border: "1px solid rgba(249,115,22,0.2)" }}>
            <div>
              <p className="font-semibold text-base" style={{ color: "#F5F0EB" }}>Interested in {application.name}?</p>
              <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>Get product recommendations, technical documentation, and installation support.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/resources" className="px-4 py-2 rounded-lg text-sm transition-all hover:text-white border border-white/15 hover:border-orange-500/50"
                style={{ color: "#D1D5DB" }}>
                Technical Specs
              </Link>
              <Link href="/lunch-learn" className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: "#F97316", color: "#fff" }}>
                Book Lunch &amp; Learn
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left: description + gallery */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>About {application.name}</h2>
              <p className="text-[16px] leading-relaxed mb-12" style={{ color: "var(--text-body)" }}>
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
                      className="flex items-center gap-3 p-3 rounded-lg transition-all group hover:bg-white/5"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
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
                  className="block w-full text-center font-semibold py-4 rounded-lg mt-8 transition-all text-sm hover:brightness-110"
                  style={{ background: "#f97316", color: "#fff" }}
                >
                  Request a Quote
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

          {/* Related products grid at bottom */}
          {relatedProductData.length > 0 && (
            <div className="mt-16 pt-16" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p
                    className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
                    style={{ color: "#f97316" }}
                  >
                    Specified Products
                  </p>
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Products for This Application
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150 hover:text-white"
                  style={{ color: "var(--text-muted)" }}
                >
                  All products
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProductData.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/products/${product.slug}`}
                    className="group relative overflow-hidden rounded-lg flex flex-col"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-faint)" }}
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden" style={{ height: 130 }}>
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div
                        className="absolute inset-0 transition-opacity duration-300 opacity-50 group-hover:opacity-70"
                        style={{ background: "rgba(0,0,0,0.4)" }}
                      />
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
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Desc */}
                    <div className="px-4 py-3 flex-1 flex flex-col">
                      <p
                        className="text-[0.72rem] leading-relaxed flex-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {product.shortDesc.slice(0, 80)}{product.shortDesc.length > 80 ? "…" : ""}
                      </p>
                      <span
                        className="mt-2 text-[0.68rem] font-semibold flex items-center gap-1 uppercase tracking-wider transition-colors duration-150 group-hover:text-[#fb923c]"
                        style={{ color: "#f97316" }}
                      >
                        View Product
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

        </div>
      </div>
      <LunchLearn />
      <Footer />
    </main>
  );
}
