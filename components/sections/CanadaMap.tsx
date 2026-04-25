"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import Map, {
  Source,
  Layer,
  Popup,
  NavigationControl,
  type MapRef,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import { mapProjects, type MapProject } from "@/lib/map-projects";
import type { FeatureCollection, Point } from "geojson";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const CANADA_BOUNDS: [[number, number], [number, number]] = [
  [-133.5, 41.5], // SW: BC coast
  [-52.0, 56.0],  // NE: Newfoundland
];

const FIT_OPTIONS = {
  padding: { top: 60, bottom: 80, left: 60, right: 60 },
  maxZoom: 7,
} as const;

// ── Pre-build GeoJSON once (outside component) ─────────────────────────────
const projectsGeoJSON: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: mapProjects.map((p) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    properties: {
      id: p.id,
      title: p.title,
      city: p.city,
      province: p.province,
      product: p.product,
      application: p.application,
      excerpt: p.excerpt,
      image: p.images[0],
    },
  })),
};

// ── Layer specs ──────────────────────────────────────────────────────
const CLUSTER_LAYER = {
  id: "clusters",
  type: "circle" as const,
  source: "projects",
  filter: ["has", "point_count"] as unknown as boolean,
  paint: {
    "circle-color": "#F97316",
    "circle-radius": [
      "step",
      ["get", "point_count"],
      22, 5, 28, 15, 35,
    ] as unknown as number,
    "circle-opacity": 0.92,
    "circle-stroke-width": 2.5,
    "circle-stroke-color": "rgba(249,115,22,0.3)",
  },
};

const CLUSTER_COUNT_LAYER = {
  id: "cluster-count",
  type: "symbol" as const,
  source: "projects",
  filter: ["has", "point_count"] as unknown as boolean,
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-size": 13,
    "text-font": ["Noto Sans Bold", "Noto Sans Regular"],
  },
  paint: {
    "text-color": "#ffffff",
  },
};

const POINT_LAYER = {
  id: "unclustered-point",
  type: "circle" as const,
  source: "projects",
  filter: ["!", ["has", "point_count"]] as unknown as boolean,
  paint: {
    "circle-color": "#F97316",
    "circle-radius": 7,
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
    "circle-opacity": 0.95,
  },
};

const HOVERED_RING_LAYER = {
  id: "hovered-ring",
  type: "circle" as const,
  source: "hovered",
  paint: {
    "circle-color": "transparent",
    "circle-radius": 14,
    "circle-stroke-width": 3,
    "circle-stroke-color": "#F97316",
    "circle-stroke-opacity": 0.9,
    "circle-opacity": 0,
  },
};

// ── Panel project card ──────────────────────────────────────────────────────
function PanelCard({
  project,
  hovered,
  selected,
  onHover,
  onClick,
}: {
  project: MapProject;
  hovered: boolean;
  selected: boolean;
  onHover: (id: string | null) => void;
  onClick: (project: MapProject) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(project)}
      style={{
        display: "flex",
        gap: 10,
        padding: "11px 14px",
        cursor: "pointer",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: selected
          ? "rgba(249,115,22,0.12)"
          : hovered
          ? "rgba(249,115,22,0.07)"
          : "transparent",
        borderLeft: selected
          ? "3px solid #F97316"
          : hovered
          ? "3px solid rgba(249,115,22,0.4)"
          : "3px solid transparent",
        transition: "background 0.15s ease, border-left-color 0.15s ease",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 64,
          height: 46,
          borderRadius: 7,
          overflow: "hidden",
          flexShrink: 0,
          border:
            hovered || selected
              ? "1.5px solid rgba(249,115,22,0.55)"
              : "1.5px solid rgba(255,255,255,0.07)",
          transition: "border-color 0.15s ease",
        }}
      >
        <Image
          src={project.images[0]}
          alt={project.title}
          width={64}
          height={46}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          unoptimized
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#F97316",
              background: "rgba(249,115,22,0.12)",
              padding: "1.5px 6px",
              borderRadius: 4,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {project.product}
          </span>
        </div>
        <p
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: hovered || selected ? "#F5F0EB" : "#D1D5DB",
            lineHeight: 1.35,
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transition: "color 0.15s ease",
          }}
        >
          {project.title}
        </p>
        <p
          style={{
            fontSize: 10.5,
            color: "#6B7280",
            margin: "2px 0 0",
            lineHeight: 1,
          }}
        >
          {project.city}, {project.province}
        </p>
      </div>

      {/* Arrow */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hovered || selected ? "#F97316" : "#374151"}
          strokeWidth={2}
          strokeLinecap="round"
          style={{ transition: "stroke 0.15s ease" }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

// ── Project detail modal ──────────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: MapProject;
  onClose: () => void;
}) {
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="canada-map-modal"
        style={{
          background: "#111827",
          border: "1px solid rgba(249,115,22,0.25)",
          borderRadius: 20,
          maxWidth: 880,
          width: "100%",
          maxHeight: "92vh",
          overflow: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #F97316, #EAB308)",
            borderRadius: "20px 20px 0 0",
          }}
        />

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#9CA3AF",
            zIndex: 10,
          }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div style={{ padding: "24px 24px 28px" }}>
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#F97316",
                  background: "rgba(249,115,22,0.12)",
                  padding: "3px 10px",
                  borderRadius: 6,
                  border: "1px solid rgba(249,115,22,0.2)",
                }}
              >
                {project.product}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6B7280",
                  background: "rgba(255,255,255,0.05)",
                  padding: "3px 10px",
                  borderRadius: 6,
                }}
              >
                {project.application}
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                fontWeight: 800,
                color: "#F5F0EB",
                margin: "0 0 4px",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {project.title}
            </h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
              📍 {project.city}, {project.province}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                aspectRatio: "16/9",
                background: "#0d1117",
              }}
            >
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
                    style={{
                      position: "relative",
                      width: 68,
                      height: 46,
                      borderRadius: 8,
                      overflow: "hidden",
                      border:
                        i === imgIndex
                          ? "2px solid #F97316"
                          : "2px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      padding: 0,
                      flexShrink: 0,
                    }}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${project.title} photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="68px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="canada-map-modal-grid">
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#F97316",
                  margin: "0 0 8px",
                }}
              >
                The Challenge
              </p>
              <p style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.65, margin: 0 }}>
                {project.problem}
              </p>
            </div>
            <div
              style={{
                background: "rgba(249,115,22,0.04)",
                border: "1px solid rgba(249,115,22,0.15)",
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#F97316",
                  margin: "0 0 8px",
                }}
              >
                The Solution
              </p>
              <p style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.65, margin: 0 }}>
                {project.solution}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/contact"
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                padding: "11px 24px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
              }}
            >
              Request Similar Project →
            </a>
            <a
              href="/contact"
              style={{
                background: "transparent",
                color: "#9CA3AF",
                fontWeight: 600,
                fontSize: 13,
                padding: "11px 24px",
                borderRadius: 8,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Get a Quote →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function CanadaMap() {
  const mapRef = useRef<MapRef>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<MapProject | null>(null);
  const [cursor, setCursor] = useState("grab");
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const scrollEnabledRef = useRef(false);
  const [popupProject, setPopupProject] = useState<MapProject | null>(null);
  const [visibleProjects, setVisibleProjects] = useState<MapProject[]>(mapProjects);

  // ── GeoJSON for hover ring ───────────────────────────────────────────────────
  const hoveredProject = useMemo(
    () => (hoveredId ? mapProjects.find((p) => p.id === hoveredId) ?? null : null),
    [hoveredId]
  );

  const hoveredGeoJSON = useMemo<FeatureCollection<Point>>(
    () => ({
      type: "FeatureCollection",
      features: hoveredProject
        ? [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [hoveredProject.lng, hoveredProject.lat],
              },
              properties: {},
            },
          ]
        : [],
    }),
    [hoveredProject]
  );

  // ── Update panel list based on map bounds ──────────────────────────────────
  const updateVisibleProjects = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) {
      setVisibleProjects(mapProjects);
      return;
    }
    const w = bounds.getWest();
    const e = bounds.getEast();
    const s = bounds.getSouth();
    const n = bounds.getNorth();
    setVisibleProjects(
      mapProjects.filter((p) => p.lng >= w && p.lng <= e && p.lat >= s && p.lat <= n)
    );
  }, []);

  // ── Scroll zoom management ────────────────────────────────────────────────────
  // Keep ref in sync so event listeners never close over stale state
  useEffect(() => {
    scrollEnabledRef.current = scrollEnabled;
  }, [scrollEnabled]);

  const enableScrollZoom = useCallback(() => {
    if (!scrollEnabledRef.current) {
      mapRef.current?.getMap().scrollZoom.enable();
      scrollEnabledRef.current = true;
      setScrollEnabled(true);
    }
  }, []);

  // Ctrl+scroll to zoom — no click required
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    function handleCtrlWheel(e: WheelEvent) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        enableScrollZoom();
      }
    }
    container.addEventListener("wheel", handleCtrlWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleCtrlWheel);
  }, [enableScrollZoom]);

  // Click outside → release scroll zoom
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        scrollEnabledRef.current &&
        mapContainerRef.current &&
        !mapContainerRef.current.contains(e.target as Node)
      ) {
        mapRef.current?.getMap().scrollZoom.disable();
        scrollEnabledRef.current = false;
        setScrollEnabled(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ── Map layer click handler ──────────────────────────────────────────────────
  // maplibre-gl v3+ uses Promise (not callback) for getClusterExpansionZoom
  const handleMapLayerClick = useCallback(
    async (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;

      if (feature.layer.id === "clusters") {
        const clusterId = feature.properties?.cluster_id as number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const source = mapRef.current?.getSource("projects") as any;
        if (!source?.getClusterExpansionZoom) return;
        try {
          const zoom: number = await source.getClusterExpansionZoom(clusterId);
          const coords = (feature.geometry as { coordinates: [number, number] }).coordinates;
          mapRef.current?.flyTo({
            center: coords,
            zoom: zoom + 0.5,
            duration: 900,
            essential: true,
          });
        } catch {
          // ignore
        }
      } else if (feature.layer.id === "unclustered-point") {
        const id = feature.properties?.id as string;
        const project = mapProjects.find((p) => p.id === id);
        if (project) {
          setSelectedProject(project);
          setPopupProject(null);
          setHoveredId(null);
        }
      }
    },
    []
  );

  // ── Mouse move — hover on layers ──────────────────────────────────────────
  const handleMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (feature?.layer?.id === "unclustered-point") {
        const id = feature.properties?.id as string;
        setHoveredId(id);
        setCursor("pointer");
        const project = mapProjects.find((p) => p.id === id) ?? null;
        setPopupProject(project);
      } else if (feature?.layer?.id === "clusters") {
        setHoveredId(null);
        setPopupProject(null);
        setCursor("pointer");
      } else {
        setHoveredId(null);
        setPopupProject(null);
        setCursor(scrollEnabled ? "grab" : "default");
      }
    },
    [scrollEnabled]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    setPopupProject(null);
    setCursor(scrollEnabled ? "grab" : "default");
  }, [scrollEnabled]);

  // ── Panel card interaction ───────────────────────────────────────────────────
  const handlePanelHover = useCallback((id: string | null) => {
    setHoveredId(id);
    // Don't show popup when hovering from panel
    setPopupProject(null);
  }, []);

  const handlePanelClick = useCallback((project: MapProject) => {
    // Zoom the map to the project location — do NOT open the modal here.
    // The modal opens when the user clicks the highlighted pin on the map.
    setPopupProject(null);
    setSelectedProject(null);
    setHoveredId(project.id);
    mapRef.current?.flyTo({
      center: [project.lng, project.lat],
      zoom: 13,
      duration: 1100,
      essential: true,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
    mapRef.current?.fitBounds(CANADA_BOUNDS, { ...FIT_OPTIONS, duration: 1400 });
  }, []);

  const LAYOUT_HEIGHT = "clamp(400px, 60vh, 680px)";

  return (
    <>
      <style>{`
        .canada-map-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        /* Strip default MapLibre popup chrome */
        .maplibregl-popup-content {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
        }
        .maplibregl-popup-tip { display: none !important; }
        .maplibregl-popup { z-index: 10 !important; }
        /* Panel scrollbar */
        .canada-map-panel-scroll::-webkit-scrollbar { width: 4px; }
        .canada-map-panel-scroll::-webkit-scrollbar-track { background: transparent; }
        .canada-map-panel-scroll::-webkit-scrollbar-thumb {
          background: rgba(249,115,22,0.25);
          border-radius: 4px;
        }
        @media (max-width: 900px) {
          .canada-map-panel { display: none !important; }
        }
        @media (max-width: 640px) {
          .canada-map-modal { border-radius: 14px !important; }
          .canada-map-modal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section style={{ background: "#080d16", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 1.25rem" }}>

          {/* ── Header ──────────────────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: "2rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#F97316",
                  marginBottom: 10,
                }}
              >
                Installations Across Canada
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                  fontWeight: 900,
                  color: "#F5F0EB",
                  margin: "0 0 10px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                Coast to Coast.{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #F97316, #EAB308)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Every Surface.
                </span>
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "#9CA3AF",
                  maxWidth: 460,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {mapProjects.length} projects from Victoria to St. John&apos;s. Zoom into any
                province to explore.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(249,115,22,0.08)",
                border: "1px solid rgba(249,115,22,0.2)",
                borderRadius: 12,
                padding: "12px 20px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#F97316",
                  boxShadow: "0 0 8px rgba(249,115,22,0.85)",
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F0EB" }}>
                {mapProjects.length} Projects Mapped
              </span>
            </div>
          </div>

          {/* ── Map + Panel ───────────────────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              gap: 12,
              height: LAYOUT_HEIGHT,
              alignItems: "stretch",
            }}
          >
            {/* Map */}
            <div
              ref={mapContainerRef}
              style={{
                flex: "1 1 0",
                minWidth: 0,
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(249,115,22,0.15)",
                boxShadow:
                  "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                position: "relative",
              }}
              onClick={enableScrollZoom}
            >
              <Map
                ref={mapRef}
                mapStyle={MAP_STYLE}
                initialViewState={{
                  bounds: CANADA_BOUNDS,
                  fitBoundsOptions: FIT_OPTIONS,
                }}
                style={{ width: "100%", height: "100%" }}
                minZoom={2.5}
                maxZoom={18}
                attributionControl={false}
                scrollZoom={false}
                cursor={cursor}
                interactiveLayerIds={["clusters", "unclustered-point"]}
                onClick={handleMapLayerClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMoveEnd={updateVisibleProjects}
                onLoad={updateVisibleProjects}
              >
                <NavigationControl
                  position="bottom-right"
                  style={{ marginBottom: 16, marginRight: 16 }}
                />

                {/* All projects — clustered */}
                <Source
                  id="projects"
                  type="geojson"
                  data={projectsGeoJSON}
                  cluster={true}
                  clusterMaxZoom={11}
                  clusterRadius={50}
                >
                  <Layer {...CLUSTER_LAYER} />
                  <Layer {...CLUSTER_COUNT_LAYER} />
                  <Layer {...POINT_LAYER} />
                </Source>

                {/* Hover highlight ring */}
                <Source id="hovered" type="geojson" data={hoveredGeoJSON}>
                  <Layer {...HOVERED_RING_LAYER} />
                </Source>

                {/* Hover popup (map hover only, not panel hover) */}
                {popupProject && !selectedProject && (
                  <Popup
                    longitude={popupProject.lng}
                    latitude={popupProject.lat}
                    anchor="bottom"
                    offset={20}
                    closeButton={false}
                    closeOnClick={false}
                  >
                    <div
                      style={{
                        background: "#111827",
                        border: "1px solid rgba(249,115,22,0.4)",
                        borderRadius: 10,
                        overflow: "hidden",
                        width: 215,
                        cursor: "pointer",
                        boxShadow: "0 8px 28px rgba(0,0,0,0.75)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const p = popupProject;
                        setSelectedProject(p);
                        setPopupProject(null);
                        setHoveredId(null);
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: 105,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={popupProject.images[0]}
                          alt={popupProject.title}
                          fill
                          className="object-cover"
                          sizes="215px"
                          unoptimized
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to bottom, transparent 40%, rgba(17,24,39,0.9) 100%)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 7,
                            right: 7,
                            background: "rgba(0,0,0,0.55)",
                            backdropFilter: "blur(4px)",
                            borderRadius: 5,
                            padding: "2px 6px",
                            fontSize: 9,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.7)",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Click to open
                        </div>
                      </div>
                      <div style={{ padding: "9px 11px 11px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#F97316",
                              background: "rgba(249,115,22,0.12)",
                              padding: "1.5px 6px",
                              borderRadius: 4,
                            }}
                          >
                            {popupProject.product}
                          </span>
                          <span style={{ fontSize: 9.5, color: "#6B7280" }}>
                            {popupProject.city}, {popupProject.province}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            color: "#F5F0EB",
                            lineHeight: 1.35,
                            margin: 0,
                          }}
                        >
                          {popupProject.title}
                        </p>
                      </div>
                    </div>
                  </Popup>
                )}
              </Map>

              {/* Scroll hint pill */}
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(8,13,22,0.88)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${
                    scrollEnabled ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.08)"
                  }`,
                  borderRadius: 24,
                  padding: "6px 16px",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  transition: "border-color 0.2s ease",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: scrollEnabled ? "#F97316" : "#6B7280",
                    fontWeight: 500,
                    transition: "color 0.2s ease",
                  }}
                >
                  {scrollEnabled
                    ? "Scroll zoom active · Click outside to release"
                    : hoveredId
                    ? "Pin highlighted — click it to open project details"
                    : "Click map to enable scroll zoom · Hold Ctrl + scroll · Click pins for details"}
                </span>
              </div>
            </div>

            {/* ── Right panel ───────────────────────────────────────────────────────────── */}
            <div
              className="canada-map-panel"
              ref={panelRef}
              style={{
                width: 310,
                flexShrink: 0,
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#0c1119",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Panel header */}
              <div
                style={{
                  padding: "14px 16px 12px",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 3,
                  }}
                >
                  <p
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#F97316",
                      margin: 0,
                    }}
                  >
                    Projects in view
                  </p>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#F5F0EB",
                      background: "rgba(249,115,22,0.14)",
                      padding: "2px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {visibleProjects.length}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 10.5,
                    color: "#374151",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  Pan or zoom the map to filter
                </p>
              </div>

              {/* Scrollable project list */}
              <div
                className="canada-map-panel-scroll"
                style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}
              >
                {visibleProjects.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      padding: 24,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: "#4B5563", fontSize: 13, margin: "0 0 12px" }}>
                      No projects in this area
                    </p>
                    <button
                      onClick={() =>
                        mapRef.current?.fitBounds(CANADA_BOUNDS, {
                          ...FIT_OPTIONS,
                          duration: 900,
                        })
                      }
                      style={{
                        fontSize: 12,
                        color: "#F97316",
                        background: "transparent",
                        border: "1px solid rgba(249,115,22,0.3)",
                        borderRadius: 8,
                        padding: "6px 14px",
                        cursor: "pointer",
                      }}
                    >
                      Reset to Canada view
                    </button>
                  </div>
                ) : (
                  visibleProjects.map((project) => (
                    <PanelCard
                      key={project.id}
                      project={project}
                      hovered={hoveredId === project.id}
                      selected={selectedProject?.id === project.id}
                      onHover={handlePanelHover}
                      onClick={handlePanelClick}
                    />
                  ))
                )}
              </div>

              {/* Panel footer */}
              <div
                style={{
                  padding: "10px 16px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  flexShrink: 0,
                }}
              >
                <a
                  href="/contact"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    width: "100%",
                    padding: "9px 0",
                    borderRadius: 9,
                    background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                  }}
                >
                  Request a Project Like This
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Project modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </>
  );
}
