/**
 * Lunch & Learn links, with the topic carried into the booking form.
 *
 * Vern, 27 Sep 2026: the Lunch & Learn call to action "needs to be
 * intelligently distributed across the site, where it will clearly lead to
 * conversion." A specifier reading the StreetPrint page who books a session
 * wants a StreetPrint session, so every contextual link names its topic:
 * /lunch-learn?topic=StreetPrint&from=product#book. The form reads both, shows
 * the topic as a chip the visitor can clear, and sends both in the request
 * email, so Doug knows what the session is about and which page earned it.
 *
 * Pure strings: safe in server and client components.
 */

import { stegaClean } from "@sanity/client/stega";

/** Longest topic the form accepts from a URL; anything longer is not a topic. */
export const LL_TOPIC_MAX = 80;

export function lunchLearnHref(topic?: string, from?: string): string {
  const q = new URLSearchParams();
  // A product or application name read in Studio's preview carries invisible
  // edit markers (about 900 characters), which put the topic over
  // LL_TOPIC_MAX and the form dropped it. The link takes the plain name.
  if (topic) q.set("topic", stegaClean(topic));
  if (from) q.set("from", from);
  const s = q.toString();
  return `/lunch-learn${s ? `?${s}` : ""}#book`;
}

/** The topic and source a visitor arrived with, cleaned for display and email. */
export function readLunchLearnParams(search: string): { topic?: string; from?: string } {
  const q = new URLSearchParams(search);
  const clean = (v: string | null, max: number) => {
    const t = (v ?? "").replace(/[\u0000-\u001f<>]/g, "").trim();
    return t && t.length <= max ? t : undefined;
  };
  return { topic: clean(q.get("topic"), LL_TOPIC_MAX), from: clean(q.get("from"), 40) };
}
