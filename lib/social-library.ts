/**
 * The library stream (14 Oct 2026, Vern: "automate as much as the social media
 * as possible ... I don't want to write the blogs and do the social media").
 * Once a week the daily social job (lib/social-pipeline.ts) drafts posts from
 * one thing HUB has already published and checked, so the Buffer queue never
 * runs dry between new articles:
 *
 *  - a documented job from the homepage map (lib/map-projects.ts): real place,
 *    real system, photos of that job, linked to its write-up, its Idea Book
 *    page or its system;
 *  - a system from the Idea Book (lib/product-catalogue.ts), Doug-approved copy;
 *  - an application from the Idea Book (lib/application-catalogue.ts).
 *
 * Jobs and Idea Book spreads take turns (job, system, job, application, ...).
 * A job whose write-up already went out as an article is skipped, so nothing
 * is posted twice. Everything is drafts in Buffer, approved by a person.
 *
 * Pure data and dates: `npm run test:social` checks it without the network.
 */

import { mapProjects, TOUR_IDS, type MapProject } from "@/lib/map-projects";
import { PRODUCT_CATALOGUE } from "@/lib/product-catalogue";
import { APPLICATION_CATALOGUE } from "@/lib/application-catalogue";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { productImages, applicationImages } from "@/lib/featured-images";
import { isSanityImage } from "@/lib/photos";

export const SITE = "https://hubss.com";

export interface LibraryItem {
  /** The log key: "lib:project:<id>", "lib:system:<slug>", "lib:application:<slug>". */
  key: string;
  title: string;
  /** What kind of source, for the writer: "A documented HUB job". */
  type: string;
  excerpt: string;
  /** The facts the posts may use, and nothing else. */
  text: string;
  /** The page the posts link to, a path on hubss.com. */
  path: string;
  /** What that page is, for the writer's ask. */
  linkTo: string;
  /** The photo, as an absolute URL (Sanity's CDN or hubss.com). */
  image?: string;
  imageAlt?: string;
  /** The article that already documents this job, if any: when it went out as an article, skip it. */
  post?: string;
  /** For systems and applications: the page whose Studio hero photo is preferred over `image`. */
  hero?: { type: "product" | "application"; slug: string };
}

const PROVINCES: Record<string, string> = {
  BC: "British Columbia", AB: "Alberta", SK: "Saskatchewan", MB: "Manitoba", ON: "Ontario",
  QC: "Quebec", NB: "New Brunswick", NS: "Nova Scotia", PE: "Prince Edward Island",
  NL: "Newfoundland and Labrador", YT: "Yukon", NT: "Northwest Territories", NU: "Nunavut",
};

/** A path on the site or a full URL, as a full URL. */
export function absolute(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${SITE}${src.startsWith("/") ? "" : "/"}${src}`;
}

const productBy = (name: string) => products.find((p) => p.name === name);

function projectItem(p: MapProject): LibraryItem | null {
  if (!p.images.length) return null;
  const product = productBy(p.product);
  const province = PROVINCES[p.province] ?? p.province;
  const about = product ? PRODUCT_CATALOGUE[product.slug]?.description : undefined;
  const text = [
    `Job: ${p.title}.`,
    `Where: ${p.city}, ${province}.`,
    `System: ${p.product}${p.systems?.length ? `, with ${p.systems.join(" and ")}` : ""}.`,
    `Application: ${p.application}.`,
    p.year ? `Installed: ${p.year}.` : "",
    p.excerpt,
    p.problem ? `The brief: ${p.problem}` : "",
    p.solution ? `What went down: ${p.solution}` : "",
    about ? `About ${p.product}, from the HUB Idea Book: ${about}` : "",
  ].filter(Boolean).join("\n");
  const [path, linkTo] = p.slug
    ? [`/blog/${p.slug}`, "the article about this job on hubss.com"]
    : p.ideaBookPage
      ? [`/idea-book/${p.ideaBookPage}`, "this job's page in the HUB Idea Book on hubss.com"]
      : product
        ? [`/products/${product.slug}`, `the ${p.product} page on hubss.com`]
        : ["/", "hubss.com"];
  return {
    key: `lib:project:${p.id}`,
    title: `${p.title}, ${p.city}`,
    type: "A documented HUB job",
    excerpt: p.excerpt,
    text,
    path,
    linkTo,
    image: absolute(p.images[0]),
    imageAlt: `${p.title} in ${p.city}, ${province}`,
    post: p.post,
  };
}

function systemItems(): LibraryItem[] {
  return products.flatMap((product) => {
    const entry = PRODUCT_CATALOGUE[product.slug];
    if (!entry) return [];
    const hero = productImages[product.slug];
    return [{
      key: `lib:system:${product.slug}`,
      title: product.name,
      type: "A system from the HUB Idea Book",
      excerpt: entry.subhead,
      text: [
        `System: ${product.name}.`,
        entry.title,
        entry.subhead,
        entry.description,
        `Specs: ${entry.specs.map((s) => `${s.label}: ${s.value}`).join("; ")}.`,
        `Where it goes: ${entry.uses.join(", ")}.`,
      ].join("\n"),
      path: `/products/${product.slug}`,
      linkTo: `the ${product.name} page on hubss.com`,
      image: hero ? absolute(hero.featured ?? hero.fallback) : product.imageUrl ? absolute(product.imageUrl) : undefined,
      imageAlt: hero?.alt ?? product.name,
      hero: { type: "product" as const, slug: product.slug },
    }];
  });
}

function applicationItems(): LibraryItem[] {
  return applications.flatMap((app) => {
    const entry = APPLICATION_CATALOGUE[app.slug];
    if (!entry) return [];
    const hero = applicationImages[app.slug];
    const systems = entry.specify
      .map((s) => {
        const name = products.find((p) => p.slug === s.slug)?.name;
        return name ? `${name} (${s.note})` : null;
      })
      .filter(Boolean);
    return [{
      key: `lib:application:${app.slug}`,
      title: app.name,
      type: "An application from the HUB Idea Book",
      excerpt: entry.statement,
      text: [
        `Application: ${app.name}.`,
        entry.title,
        entry.statement,
        entry.body,
        systems.length ? `Systems HUB specifies for it: ${systems.join("; ")}.` : "",
      ].filter(Boolean).join("\n"),
      path: `/applications/${app.slug}`,
      linkTo: `the ${app.name} page on hubss.com`,
      image: hero ? absolute(hero.featured ?? hero.fallback) : undefined,
      imageAlt: hero?.alt ?? app.name,
      hero: { type: "application" as const, slug: app.slug },
    }];
  });
}

/**
 * Every library item, in posting order: jobs and Idea Book spreads take turns
 * (job, system, job, application, ...). The map tour's jobs come first, in
 * tour order (TOUR_IDS: the strongest photographs, coast to coast), then jobs
 * with a write-up (the richest facts and a page to read), then jobs shown in
 * the Idea Book, then the rest, each group in the map's order. When one kind
 * runs out the others carry on.
 */
export function libraryQueue(projects: readonly MapProject[] = mapProjects): LibraryItem[] {
  const tour = new Map(TOUR_IDS.map((id, i) => [id, i]));
  const rank = (p: MapProject) => (tour.has(p.id) ? 0 : p.slug ? 1 : p.ideaBookPage ? 2 : 3);
  const order = (p: MapProject, i: number) => tour.get(p.id) ?? i;
  const jobs = projects
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p) - rank(b.p) || order(a.p, a.i) - order(b.p, b.i))
    .map(({ p }) => projectItem(p))
    .filter((x): x is LibraryItem => x !== null);
  const systems = systemItems();
  const apps = applicationItems();
  const out: LibraryItem[] = [];
  let spread = 0;
  while (jobs.length || systems.length || apps.length) {
    const job = jobs.shift();
    if (job) out.push(job);
    const next = spread++ % 2 === 0 ? systems.shift() ?? apps.shift() : apps.shift() ?? systems.shift();
    if (next) out.push(next);
  }
  return out;
}

/**
 * The next item to post: the first in the queue that hasn't been logged, and
 * isn't a job whose article already had its own social posts.
 */
export function nextLibraryItem(queue: readonly LibraryItem[], logged: ReadonlySet<string>): LibraryItem | undefined {
  return queue.find((item) => !logged.has(item.key) && !(item.post && logged.has(item.post)));
}

/** Monday 00:00 UTC of the week `now` is in. */
export function weekStart(now: Date): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d;
}

/**
 * Whether today's run should draft a library post: when none has been drafted
 * yet this week (weeks start Monday 00:00 UTC), so it lands with the Monday
 * run and a missed Monday catches up later that week without moving the next
 * one off Monday. At once when there has never been one, so the stream can be
 * seen working the day it ships.
 */
export function libraryDue(now: Date, lastAt: string | undefined): boolean {
  if (!lastAt) return true;
  const t = Date.parse(lastAt);
  if (Number.isNaN(t)) return true;
  return t < weekStart(now).getTime();
}

/** Sanity ids allow letters, digits, dots, dashes and underscores: "lib:project:x" becomes "lib-project-x". */
export const idFor = (prefix: "socialLog" | "socialRetry", key: string) => `${prefix}-${key.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

/** The pixel size Sanity puts in an asset's file name: "...-960x1280.jpg". */
function sanitySize(src: string): { w: number; h: number } | null {
  const m = new URL(src).pathname.match(/-(\d+)x(\d+)\.[a-z]+$/i);
  return m ? { w: Number(m[1]), h: Number(m[2]) } : null;
}

/**
 * The photo for one network, cropped on Sanity's CDN as a JPEG: the 1200×630
 * share crop, or 4:5 (1080×1350) for Instagram and for any portrait photo, so
 * a phone shot isn't cut down to a strip that loses the job. With a hotspot,
 * the crop centres on it. The site's own photos (the library's hero and map
 * photos) go as they are.
 */
export function imageFor(
  src: string | undefined,
  shape: "portrait" | "landscape" | undefined,
  hotspot?: { x: number; y: number } | null
): string | undefined {
  if (!src || !shape) return undefined;
  if (!isSanityImage(src)) return src.startsWith(`${SITE}/`) ? src : undefined;
  const size = sanitySize(src);
  const tall = shape === "portrait" || (size !== null && size.h > size.w);
  const url = new URL(src);
  url.searchParams.set("w", tall ? "1080" : "1200");
  url.searchParams.set("h", tall ? "1350" : "630");
  url.searchParams.set("fit", "crop");
  if (hotspot && Number.isFinite(hotspot.x) && Number.isFinite(hotspot.y)) {
    url.searchParams.set("crop", "focalpoint");
    url.searchParams.set("fp-x", hotspot.x.toFixed(3));
    url.searchParams.set("fp-y", hotspot.y.toFixed(3));
  }
  url.searchParams.set("fm", "jpg");
  url.searchParams.set("q", tall ? "85" : "80");
  return url.toString();
}
