"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import Map, {
  Source,
  Layer,
  Popup,
  NavigationControl,
  AttributionControl,
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

// Hard travel limit — generous margin around Canada so exploration never
// wanders off to another continent and "where did the pins go?".
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [-155.0, 35.0],
  [-40.0, 74.0],
];

const FIT_OPTIONS = {
  padding: { top: 60, bottom: 80, left: 60, right: 60 },
  maxZoom: 7,
} as const;

// ── Static rollups (module scope — mapProjects never changes at runtime) ───
const PRODUCT_COUNTS: [string, number][] = (() => {
  // (plain record — `Map` is shadowed by the react-map-gl component import)
  const c: Record<string, number> = {};
  for (const p of mapProjects) c[p.product] = (c[p.product] ?? 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]);
})();

// Application filter options — second filter dimension (Vernon: "improve the
// filter system"). Lives as a compact select beside search, NOT a third chip
// row — the chip rows are locked to one line each.
const APPLICATION_COUNTS: [string, number][] = (() => {
  const c: Record<string, number> = {};
  for (const p of mapProjects) c[p.application] = (c[p.application] ?? 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]);
})();

// Province display order: west → east, the way the section's copy reads.
const PROVINCE_ORDER = ["BC", "AB", "SK", "MB", "ON", "QC", "NB", "NS", "PE", "NL"];
const PROVINCE_LABEL: Record<string, string> = {
  BC: "British Columbia", AB: "Alberta", SK: "Saskatchewan", MB: "Manitoba",
  ON: "Ontario", QC: "Québec", NB: "New Brunswick", NS: "Nova Scotia",
  PE: "PEI", NL: "Newfoundland",
};
const PROVINCE_COUNTS: [string, number][] = (() => {
  const c: Record<string, number> = {};
  for (const p of mapProjects) c[p.province] = (c[p.province] ?? 0) + 1;
  return PROVINCE_ORDER.filter((pr) => pr in c).map((pr) => [pr, c[pr]]);
})();

function boundsFor(projects: MapProject[]): [[number, number], [number, number]] | null {
  if (!projects.length) return null;
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const p of projects) {
    w = Math.min(w, p.lng); e = Math.max(e, p.lng);
    s = Math.min(s, p.lat); n = Math.max(n, p.lat);
  }
  // A single-city province still deserves a sensible frame, not zoom 18.
  const padLng = Math.max((e - w) * 0.2, 0.35);
  const padLat = Math.max((n - s) * 0.2, 0.25);
  return [[w - padLng, s - padLat], [e + padLng, n + padLat]];
}

// ── Layer specs ────────────────────────────────────────────────────────────
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

// ── Small shared chip for the "representative photo" honesty tag ───────────
// Entries flagged imageIsRepresentative show HUB work in the same product +
// application, not that exact installation (May 2026 rule: stand-in
// photography must never pass as the project). The tag is small but always
// present wherever the photo appears large enough to read as "the project".
function RepresentativeTag({ style }: { style?: React.CSSProperties }) {
  return (
    <span
      style={{
        fontSize: 8.5,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.85)",
        background: "rgba(8,13,22,0.72)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255,255,255,0.18)",
        padding: "2px 7px",
        borderRadius: 5,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      Representative photo
    </span>
  );
}

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
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${project.title} — view on map`}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(project.id)}
      onBlur={() => onHover(null)}
      onClick={() => onClick(project)}
      onKeyDown={(e) => {
        // Card is a <div> (needs to sit inside a horizontally-scrolling,
        // image+text layout that <button> fights), so Enter/Space activation
        // has to be wired up by hand to make it keyboard-operable at all —
        // previously this whole list was mouse-only (axe: also the cause of
        // scrollable-region-focusable, since a scroll region with zero
        // focusable descendants can't be reached by keyboard either).
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(project);
        }
      }}
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
              : "1.5px solid var(--border-color)",
          transition: "border-color 0.15s ease",
        }}
      >
        <Image
          src={project.images[0]}
          alt={`${project.title} — ${project.city}`}
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
              fontSize: 11,
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
            color: "#868C98",
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

// ── Project detail modal ────────────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: MapProject;
  onClose: () => void;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus the close button on open; Escape closes. Modal is small enough that
  // full focus-trap machinery isn't warranted, but keyboard users must be able
  // to land in it and leave it without a mouse.
  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

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
        role="dialog"
        aria-modal="true"
        aria-label={`Project details: ${project.title}`}
        style={{
          background: "#1A1A19",
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
          ref={closeRef}
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "50%",
            width: 44,
            height: 44,
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
                  color: "#868C98",
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
              {project.year ? ` · ${project.year}` : ""}
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
                background: "#101010",
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
              {project.imageIsRepresentative && (
                <RepresentativeTag style={{ position: "absolute", top: 10, left: 10 }} />
              )}
            </div>
            {project.imageIsRepresentative && (
              <p style={{ fontSize: 11, color: "#868C98", margin: 0, lineHeight: 1.5 }}>
                Representative photo — HUB work in the same system and application.
                This installation&apos;s own photography is on its way.
              </p>
            )}
            {project.images.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {project.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    style={{
                      position: "relative",
                      width: 68,
                      height: 52,
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
                padding: "13px 24px",
                minHeight: 44,
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
                padding: "13px 24px",
                minHeight: 44,
                borderRadius: 8,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              See the Systems →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Filter chip (shared by province + product rows) ─────────────────────────
function FilterChip({
  active,
  onClick,
  children,
  count,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  title?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        // 44px floor: these province chips are the map's primary control and
        // sat at 34px, under the iOS minimum. Padding alone kept them short
        // because the label is a single 11.5px line.
        minHeight: 44,
        borderRadius: 20,
        border: active
          ? "1px solid rgba(249,115,22,0.65)"
          : "1px solid rgba(255,255,255,0.1)",
        background: active ? "rgba(249,115,22,0.16)" : "rgba(255,255,255,0.03)",
        color: active ? "#F5F0EB" : "#B7BDC8",
        fontSize: 11.5,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
      }}
    >
      {children}
      {count !== undefined && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: active ? "#F97316" : "#6B7280",
            background: active ? "rgba(249,115,22,0.14)" : "rgba(255,255,255,0.06)",
            borderRadius: 10,
            padding: "1px 7px",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ── Main component ──────────────────────────────────────────────────────────────────
export default function CanadaMap() {
  const mapRef = useRef<MapRef>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<MapProject | null>(null);
  const [cursor, setCursor] = useState("grab");
  const [popupProject, setPopupProject] = useState<MapProject | null>(null);
  // Click-to-pin: when true, popup persists regardless of cursor location. Cleared by the
  // close button on the card, by clicking outside the map, or by clicking another marker.
  // Hover-driven popup behavior is fragile in MapLibre (cursor crosses a dead zone between
  // marker and Popup DOM during transit). Click-to-pin makes the preview bulletproof.
  const [popupPinned, setPopupPinned] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState<MapProject[]>(mapProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState<string | null>(null);
  const [appFilter, setAppFilter] = useState<string | null>(null);
  const [provinceFocus, setProvinceFocus] = useState<string | null>(null);
  const [viewMoved, setViewMoved] = useState(false);
  const [styleFailed, setStyleFailed] = useState(false);
  // Popup hover bridge — grace timeout + popup-card hover keeps it alive.
  const popupHoveredRef = useRef(false);
  // Mirror of popupPinned for handlers that must not re-create on pin/unpin.
  // Written SYNCHRONOUSLY by setPinned — an effect-based sync loses the race
  // against the blur that fires in the same tick as the pinning click.
  const popupPinnedRef = useRef(false);
  const setPinned = useCallback((v: boolean) => {
    popupPinnedRef.current = v;
    setPopupPinned(v);
  }, []);
  const popupClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Product + application filters drive the pins themselves ───────────
  const filteredProjects = useMemo(() => {
    let base = mapProjects;
    if (productFilter) base = base.filter((p) => p.product === productFilter);
    if (appFilter) base = base.filter((p) => p.application === appFilter);
    return base;
  }, [productFilter, appFilter]);

  const projectsGeoJSON = useMemo<FeatureCollection<Point>>(
    () => ({
      type: "FeatureCollection",
      features: filteredProjects.map((p) => ({
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
    }),
    [filteredProjects]
  );

  // ── GeoJSON for hover ring ─────────────────────────────────
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

  // ── Panel list: search wins, else viewport ∩ product filter ────────────
  const displayedProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = q
      ? mapProjects.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.province.toLowerCase().includes(q) ||
            p.product.toLowerCase().includes(q) ||
            p.application.toLowerCase().includes(q)
        )
      : visibleProjects;
    let out = productFilter ? base.filter((p) => p.product === productFilter) : base;
    if (appFilter) out = out.filter((p) => p.application === appFilter);
    return out;
  }, [searchQuery, visibleProjects, productFilter, appFilter]);

  // ── Update panel list based on map bounds ──────────────────────────────
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
    // "Reset view" affordance appears once the user has left the country frame.
    setViewMoved(map.getZoom() > 4.6);
  }, []);

  const resetView = useCallback(() => {
    setProvinceFocus(null);
    mapRef.current?.fitBounds(CANADA_BOUNDS, { ...FIT_OPTIONS, duration: 1100 });
  }, []);

  // ── Province quick-zoom ──────────────────────────────────────
  const handleProvince = useCallback(
    (prov: string | null) => {
      if (prov === null) {
        resetView();
        return;
      }
      setProvinceFocus(prov);
      const b = boundsFor(filteredProjects.filter((p) => p.province === prov));
      if (b) {
        mapRef.current?.fitBounds(b, {
          padding: { top: 70, bottom: 90, left: 70, right: 70 },
          maxZoom: 10.5,
          duration: 1100,
        });
      }
    },
    [filteredProjects, resetView]
  );

  const handleAppFilter = useCallback((application: string | null) => {
    setAppFilter(application);
    setPopupProject(null);
    setPinned(false);
  }, [setPinned]);

  const handleProductFilter = useCallback(
    (product: string | null) => {
      setProductFilter(product);
      setPopupProject(null);
      setPinned(false);
      // Keep the current frame — filtering shouldn't yank the camera around.
    },
    []
  );

  // ── Map layer click handler ──────────────────────────────────────
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
          const coords = (feature.geometry as unknown as { coordinates: [number, number] }).coordinates;
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
          if (popupClearTimeoutRef.current) clearTimeout(popupClearTimeoutRef.current);
          // Click-to-pin: marker click PINS the popup (does not open the modal directly).
          // Clicking the popup body opens the full case study modal. This makes hover
          // dismissal a non-issue — once pinned, the popup persists until closed explicitly.
          setPopupProject(project);
          setPinned(true);
          setHoveredId(id);
        }
      }
    },
    []
  );

  // ── Mouse move — hover on layers ──────────────────────────────────
  // When a popup is PINNED, hover never replaces or clears it. Only marker-click
  // and the close button toggle the pinned popup.
  const handleMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (feature?.layer?.id === "unclustered-point") {
        const id = feature.properties?.id as string;
        setHoveredId(id);
        setCursor("pointer");
        if (!popupPinned) {
          const project = mapProjects.find((p) => p.id === id) ?? null;
          setPopupProject(project);
        }
      } else if (feature?.layer?.id === "clusters") {
        setHoveredId(null);
        setCursor("pointer");
        if (!popupPinned) setPopupProject(null);
      } else {
        setHoveredId(null);
        setCursor("grab");
        // 450ms grace — generous window for cursor to transit marker → popup card.
        if (popupClearTimeoutRef.current) clearTimeout(popupClearTimeoutRef.current);
        popupClearTimeoutRef.current = setTimeout(() => {
          // Read pin state through the ref: this timeout may have been
          // scheduled BEFORE a click pinned the popup, and the closure's
          // popupPinned would still say false.
          if (!popupHoveredRef.current && !popupPinnedRef.current) setPopupProject(null);
        }, 450);
      }
    },
    [popupPinned]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    setCursor("grab");
    // Same grace-period pattern so the cursor can transit from the map canvas
    // edge into the popup card without it vanishing.
    if (popupClearTimeoutRef.current) clearTimeout(popupClearTimeoutRef.current);
    popupClearTimeoutRef.current = setTimeout(() => {
      if (!popupHoveredRef.current && !popupPinnedRef.current) setPopupProject(null);
    }, 450);
  }, [popupPinned]);

  // Close pinned popup on click outside the map container.
  useEffect(() => {
    if (!popupPinned) return;
    function handleOutsideClick(e: MouseEvent) {
      if (mapContainerRef.current && !mapContainerRef.current.contains(e.target as Node)) {
        setPinned(false);
        setPopupProject(null);
        setHoveredId(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [popupPinned]);

  // Escape closes the popup (the modal handles its own Escape).
  useEffect(() => {
    if (!popupProject) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !selectedProject) {
        setPinned(false);
        setPopupProject(null);
        setHoveredId(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [popupProject, selectedProject]);

  // ── Panel card interaction ─────────────────────────────────
  const handlePanelHover = useCallback((id: string | null) => {
    setHoveredId(id);
    // Don't show hover popups from the panel — but never kill a PINNED one:
    // the click that pins also re-renders this list, and the unmounting
    // card's blur would otherwise clear the popup in the same breath.
    if (!popupPinnedRef.current) setPopupProject(null);
  }, []);

  const handlePanelClick = useCallback((project: MapProject, openModal = false) => {
    if (popupClearTimeoutRef.current) clearTimeout(popupClearTimeoutRef.current);
    setPinned(false);
    setHoveredId(project.id);
    if (openModal) {
      setPopupProject(null);
      setSelectedProject(project);
    } else {
      setSelectedProject(null);
      // Pin the popup at the destination so the flight lands on something.
      setPopupProject(project);
      setPinned(true);
    }
    mapRef.current?.flyTo({
      center: [project.lng, project.lat],
      zoom: 13,
      duration: 1100,
      essential: true,
    });
  }, []);

  // Click anywhere off the map section -> back to the zero state.
  useEffect(() => {
    function handleOffSectionClick(e: MouseEvent) {
      if (selectedProject) return; // modal backdrop is outside the section
      if (!viewMoved && !provinceFocus && !productFilter && !appFilter) return;
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        setProductFilter(null);
        setAppFilter(null);
        setSearchQuery("");
        setPopupProject(null);
        setPinned(false);
        resetView();
      }
    }
    document.addEventListener("mousedown", handleOffSectionClick);
    return () => document.removeEventListener("mousedown", handleOffSectionClick);
  }, [selectedProject, viewMoved, provinceFocus, productFilter, appFilter, resetView]);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
    setPinned(false);
    mapRef.current?.fitBounds(CANADA_BOUNDS, { ...FIT_OPTIONS, duration: 1400 });
  }, []);

  const LAYOUT_HEIGHT = "clamp(360px, 68vh, 840px)";


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
        /* Cooperative-gesture overlay — maplibre's built-in "use two fingers /
           Ctrl+scroll" teaching screen, restyled for the brand. */
        .maplibregl-cooperative-gesture-screen {
          background: rgba(8,13,22,0.78) !important;
          backdrop-filter: blur(6px);
          color: #F5F0EB !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px;
        }
        /* Attribution — required by OSM/CARTO licensing; themed, not hidden. */
        .maplibregl-ctrl-attrib {
          background: rgba(8,13,22,0.6) !important;
          backdrop-filter: blur(4px);
          border-radius: 8px 0 0 0;
        }
        .maplibregl-ctrl-attrib a {
          color: rgba(255,255,255,0.45) !important;
          font-size: 10px;
        }
        /* Panel scrollbar */
        .canada-map-panel-scroll::-webkit-scrollbar { width: 4px; }
        .canada-map-panel-scroll::-webkit-scrollbar-track { background: transparent; }
        .canada-map-panel-scroll::-webkit-scrollbar-thumb {
          background: rgba(249,115,22,0.25);
          border-radius: 4px;
        }
        /* Chip rows: always ONE line each — scroll, never wrap (Vernon: three
           wrapped rows of pills buried the map). Scrollbar hidden; at desktop
           widths everything fits anyway. */
        .canada-map-chips {
          display: flex;
          gap: 8px;
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .canada-map-chips::-webkit-scrollbar { display: none; }
        /* Mobile strip — replaces the side panel below 900px */
        .canada-map-strip { display: none; }
        .canada-map-strip-scroll::-webkit-scrollbar { height: 4px; }
        .canada-map-strip-scroll::-webkit-scrollbar-thumb {
          background: rgba(249,115,22,0.25);
          border-radius: 4px;
        }
        @media (max-width: 900px) {
          .canada-map-panel { display: none !important; }
          .canada-map-strip { display: block; }
          .canada-map-layout { height: clamp(320px, 52vh, 560px) !important; }
        }
        @media (max-width: 640px) {
          .canada-map-modal { border-radius: 14px !important; }
          .canada-map-modal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        aria-label="Installations across Canada — interactive project map"
        style={{ background: "#101010", paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 1.25rem" }}>

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: "1.5rem",
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
                {mapProjects.length} projects from Victoria to St. John&apos;s. Tap a
                province to jump in, or filter by system.
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

          {/* ── Province quick-zoom ────────────────────────────────────────── */}
          <div className="canada-map-chips" style={{ marginBottom: 8 }} role="group" aria-label="Zoom to province">
            <FilterChip active={provinceFocus === null && !viewMoved} onClick={() => handleProvince(null)}>
              All Canada
            </FilterChip>
            {PROVINCE_COUNTS.map(([prov, count]) => (
              <FilterChip
                key={prov}
                active={provinceFocus === prov}
                onClick={() => handleProvince(prov)}
                count={count}
                title={PROVINCE_LABEL[prov] ?? prov}
              >
                {prov}
              </FilterChip>
            ))}
          </div>

          {/* ── Product filter ─────────────────────────────────────────────── */}
          <div className="canada-map-chips" style={{ marginBottom: 12 }} role="group" aria-label="Filter by product system">
            <FilterChip active={productFilter === null} onClick={() => handleProductFilter(null)}>
              All systems
            </FilterChip>
            {PRODUCT_COUNTS.map(([product, count]) => (
              <FilterChip
                key={product}
                active={productFilter === product}
                onClick={() => handleProductFilter(productFilter === product ? null : product)}
                count={count}
              >
                {product}
              </FilterChip>
            ))}
          </div>

          {/* ── Map + Panel ───────────────────────────────────────────────── */}
          <div
            className="canada-map-layout"
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
            >
              <Map
                ref={mapRef}
                mapStyle={MAP_STYLE}
                initialViewState={{
                  bounds: CANADA_BOUNDS,
                  fitBoundsOptions: FIT_OPTIONS,
                }}
                style={{ width: "100%", height: "100%" }}
                minZoom={2.8}
                maxZoom={18}
                maxBounds={MAX_BOUNDS}
                attributionControl={false}
                cooperativeGestures
                cursor={cursor}
                interactiveLayerIds={["clusters", "unclustered-point"]}
                onClick={handleMapLayerClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMoveEnd={updateVisibleProjects}
                onLoad={updateVisibleProjects}
                onError={(e) => {
                  // A failed style fetch would otherwise leave a silent black
                  // box. Pins still work without the basemap, but say so.
                  if (String(e?.error ?? "").includes("style")) setStyleFailed(true);
                }}
              >
                <NavigationControl
                  position="bottom-right"
                  style={{ marginBottom: 16, marginRight: 16 }}
                />
                <AttributionControl compact position="bottom-left" />

                {/* All projects — clustered; source data follows the product filter */}
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

                {/* Project popup — agency-grade card with click-to-pin behavior.
                    Marker click PINS the popup (popupPinned=true). Hover dismissal is
                    disabled while pinned. Close button on the card or click-outside the
                    map dismisses it. Card body click opens the full case-study modal. */}
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
                      role="dialog"
                      aria-label={`Project preview: ${popupProject.title}`}
                      style={{
                        position: "relative",
                        width: 240,
                        background: "#151515",
                        border: `1px solid ${popupPinned ? "rgba(249,115,22,0.6)" : "rgba(249,115,22,0.32)"}`,
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: popupPinned
                          ? "0 14px 40px rgba(0,0,0,0.85), 0 0 0 1px rgba(249,115,22,0.2)"
                          : "0 10px 32px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.03)",
                      }}
                      onMouseEnter={() => {
                        popupHoveredRef.current = true;
                        if (popupClearTimeoutRef.current) clearTimeout(popupClearTimeoutRef.current);
                      }}
                      onMouseLeave={() => {
                        popupHoveredRef.current = false;
                        if (!popupPinned) {
                          setPopupProject(null);
                          setHoveredId(null);
                        }
                      }}
                    >
                      {/* Close button — visible whenever popup is pinned */}
                      {popupPinned && (
                        <button
                          type="button"
                          aria-label="Close project preview"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPinned(false);
                            setPopupProject(null);
                            setHoveredId(null);
                          }}
                          style={{
                            position: "absolute",
                            top: 7,
                            right: 7,
                            zIndex: 5,
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(255,255,255,0.18)",
                            borderRadius: "50%",
                            background: "rgba(15,22,32,0.85)",
                            backdropFilter: "blur(4px)",
                            cursor: "pointer",
                            color: "#F5F0EB",
                            padding: 0,
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                          </svg>
                        </button>
                      )}

                      <button
                        type="button"
                        aria-label={`Open case study: ${popupProject.title}`}
                        style={{
                          all: "unset",
                          display: "block",
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const p = popupProject;
                          setSelectedProject(p);
                          setPinned(false);
                          setPopupProject(null);
                          setHoveredId(null);
                        }}
                      >
                      {/* Image with gradient bottom for legibility */}
                      <div style={{ position: "relative", width: "100%", height: 110, overflow: "hidden" }}>
                        <Image
                          src={popupProject.images[0]}
                          alt={popupProject.title}
                          fill
                          className="object-cover"
                          sizes="240px"
                          unoptimized
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to bottom, transparent 35%, rgba(15,22,32,0.55) 78%, rgba(15,22,32,0.95) 100%)",
                          }}
                        />
                        {popupProject.imageIsRepresentative && (
                          <RepresentativeTag style={{ position: "absolute", top: 8, left: 8 }} />
                        )}
                      </div>

                      {/* Meta — agency-grade 4 lines */}
                      <div style={{ padding: "11px 13px 13px" }}>
                        {/* Line 1: product · application pills */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.13em",
                              textTransform: "uppercase",
                              color: "#F97316",
                              background: "rgba(249,115,22,0.13)",
                              padding: "2px 7px",
                              borderRadius: 4,
                              border: "1px solid rgba(249,115,22,0.22)",
                            }}
                          >
                            {popupProject.product}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.45)",
                            }}
                          >
                            {popupProject.application}
                          </span>
                        </div>

                        {/* Line 2: project title */}
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#F5F0EB",
                            lineHeight: 1.3,
                            margin: "0 0 6px",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {popupProject.title}
                        </p>

                        {/* Line 3: location · year (year line hidden if undefined) */}
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.5)",
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span>
                            {popupProject.city}, {popupProject.province}
                          </span>
                          {popupProject.year && (
                            <>
                              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                              <span>{popupProject.year}</span>
                            </>
                          )}
                        </p>

                        {/* Line 4: CTA */}
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#F97316",
                            margin: "9px 0 0",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {popupPinned ? "Open case study" : "Click to open"}
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </p>
                      </div>
                      </button>
                    </div>
                  </Popup>
                )}
              </Map>

              {/* Style-load fallback message */}
              {styleFailed && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(8,13,22,0.9)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontSize: 12,
                    color: "#B7BDC8",
                    zIndex: 20,
                    pointerEvents: "none",
                  }}
                >
                  Base map didn&apos;t load — pins and projects still work.
                </div>
              )}

              {/* Reset view — appears once zoomed into a region */}
              {(viewMoved || provinceFocus !== null) && (
                <button
                  type="button"
                  onClick={resetView}
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    padding: "10px 16px",
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(249,115,22,0.45)",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                  </svg>
                  Back to Canada
                </button>
              )}

              {/* Status pill — bottom center */}
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(8,13,22,0.88)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 24,
                  padding: "6px 16px",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  maxWidth: "88%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <span style={{ fontSize: 11, color: "#868C98", fontWeight: 500 }}>
                  {hoveredId
                    ? "Click to open project details"
                    : productFilter
                    ? `${filteredProjects.length} ${productFilter} installations · Tap pins for details`
                    : "Tap pins for details · Two fingers or Ctrl + scroll to zoom"}
                </span>
              </div>
            </div>

            {/* ── Right panel (desktop) ────────────────────────────────────── */}
            <div
              className="canada-map-panel"
              ref={panelRef}
              style={{
                width: 310,
                flexShrink: 0,
                borderRadius: 20,
                border: "1px solid var(--border-color)",
                background: "#111111",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Panel header */}
              <div
                style={{
                  padding: "14px 16px 12px",
                  borderBottom: "1px solid var(--border-color)",
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
                    {searchQuery.trim() ? "Search results" : "Projects in view"}
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
                    {displayedProjects.length}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 10.5,
                    color: "#868C98",
                    margin: "0 0 10px",
                    lineHeight: 1.4,
                  }}
                >
                  {searchQuery.trim()
                    ? `Searching all ${mapProjects.length} projects`
                    : productFilter
                    ? `${productFilter} only — pan or zoom to filter further`
                    : "Pan or zoom to filter"}
                </p>

                {/* Search input */}
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* Search icon */}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#868C98"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      position: "absolute",
                      left: 10,
                      flexShrink: 0,
                      pointerEvents: "none",
                    }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="City, product, application…"
                    aria-label="Search projects"
                    style={{
                      width: "100%",
                      padding: "7px 30px 7px 30px",
                      background: "rgba(255,255,255,0.05)",
                      border: searchQuery.trim()
                        ? "1px solid rgba(249,115,22,0.4)"
                        : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 9,
                      color: "#F5F0EB",
                      fontSize: 12,
                      outline: "none",
                      transition: "border-color 0.15s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
                    }}
                    onBlur={(e) => {
                      if (!searchQuery.trim())
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  />
                  {/* Clear button */}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{
                        position: "absolute",
                        right: 8,
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: 0,
                        color: "#9CA3AF",
                        flexShrink: 0,
                      }}
                      aria-label="Clear search"
                    >
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Application filter — second dimension, compact select */}
                <select
                  value={appFilter ?? ""}
                  onChange={(e) => handleAppFilter(e.target.value || null)}
                  aria-label="Filter by application" data-tap="44"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "7px 10px",
                    background: appFilter ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.05)",
                    border: appFilter
                      ? "1px solid rgba(249,115,22,0.4)"
                      : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 9,
                    color: appFilter ? "#FDBA74" : "#9CA3AF",
                    fontSize: 12,
                    outline: "none",
                    cursor: "pointer",
                    transition: "border-color 0.15s ease",
                  }}
                >
                  <option value="">All applications</option>
                  {APPLICATION_COUNTS.map(([app, count]) => (
                    <option key={app} value={app}>
                      {app} ({count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Scrollable project list */}
              <div
                className="canada-map-panel-scroll"
                style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}
              >
                {displayedProjects.length === 0 ? (
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
                    {searchQuery.trim() ? (
                      <>
                        <p style={{ color: "#4B5563", fontSize: 13, margin: "0 0 12px" }}>
                          No projects match &ldquo;{searchQuery}&rdquo;
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
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
                          Clear search
                        </button>
                      </>
                    ) : (
                      <>
                        <p style={{ color: "#4B5563", fontSize: 13, margin: "0 0 12px" }}>
                          No projects in this area
                          {productFilter ? ` for ${productFilter}` : ""}
                        </p>
                        <button
                          onClick={resetView}
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
                      </>
                    )}
                  </div>
                ) : (
                  displayedProjects.map((project) => (
                    <PanelCard
                      key={project.id}
                      project={project}
                      hovered={hoveredId === project.id}
                      selected={selectedProject?.id === project.id}
                      onHover={handlePanelHover}
                      onClick={(p) => handlePanelClick(p, !!searchQuery.trim())}
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

          {/* ── Mobile strip — the panel's job, phone-shaped ───────────────── */}
          <div className="canada-map-strip" style={{ marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
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
                {searchQuery.trim() ? "Search results" : "Projects in view"}
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
                {displayedProjects.length}
              </span>
            </div>

            {/* Mobile search */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: 10 }}>
              <svg
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#868C98"
                strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", left: 12, pointerEvents: "none" }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, product, application…"
                aria-label="Search projects"
                style={{
                  width: "100%",
                  padding: "10px 34px",
                  background: "rgba(255,255,255,0.05)",
                  border: searchQuery.trim()
                    ? "1px solid rgba(249,115,22,0.4)"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#F5F0EB",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  style={{
                    position: "absolute",
                    right: 10,
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    color: "#9CA3AF",
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile application filter */}
            <select
              value={appFilter ?? ""}
              onChange={(e) => handleAppFilter(e.target.value || null)}
              aria-label="Filter by application" data-tap="44"
              style={{
                width: "100%",
                marginBottom: 10,
                padding: "9px 12px",
                background: appFilter ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.05)",
                border: appFilter
                  ? "1px solid rgba(249,115,22,0.4)"
                  : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: appFilter ? "#FDBA74" : "#9CA3AF",
                fontSize: 13,
                outline: "none",
              }}
            >
              <option value="">All applications</option>
              {APPLICATION_COUNTS.map(([app, count]) => (
                <option key={app} value={app}>
                  {app} ({count})
                </option>
              ))}
            </select>

            {/* Horizontal snap cards */}
            <div
              className="canada-map-strip-scroll"
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                paddingBottom: 8,
              }}
            >
              {displayedProjects.length === 0 ? (
                <p style={{ color: "#4B5563", fontSize: 13, padding: "14px 4px" }}>
                  No projects here{productFilter ? ` for ${productFilter}` : ""} —{" "}
                  <button
                    onClick={resetView}
                    style={{
                      color: "#F97316",
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: 13,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    reset the view
                  </button>
                </p>
              ) : (
                displayedProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => handlePanelClick(project, false)}
                    aria-label={`${project.title} — view on map`}
                    style={{
                      all: "unset",
                      boxSizing: "border-box",
                      scrollSnapAlign: "start",
                      flexShrink: 0,
                      width: 230,
                      display: "flex",
                      gap: 10,
                      padding: 10,
                      borderRadius: 12,
                      cursor: "pointer",
                      background:
                        hoveredId === project.id
                          ? "rgba(249,115,22,0.1)"
                          : "rgba(255,255,255,0.03)",
                      border:
                        hoveredId === project.id
                          ? "1px solid rgba(249,115,22,0.45)"
                          : "1px solid var(--border-color)",
                    }}
                  >
                    <span
                      style={{
                        width: 62,
                        height: 48,
                        borderRadius: 8,
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "block",
                      }}
                    >
                      <Image
                        src={project.images[0]}
                        alt={`${project.title} — ${project.city}`}
                        width={62}
                        height={48}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        unoptimized
                      />
                    </span>
                    <span style={{ minWidth: 0, display: "block" }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#F97316",
                          marginBottom: 3,
                        }}
                      >
                        {project.product}
                      </span>
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: "#E5E7EB",
                          lineHeight: 1.3,
                        }}
                      >
                        {project.title}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 10,
                          color: "#868C98",
                          marginTop: 3,
                        }}
                      >
                        {project.city}, {project.province}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Mobile CTA */}
            <a
              href="/contact"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                marginTop: 6,
                padding: "12px 0",
                borderRadius: 10,
                background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
              }}
            >
              Request a Project Like This
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
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
