import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import DocumentDownloads from "@/components/sections/DocumentDownloads";
import GalleryGrid, { type GalleryImage } from "@/components/ui/GalleryGrid";
import JsonLd from "@/components/ui/JsonLd";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { placeholderImages } from "@/lib/placeholder-images";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
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

  // Gallery — use per-slug placeholder images; fall back to product hero
  const placeholderGallery =
    placeholderImages.products[product.slug as keyof typeof placeholderImages.products]?.gallery ?? [];
  const galleryLabels = ["Overview", "Installation", "Detail", "Completed", "In Service", "Close-up"];
  const gallery: GalleryImage[] = galleryLabels.map((label, idx) => ({
    src: placeholderGallery[idx] ?? product.imageUrl,
    alt: `${product.name} — ${label}`,
    caption: `${product.name} · ${label}`,
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

      {/* Hero banner */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "rgba(26,26,26,0.7)" }} />{/* overlay — keep hardcoded */}
        <div className="absolute inset-0 flex items-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#f97316" }}>
              HUB Product System
            </p>
            <h1 className="text-6xl font-bold" style={{ color: "var(--text-primary)" }}>
              {product.name}
            </h1>
            <p className="text-lg mt-2" style={{ color: "var(--text-body)" }}>
              {product.shortDesc}
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg-slate)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
            <div className="rounded-xl p-8 mb-8 sticky top-24" style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)" }}>
              <h3 className="font-bold text-lg mb-6" style={{ color: "var(--text-primary)" }}>Specifications</h3>
              <div className="space-y-4">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between text-sm" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
                    <span style={{ color: "#d1d5db" }}>{spec.label}</span>
                    <span className="font-semibold text-right max-w-[60%]" style={{ color: "var(--text-primary)" }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="block w-full text-center font-semibold py-4 rounded-lg mt-8 transition-colors text-sm"
                style={{ background: "#f97316", color: "#fff" }}
              >
                Request Spec Sheet
              </Link>
              <Link
                href="/lunch-learn"
                className="block w-full text-center font-semibold py-4 rounded-lg mt-3 transition-colors text-sm"
                style={{ background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
              >
                Book Lunch &amp; Learn
              </Link>
            </div>
          </div>
        </div>

        {/* Applications this product is used for */}
        {relatedAppData.length > 0 && (
          <div className="mt-16 pt-16" style={{ borderTop: "1px solid var(--border-subtle)" }}>
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
                      className="text-[0.72rem] leading-relaxed flex-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {app.desc.slice(0, 80)}{app.desc.length > 80 ? "…" : ""}
                    </p>
                    <span
                      className="mt-2 text-[0.68rem] font-semibold flex items-center gap-1 uppercase tracking-wider transition-colors duration-150 group-hover:text-[#fb923c]"
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
      </div>
      </div>
      <LunchLearn />
      <Footer />
    </main>
  );
}
