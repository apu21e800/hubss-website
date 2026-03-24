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

const INITIAL_COUNT = 6;

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? images : images.slice(0, INITIAL_COUNT);
  const hasMore = images.length > INITIAL_COUNT;

  return (
    <>
      {/* CSS-columns masonry: 3 desktop / 2 tablet / 1 mobile */}
      <div
        className="gallery-masonry"
        style={{
          columns: "3 220px",
          columnGap: "10px",
        }}
      >
        {displayed.map((img, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            aria-label={`View ${img.alt} fullscreen`}
            onClick={() => setIndex(i)}
            onKeyDown={(e) => e.key === "Enter" && setIndex(i)}
            className="group relative overflow-hidden rounded-sm cursor-zoom-in"
            style={{ breakInside: "avoid", marginBottom: "10px", display: "block" }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={600}
              className="block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Orange bottom-gradient accent on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(249,115,22,0.22) 0%, transparent 55%)",
              }}
            />

            {/* Zoom indicator badge */}
            <div
              className="absolute top-2.5 right-2.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100"
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "rgba(249,115,22,0.92)",
                backdropFilter: "blur(4px)",
              }}
            >
              <svg
                width="13"
                height="13"
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

            {/* Caption peek — slides up on hover */}
            {img.caption && (
              <div
                className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out px-3 py-2 pointer-events-none"
                style={{ background: "rgba(8,8,8,0.82)", backdropFilter: "blur(6px)" }}
              >
                <p className="text-[0.68rem] leading-snug truncate" style={{ color: "#9ca3af" }}>
                  {img.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-lg transition-all text-sm font-semibold"
          >
            {showAll ? "Show Less" : `View More Photos (${images.length - INITIAL_COUNT} more)`}
          </button>
        </div>
      )}

      <Lightbox
        slides={images.map((img) => ({
          src: img.src,
          alt: img.alt,
          title: img.alt,
          description: img.caption,
        }))}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Captions]}
      />
    </>
  );
}
