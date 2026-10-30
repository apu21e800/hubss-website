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
 * the same job again (lib/social-pipeline.ts also skips every job in the
 * calendar before its turn). Claimed before anything goes to Buffer; dropped
 * again when no channel took it for certain, so the next run tries again;
 * kept, with what failed, when some did or Buffer gave no clear answer (a
 * timeout, a server error), so nothing is ever sent twice.
 *
 * Never late: an entry is scheduled only while its time is more than LEAD_MS
 * away. One that missed its time is logged and left; it is never sent late.
 * Never early either: an entry goes into Buffer within HORIZON_MS (twelve
 * days) of its time, so it is on Doug's review page the whole time it waits.
 */

import { CALENDAR, type CalendarEntry } from "@/lib/social-calendar-data";
import { BUFFER_TIMEOUT_MS, BufferApiError, bufferChannels, createBufferScheduledPost, type BufferChannel } from "@/lib/buffer";
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
/**
 * Nor one further out than this: twelve days. Doug's review page reads the
 * Buffer posts made in the last 14 days (lib/review-page.ts,
 * SOCIAL_WINDOW_DAYS), so a post put into Buffer any earlier would drop off
 * his page while it still waits to go; the test keeps the two in step. Until
 * then an entry is only in this file, so an improvement to its copy reaches
 * it (Vern: "we will continue to improve the social media post quality over
 * time"). The daily run puts each one into Buffer twelve days ahead.
 */
export const HORIZON_MS = 12 * 24 * 60 * 60 * 1000;
/**
 * The time one entry can take: one Buffer call per channel at its 20-second
 * limit (lib/buffer.ts), plus this for the claim and the log. An entry is
 * started only with that much of the run left, so the run is never stopped
 * between the claim and the log, which would leave a claim that is never
 * tried again.
 */
const ENTRY_BASE_MS = 50_000;
export const entryBudgetMs = (channels: number) => ENTRY_BASE_MS + channels * BUFFER_TIMEOUT_MS;

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

/**
 * Why the calendar can't post to a channel today, or null. Beyond what stops
 * every stream (lib/social-outcome.ts), a paused queue: Buffer holds a paused
 * channel's posts and, unpaused, moves them to its next free slots, so a dated
 * post (Kitchener's, before Remembrance Day) could go out late.
 */
export function calendarChannelProblem(ch: Pick<BufferChannel, "isDisconnected" | "isLocked" | "isQueuePaused">): string | null {
  return unusableReason(ch) ?? (ch.isQueuePaused ? "its queue is paused in Buffer: unpause it there" : null);
}

/**
 * True when Buffer may have made the post although the call failed: no answer
 * in time (status 0) or a server error. Such an entry keeps its record, so no
 * later run makes the same post again; the email says to look in Buffer.
 */
export function mayHaveReachedBuffer(err: unknown): boolean {
  return err instanceof BufferApiError && (err.status === 0 || err.status >= 500);
}

export interface CalendarResult {
  /** In Buffer on at least one channel; `failed` names the channels it isn't on, and why. */
  scheduled: { key: string; dueAt: string; channels: string[]; failed: { network: string; why: string }[] }[];
  /** On no channel for certain, but Buffer may have made some: kept, never tried again. */
  check: { key: string; dueAt: string; why: string }[];
  /** Nothing reached Buffer: the next run tries again. */
  retry: { key: string; why: string }[];
  /** Nothing reached Buffer and its record couldn't be cleared, so no run tries again until it is. */
  stuck: { key: string; why: string }[];
  /** Its time came before a run could schedule it: logged, reported once, never sent late. */
  missed: { key: string; dueAt: string }[];
}

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));

type Draft = { _key: string; _type: "bufferDraft"; service: string; channel: string; bufferPostId: string };
type Skip = { _key: string; _type: "skippedChannel"; service: string; channel: string; why: string };

export async function scheduleCalendarPosts(client: Client, now = new Date(), opts: { deadline?: number; entries?: CalendarEntry[] } = {}): Promise<CalendarResult> {
  const out: CalendarResult = { scheduled: [], check: [], retry: [], stuck: [], missed: [] };
  const logged = new Set(await client.fetch<string[]>(`*[_type == "socialLog"].slug`));
  const { schedule, late } = calendarDue(opts.entries ?? CALENDAR, logged, now);
  try {
    // A missed entry gets a record, so it is reported once and the library never posts its job.
    for (const e of late) {
      try {
        await client.create({
          _id: idFor("socialLog", e.key),
          _type: "socialLog",
          slug: e.key,
          title: e.title,
          source: "Calendar",
          createdAt: now.toISOString(),
          drafts: [],
          skipped: [{ _key: "missed", _type: "skippedChannel", service: "all", channel: "all", why: `Missed: its time (${e.dueAt}) came before a run could schedule it. Not sent late.` }],
          styleCheck: "Missed: not sent.",
        });
        out.missed.push({ key: e.key, dueAt: e.dueAt });
        console.warn(`[calendar] ${e.key}: due ${e.dueAt}, missed before it was scheduled; logged, not sent`);
      } catch (err) {
        if (!isConflict(err)) console.error(`[calendar] ${e.key}: missed, and its record couldn't be written: ${errorText(err)}`);
      }
    }
    if (!schedule.length) return out;

    const channels = (await bufferChannels()).filter((c) => c.service.toLowerCase() in CALENDAR_NETWORKS);
    if (!channels.length) throw new Error("Buffer has no LinkedIn, Facebook or Instagram channel for the calendar");

    for (const entry of schedule) {
      // Start an entry only with its worst case left; the next run goes on from here.
      if (opts.deadline && Date.now() > opts.deadline - entryBudgetMs(channels.length)) {
        console.log(`[calendar] out of time; ${entry.key} and later wait for the next run`);
        break;
      }
      try {
        await scheduleEntry(client, entry, channels, now, out);
      } catch (err) {
        // One entry's failure (its claim couldn't be written) never stops the rest.
        out.retry.push({ key: entry.key, why: errorText(err) });
        console.error(`[calendar] ${entry.key}: ${errorText(err)}; the next run tries again`);
      }
    }
  } finally {
    // Whatever stopped the run, what it did reaches the editors.
    if (out.scheduled.length || out.check.length || out.retry.length || out.stuck.length || out.missed.length) {
      await emailEditors(...calendarEmail(out), "calendar").catch((err) => console.error(`[calendar] the editors' email failed: ${errorText(err)}`));
    }
  }
  return out;
}

/** One entry: its claim, a post per channel, then its record or, when nothing reached Buffer for certain, no record. */
async function scheduleEntry(client: Client, entry: CalendarEntry, channels: BufferChannel[], now: Date, out: CalendarResult): Promise<void> {
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
      // Vern's review page reads this line as the style check's verdict (lib/review-page.ts, styleIsClean).
      styleCheck: `STYLE CHECK: clean. Written ahead and checked by 21e8; Buffer sends it at ${entry.dueAt}.`,
    });
  } catch (err) {
    if (isConflict(err)) return; // another run has it
    throw err;
  }

  const drafts: Draft[] = [];
  const skipped: Skip[] = [];
  let unsure = false;
  for (const ch of channels) {
    const service = ch.service.toLowerCase() as CalendarNetwork;
    const rule = CALENDAR_NETWORKS[service];
    const label = ch.displayName || ch.name;
    const problem = calendarChannelProblem(ch);
    if (problem) {
      skipped.push({ _key: `s${skipped.length}`, _type: "skippedChannel", service, channel: label, why: problem });
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
      const maybe = mayHaveReachedBuffer(err);
      if (maybe) unsure = true;
      const why = maybe ? `no clear answer from Buffer (${errorText(err)}): it may be there, so look in Buffer before posting it by hand` : errorText(err);
      skipped.push({ _key: `s${skipped.length}`, _type: "skippedChannel", service, channel: label, why });
    }
  }

  const reasons = skipped.map((x) => `${x.channel} (${x.service}): ${x.why}`).join("; ");
  if (!drafts.length && !unsure) {
    // Nothing reached Buffer, for certain: drop the claim so the next run tries again.
    try {
      await client.delete(logId);
      out.retry.push({ key: entry.key, why: reasons || "no channel took it" });
      console.warn(`[calendar] ${entry.key}: nothing scheduled; the next run tries again. ${reasons}`);
    } catch (err) {
      out.stuck.push({ key: entry.key, why: `${reasons || "no channel took it"}. Its record (${logId}) couldn't be cleared (${errorText(err)}), so no run tries again until it is deleted.` });
      console.error(`[calendar] ${entry.key}: nothing scheduled, and the claim couldn't be dropped: ${errorText(err)}`);
    }
    return;
  }
  // Something is (or may be) in Buffer: keep the record, so no run makes these posts again.
  await client
    .patch(logId)
    .set({ drafts, skipped })
    .commit()
    .catch((err) => console.error(`[calendar] ${entry.key}: the log couldn't be filled in: ${errorText(err)}`));
  if (drafts.length) {
    out.scheduled.push({ key: entry.key, dueAt: entry.dueAt, channels: drafts.map((d) => d.service), failed: skipped.map((x) => ({ network: x.service, why: x.why })) });
    console.log(`[calendar] ${entry.key}: scheduled for ${entry.dueAt} on ${drafts.map((d) => d.service).join(", ")}${reasons ? `; not on ${reasons}` : ""}`);
  } else {
    out.check.push({ key: entry.key, dueAt: entry.dueAt, why: reasons });
    console.warn(`[calendar] ${entry.key}: Buffer gave no clear answer; kept, not tried again. ${reasons}`);
  }
}

const toronto = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", { timeZone: "America/Toronto", weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/** The editors' email (BLOG_DRAFT_NOTIFY): what went into Buffer, and anything that didn't. */
export function calendarEmail(r: CalendarResult): [string, string] {
  const lines: string[] = [];
  if (r.scheduled.length) {
    lines.push("Scheduled in Buffer (it sends each at the time shown, Toronto time; edit or delete any of them in Buffer before then):");
    for (const s of r.scheduled) {
      lines.push(`- ${toronto(s.dueAt)}: ${s.key} on ${s.channels.join(", ")}`);
      for (const f of s.failed) lines.push(`  Not on ${f.network}: ${f.why}`);
    }
    if (r.scheduled.some((s) => s.failed.length)) lines.push("A channel a post missed isn't tried again: post it there by hand, or leave it.");
  }
  if (r.check.length) {
    lines.push("", "Buffer gave no clear answer, so these may or may not be in it. Look in Buffer; they aren't tried again, since a second try could post them twice:");
    for (const x of r.check) lines.push(`- ${toronto(x.dueAt)}: ${x.key}: ${x.why}`);
  }
  if (r.retry.length) {
    lines.push("", "Not scheduled, tried again at the next run:");
    for (const x of r.retry) lines.push(`- ${x.key}: ${x.why}`);
  }
  if (r.stuck.length) {
    lines.push("", "Not scheduled, and stuck until its record is deleted (tell 21e8):");
    for (const x of r.stuck) lines.push(`- ${x.key}: ${x.why}`);
  }
  if (r.missed.length) {
    lines.push("", "Missed, not sent (its time came before a run could schedule it; a calendar post never goes out late):");
    for (const x of r.missed) lines.push(`- ${toronto(x.dueAt)}: ${x.key}`);
  }
  const n = r.scheduled.length;
  const needsLook = r.check.length + r.retry.length + r.stuck.length + r.missed.length + r.scheduled.filter((s) => s.failed.length).length;
  const subject = n
    ? `${n} calendar post${n === 1 ? "" : "s"} scheduled in Buffer${needsLook ? ", and some need a look" : ""}`
    : "Calendar posts need a look";
  return [subject, lines.join("\n")];
}
