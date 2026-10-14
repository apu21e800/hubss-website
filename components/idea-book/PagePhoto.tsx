import { catalogue, cataloguePageSrcSet, cataloguePageUrl } from "@/lib/catalogue";
import type { Photo } from "@/lib/idea-book-edition";

/**
 * A photograph from the printed Product Book, shown by the region of its page
 * that is the photo (lib/idea-book-edition.ts, `Photo`): the page's own
 * render, the part above its printed caption or beside its printed text.
 *
 * The frame takes the region's shape (a square page's top 63% is a 1.58:1
 * landscape), so the layout adapts to the photograph the way the book does,
 * and the <img> is the page at its natural size, shifted up by `top`: no
 * object-fit, nothing guessed. Plain <img> with the renders' own srcset,
 * never /_next/image (lib/catalogue.ts).
 *
 * `fit` asks for a wider frame than the region (a pair of photographs shown
 * at one shape): the frame takes that ratio and shows the part of the region
 * around the photo's focus, still by shifting the page, never by scaling it.
 */
export default function PagePhoto({
  photo,
  priority = false,
  sizes = "(max-width: 1023px) 100vw, 50vw",
  className = "",
  fit,
}: {
  photo: Photo;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fit?: number;
}) {
  const band = photoBand(photo, fit);
  return (
    <figure
      className={`ib-photo ${className}`}
      // --ib-ratio lets a layout cap the photo's height and keep its shape
      // (width: calc(<height> * var(--ib-ratio)) in edition.css).
      style={{ aspectRatio: String(band.ratio), "--ib-ratio": String(band.ratio) } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cataloguePageUrl(photo.page, catalogue.widths[1] ?? catalogue.widths[0])}
        srcSet={cataloguePageSrcSet(photo.page)}
        sizes={sizes}
        alt={photo.alt}
        width={catalogue.widths[0]}
        height={Math.round(catalogue.widths[0] / catalogue.aspect)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        style={{
          transform: band.top ? `translateY(-${(band.top * 100).toFixed(3)}%)` : undefined,
          // Only read where a layout makes the photo fill its column (object-fit: cover).
          objectPosition: photo.focus,
        }}
      />
    </figure>
  );
}

/** The frame's shape and where on the page it starts (fractions of the page's height). */
export function photoBand(photo: Photo, fit?: number): { top: number; ratio: number } {
  const top = photo.top ?? 0;
  const bottom = photo.bottom ?? 1;
  // The page is catalogue.aspect wide for 1 high; a band `h` high is aspect : h.
  const ratio = catalogue.aspect / (bottom - top);
  if (!fit || fit <= ratio) return { top, ratio };
  const height = catalogue.aspect / fit;
  const focusY = top + (bottom - top) * focusFraction(photo.focus);
  const start = Math.min(Math.max(focusY - height / 2, top), bottom - height);
  return { top: start, ratio: fit };
}

/** "50% 60%" → 0.6: the vertical part of a focus, as a fraction. */
function focusFraction(focus?: string): number {
  const y = focus?.trim().split(/\s+/)[1];
  const n = y ? Number.parseFloat(y) : NaN;
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n / 100)) : 0.5;
}
