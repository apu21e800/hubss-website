/**
 * The photograph behind a page's hero (product, application, post, About).
 *
 * A Sanity photo is a plain <img> with its own srcset, up to 2560px, cut by
 * Sanity's CDN: next/image's candidates stop at 1920 (next.config.ts
 * deviceSizes, kept small on purpose because Vercel bills every variant of a
 * /public file), which left a 2400px hero at two thirds of the pixels a
 * Retina laptop asks for (technical review, 17 Oct 2026). Sanity transforms
 * cost nothing, so the hero gets the one larger candidate here.
 *
 * On a phone the box is taller than it is wide (390 x 439 for a product), so
 * a landscape photo cut to the box's width arrived at a third to half the
 * pixels needed. The phone <source> asks the CDN for the portrait cut itself,
 * around the photo's focal point (Studio's hotspot, else the framing
 * position), so the file is smaller and sharp.
 *
 * A /public photo keeps next/image (PhotoImage), as before.
 */
import PhotoImage from "@/components/ui/PhotoImage";
import { isSanityImage, sanityCrop, sanitySized, sanitySrcSet, sanityTurn, type Hotspot, type Photo } from "@/lib/photos";

/** "50% 62%" as a focal point; the middle when it cannot be read. */
function focalOf(position: string | undefined, hotspot?: Hotspot): Hotspot {
  if (hotspot) return hotspot;
  const m = /^\s*([\d.]+)%\s+([\d.]+)%/.exec(position ?? "");
  if (!m) return { x: 0.5, y: 0.5 };
  return { x: Math.min(1, Math.max(0, Number(m[1]) / 100)), y: Math.min(1, Math.max(0, Number(m[2]) / 100)) };
}

export default function HeroPhoto({
  photo,
  position,
  className = "",
  priority = true,
  /** The phone box's shape, width:height, for the portrait cut (390 x 439 for a product hero). */
  phoneRatio = 390 / 439,
}: {
  photo: Pick<Photo, "src" | "alt" | "hotspot">;
  position?: string;
  className?: string;
  priority?: boolean;
  phoneRatio?: number;
}) {
  const style = { objectPosition: position } as React.CSSProperties;
  if (!isSanityImage(photo.src)) {
    return (
      <PhotoImage src={photo.src} alt={photo.alt} fill className={`object-cover ${className}`} style={style} priority={priority} sizes="100vw" />
    );
  }
  const fp = focalOf(position, photo.hotspot);
  // A turned photo is served whole (lib/photos.ts); its phone cut is the
  // plain srcset too.
  const turned = sanityTurn(photo.src) !== 0;
  const phoneSet = turned
    ? sanitySrcSet(photo.src, [828, 1200], 82)
    : [780, 1170]
        .map((w) => `${sanityCrop(photo.src, w, Math.round(w / phoneRatio), fp, 80)} ${w}w`)
        .join(", ");
  return (
    <picture>
      <source media="(max-width: 639px)" srcSet={phoneSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sanitySized(photo.src, 1920, 82)}
        srcSet={sanitySrcSet(photo.src, [828, 1200, 1920, 2560], 82)}
        sizes="100vw"
        alt={photo.alt}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        style={style}
      />
    </picture>
  );
}
