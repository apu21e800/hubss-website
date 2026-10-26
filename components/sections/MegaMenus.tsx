"use client";

/**
 * The three desktop panels under the bar: Products, Applications, Projects.
 *
 * Rebuilt 24 Oct 2026 (Vern: "we also just made the mobile menu look more
 * AAAA agency, we need to do the same for the desktop mega menu, it currently
 * looks amateur"). Until then each panel opened with a row of four equal 2:1
 * photographs over four letterspaced labels, and closed with three boxed
 * slots: a catalogue page. The phone menu's language, carried up:
 *
 *   - The section's name in display type, its one line and its "All" link,
 *     top left, the way the phone menu opens a section.
 *   - One photograph instead of four: a tall one at the right that is the
 *     family or group under the pointer (or the keyboard), cross-fading as
 *     the pointer moves. The photographs are the same CHROME_PANELS pictures,
 *     baked 4:5 (lib/chrome-images.mjs `feature`).
 *   - The lists under small orange eyebrows with hairlines between the names,
 *     and the product's one line under its name (the Product Book's words).
 *   - The foot row as text: Resources, the Product Portfolio Book, Lunch &
 *     Learn, each a mark and a line, no boxes.
 *
 * Projects keeps its cover story and the three newest posts at the right,
 * and lists its three sections at the left with their pictures, as the phone
 * does. Every destination the menus offered is still here (the client chose
 * the contents); what changed is the weight.
 *
 * Nav.tsx owns the open state, the triggers, the panel's frame and motion;
 * this file is what goes inside. The phone menu (MobileOverlay in Nav.tsx)
 * shares the small parts exported at the foot (MooseAvatar, GalleryCard,
 * RESOURCES, the groups).
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { PRODUCT_CATEGORIES, PRODUCT_MENU_LINES } from "@/lib/product-categories";
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";
export { ideaBook };
import { showCatalogue } from "@/lib/feature-flags";
import { lunchLearnHref } from "@/lib/lunch-learn";
import ChromeImg from "@/components/ui/ChromeImg";
import { CHROME_MARKS, CHROME_PANELS, chromeImage } from "@/lib/chrome-images.mjs";
import { productImages, applicationImages } from "@/lib/featured-images";
import { HERO_POSITION } from "@/lib/hero-framing";
import navInsights from "@/lib/nav-insights.json";
import { BLOG_NAME } from "@/lib/field-notes-taxonomy";
import { altBesideTitle } from "@/lib/blog-taxonomy";

// Every Link in the panels carries prefetch={false} (QA F5, 30 Sep 2026): the
// nav is on every page, and an open panel prefetched forty-odd routes at once.

const ACCENT = "var(--accent-text)";
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// ── What the panels hold ───────────────────────────────────────────────

/** Resources: in the Products menu since 14 Oct 2026 (Doug: out of the bar). */
export const RESOURCES = { href: "/resources", label: "Resources", line: "Spec sheets, data sheets and guides" } as const;

/** Lunch & Learn, in the words the site already uses (LunchLearnCard). */
export const LL_LINE = "A free 60-minute session. Lunch is on us.";

/**
 * Four groups a specifier would recognise, each named for the place, not the
 * buyer (28 Sep 2026). Residential lists one driveways page (30 Sep 2026):
 * /applications/private-driveways was merged into residential-driveways.
 */
export const APPLICATION_GROUPS = [
  {
    label: "Streets & Safety",
    note: "Crossings, lanes and calming",
    slugs: ["crosswalks", "bike-lanes", "bus-lanes", "pedestrian-safety", "traffic-calming", "regulatory-markings"],
  },
  {
    label: "Parks & Public Spaces",
    note: "Paths, plazas, play and art",
    slugs: ["parks-paths", "public-spaces", "playgrounds", "splash-pads", "public-art", "community-branding"],
  },
  {
    label: "Commercial & Sustainability",
    note: "Lots, courts, airports and cool pavement",
    slugs: ["parking-lots", "commercial-spaces", "sport-courts", "airports", "leed-urban-heat-island"],
  },
  {
    label: "Residential",
    note: "Driveways and townhome streets",
    slugs: ["residential-driveways", "townhomes"],
  },
];

export type MenuItem = {
  href: string;
  name: string;
  line?: string;
  /** A picture for a destination beside the products (the pattern gallery): a card of its own. */
  gallery?: string;
  /** The page's hero, shown at the right of the desktop panel while the pointer is on this name. */
  picture?: Picture;
};

/** One photograph the desktop panel's tall frame can show: a family's or group's, or a page's hero. */
export type Picture = { label: string; note?: string; src: string; position?: [number, number] };
const NO_ITEM_PICTURE: ReadonlySet<string> = new Set(["chipfill", "aggrefill", "fast-patch"]);

/**
 * The panel's pictures in one list: the columns' (so a column's index is
 * its picture's), then each name's, once per photograph (a name whose hero
 * is also its column's picture points at the column's). `byHref` says which
 * picture a name shows.
 */
function panelPictures(columns: { label: string; note?: string; items: MenuItem[] }[]): { pictures: Picture[]; byHref: Map<string, number> } {
  const pictures: Picture[] = columns.map((c) => {
    const p = panelPhoto(c.label);
    return { label: c.label, note: c.note, src: p?.src ?? "", position: p?.position };
  });
  const byHref = new Map<string, number>();
  for (const c of columns) {
    for (const it of c.items) {
      if (!it.picture) continue;
      let i = pictures.findIndex((p) => p.src === it.picture!.src);
      if (i === -1) { i = pictures.length; pictures.push(it.picture); }
      byHref.set(it.href, i);
    }
  }
  return { pictures, byHref };
}

/**
 * A product's or application's photograph for the panel (26 Oct 2026; Vern:
 * "choose stronger images for the mega menu ... different image for each
 * hover"): the page's own hero (lib/featured-images.ts, the photo editor's
 * picks), framed where lib/hero-framing.ts frames it, baked 4:5 by
 * scripts/gen-chrome-images.mjs. So the panel previews the page the visitor
 * is about to open; the family's or group's picture (CHROME_PANELS) shows
 * while the pointer is on the heading or between the names.
 */
function heroPicture(kind: "product" | "application", slug: string, label: string, note?: string): Picture | undefined {
  // The repair products' photographs are a bag and a patch of grey aggregate
  // (lib/featured-images.ts: nothing on disk qualifies, and Fast Patch's
  // carries a third party's copyright); the family's ChipFill pour stays up
  // for those names.
  if (kind === "product" && NO_ITEM_PICTURE.has(slug)) return undefined;
  const cfg = (kind === "product" ? productImages : applicationImages)[slug];
  if (!cfg) return undefined;
  const src = cfg.featured ?? cfg.fallback;
  const m = /^(\d+)% (\d+)%$/.exec(HERO_POSITION[src] ?? "");
  return { label, note, src, position: m ? [Number(m[1]) / 100, Number(m[2]) / 100] : [0.5, 0.5] };
}

/** The pattern gallery's picture: a herringbone template drawing the search overlay bakes (256px WebP). */
const GALLERY_THUMB = "/images/search/thumbs/pattern/herringbone-256.webp";

export function productFamily(cat: (typeof PRODUCT_CATEGORIES)[number]): MenuItem[] {
  const items: MenuItem[] = cat.slugs.flatMap((sl) => {
    const p = products.find((x) => x.slug === sl);
    return p ? [{ href: `/products/${p.slug}`, name: p.name, line: PRODUCT_MENU_LINES[p.slug], picture: heroPicture("product", p.slug, p.name, PRODUCT_MENU_LINES[p.slug]) }] : [];
  });
  if (cat.secondary) items.push({ href: cat.secondary.href, name: cat.secondary.label, line: cat.secondary.menuLine, gallery: GALLERY_THUMB });
  return items;
}

export function applicationGroup(group: (typeof APPLICATION_GROUPS)[number]): MenuItem[] {
  return group.slugs.flatMap((sl) => {
    const a = applications.find((x) => x.slug === sl);
    return a ? [{ href: `/applications/${a.slug}`, name: a.name, picture: heroPicture("application", a.slug, a.name) }] : [];
  });
}

// ── Insights data (lib/nav-insights.json, written at build) ───────────
interface NavImage { src: string; srcSet: string }
export interface NavPost {
  slug: string; title: string; type: string; publishedAt: string; date: string;
  excerpt?: string; readTime?: string; thumb: NavImage; card?: NavImage; alt?: string;
}
export interface NavSection {
  key: string; label: string; href: string; blurb: string; count: number;
  photo?: { post: string; tile: NavImage; row: NavImage };
}
interface NavInsights {
  cover: (NavPost & { image: NavImage }) | null;
  latest: NavPost[];
  sections?: NavSection[];
  total?: number;
}
export const INSIGHTS = navInsights as NavInsights;

// A post's kicker in the menus: its section's label (lib/field-notes-taxonomy.ts
// badgeFor; the "Blog" posts are guides since 26 Oct 2026).
const INSIGHT_KIND: Record<string, string> = {
  "Case Study": "Project",
  "Project Profile": "Project",
  Guide: "Guide",
  "White Paper": "Guide",
  Blog: "Guide",
};
export const kindOf = (type: string) => INSIGHT_KIND[type] ?? "Guide";

const INSIGHT_SECTIONS = [
  { label: "Projects", href: "/blog/projects" },
  { label: "Guides", href: "/blog/guides" },
];
export const NAV_SECTIONS: NavSection[] = INSIGHTS.sections?.length
  ? INSIGHTS.sections
  : INSIGHT_SECTIONS.map((s) => ({ key: s.href, label: s.label, href: s.href, blurb: "", count: 0 }));

/** The Product Portfolio Book's cover (the 240px thumbnail, the 800px first page for 2x). */
export const ideaBookCover = catalogue.coverThumb ?? null;
export const ideaBookCoverSet = ideaBookCover
  ? `${ideaBookCover} 240w, ${cataloguePageUrl(1, catalogue.widths[0])} ${catalogue.widths[0]}w`
  : undefined;
export const showIdeaBook = () => showCatalogue() && catalogueReady && ideaBookCover !== null;

/** A Sanity CDN photo from lib/nav-insights.json: plain <img srcset>, never /_next/image. */
export function InsightImg({ image, sizes, className, style, loading = "lazy", decoding = "async", alt = "" }: { image: NavImage; sizes: string; className?: string; style?: React.CSSProperties; loading?: "lazy" | "eager"; decoding?: "async" | "sync"; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- deliberate, see lib/chrome-images.mjs
  return <img src={image.src} srcSet={image.srcSet} sizes={sizes} alt={alt} loading={loading} decoding={decoding} className={className} style={style} />;
}

/** The ground under a photograph while it loads: a dark shading, never a hole. */
export const PHOTO_GROUND = "linear-gradient(160deg, var(--bg-card) 0%, var(--bg-deepest) 100%)";

// The panel's photographs, fetched before it opens (QA A7, 30 Sep 2026: a
// cover loaded inside a panel that mounts on open showed as a blank box for a
// second). Called when the pointer or keyboard first reaches the bar's
// triggers; once per page. The cover and its three rows for Projects, and
// the first feature photograph of Products and of Applications.
const COVER_SIZES = "(min-width: 1280px) 440px, 36vw";
const CARD_SIZES = "(min-width: 1280px) 120px, 10vw";
const FEATURE_SIZES = "(min-width: 1536px) 320px, (min-width: 1280px) 280px, 0px";
const STACKED = 3;
let warmed = false;
export function warmPanels() {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  const warm = (src: string, srcSet: string, sizes: string) => {
    const img = new window.Image();
    img.sizes = sizes;
    img.srcset = srcSet;
    img.src = src;
  };
  if (INSIGHTS.cover) warm(INSIGHTS.cover.image.src, INSIGHTS.cover.image.srcSet, COVER_SIZES);
  for (const p of INSIGHTS.latest.slice(0, STACKED)) { const im = p.card ?? p.thumb; warm(im.src, im.srcSet, CARD_SIZES); }
}

// ── Small parts the phone menu shares ──────────────────────────────────

/** Moose in a tinted ring; `onAccent` on the phone menu's orange button. */
export function MooseAvatar({ size = 40, onAccent = false }: { size?: number; onAccent?: boolean }) {
  return (
    <span aria-hidden="true" className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <span
        className="absolute inset-0 rounded-full"
        style={onAccent
          ? { background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.6)" }
          : { background: "rgba(249,115,22,0.14)", border: "1.5px solid rgba(249,115,22,0.45)" }}
      />
      {/* 122% of the ring, bottom-aligned: Moose looks out over the edge. */}
      <ChromeImg
        family="moose"
        src={CHROME_MARKS.moose}
        alt=""
        width={160}
        height={160}
        sizes={`${Math.round(size * 1.22)}px`}
        className="absolute bottom-0 left-1/2 w-auto"
        style={{ height: "122%", maxWidth: "none", transform: "translateX(-50%)" }}
      />
    </span>
  );
}

/**
 * The pattern gallery under StreetPrint (23 Oct 2026; Vern: "make pattern
 * gallery button stand out from the streetprint button above it"): a place
 * to browse, not one more product, so a card of its own. `compact` is the
 * phone menu's size.
 */
export function GalleryCard({ item, compact = false, current, onClick }: { item: MenuItem; compact?: boolean; current?: "page"; onClick?: () => void }) {
  const size = compact ? 48 : 52;
  return (
    <Link prefetch={false}
      href={item.href}
      onClick={onClick}
      aria-current={current}
      data-tap="44"
      className={`card group flex items-center gap-3 ${compact ? "mb-2 mt-1 p-2" : "mt-3 p-2.5"}`}
      style={{ background: "var(--ink-025)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.gallery}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="pattern-sheet flex-shrink-0 rounded-lg"
        style={{ width: size, height: size, border: "1px solid var(--ink-08)" }}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[15px] font-semibold leading-snug" style={{ color: "var(--accent-text)" }}>
          {item.name}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ transitionDuration: "var(--dur-1)" }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
        {item.line && (
          <span className="mt-0.5 block text-[13px] leading-snug text-pretty" style={{ color: "var(--ink-58)" }}>
            {item.line}
          </span>
        )}
      </span>
    </Link>
  );
}

const DocMark = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" strokeWidth={1.75} strokeLinejoin="round" />
    <path d="M14 3v5h5M9 13h6M9 17h4" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Arrow = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="mm-arrow flex-shrink-0">
    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── The panel's parts ──────────────────────────────────────────────────

/** The section's name in display type, its line, and its "All" link. */
function PanelHead({ title, line, href, all }: { title: string; line: string; href: string; all: string }) {
  return (
    <div className="mm-head">
      <div className="mm-title">{title}</div>
      <div className="mm-line-row">
        <span className="mm-line">{line}</span>
        <Link prefetch={false} href={href} className="link-arrow link-arrow-sm mm-all">
          {all}
          <Arrow size={14} />
        </Link>
      </div>
    </div>
  );
}

/**
 * A column's heading: a short rule in the brand orange, then the family's
 * name in display type, and its note. Not the uppercase eyebrow: at 13px and
 * 0.2em "Preformed Thermoplastics" and "Commercial & Sustainability" wrap in
 * a 200px column (creative director, 24 Oct 2026). At 13.5px Inter the name
 * sat under the 16px product names and read as a note (Vern, 26 Oct 2026:
 * "the headings for each mega menu topic could stand out more as
 * headings"), so it is 20px Geist now: one line in Products' 277px columns,
 * two in Applications' 201px ("Commercial & Sustainability" is 264px wide),
 * where .mm-cols-aligned keeps the four lists level.
 */
function ColumnHead({ label, note }: { label: string; note?: string }) {
  return (
    <div className="mm-col-head">
      <span className="mm-rule" aria-hidden="true" />
      <div className="mm-col-label">{label}</div>
      {note && <div className="mm-note">{note}</div>}
    </div>
  );
}

/**
 * One family or group: its names, with a hairline between, a line under a
 * product's name. The pattern gallery (a `gallery` item) is not a product
 * and is not listed here: it is a row in the foot, with the other places.
 */
function Column({ label, note, items, index, onPoint, onPointItem }: { label: string; note?: string; items: MenuItem[]; index: number; onPoint: (i: number) => void; onPointItem?: (href: string) => void }) {
  const names = items.filter((it) => !it.gallery);
  return (
    <motion.div
      className="mm-col"
      onMouseEnter={() => onPoint(index)}
      // Focus bubbles in React: a name's own onFocus has already pointed at
      // its picture, so the column points at the family's only when the
      // focus landed somewhere else in it.
      onFocus={(e) => { if (!(e.target as HTMLElement).closest(".mm-item")) onPoint(index); }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 + index * 0.04, duration: 0.36, ease: EASE_OUT }}
    >
      <ColumnHead label={label} note={note} />
      <ul className="mm-list">
        {names.map((it) => (
          <li key={it.href}>
            <Link
              prefetch={false}
              href={it.href}
              data-tap="44"
              className="mm-item group"
              onMouseEnter={onPointItem && it.picture ? () => onPointItem(it.href) : undefined}
              onFocus={onPointItem && it.picture ? () => onPointItem(it.href) : undefined}
            >
              <span className="min-w-0">
                <span className="mm-name">{it.name}</span>
                {it.line && <span className="mm-item-line">{it.line}</span>}
              </span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mm-chev" aria-hidden="true">
                <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * The tall photograph at the right: the name or the column under the
 * pointer. A picture is mounted the first time it is pointed at (the panel
 * holds up to 23 pictures since 26 Oct 2026, so loading them all on open
 * would cost a megabyte), and the one showing stays until the new one has
 * loaded, so a move along the names never shows a hole; `aria-hidden`,
 * since the names beside it say everything it says.
 */
function Feature({ pictures, active }: { pictures: Picture[]; active: number }) {
  const still = useReducedMotion();
  const [mounted, setMounted] = useState<number[]>(() => [active]);
  const [loaded, setLoaded] = useState<Record<string, true>>({});
  const shownRef = useRef(active);
  useEffect(() => {
    setMounted((m) => (m.includes(active) ? m : [...m, active]));
  }, [active]);
  const activeSrc = pictures[active]?.src;
  if (activeSrc && loaded[activeSrc]) shownRef.current = active;
  const shown = activeSrc && loaded[activeSrc] ? active : shownRef.current;
  return (
    <aside className="mm-feature" aria-hidden="true">
      <div className="mm-feature-frame" style={{ background: PHOTO_GROUND }}>
        {mounted.map((i) => {
          const p = pictures[i];
          return p?.src ? (
            <ChromeImg
              key={p.src}
              family="feature"
              src={p.src}
              alt=""
              sizes={FEATURE_SIZES}
              width={640}
              height={800}
              loading="eager"
              decoding="async"
              className="mm-feature-img"
              onLoad={() => setLoaded((l) => (l[p.src] ? l : { ...l, [p.src]: true }))}
              style={{
                opacity: i === shown ? 1 : 0,
                zIndex: i === shown ? 2 : 1,
                objectPosition: p.position ? `${p.position[0] * 100}% ${p.position[1] * 100}%` : "50% 50%",
                transition: still ? "none" : undefined,
              }}
            />
          ) : null;
        })}
      </div>
      <div className="mm-feature-caption" key={pictures[active]?.label}>
        <span className="mm-rule" aria-hidden="true" />
        <div className="mm-col-label">{pictures[active]?.label}</div>
        {pictures[active]?.note && <div className="mm-note">{pictures[active].note}</div>}
      </div>
    </aside>
  );
}

/** A row in the foot: a mark, a name, its line, an arrow. */
function FootRow({ href, mark, label, line, action }: { href: string; mark: React.ReactNode; label: string; line: string; action?: string }) {
  return (
    <Link prefetch={false} href={href} className="mm-foot-row group">
      {mark}
      <span className="min-w-0">
        <span className="mm-foot-label">{label}</span>
        <span className="mm-foot-line">{line}</span>
      </span>
      <span className="mm-foot-action">
        {action}
        <Arrow size={13} />
      </span>
    </Link>
  );
}

function LunchLearnRow({ topic }: { topic: string }) {
  return (
    <FootRow
      href={lunchLearnHref(topic, "menu")}
      mark={<MooseAvatar size={34} />}
      label="Lunch & Learn"
      line={LL_LINE}
      action="Book a session"
    />
  );
}

function ResourcesRow() {
  return (
    <FootRow
      href={RESOURCES.href}
      mark={<span className="mm-mark" aria-hidden="true"><DocMark /></span>}
      label={RESOURCES.label}
      line={RESOURCES.line}
    />
  );
}

/**
 * The pattern gallery, beside Resources (26 Oct 2026; Vern, on the card
 * under StreetPrint: "it looks out of place as it is"). The foot is the row
 * of places that are not products, and a gallery of stamping templates is
 * one of them; its mark is the herringbone drawing the phone's card uses.
 */
function GalleryRow() {
  const link = PRODUCT_CATEGORIES.find((cat) => cat.secondary)?.secondary;
  if (!link) return null;
  return (
    <FootRow
      href={link.href}
      mark={
        // eslint-disable-next-line @next/next/no-img-element -- a 2 KB baked drawing, lib/chrome-images.mjs
        <img src={GALLERY_THUMB} alt="" width={36} height={36} loading="lazy" decoding="async" className="mm-mark mm-mark-pattern pattern-sheet" />
      }
      label={link.label}
      line={link.menuLine ?? ""}
    />
  );
}

function IdeaBookRow() {
  if (!ideaBookCover) return null;
  return (
    <Link prefetch={false} href={ideaBook.href} className="mm-foot-row group">
      {/* eslint-disable-next-line @next/next/no-img-element -- the book's own raster, lib/catalogue.ts */}
      <img
        src={ideaBookCover}
        srcSet={ideaBookCoverSet}
        sizes="36px"
        alt=""
        width={240}
        height={240}
        loading="lazy"
        decoding="async"
        className="mm-book"
      />
      <span className="min-w-0">
        <span className="mm-foot-label">{ideaBook.title}</span>
        <span className="mm-foot-line">The printed book, page by page</span>
      </span>
      <span className="mm-foot-action">
        Read it online
        <Arrow size={13} />
      </span>
    </Link>
  );
}

/** The foot: a hairline, then the rows, spread across the width. */
function Foot({ children }: { children: React.ReactNode }) {
  return <div className="mm-foot">{children}</div>;
}

/**
 * The picture under the pointer: a column's (its family or group) or a
 * name's (that page's hero); the first column's until something is pointed
 * at; reset when the panel re-mounts. Pointing at a column fetches its
 * names' pictures, so the first move down the list finds them ready.
 */
function usePointed(groups: { index: number; items: MenuItem[] }[], byHref: Map<string, number>) {
  const [active, setActive] = useState(0);
  const warmed = useRef(new Set<string>());
  const onPoint = useCallback((i: number) => {
    setActive(i);
    const g = groups.find((x) => x.index === i);
    if (!g || typeof window === "undefined") return;
    for (const it of g.items) {
      if (!it.picture || warmed.current.has(it.picture.src)) continue;
      warmed.current.add(it.picture.src);
      const img = new window.Image();
      img.sizes = FEATURE_SIZES;
      const baked = chromeImage("feature", it.picture.src);
      img.srcset = baked.srcSet;
      img.src = baked.src;
    }
  }, [groups]);
  const onPointItem = useCallback((href: string) => {
    const i = byHref.get(href);
    if (i !== undefined) setActive(i);
  }, [byHref]);
  return { active, onPoint, onPointItem };
}

// ── The three panels ───────────────────────────────────────────────────

const panelPhoto = (label: string) => {
  const p = (CHROME_PANELS as Record<string, { src: string; position?: [number, number] } | undefined>)[label];
  return p ? { src: p.src, position: p.position } : null;
};

export function ProductsPanel() {
  // The families' pictures first, in column order (so a column's index is
  // its picture's), then every product's.
  const families = PRODUCT_CATEGORIES.map((cat) => ({ cat, items: productFamily(cat) }));
  const { pictures, byHref } = panelPictures(families.map(({ cat, items }) => ({ label: cat.label, note: cat.menuNote, items })));
  const { active, onPoint, onPointItem } = usePointed(families.map(({ items }, index) => ({ index, items })), byHref);
  return (
    <div className="mm">
      <div className="mm-body">
        <div className="mm-main">
          <PanelHead title="Products" line="Thermoplastics, coatings, stamped asphalt, repair" href="/products" all="All products" />
          {/* Three columns, not four: the two short families (Stamped
              Asphalt, one system; Asphalt & Concrete Repair, three) share
              the third, so each column is wide enough for a product's line
              on one line ("Preformed thermoplastic to your design" wrapped
              in every column of four). No note under a family's name
              (26 Oct 2026, Vern: "headings seem to run in with the product
              text"): a grey line under the heading and a grey line under
              every name made one grey texture. The photo's caption keeps
              the family's note. */}
          <div className="mm-cols mm-cols-3">
            {[[0], [1], [2, 3]].map((group) => (
              <div key={group.join("-")} className="mm-stack">
                {group.map((i) => {
                  const f = families[i];
                  return f ? <Column key={f.cat.label} label={f.cat.label} items={f.items} index={i} onPoint={onPoint} onPointItem={onPointItem} /> : null;
                })}
              </div>
            ))}
          </div>
        </div>
        <Feature pictures={pictures} active={Math.min(active, pictures.length - 1)} />
      </div>
      <Foot>
        <ResourcesRow />
        <GalleryRow />
        {/* The topic is the whole range: which family a visitor last hovered
            says little about what they want. */}
        <LunchLearnRow topic="HUB systems" />
      </Foot>
    </div>
  );
}

export function ApplicationsPanel() {
  const groups = APPLICATION_GROUPS.map((g) => ({ g, items: applicationGroup(g) }));
  const { pictures, byHref } = panelPictures(groups.map(({ g, items }) => ({ label: g.label, note: g.note, items })));
  const { active, onPoint, onPointItem } = usePointed(groups.map(({ items }, index) => ({ index, items })), byHref);
  return (
    <div className="mm">
      <div className="mm-body">
        <div className="mm-main">
          <PanelHead title="Applications" line="Streets, parks, commercial and residential" href="/applications" all="All applications" />
          {/* Four columns of 201px, in which "Commercial & Sustainability"
              and "Parks & Public Spaces" take two lines at the heading size:
              the heads share one grid row (.mm-cols-aligned), so the four
              lists still start on one line. No note under a group's name:
              its places say the same words ("Crossings, lanes and calming"
              over Crosswalks, Bike Lanes and Traffic Calming), the phone
              menu's groups carry none, and with them the panel ran to 597px,
              past a 1366x768 laptop's 585. The note stays in the photo's
              caption. Stacking Residential under Commercial in three
              columns, as Products does, made the panel 689px. */}
          <div className="mm-cols mm-cols-aligned">
            {groups.map(({ g, items }, i) => (
              <Column key={g.label} label={g.label} items={items} index={i} onPoint={onPoint} onPointItem={onPointItem} />
            ))}
          </div>
        </div>
        <Feature pictures={pictures} active={Math.min(active, pictures.length - 1)} />
      </div>
      <Foot>
        <LunchLearnRow topic="your application" />
      </Foot>
    </div>
  );
}

/** One of the two sections of the blog, with its picture, at the left of Projects. */
function SectionRow({ section: s, index }: { section: NavSection; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 + index * 0.04, duration: 0.36, ease: EASE_OUT }}
    >
      <Link prefetch={false} href={s.href} className="mm-section group" data-tap="44">
        {s.photo ? (
          <InsightImg image={s.photo.row} sizes="88px" className="mm-section-photo" />
        ) : (
          <span className="mm-section-photo" style={{ background: PHOTO_GROUND }} />
        )}
        {/* The name alone, as the phone menu's rows: the sections' three-line
            blurbs made the rows taller than the cover story beside them. */}
        <span className="min-w-0 flex-1">
          <span className="mm-name">{s.label}</span>
        </span>
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mm-chev" aria-hidden="true">
          <path d="M9 18l6-6-6-6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </motion.li>
  );
}

/** One of the three newest posts beside the cover: its 3:2 picture, its section, its title. */
function PostRow({ post, index }: { post: NavPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.05, duration: 0.36, ease: EASE_OUT }}
    >
      <Link prefetch={false} href={`/blog/${post.slug}`} className="mm-post group">
        <span className="mm-post-photo" style={{ background: PHOTO_GROUND }}>
          <InsightImg
            image={post.card ?? post.thumb}
            alt={altBesideTitle(post.alt, post.title)}
            sizes={CARD_SIZES}
            loading="eager"
            className="mm-photo-img"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="eyebrow mm-kicker">{kindOf(post.type)}</span>
          <span className="mm-post-title font-display">{post.title}</span>
        </span>
      </Link>
    </motion.div>
  );
}

export function ProjectsPanel() {
  const { cover } = INSIGHTS;
  const stacked = INSIGHTS.latest.slice(0, STACKED);
  const book = showIdeaBook();
  return (
    <div className="mm">
      <div className="mm-body mm-body-projects">
        <div className="mm-main">
          <PanelHead title={BLOG_NAME} line="Installations and guides" href="/blog" all={`All ${BLOG_NAME.toLowerCase()}`} />
          <ul className="mm-sections">
            {NAV_SECTIONS.map((s, i) => <SectionRow key={s.key} section={s} index={i} />)}
          </ul>
        </div>
        {cover && (
          <motion.div
            className="mm-cover-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04, duration: 0.4, ease: EASE_OUT }}
          >
            <Link prefetch={false} href={`/blog/${cover.slug}`} className="mm-cover group">
              <span className="mm-cover-photo" style={{ background: PHOTO_GROUND }}>
                {/* Eager, and decoded in step, so a warmed file paints in the panel's first frame. */}
                <InsightImg
                  image={cover.image}
                  alt={altBesideTitle(cover.alt, cover.title)}
                  sizes={COVER_SIZES}
                  loading="eager"
                  decoding="sync"
                  className="mm-photo-img"
                />
              </span>
              <span className="eyebrow mm-kicker">{kindOf(cover.type)}</span>
              <span className="mm-cover-title font-display">{cover.title}</span>
            </Link>
          </motion.div>
        )}
        <div className={`mm-posts ${cover ? "" : "mm-posts-wide"}`}>
          {stacked.map((p, i) => <PostRow key={p.slug} post={p} index={i} />)}
        </div>
      </div>
      <Foot>
        {book && <IdeaBookRow />}
        <LunchLearnRow topic="HUB systems" />
      </Foot>
    </div>
  );
}

/** Which photographs to fetch ahead for a panel, by its name (Nav.tsx warms the one under the pointer). */
export function warmFeature(panel: "products" | "applications") {
  if (typeof window === "undefined") return;
  const label = panel === "products" ? PRODUCT_CATEGORIES[0]?.label : APPLICATION_GROUPS[0]?.label;
  const p = label ? panelPhoto(label) : null;
  if (!p) return;
  // ChromeImg's own rungs: the browser picks the same one the panel will.
  const img = new window.Image();
  img.sizes = FEATURE_SIZES;
  const baked = chromeImage("feature", p.src);
  img.srcset = baked.srcSet;
  img.src = baked.src;
}
