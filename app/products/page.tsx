import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { products as staticProducts } from "@/lib/products";
import { productImages, resolveImage } from "@/lib/featured-images";
import { buildMetadata } from "@/lib/seo";
import { getAllSanityProducts } from "@/lib/sanity.queries";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Decorative Pavement & Marking Systems",
  description:
    "Fourteen surface systems for Canadian municipal, commercial, and private use — preformed thermoplastics, MMA resins, stamped asphalt, decorative coatings, and asphalt repair.",
  slug: "products",
});

// Repair products have no entry in featured-images.ts yet; map them here
// so the lineup stays image-forward end to end.
const REPAIR_IMAGES: Record<string, { src: string; alt: string }> = {
  chipfill:    { src: "/images/products/chipfill/chipfill-road-repair.webp",      alt: "ChipFill heat-activated preformed pothole repair material restoring asphalt pavement" },
  aggrefill:   { src: "/images/products/aggrefill/aggrefill-application.webp",    alt: "AggreFill pre-coated aggregate filler being applied to large pothole" },
  "fast-patch":{ src: "/images/products/fast-patch/fastpatch-repaired.jpg",       alt: "Fast Patch DPR cold-mix polymer repair restoring asphalt surface" },
};

function getCardImage(slug: string, productName: string) {
  if (productImages[slug]) return resolveImage(productImages[slug]);
  if (REPAIR_IMAGES[slug]) return REPAIR_IMAGES[slug];
  return { src: "/images/hero/hero-1.jpg", alt: productName };
}

// Trim shortDesc to the first sentence so each card holds a single
// confident line of supporting copy — never a paragraph.
function leadLine(text: string, maxChars = 90): string {
  const firstSentence = text.split(/(?<=\.)\s+/)[0] ?? text;
  if (firstSentence.length <= maxChars) return firstSentence;
  return firstSentence.slice(0, maxChars).replace(/[\s,;]+\S*$/, "") + "…";
}

export default async function ProductsPage() {
  const sanityProducts = await getAllSanityProducts();
  const sanityBySlug = new Map(
    sanityProducts.map((p) => [p.slug as unknown as string, p]),
  );

  const products = staticProducts.map((sp) => {
    const sDoc = sanityBySlug.get(sp.slug);
    if (!sDoc) return sp;
    return { ...sp, shortDesc: sDoc.shortDesc ?? sp.shortDesc };
  });

  const groups: { label: string; slugs: string[] }[] = [
    { label: "Preformed Thermoplastics",   slugs: ["traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "decomark", "airmark"] },
    { label: "Coatings",                   slugs: ["streetbond", "streetbondsr", "mmax", "durashield"] },
    { label: "Stamped Asphalt & Concrete", slugs: ["streetprint"] },
    { label: "Asphalt Repair",             slugs: ["chipfill", "aggrefill", "fast-patch"] },
  ];

  const totalSystems = groups.reduce((n, g) => n + g.slugs.length, 0);

  return (
    <main style={{ background: "#0f1620", minHeight: "100vh" }}>
      <Nav />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-12 sm:pb-20">
          <p
            className="text-[11px] font-semibold tracking-[0.24em] uppercase mb-5"
            style={{ color: "#f97316" }}
          >
            The Full Lineup · {String(totalSystems).padStart(2, "0")} Systems
          </p>
          <h1
            className="font-black"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              maxWidth: "16ch",
            }}
          >
            Surface systems for the public realm.
          </h1>
          <p
            className="mt-6 text-lg sm:text-xl"
            style={{ color: "var(--text-secondary)", maxWidth: "44ch" }}
          >
            Specify it. Walk over it for twenty years.
          </p>
        </div>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-hidden="true"
        >
          <div
            className="h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        </div>
      </section>

      {/* ── Lineup ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-24 sm:pb-32">
        <div className="space-y-20 sm:space-y-24">
          {groups.map((group) => {
            const groupProducts = group.slugs
              .map((slug) => products.find((p) => p.slug === slug))
              .filter(Boolean) as typeof products;

            return (
              <div key={group.label}>
                {/* Group header — label + count, no description */}
                <div className="flex items-baseline gap-4 mb-6 sm:mb-8">
                  <h2
                    className="text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap"
                    style={{ color: "#F97316" }}
                  >
                    {group.label}
                  </h2>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                  <span
                    className="text-[11px] font-semibold tracking-[0.18em] uppercase tabular-nums"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {String(groupProducts.length).padStart(2, "0")}{" "}
                    {groupProducts.length === 1 ? "system" : "systems"}
                  </span>
                </div>

                {/* Cards — image-forward, one line of copy, scannable */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {groupProducts.map((product) => {
                    const img = getCardImage(product.slug, product.name);
                    return (
                      <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        className="group block relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(249,115,22,0.18)]"
                        style={{
                          background: "#1a1e28",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        {/* Image — 16:10 hero */}
                        <div className="relative w-full aspect-[16/10] overflow-hidden">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Subtle bottom fade for type continuity */}
                          <div
                            className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(26,30,40,0.85) 0%, rgba(26,30,40,0) 100%)",
                            }}
                            aria-hidden="true"
                          />
                          {/* Orange accent rule — keeps brand presence */}
                          <div
                            className="absolute left-0 right-0 bottom-0 h-[2px]"
                            style={{
                              background:
                                "linear-gradient(90deg, #F97316, #EAB308)",
                            }}
                            aria-hidden="true"
                          />
                        </div>

                        {/* Card body — name, one-line tagline, CTA */}
                        <div className="p-5 sm:p-6">
                          <h3
                            className="font-bold text-lg sm:text-xl leading-tight transition-colors group-hover:text-[#f97316]"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {product.name}
                          </h3>
                          <p
                            className="mt-2 text-sm leading-snug"
                            style={{ color: "rgba(255,255,255,0.62)" }}
                          >
                            {leadLine(product.shortDesc)}
                          </p>
                          <span
                            className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase"
                            style={{ color: "#f97316" }}
                          >
                            Explore
                            <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">
                              →
                            </span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <LunchLearn />
      <Footer />
    </main>
  );
}
