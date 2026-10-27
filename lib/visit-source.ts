/**
 * Where a visitor came from, carried with every form to the office's email
 * (27 Oct 2026, Google Ads readiness: "Make sure UTM/gclid is preserved
 * through to the form so a delivered lead can be tied to the ad").
 *
 * On each full page load (instrumentation-client.ts) the page's address is
 * read once: the five utm_ tags, whether it was a Google Ads click (gclid,
 * gbraid or wbraid: only the fact, never the id), the path it landed on and
 * the other site that linked to it. Kept for the visit in sessionStorage,
 * which is the tab's own and no cookie; a later arrival with tags of its own
 * (a second ad click in the same tab) replaces it, a plain page change
 * doesn't. lib/post-form.ts sends it as `source`, and the contact route
 * prints it in the email as "Came from" and "Landing page".
 *
 * GA4 credits the ad by itself (lib/ga4-lead.ts sends the visit's GA ids
 * with the lead), so none of this goes to GA4. Nothing personal: no query
 * string beyond the five tags, no click id, and any tag value with an @ in
 * it is dropped, since a link can carry anything.
 *
 * Shared by the browser (record, read) and the server (check, describe).
 */

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
type UtmKey = (typeof UTM_KEYS)[number];

/** The ad click parameters Google Ads adds to a landing page's address. */
const GOOGLE_CLICK_KEYS = ["gclid", "gbraid", "wbraid"];

export type VisitSource = Partial<Record<UtmKey, string>> & {
  /** "google": the address carried a Google Ads click id. The id itself is never kept. */
  click?: "google";
  /** The path the visit landed on, without its query string. */
  landing?: string;
  /** The other site that sent the visitor (its host name), when the browser said. */
  referrer?: string;
};

const STORAGE_KEY = "hubss:visit-source";
const MAX_TAG = 100;
const MAX_PATH = 200;
/** Letters (any language), digits, spaces and the punctuation ad tools put in tags. */
const TAG_OK = /^[\p{L}\p{N} ._\-+/:()|,&'%!~*]+$/u;
const PATH_OK = /^\/[\p{L}\p{N}._\-~/%]*$/u;
const HOST_OK = /^[a-z0-9.-]{1,100}$/i;

/** A tag value as the email may show it, or nothing. */
function cleanTag(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim().slice(0, MAX_TAG);
  if (!t || t.includes("@") || !TAG_OK.test(t)) return undefined;
  return t;
}

function cleanPath(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const p = v.slice(0, MAX_PATH);
  return PATH_OK.test(p) ? p : undefined;
}

function cleanHost(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const h = v.trim().toLowerCase().replace(/^www\./, "");
  return HOST_OK.test(h) && h.includes(".") ? h : undefined;
}

/** Keeps only what the email may show; undefined when nothing is left. */
export function cleanVisitSource(raw: unknown): VisitSource | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const src = raw as Record<string, unknown>;
  const out: VisitSource = {};
  for (const k of UTM_KEYS) {
    const v = cleanTag(src[k]);
    if (v) out[k] = v;
  }
  if (src.click === "google") out.click = "google";
  const landing = cleanPath(src.landing);
  if (landing) out.landing = landing;
  const referrer = cleanHost(src.referrer);
  if (referrer) out.referrer = referrer;
  return Object.keys(out).length ? out : undefined;
}

/** What one page load's address and referrer say. `host` is the site's own, so its links don't count. */
export function sourceFromUrl(href: string, referrer: string, host: string): VisitSource {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return {};
  }
  const raw: Record<string, unknown> = {};
  for (const k of UTM_KEYS) raw[k] = url.searchParams.get(k) ?? undefined;
  if (GOOGLE_CLICK_KEYS.some((k) => url.searchParams.get(k))) raw.click = "google";
  raw.landing = url.pathname;
  try {
    const r = new URL(referrer);
    if (r.host && r.host !== host) raw.referrer = r.hostname;
  } catch {}
  return cleanVisitSource(raw) ?? {};
}

/** True when the arrival names its source: tags, an ad click or another site. */
function namesASource(s: VisitSource): boolean {
  return Boolean(s.utm_source || s.utm_medium || s.utm_campaign || s.click || s.referrer);
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * Called on every full page load (instrumentation-client.ts). The first page
 * of a visit is always kept; a later one only when it names a source of its
 * own. Never throws: storage can be off or full, and where a browser blocks
 * it, merely reading window.sessionStorage throws (a SecurityError), so the
 * defaults are read inside the try, not as default arguments (the Vercel
 * Agent's review of #103: a default argument threw before the catch and would
 * have stopped instrumentation-client.ts before BotID started).
 */
export function recordVisitSource(loc?: { href: string; host: string }, referrer?: string, storage?: StorageLike): void {
  try {
    const where = loc ?? window.location;
    const store = storage ?? window.sessionStorage;
    const next = sourceFromUrl(where.href, referrer ?? document.referrer, where.host);
    if (store.getItem(STORAGE_KEY) === null || namesASource(next)) {
      store.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {}
}

/** The visit's source for a form, checked again on the way out. Never throws, as above. */
export function storedVisitSource(storage?: StorageLike): VisitSource | undefined {
  try {
    const raw = (storage ?? window.sessionStorage).getItem(STORAGE_KEY);
    return raw ? cleanVisitSource(JSON.parse(raw)) : undefined;
  } catch {
    return undefined;
  }
}

/** The form body's `source`, checked (the route never trusts the browser's own check). */
export function readVisitSource(body: unknown): VisitSource | undefined {
  if (!body || typeof body !== "object") return undefined;
  return cleanVisitSource((body as Record<string, unknown>).source);
}

/**
 * The email's two lines, and a short label for the route's log line:
 *   Came from     google / cpc · west-crosswalks · "decorative crosswalks" · Google Ads click
 *   Landing page  /products/streetprint
 * With no source (a page loaded before this shipped, or storage off) the
 * email shows neither line and the label is "unknown".
 */
export function describeVisitSource(s: VisitSource | undefined): { cameFrom?: string; landing?: string; label: string } {
  if (!s) return { label: "unknown" };
  let cameFrom: string;
  let label: string;
  if (s.utm_source || s.utm_medium || s.utm_campaign) {
    const parts = [`${s.utm_source ?? "(no source)"} / ${s.utm_medium ?? "(no medium)"}`];
    if (s.utm_campaign) parts.push(s.utm_campaign);
    if (s.utm_content) parts.push(s.utm_content);
    if (s.utm_term) parts.push(`"${s.utm_term}"`);
    if (s.click) parts.push("Google Ads click");
    cameFrom = parts.join(" · ");
    label = `${s.utm_source ?? "-"}/${s.utm_medium ?? "-"}`;
  } else if (s.click) {
    cameFrom = "Google Ads click";
    label = "google-ads";
  } else if (s.referrer) {
    cameFrom = `a link or search on ${s.referrer}`;
    label = `ref:${s.referrer}`;
  } else {
    cameFrom = "direct (typed in, bookmarked or not recorded)";
    label = "direct";
  }
  return { cameFrom, ...(s.landing ? { landing: s.landing } : {}), label: label.slice(0, 80) };
}
