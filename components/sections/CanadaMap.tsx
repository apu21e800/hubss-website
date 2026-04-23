"use client";

import { useState, useCallback, useRef } from "react";
import Map, {
  Marker,
  NavigationControl,
  ScaleControl,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import { mapProjects, type MapProject } from "@/lib/map-projects";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

// Tight bounds derived from actual project coordinates
// W: Sechelt BC  E: Ottawa  S: Ontario  N: BC coast
const PROJECT_BOUNDS: [[number, number], [number, number]] = [
  [-126.0, 42.5],  // SW
  [-74.0, 50.8],   // NE
];

const FIT_OPTIONS = {
  padding: { top: 70, bottom: 90, left: 80, right: 80 },
  maxZoom: 10,
} as const;

// ── Clean teardrop pin — no ring, just a small dot ─────────────────────────
function PinMarker({ active, hovered }: { active: boolean; hovered: boolean }) {
  const scale = active ? 1.35 : hovered ? 1.15 : 1;
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <svg
        width="24" height="32" viewBox="0 0 24 32" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: active
            ? "drop-shadow(0 0 8px rgba(249,115,22,0.95))"
            : hovered
            ? "drop-shadow(0 0 6px rgba(249,115,22,0.65))"
            : "drop-shadow(0 2px 5px rgba(0,0,0,0.65))",
        }}
      >
        {/* Teardrop body */}
        <path
          d="M12 0C5.373 0 0 5.373 0 12c0 4.65 2.52 8.72 6.27 10.91L12 32l5.73-9.09C21.48 20.72 24 16.65 24 12 24 5.373 18.627 0 12 0z"
          fill={active ? "#ff8c3a" : "#F97316"}
        />
        {/* Small inner dot only */}
        <circle cx="12" cy="12" r="3" fill="white" fillOpacity={0.92} />
      </svg>
    </div>
  );
}

// ── Hover mini-card ─────────────────────────────────────────────────────────
function HoverPopup({ project }: { project: MapProject }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 44,
        left: "50%",
        transform: "translateX(-50%)",
        width: 255,
        background: "#111827",
        border: "1px solid rgba(249,115,22,0.35)",
        borderRadius: 12,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.75)",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          className="object-cover"
          sizes="255px"
          unoptimized
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(17,24,39,0.9) 100%)" }} />
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F97316", background: "rgba(249,115,22,0.12)", padding: "2px 7px", borderRadius: 4 }}>
            {project.product}
          </span>
          <span style={{ fontSize: 10, color: "#6B7280", lineHeight: 1 }}>
            {project.city}, {project.province}
          </span>
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#F5F0EB", lineHeight: 1.4, margin: 0 }}>
          {project.title}
        </p>
      </div>
    </div>
  );
}

// ── Project detail modal ────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: MapProject; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="canada-map-modal"
        style={{ background: "#111827", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 20, maxWidth: 880, width: "100%", maxHeight: "92vh", overflow: "auto", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ height: 3, background: "linear-gradient(90deg, #F97316, #EAB308)", borderRadius: "20px 20px 0 0" }} />

        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9CA3AF", zIndex: 10 }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>

        <div style={{ padding: "24px 24px 28px" }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F97316", background: "rgba(249,115,22,0.12)", padding: "3px 10px", borderRadius: 6, border: "1px solid rgba(249,115,22,0.2)" }}>
                {project.product}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", background: "rgba(255,255,255,0.05)", padding: "3px 10px", borderRadius: 6 }}>
                {project.application}
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", fontWeight: 800, color: "#F5F0EB", margin: "0 0 4px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{project.title}</h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>📍 {project.city}, {project.province}</p>
          </div>

          {/* Main image */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <div style={{ position: "relative", width: "100%", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", background: "#0d1117" }}>
              <Image
                src={project.images[imgIndex]}
                alt={`${project.title} — photo ${imgIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 880px) 100vw, 880px"
                unoptimized
              />
            </div>
            {project.images.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {project.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    style={{ position: "relative", width: 68, height: 46, borderRadius: 8, overflow: "hidden", border: i === imgIndex ? "2px solid #F97316" : "2px solid rgba(255,255,255,0.1)", cursor: "pointer", padding: 0, flexShrink: 0 }}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <Image src={src} alt={`${project.title} photo ${i + 1}`} fill className="object-cover" sizes="68px" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Problem / Solution */}
          <div className="canada-map-modal-grid">
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F97316", margin: "0 0 8px" }}>The Challenge</p>
              <p style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.65, margin: 0 }}>{project.problem}</p>
            </div>
            <div style={{ background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 12, padding: "16px 18px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F97316", margin: "0 0 8px" }}>The Solution</p>
              <p style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.65, margin: 0 }}>{project.solution}</p>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/contact"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", fontWeight: 700, fontSize: 13, padding: "11px 24px", borderRadius: 8, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(249,115,22,0.35)" }}
            >
              Request Similar Project →
            </a>
            <a
              href="/contact"
              style={{ background: "transparent", color: "#9CA3AF", fontWeight: 600, fontSize: 13, padding: "11px 24px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", display: "inline-flex", alignItems: "center" }}
            >
              Get a Quote →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Animated accordion project grid ────────────────────────────────────────
const INITIAL_VISIBLE = 6;

function ProjectGrid({ onSelectProject }: { onSelectProject: (p: MapProject) => void }) {
  const [expanded, setExpanded] = useState(false);
  const visibleProjects = expanded ? mapProjects : mapProjects.slice(0, INITIAL_VISIBLE);

  return (
    <div style={{ marginTop: "2.5rem" }}>
      {/* Accordion trigger header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(249,115,22,0.04)",
          border: "1px solid rgba(249,115,22,0.18)",
          borderRadius: expanded ? "12px 12px 0 0" : 12,
          padding: "14px 20px",
          cursor: "pointer",
          transition: "background 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(249,115,22,0.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(249,115,22,0.04)"; }}
        aria-expanded={expanded}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316", boxShadow: "0 0 6px rgba(249,115,22,0.7)", flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F97316" }}>
            Browse All Projects
          </span>
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            — {mapProjects.length} installations
          </span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{
            color: "#F97316",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
            flexShrink: 0,
          }}
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Animated accordion body — grid-template-rows trick for smooth height animation */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: expanded ? "1fr" : "0fr",
          transition: "grid-template-rows 0.42s cubic-bezier(0.4,0,0.2,1)",
          background: "rgba(255,255,255,0.015)",
          border: expanded ? "1px solid rgba(249,115,22,0.12)" : "1px solid transparent",
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 16px 20px" }}>
            <div className="canada-map-grid">
              {visibleProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 0, cursor: "pointer", overflow: "hidden", textAlign: "left", transition: "border-color 0.2s, transform 0.18s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "rgba(249,115,22,0.4)";
                    el.style.transform = "translateY(-2px)";
                    el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "rgba(255,255,255,0.07)";
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                    <Image src={project.images[0]} alt={project.title} fill className="object-cover" sizes="220px" unoptimized />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(26,30,40,0.95) 100%)" }} />
                  </div>
                  <div style={{ padding: "10px 12px 12px" }}>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F97316", margin: "0 0 4px", lineHeight: 1 }}>
                      {project.city}, {project.province}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#F5F0EB", margin: "0 0 4px", lineHeight: 1.35 }}>
                      {project.title}
                    </p>
                    <p style={{ fontSize: 10, color: "#6B7280", margin: 0 }}>{project.product}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Show more / show less within the open accordion */}
            {mapProjects.length > INITIAL_VISIBLE && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 12, fontWeight: 600, marginTop: 16, padding: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: "rotate(180deg)" }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Collapse
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CanadaMap() {
  const mapRef = useRef<MapRef>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<MapProject | null>(null);

  const handleMarkerClick = useCallback((project: MapProject) => {
    setSelectedProject(project);
    mapRef.current?.flyTo({
      center: [project.lng, project.lat],
      zoom: 11,
      duration: 1200,
      essential: true,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
    mapRef.current?.fitBounds(PROJECT_BOUNDS, {
      ...FIT_OPTIONS,
      duration: 1400,
    });
  }, []);

  return (
    <>
      <style>{`
        .canada-map-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .canada-map-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
          gap: 10px;
        }
        @media (max-width: 640px) {
          .canada-map-modal { border-radius: 14px !important; }
          .canada-map-modal-grid { grid-template-columns: 1fr !important; }
          .canada-map-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .canada-map-header { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <section style={{ background: "#080d16", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem" }}>

          {/* Header */}
          <div className="canada-map-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: "2.5rem" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F97316", marginBottom: 10 }}>
                Installations Across Canada
              </p>
              <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 900, color: "#F5F0EB", margin: "0 0 10px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                Coast to Coast.{" "}
                <span style={{ background: "linear-gradient(90deg, #F97316, #EAB308)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Every Surface.
                </span>
              </h2>
              <p style={{ fontSize: 15, color: "#9CA3AF", maxWidth: 460, margin: 0, lineHeight: 1.6 }}>
                Hover any marker to preview. Click to open the full case study.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 12, padding: "12px 20px", flexShrink: 0 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#F97316", boxShadow: "0 0 8px rgba(249,115,22,0.85)" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F0EB" }}>{mapProjects.length} Projects Mapped</span>
            </div>
          </div>

          {/* Map */}
          <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(249,115,22,0.15)", boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)", height: "clamp(360px, 56vh, 660px)", position: "relative" }}>
            <Map
              ref={mapRef}
              mapStyle={MAP_STYLE}
              initialViewState={{
                bounds: PROJECT_BOUNDS,
                fitBoundsOptions: FIT_OPTIONS,
              }}
              style={{ width: "100%", height: "100%" }}
              minZoom={2.5}
              maxZoom={18}
              attributionControl={false}
            >
              <NavigationControl position="bottom-right" style={{ marginBottom: 16, marginRight: 16 }} />
              <ScaleControl position="bottom-left" style={{ mar