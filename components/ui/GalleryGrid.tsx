"use client";

import { useState, useMemo } from "react";
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

const PAGE_SIZE = 24;

// Deterministic aspect ratio pattern — creates visual rhythm without random jank
// Sequence: landscape, portrait, landscape, landscape, portrait, landscape ...
const ASPECT_PATTERN = [
  "aspect-[4/3]",   // landscape
  "aspect-[3/4]",   // portrait
  "aspect-[4/3]",   // landscape
  "aspect-[16/10]", // wide
  "aspect-[3/4]",   // portrait
  "aspect-[4/3]",   // landscape
  "aspect-[1/1]",   // square
  "aspect-[4/3]",   // landscape
  "aspect-[3/4]",   // portrait
  "aspect-[16/10]", // wide
  "aspect-[4/3]",   // landscape
  "aspect-[1/1]",   // square
];

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [page, setPage] = useState(1);

  const displayed = images.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < images.length;
  const totalPages = Math.ceil(images.length / PAGE_SIZE);

  // Split displayed images into 3 columns for true masonry
  const columns = useMemo(() => {
    const cols: { img: GalleryImage; globalIdx: number; aspect: string }[][] = [[], [], []];
    displayed.forEach((img, i) => {
      cols[i % 3].push({
        img,
        globalIdx: i,
        aspect: ASPECT_PATTERN[i % ASPECT_PATTERN.length],
      });
    });
    return cols;
  }, [displayed]);

  return (
    <>
      {/* Count badge */}
      <p className="text-xs mb-5 font-medium tracking-wide" style={{ color: "#6B7280" }}>
        {images.length} photo{images.length !== 1 ? "s" : ""}
      </p>

      {/* 3-column masonry — desktop; 2-col tablet; 1-col mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Mobile / tablet: flat list with varied aspect ratios */}
        <div className="sm:hidden contents">
          {displayed.map((img, i) => (
            <GalleryTile
              key={`m-${img.src}-${i}`}
              img={img}
              globalIdx={i}
              aspect={ASPECT_PATTERN[i % ASPECT_PATTERN.length]}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>

        {/* sm: 2 columns */}
        <div className="hidden sm:contents lg:hidden">
          {[0, 1].map((colIdx) => (
            <div key={colIdx} className="flex flex-col gap-3">
              {displayed
                .filter((_, i) => i % 2 === colIdx)
                .map((img, ci) => {
                  const globalIdx = ci * 2 + colIdx;
                  return (
                    <GalleryTile
                      key={`sm-${img.src}-${globalIdx}`}
                      img={img}
                      globalIdx={globalIdx}
                      aspect={ASPECT_PATTERN[globalIdx % ASPECT_PATTERN.length]}
                      onClick={() => setLightboxIndex(globalIdx)}
                    />
                  );
                })}
            </div>
          ))}
        </div>

        {/* lg: 3 true masonry columns */}
        <div className="hidden lg:contents">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-3">
              {col.map(({ img, globalIdx, aspect }) => (
                <GalleryTile
                  key={`lg-${img.src}-${globalIdx}`}
                  img={img}
                  globalIdx={globalIdx}
                  aspect={aspect}
                  onClick={() => setLightboxIndex(globalIdx)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination bar */}
      {(hasMore || page > 1) && (
        <div
          className="flex items-center justify-between mt-10 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs" style={{ color: "#6B7280" }}>
            Showing {displayed.length} of {images.length} photos
          </p>
          <div className="flex gap-3">
            {page > 1 && (
              <button
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all border hover:border-orange-500/50 hover:text-white"
                style={{ color: "#9CA3AF", borderColor: "rgba(255,255,255,0.12)" }}
              >
                ← Previous
              </button>
            )}
            {hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
                style={{ background: "#f97316", color: "#fff" }}
              >
                Load More ({Math.min(PAGE_SIZE, images.length - displayed.length)} more)
              </button>
            )}
          </div>
          {totalPages > 1 && (
            <p className="text-xs hidden sm:block" style={{ color: "#4B5563" }}>
              Page {page} of {totalPages}
            </p>
          )}
        </div>
      )}

      {/* Lightbox */}
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
      />
    </>
  );
}

// ── Tile sub-component ──────────────────────────────────────────────────────
function GalleryTile({
  img,
  globalIdx,
  aspect,
  onClick,
}: {
  img: GalleryImage;
  globalIdx: number;
  aspect: string;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${img.alt} fullscreen`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`group relative overflow-hidden rounded-xl cursor-zoom-in w-full ${aspect}`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        unoptimized
      />

      {/* Hover gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(249,115,22,0.22) 0%, transparent 55%)",
        }}
      />

      {/* Zoom badge */}
      <div
        className="absolute top-3 right-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "rgba(249,115,22,0.92)",
          backdropFilter: "blur(4px)",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      </div>

      {/* Caption slide-up */}
      {img.caption && (
        <div
          className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out px-4 py-3 pointer-events-none"
          style={{
            background: "rgba(8,8,8,0.88)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p
            className="text-[0.7rem] leading-snug truncate"
            style={{ color: "#9ca3af" }}
          >
            {img.caption}
          </p>
        </div>
      )}
    </div>
  );
}
