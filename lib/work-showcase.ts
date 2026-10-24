/**
 * "See the work" on a phone: the map's highlights as photographs, one to a
 * screen (components/sections/WorkShowcase.tsx).
 *
 * Vern, 24 Oct 2026: "currently it takes the user to the interactive map, but
 * it's a bit janky on mobile experience. this is first impression stuff". On
 * a phone the button scrolled seven thousand pixels past the whole homepage
 * to a card, then a dark map with two orange clusters; the tour flew a 40px
 * photo bubble over street tiles while they loaded. The work is the
 * photographs, so a phone now opens them first, and the map is one tap on.
 *
 * The slides are the tour's stops (TOUR_IDS in lib/map-projects.ts), in its
 * order, coast to coast: real, documented jobs, each with its own photo, as
 * every pin must be. Built here, on the server, so the hero ships sixteen
 * small records rather than the whole map.
 */
import { mapProjects, TOUR_IDS } from "@/lib/map-projects";
import { mapLoader, mapPhotoSrc } from "@/lib/map-photo";
import { isSanityImage } from "@/lib/photos";

export interface WorkSlide {
  id: string;
  title: string;
  /** "Whitehorse, YT" */
  place: string;
  system: string;
  application: string;
  excerpt: string;
  photo: { src: string; srcSet: string; alt: string };
  /** The write-up, when the job has one; the map's card says the same. */
  href: string | null;
}

/** Wider than this, a photo cut to a phone's shape is a sliver of itself. */
const MAX_RATIO = 2.5;
const WIDTHS = [640, 960, 1280, 1800];

/** Sanity asset names carry their size: ...-1280x349.jpg. */
function ratioOf(src: string): number | null {
  const m = /-(\d+)x(\d+)\.[a-z]+(?:$|[/?])/i.exec(src);
  return m ? Number(m[1]) / Number(m[2]) : null;
}

function widthOf(src: string): number | null {
  const m = /-(\d+)x\d+\.[a-z]+(?:$|[/?])/i.exec(src);
  return m ? Number(m[1]) : null;
}

export function workSlides(): WorkSlide[] {
  return TOUR_IDS.flatMap((id): WorkSlide[] => {
    const p = mapProjects.find((x) => x.id === id);
    const raw = p?.images[0];
    if (!p || !raw) return [];
    const ratio = ratioOf(raw);
    if (ratio !== null && ratio > MAX_RATIO) return [];
    const src = mapPhotoSrc(p, raw);
    let photo: WorkSlide["photo"];
    const alt = p.alt ?? `${p.title}, ${p.city}, ${p.province}`;
    if (isSanityImage(raw)) {
      // Never wider than the file itself: the CDN does not enlarge, and two
      // candidates for the same pixels only cost a second download.
      const max = widthOf(raw) ?? 1800;
      const widths = WIDTHS.filter((w) => w < max).concat(max <= 1800 ? [max] : []);
      photo = {
        src: mapLoader({ src, width: Math.min(1280, max), quality: 78 }),
        srcSet: widths.map((w) => `${mapLoader({ src, width: w, quality: 78 })} ${w}w`).join(", "),
        alt,
      };
    } else {
      // /public/images/map: the 1600px file and its 640px twin.
      photo = { src, srcSet: `${src.replace(/\.jpg$/, "-sm.jpg")} 640w, ${src} 1600w`, alt };
    }
    return [{
      id: p.id,
      title: p.title,
      place: `${p.city}, ${p.province}`,
      system: p.product,
      application: p.application,
      excerpt: p.excerpt,
      photo,
      href: p.slug ? `/blog/${p.slug}` : null,
    }];
  });
}
