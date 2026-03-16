import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import GalleryGrid, { type GalleryImage } from "@/components/ui/GalleryGrid";
import { applications } from "@/lib/applications";
import { products } from "@/lib/products";
import { placeholderImages } from "@/lib/placeholder-images";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return applications.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = applications.find((a) => a.slug === slug);
  if (!app) return {};
  return buildMetadata({
    title: app.name,
    description: app.desc,
    slug: `applications/${app.slug}`,
  });
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ApplicationPage({ params }: Props) {
  const { slug } = await params;
  const app = applications.find((a) => a.slug === slug);
  if (!app) notFound();

  const relatedProductData = app.relatedProducts
    .map((s) => products.find((p) => p.slug === s))
    .filter(Boolean) as typeof products;

  // Gallery — use per-slug placeholder images; fall back to app hero
  const placeholderGallery =
    placeholderImages.applications[app.slug as keyof typeof placeholderImages.applications]?.gallery ?? [];
  const galleryLabels = ["Overview", "Installation", "Detail", "Completed"];
  const gallery: GalleryImage[] = galleryLabels.map((label, idx) => ({
    src: placeholderGallery[idx] ?? app.imageUrl,
    alt: `${app.name} — ${label}`,
    caption: `${app.name} — ${label}`,
  }));

  return (
    <main style={{ background: "#1a1a1a", minHeight: "100vh" }}>
      <Nav />

      {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: "60vh", minHeight: 440 }}>
        {/* Hero image — replace app.imageUrl with /images/applications/[slug]/hero.jpg when ready */}
        <Image
          src={app.imageUrl}
          alt={app.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Multi-layer dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.25) 100%)",
          }}
        />
        {/* Content — bottom-left */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <p
              className="text-xs font-bold tracking-[0.22em] uppercase mb-3"
              style={{ color: "#f97316" }}
            >
              Application
            </p>
            <h1
              className="text-5xl sm:text-6xl font-black leading-none mb-4"
              style={{ color: "#f5f0eb", letterSpacing: "-0.02em" }}
            >
              {app.name}
            </h1>
            <p
              className="text-base max-w-xl leading-relaxed"
              style={{ color: "rgba(229,231,235,0.8)" }}
            >
              {app.desc}
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Overview ───────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#1a1a1a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#f97316" }}
            >
              Overview
            </p>
            <h2
              className="text-3xl font-bold mb-8"
              style={{ color: "#f5f0eb", letterSpacing: "-0.01em" }}
            >
              About {app.name}
            </h2>
            <div className="space-y-5">
              {app.description.map((para, i) => (
                <p
                  key={i}
                  className="text-[16px] leading-[1.8]"
                  style={{ color: "#d1d5db" }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Recommended Products ──────────────────────────────────────── */}
      {relatedProductData.length > 0 && (
        <section className="py-16" style={{ background: "#141414" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p
                  className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
                  style={{ color: "#f97316" }}
                >
                  Recommended Systems
                </p>
                <h2
                  className="text-3xl font-bold"
                  style={{ color: "#f5f0eb", letterSpacing: "-0.01em" }}
                >
                  Products for {app.name}
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150 hover:text-white"
                style={{ color: "#6b7280" }}
              >
                All products
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(relatedProductData.length, 4)}, minmax(0, 1fr))`,
              }}
            >
              {relatedProductData.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group relative overflow-hidden rounded-lg flex flex-col"
                  style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {/* Product image */}
                  <div className="relative overflow-hidden" style={{ height: 160 }}>
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "rgba(0,0,0,0.35)" }}
                    />
                  </div>
                  {/* Product info */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Orange top accent bar */}
                    <div
                      className="w-6 h-0.5 mb-4 transition-all duration-200 group-hover:w-10"
                      style={{ background: "#f97316" }}
                    />
                    <h3
                      className="font-bold text-[0.95rem] mb-1.5 transition-colors duration-150 group-hover:text-[#f97316]"
                      style={{ color: "#f5f0eb" }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-[0.75rem] leading-relaxed mb-4 flex-1"
                      style={{ color: "#6b7280" }}
                    >
                      {product.shortDesc}
                    </p>
                    <span
                      className="text-xs font-semibold flex items-center gap-1 uppercase tracking-wider mt-auto"
                      style={{ color: "#f97316" }}
                    >
                      View system
                      <svg
                        className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Gallery ────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "#1a1a1a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "#f97316" }}
          >
            Photo Gallery
          </p>
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: "#f5f0eb", letterSpacing: "-0.01em" }}
          >
            Gallery
          </h2>
          <GalleryGrid images={gallery} />
        </div>
      </section>

      {/* ── 5. Benefits ───────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "#111" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: heading */}
            <div>
              <p
                className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
                style={{ color: "#f97316" }}
              >
                Why HUB
              </p>
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: "#f5f0eb", letterSpacing: "-0.01em" }}
              >
                Key Benefits
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: "#6b7280" }}>
                Every HUB application is engineered for Canadian conditions — freeze-thaw
                cycles, snowplow loads, and the performance expectations of municipal
                infrastructure managers.
              </p>
            </div>
            {/* Right: benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {app.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#f97316" }}
                  >
                    <CheckIcon />
                  </span>
                  <span
                    className="text-[0.83rem] leading-snug"
                    style={{ color: "#d1d5db" }}
                  >
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA — Book a Lunch & Learn ───────────────────────────────── */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#f97316" }}
            >
              Free Professional Development
            </p>
            <h2
              className="text-4xl font-black mb-4"
              style={{ color: "#f5f0eb", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              See {app.name} in action.
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #F97316, #EAB308)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Book a Lunch &amp; Learn.
              </span>
            </h2>
            <p
              className="text-[16px] leading-relaxed mb-8"
              style={{ color: "#6b7280" }}
            >
              Complimentary sessions for municipalities, engineering firms, and contractors.
              Live product demonstrations, case studies from Canadian projects, and
              free CPD/PDH credits for engineers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-150 hover:brightness-110"
                style={{
                  background: "linear-gradient(90deg, #F97316, #d97706)",
                  color: "#fff",
                }}
              >
                Book a Lunch &amp; Learn
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-150 hover:border-gray-500"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#d1d5db",
                }}
              >
                Request Consultation
              </Link>
            </div>
            {/* Social proof strip */}
            <div
              className="flex flex-wrap gap-x-6 gap-y-2 mt-8 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {["Free CPD/PDH credits", "Lunch provided", "East: Milton · West: Ladysmith"].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "#4b5563" }}
                >
                  <span style={{ color: "#f97316" }}>✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
