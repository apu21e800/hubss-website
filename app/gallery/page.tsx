"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import PhotoLightbox from "@/components/ui/PhotoLightbox";
import JsonLd from "@/components/ui/JsonLd";
import { imageObject } from "@/lib/image-seo";

type Category = "all" | "crosswalks" | "transit" | "community" | "parks" | "recreation" | "parking";

interface GalleryImage {
  src: string;
  alt: string;
  category: Category;
  location: string;
  tall?: boolean;
}

const IMAGES: GalleryImage[] = [
  // ── Crosswalks ────────────────────────────────────────────────────────────────
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

  // ── Community Branding ──────────────────────────────────────────────────
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

  // ── Parks & Paths ─────────────────────────────────────────────────────────────
  { src: "/images/blog/spirit-trail-wayfinding-vancouver/featured.jpg", alt: "Spirit Trail Wayfinding", category: "parks", location: "Vancouver, BC", tall: true },
  { src: "/images/blog/bowen-island-asphalt-path/featured.jpg", alt: "Bowen Island Path", category: "parks", location: "Bowen Island, BC" },
  { src: "/images/blog/parc-riviera-streetbond-walkway/featured.jpg", alt: "Parc Riviera Walkway", category: "parks", location: "Quebec" },
  { src: "/images/blog/roadway-accents-natures-walk/featured.jpg", alt: "Nature Walk Accent", category: "parks", location: "Ontario", tall: true },
  { src: "/images/applications/parks-paths/parks-paths-96.png", alt: "Parks Path", category: "parks", location: "Canada" },
  { src: "/images/applications/parks-paths/parks-paths-99.png", alt: "Decorated Path", category: "parks", location: "British Columbia" },
  { src: "/images/applications/parks-paths/parks-paths-103.png", alt: "Community Path", category: "parks", location: "Canada", tall: true },

  // ── Recreation ──────────────────────────────────────────────────────────────────
  { src: "/images/blog/bc-childrens-hospital-labyrinth/featured.jpg", alt: "BC Children's Hospital Labyrinth", category: "recreation", location: "Vancouver, BC", tall: true },
  { src: "/images/blog/durable-coatings-waterparks/featured.jpg", alt: "Waterpark Surface Coating", category: "recreation", location: "Canada" },
  { src: "/images/blog/playgrounds-recreation/featured.jpg", alt: "Playground Surface", category: "recreation", location: "Canada" },
  { src: "/images/applications/splash-pads/splash-pads-01.jpg", alt: "Splash Pad Surface", category: "recreation", location: "Ontario", tall: true },
  { src: "/images/applications/splash-pads/splash-pads-04.jpg", alt: "Splash Pad Design", category: "recreation", location: "Canada" },
  { src: "/images/applications/splash-pads/splash-pads-08.jpg", alt: "Splash Pad Installation", category: "recreation", location: "British Columbia" },
  { src: "/images/applications/sport-courts/sport-courts-01.jpg", alt: "Sport Court Surface", category: "recreation", location: "Canada" },
  { src: "/images/applications/sport-courts/sport-courts-05.jpg", alt: "Coloured Sport Court", category: "recreation", location: "Ontario", tall: true },
  { src: "/images/applications/sport-courts/sport-courts-10.jpg", alt: "Multi-Sport Court", category: "recreation", location: "Canada" },

  // ── Parking ─────────────────────────────────────────────────────────────────────
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

// ── Main Gallery Page ───────────────────────────────────────────────────────────────────────
// Vernon (Aug 2026): break up how many images load at once. The archive was
// rendering all photos in one 10,800px wall. Now: first PAGE, then +PAGE
// as you approach the end — auto-load is right HERE (only the footer sits
// below), while product/application galleries stay button-driven.
const PAGE = 24;

export default function GalleryPage() {
  const [active, setActive] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = active === "all" ? IMAGES : IMAGES.filter((img) => img.category === active);
  const displayed = filtered.slice(0, visible);
  const hasMore = displayed.length < filtered.length;

  // Auto-load the next page when the sentinel nears the viewport.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible((v) => Math.min(v + PAGE, filtered.length));
        }
      },
      { rootMargin: "600px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // `visible` in the deps recreates the observer after every chunk: the
    // fresh observation re-checks immediately, so a sentinel that never left
    // the 600px margin (tall viewport, fast scroll) keeps cascading instead
    // of stalling after the first load.
  }, [hasMore, filtered.length, visible]);

  const openLightbox = useCallback((i: number) => setLightbox(i), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);


  /**
   * The archive as an addressable collection.
   *
   * This page is the densest photography on the site and it carried no
   * structured data whatsoever — 78 documented Canadian installations that a
   * crawler could see only as anonymous <img> tags. As an ImageGallery of
   * ImageObjects, each photograph arrives with its location, its subject, the
   * credit, and the licence terms that make it eligible for the Licensable
   * badge in Google Images; and the set as a whole becomes something an AI
   * crawler can cite by name rather than merely scrape.
   */
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": "https://hubss.com/gallery#gallery",
    name: "HUB Surface Systems field documentation",
    description:
      `${IMAGES.length} documented decorative pavement installations across Canada — crosswalks, transit lanes, ` +
      "parks and paths, playgrounds, and community branding by HUB Surface Systems.",
    url: "https://hubss.com/gallery",
    inLanguage: "en-CA",
    numberOfItems: IMAGES.length,
    author: { "@id": "https://hubss.com/#organization" },
    associatedMedia: IMAGES.map((img) =>
      imageObject(img.src, {
        alt: `${img.alt} — ${img.location} — decorative pavement by HUB Surface Systems`,
        caption: `${img.alt}, ${img.location}. Installed by HUB Surface Systems.`,
      })
    ),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hubss.com" },
      { "@type": "ListItem", position: 2, name: "Photo Archive", item: "https://hubss.com/gallery" },
    ],
  };

  return (
    <main style={{ background: "#101010", minHeight: "100vh" }}>
      <JsonLd data={gallerySchema} />
      <JsonLd data={breadcrumbSchema} />
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
                onClick={() => { setActive(cat.value); setLightbox(null); setVisible(PAGE); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 rounded-full transition-all whitespace-nowrap"
                style={{
                  background: isActive ? "#F97316" : "rgba(255,255,255,0.05)",
                  color: isActive ? "#fff" : "#9ca3af",
                  border: "1px solid",
                  borderColor: isActive ? "#F97316" : "rgba(255,255,255,0.1)",
                  // 44px floor — these were 35px tall, and category filters are
                  // the first thing a phone user reaches for on this page.
                  minHeight: 44,
                }}
              >
                {cat.label}
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.2)" : "var(--border-color)",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tile entrance — collapses under reduced motion */}
        <style>{`
          @keyframes archive-tile-in {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .archive-tile { animation: none !important; opacity: 1 !important; }
          }
        `}</style>

        {/* Uniform app grid — stable pagination (new tiles append at the end,
            nothing reflows), 2-up on phones like a native photo app */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3"
          >
            {displayed.map((img, i) => (
              <div
                key={img.src + i}
                className="archive-tile group relative overflow-hidden rounded-xl cursor-pointer active:scale-[0.985] transition-transform duration-100"
                style={{
                  border: "1px solid var(--border-color)",
                  animation: "archive-tile-in 0.4s ease both",
                  animationDelay: `${(i % PAGE) % 12 * 30}ms`,
                }}
                onClick={() => openLightbox(i)}
              >
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "75%",
                    background: "var(--bg-card)",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={`${img.alt} — ${img.location} — decorative pavement by HUB Surface Systems`}
                    fill
                    loading={i < 8 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    quality={70}
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

        {/* Load more — sentinel auto-loads as it approaches; button as backup */}
        {hasMore && (
          <div ref={sentinelRef} className="mt-10 flex flex-col items-center gap-3">
            <p className="text-xs" style={{ color: "#868c98" }} aria-live="polite">
              Showing {displayed.length} of {filtered.length}
            </p>
            <button
              onClick={() => setVisible((v) => Math.min(v + PAGE, filtered.length))}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ background: "#f97316", color: "#fff" }}
            >
              Load more
            </button>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24" style={{ color: "rgba(255,255,255,0.3)" }}>
            <p>No photos in this category yet.</p>
          </div>
        )}
      </div>

      <Footer />

      {/* Lightbox — shared cinematic viewer */}
      <PhotoLightbox
        photos={filtered.map((img) => ({
          src: img.src,
          // Same descriptive string the tile carries. This used to be the bare
          // label ("High-Visibility Crosswalk"), so the fullscreen view — the
          // one a reader actually studies — was the least described surface
          // on the page.
          alt: `${img.alt} — ${img.location} — decorative pavement by HUB Surface Systems`,
          caption: `${img.alt} — ${img.location}`,
        }))}
        index={lightbox ?? -1}
        onClose={closeLightbox}
        onIndexChange={(i) => setLightbox(i)}
      />
    </main>
  );
}
