"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { HOMEPAGE_COPY, type SectionCopy } from "@/lib/homepage-copy";
import { productImages, resolveImage } from "@/lib/featured-images";
import { catalogueFor } from "@/lib/product-catalogue";

// What a card renders, and all the page sends (QA F3, 30 Sep 2026): the
// homepage used to pass the whole merged product records, galleries of
// hundreds of photos, Portable Text and SEO included, into this client
// component, and every byte of it was serialised into the HTML (1.05 MB).
// app/page.tsx maps the records to these fields.
export type ProductCard = Pick<Product, "slug" | "name" | "imageUrl" | "shortDesc"> & {
  /** The Sanity homepage blurb, when set; the product's shortDesc (the book's line) is the fallback. */
  homepageBlurb?: string;
};

// What a card says under the name: the Product Portfolio Book's own line for
// the system, its positioning line and subhead ("Stamped asphalt. The
// original. Since 1992. A Canadian invention, eh?"), which is the product's
// shortDesc, Studio over the code (lib/products.ts). Studio's homepageBlurb
// wins when it is set; `npm run sync:products` writes it as the same line, so
// the two agree until Doug edits one. Until 17 Oct 2026 the cards carried a third wording of each
// system, written in May and kept nowhere else ("MMA resin with performance
// aggregates…", "for use in endless environments"), which Doug's copy round
// called gobbledygook.
//
// The chips are the book's uses strip for the system (lib/product-catalogue.ts,
// the printed page's foot: "CROSSWALKS · DRIVEWAYS · PARKS · STREETSCAPES"),
// the first three. Until 17 Oct 2026 they were a hand-kept list that drifted:
// TrafficPatterns and TrafficPatternsXD both carried a "Bike Lanes" chip here
// long after Doug had said twice, in May, that neither goes in a bike lane.

// Per-card object-position overrides for images that need non-center focal points
const PRODUCT_POSITION: Record<string, string> = {
  "decomark": "center bottom",
};

// Core products shown on homepage — one unified showcase
const FEATURED_SLUGS = [
  "streetprint",
  "streetbond",
  "traffic-patterns-xd",
  "traffic-patterns",
  "mmax",
  "decomark",
];

// Named under the grid, each linked to its page. Slugs as in lib/products.ts;
// the names come from the same merged list as the cards, so they always
// match the product pages and a slug change can't leave a dead link.
// With the six cards these are the Product Book's ten systems, which the
// heading counts ("Ten systems", 16 Oct 2026): StreetBondSR in place of
// AirMark, which the book doesn't count among them.
const ALSO_AVAILABLE_SLUGS = ["premark", "durashield", "duratherm", "streetbondsr"];

/** `copy`: the section's eyebrow, heading and intro from Studio (lib/homepage-copy.ts). */
type Props = { products: ProductCard[]; copy?: SectionCopy };

export default function ProductsGrid({ products: source, copy = HOMEPAGE_COPY.systems }: Props) {
  const featured = FEATURED_SLUGS.map((slug) =>
    source.find((p) => p.slug === slug)
  ).filter(Boolean) as ProductCard[];
  const alsoAvailable = ALSO_AVAILABLE_SLUGS.map((slug) =>
    source.find((p) => p.slug === slug)
  ).filter(Boolean) as ProductCard[];

  return (
    <section
      /* six system cards — the densest reading block on the page */
      data-surface="paper"
      id="systems"
      className="section-padding"
      style={{ backgroundColor: "var(--bg-section-asphalt)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14 md:mb-16">
          <p className="eyebrow mb-3">
            {copy.eyebrow}
          </p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="h2-section mb-3" style={{ color: "var(--text-primary)" }}>
                {/* One sentence in place of two fragments ("Six systems. Six
                    different jobs."), in the wording already proposed to Doug
                    (docs/COPY-FOR-DOUG.md §2). Each phrase is an inline-block,
                    so a phone breaks the line between them and never mid-phrase
                    (balance alone gave "Six systems. Six / different jobs."). */}
                <span className="inline-block">{copy.heading}</span>
                {copy.headingAccent && (
                  <>
                    {" "}
                    <span className="inline-block">{copy.headingAccent}</span>
                  </>
                )}
              </h2>
              <p
                className="text-lg max-w-2xl leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {copy.intro}
              </p>
            </div>
            {/* The section's one link to the index (QA A11, 30 Sep 2026: it
                had this pill above and "View all systems" below). Same
                classes as "All applications" in ApplicationsGrid.tsx, so the
                two sections' index buttons look the same; .btn-ghost
                (app/globals.css) gives it its border, hover and focus ring.
                prefetch={false} (QA F5): the six cards already prefetch their
                pages; the index and the "Also available" names need not. */}
            <Link href="/products" prefetch={false} className="btn-ghost flex-shrink-0">
              All systems
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Product grid — 1 col → 2 col → 3 col */}
        {/* MOBILE DIET (Vern-approved, front-page brief Call 1). On phones
            this section stacked six ~500px cards into 3,364px of scroll. Now
            a native swipe row: scroll-snap, CSS only, nothing removed — every
            card still there, sideways. From sm up the grid is byte-identical
            to what it was. */}
        {/* Every card in the swipe row is as tall as the tallest (Vern,
            28 Sep 2026: on the phone "these cards show different card
            height"). The row stretches its items; the wrapper below must not
            set its own height on phones, because height: 100% of a row with
            no fixed height counts as auto and switches the stretch off. From
            sm up the grid rows give h-full a real height, and auto-rows-fr
            makes every row as tall as the tallest, so the two rows match too. */}
        {/* scroll-px-4 (QA A9, 30 Sep 2026): the snap points sit 16px in
            from the row's edges, so the first card lines up with the text
            gutter instead of the screen edge (mandatory snapping had pulled
            it to x=0) and the last card keeps 16px of room at the end. */}
        <div className="flex items-stretch overflow-x-auto snap-x snap-mandatory scroll-px-4 gap-4 -mx-4 px-4 pb-3
                        sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:auto-rows-fr sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0"
             style={{ scrollbarWidth: "none" }}>
          {featured.map((product, i) => {
            const imgSrc = productImages[product.slug]
              ? resolveImage(productImages[product.slug]).src
              : product.imageUrl;
            const imgAlt = productImages[product.slug]
              ? resolveImage(productImages[product.slug]).alt
              : product.name;
            const apps = catalogueFor(product.slug)?.uses ?? [];
            const what = product.homepageBlurb || product.shortDesc;

            return (
              <motion.div
                key={product.slug}
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="flex snap-start flex-shrink-0 w-[82vw] max-w-[340px] sm:h-full sm:w-auto sm:max-w-none sm:flex-shrink"
              >
                <Link
                  href={`/products/${product.slug}`}
                  // focus-ring-inset (app/globals.css): the card clips
                  // itself, so the keyboard ring is drawn inside it
                  // (QA F7, 30 Sep 2026).
                  // .card (app/globals.css): the site's one card, its hover
                  // in CSS. The JS hover and the resting shadow went on
                  // 17 Oct 2026.
                  className="card focus-ring-inset group relative flex flex-col w-full h-full"
                  style={{ background: "var(--bg-card)" }}
                >
                  {/* Image — aspect 3:2, top of card */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/2" }}>
                    <Image
                      src={imgSrc}
                      alt={imgAlt}
                      fill
                      loading="lazy"
                      className="card-photo object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectPosition: PRODUCT_POSITION[product.slug] ?? "center" }}
                    />
                    {/* Bottom gradient — merges image into card body */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 40%, rgba(15,20,32,0.75) 100%)",
                      }}
                    />
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5">

                    {/* Product name */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3
                        className="font-bold text-[18px] leading-snug transition-colors duration-200 group-hover:text-[var(--accent-text)]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {product.name}
                      </h3>
                      {/* orange type chip removed per Vernon */}
                    </div>

                    {/* Description */}
                    <p
                      className="text-[14.5px] leading-relaxed flex-1 mb-4"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {what}
                    </p>

                    {/* Application chips + arrow */}
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {apps.slice(0, 3).map((app) => (
                          <span
                            key={app}
                            className="text-[12px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
                            style={{
                              background: "var(--fill-subtle)",
                              color: "var(--ink-55)",
                            }}
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                      <span className="link-arrow link-arrow-sm flex-shrink-0">
                        Specs
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </span>
                    </div>

                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background:
                        "linear-gradient(90deg, #f97316 0%, rgba(249,115,22,0.4) 60%, transparent 100%)",
                    }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer row: the four other systems. "View all systems" went from
            here on 30 Sep 2026 (QA A11): the section opens with "All systems"
            already, and one index link per section is enough. */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* The four names were plain text; each now opens its product page.
              data-tap gives every link the 44px floor on touch screens only
              (globals.css), so the desktop line stays compact. On a phone the
              label takes its own row and the four names fit on the next. */}
          <p
            className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 text-[14.5px]"
            style={{ color: "var(--ink-50)" }}
          >
            <span className="basis-full sm:basis-auto text-center">Also available:</span>
            {alsoAvailable.map((p, i) => (
              // The dot follows its name (lib/separators.ts: a dot never
              // opens a line), so a wrapped row starts with a name, not "·".
              <span key={p.slug} className="inline-flex items-center gap-x-1">
                <Link
                  href={`/products/${p.slug}`}
                  prefetch={false}
                  data-tap="44"
                  className="inline-flex items-center justify-center px-1 text-[var(--text-secondary)] underline decoration-[color:var(--ink-30)] underline-offset-4 transition-colors hover:text-[var(--accent-text)] hover:decoration-current"
                >
                  {p.name}
                </Link>
                {i < alsoAvailable.length - 1 && <span aria-hidden="true">·</span>}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
