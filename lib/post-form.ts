/**
 * How every form on the site sends (contact, Lunch & Learn, printed Product
 * Book). Browser code only.
 *
 * Normally through Vercel BotID: instrumentation-client.ts wraps fetch so a
 * request to /api/contact carries proof it came from a real browser. But some
 * browsers can't run that check: a content blocker or a strict office network
 * stops its script, and then BotID's fetch fails at once, or waits for a
 * challenge that never comes (the review of 6 Oct 2026 reproduced both).
 * HUB's customers include city IT departments, so that is not hypothetical.
 *
 * So: give the checked send 15 seconds, longer than the route ever takes,
 * and if it throws or runs out, send again without the check. The route
 * screens those like any other submission (app/api/contact/route.ts, the
 * "unchecked" gate). If that fails too, the form shows its own error, which
 * gives the email address and phone numbers.
 *
 * Every send also carries the visitor's GA ids, `ga: { client_id, session_id }`
 * from the tag's cookies, when there are any: the route sends the lead to GA4
 * once the message is delivered (lib/ga4-lead.ts), and the ids let GA4 credit
 * the channel and the landing page that brought it.
 */

import { GA_MEASUREMENT_ID, type GaIds } from "./ga4-lead";

const CHECKED_SEND_MS = 15_000;

/**
 * The visitor's GA ids, from the cookies the GA4 tag sets:
 *   _ga         GA1.1.1234567890.1700000000: the client id is the last two parts
 *   _ga_<id>    GS1.1.1700000123.4.1.1700000999.0.0.0: the session id is the third part,
 *               or GS2.1.s1700000123$o4$g1$t1700000999$j60$l0$h0 (the newer shape),
 *               without its "s" and up to the first "$"
 * Either can be missing (GA never loaded: a content blocker, or the automation
 * guard in components/HumanAnalytics.tsx), and anything of another shape is
 * left out.
 */
export function gaIdsFromCookie(cookie: string, measurementId = GA_MEASUREMENT_ID): GaIds {
  const jar = new Map<string, string>();
  for (const pair of cookie.split(";")) {
    const eq = pair.indexOf("=");
    const name = pair.slice(0, eq).trim();
    if (eq > 0 && !jar.has(name)) jar.set(name, pair.slice(eq + 1).trim());
  }
  const ids: GaIds = {};
  const ga = (jar.get("_ga") ?? "").split(".");
  if (ga.length >= 4 && /^GA\d+$/.test(ga[0])) {
    const id = ga.slice(-2).join(".");
    if (/^\d{1,20}\.\d{1,20}$/.test(id)) ids.client_id = id;
  }
  const gs = (jar.get(`_ga_${measurementId.replace(/^G-/, "")}`) ?? "").split(".");
  if (gs.length >= 3 && /^GS\d+$/.test(gs[0])) {
    const id = gs[2].replace(/^s/, "").split(/\$|%24/i)[0];
    if (/^\d{1,20}$/.test(id)) ids.session_id = id;
  }
  return ids;
}

/** `ga` for the body, when the tag has set its cookies. Nothing here can stop a form. */
function gaField(): { ga?: GaIds } {
  try {
    const ids = gaIdsFromCookie(document.cookie);
    return ids.client_id || ids.session_id ? { ga: ids } : {};
  } catch {
    return {};
  }
}

type Fetch = typeof fetch;

/** The browser's own fetch, saved before BotID wrapped it (instrumentation-client.ts). */
function unwrappedFetch(): Fetch {
  const w = window as unknown as { __hubssFetch?: Fetch };
  return w.__hubssFetch ?? window.fetch.bind(window);
}

export async function postForm(body: Record<string, unknown>): Promise<Response> {
  const payload = JSON.stringify({ ...body, ...gaField() });
  const init = (signal?: AbortSignal): RequestInit => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    signal,
  });

  const checked = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      fetch("/api/contact", init(checked.signal)),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("bot check timed out")), CHECKED_SEND_MS);
      }),
    ]);
  } catch {
    // Cancel the checked send first: if BotID's challenge arrives later, its
    // request goes out already aborted, so Doug never gets the message twice.
    checked.abort();
    return unwrappedFetch()("/api/contact", init());
  } finally {
    clearTimeout(timer);
  }
}
