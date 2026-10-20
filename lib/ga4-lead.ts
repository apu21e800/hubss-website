/**
 * Leads in GA4, counted by the server (SEO brief, 20 Oct 2026).
 *
 * GA4 counted 2 form leads the week of 13 to 19 Oct 2026, and both were spam
 * the route had held back from the office. The browser sent generate_lead
 * whenever /api/contact answered { success: true }, and the route answers
 * that for held spam too, on purpose: a spammer must never learn he was
 * screened. So app/api/contact/route.ts now sends generate_lead itself,
 * through GA4's Measurement Protocol, only when a message was delivered to
 * the office's inbox. The browser's own event is form_sent: every "sent"
 * screen, held or not.
 *
 * The visitor's GA ids, read from the tag's cookies by lib/post-form.ts, tie
 * the lead to the visit, so GA4 credits the channel and the landing page that
 * brought it. With none (GA never loaded: a content blocker, or the
 * automation guard in components/HumanAnalytics.tsx) the lead is still
 * counted, under a server id, with lead_attribution "none".
 *
 * Nothing personal goes to GA4: the form, the project or topic the visitor
 * picked, the session id and where the ids came from. Never a name, an email,
 * a phone number, an address or a message. GA4 rejects parameter names that
 * start with "ga_" (its validation server, 20 Oct 2026), hence
 * lead_attribution.
 *
 * Safe to import in the browser (lib/post-form.ts reads GA_MEASUREMENT_ID):
 * GA4_API_SECRET is read only inside sendLeadEvent, on the server, and Next
 * never puts a variable without the NEXT_PUBLIC_ prefix into browser code.
 */

/** The site's GA4 property. Public: the tag carries it on every page (app/layout.tsx). */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-7YSFCGRL5E";

const COLLECT_URL = "https://www.google-analytics.com/mp/collect";
/** GA4 answers in milliseconds; past this, give up. The mail has long gone. */
export const GA4_TIMEOUT_MS = 2500;
/** The longest value GA4 keeps in an event parameter. */
const PARAM_MAX = 100;

/** The visitor's GA ids, as lib/post-form.ts posts them. */
export interface GaIds {
  client_id?: string;
  session_id?: string;
}

/** Digits and dots, and short: all a GA id ever is. */
const GA_ID = /^\d[\d.]{0,39}$/;

/**
 * The `ga` object of a form's body, checked: each id a short string of digits
 * and dots, or left out. A missing or malformed `ga` never fails a form, and
 * the ids never reach the mail.
 */
export function readGaIds(body: unknown): GaIds | undefined {
  if (!body || typeof body !== "object") return undefined;
  const raw = (body as Record<string, unknown>).ga;
  if (!raw || typeof raw !== "object") return undefined;
  const src = raw as Record<string, unknown>;
  const ok = (v: unknown): v is string => typeof v === "string" && GA_ID.test(v);
  const ids: GaIds = {};
  if (ok(src.client_id)) ids.client_id = src.client_id;
  if (ok(src.session_id)) ids.session_id = src.session_id;
  return ids.client_id || ids.session_id ? ids : undefined;
}

/** What the route knows about a delivered message. Only these fields are read. */
export interface LeadInput {
  /** The formType the form posted (app/api/contact/route.ts FORM_TYPES). */
  formType: string;
  /** The contact form's project type: its list, or the system page the visitor came from. */
  projectType?: string;
  /** The Lunch & Learn topic chip. */
  topic?: string;
  /** From readGaIds. */
  ga?: GaIds;
}

export interface LeadParams {
  form_type: string;
  project?: string;
  session_id?: string;
  lead_attribution: "cookie" | "none";
  engagement_time_msec: number;
}

/** The Measurement Protocol's JSON body. */
export interface LeadEvent {
  client_id: string;
  events: [{ name: "generate_lead"; params: LeadParams }];
}

/** The form's name in GA4, as the browser's events have always called it. */
const GA_FORM_TYPE: Record<string, string> = {
  contact: "contact",
  "lunch-learn": "lunch-learn",
  "catalogue-print": "product-book-print",
};

/**
 * What the lead is about, when the form asks: the Lunch & Learn topic or the
 * contact form's project type. Both can arrive in a link (?topic=, ?project=),
 * so a value with an @ or seven digits in it is someone's email address or
 * phone number, not a project, and stays out.
 */
function projectOf(input: LeadInput): string | undefined {
  const v = (input.topic || input.projectType || "").trim();
  if (!v || v.includes("@") || (v.match(/\d/g)?.length ?? 0) >= 7) return undefined;
  return v.slice(0, PARAM_MAX);
}

/** A client id for a lead that arrived without the visitor's own: server.<16 hex>. */
export function serverClientId(): string {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(8));
  return `server.${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * The generate_lead event for a delivered message. Pure apart from the
 * fallback id, which `makeClientId` makes (tests pass a fixed one).
 */
export function leadEvent(input: LeadInput, makeClientId: () => string = serverClientId): LeadEvent {
  const clientId = input.ga?.client_id;
  const project = projectOf(input);
  // A session id belongs to its client id: without the visitor's own id there
  // is no session of theirs to join.
  const sessionId = clientId ? input.ga?.session_id : undefined;
  const params: LeadParams = {
    form_type: Object.prototype.hasOwnProperty.call(GA_FORM_TYPE, input.formType) ? GA_FORM_TYPE[input.formType] : input.formType,
    ...(project ? { project } : {}),
    ...(sessionId ? { session_id: sessionId } : {}),
    lead_attribution: clientId ? "cookie" : "none",
    engagement_time_msec: 1,
  };
  return { client_id: clientId ?? makeClientId(), events: [{ name: "generate_lead", params }] };
}

/**
 * Sends the lead to GA4. The route calls it through after(), so it runs once
 * the visitor has the response and can neither stop nor slow the mail. Never
 * throws; every outcome is one `[contact] ga4 ...` line with no personal
 * details, and never the address, which carries the secret.
 */
export async function sendLeadEvent(event: LeadEvent, secret = process.env.GA4_API_SECRET): Promise<void> {
  if (!secret) {
    console.info("[contact] ga4 skipped: no secret");
    return;
  }
  const { form_type, lead_attribution } = event.events[0].params;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GA4_TIMEOUT_MS);
  try {
    const url = `${COLLECT_URL}?measurement_id=${encodeURIComponent(GA_MEASUREMENT_ID)}&api_secret=${encodeURIComponent(secret)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      signal: controller.signal,
    });
    res.body?.cancel().catch(() => {});
    if (res.ok) console.info(`[contact] ga4 sent: ${form_type} (${lead_attribution})`);
    else console.error(`[contact] ga4 failed: HTTP ${res.status}`);
  } catch (err) {
    const cause = (err as { cause?: { code?: unknown } } | null)?.cause?.code;
    const why = controller.signal.aborted
      ? `no answer in ${GA4_TIMEOUT_MS} ms`
      : typeof cause === "string"
        ? cause
        : err instanceof Error
          ? err.name
          : "unknown error";
    console.error(`[contact] ga4 failed: ${why}`);
  } finally {
    clearTimeout(timer);
  }
}
