"use client";

/**
 * The homepage project map, rebuilt 30 Sep 2026.
 *
 * Vern: "the map feels buggy again... make the map a magical experience",
 * "ace the map UX/UI". What changed, and why:
 *
 *   - No popups. The old preview card was a MapLibre Popup, and every bug on
 *     the list came from it: it flipped under the pin into the hint bar and
 *     the zoom buttons, it covered other pins and clusters, and it needed a
 *     hover grace timer to be reachable at all. A project now opens in the
 *     panel beside the map (a desktop) or in a sheet (a phone), and hovering a
 *     pin labels it on the map itself, which cannot overlap anything.
 *   - The panel floats over the map, so the map gets the whole frame. Every
 *     camera move is padded for it, and "in view" means the part of the map
 *     you can see, not the part under the panel.
 *   - The selected project stands up as a photo on the map.
 *   - A tour: "Take the tour" flies coast to coast through the highlights,
 *     one project at a time, and stops the moment you touch the map.
 *   - On a phone the list is a strip of photo cards under the map. Swipe the
 *     strip and the map follows; tap a pin and the strip follows.
 *
 * Kept from the old component, on purpose: cooperative gestures (the page
 * scrolls past the map; Ctrl + scroll or two fingers zoom it), a list that
 * does not collapse under your cursor when the camera moves for you, a way
 * back to the whole country, and 44px controls.
 *
 * Every photo goes through lib/map-photo.ts: Sanity's CDN or a /public file,
 * never /_next/image.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Source,
  Layer,
  Marker,
  NavigationControl,
  AttributionControl,
  type MapRef,
  type MapLayerMouseEvent,
  type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import type { GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import type { FeatureCollection, Point } from "geojson";
import { mapProjects, type MapProject } from "@/lib/map-projects";
import { mapLoader } from "@/lib/map-photo";
import ProjectDetail, { provinceName } from "@/components/sections/map/ProjectDetail";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
/** The fonts CARTO's glyph server holds; its own labels use this stack. */
const LABEL_FONT = ["Montserrat Medium", "Open Sans Bold", "Noto Sans Regular"];
/** Whitehorse to Charlottetown, with room either side. */
const ALL_BOUNDS: [[number, number], [number, number]] = [
  [-137.5, 41.6],
  [-52.5, 61.6],
];
const PANEL_W = 368;
/** One tour stop: the flight, then time to look. */
const TOUR_FLIGHT_MS = 2600;
const TOUR_STOP_MS = 8200;

/**
 * The tour's stops, west to east: the jobs with the strongest photographs,
 * one or two per region. Filters narrow it; a filtered map with fewer than
 * three of these tours every project in view that has a photo instead.
 */
const TOUR_IDS = [
  "whitehorse-kwanlin-dun",
  "victoria-high-school",
  "ubc-musqueam",
  "vancouver-commercial-drive",
  "langley-events-centre",
  "maple-ridge-spray-park",
  "osoyoos-jack-shaw-gardens",
  "kelowna-green-square",
  "kitchener-veterans",
  "toronto-leslieville-laneway",
  "halton-hills-toronto-premium-outlets",
  "vaughan-woodbridge-heritage",
  "montreal-guido-nincheri",
  "mont-megantic-observatory",
  "saint-john-harbour-passage",
  "charlottetown-cruise-terminal",
];

const PROVINCE_ORDER = ["YT", "NT", "NU", "BC", "AB", "SK", "MB", "ON", "QC", "NB", "NS", "PE", "NL"];

function countBy(key: (p: MapProject) => string): [string, number][] {
  const c: Record<string, number> = {};
  for (const p of mapProjects) c[key(p)] = (c[key(p)] ?? 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
const PRODUCT_COUNTS = countBy((p) => p.product);
const APPLICATION_COUNTS = countBy((p) => p.application);
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
  const padLng = Math.max((e - w) * 0.12, 0.3);
  const padLat = Math.max((n - s) * 0.12, 0.2);
  return [[w - padLng, s - padLat], [e + padLng, n + padLat]];
}

function matches(p: MapProject, q: string): boolean {
  const hay = `${p.title} ${p.city} ${provinceName(p.province)} ${p.province} ${p.product} ${(p.systems ?? []).join(" ")} ${p.application}`.toLowerCase();
  return q.split(/\s+/).every((w) => hay.includes(w));
}

function useMedia(query: string): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setOn(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return on;
}

// ── Map layers
const CLUSTER_HALO = {
  id: "cluster-halo",
  type: "circle" as const,
  source: "projects",
  filter: ["has", "point_count"] as unknown as boolean,
  paint: {
    "circle-color": "#F97316",
    "circle-opacity": 0.22,
    "circle-blur": 0.6,
    "circle-radius": ["step", ["get", "point_count"], 30, 6, 36, 16, 44] as unknown as number,
  },
};
const CLUSTERS = {
  id: "clusters",
  type: "circle" as const,
  source: "projects",
  filter: ["has", "point_count"] as unknown as boolean,
  paint: {
    "circle-color": "#F97316",
    "circle-radius": ["step", ["get", "point_count"], 18, 6, 23, 16, 29] as unknown as number,
    "circle-stroke-width": 2,
    "circle-stroke-color": "rgba(255,255,255,0.85)",
  },
};
const CLUSTER_COUNT = {
  id: "cluster-count",
  type: "symbol" as const,
  source: "projects",
  filter: ["has", "point_count"] as unknown as boolean,
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-size": 13,
    "text-font": LABEL_FONT,
    "text-allow-overlap": true,
  },
  paint: { "text-color": "#1A0E05" },
};
const POINT_HALO = {
  id: "point-halo",
  type: "circle" as const,
  source: "projects",
  filter: ["!", ["has", "point_count"]] as unknown as boolean,
  paint: {
    "circle-color": "#F97316",
    "circle-opacity": 0.28,
    "circle-blur": 0.8,
    "circle-radius": 15,
  },
};
const POINTS = {
  id: "points",
  type: "circle" as const,
  source: "projects",
  filter: ["!", ["has", "point_count"]] as unknown as boolean,
  paint: {
    "circle-color": "#F97316",
    // Starts at 0 and grows once the map has loaded (the transition below):
    // the pins arrive rather than sit there.
    "circle-radius": 0,
    "circle-radius-transition": { duration: 700, delay: 150 },
    "circle-stroke-width": 2,
    "circle-stroke-color": "#FFFFFF",
  },
};

// ── Small pieces
function Thumb({ project, size }: { project: MapProject; size: { w: number; h: number } }) {
  const src = project.images[0];
  return (
    <span className="cm-thumb" style={{ width: size.w, height: size.h }}>
      {src ? (
        <Image loader={mapLoader} src={src} alt="" fill sizes={`${size.w}px`} style={{ objectFit: "cover" }} />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )}
    </span>
  );
}

function Chip({ active, onClick, children, count, label }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  label?: string;
}) {
  return (
    <button type="button" className={active ? "cm-pill is-on" : "cm-pill"} aria-pressed={active} aria-label={label} title={label} onClick={onClick}>
      {children}
      {count !== undefined && <span className="cm-pill-count">{count}</span>}
    </button>
  );
}

/** The phone sheet: one project, full screen, with a trapped focus ring. */
function Sheet({ project, onClose, onPrev, onNext, position }: {
  project: MapProject;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  position?: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'))
        .filter((el) => el.getClientRects().length > 0);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
      returnTo?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="cm-sheet-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="cm-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cm-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cm-sheet-bar">
          <span className="cm-sheet-pos">{position}</span>
          <span className="cm-sheet-nav">
            {onPrev && (
              <button type="button" className="cm-icon-btn" aria-label="Previous project" onClick={onPrev}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
            )}
            {onNext && (
              <button type="button" className="cm-icon-btn" aria-label="Next project" onClick={onNext}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            )}
            <button ref={closeRef} type="button" className="cm-icon-btn" aria-label="Close" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" /></svg>
            </button>
          </span>
        </div>
        <ProjectDetail project={project} headingId="cm-sheet-title" photoSizes="100vw" priority />
      </div>
    </div>
  );
}

// ── Main component
export default function CanadaMap() {
  const mapRef = useRef<MapRef>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isDesktop = useMedia("(min-width: 1024px)");
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");

  const [loaded, setLoaded] = useState(false);
  const [styleFailed, setStyleFailed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState<string | null>(null);
  const [application, setApplication] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [inView, setInView] = useState<MapProject[]>(mapProjects);
  const [moved, setMoved] = useState(false);
  const [touched, setTouched] = useState(false);
  const [tour, setTour] = useState<{ ids: string[]; index: number; playing: boolean } | null>(null);
  const [announce, setAnnounce] = useState("");

  /** While true, camera moves we make do not re-filter the list. A move the visitor makes releases it. */
  const freezeList = useRef(false);
  /** The camera the map opened on; "moved" means a real departure from it. */
  const homeRef = useRef<{ lng: number; lat: number; zoom: number } | null>(null);
  /** Set while the strip is being scrolled for the map, so the strip does not steer the map back. */
  const stripByCode = useRef(false);
  const stripTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = useMemo(() => mapProjects.find((p) => p.id === selectedId) ?? null, [selectedId]);
  const sheetProject = useMemo(() => mapProjects.find((p) => p.id === sheetId) ?? null, [sheetId]);

  // ── What the pins show: the system and application filters
  const filtered = useMemo(
    () => mapProjects.filter((p) =>
      (!product || p.product === product || (p.systems ?? []).includes(product)) &&
      (!application || p.application === application)),
    [product, application]
  );

  // ── What the list shows: a search looks everywhere; otherwise, what is in view
  const query = search.trim().toLowerCase();
  const listProjects = useMemo(() => {
    if (query) return filtered.filter((p) => matches(p, query));
    const ids = new Set(inView.map((p) => p.id));
    return filtered.filter((p) => ids.has(p.id));
  }, [query, filtered, inView]);

  const geojson = useMemo<FeatureCollection<Point>>(() => ({
    type: "FeatureCollection",
    features: filtered.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: { id: p.id, title: p.title },
    })),
  }), [filtered]);

  // The camera's padding: the floating panel on the left and some air. Set
  // on the map ONCE (map.setPadding, below), never passed to a camera call.
  // Until 2 Oct 2026 every easeTo, flyTo and fitBounds carried it, and
  // MapLibre keeps the padding an easeTo or flyTo gave it, so the next
  // fitBounds added its own on top: after a visit to a pin, "Back to Canada"
  // framed Canada in a frame padded twice on the left and the map landed on
  // the Pacific (Vern: "clicking back to canada button does not always
  // center the map on canada, shows too much of asia").
  const padding = useCallback(
    () => (isDesktop
      ? { top: 64, bottom: 64, left: PANEL_W + 48, right: 64 }
      : { top: 36, bottom: 36, left: 28, right: 28 }),
    [isDesktop]
  );

  // ── The list follows the map
  const syncInView = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const el = map.getContainer();
    const left = isDesktop ? PANEL_W + 24 : 0;
    const nw = map.unproject([left, 0]);
    const se = map.unproject([el.clientWidth, el.clientHeight]);
    if (!freezeList.current) {
      setInView(mapProjects.filter((p) => p.lng >= nw.lng && p.lng <= se.lng && p.lat <= nw.lat && p.lat >= se.lat));
    }
    const home = homeRef.current;
    if (home) {
      const a = map.project([home.lng, home.lat]);
      const b = map.project(map.getCenter());
      setMoved(Math.abs(map.getZoom() - home.zoom) > 0.3 || Math.hypot(a.x - b.x, a.y - b.y) > 60);
    }
  }, [isDesktop]);

  const frameCanada = useCallback((duration = 1200) => {
    const map = mapRef.current;
    if (!map) return;
    freezeList.current = false;
    map.fitBounds(ALL_BOUNDS, { duration: reducedMotion ? 0 : duration });
  }, [reducedMotion]);

  // ── Moving the camera to a project
  const flyTo = useCallback((p: MapProject, how: "tour" | "select" | "follow") => {
    const map = mapRef.current;
    if (!map) return;
    freezeList.current = true;
    const now = map.getZoom();
    // An approximate pin stops at city scale: zooming to a street would claim a site.
    const zoom = p.approximate
      ? (how === "tour" ? 10.2 : Math.min(Math.max(now, how === "follow" ? 8.5 : 9.5), 10.2))
      : how === "tour" ? 13 : Math.min(Math.max(now, how === "follow" ? 11.6 : 12.5), 16);
    const options = { center: [p.lng, p.lat] as [number, number], zoom };
    if (reducedMotion) { map.jumpTo(options); return; }
    // A short hop eases; a long one flies, climbing out and back in, so the
    // map never smears a continent past at street scale.
    const el = map.getContainer();
    const a = map.project([p.lng, p.lat]);
    const far = Math.hypot(a.x - el.clientWidth / 2, a.y - el.clientHeight / 2) > el.clientWidth * 1.5;
    if (how === "follow" && !far) map.easeTo({ ...options, duration: 700 });
    else map.flyTo({ ...options, duration: how === "tour" ? TOUR_FLIGHT_MS : far ? 1900 : 1300, curve: 1.45, essential: true });
  }, [reducedMotion]);

  const select = useCallback((p: MapProject, how: "tour" | "select" | "follow" = "select") => {
    setSelectedId(p.id);
    setHoveredId(null);
    setTouched(true);
    setAnnounce(`${p.title}, ${p.city}, ${provinceName(p.province)}`);
    flyTo(p, how);
  }, [flyTo]);

  const stopTour = useCallback(() => setTour(null), []);

  const backToList = useCallback(() => {
    setSelectedId(null);
    stopTour();
    requestAnimationFrame(() => listRef.current?.focus());
  }, [stopTour]);

  // ── The tour
  const startTour = useCallback(() => {
    let ids = TOUR_IDS.filter((id) => filtered.some((p) => p.id === id));
    if (ids.length < 3) {
      ids = [...filtered].filter((p) => p.images.length).sort((a, b) => a.lng - b.lng).map((p) => p.id);
    }
    if (!ids.length) return;
    setSearch("");
    setSheetId(null);
    setTour({ ids, index: 0, playing: !reducedMotion });
    const first = mapProjects.find((p) => p.id === ids[0]);
    if (first) select(first, "tour");
    if (!isDesktop) frameRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [filtered, reducedMotion, select, isDesktop]);

  const tourRef = useRef(tour);
  tourRef.current = tour;
  const stepTour = useCallback((delta: number) => {
    const t = tourRef.current;
    if (!t) return;
    const index = (t.index + delta + t.ids.length) % t.ids.length;
    setTour({ ...t, index });
    const p = mapProjects.find((x) => x.id === t.ids[index]);
    if (p) select(p, "tour");
  }, [select]);

  useEffect(() => {
    if (!tour?.playing) return;
    const timer = setTimeout(() => stepTour(1), TOUR_STOP_MS);
    return () => clearTimeout(timer);
  }, [tour?.playing, tour?.index, stepTour]);

  // ── Stepping through the list from a project
  const position = useMemo(() => {
    if (!selected) return null;
    const ids = tour ? tour.ids : listProjects.map((p) => p.id);
    const i = ids.indexOf(selected.id);
    return i === -1 ? null : { i, n: ids.length, ids };
  }, [selected, tour, listProjects]);

  const stepList = useCallback((delta: number) => {
    if (tour) { stepTour(delta); return; }
    if (!position) return;
    const id = position.ids[(position.i + delta + position.n) % position.n];
    const p = mapProjects.find((x) => x.id === id);
    if (p) select(p);
  }, [tour, stepTour, position, select]);

  // ── Map events
  const onMapClick = useCallback(async (e: MapLayerMouseEvent) => {
    setTouched(true);
    const f = e.features?.[0];
    if (!f) return;
    const map = mapRef.current;
    if (f.layer.id === "clusters" && map) {
      const source = map.getSource("projects") as GeoJSONSource | undefined;
      const clusterId = f.properties?.cluster_id as number;
      if (!source) return;
      try {
        const zoom = await source.getClusterExpansionZoom(clusterId);
        const [lng, lat] = (f.geometry as unknown as { coordinates: [number, number] }).coordinates;
        map.easeTo({ center: [lng, lat], zoom: zoom + 0.4, duration: reducedMotion ? 0 : 800 });
      } catch { /* the cluster went away under the click */ }
      return;
    }
    if (f.layer.id === "points") {
      const p = mapProjects.find((x) => x.id === f.properties?.id);
      if (!p) return;
      stopTour();
      if (isDesktop) {
        select(p);
      } else {
        // On a phone a pin brings its card to the middle of the strip.
        setSelectedId(p.id);
        flyTo(p, "follow");
        const card = stripRef.current?.querySelector<HTMLElement>(`[data-id="${p.id}"]`);
        if (card) {
          stripByCode.current = true;
          card.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
          setTimeout(() => { stripByCode.current = false; }, 700);
        }
      }
    }
  }, [padding, reducedMotion, isDesktop, select, flyTo, stopTour]);

  const onMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const f = e.features?.[0];
    const id = f?.layer.id === "points" ? (f.properties?.id as string) : null;
    setHoveredId((cur) => (cur === id ? cur : id));
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = f ? "pointer" : "";
  }, []);

  const onMoveStart = useCallback((e: ViewStateChangeEvent) => {
    if ((e as { originalEvent?: unknown }).originalEvent) {
      // The visitor is steering: the tour stops, and the list follows the map again.
      setTouched(true);
      freezeList.current = false;
      setTour((t) => (t ? { ...t, playing: false } : t));
    }
  }, []);

  const onLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const c = map.getCenter();
    homeRef.current = { lng: c.lng, lat: c.lat, zoom: map.getZoom() };
    setLoaded(true);
    syncInView();
    // The pins grow in (see POINTS). A second frame, so the transition runs.
    requestAnimationFrame(() => map.setPaintProperty("points", "circle-radius", 6.5));
  }, [syncInView]);

  // The first frame depends on the panel, which depends on the breakpoint.
  useEffect(() => {
    if (!loaded) return;
    const map = mapRef.current;
    if (!map) return;
    map.getMap().setPadding(padding());
    map.fitBounds(ALL_BOUNDS, { duration: 0 });
    const c = map.getCenter();
    homeRef.current = { lng: c.lng, lat: c.lat, zoom: map.getZoom() };
    syncInView();
  }, [loaded, isDesktop, padding, syncInView]);

  // A search frames what it found, once typing pauses.
  useEffect(() => {
    if (!query || !loaded) return;
    const t = setTimeout(() => {
      const b = boundsFor(filtered.filter((p) => matches(p, query)));
      if (!b) return;
      freezeList.current = true;
      mapRef.current?.fitBounds(b, { maxZoom: 11, duration: reducedMotion ? 0 : 1100 });
    }, 450);
    return () => clearTimeout(t);
  }, [query, loaded, filtered, reducedMotion]);

  // A new filter, search or province starts the list at the top.
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
    stripRef.current?.scrollTo({ left: 0 });
  }, [product, application, query, province]);

  // Filters and search end the tour; a filter that hides the open project closes it.
  useEffect(() => {
    if (selectedId && !filtered.some((p) => p.id === selectedId)) setSelectedId(null);
  }, [filtered, selectedId]);

  // ── Province quick-jumps
  const jumpTo = useCallback((code: string | null) => {
    stopTour();
    setSelectedId(null);
    setProvince(code);
    setTouched(true);
    if (!code) { frameCanada(); return; }
    const b = boundsFor(filtered.filter((p) => p.province === code));
    if (!b) return;
    freezeList.current = false;
    mapRef.current?.fitBounds(b, { maxZoom: 9.5, duration: reducedMotion ? 0 : 1300 });
  }, [filtered, frameCanada, reducedMotion, stopTour]);

  const anyFilter = Boolean(product || application || query || province || moved);
  const startOver = useCallback(() => {
    setProduct(null);
    setApplication(null);
    setSearch("");
    setProvince(null);
    setSelectedId(null);
    stopTour();
    frameCanada();
  }, [frameCanada, stopTour]);

  // ── The phone strip steers the map
  const onStripScroll = useCallback(() => {
    if (stripByCode.current) return;
    if (stripTimer.current) clearTimeout(stripTimer.current);
    stripTimer.current = setTimeout(() => {
      const strip = stripRef.current;
      if (!strip) return;
      const mid = strip.getBoundingClientRect().left + strip.clientWidth / 2;
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      strip.querySelectorAll<HTMLElement>("[data-id]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) { bestD = d; best = el; }
      });
      const id = (best as HTMLElement | null)?.dataset.id;
      const p = id ? mapProjects.find((x) => x.id === id) : null;
      if (p && p.id !== selectedId) {
        setTour((t) => (t ? { ...t, playing: false } : t));
        setSelectedId(p.id);
        flyTo(p, "follow");
      }
    }, 140);
  }, [flyTo, selectedId]);

  // On a phone the tour moves the strip too.
  useEffect(() => {
    if (isDesktop || !tour || !selectedId) return;
    const card = stripRef.current?.querySelector<HTMLElement>(`[data-id="${selectedId}"]`);
    if (!card) return;
    stripByCode.current = true;
    card.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
    const t = setTimeout(() => { stripByCode.current = false; }, 800);
    return () => clearTimeout(t);
  }, [isDesktop, tour, selectedId, reducedMotion]);

  // Escape closes an open project on a desktop.
  useEffect(() => {
    if (!isDesktop || !selectedId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") backToList(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isDesktop, selectedId, backToList]);

  // Opening a project on a desktop takes focus to its heading.
  useEffect(() => {
    if (!isDesktop || !selectedId) return;
    requestAnimationFrame(() => document.getElementById("cm-detail-title")?.focus({ preventScroll: true }));
  }, [isDesktop, selectedId]);

  const hoverFilter = useMemo(
    () => ["all", ["!", ["has", "point_count"]], ["in", ["get", "id"], ["literal", [hoveredId ?? "__none__", selectedId ?? "__none__"]]]] as unknown as boolean,
    [hoveredId, selectedId]
  );
  const hoverLabel = {
    id: "hover-label",
    type: "symbol" as const,
    source: "projects",
    filter: hoverFilter,
    layout: {
      "text-field": ["get", "title"],
      "text-font": LABEL_FONT,
      "text-size": 13,
      "text-max-width": 16,
      "text-variable-anchor": ["left", "right", "bottom", "top"],
      "text-radial-offset": 1.25,
      "text-justify": "auto" as const,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    } as Record<string, unknown>,
    paint: {
      "text-color": "#FFFFFF",
      "text-halo-color": "rgba(12,12,12,0.96)",
      "text-halo-width": 2,
    },
  };
  const hoverRing = {
    id: "hover-ring",
    type: "circle" as const,
    source: "projects",
    filter: hoverFilter,
    paint: {
      "circle-color": "rgba(0,0,0,0)",
      "circle-radius": 13,
      "circle-stroke-width": 2.5,
      "circle-stroke-color": "#FDBA74",
    },
  };

  const listTitle = query
    ? `${listProjects.length} match${listProjects.length === 1 ? "" : "es"}`
    : `${listProjects.length} in view`;

  // ── Pieces shared by both layouts
  const searchBox = (
    <label className="cm-search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7.5" />
        <path d="m20.5 20.5-4.2-4.2" />
      </svg>
      <input
        type="search"
        value={search}
        onChange={(e) => { setSearch(e.target.value); stopTour(); setSelectedId(null); }}
        placeholder="Search a city, system or kind of work"
        aria-label="Search projects"
      />
    </label>
  );
  const filters = (
    <div className="cm-selects">
      <select
        value={product ?? ""}
        onChange={(e) => { setProduct(e.target.value || null); stopTour(); }}
        aria-label="Filter by system"
        className={product ? "is-on" : undefined}
      >
        <option value="">All systems</option>
        {PRODUCT_COUNTS.map(([name, n]) => <option key={name} value={name}>{name} ({n})</option>)}
      </select>
      <select
        value={application ?? ""}
        onChange={(e) => { setApplication(e.target.value || null); stopTour(); }}
        aria-label="Filter by application"
        className={application ? "is-on" : undefined}
      >
        <option value="">All applications</option>
        {APPLICATION_COUNTS.map(([name, n]) => <option key={name} value={name}>{name} ({n})</option>)}
      </select>
    </div>
  );
  const provinceRow = (
    <div className="cm-pills" role="group" aria-label="Jump to a province or territory">
      <Chip active={!province && !moved} onClick={() => jumpTo(null)}>All</Chip>
      {PROVINCE_COUNTS.map(([code, n]) => (
        <Chip key={code} active={province === code} onClick={() => jumpTo(code)} label={`${provinceName(code)}, ${n} project${n === 1 ? "" : "s"}`}>
          {code}
        </Chip>
      ))}
    </div>
  );
  const emptyList = (
    <div className="cm-empty">
      <p>{query ? `Nothing matches "${search.trim()}".` : "No projects in this part of the map."}</p>
      <button type="button" className="cm-btn cm-btn-ghost" onClick={startOver}>Start over</button>
    </div>
  );

  const tourBar = tour && (
    <div className="cm-tour" aria-label="Tour controls">
      <span className="cm-tour-label">Tour · {tour.index + 1} of {tour.ids.length}</span>
      <span className="cm-tour-buttons">
        <button type="button" className="cm-icon-btn" aria-label="Previous stop" onClick={() => stepTour(-1)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" className="cm-icon-btn" aria-label={tour.playing ? "Pause the tour" : "Play the tour"} onClick={() => setTour((t) => (t ? { ...t, playing: !t.playing } : t))}>
          {tour.playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.7L8.5 4.6A1 1 0 0 0 7 5.5Z" /></svg>
          )}
        </button>
        <button type="button" className="cm-icon-btn" aria-label="Next stop" onClick={() => stepTour(1)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
        <button type="button" className="cm-icon-btn" aria-label="End the tour" onClick={backToList}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" /></svg>
        </button>
      </span>
      <span className="cm-tour-track" aria-hidden="true">
        {tour.playing && <span key={`${tour.index}`} className="cm-tour-fill" style={{ animationDuration: `${TOUR_STOP_MS}ms` }} />}
      </span>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <section className="cm-section" aria-labelledby="cm-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="cm-head">
            <div>
              <p className="cm-eyebrow">Installations across Canada</p>
              <h2 id="cm-heading" className="cm-h2">
                Real projects. <span className="cm-grad">Real places.</span>
              </h2>
              {/* No count (docs/STYLE.md: no counts as a selling point; the
                  company's number is the book's 1,000+). "3 of 78" in the
                  panel is a count inside a control, which the guide allows. */}
              <p className="cm-sub">
                Every pin is a documented installation, shown in its own photos.
              </p>
            </div>
            <button type="button" className="cm-btn cm-btn-primary cm-tour-start" onClick={tour ? backToList : startTour}>
              {tour ? "End the tour" : "Take the tour"}
              {!tour && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.7L8.5 4.6A1 1 0 0 0 7 5.5Z" /></svg>
              )}
            </button>
          </header>

          {!isDesktop && (
            <div className="cm-mobile-controls">
              {searchBox}
              {filters}
              {provinceRow}
            </div>
          )}

          <div ref={frameRef} className="cm-frame">
            <Map
              ref={mapRef}
              mapStyle={MAP_STYLE}
              initialViewState={{ bounds: ALL_BOUNDS, fitBoundsOptions: { padding: 40 } }}
              style={{ width: "100%", height: "100%" }}
              minZoom={1.4}
              maxZoom={17}
              attributionControl={false}
              dragRotate={false}
              touchPitch={false}
              pitchWithRotate={false}
              cooperativeGestures
              interactiveLayerIds={["clusters", "points"]}
              onClick={onMapClick}
              onMouseMove={onMouseMove}
              onMouseLeave={() => setHoveredId(null)}
              onMoveStart={onMoveStart}
              onMoveEnd={syncInView}
              onLoad={onLoad}
              onError={(e) => { if (String(e?.error ?? "").includes("style")) setStyleFailed(true); }}
            >
              <NavigationControl position="bottom-right" showCompass={false} />
              <AttributionControl compact position={isDesktop ? "bottom-right" : "bottom-left"} />

              <Source id="projects" type="geojson" data={geojson} cluster clusterMaxZoom={11} clusterRadius={46}>
                <Layer {...CLUSTER_HALO} />
                <Layer {...CLUSTERS} />
                <Layer {...CLUSTER_COUNT} />
                <Layer {...POINT_HALO} />
                <Layer {...POINTS} />
                <Layer {...hoverRing} />
                <Layer {...hoverLabel} />
              </Source>

              {selected && (
                <Marker longitude={selected.lng} latitude={selected.lat} anchor="bottom" style={{ zIndex: 5 }}>
                  <button
                    type="button"
                    className="cm-bubble"
                    aria-label={`${selected.title}: open`}
                    onClick={() => (isDesktop ? document.getElementById("cm-detail-title")?.focus() : setSheetId(selected.id))}
                  >
                    <span className="cm-bubble-photo">
                      {selected.images[0] ? (
                        <Image loader={mapLoader} src={selected.images[0]} alt="" fill sizes="64px" style={{ objectFit: "cover" }} />
                      ) : null}
                    </span>
                    <span className="cm-bubble-tip" aria-hidden="true" />
                  </button>
                </Marker>
              )}
            </Map>

            {styleFailed && <p className="cm-note">The base map did not load. Pins and projects still work.</p>}

            {moved && (
              <button type="button" className="cm-back" onClick={() => { setProvince(null); frameCanada(); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v5h5" />
                </svg>
                Back to Canada
              </button>
            )}

            {isDesktop && !touched && loaded && !selected && !tour && (
              <p className="cm-hint" aria-hidden="true">Drag to explore · Ctrl + scroll to zoom · Click a pin</p>
            )}

            {/* ── The panel (desktop) */}
            {isDesktop && (
              <div className="cm-panel">
                {selected ? (
                  <div className="cm-panel-detail">
                    <div className="cm-panel-top">
                      <button type="button" className="cm-link-btn" onClick={backToList}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                        All projects
                      </button>
                      {!tour && position && position.n > 1 && (
                        <span className="cm-stepper">
                          <span className="cm-stepper-pos">{position.i + 1} of {position.n}</span>
                          <button type="button" className="cm-icon-btn" aria-label="Previous project" onClick={() => stepList(-1)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                          </button>
                          <button type="button" className="cm-icon-btn" aria-label="Next project" onClick={() => stepList(1)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
                          </button>
                        </span>
                      )}
                    </div>
                    {tourBar}
                    <div className="cm-panel-scroll">
                      <ProjectDetail project={selected} headingId="cm-detail-title" photoSizes="360px" />
                    </div>
                  </div>
                ) : (
                  <div className="cm-panel-list">
                    <div className="cm-panel-controls">
                      {searchBox}
                      {filters}
                      {provinceRow}
                    </div>
                    <div className="cm-list-head">
                      <span>{listTitle}</span>
                      {anyFilter && <button type="button" className="cm-link-btn" onClick={startOver}>Start over</button>}
                    </div>
                    <div ref={listRef} className="cm-panel-scroll" tabIndex={-1} role="region" aria-label="Projects in view">
                      {listProjects.length === 0 ? emptyList : (
                        <ul className="cm-list">
                          {listProjects.map((p) => (
                            <li key={p.id}>
                              <button
                                type="button"
                                className={hoveredId === p.id ? "cm-card is-hot" : "cm-card"}
                                onMouseEnter={() => setHoveredId(p.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onFocus={() => setHoveredId(p.id)}
                                onBlur={() => setHoveredId(null)}
                                onClick={() => { stopTour(); select(p); }}
                              >
                                <Thumb project={p} size={{ w: 84, h: 64 }} />
                                <span className="cm-card-text">
                                  <span className="cm-card-title">{p.title}</span>
                                  <span className="cm-card-place">{p.city}, {p.province}</span>
                                  <span className="cm-card-system">{p.product}</span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── The strip (phone and tablet) */}
          {!isDesktop && (
            <div className="cm-strip-wrap">
              {tourBar}
              <div className="cm-strip-head">
                <span>{listTitle}</span>
                {anyFilter && <button type="button" className="cm-link-btn" onClick={startOver}>Start over</button>}
              </div>
              {listProjects.length === 0 ? emptyList : (
                <div ref={stripRef} className="cm-strip" onScroll={onStripScroll} role="region" aria-label="Projects in view">
                  {listProjects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      data-id={p.id}
                      className={selectedId === p.id ? "cm-scard is-on" : "cm-scard"}
                      onClick={() => { stopTour(); setSelectedId(p.id); setSheetId(p.id); }}
                    >
                      <span className="cm-scard-photo">
                        {p.images[0] ? (
                          <Image loader={mapLoader} src={p.images[0]} alt="" fill sizes="(max-width: 640px) 78vw, 320px" style={{ objectFit: "cover" }} />
                        ) : null}
                        <span className="cm-scard-system">{p.product}</span>
                      </span>
                      <span className="cm-scard-title">{p.title}</span>
                      <span className="cm-scard-place">{p.city}, {provinceName(p.province)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="sr-only" aria-live="polite">{announce}</p>
        </div>
      </section>

      {sheetProject && !isDesktop && (
        <Sheet
          project={sheetProject}
          onClose={() => setSheetId(null)}
          position={position ? `${position.i + 1} of ${position.n}` : undefined}
          onPrev={position && position.n > 1 ? () => {
            const id = position.ids[(position.i - 1 + position.n) % position.n];
            setSelectedId(id); setSheetId(id);
            const p = mapProjects.find((x) => x.id === id); if (p) flyTo(p, "follow");
          } : undefined}
          onNext={position && position.n > 1 ? () => {
            const id = position.ids[(position.i + 1) % position.n];
            setSelectedId(id); setSheetId(id);
            const p = mapProjects.find((x) => x.id === id); if (p) flyTo(p, "follow");
          } : undefined}
        />
      )}
    </>
  );
}

// ── Styles. One block, every class prefixed cm- so nothing leaks.
const CSS = `
.cm-section { background: var(--bg-dark); padding: 5rem 0; }
.cm-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-bottom: 1.5rem; }
.cm-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-text-lg); margin: 0 0 10px; }
.cm-h2 { font-size: clamp(1.75rem, 3.5vw, 2.75rem); font-weight: 900; color: var(--text-primary); margin: 0 0 10px; line-height: 1.08; letter-spacing: -0.03em; }
.cm-grad { background: linear-gradient(90deg, #F97316, #EAB308); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.cm-sub { font-size: 15px; color: var(--text-muted); margin: 0; line-height: 1.6; max-width: 520px; }

.cm-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 18px; border-radius: 10px; font-size: 13.5px; font-weight: 700; text-decoration: none; cursor: pointer; white-space: nowrap; transition: background .15s ease, border-color .15s ease, color .15s ease, transform .15s ease; }
.cm-btn-primary { background: linear-gradient(135deg, #F97316 0%, #EA8C16 100%); color: var(--on-accent); border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 6px 22px rgba(249,115,22,0.32); }
.cm-btn-primary:hover { transform: translateY(-1px); }
.cm-btn-ghost { background: rgba(255,255,255,0.04); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.14); }
.cm-btn-ghost:hover { border-color: rgba(249,115,22,0.55); }
.cm-link-btn { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 4px; background: none; border: 0; color: var(--accent-soft-text); font-size: 13px; font-weight: 700; cursor: pointer; }
.cm-link-btn:hover { color: var(--text-primary); }
.cm-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); cursor: pointer; }
.cm-icon-btn:hover { border-color: rgba(249,115,22,0.55); }

.cm-frame { position: relative; height: clamp(560px, 76vh, 860px); border-radius: 22px; overflow: hidden; border: 1px solid rgba(249,115,22,0.16); box-shadow: 0 30px 90px rgba(0,0,0,0.55); background: #0e0e0e; }
@media (max-width: 1023px) { .cm-frame { height: clamp(360px, 56vh, 560px); border-radius: 18px; } }

.cm-panel { position: absolute; z-index: 6; top: 14px; left: 14px; bottom: 14px; width: ${PANEL_W}px; display: flex; flex-direction: column; border-radius: 18px; overflow: hidden; background: rgba(13,14,16,0.9); -webkit-backdrop-filter: blur(16px) saturate(1.2); backdrop-filter: blur(16px) saturate(1.2); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 18px 60px rgba(0,0,0,0.55); }
.cm-panel-list, .cm-panel-detail { display: flex; flex-direction: column; min-height: 0; flex: 1; }
.cm-panel-controls { padding: 14px 14px 10px; display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.cm-panel-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px 6px 10px; }
.cm-panel-scroll { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; outline: none; }
.cm-panel-scroll::-webkit-scrollbar { width: 5px; }
.cm-panel-scroll::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.3); border-radius: 5px; }
.cm-list-head, .cm-strip-head { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-text-lg); }
.cm-strip-head { padding: 12px 2px 8px; }
.cm-stepper { display: inline-flex; align-items: center; gap: 6px; }
.cm-stepper-pos { font-size: 12px; color: var(--text-muted); margin-right: 4px; font-variant-numeric: tabular-nums; }

.cm-search { position: relative; display: flex; align-items: center; color: var(--text-secondary); }
.cm-search svg { position: absolute; left: 13px; pointer-events: none; }
.cm-search input { width: 100%; min-height: 44px; padding: 0 14px 0 38px; border-radius: 11px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-primary); font-size: 13.5px; outline: none; }
.cm-search input::placeholder { color: var(--text-secondary); }
.cm-search input:focus { border-color: rgba(249,115,22,0.6); }
.cm-selects { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.cm-selects select { min-height: 44px; padding: 0 10px; border-radius: 11px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #C4C9D2; font-size: 13px; outline: none; cursor: pointer; min-width: 0; }
.cm-selects select.is-on { border-color: rgba(249,115,22,0.55); color: #FDBA74; background: rgba(249,115,22,0.1); }
.cm-selects select option { background: #151515; color: #F5F0EB; }
/* The row wraps (2 Oct 2026, Vern: "PE circle is cut off a bit"): it used to
   scroll sideways with the scrollbar hidden, so the last chip sat half out
   of view with nothing to say more followed. Seven chips fit one row at the
   panel's width; more wrap onto a second. */
.cm-pills { display: flex; flex-wrap: wrap; gap: 5px; }
.cm-pill { display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: 0 0 auto; min-width: 42px; min-height: 44px; padding: 0 9px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #B7BDC8; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.cm-pill.is-on { border-color: rgba(249,115,22,0.65); background: rgba(249,115,22,0.16); color: #F5F0EB; }
.cm-pill-count { font-size: 10.5px; color: #9CA3AF; background: rgba(255,255,255,0.07); border-radius: 9px; padding: 1px 6px; }
.cm-pill.is-on .cm-pill-count { color: #FDBA74; background: rgba(249,115,22,0.16); }

.cm-list { list-style: none; margin: 0; padding: 4px 8px 12px; }
.cm-card { all: unset; box-sizing: border-box; display: flex; gap: 12px; width: 100%; padding: 8px; border-radius: 12px; cursor: pointer; transition: background .15s ease; }
.cm-card:hover, .cm-card.is-hot { background: rgba(249,115,22,0.09); }
.cm-card:focus-visible { outline: 2px solid #F97316; outline-offset: -2px; }
.cm-thumb { position: relative; flex-shrink: 0; overflow: hidden; border-radius: 9px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
.cm-card-text { display: flex; flex-direction: column; justify-content: center; min-width: 0; gap: 2px; }
.cm-card-title { font-size: 13.5px; font-weight: 700; color: #ECE7E1; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.cm-card-place { font-size: 12px; color: var(--text-muted); }
.cm-card-system { font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent-text-lg); }
.cm-empty { padding: 28px 18px; text-align: center; color: var(--text-muted); font-size: 13.5px; }
.cm-empty p { margin: 0 0 14px; }

.cm-detail { display: flex; flex-direction: column; }
.cm-photos { margin: 0 12px; border-radius: 14px; overflow: hidden; background: #111; }
.cm-photo-rail { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; aspect-ratio: 16 / 11; }
.cm-photo-rail::-webkit-scrollbar { display: none; }
.cm-photo-slide { position: relative; flex: 0 0 100%; scroll-snap-align: start; }
.cm-photo-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 0; background: rgba(10,10,10,0.62); color: #fff; cursor: pointer; opacity: 0; transition: opacity .2s ease; }
.cm-photos:hover .cm-photo-arrow, .cm-photo-arrow:focus-visible { opacity: 1; }
@media (hover: none) { .cm-photo-arrow { opacity: 1; } }
.cm-photo-prev { left: 8px; } .cm-photo-next { right: 8px; }
.cm-photo-dots { position: absolute; left: 0; right: 0; bottom: 8px; display: flex; justify-content: center; gap: 5px; pointer-events: none; }
.cm-photo-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.45); }
.cm-photo-dots span.is-on { background: #fff; width: 16px; border-radius: 3px; }
.cm-detail-body { padding: 14px 18px 20px; }
.cm-detail-meta { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 10px; }
.cm-chip { font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; color: #FDBA74; background: rgba(249,115,22,0.12); }
.cm-chip-lead { color: #1A0E05; background: linear-gradient(90deg, #F97316, #F59E0B); }
.cm-chip-quiet { color: #B7BDC8; background: rgba(255,255,255,0.06); }
.cm-detail-title { font-size: 21px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; color: var(--text-primary); margin: 0 0 6px; outline: none; }
.cm-detail-place { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 13px; color: var(--text-muted); margin: 0 0 12px; }
.cm-approx { font-size: 11px; font-weight: 600; color: #B7BDC8; border: 1px dashed rgba(255,255,255,0.22); border-radius: 6px; padding: 1px 7px; }
.cm-detail-text { font-size: 14px; line-height: 1.6; color: var(--text-body); margin: 0 0 16px; }
.cm-detail-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.cm-detail-links { display: flex; flex-wrap: wrap; gap: 4px 16px; margin: 0; }
.cm-detail-links a { display: inline-flex; align-items: center; min-height: 40px; font-size: 13px; font-weight: 700; color: var(--accent-soft-text); text-decoration: none; }
.cm-detail-links a:hover { color: var(--text-primary); }
.cm-brief { margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px; }
.cm-brief summary { min-height: 40px; display: flex; align-items: center; gap: 8px; cursor: pointer; list-style: none; font-size: 13px; font-weight: 700; color: var(--text-muted); }
.cm-brief summary::-webkit-details-marker { display: none; }
.cm-brief summary::before { content: ""; width: 7px; height: 7px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(-45deg); transition: transform .2s ease; }
.cm-brief[open] summary::before { transform: rotate(45deg); }
.cm-brief p { font-size: 13px; line-height: 1.6; color: var(--text-body); margin: 0 0 10px; }
.cm-brief .cm-brief-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent-text-lg); margin: 6px 0 4px; }

.cm-tour { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 6px 10px; margin: 0 12px 10px; padding: 8px 8px 10px 12px; border-radius: 12px; background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.25); }
.cm-tour-label { font-size: 12px; font-weight: 700; color: #F5F0EB; font-variant-numeric: tabular-nums; }
.cm-tour-buttons { display: inline-flex; gap: 6px; }
.cm-tour-track { grid-column: 1 / -1; height: 3px; border-radius: 3px; background: rgba(255,255,255,0.1); overflow: hidden; }
.cm-tour-fill { display: block; height: 100%; width: 0; background: linear-gradient(90deg, #F97316, #EAB308); animation-name: cm-fill; animation-timing-function: linear; animation-fill-mode: forwards; }
@keyframes cm-fill { from { width: 0; } to { width: 100%; } }
.cm-strip-wrap .cm-tour { margin: 12px 0 0; }

.cm-back { position: absolute; z-index: 7; top: 14px; right: 14px; display: inline-flex; align-items: center; gap: 7px; min-height: 44px; padding: 0 16px; border-radius: 11px; border: 1px solid rgba(255,255,255,0.14); background: rgba(13,14,16,0.88); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: var(--text-primary); font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.45); }
.cm-back:hover { border-color: rgba(249,115,22,0.6); }
.cm-hint { position: absolute; z-index: 5; left: calc(${PANEL_W}px + 28px + (100% - ${PANEL_W}px - 28px) / 2); bottom: 18px; transform: translateX(-50%); margin: 0; padding: 7px 16px; border-radius: 999px; background: rgba(13,14,16,0.82); border: 1px solid rgba(255,255,255,0.08); color: #B7BDC8; font-size: 12px; white-space: nowrap; pointer-events: none; animation: cm-hint 6s ease 1.2s both; }
@keyframes cm-hint { 0% { opacity: 0; transform: translate(-50%, 8px); } 10% { opacity: 1; transform: translate(-50%, 0); } 85% { opacity: 1; } 100% { opacity: 0; } }
.cm-note { position: absolute; z-index: 5; top: 14px; left: 50%; transform: translateX(-50%); margin: 0; padding: 8px 14px; border-radius: 10px; background: rgba(8,13,22,0.9); color: #B7BDC8; font-size: 12px; }

.cm-bubble { all: unset; cursor: pointer; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 10px 18px rgba(0,0,0,0.55)); animation: cm-rise .45s cubic-bezier(.2,.9,.3,1.3) both; }
.cm-bubble-photo { position: relative; width: 64px; height: 64px; border-radius: 50%; overflow: hidden; border: 3px solid #F97316; background: #1a1a1a; box-shadow: 0 0 0 4px rgba(249,115,22,0.22); }
.cm-bubble-photo::after { content: ""; position: absolute; inset: -3px; border-radius: 50%; border: 2px solid rgba(249,115,22,0.8); animation: cm-pulse 2.2s ease-out infinite; }
.cm-bubble-tip { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid #F97316; margin-top: -1px; }
@keyframes cm-rise { from { opacity: 0; transform: translateY(10px) scale(.7); } to { opacity: 1; transform: none; } }
@keyframes cm-pulse { from { transform: scale(1); opacity: .9; } to { transform: scale(1.55); opacity: 0; } }

.cm-mobile-controls { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.cm-strip { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 2px 2px 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.cm-strip::-webkit-scrollbar { display: none; }
.cm-scard { all: unset; box-sizing: border-box; flex: 0 0 min(78vw, 320px); scroll-snap-align: center; display: flex; flex-direction: column; gap: 3px; padding: 8px 8px 12px; border-radius: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); cursor: pointer; }
.cm-scard.is-on { border-color: rgba(249,115,22,0.65); background: rgba(249,115,22,0.08); }
.cm-scard:focus-visible { outline: 2px solid #F97316; outline-offset: 2px; }
.cm-scard-photo { position: relative; display: block; aspect-ratio: 16 / 10; border-radius: 11px; overflow: hidden; background: #151515; margin-bottom: 7px; }
.cm-scard-system { position: absolute; left: 8px; top: 8px; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #1A0E05; background: linear-gradient(90deg, #F97316, #F59E0B); padding: 3px 7px; border-radius: 6px; }
.cm-scard-title { font-size: 14.5px; font-weight: 800; color: var(--text-primary); line-height: 1.3; padding: 0 4px; }
.cm-scard-place { font-size: 12.5px; color: var(--text-muted); padding: 0 4px; }

.cm-sheet-backdrop { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.78); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); display: flex; align-items: flex-end; justify-content: center; animation: cm-fade .2s ease both; }
.cm-sheet { width: 100%; max-width: 640px; max-height: 92vh; overflow-y: auto; background: #121212; border-radius: 22px 22px 0 0; border-top: 1px solid rgba(249,115,22,0.3); padding-bottom: max(16px, env(safe-area-inset-bottom)); animation: cm-up .3s cubic-bezier(.2,.8,.2,1) both; }
.cm-sheet-bar { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(18,18,18,0.94); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
.cm-sheet-pos { font-size: 12px; color: var(--text-muted); padding-left: 6px; font-variant-numeric: tabular-nums; }
.cm-sheet-nav { display: inline-flex; gap: 6px; }
.cm-sheet .cm-icon-btn { width: 44px; height: 44px; }
@keyframes cm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes cm-up { from { transform: translateY(40px); opacity: 0; } to { transform: none; opacity: 1; } }

.maplibregl-cooperative-gesture-screen { background: rgba(8,10,14,0.72) !important; -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); color: var(--text-primary) !important; font-size: 13px !important; font-weight: 600 !important; display: flex; align-items: center; justify-content: center; text-align: center; padding: 0 24px; }
.maplibregl-ctrl-attrib { background: rgba(8,10,14,0.6) !important; }
.maplibregl-ctrl-attrib, .maplibregl-ctrl-attrib-inner, .maplibregl-ctrl-attrib a { color: var(--ink-45) !important; font-size: 10px; }
.maplibregl-ctrl-group { background: rgba(13,14,16,0.88) !important; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 8px 24px rgba(0,0,0,0.45) !important; border-radius: 11px !important; overflow: hidden; }
.maplibregl-ctrl-group button { width: 40px !important; height: 40px !important; }
.maplibregl-ctrl-group button + button { border-top: 1px solid rgba(255,255,255,0.1) !important; }
.maplibregl-ctrl-group .maplibregl-ctrl-icon { filter: invert(1) brightness(1.4); }
.maplibregl-ctrl-bottom-right { margin: 0 6px 6px 0; }

@media (prefers-reduced-motion: reduce) {
  .cm-bubble, .cm-sheet, .cm-sheet-backdrop, .cm-hint { animation: none; }
  .cm-bubble-photo::after { animation: none; display: none; }
  .cm-tour-fill { animation: none; width: 100%; }
}
`;
