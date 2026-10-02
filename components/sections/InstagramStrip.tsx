// The homepage "Follow the work" section: five photographs of finished HUB
// installations in an editorial mosaic, each captioned with where it is and
// which system it is, then one row of follow buttons.
//
// Rebuilt 28 Sep 2026 (Vern: "when I hover on the SM images the text is dark,
// anyways the social media sections suck"). It was a row of six equal squares
// whose hover text used --text-primary, which is charcoal on this paper
// section, then three channel cards, then the same channels again as icons.
//
// THE CAPTIONS ARE DATA, NOT COPY. Each tile names a pin in lib/map-projects.ts,
// the curated map dataset whose place, system and photo were checked against
// each write-up in Sep 2026. The caption prints that pin's city and province,
// and the systems listed below, each of which must be the pin's own product or
// one the write-up declares in Studio (anything else is dropped at render).
// `site` is the pin's title, shortened. A pin tagged imageIsRepresentative (a
// stand-in photo) is never used: its photo is not of the place it names.
//
// THE PHOTOS never touch /_next/image (the optimiser allowance ran out on
// 27 Aug 2026; see next.config.ts). Every pin here has a write-up whose
// featured photo is the same file, imported to Sanity (its origin is the pin's
// /public path), so the tile loads it from Sanity's CDN through PhotoImage, as
// the galleries and the Insights cards do. If Sanity is unreachable the tile
// falls back to the /public original as a plain file, unoptimised.
//
// Each tile opens its write-up. A pin whose post is not live links to HUB's
// Instagram instead.
//
// The old live Instagram feed (Graph API) went with the rebuild. It only ran
// with INSTAGRAM_ACCESS_TOKEN set, production was showing the fallback photos
// (checked 28 Sep 2026), Instagram's image host is not in next.config.ts's
// remotePatterns, and its photos had no place or system to caption them with.
// lib/follow-the-work.json, the old fallback list, is no longer read by
// anything; scripts/verify-site.mjs now checks the tiles on the rendered page.
import Link from "next/link";
import PhotoImage from "@/components/ui/PhotoImage";
import FollowButtons from "@/components/sections/FollowButtons";
import { getAllPosts } from "@/lib/blog";
import { mapProjects } from "@/lib/map-projects";
import { isSanityImage } from "@/lib/photos";
import { SOCIAL_LINKS } from "@/lib/social-links";

export interface Pick {
  /** A map pin id in lib/map-projects.ts: the photo, place and write-up. */
  pin: string;
  /** The pin's title, shortened for a caption. */
  site: string;
  /** Systems to name, in order. Each must be the pin's product or declared by its write-up. */
  systems: string[];
  /** object-position for this tile's crop. */
  position: string;
}

// In mosaic order: the lead, then the four around it (wide, narrow, narrow,
// wide on desktop). Six systems between them, in BC and Ontario.
const PICKS: Pick[] = [
  // "Commercial Drive Decorative Crosswalk", 2019. The write-up names both
  // systems for this job.
  { pin: "vancouver-commercial-drive", site: "Commercial Drive", systems: ["TrafficPatterns", "DecoMark"], position: "30% 70%" },
  // "Simcoe Pride Rainbow Crosswalk", 2023.
  { pin: "simcoe-rainbow", site: "Rainbow crosswalk", systems: ["TrafficPatternsXD"], position: "50% 70%" },
  // "Leslieville Laneway Revitalization", the Laneway Project.
  { pin: "toronto-leslieville-laneway", site: "Leslieville laneway", systems: ["StreetBond"], position: "40% 75%" },
  // "Spirit Trail Crosswalks and Wayfinding": the photo is one of its
  // DuraTherm crosswalks.
  { pin: "north-van-spirit-trail", site: "Spirit Trail crosswalk", systems: ["DuraTherm"], position: "45% 55%" },
  // "TTC Bus Priority Corridors": the write-up's "Product Used: MMAX".
  { pin: "toronto-ttc-bus-corridors", site: "TTC bus priority corridor", systems: ["MMAX"], position: "50% 65%" },
];

export interface Tile {
  key: string;
  src: string;
  alt: string;
  place: string;
  systems: string;
  href: string;
  /** True when the tile leaves the site (Instagram). */
  external: boolean;
  position: string;
}

/**
 * The tiles for a list of picks: photo, place, systems and link, all read from
 * the map pin and its write-up. Also used by /about (30 Sep 2026) with its own
 * picks, so the two pages caption their photos by the same rules.
 */
export async function getProjectTiles(picks: Pick[] = PICKS): Promise<Tile[]> {
  const posts = await getAllPosts();
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const tiles: Tile[] = [];
  for (const pick of picks) {
    const pin = mapProjects.find((p) => p.id === pick.pin);
    const photo = pin?.images[0];
    if (!pin || !photo || pin.imageIsRepresentative) continue;
    const post = pin.slug ? bySlug.get(pin.slug) : undefined;
    const sameShot = Boolean(post?.featuredImage && post.featuredImageOrigin === photo);
    const known = new Set([pin.product, ...(post?.declaredProducts ?? [])]);
    const systems = pick.systems.filter((s) => known.has(s));
    tiles.push({
      key: pin.id,
      src: sameShot && post?.featuredImage ? post.featuredImage : photo,
      alt: `${pin.title}, ${pin.city}, ${pin.province}`,
      place: `${pick.site}, ${pin.city}, ${pin.province}`,
      systems: (systems.length ? systems : [pin.product]).join(" and "),
      href: post ? `/blog/${post.slug}` : SOCIAL_LINKS.instagram,
      external: !post,
      position: pick.position,
    });
  }
  return tiles;
}

// Grid placement per slot. Phones: the lead across both columns, then a 2 x 2.
// md: the same, wider. lg: twelve columns, two rows; the lead takes seven
// columns and both rows, and the four around it alternate wide and narrow.
//
// The `sizes` are wider than the tiles (QA A5 and F4, 30 Sep 2026). Every
// photo is landscape (4:3 to 1.9:1) and every tile from lg up is squarer or
// taller than it (a 193 x 272 column, a 295 x 272 tile), so object-cover
// scales the file to the tile's HEIGHT and the width it needs is the height
// times the photo's aspect: about 410px for the narrow column at 1440, not
// the 194px it was asking for, which came back as a 256px file stretched
// 1.6x (3x on a 2x screen). Each slot now asks for roughly double: the
// tallest tile height times the widest photo, at each breakpoint.
const SLOT = [
  { cls: "col-span-2 aspect-[4/3] md:aspect-[16/9] lg:aspect-auto lg:col-span-7 lg:row-span-2", sizes: "(min-width: 1280px) 900px, (min-width: 1024px) 72vw, 100vw", lead: true },
  { cls: "aspect-square md:aspect-[4/3] lg:aspect-auto lg:col-span-3", sizes: "(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw", lead: false },
  { cls: "aspect-square md:aspect-[4/3] lg:aspect-auto lg:col-span-2", sizes: "(min-width: 1280px) 420px, (min-width: 1024px) 32vw, 100vw", lead: false },
  { cls: "aspect-square md:aspect-[4/3] lg:aspect-auto lg:col-span-2", sizes: "(min-width: 1280px) 420px, (min-width: 1024px) 32vw, 100vw", lead: false },
  { cls: "aspect-square md:aspect-[4/3] lg:aspect-auto lg:col-span-3", sizes: "(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw", lead: false },
] as const;

// Fewer than five tiles (a pin removed, a post unpublished) would leave holes
// in the mosaic, so the tiles fall back to an even grid.
const EVEN = { cls: "aspect-[4/3]", sizes: "(min-width: 1024px) 400px, 50vw", lead: false } as const;

export function TileLink({ tile, slot }: { tile: Tile; slot: { cls: string; sizes: string; lead: boolean } }) {
  const label = `${tile.place}. ${tile.systems}. ${tile.external ? "HUB on Instagram (opens in a new tab)" : "Read the write-up"}`;
  const inner = (
    <>
      <PhotoImage
        src={tile.src}
        alt={tile.alt}
        fill
        sizes={slot.sizes}
        unoptimized={!isSanityImage(tile.src)}
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
        style={{ objectPosition: tile.position }}
      />
      {/* The caption: white on a dark gradient, always readable. With a mouse
          it appears on hover or keyboard focus; on a phone or tablet, where
          nothing hovers, it is simply there. */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-0.5 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 ${
          slot.lead ? "px-4 pb-4 pt-16 sm:px-6 sm:pb-5 sm:pt-24" : "px-3 pb-3 pt-12 sm:px-4 sm:pb-4 sm:pt-16"
        }`}
        style={{
          background: "linear-gradient(to top, rgba(12,12,12,0.86) 0%, rgba(12,12,12,0.6) 45%, rgba(12,12,12,0) 100%)",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        <span className={`font-semibold leading-snug text-white ${slot.lead ? "text-base sm:text-xl" : "text-[13px] sm:text-[15px]"}`}>
          {tile.place}
        </span>
        <span className={`leading-snug ${slot.lead ? "text-[13px] sm:text-sm" : "text-[11.5px] sm:text-[13px]"}`} style={{ color: "rgba(255,255,255,0.85)" }}>
          {tile.systems}
        </span>
      </span>
      {/* Where the tile goes, shown with the caption on hover or focus. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 hidden h-9 w-9 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:flex"
        style={{ background: "rgba(255,255,255,0.94)", color: "#1B1A18" }}
      >
        {tile.external ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </span>
    </>
  );
  const cls =
    "group relative block h-full w-full overflow-hidden rounded-xl focus-visible:rounded-xl!";
  const style = { background: "var(--ink-06)" };
  return tile.external ? (
    <a href={tile.href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls} style={style}>
      {inner}
    </a>
  ) : (
    <Link href={tile.href} aria-label={label} className={cls} style={style}>
      {inner}
    </Link>
  );
}

export default async function InstagramStrip() {
  const tiles = await getProjectTiles();
  const mosaic = tiles.length === SLOT.length;

  return (
    <section
      id="follow"
      aria-labelledby="follow-heading"
      data-surface="paper"
      className="py-24 lg:py-28"
      style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--ink-05)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-12">
          <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            On the ground
          </p>
          <h2
            id="follow-heading"
            className="font-black"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            Follow the work.
          </h2>
          <p className="text-base mt-2 max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Projects across Canada, documented as they happen.
          </p>
        </div>

        {tiles.length > 0 && (
          <ul
            className={
              mosaic
                ? "grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-12 lg:grid-rows-[repeat(2,clamp(200px,19vw,272px))]"
                : "grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4"
            }
          >
            {tiles.map((tile, i) => {
              const slot = mosaic ? SLOT[i] : EVEN;
              return (
                <li key={tile.key} data-tile={tile.key} className={`relative ${slot.cls}`}>
                  <TileLink tile={tile} slot={slot} />
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-8 md:mt-10">
          <FollowButtons />
        </div>
      </div>
    </section>
  );
}
