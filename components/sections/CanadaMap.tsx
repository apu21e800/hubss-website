"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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

// Bounds computed from all project coordinates — frames BC + Ontario clusters
const PROJECT_BOUNDS: [[number, number], [number, number]] = [
  [-124.5, 42.8],  // SW corner (west of Sechelt, south of Mississauga)
  [-74.5, 50.2],   // NE corner (east of Ottawa, north of all projects)
];

const INITIAL_VIEW = {
  longitude: -99.5,
  latitude: 46.8,
  zoom: 3.8,
};

// ── Custom orange pin ───────────────────────────────────────────────────────
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
        width="28" height="36" viewBox="0 0 28 36" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: active
            ? "drop-shadow(0 0 8px rgba(249,115,22,0.9))"
            : hovered
            ? "drop-shadow(0 0 5px rgba(249,115,22,0.6))"
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
        }}
      >
        <path
          d="M14 0C6.268 0 0 6.268 0 14c0 5.25 2.85 9.83 7.08 12.29L14 36l6.92-9.71C25.15 23.83 28 19.25 28 14 28 6.268 21.732 0 14 0z"
          fill={active ? "#ff8c3a" : "#F97316"}
        />
        <circle cx="14" cy="14" r="6" fill="white" fillOpacity={0.95} />
        <circle cx="14" cy="14" r="3" fill={active ? "#ff8c3a" : "#F97316"} />
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
        bottom: 46,
        left: "50%",
        transform: "translateX(-50%)",
        width: 260,
        background: "#111827",
        border: "1px solid rgba(249,115,22,0.35)",
        borderRadius: 12,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: 120 }}>
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          className="object-cover"
          sizes="260px"
          unoptimized
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, rgba(17,24,39,0.9) 100%)",
          }}
        />
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F97316", background: "rgba(249,115,22,0.12)", padding: "2px 7px", borderRadius: 4 }}>
            {project.product}
          </span>
          <span style={{ fontSize: 10, color: "#6B7280" }}>
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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#111827", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 20, maxWidth: 860, width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative" }}
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

        <div style={{ padding: "24px 28px 32px" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F97316", background: "rgba(249,115,22,0.12)", padding: "3px 10px", borderRadius: 6, border: "1px solid rgba(249,115,22,0.2)" }}>
                {project.product}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", background: "rgba(255,255,255,0.05)", padding: "3px 10px", borderRadius: 6 }}>
                {project.application}
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#F5F0EB", margin: "0 0 4px" }}>{project.title}</h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>📍 {project.city}, {project.province}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            <div style={{ position: "relative", width: "100%", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9" }}>
              <Image
                src={project.images[imgIndex]}
                alt={`${project.title} — photo ${imgIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 860px) 100vw, 860px"
                unoptimized
              />
            </div>
            {project.images.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                {project.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    style={{ position: "relative", width: 72, height: 48, borderRadius: 8, overflow: "hidden", border: i === imgIndex ? "2px solid #F97316" : "2px solid rgba(255,255,255,0.1)", cursor: "pointer", padding: 0, flexShrink: 0 }}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <Image src={src} alt={`${project.title} photo ${i + 1}`} fill className="object-cover" sizes="72px" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F97316", margin: "0 0 8px" }}>The Challenge</p>
              <p style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.6, margin: 0 }}>{project.problem}</p>
            </div>
            <div style={{ background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 12, padding: "16px 18px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F97316", margin: "0 0 8px" }}>The Solution</p>
              <p style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.6, margin: 0 }}>{project.solution}</p>
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <a href="/contact" style={{ background: "#F97316", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 22px", borderRadius: 8, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Request Similar Project →
            </a>
            <a href="/resources" style={{ background: "transparent", color: "#9CA3AF", fontWeight: 600, fontSize: 13, padding: "10px 22px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", display: "inline-flex", alignItems: "center" }}>
              Spec Sheets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Expandable project grid below map ───────────────────────────────────────
const INITIAL_VISIBLE = 6;

function ProjectGrid({ onSelectProject }: { onSelectProject: (p: MapProject) => void }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? mapProjects : mapProjects.slice(0, INITIAL_VISIBLE);

  return (
    <div style={{ marginTop: "2.5rem" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F97316", margin: 0 }}>
          Browse All Projects
        </p>
        <span style={{ fontSize: 12, color: "#6B7280" }}>
          {mapProjects.length} installations across Canada
        </span>
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {visible.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project)}
            style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 0, cursor: "pointer", overflow: "hidden", textAlign: "left", transition: "border-color 0.2s, transform 0.18s" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(249,115,22,0.4)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ position: "relative", height: 90, overflow: "hidden" }}>
              <Image src={project.images[0]} alt={project.title} fill className="object-cover" sizes="220px" unoptimized />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(26,30,40,0.95) 100%)" }} />
            </div>
            <div style={{ padding: "10px 12px 12px" }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F97316", margin: "0 0 4px" }}>
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

      {/* Expand / collapse toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: "1px solid rgba(249,115,22,0.35)",
            borderRadius: 8,
            padding: "10px 24px",
            cursor: "pointer",
            color: "#F97316",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.05em",
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(249,115,22,0.1)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(249,115,22,0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(249,115,22,0.35)";
          }}
        >
          {expanded ? (
            <>
              Show Less
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 9l5-5 5 5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          ) : (
            <>
              Show All {mapProjects.length} Projects
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CanadaMap() {
  const mapRef = useRef<MapRef>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<MapProject | null>(null);

  // Fit map to show all project markers on load
  const handleMapLoad = useCallback(() => {
    mapRef.current?.fitBounds(PROJECT_BOUNDS, {
      padding: { top: 60, bottom: 60, left: 80, right: 80 },
      duration: 0,
    });
  }, []);

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
      padding: { top: 60, bottom: 60, left: 80, right: 80 },
      duration: 1400,
    });
  }, []);

  return (
    <>
      <section style={{ background: "#080d16", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1rem" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: "3rem" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F97316", marginBottom: 10 }}>
                Installations Across Canada
              </p>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)", fontWeight: 800, color: "#F5F0EB", margin: "0 0 8px", lineHeight: 1.2 }}>
                Coast to Coast.{" "}
                <span style={{ background: "linear-gradient(90deg, #F97316, #EAB308)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Every Surface.
                </span>
              </h2>
              <p style={{ fontSize: 15, color: "#9CA3AF", maxWidth: 480, margin: 0 }}>
                Hover any marker to preview. Click to open the full case study — product, challenge, and results.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 12, padding: "12px 20px" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F97316", boxShadow: "0 0 8px rgba(249,115,22,0.8)" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F0EB" }}>{mapProjects.length} Projects Mapped</span>
            </div>
          </div>

          {/* Map */}
          <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(249,115,22,0.15)", boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)", height: "clamp(480px, 60vh, 680px)", position: "relative" }}>
            <Map
              ref={mapRef}
              mapStyle={MAP_STYLE}
              initialViewState={INITIAL_VIEW}
              style={{ width: "100%", height: "100%" }}
              minZoom={2.5}
              maxZoom={18}
              attributionControl={false}
              onLoad={handleMapLoad}
            >
              <NavigationControl position="bottom-right" style={{ marginBottom: 16, marginRight: 16 }} />
              <ScaleControl position="bottom-left" style={{ marginBottom: 16, marginLeft: 16 }} />

              {mapProjects.map((project) => (
                <Marker
                  key={project.id}
                  longitude={project.lng}
                  latitude={project.lat}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    handleMarkerClick(project);
                  }}
                >
                  <div
                    style={{ position: "relative" }}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <PinMarker
                      active={selectedProject?.id === project.id}
                      hovered={hoveredId === project.id}
                    />
                    {hoveredId === project.id && selectedProject?.id !== project.id && (
                      <HoverPopup project={project} />
                    )}
                  </div>
                </Marker>
              ))}
            </Map>

            <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(8,13,22,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "6px 14px", pointerEvents: "none", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 11, color: "#6B7280" }}>🖱 Hover to preview · Click to explore</span>
            </div>
          </div>

          {/* Expandable project grid */}
          <ProjectGrid onSelectProject={handleMarkerClick} />
        </div>
      </section>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </>
  );
}
