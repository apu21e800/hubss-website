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

// ── Static rollups (module scope — mapProjects never changes at runtime)
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
/**
 * Display name → product page slug. Only the six systems that appear in the
 * map data are listed; the fallback is the kebab-case of the name, which is
 * how every other slug in lib/products.ts is formed, so a seventh system
 * added to the data lands on its real page without an edit here. Verified
 * against production: all six return 200.
 */
const PRODUCT_SLUGS: Record<string, string> = {
  StreetPrint: "streetprint",
  StreetBond: "streetbond",
  TrafficPatterns: "traffic-patterns",
  TrafficPatternsXD: "traffic-patterns-xd",
  MMAX: "mmax",
  DecoMark: "decomark",
};
const productSlug = (name: string) =>
  PRODUCT_SLUGS[name] ??
  name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

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

// ── Layer specs
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

// ── Small shared chip for the "representative photo" honesty tag
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
        color: "var(--ink-85)",
        background: "rgba(8,13,22,0.72)",
        backdropFilter: "blur(4px)",
        border: "1px solid var(--ink-18)",
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

// ── Panel project card
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
        borderBottom: "1px solid var(--ink-05)",
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
              color: "var(--accent-text-lg)",
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
            color: "var(--text-secondary)",
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

// ── Project detail modal
function ProjectModal({
  project,
  onClose,
  onShowOnMap,
}: {
  project: MapProject;
  onClose: () => void;
  onShowOnMap: (p: MapProject) => void;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  /**
   * Escape closes, focus is trapped, the page behind is frozen, and focus goes
   * back where it came from on the way out.
   *
   * The previous version did the first of those and reasoned the rest was not
   * warranted because the dialog is small. Measured with a keyboard: focus
   * left the dialog on 10 of 12 tab presses, landing on the page underneath —
   * where a sighted mouse user sees a dimmed backdrop and a screen-reader user
   * is simply reading a page they cannot see. Size is not what decides this;
   * being modal is.
   */
  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    // Freeze the page behind, without the scroll position jumping to the top
    // when position:fixed is applied — the compensating `top` is what stops
    // that, and the scrollbar-width padding stops the layout shifting sideways.
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        // getClientRects rather than offsetParent: offsetParent is null for
        // anything positioned fixed, and this dialog lives inside a fixed
        // backdrop — the offsetParent test would have filtered out every
        // candidate and quietly disabled the trap it was meant to build.
      ).filter((el) => el.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!root.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
      returnFocusRef.current?.focus?.();
    };
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
        ref={dialogRef}
        className="canada-map-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Project details: ${project.title}`}
        style={{
          background: "var(--bg-section-asphalt)",
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
            background: "var(--ink-08)",
            border: "1px solid var(--ink-12)",
            borderRadius: "50%",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
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
                  color: "var(--accent-text-lg)",
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
                  color: "var(--text-secondary)",
                  background: "var(--ink-05)",
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
                color: "var(--text-primary)",
                margin: "0 0 4px",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {project.title}
            </h2>
            {/* Was a 📍 emoji, the only one in the section — it rendered at a
                different weight and colour to everything around it. A drawn
                pin matches the icon set the rest of the card uses. */}
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {project.city}, {project.province}
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
                background: "var(--bg-dark)",
              }}
            >
              {/* cover, not contain. A portrait photo in a 16/9 frame was being
                  pillarboxed — two black columns either side of the picture,
                  with the subject (a surface, on the ground) shrunk to fit a
                  shape it was never shot for. Filling the frame crops the top
                  and bottom instead, which on a pavement photograph is sky and
                  foreground, and shows the work at nearly twice the size. The
                  thumbnails below already do this. */}
              <Image
                src={project.images[imgIndex]}
                alt={`${project.title} — photo ${imgIndex + 1}`}
                fill
                className="object-cover"
                style={{ objectPosition: "center 55%" }}
                sizes="(max-width: 880px) 100vw, 880px"
              />
              {project.imageIsRepresentative && (
                <RepresentativeTag style={{ position: "absolute", top: 10, left: 10 }} />
              )}
            </div>
            {project.imageIsRepresentative && (
              <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
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
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="canada-map-modal-grid">
            <div
              style={{
                background: "var(--ink-04)",
                border: "1px solid var(--ink-08)",
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
                  color: "var(--accent-text-lg)",
                  margin: "0 0 8px",
                }}
              >
                The Challenge
              </p>
              <p style={{ fontSize: 13, color: "var(--text-body)", lineHeight: 1.65, margin: 0 }}>
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
                  color: "var(--accent-text-lg)",
                  margin: "0 0 8px",
                }}
              >
                The Solution
              </p>
              <p style={{ fontSize: 13, color: "var(--text-body)", lineHeight: 1.65, margin: 0 }}>
                {project.solution}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/contact"
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                color: "var(--on-accent)",
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
            {/* Present whenever the project has a write-up. 29 of them do, and
                until now the modal gave no way to reach it — the connection
                existed only as an image path nobody could follow. */}
            {project.slug && (
              <a
                href={`/blog/${project.slug}`}
                style={{
                  background: "rgba(249,115,22,0.10)",
                  color: "var(--accent-soft-text)",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "13px 24px",
                  minHeight: 44,
                  borderRadius: 8,
                  textDecoration: "none",
                  border: "1px solid rgba(249,115,22,0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Read the write-up →
              </a>
            )}
            {/* Was href="/contact" — the same destination as the button beside
                it, under a label promising the product pages. */}
            <a
              href={`/products/${productSlug(project.product)}`}
              style={{
                background: "transparent",
                color: "var(--text-muted)",
                fontWeight: 600,
                fontSize: 13,
                padding: "13px 24px",
                minHeight: 44,
                borderRadius: 8,
                textDecoration: "none",
                border: "1px solid var(--ink-12)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              About {project.product} →
            </a>
            {/* The way back to the map, by name. Without it the only exit from
                a case study is dismissal, and the pin you came from is lost. */}
            <button
              type="button"
              onClick={() => onShowOnMap(project)}
              style={{
                background: "transparent",
                color: "var(--text-muted)",
                fontWeight: 600,
                fontSize: 13,
                padding: "13px 24px",
                minHeight: 44,
                borderRadius: 8,
                border: "1px solid var(--ink-12)",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                cursor: "pointer",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Show on map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Filter chip (shared by province + product rows)
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

// ── Main component
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
  /**
   * The map's own width, measured. The popup is sized from this rather than
   * from the viewport, because the map is only part of the viewport — on a
   * 390px phone the map box is 348px, and a popup that assumed the viewport
   * would still overflow its container and clip its own close button.
   */
  const [mapWidth, setMapWidth] = useState(0);
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setMapWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setMapWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);
  // 240 is the designed width; below a ~330px map it steps down so the card
  // plus its anchor offset always fit inside the frame.
  const popupWidth = mapWidth > 0 ? Math.min(240, Math.max(180, mapWidth - 72)) : 240;
  const isNarrow = mapWidth > 0 && mapWidth < 560;
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

  // ── Product + application filters drive the pins themselves
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

  // ── GeoJSON for hover ring
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

  // ── Panel list: search wins, else viewport ∩ product filter
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

  // ── Update panel list based on map bounds
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

  // ── Province quick-zoom
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

  // ── Map layer click handler
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
          setHoveredId(id);

          /**
           * On a phone, a pin opens the case study. No popup.
           *
           * The popup is a ~290px card and the mobile map is ~438px tall. It
           * does not fit alongside the things already living in that frame: it
           * was clipped through the top edge when anchored above a pin —
           * taking its own close button out of the container, which left no
           * way to dismiss it at all — and once it was allowed to flip below,
           * it landed under "Back to Canada" and the zoom controls instead.
           * There is no corner of a 438px map where a 290px card does not
           * collide with something.
           *
           * So it is not a layout problem to solve, it is a control that does
           * not belong on touch. The popup exists to preview a pin under a
           * hovering cursor, and there is no cursor here. The modal is the
           * better version of it on a phone anyway — full width, readable,
           * with a 44px close button, Escape, and a trapped focus ring. A tap
           * goes straight there, which also makes pins and list cards behave
           * identically instead of one of them opening a middleman.
           */
          if (isNarrow) {
            setPopupProject(null);
            setPinned(false);
            setSelectedProject(project);
            return;
          }

          // Desktop: marker click pins the preview. Clicking its body opens the
          // case study. Pinning makes hover dismissal a non-issue — the card
          // persists until it is closed explicitly.
          setPopupProject(project);
          setPinned(true);
        }
      }
    },
    [isNarrow, setPinned]
  );

  // ── Mouse move — hover on layers
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

  // ── Panel card interaction
  const handlePanelHover = useCallback((id: string | null) => {
    setHoveredId(id);
    // Don't show hover popups from the panel — but never kill a PINNED one:
    // the click that pins also re-renders this list, and the unmounting
    // card's blur would otherwise clear the popup in the same breath.
    if (!popupPinnedRef.current) setPopupProject(null);
  }, []);

  /**
   * Clicking a project card opens that project. It does not fly the camera.
   *
   * It used to do both: fly to zoom 13 and pin a popup. At zoom 13 the
   * viewport is four streets wide, and this list is filtered by the viewport —
   * so one click on one card collapsed the list of 59 projects to 1, and the
   * strip a phone user was mid-swipe through collapsed from 23 to 1 under
   * their thumb. The thing you clicked ate the thing you were browsing. That
   * was the single worst moment in the section, on both breakpoints.
   *
   * A card carrying a photo, a product tag and an arrow promises to open the
   * project. So it opens the project. The list is left exactly as it was, and
   * the camera only ever moves when the visitor moves it — or asks, through
   * "Show on map" inside the modal.
   *
   * The pin is highlighted so the eye can find it while the modal is open, and
   * `panTo` (never `flyTo`, never a zoom change) brings it on screen if it is
   * outside the current frame. Panning at constant zoom keeps every neighbour
   * where it was, so the list under the map does not move either.
   */
  const handlePanelClick = useCallback((project: MapProject) => {
    if (popupClearTimeoutRef.current) clearTimeout(popupClearTimeoutRef.current);
    setPinned(false);
    setPopupProject(null);
    setHoveredId(project.id);
    setSelectedProject(project);

    const map = mapRef.current?.getMap();
    const bounds = map?.getBounds();
    if (map && bounds) {
      const outside =
        project.lng < bounds.getWest() ||
        project.lng > bounds.getEast() ||
        project.lat < bounds.getSouth() ||
        project.lat > bounds.getNorth();
      if (outside) {
        map.panTo([project.lng, project.lat], { duration: 700 });
      }
    }
  }, [setPinned]);

  /**
   * "Show on map", from inside the modal. The one path that is allowed to
   * change zoom, because the visitor asked for it by name. Zoom 9 is a region,
   * not a driveway: the pin is unmistakable and its neighbours are still on
   * screen, so the list keeps a dozen entries rather than one.
   */
  const handleShowOnMap = useCallback(
    (project: MapProject) => {
      setSelectedProject(null);
      setHoveredId(project.id);
      // No preview card on a phone — see handleMapLayerClick. The highlight
      // ring and the flight are the answer to "where is it"; tapping the pin
      // brings this modal straight back.
      setPopupProject(isNarrow ? null : project);
      setPinned(!isNarrow);
      mapRef.current?.flyTo({
        center: [project.lng, project.lat],
        zoom: 9,
        duration: 900,
        essential: true,
      });
      mapContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [isNarrow, setPinned]
  );

  /**
   * Closing the modal closes the modal. Nothing else.
   *
   * It used to also fitBounds back to the whole country, which meant opening a
   * project in Victoria and closing it again threw you to a view of Canada —
   * your filters still set, your place gone, with no undo. Leaving the camera
   * alone is the whole fix: you come back to exactly where you were.
   */
  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  /**
   * One explicit control that undoes everything, for the visitor who has
   * filtered themselves into a corner and wants out.
   *
   * There used to be an invisible version of this: a document-level mousedown
   * listener that silently wiped every filter and reset the camera whenever
   * you clicked anywhere else on the page. Scroll down, tap a heading, and the
   * work you had done in the section evaporated with nothing to say it had.
   * State a visitor set should only be cleared by a control that says it will.
   */
  const anyFilterActive =
    !!productFilter || !!appFilter || !!searchQuery.trim() || !!provinceFocus || viewMoved;

  const clearEverything = useCallback(() => {
    setProductFilter(null);
    setAppFilter(null);
    setSearchQuery("");
    setPopupProject(null);
    setPinned(false);
    setHoveredId(null);
    resetView();
  }, [resetView, setPinned]);

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
          color: var(--text-primary) !important;
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
          color: var(--ink-45) !important;
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
        style={{ background: "var(--bg-dark)", paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 1.25rem" }}>

          {/* ── Header */}
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
                  color: "var(--accent-text-lg)",
                  marginBottom: 10,
                }}
              >
                Installations Across Canada
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                  fontWeight: 900,
                  color: "var(--text-primary)",
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
                  color: "var(--text-muted)",
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
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                {mapProjects.length} Projects Mapped
              </span>
            </div>
          </div>

          {/* ── Province quick-zoom */}
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

          {/* ── Product filter */}
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
            {/* The visible replacement for a document-level mousedown listener
                that used to wipe all of this whenever you clicked anywhere
                else on the page. One control, it says what it does, and it is
                only here when there is something to undo. */}
            {anyFilterActive && (
              <button
                type="button"
                onClick={clearEverything}
                style={{
                  flexShrink: 0,
                  marginLeft: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  minHeight: 44,
                  padding: "0 16px",
                  borderRadius: 999,
                  border: "1px dashed rgba(249,115,22,0.45)",
                  background: "transparent",
                  color: "var(--accent-soft-text)",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
                Start over
              </button>
            )}
          </div>

          {/* ── Map + Panel */}
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
                  "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px var(--ink-04)",
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
                {/* The compass/pitch control is three stacked buttons tall.
                    On a 348×437 phone map that is a meaningful share of the
                    frame spent on a control nobody uses on a 2D basemap with
                    rotation left at zero. Zoom only, below 560px. */}
                <NavigationControl
                  position="bottom-right"
                  showCompass={!isNarrow}
                  style={{ marginBottom: isNarrow ? 34 : 16, marginRight: isNarrow ? 12 : 16 }}
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
                {popupProject && !selectedProject && !isNarrow && (
                  <Popup
                    longitude={popupProject.lng}
                    latitude={popupProject.lat}
                    /* anchor was pinned to "bottom", which forbids MapLibre
                       from flipping the card when there is no room above the
                       pin. On a 390px phone the map is ~438px tall and this
                       card is ~290px: a pin anywhere in the upper half pushed
                       the card past the top edge of a container with
                       overflow:hidden, and the close button in its top-right
                       corner was the first thing clipped away. Letting
                       MapLibre choose the anchor is the fix — it flips to
                       "top" when the space is below. */
                    offset={18}
                    maxWidth={`${popupWidth}px`}
                    closeButton={false}
                    closeOnClick={false}
                  >
                    <div
                      role="dialog"
                      aria-label={`Project preview: ${popupProject.title}`}
                      style={{
                        position: "relative",
                        // Was a flat 240px. Inside a 348px-wide map on a 390px
                        // phone, a 240px card anchored to a pin near an edge
                        // hung outside the container and was clipped — taking
                        // its close button off-screen with it, which left no
                        // way at all to dismiss the thing. Capped to the map's
                        // own width so it can always be closed.
                        width: popupWidth,
                        maxWidth: "calc(100vw - 48px)",
                        background: "var(--bg-primary)",
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
                      {/* Close button.
                          Two changes. It was 28×28 — Apple and Google both put
                          the floor at 44, and on a phone this is the control
                          standing between a visitor and the rest of the page.
                          And it only rendered while pinned: on a touch screen
                          there is no hover, so the popup is ALWAYS pinned and
                          the condition was noise — but any future path that
                          opened it unpinned would have opened a card with no
                          way out. It is always there now. */}
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
                          top: 6,
                          right: 6,
                          zIndex: 5,
                          width: 44,
                          height: 44,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--text-primary)",
                          padding: 0,
                        }}
                      >
                        {/* The visible disc stays small; the tappable square
                            around it is the full 44. */}
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid var(--ink-22)",
                            borderRadius: "50%",
                            background: "rgba(15,22,32,0.9)",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" />
                          </svg>
                        </span>
                      </button>

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
                              color: "var(--accent-text-lg)",
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
                              color: "var(--ink-45)",
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
                            color: "var(--text-primary)",
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
                            color: "var(--ink-50)",
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
                              <span style={{ color: "var(--ink-20)" }}>·</span>
                              <span>{popupProject.year}</span>
                            </>
                          )}
                        </p>

                        {/* Line 4: CTA */}
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--accent-text-lg)",
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
                    border: "1px solid var(--ink-12)",
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
                    /* On a phone the map is ~348×437 and the popup is ~290
                       tall, so a button in the top-left corner landed on top
                       of the project photo — two controls fighting over the
                       same pixels, one of them obscuring the thing the
                       visitor had just asked to see. Below ~560px it moves to
                       the bottom-left, clear of the popup, clear of the zoom
                       controls on the right, and raised just above the
                       attribution strip it would otherwise cover. */
                    ...(isNarrow
                      ? { bottom: 38, left: 12 }
                      : { top: 14, left: 14 }),
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                    border: "1px solid var(--ink-15)",
                    borderRadius: 10,
                    padding: "10px 16px",
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: "var(--on-accent)",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(249,115,22,0.45)",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                  </svg>
                  Back to Canada
                </button>
              )}

              {/* Status pill — bottom centre, desktop only.
                  On a phone it sat on the same line as the CARTO/OpenStreetMap
                  attribution and the two rendered through each other into
                  something unreadable. Attribution is a licence condition and
                  cannot move; the pill is a hint and can. The chip rows above
                  already carry the counts it was repeating. */}
              {!isNarrow && (
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(8,13,22,0.88)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid var(--ink-08)",
                  borderRadius: 24,
                  padding: "6px 16px",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  maxWidth: "88%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>
                  {hoveredId
                    ? "Click to open project details"
                    : productFilter
                    ? `${filteredProjects.length} ${productFilter} installations · Tap pins for details`
                    : "Tap pins for details · Two fingers or Ctrl + scroll to zoom"}
                </span>
              </div>
              )}
            </div>

            {/* ── Right panel (desktop) */}
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
                      color: "var(--accent-text-lg)",
                      margin: 0,
                    }}
                  >
                    {searchQuery.trim() ? "Search results" : "Projects in view"}
                  </p>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-primary)",
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
                    color: "var(--text-secondary)",
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
                    stroke="var(--text-secondary)"
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
                      background: "var(--ink-05)",
                      border: searchQuery.trim()
                        ? "1px solid rgba(249,115,22,0.4)"
                        : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 9,
                      color: "var(--text-primary)",
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
                        background: "var(--ink-10)",
                        border: "none",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: 0,
                        color: "var(--text-muted)",
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
                            color: "var(--accent-text-lg)",
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
                            color: "var(--accent-text-lg)",
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
                      onClick={handlePanelClick}
                    />
                  ))
                )}
              </div>

              {/* Panel footer */}
              <div
                style={{
                  padding: "10px 16px",
                  borderTop: "1px solid var(--ink-06)",
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
                    color: "var(--on-accent)",
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

          {/* ── Mobile strip — the panel's job, phone-shaped */}
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
                  color: "var(--accent-text-lg)",
                  margin: 0,
                }}
              >
                {searchQuery.trim() ? "Search results" : "Projects in view"}
              </p>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-primary)",
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
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)"
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
                  background: "var(--ink-05)",
                  border: searchQuery.trim()
                    ? "1px solid rgba(249,115,22,0.4)"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "var(--text-primary)",
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
                    background: "var(--ink-10)",
                    border: "none",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    color: "var(--text-muted)",
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
                      color: "var(--accent-text-lg)",
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
                    onClick={() => handlePanelClick(project)}
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
                          color: "var(--accent-text-lg)",
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
                          color: "var(--text-body)",
                          lineHeight: 1.3,
                        }}
                      >
                        {project.title}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 10,
                          color: "var(--text-secondary)",
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
                color: "var(--on-accent)",
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
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
          onShowOnMap={handleShowOnMap}
        />
      )}
    </>
  );
}
