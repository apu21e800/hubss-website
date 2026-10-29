/**
 * What the menus list under each product family and application group: the
 * names, their lines and the photograph each name shows in the desktop
 * panel. Worked out here, on the server, and handed to the bar through
 * app/layout.tsx (components/NavMenuProvider.tsx), so the menus never import
 * lib/products.ts, lib/applications.ts, lib/featured-images.ts or
 * lib/hero-framing.ts themselves. Until 28 Oct 2026 they did, and every
 * page's first JavaScript carried the whole product and application copy
 * (14 KB compressed) for the sake of thirty-seven names (paid-traffic speed
 * pass). Nothing a client component imports may import this file.
 */
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { PATTERN_GALLERY_THUMB, PRODUCT_CATEGORIES, PRODUCT_MENU_LINES } from "@/lib/product-categories";
import { APPLICATION_GROUPS } from "@/lib/application-groups";
import { productImages, applicationImages } from "@/lib/featured-images";
import { HERO_POSITION } from "@/lib/hero-framing";

/** One photograph the desktop panel's tall frame can show: a family's or group's, or a page's hero. */
export type Picture = { label: string; note?: string; src: string; position?: [number, number] };

export type MenuItem = {
  href: string;
  name: string;
  line?: string;
  /** A picture for a destination beside the products (the pattern gallery): a card of its own. */
  gallery?: string;
  /** The page's hero, shown at the right of the desktop panel while the pointer is on this name. */
  picture?: Picture;
};

/** The names under each product family and each application group, keyed by its label. */
export type NavMenu = { families: Record<string, MenuItem[]>; groups: Record<string, MenuItem[]> };

const NO_ITEM_PICTURE: ReadonlySet<string> = new Set(["chipfill", "aggrefill", "fast-patch"]);

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
  const at = /^(\d+)% (\d+)%$/.exec(HERO_POSITION[src] ?? "");
  return { label, note, src, position: at ? [Number(at[1]) / 100, Number(at[2]) / 100] : [0.5, 0.5] };
}

function productFamily(cat: (typeof PRODUCT_CATEGORIES)[number]): MenuItem[] {
  const items: MenuItem[] = cat.slugs.flatMap((sl) => {
    const p = products.find((x) => x.slug === sl);
    return p ? [{ href: `/products/${p.slug}`, name: p.name, line: PRODUCT_MENU_LINES[p.slug], picture: heroPicture("product", p.slug, p.name, PRODUCT_MENU_LINES[p.slug]) }] : [];
  });
  if (cat.secondary) items.push({ href: cat.secondary.href, name: cat.secondary.label, line: cat.secondary.menuLine, gallery: PATTERN_GALLERY_THUMB });
  return items;
}

function applicationGroup(group: (typeof APPLICATION_GROUPS)[number]): MenuItem[] {
  return group.slugs.flatMap((sl) => {
    const a = applications.find((x) => x.slug === sl);
    return a ? [{ href: `/applications/${a.slug}`, name: a.name, picture: heroPicture("application", a.slug, a.name) }] : [];
  });
}

export const NAV_MENU: NavMenu = {
  families: Object.fromEntries(PRODUCT_CATEGORIES.map((cat) => [cat.label, productFamily(cat)])),
  groups: Object.fromEntries(APPLICATION_GROUPS.map((group) => [group.label, applicationGroup(group)])),
};
