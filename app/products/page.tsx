import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { products, type Product } from "@/lib/products";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/product-categories";
import { catalogueFor, SYSTEMS_INDEX } from "@/lib/product-catalogue";
import { showCatalogue } from "@/lib/feature-flags";
import { ideaBook } from "@/lib/catalogue";
import cardImageManifest from "@/lib/card-images.json";
import { buildMetadata } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────────────────────
   /products — the index of every system, grouped the way the mega menu groups
   them.

   SURFACE. Paper, whole page, like /resources, /about, /applications and
   /blog. The paper surface redefines every background token, so the section
   rhythm below (--bg-section-asphalt / --bg-primary, full bleed) alternates in
   cream instead of charcoal with no colour values touched. No inset panels, no
   nested dark islands: the banded product detail pages proved a page commits
   to a surface or it does not. The nav, Lunch & Learn and footer keep their own
   dark surfaces, as on every sibling.

   Text tokens on this page are limited to ones that clear 4.5:1 on every paper
   background: --text-primary, --text-secondary, --text-faint and
   --accent-text(-lg). Never --accent or --on-accent as text on cream — the
   About relight hid its mission statement at 1.05:1 doing exactly that.

   FAMILIES come from lib/product-categories.ts, the same list the mega menu
   reads, so the page cannot rename or add one on its own.

   COPY comes from the print catalogue, which wins where it and the site
   disagree:
     line  — the book's own index (page 8, SYSTEMS_INDEX)
     fact  — one of the book's four spec cells, read by label, not retyped
   AirMark, ChipFill, AggreFill and Fast Patch DPR are not in the book; their
   line and fact come from lib/products.ts, and nothing is added to it.

   NO SANITY. This page used to merge Sanity's shortDesc over the code with
   `??`, which rendered an empty Studio field as a blank line. It now shows no
   Sanity field at all — the book's index lines are code-only by design, the
   same as the catalogue spreads on the product pages — so there is nothing to
   merge. Editing a product's shortDesc in Studio still changes the product
   page; it does not change this index.

   IMAGES are baked by scripts/gen-card-images.mjs from
   lib/product-card-images.mjs (one line per system — swap a photo there) and
   served as plain <img srcset>. Nothing routes through /_next/image; this
   project exhausted its Vercel image-optimisation allowance in Aug 2026.
   ───────────────────────────────────────────────────────────────────────────── */

type CardImage = { base: string; widths: number[]; alt: string };
const CARD_IMAGES: Record<string, CardImage> = cardImageManifest;

/** Which of the book's four spec cells each card shows, by label. */
const BOOK_FACTS: Record<string, string[]> = {
  "traffic-patterns-xd": ["Service life"],
  "traffic-patterns": ["Service life"],
  premark: ["Service life"],
  duratherm: ["Profile"],
  decomark: ["Design"],
  streetbond: ["Life cycle"],
  streetbondsr: ["Solar reflectance"],
  mmax: ["Cure"],
  durashield: ["Chemical resistance"],
  streetprint: ["Service life", "Patterns"],
};

/**
 * Print slips corrected on the web and flagged for the print file, the way
 * lib/product-catalogue.ts corrects "acylic". A find-and-replace, not a whole
 * line, so the card still shows the book's line if the book changes it.
 */
const INDEX_LINE_FIXES: Record<string, [from: string, to: string]> = {
  // Page 8 prints "Industry leading MMA…". A compound before a noun takes a
  // hyphen (docs/STYLE.md). QA pa#35, 28 Sep 2026; proposed to Doug for print.
  mmax: ["Industry leading", "Industry-leading"],
  // Page 8 prints "heat fused and stamped"; the TrafficPatterns and DecoMark
  // lines beside it print "heat-fused" (QA B29, 30 Sep 2026).
  "traffic-patterns-xd": ["heat fused", "heat-fused"],
};

/**
 * Every card line ends in a full stop. Page 8 sets six of its ten lines
 * without one, and on the web the cards sat side by side with and without
 * (QA B29, 30 Sep 2026). Added at render, so the book's line stays verbatim
 * in lib/product-catalogue.ts.
 */
const withFullStop = (line: string) => (/[.!?]$/.test(line.trim()) ? line.trim() : `${line.trim()}.`);

/**
 * Systems the book does not cover. `line` is a sentence already in that
 * product's shortDesc (lib/products.ts), `facts` are its spec labels there,
 * matched exactly: "Cure Time" against the spec's "Cure time" left the Fast
 * Patch DPR card without a fact until 28 Sep 2026 (QA pa#26). Trimmed, never
 * extended. "Used in Canada's busiest airports" and "up to 1 m²", which no
 * document backs, were cut here first and on 28 Sep from lib/products.ts too.
 */
const SITE_ONLY: Record<string, { line: string; facts: string[] }> = {
  airmark: { line: "Preformed thermoplastic for non-runway airfield markings.", facts: ["Application"] },
  chipfill: { line: "Heat-activated preformed material for permanent pothole repair.", facts: ["Weather"] },
  aggrefill: { line: "Pre-coated aggregate filler for larger potholes, combined with ChipFill for permanent repair.", facts: ["Substrate"] },
  "fast-patch": { line: "Polymer-blend repair for potholes, spalls, and utility cuts.", facts: ["Cure time"] },
};

type Fact = { label: string; value: string };
type Card = { slug: string; name: string; line: string; facts: Fact[]; image?: CardImage };

function pick(specs: { label: string; value: string }[] | undefined, labels: string[]): Fact[] {
  return labels
    .map((label) => specs?.find((s) => s.label === label))
    .filter((s): s is Fact => Boolean(s))
    .map((s) => ({ label: s.label, value: s.value }));
}

function cardFor(product: Product): Card {
  const book = catalogueFor(product.slug);
  const bookLine = SYSTEMS_INDEX[product.slug];
  if (book && bookLine) {
    const fix = INDEX_LINE_FIXES[product.slug];
    return {
      slug: product.slug,
      name: product.name,
      line: withFullStop(fix ? bookLine.replace(fix[0], fix[1]) : bookLine),
      facts: pick(book.specs, BOOK_FACTS[product.slug] ?? []),
      image: CARD_IMAGES[product.slug],
    };
  }
  const site = SITE_ONLY[product.slug];
  return {
    slug: product.slug,
    name: product.name,
    line: withFullStop(site?.line ?? product.shortDesc),
    facts: pick(product.specs, site?.facts ?? []),
    image: CARD_IMAGES[product.slug],
  };
}

const bySlug = new Map(products.map((p) => [p.slug, p]));
const FAMILIES = PRODUCT_CATEGORIES.map((category) => ({
  category,
  id: category.label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  cards: category.slugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is Product => Boolean(p))
    .map(cardFor),
}));
// No counts on this page since 25 Sep 2026 (Doug's round): the families are
// named, the systems listed, nothing is tallied.
const familyList = (() => {
  const labels = PRODUCT_CATEGORIES.map((c) => c.label.toLowerCase());
  return labels.length > 1 ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}` : labels.join("");
})();

export const metadata = buildMetadata({
  title: "Decorative Pavement & Marking Systems",
  description: `HUB's surface systems in four families: ${familyList}. Specs, spec sheets and certified installers, coast to coast.`,
  slug: "products",
});

// ── Pieces ──────────────────────────────────────────────────────────────────

/** Image sizes per layout, matching the grid classes below (max-w-7xl, gap-6). */
const SIZES = {
  three: "(min-width: 1280px) 389px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)",
  four: "(min-width: 1280px) 286px, (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)",
  feature: "(min-width: 1280px) 480px, (min-width: 1024px) calc((100vw - 64px) * 0.4), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)",
};

function Photo({ image, sizes, eager = false, className = "" }: { image: CardImage; sizes: string; eager?: boolean; className?: string }) {
  const src = (w: number) => `${image.base}-${w}.webp`;
  const mid = image.widths.includes(800) ? 800 : image.widths[image.widths.length - 1];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src(mid)}
      srcSet={image.widths.map((w) => `${src(w)} ${w}w`).join(", ")}
      sizes={sizes}
      width={800}
      height={600}
      alt={image.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    />
  );
}

function Facts({ facts }: { facts: Fact[] }) {
  if (!facts.length) return null;
  return (
    <dl className="mt-5 grid gap-3 border-t pt-4" style={{ borderColor: "var(--ink-08)" }}>
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-faint)" }}>
            {f.label}
          </dt>
          <dd className="mt-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// Resting colours live in classes, not inline styles, so the hover: variants
// can override them — an inline style beats any class. The keyboard focus ring
// comes from the paper rule in globals.css (--accent-text, the card's own
// corners), not from here: that rule is unlayered and would win anyway.
const cardClass =
  "group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(184,62,11,0.45)] hover:shadow-[0_12px_32px_rgba(27,26,24,0.10)]";

function ViewLink({ label = "View system" }: { label?: string }) {
  return (
    <span className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent-text-lg)" }}>
      {label}
      <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
        &rarr;
      </span>
    </span>
  );
}

/**
 * The cards in a row line up part for part (QA, 28 Sep 2026: the divider and
 * the spec label, SERVICE LIFE, PROFILE, CURE, sat at different heights
 * because the lines above them differ in length). Each card is five rows of
 * the list's grid, shared through subgrid: photo, name, line, spec, link. A
 * row is as tall as its tallest cell across the cards beside it, so the
 * dividers and labels share one height, and the links share the card's foot,
 * even where a spec value runs to two lines (AirMark). The <li> takes
 * CARD_ROWS; every part is always rendered, empty if a card lacks it, so no
 * card slips a row.
 */
const CARD_ROWS = "row-span-5 grid grid-rows-subgrid gap-0";

function SystemCard({ card, sizes, eager }: { card: Card; sizes: string; eager: boolean }) {
  return (
    <Link href={`/products/${card.slug}`} className={cardClass.replace("flex h-full flex-col", CARD_ROWS)}>
      {card.image ? (
        <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--bg-card-surface)" }}>
          <Photo image={card.image} sizes={sizes} eager={eager} />
        </div>
      ) : (
        // No card photo (the repair family): an empty first row keeps the rows
        // in step. Half of the list's 24 px row gap still falls above the
        // name, so the name's top padding is 12 px less (pt-2, sm:pt-3).
        <div aria-hidden="true" />
      )}
      <h3 className={`px-5 text-xl sm:px-6 ${card.image ? "pt-5 sm:pt-6" : "pt-2 sm:pt-3"}`} style={{ color: "var(--text-primary)" }}>
        {card.name}
      </h3>
      <p className="mt-2 px-5 text-[15px] sm:px-6" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
        {card.line}
      </p>
      <div className="px-5 sm:px-6">
        <Facts facts={card.facts.slice(0, 1)} />
      </div>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <ViewLink />
      </div>
    </Link>
  );
}

/**
 * A family of one gets the room a single system deserves, not a lonely card.
 * It shows the book's subhead rather than the index line, because the family
 * intro directly above already opens with that line.
 */
function FeatureCard({ card }: { card: Card }) {
  const subhead = catalogueFor(card.slug)?.subhead;
  return (
    <Link href={`/products/${card.slug}`} className={`${cardClass} lg:flex-row`}>
      {card.image && (
        <div className="relative aspect-[4/3] overflow-hidden lg:w-3/5 lg:flex-none" style={{ background: "var(--bg-card-surface)" }}>
          <Photo image={card.image} sizes={SIZES.feature} />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="text-2xl" style={{ color: "var(--text-primary)" }}>
          {card.name}
        </h3>
        <p className="mt-3 text-[15px]" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
          {subhead ?? card.line}
        </p>
        <Facts facts={card.facts} />
        <ViewLink />
      </div>
    </Link>
  );
}

function SecondaryTile({ secondary }: { secondary: NonNullable<ProductCategory["secondary"]> }) {
  return (
    <Link href={secondary.href} className={cardClass}>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* The herringbone template sheet — the real dimensioned CAD drawing
            from the catalogue's template pages. The file is white line-work
            for dark UI; inverted, it reads as ink on paper. Decorative. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/patterns/herringbone.png"
          width={1600}
          height={1236}
          alt=""
          loading="lazy"
          decoding="async"
          className="pattern-sheet mb-6 h-auto w-full"
          style={{ opacity: 0.55 }}
        />
        <h3 className="text-xl" style={{ color: "var(--text-primary)" }}>
          {secondary.label}
        </h3>
        {secondary.meta && (
          <p className="mt-2 text-[15px]" style={{ color: "var(--text-secondary)" }}>
            {secondary.meta}
          </p>
        )}
        <ViewLink label="Browse templates" />
      </div>
    </Link>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const catalogueOn = showCatalogue();

  return (
    <main data-surface="paper" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent-text-lg)" }}>
            Products
          </p>
          <h1
            className="mb-5"
            style={{ color: "var(--text-primary)", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.0, letterSpacing: "-0.03em" }}
          >
            Surface systems for the built environment.
          </h1>
          <p className="max-w-2xl text-lg" style={{ color: "var(--text-secondary)" }}>
            Four families: {familyList}. Built for freeze-thaw climates. Specified coast to coast.
          </p>
        </div>

        <nav aria-label="Product families" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {FAMILIES.map(({ category, id, cards }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[rgba(184,62,11,0.45)] hover:text-[var(--accent-text)]"
                >
                  {category.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* On phones the two links stack, each a 44 px tap target (QA, 28 Sep
            2026: they were 20 px tall); from sm up they sit side by side as before. */}
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-0 text-sm font-semibold sm:mt-6 sm:gap-y-3">
          <Link href="/resources" className="group inline-flex min-h-[44px] items-center gap-1.5 sm:min-h-0" style={{ color: "var(--accent-text)" }}>
            Spec sheets for every system
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
          </Link>
          {catalogueOn && (
            <Link href={ideaBook.href} className="group inline-flex min-h-[44px] items-center gap-1.5 sm:min-h-0" style={{ color: "var(--accent-text)" }}>
              Open the {ideaBook.short}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </Link>
          )}
        </div>
      </header>

      {/* ── Families ───────────────────────────────────────────────────── */}
      {FAMILIES.map(({ category, id, cards }, i) => {
        const grid =
          cards.length >= 5
            ? { cls: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", sizes: SIZES.three }
            : cards.length === 4
              ? { cls: "grid gap-6 sm:grid-cols-2 xl:grid-cols-4", sizes: SIZES.four }
              : { cls: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", sizes: SIZES.three };
        const single = cards.length === 1;

        return (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-heading`}
            className="scroll-mt-20"
            style={{
              background: i % 2 === 0 ? "var(--bg-section-asphalt)" : "var(--bg-primary)",
              borderTop: "1px solid var(--ink-05)",
            }}
          >
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
              <div className="mb-10 max-w-3xl">
                <h2 id={`${id}-heading`} className="text-3xl sm:text-4xl" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {category.label}
                </h2>
                <p className="mt-4 text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
                  {category.intro}
                </p>
              </div>

              {single ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className={category.secondary ? "lg:col-span-2" : "sm:col-span-2 lg:col-span-3"}>
                    <FeatureCard card={cards[0]} />
                  </div>
                  {category.secondary && <SecondaryTile secondary={category.secondary} />}
                </div>
              ) : (
                <ul className={grid.cls}>
                  {cards.map((card, j) => (
                    <li key={card.slug} className={CARD_ROWS}>
                      <SystemCard card={card} sizes={grid.sizes} eager={i === 0 && j < 3} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}

      <LunchLearn compact />
      <Footer />
    </main>
  );
}
