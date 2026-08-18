"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";

type Category = "all" | "crosswalks" | "transit" | "community" | "parks" | "recreation" | "parking";

interface GalleryImage {
  src: string;
  alt: string;
  category: Category;
  location: string;
  tall?: boolean;
}

const IMAGES: GalleryImage[] = [
  // ── Crosswalks ──────────────────────────────────────────────────────────────
  { src: "/images/blog/best-crosswalks-canada/featured.jpg", alt: "High-Visibility Crosswalk", category: "crosswalks", location: "Canada-Wide", tall: true },
  { src: "/images/blog/decorative-crosswalk-meridian/featured.jpg", alt: "Decorative Crosswalk — Meridian", category: "crosswalks", location: "Meridian, ON" },
  { src: "/images/blog/decorative-asphalt-high-traffic/featured.jpg", alt: "High-Traffic Decorative Asphalt", category: "crosswalks", location: "Ontario" },
  { src: "/images/blog/complete-streets-new-westminster/featured.jpg", alt: "Complete Streets", category: "crosswalks", location: "New Westminster, BC", tall: true },
  { src: "/images/blog/pedestrian-channelization-public-spaces/featured.jpg", alt: "Pedestrian Channelization", category: "crosswalks", location: "British Columbia" },
  { src: "/images/blog/performance-crosswalks-asphalt-concrete/featured.jpg", alt: "Performance Crosswalks", category: "crosswalks", location: "Canada" },
  { src: "/images/blog/trafficpatternsxd-urban-design/featured.jpg", alt: "TrafficPatternsXD Urban Design", category: "crosswalks", location: "Urban Canada", tall: true },
  { src: "/images/blog/stamped-asphalt-vs-concrete/featured.jpg", alt: "Stamped Asphalt Crosswalk", category: "crosswalks", location: "Ontario" },
  { src: "/images/blog/decorative-asphalt-crosswalks/featured.jpg", alt: "Decorative Asphalt Crosswalks", category: "crosswalks", location: "British Columbia" },
  { src: "/images/blog/decorative-crosswalk-commercial-drive/featured.jpg", alt: "Commercial Drive Crosswalk", category: "crosswalks", location: "Vancouver, BC", tall: true },
  { src: "/images/blog/decorative-crosswalks-community-identity/featured.jpg", alt: "Community Identity Crosswalk", category: "crosswalks", location: "Canada" },
  { src: "/images/blog/decorative-hardscape-grey-is-new-black/featured.jpg", alt: "Decorative Hardscape", category: "crosswalks", location: "Ontario" },
  { src: "/images/blog/municipalities-case-study/featured.jpg", alt: "Municipal Crosswalk", category: "crosswalks", location: "Ontario" },
  { src: "/images/blog/white-rock-langley-trafficpatterns/featured.jpg", alt: "TrafficPatterns Installation", category: "crosswalks", location: "White Rock, BC", tall: true },
  { src: "/images/blog/keeping-pedestrians-safe/featured.png", alt: "Pedestrian Safety Crosswalk", category: "crosswalks", location: "Canada" },
  { src: "/images/blog/educational-facilities/featured.jpg", alt: "School Zone Crosswalk", category: "crosswalks", location: "British Columbia" },
  { src: "/images/blog/murrayville-schoolhouse-sidewalk/featured.jpg", alt: "Murrayville Schoolhouse Sidewalk", category: "crosswalks", location: "Murrayville, BC" },
  { src: "/images/blog/transportation-infrastructure-guide/featured.jpg", alt: "Transportation Infrastructure", category: "crosswalks", location: "Canada", tall: true },
  // Application images (live after git push)
  { src: "/images/applications/crosswalks/crosswalks-01.jpg", alt: "Crosswalk Installation", category: "crosswalks", location: "Canada" },
  { src: "/images/applications/crosswalks/crosswalks-03.jpg", alt: "Thermoplastic Crosswalk", category: "crosswalks", location: "Ontario" },
  { src: "/images/applications/crosswalks/crosswalks-05.jpg", alt: "High-Vis Crosswalk", category: "crosswalks", location: "British Columbia" },
  { src: "/images/applications/crosswalks/crosswalks-07.jpg", alt: "Decorative Crosswalk", category: "crosswalks", location: "Canada", tall: true },
  { src: "/images/applications/crosswalks/crosswalks-10.jpg", alt: "Urban Crosswalk", category: "crosswalks", location: "Ontario" },
  { src: "/images/applications/crosswalks/crosswalks-14.jpg", alt: "Stamped Crosswalk", category: "crosswalks", location: "Canada" },
  { src: "/images/applications/crosswalks/crosswalks-18.jpg", alt: "Coloured Crosswalk", category: "crosswalks", location: "British Columbia" },
  { src: "/images/applications/crosswalks/crosswalks-43.jpg", alt: "Crosswalk — Community Art", category: "crosswalks", location: "Canada", tall: true },
  { src: "/images/applications/crosswalks/crosswalks-50.jpg", alt: "Crosswalk Install", category: "crosswalks", location: "Ontario" },
  { src: "/images/applications/crosswalks/crosswalks-65.jpg", alt: "Crosswalk Detail", category: "crosswalks", location: "Canada" },
  { src: "/images/applications/crosswalks/crosswalks-84.jpg", alt: "Municipal Crosswalk", category: "crosswalks", location: "Ontario" },
  { src: "/images/applications/crosswalks/crosswalks-100.jpg", alt: "Crosswalk — TPXD", category: "crosswalks", location: "Canada" },

  // ── Bike & Bus Lanes ────────────────────────────────────────────────────────
  { src: "/images/blog/multimodal-connectivity-york-region/featured.jpg", alt: "York Region Transit Corridor", category: "transit", location: "York Region, ON", tall: true },
  { src: "/images/blog/durable-transit-lanes-crossings/featured.jpg", alt: "Durable Transit Lanes", category: "transit", location: "Ontario" },
  { src: "/images/blog/extending-transit-lane-lifespan/featured.jpg", alt: "Bus Lane — Extended Lifespan", category: "transit", location: "Ontario" },
  { src: "/images/blog/imprinted-asphalt-york-transit/featured.jpg", alt: "York Region VIVA BRT", category: "transit", location: "York Region, ON", tall: true },
  { src: "/images/blog/safety-durability-transit-stations/featured.jpg", alt: "Transit Station Surface", category: "transit", location: "Ontario" },
  { src: "/images/blog/streetbondsr-solar-reflective-coatings/featured.jpg", alt: "StreetBondSR Bike Lane", category: "transit", location: "Canada" },
  { src: "/images/applications/bike-lanes/bike-lanes-01.jpg", alt: "Protected Bike Lane", category: "transit", location: "Canada", tall: true },
  { src: "/images/applications/bike-lanes/bike-lanes-03.jpg", alt: "Coloured Bike Lane", category: "transit", location: "British Columbia" },
  { src: "/images/applications/bike-lanes/bike-lanes-07.jpg", alt: "Bike Lane Marking", category: "transit", location: "Ontario" },
  { src: "/images/applications/bike-lanes/bike-lanes-14.jpg", alt: "Bike Lane — Urban", category: "transit", location: "Canada" },
  { src: "/images/applications/bus-lanes/bus-lanes-39.png", alt: "Red Resin Bus Lane", category: "transit", location: "Ontario", tall: true },
  { src: "/images/applications/bus-lanes/bus-lanes-40.png", alt: "MMA Bus Lane", category: "transit", location: "Canada" },

  // ── Community Branding ──────────────────────────────────────────────────────
  { src: "/images/blog/branded-crosswalks-vancouver-richmond/featured.jpg", alt: "Branded Crosswalks", category: "community", location: "Vancouver, BC", tall: true },
  { src: "/images/blog/community-branding-case-study/featured.jpg", alt: "Community Branding", category: "community", location: "Ontario" },
  { src: "/images/blog/simcoe-rainbow-crosswalk/featured.jpg", alt: "Rainbow Crosswalk", category: "community", location: "Simcoe, ON" },
  { src: "/images/blog/terry-fox-plaza-coquitlam/featured.jpg", alt: "Terry Fox Plaza", category: "community", location: "Coquitlam, BC", tall: true },
  { src: "/images/blog/tsain-ko-crosswalk-sechelt/featured.jpg", alt: "Tsain-Ko Crosswalk", category: "community", location: "Sechelt, BC" },
  { src: "/images/blog/pictograph-crosswalk-sechelt/featured.jpg", alt: "Pictograph Crosswalk", category: "community", location: "Sechelt, BC" },
  { src: "/images/blog/ubc-musqueam-crosswalk/featured.jpg", alt: "UBC Musqueam Crosswalk", category: "community", location: "Vancouver, BC", tall: true },
  { src: "/images/blog/every-child-matters-crosswalk/featured.png", alt: "Every Child Matters Crosswalk", category: "community", location: "British Columbia" },
  { src: "/images/blog/laneway-project/featured.png", alt: "Vancouver Laneway Project", category: "community", location: "Vancouver, BC" },
  { src: "/images/blog/white-rock-pier-crosswalk/featured.png", alt: "White Rock Pier Crosswalk", category: "community", location: "White Rock, BC", tall: true },
  { src: "/images/blog/community-spaces/featured.jpg", alt: "Community Space", category: "community", location: "British Columbia" },
  { src: "/images/blog/decorative-paving-solutions/featured.jpg", alt: "Decorative Paving", category: "community", location: "Canada" },
  { src: "/images/applications/community-branding/community-branding-01.jpg", alt: "Community Identity", category: "community", location: "Canada" },
  { src: "/images/applications/community-branding/community-branding-04.jpg", alt: "Branded Intersection", category: "community", location: "British Columbia", tall: true },
  { src: "/images/applications/community-branding/community-branding-08.jpg", alt: "Public Art Crosswalk", category: "community", location: "Canada" },
  { src: "/images/applications/community-branding/community-branding-12.jpg", alt: "Cultural Crosswalk", category: "community", location: "British Columbia" },

  // ── Parks & Paths ───────────────────────────────────────────────────────────
  { src: "/images/blog/spirit-trail-wayfinding-vancouver/featured.jpg", alt: "Spirit Trail Wayfinding", category: "parks", location: "Vancouver, BC", tall: true },
  { src: "/images/blog/bowen-island-asphalt-path/featured.jpg", alt: "Bowen Island Path", category: "parks", location: "Bowen Island, BC" },
  { src: "/images/blog/parc-riviera-streetbond-walkway/featured.jpg", alt: "Parc Riviera Walkway", category: "parks", location: "Quebec" },
  { src: "/images/blog/roadway-accents-natures-walk/featured.jpg", alt: "Nature Walk Accent", category: "parks", location: "Ontario", tall: true },
  { src: "/images/applications/parks-paths/parks-paths-96.png", alt: "Parks Path", category: "parks", location: "Canada" },
  { src: "/images/applications/parks-paths/parks-paths-99.png", alt: "Decorated Path", category: "parks", location: "British Columbia" },
  { src: "/images/applications/parks-paths/parks-paths-103.png", alt: "Community Path", category: "parks", location: "Canada", tall: true },

  // ── Recreation ──────────────────────────────────────────────────────────────
  { src: "/images/blog/bc-childrens-hospital-labyrinth/featured.jpg", alt: "BC Children's Hospital Labyrinth", category: "recreation", location: "Vancouver, BC", tall: true },
  { src: "/images/blog/durable-coatings-waterparks/featured.jpg", alt: "Waterpark Surface Coating", category: "recreation", location: "Canada" },
  { src: "/images/blog/playgrounds-recreation/featured.jpg", alt: "Playground Surface", category: "recreation", location: "Canada" },
  { src: "/images/applications/splash-pads/splash-pads-01.jpg", alt: "Splash Pad Surface", category: "recreation", location: "Ontario", tall: true },
  { src: "/images/applications/splash-pads/splash-pads-04.jpg", alt: "Splash Pad Design", category: "recreation", location: "Canada" },
  { src: "/images/applications/splash-pads/splash-pads-08.jpg", alt: "Splash Pad Installation", category: "recreation", location: "British Columbia" },
  { src: "/images/applications/sport-courts/sport-courts-01.jpg", alt: "Sport Court Surface", category: "recreation", location: "Canada" },
  { src: "/images/applications/sport-courts/sport-courts-05.jpg", alt: "Coloured Sport Court", category: "recreation", location: "Ontario", tall: true },
  { src: "/images/applications/sport-courts/sport-courts-10.jpg", alt: "Multi-Sport Court", category: "recreation", location: "Canada" },

  // ── Parking ─────────────────────────────────────────────────────────────────
  { src: "/images/blog/stamped-asphalt-parking-lot/featured.jpg", alt: "Stamped Asphalt Parking Lot", category: "parking", location: "Ontario", tall: true },
  { src: "/images/blog/commercial-applications/featured.jpg", alt: "Commercial Pavement", category: "parking", location: "Canada" },
  { src: "/images/applications/townhomes/townhomes-01.jpg", alt: "Townhome Driveway", category: "parking", location: "Ontario" },
  { src: "/images/applications/townhomes/townhomes-05.png", alt: "Residential Driveway", category: "parking", location: "British Columbia", tall: true },
];

const CATEGORIES: { value: Category; label: string; count: (imgs: GalleryImage[]) => number }[] = [
  { value: "all", label: "All", count: (imgs) => imgs.length },
  { value: "crosswalks", label: "Crosswalks", count: (imgs) => imgs.filter(i => i.category === "crosswalks").length },
  { value: "transit", label: "Bike & Bus Lanes", count: (imgs) => imgs.filter(i => i.category === "transit").length },
  { value: "community", label: "Community Branding", count: (imgs) => imgs.filter(i => i.category === "community").length },
  { value: "parks", label: "Parks & Paths", count: (imgs) => imgs.filter(i => i.category === "parks").length },
  { value: "recreation", label: "Recreation", count: (imgs) => imgs.filter(i => i.category === "recreation").length },
  { value: "parking", label: "Parking & Driveways", count: (imgs) => imgs.filter(i => i.category === "parking").length },
];

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2.5 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative mx-16 w-full max-w-5xl"
        style={{ maxHeight: "85vh", aspectRatio: "16/9" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 pt-12 pb-4 px-4 text-center" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
          <p className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{img.alt}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{img.location}</p>
        </div>
      </motion.div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
        {index + 1} / {images.length}
      </div>
    </motion.div>
  );
}

// ── Main Gallery Page ─────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [active, setActive] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "all" ? IMAGES : IMAGES.filter((img) => img.category === active);

  const openLightbox = useCallback((i: number) => setLightbox(i), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevImage = useCallback(() => setLightbox((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)), [filtered.length]);
  const nextImage = useCallback(() => setLightbox((i) => (i === null ? null : (i + 1) % filtered.length)), [filtered.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <main style={{ background: "#0a0e17", minHeight: "100vh" }}>
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#f97316" }}>
            Photo Archive
          </p>
          <h1
            className="font-black mb-4"
            style={{
              color: "#F5F0EB",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            Field Documentation
          </h1>
          <p style={{ color: "#868c98", fontSize: "1.05rem" }}>
            {IMAGES.length}+ installations documented across Canada.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2">
          {CATEGORIES.map((cat) => {
            const count = cat.count(IMAGES);
            const isActive = active === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => { setActive(cat.value); setLightbox(null); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap"
                style={{
                  background: isActive ? "#F97316" : "rgba(255,255,255,0.05)",
                  color: isActive ? "#fff" : "#9ca3af",
                  border: "1px solid",
                  borderColor: isActive ? "#F97316" : "rgba(255,255,255,0.1)",
                }}
              >
                {cat.label}
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Masonry grid — CSS columns */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              columns: "3 320px",
              columnGap: "12px",
            }}
          >
            {filtered.map((img, i) => (
              <div
                key={img.src + i}
                className="group relative overflow-hidden rounded-xl cursor-pointer mb-3"
                style={{
                  breakInside: "avoid",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onClick={() => openLightbox(i)}
              >
                <div
                  style={{
                    position: "relative",
                    paddingBottom: img.tall ? "133%" : "66.66%",
                    background: "var(--bg-card)",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }}
                  >
                    <p className="text-xs font-bold" style={{ color: "#f97316" }}>{img.category.toUpperCase().replace("-", " ")}</p>
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#F5F0EB" }}>{img.alt}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{img.location}</p>
                    <div className="mt-2 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" strokeWidth={2} strokeLinecap="round" />
                      </svg>
                      <span className="text-[10px]">Click to expand</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24" style={{ color: "rgba(255,255,255,0.3)" }}>
            <p>No photos in this category yet.</p>
          </div>
        )}
      </div>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={filtered}
            index={lightbox}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
