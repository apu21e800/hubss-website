"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

const PAGE_SIZE = 7;

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [page, setPage] = useState(1);

  const displayed = images.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < images.length;

  // Hero = first image; grid = the rest
  const hero = displayed[0] ?? null;
  const grid = displayed.slice(1);

  return (
    <>
      {/* Count */}
      <p className="text-xs mb-6 font-medium tracking-wide" style={{ color: "#6B7280" }}>
        {images.length} photo{images.length !== 1 ? "s" : ""}
      </p>

      {/* ── Hero — first image, full width, 16:9 ──────────────── */}
      {hero && (
        <GalleryTile
          img={hero}
          globalIdx={0}
          aspect="aspect-[16/9]"
          onClick={() => setLightboxIndex(0)}
          priority
        />
      )}

      {/* ── Grid — uniform 4:3, 1→2→3 col ────────────────────── */}
      {grid.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {grid.map((img, i) => (
            <GalleryTile
              key={`${img.src}-${i}`}
              img={img}
              globalIdx={i + 1}
              aspect="aspect-[4/3]"
              onClick={() => setLightboxIndex(i + 1)}
            />
          ))}
        </div>
      )}

      {/* ── Load more ─────────────────────────────────────────── */}
      {hasMore && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs" style={{ color: "#6B7280" }}>
            Showing {displayed.length} of {images.length}
          </p>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: "#f97316", color: "#fff" }}
          >
            Load {Math.min(PAGE_SIZE, images.length - displayed.length)} more
          </button>
        </div>
      )}

      {/* ── Lightbox ──────────────────────────────────────────── */}
      <Lightbox
        slides={images.map((img) => ({
          src: img.src,
          alt: img.alt,
          title: img.alt,
          description: img.caption,
        }))}
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        plugins={[Captions]}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}

// ── Tile ────────────────────────────────────────────────────────────────────
function GalleryTile({
  img,
  globalIdx,
  aspect,
  onClick,
  priority = false,
}: {
  img: GalleryImage;
  globalIdx: number;
  aspect: string;
  onClick: () => void;
  priority?: boolean;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${img.alt} fullscreen`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`group relative overflow-hidden rounded-xl cursor-zoom-in w-full ${aspect} focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        sizes={
          aspect === "aspect-[16/9]"
            ? "100vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        unoptimized
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
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round">
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
          <p className="text-[0.7rem] leading-snug truncate" style={{ color: "#9ca3af" }}>
            {img.caption}
          </p>
        </div>
      )}
    </div>
  );
}
