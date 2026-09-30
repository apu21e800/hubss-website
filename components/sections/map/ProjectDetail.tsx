"use client";

/**
 * One project, as the map shows it: the photographs, what and where, one
 * sentence, and the ways to go further. Used twice by CanadaMap: inside the
 * floating panel on a desktop, and in the full-screen sheet on a phone.
 *
 * Text-light by design (Vern, 30 Sep 2026: "don't overload users with text").
 * The challenge and solution, where a pin has them, sit behind "The brief".
 */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { mapLoader } from "@/lib/map-photo";
import type { MapProject } from "@/lib/map-projects";

const PROVINCE_NAME: Record<string, string> = {
  YT: "Yukon", NT: "Northwest Territories", NU: "Nunavut", BC: "British Columbia", AB: "Alberta",
  SK: "Saskatchewan", MB: "Manitoba", ON: "Ontario", QC: "Québec", NB: "New Brunswick",
  NS: "Nova Scotia", PE: "Prince Edward Island", NL: "Newfoundland and Labrador",
};
export const provinceName = (code: string) => PROVINCE_NAME[code] ?? code;

/** Display name to product page slug; the fallback is the kebab-case the site uses. */
const PRODUCT_SLUGS: Record<string, string> = {
  TrafficPatternsXD: "traffic-patterns-xd",
  TrafficPatterns: "traffic-patterns",
  StreetBondSR: "streetbondsr",
  StreetBond: "streetbond",
  StreetPrint: "streetprint",
  DecoMark: "decomark",
  DuraTherm: "duratherm",
  DuraShield: "durashield",
  PreMark: "premark",
  MMAX: "mmax",
};
export const productHref = (name: string) =>
  `/products/${PRODUCT_SLUGS[name] ?? name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;

function Photos({ project, sizes, priority }: { project: MapProject; sizes: string; priority?: boolean }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = project.images.length;

  // A new project starts on its first photo.
  useEffect(() => {
    setIndex(0);
    railRef.current?.scrollTo({ left: 0 });
  }, [project.id]);

  const go = (i: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const next = (i + count) % count;
    rail.scrollTo({ left: next * rail.clientWidth, behavior: "smooth" });
  };

  if (count === 0) return null;
  return (
    <div className="cm-photos" style={{ position: "relative" }}>
      <div
        ref={railRef}
        className="cm-photo-rail"
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
        }}
        aria-label={`${project.title}, ${count} photo${count > 1 ? "s" : ""}`}
        role="group"
      >
        {project.images.map((src, i) => (
          <div key={src} className="cm-photo-slide">
            <Image
              loader={mapLoader}
              src={src}
              alt={i === 0 ? `${project.title}, ${project.city}` : `${project.title}, photo ${i + 1}`}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          <button type="button" className="cm-photo-arrow cm-photo-prev" aria-label="Previous photo" onClick={() => go(index - 1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="cm-photo-arrow cm-photo-next" aria-label="Next photo" onClick={() => go(index + 1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
          <div className="cm-photo-dots" aria-hidden="true">
            {project.images.map((src, i) => (
              <span key={src} className={i === index ? "is-on" : undefined} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProjectDetail({
  project,
  headingId,
  photoSizes,
  priority,
}: {
  project: MapProject;
  headingId: string;
  photoSizes: string;
  priority?: boolean;
}) {
  const systems = [project.product, ...(project.systems ?? [])];
  const readHref = project.slug ? `/blog/${project.slug}` : null;
  const bookHref = project.ideaBookPage ? `/idea-book/${project.ideaBookPage}` : null;
  const hasBrief = Boolean(project.problem || project.solution);

  return (
    <article className="cm-detail" aria-labelledby={headingId}>
      <Photos project={project} sizes={photoSizes} priority={priority} />

      <div className="cm-detail-body">
        <p className="cm-detail-meta">
          {systems.map((s, i) => (
            <span key={s} className={i === 0 ? "cm-chip cm-chip-lead" : "cm-chip"}>{s}</span>
          ))}
          <span className="cm-chip cm-chip-quiet">{project.application}</span>
          {project.year && <span className="cm-chip cm-chip-quiet">{project.year}</span>}
        </p>

        <h3 id={headingId} className="cm-detail-title" tabIndex={-1}>{project.title}</h3>
        <p className="cm-detail-place">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {project.city}, {provinceName(project.province)}
          {project.approximate && <span className="cm-approx">Approximate location</span>}
        </p>

        <p className="cm-detail-text">{project.excerpt}</p>

        {(readHref || bookHref) && (
          <div className="cm-detail-actions">
            <a className="cm-btn cm-btn-primary" href={readHref ?? bookHref ?? "#"}>
              {readHref ? "Read the write-up" : "See it in the Idea Book"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>
        )}

        <p className="cm-detail-links">
          {readHref && bookHref && <a href={bookHref}>Idea Book, page {project.ideaBookPage}</a>}
          <a href={productHref(project.product)}>About {project.product}</a>
          <a href="/contact">Plan a project like this</a>
        </p>

        {hasBrief && (
          <details className="cm-brief">
            <summary>The brief</summary>
            {project.problem && (
              <>
                <p className="cm-brief-label">Challenge</p>
                <p>{project.problem}</p>
              </>
            )}
            {project.solution && (
              <>
                <p className="cm-brief-label">Solution</p>
                <p>{project.solution}</p>
              </>
            )}
          </details>
        )}
      </div>
    </article>
  );
}
