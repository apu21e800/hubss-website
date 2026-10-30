/**
 * The calendar: social posts written ahead (lib/social-calendar-data.ts) that
 * Buffer sends at a set time. Vern, 30 Oct 2026: "schedule a couple months
 * posts in advance, we will continue to improve the social media post quality
 * over time", then "let's auto scedule the posts, doug can read the qued
 * drafts, so they can change on the fly".
 *
 * The daily run (app/api/cron/social-drafts) calls scheduleCalendarPosts after
 * the social step. Each entry is scheduled once, on every channel this writes
 * for (LinkedIn, Facebook, Instagram), as a post Buffer sends at its dueAt
 * (createBufferScheduledPost: never a draft, never in the queue slots). Doug
 * reads them on his review page with the rest of what is set to go, and
 * anyone can edit or delete one in Buffer before it goes.
 *
 * The record is the same socialLog-<key> the other streams write (Studio,
 * Sent to Buffer), keyed by the article's slug, so the library never posts
 * the same job again. Claimed before anything goes to Buffer; dropped again
 * if no channel took it, so the next run tries again; kept, with what failed,
 * if some did, so nothing is ever sent twice.
 *
 * Never late: an entry is scheduled only while its time is more than LEAD_MS
 * away. One that missed its time is logged and left; it is never sent late.
 */

import { CALENDAR, type CalendarEntry } from "@/lib/social-calendar-data";
import { bufferChannels, createBufferScheduledPost } from "@/lib/buffer";
import { idFor, imageFor } from "@/lib/social-library";
import { isConflict, unusableReason } from "@/lib/social-outcome";
import { emailEditors } from "@/lib/editor-mail";
import type { sanityWriteClient } from "@/lib/sanity.write";

type Client = ReturnType<typeof sanityWriteClient>;

/** The networks the calendar writes for, the photo's shape and Buffer's per-network settings. */
export const CALENDAR_NETWORKS = {
  linkedin: { image: "landscape" as const, metadata: undefined },
  facebook: { image: "landscape" as const, metadata: { facebook: { type: "post" } } },
  instagram: { image: "portrait" as const, metadata: { instagram: { type: "post", shouldShareToFeed: true } } },
};
export type CalendarNetwork = keyof typeof CALENDAR_NETWORKS;

/** Never schedule a post due sooner than this: it would go out before anyone could look. */
export const LEAD_MS = 2 * 60 * 60 * 1000;
/** Nor one further out than this. */
export const HORIZON_MS = 75 * 24 * 60 * 60 * 1000;

export const calendarLink = (entry: Pick<CalendarEntry, "pageUrl" | "key">, network: string) =>
  `${entry.pageUrl}?utm_source=${network}&utm_medium=social&utm_campaign=archive&utm_content=${encodeURIComponent(entry.key)}`;

/** The text a network gets: its copy with its own tagged link (Instagram has none). */
export function calendarText(entry: CalendarEntry, network: CalendarNetwork): string {
  const text = entry.copy[network];
  return network === "instagram" ? text : text.replace("{link}", calendarLink(entry, network));
}

/**
 * What a run does with the calendar: `schedule` the entries not yet logged
 * whose time is more than LEAD_MS and less than HORIZON_MS away, earliest
 * first; `late` the unlogged ones whose time has come too close or passed.
 */
export function calendarDue(entries: CalendarEntry[], logged: Set<string>, now: Date): { schedule: CalendarEntry[]; late: CalendarEntry[] } {
  const t = now.getTime();
  const open = entries.filter((e) => !logged.has(e.key)).sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));
  return {
    schedule: open.filter((e) => Date.parse(e.dueAt) - t > LEAD_MS && Date.parse(e.dueAt) - t <= HORIZON_MS),
    late: open.filter((e) => Date.parse(e.dueAt) - t <= LEAD_MS),
  };
}

export interface CalendarResult {
  scheduled: { key: string; dueAt: string; channels: string[]; failed: string[] }[];
  late: string[];
  retry: { key: string; why: string }[];
}

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));

export async function scheduleCalendarPosts(client: Client, now = new Date(), opts: { deadline?: number; entries?: CalendarEntry[] } = {}): Promise<CalendarResult> {
  const out: CalendarResult = { scheduled: [], late: [], retry: [] };
  const logged = new Set(await client.fetch<string[]>(`*[_type == "socialLog"].slug`));
  const { schedule, late } = calendarDue(opts.entries ?? CALENDAR, logged, now);
  for (const e of late) {
    out.late.push(e.key);
    console.warn(`[calendar] ${e.key}: due ${e.dueAt}, too close or past before it was scheduled; not sent`);
  }
  if (!schedule.length) return out;

  const channels = (await bufferChannels()).filter((c) => c.service.toLowerCase() in CALENDAR_NETWORKS);
  if (!channels.length) throw new Error("Buffer has no LinkedIn, Facebook or Instagram channel for the calendar");

  for (const entry of schedule) {
    // Each entry takes a few seconds; stop with a minute to spare and let the next run go on.
    if (opts.deadline && Date.now() > opts.deadline - 60_000) {
      console.log(`[calendar] out of time; ${entry.key} and later wait for the next run`);
      break;
    }
    const logId = idFor("socialLog", entry.key);
    try {
      await client.create({
        _id: logId,
        _type: "socialLog",
        slug: entry.key,
        title: entry.title,
        source: "Calendar",
        createdAt: now.toISOString(),
        drafts: [],
        skipped: [],
        styleCheck: `Written ahead and checked by 21e8. Buffer sends it at ${entry.dueAt}.`,
      });
    } catch (err) {
      if (isConflict(err)) continue;
      throw err;
    }

    const drafts: { _key: string; _type: "bufferDraft"; service: string; channel: string; bufferPostId: string }[] = [];
    const skipped: { _key: string; _type: "skippedChannel"; service: string; channel: string; why: string }[] = [];
    for (const ch of channels) {
      const service = ch.service.toLowerCase() as CalendarNetwork;
      const rule = CALENDAR_NETWORKS[service];
      const label = ch.displayName || ch.name;
      const unusable = unusableReason(ch);
      if (unusable) {
        skipped.push({ _key: `s${skipped.length}`, _type: "skippedChannel", service, channel: label, why: unusable });
        continue;
      }
      try {
        const id = await createBufferScheduledPost({
          channelId: ch.id,
          text: calendarText(entry, service),
          imageUrl: imageFor(entry.image, rule.image, entry.imageHotspot),
          imageAlt: entry.imageAlt,
          metadata: rule.metadata,
          dueAt: entry.dueAt,
        });
        drafts.push({ _key: ch.id, _type: "bufferDraft", service, channel: label, bufferPostId: id });
      } catch (err) {
        skipped.push({ _key: `s${skipped.length}`, _type: "skippedChannel", service, channel: label, why: errorText(err) });
      }
    }

    const reasons = skipped.map((s) => `${s.channel} (${s.service}): ${s.why}`).join("; ");
    if (!drafts.length) {
      // Nothing reached Buffer: drop the claim so the next run tries again.
      await client.delete(logId).catch((err) => console.error(`[calendar] ${entry.key}: nothing scheduled, and the claim couldn't be dropped: ${errorText(err)}`));
      out.retry.push({ key: entry.key, why: reasons || "no channel took it" });
      console.warn(`[calendar] ${entry.key}: nothing scheduled; the next run tries again. ${reasons}`);
      continue;
    }
    await client
      .patch(logId)
      .set({ drafts, skipped })
      .commit()
      .catch((err) => console.error(`[calendar] ${entry.key}: scheduled, but the log couldn't be filled in: ${errorText(err)}`));
    out.scheduled.push({ key: entry.key, dueAt: entry.dueAt, channels: drafts.map((d) => d.service), failed: skipped.map((s) => s.service) });
    console.log(`[calendar] ${entry.key}: scheduled for ${entry.dueAt} on ${drafts.map((d) => d.service).join(", ")}${reasons ? `; not on ${reasons}` : ""}`);
  }

  if (out.scheduled.length || out.retry.length) await emailEditors(...calendarEmail(out), "calendar");
  return out;
}

const toronto = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", { timeZone: "America/Toronto", weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/** The editors' email (BLOG_DRAFT_NOTIFY): what went into Buffer, and anything that didn't. */
export function calendarEmail(r: CalendarResult): [string, string] {
  const lines: string[] = [];
  if (r.scheduled.length) {
    lines.push(`Scheduled in Buffer (it sends each at the time shown, Toronto time; edit or delete any of them in Buffer before then):`);
    for (const s of r.scheduled) lines.push(`- ${toronto(s.dueAt)}: ${s.key} on ${s.channels.join(", ")}${s.failed.length ? ` (not on ${s.failed.join(", ")}: post those by hand or leave them)` : ""}`);
  }
  if (r.retry.length) {
    lines.push("", "Not scheduled, tried again at the next run:");
    for (const x of r.retry) lines.push(`- ${x.key}: ${x.why}`);
  }
  const subject = r.retry.length && !r.scheduled.length
    ? "Calendar posts didn't reach Buffer"
    : `${r.scheduled.length} calendar post${r.scheduled.length === 1 ? "" : "s"} scheduled in Buffer`;
  return [subject, lines.join("\n")];
}
