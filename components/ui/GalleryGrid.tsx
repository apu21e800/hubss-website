"use client";

import { useMemo, useState } from "react";
import PhotoImage from "@/components/ui/PhotoImage";
import { GALLERY, gallerySettle as settle, isSanityImage, sanitySized } from "@/lib/photos";
import PhotoLightbox from "@/components/ui/PhotoLightbox";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  /** The words of the photo's filename (lib/sanity-image.ts); the alt as given when absent. */
  name?: string;
}

// Vernon (Aug 2026): "show the hero gallery image then the first 6 images,
// then load chunks of ... maybe 12." INITIAL = hero + 6; each Load more
// appends CHUNK. Deliberately button-driven (no auto infinite scroll) —
// product/application pages have specs, related systems, and the CTA below
// the gallery, and an auto-loader would push them forever out of reach.
// A gallery of eight or nine used to end on "Load 1 more" (QA, 27 Sep 2026):
// a button for a stub reads as a mistake. When three or fewer photos would be
// left behind the button (GALLERY.tail), they are shown instead, at first
// paint and after every "Load more". The numbers live in lib/photos.ts
// (GALLERY, gallerySettle), where the image sitemap reads them too: it lists
// each photo at the address its tile or its <noscript> copy carries.
const INITIAL: number = GALLERY.initial;
const CHUNK: number = GALLERY.chunk;

export default function GalleryGrid({ images: given }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [visible, setVisible] = useState(INITIAL);
  // Photos that share one alt ("Coloured bike lane" five times on a page)
  // are told apart for a screen reader and for Google Images: the alt gets
  // "photo 3 of 36"; the visible caption does not (technical review, 17 Oct
  // 2026, 290 duplicate alts across the galleries). The filename keeps the
  // alt as given (`name`), so a photo's address doesn't change when the
  // gallery is reordered.
  const images = useMemo(() => {
    const counts = new Map<string, number>();
    for (const img of given) counts.set(img.alt, (counts.get(img.alt) ?? 0) + 1);
    return given.map((img, i) => {
      const named = { ...img, name: img.name ?? img.alt };
      return (counts.get(img.alt) ?? 0) > 1 ? { ...named, alt: `${img.alt}, photo ${i + 1} of ${given.length}` } : named;
    });
  }, [given]);

  const shown = settle(visible, images.length);
  const displayed = images.slice(0, shown);
  const hasMore = displayed.length < images.length;
  // What the next press adds, tail included, so the label tells the truth.
  const nextShown = settle(shown + CHUNK, images.length);
  const nextCount = nextShown - shown;
  // When the next chunk is the rest, "Load N more" and "Show all" are the
  // same button twice; only "Show all" stays.
  const nextIsAll = nextShown >= images.length;

  // Hero = first image; grid = the rest
  const hero = displayed[0] ?? null;
  const grid = displayed.slice(1);

  // Entrance stagger — items in a freshly loaded chunk cascade in. Initial
  // items get a short ramp; later chunks restart the ramp at their own start.
  const delayFor = (globalIdx: number) => {
    const inChunk =
      globalIdx < INITIAL ? globalIdx : (globalIdx - INITIAL) % CHUNK;
    return `${Math.min(inChunk, 11) * 35}ms`;
  };

  return (
    <>
      {/* Tile entrance — scoped keyframes; collapses under reduced motion */}
      <style>{`
        @keyframes gallery-tile-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-tile-anim { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* Count */}
      <p className="text-xs mb-6 font-medium tracking-wide" style={{ color: "var(--text-secondary)" }}>
        {images.length} photo{images.length !== 1 ? "s" : ""}
      </p>

      {/* ── Hero — first image, full width, 16:9 ──────────────────── */}
      {/* Lazy like the rest (28 Oct 2026): the gallery sits far down the
          product and application pages, and as `priority` its first photo
          was preloaded beside the page's hero, sharing a phone's bandwidth
          with the photo the visitor actually sees first. */}
      {hero && (
        <GalleryTile
          img={hero}
          globalIdx={0}
          aspect="aspect-[16/9]"
          onClick={() => setLightboxIndex(0)}
        />
      )}

      {/* ── Grid — 2-up on phones so the gallery reads as an app grid,
             not a one-column scroll; 3-up from lg ─────────────── */}
      {grid.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-3">
          {grid.map((img, i) => (
            <GalleryTile
              key={`${img.src}-${i}`}
              img={img}
              globalIdx={i + 1}
              aspect="aspect-[4/3]"
              onClick={() => setLightboxIndex(i + 1)}
              entranceDelay={delayFor(i + 1)}
            />
          ))}
        </div>
      )}

      {/* ── Crawlable fallback for everything below the fold ────────
             The grid above renders seven tiles and keeps the rest behind a
             button. A crawler never presses the button, so for a folder like
             /applications/parks-paths that meant 134 of 141 photographs never
             reached the HTML at all — invisible to Google Images no matter how
             good their alt text was.

             This is the pattern Google documents for lazy-loaded imagery: the
             same photos as plain <img> inside <noscript>, which Googlebot reads
             and a browser with JS never renders or fetches. No layout cost, no
             extra requests, nothing duplicated for a human — it is the list the
             sitemap already declares, said again in markup. */}
      {hasMore && (
        <noscript>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-3">
            {images.slice(shown).map((img) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={img.src}
                src={isSanityImage(img.src) ? sanitySized(img.src, GALLERY.fallbackWidth, GALLERY.fallbackQuality, img.name) : img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto rounded-xl"
              />
            ))}
          </div>
        </noscript>
      )}

      {/* ── Load more ─────────────────────────────────── */}
      {hasMore && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }} aria-live="polite">
            Showing {displayed.length} of {images.length}
          </p>
          <div className="flex items-center gap-2">
            {/* On a phone only one button, "Load N more", unless the next
                press is the rest anyway: "Show all 108" beside it was two
                choices for one job, and 108 photos at once is a lot on a
                phone (QA sweep, 16 Oct 2026). */}
            {/* The wrapper carries the phone hiding: .btn-ghost sets its
                display unlayered, so a utility on the button would lose. */}
            <span className={nextIsAll ? "" : "max-sm:hidden"}>
              <button onClick={() => setVisible(images.length)} className="btn-ghost">
                Show all {images.length}
              </button>
            </span>
            {!nextIsAll && (
              <button onClick={() => setVisible(nextShown)} className="btn-accent">
                Load {nextCount} more
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Lightbox — shared cinematic viewer (PhotoLightbox) ───── */}
      <PhotoLightbox
        photos={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}

// ── Tile ──────────────────────────────────────────────────────────
function GalleryTile({
  img,
  globalIdx,
  aspect,
  onClick,
  priority = false,
  entranceDelay,
}: {
  img: GalleryImage;
  globalIdx: number;
  aspect: string;
  onClick: () => void;
  priority?: boolean;
  entranceDelay?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${img.alt} fullscreen`}
      onClick={onClick}
      onKeyDown={(e) => {
        // Space must also activate a role="button" div per the ARIA button
        // pattern (Enter-only left keyboard users half-supported); Space
        // additionally needs preventDefault so the page doesn't scroll.
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      /* The caption sits on a dark scrim over the photograph, in every theme.
         Without pinning the surface, the light theme gave it #6B6862 on a
         near-black scrim — a contrast ratio of 3.6 on fourteen tiles. */
      data-surface="dark"
      className={`gallery-tile-anim group relative overflow-hidden rounded-xl cursor-zoom-in w-full ${aspect} focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 active:scale-[0.985] transition-transform duration-100`}
      style={
        entranceDelay
          ? { animation: "gallery-tile-in 0.4s ease both", animationDelay: entranceDelay }
          : undefined
      }
    >
      <PhotoImage
        src={img.src}
        alt={img.alt}
        filename={img.name}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        sizes={
          aspect === "aspect-[16/9]"
            ? "(max-width: 1280px) 100vw, 1280px"
            : "(max-width: 1024px) 50vw, 33vw"
        }
        // 80 and 78 (were 75 and 70): the work is what the page sells, and 70
        // showed as soft edges on the tiles (17 Oct 2026).
        quality={aspect === "aspect-[16/9]" ? GALLERY.firstQuality : GALLERY.tileQuality}
      />

      {/* Hover overlay — subtle bottom gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(249,115,22,0.18) 0%, transparent 50%)",
        }}
      />

      {/* Zoom icon */}
      <div
        className="absolute top-3 right-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "rgba(249,115,22,0.9)",
          backdropFilter: "blur(4px)",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2.5} strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      </div>

      {/* Caption slide-up */}
      {img.caption && (
        <div
          className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out px-4 py-3 pointer-events-none"
          style={{ background: "rgba(8,8,8,0.88)", backdropFilter: "blur(8px)" }}
        >
          <p className="text-[12px] leading-snug truncate" style={{ color: "var(--text-muted)" }}>
            {img.caption}
          </p>
        </div>
      )}
    </div>
  );
}
