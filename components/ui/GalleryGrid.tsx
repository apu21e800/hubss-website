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

const PAGE_SIZE = 24;

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(images.length / PAGE_SIZE);
  const displayed = images.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < images.length;

  return (
    <>
      <p className="text-xs mb-4 font-medium tracking-wide" style={{ color: "#6B7280" }}>
        {images.length} photo{images.length !== 1 ? "s" : ""}
      </p>

      <div style={{ columns: "3 260px", columnGap: "12px" }}>
        {displayed.map((img, i) => (
          <div
            key={`${img.src}-${i}`}
            role="button"
            tabIndex={0}
            aria-label={`View ${img.alt} fullscreen`}
            onClick={() => setLightboxIndex(i)}
            onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(i)}
            className="group relative overflow-hidden rounded-lg cursor-zoom-in"
            style={{ breakInside: "avoid", marginBottom: "12px", display: "block" }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={600}
              className="block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(249,115,22,0.18) 0%, transparent 60%)" }}
            />
            <div
              className="absolute top-2.5 right-2.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
              style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(249,115,22,0.90)", backdropFilter: "blur(4px)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </div>
            {img.caption && (
              <div
                className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out px-3 py-2 pointer-events-none"
                style={{ background: "rgba(8,8,8,0.85)", backdropFilter: "blur(8px)" }}
              >
                <p className="text-[0.68rem] leading-snug truncate" style={{ color: "#9ca3af" }}>{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {(hasMore || page > 1) && (
        <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
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
                Previous
              </button>
            )}
            {hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
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

      <Lightbox
        slides={images.map((img) => ({ src: img.src, alt: img.alt, title: img.alt, description: img.caption }))}
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        plugins={[Captions]}
      />
    </>
  );
}
