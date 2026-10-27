/**
 * The forms' counts by day (weekly leads report of 26 Oct 2026, item 1b).
 *
 * Until now the only count of real leads was the Vercel log, one
 * `[contact]` line per request (app/api/contact/route.ts), and a search of
 * it times out over a week (often over a day): the 26 Oct report could not
 * count the week at all. So the route also adds one to a count per day, in
 * Sanity, for every message that went to an inbox or was meant to:
 *  - delivered: to the office (info@hubss.com). The real leads.
 *  - held: screened (spam, a bot, the honeypot) and sent to Vern marked
 *    [Screened]. Never a lead.
 *  - failed: the mail service refused it and the visitor saw an error.
 * Blocked and rejected requests (scripts, bad requests) stay in the log only.
 *
 * One document per day, a calendar day in Toronto (HUB's office):
 *   { _id: "leads.2026-10-27", _type: "leadDay", date: "2026-10-27",
 *     contact: { delivered, held, failed }, lunchLearn: {...},
 *     cataloguePrint: {...}, newsletter: {...}, updatedAt }
 * The dot in the id keeps it private: a public dataset serves only ids
 * without one, so the counts need a token to read and are never in the
 * public API or its export. Studio has no schema for them, so they never
 * show there either. A day that has a document and no count was counted and
 * had none; a day without one was not counted. The daily cron writes each
 * day's document at the start of the day, so from the first run on there is
 * one for every day.
 *
 * Reading them:
 *  - The daily run (app/api/cron/social-drafts, 14:00 UTC, its first step)
 *    logs one line, `[leads] {...}`: the last 7 complete days and the 7
 *    before, by form, today so far, and whether delivered leads reach GA4.
 *    In Vercel: Logs, search "[leads]". The Monday report reads that line.
 *    It runs inside the daily job, not as a cron of its own: the site's
 *    crons stay at two.
 *  - `npm run leads` on a PC with a Sanity token in .env.local: day by day.
 *
 * Pure apart from the client calls, so `npm run test:leads` runs it offline.
 */
import type { SanityClient } from "@sanity/client";

export const LEAD_DAY_TYPE = "leadDay";
export const LEAD_TIMEZONE = "America/Toronto";

export const COUNTED_OUTCOMES = ["delivered", "held", "failed"] as const;
export type CountedOutcome = (typeof COUNTED_OUTCOMES)[number];

/** The route's form names (FORM_TYPES), and their field in a day's document. */
export const FORM_FIELDS = {
  contact: "contact",
  "lunch-learn": "lunchLearn",
  "catalogue-print": "cataloguePrint",
  newsletter: "newsletter",
} as const;
export type CountedForm = keyof typeof FORM_FIELDS;
type FormField = (typeof FORM_FIELDS)[CountedForm];

export type Counts = Record<CountedOutcome, number>;

export type LeadDayDoc = {
  _id?: string;
  _type?: string;
  date: string;
  updatedAt?: string;
} & Partial<Record<FormField, Partial<Counts> | null>>;

const FORMS = Object.keys(FORM_FIELDS) as CountedForm[];

const zero = (): Counts => ({ delivered: 0, held: 0, failed: 0 });

export function isCountedForm(form: string): form is CountedForm {
  return Object.prototype.hasOwnProperty.call(FORM_FIELDS, form);
}

/** The calendar day in Toronto at `at`: "2026-10-27". */
export function leadDay(at: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: LEAD_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(at);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** `day` moved by `n` calendar days. */
export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** The day's document id. The dot makes it private (see the top of the file). */
export function leadDayId(day: string): string {
  return `leads.${day}`;
}

/** A day's document as first written: every count at zero. */
export function emptyLeadDay(day: string) {
  return {
    _id: leadDayId(day),
    _type: LEAD_DAY_TYPE,
    date: day,
    contact: zero(),
    lunchLearn: zero(),
    cataloguePrint: zero(),
    newsletter: zero(),
  };
}

/**
 * One more `outcome` for `form` on the day of `at`, as one transaction: the
 * day's document if there isn't one yet, the form's count if it's missing,
 * then the increment. Sanity applies a transaction whole and its inc is
 * atomic, so two messages in the same second both count.
 */
export function countTransaction(client: SanityClient, form: CountedForm, outcome: CountedOutcome, at: Date) {
  const day = leadDay(at);
  const id = leadDayId(day);
  const field = FORM_FIELDS[form];
  const path = `${field}.${outcome}`;
  return client
    .transaction()
    .createIfNotExists(emptyLeadDay(day))
    .patch(id, (p) => p.setIfMissing({ [field]: {} }))
    .patch(id, (p) => p.setIfMissing({ [path]: 0 }))
    .patch(id, (p) => p.inc({ [path]: 1 }).set({ updatedAt: at.toISOString() }));
}

/**
 * Counts one message, for the route (through after(), once the visitor has
 * the response). Never throws: a count that fails is one `[leads] count
 * failed` line with no personal details, and the message itself has gone.
 */
export async function addToLeadCount(
  client: SanityClient,
  form: string,
  outcome: CountedOutcome,
  at: Date = new Date()
): Promise<void> {
  if (!isCountedForm(form)) return;
  try {
    await countTransaction(client, form, outcome, at).commit({ visibility: "async", returnDocuments: false });
  } catch (err) {
    console.error(`[leads] count failed: ${err instanceof Error ? err.message.slice(0, 160) : "unknown error"}`);
  }
}

/** What the daily run reads: the first day counted, and the days from `$from` on. */
export const LEAD_DAYS_QUERY = `{
  "first": *[_type == "${LEAD_DAY_TYPE}" && _id in path("leads.*")] | order(date asc)[0].date,
  "days": *[_type == "${LEAD_DAY_TYPE}" && _id in path("leads.*") && date >= $from] | order(date asc){
    date, contact, lunchLearn, cataloguePrint, newsletter
  }
}`;

export interface PeriodTotals {
  from: string;
  to: string;
  /** False when counting began after `from`: some of its days were not counted. */
  complete: boolean;
  delivered: number;
  held: number;
  failed: number;
  byForm: Record<CountedForm, Counts>;
}

export interface LeadSummary {
  timezone: string;
  /** The first day counted, or null before the first count. */
  countingSince: string | null;
  /** The 7 complete days to yesterday. */
  last7: PeriodTotals;
  /** The 7 days before those. */
  prior7: PeriodTotals;
  /** Today so far. */
  today: PeriodTotals;
  /** Whether delivered leads reach GA4 as generate_lead (lib/ga4-lead.ts). */
  ga4: string;
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

function totals(docs: LeadDayDoc[], from: string, to: string, countingSince: string | null): PeriodTotals {
  const byForm = Object.fromEntries(FORMS.map((f) => [f, zero()])) as Record<CountedForm, Counts>;
  for (const doc of docs) {
    if (doc.date < from || doc.date > to) continue;
    for (const form of FORMS) {
      const counts = doc[FORM_FIELDS[form]];
      for (const outcome of COUNTED_OUTCOMES) byForm[form][outcome] += num(counts?.[outcome]);
    }
  }
  const sum = (outcome: CountedOutcome) => FORMS.reduce((n, f) => n + byForm[f][outcome], 0);
  return {
    from,
    to,
    complete: countingSince !== null && countingSince <= from,
    delivered: sum("delivered"),
    held: sum("held"),
    failed: sum("failed"),
    byForm,
  };
}

/** The daily run's summary of the counts, as of `now`. */
export function summarize(
  docs: LeadDayDoc[],
  countingSince: string | null,
  now: Date,
  ga4SecretSet: boolean
): LeadSummary {
  const today = leadDay(now);
  const yesterday = addDays(today, -1);
  return {
    timezone: LEAD_TIMEZONE,
    countingSince,
    last7: totals(docs, addDays(yesterday, -6), yesterday, countingSince),
    prior7: totals(docs, addDays(yesterday, -13), addDays(yesterday, -7), countingSince),
    today: totals(docs, today, today, countingSince),
    ga4: ga4SecretSet
      ? "delivered leads are sent to GA4 as generate_lead"
      : "GA4_API_SECRET is not set: delivered leads are not reaching GA4",
  };
}

/**
 * The daily run's step (app/api/cron/social-drafts): marks today as counted
 * (its document, at zero, if no message has made it yet), reads the last
 * fifteen days and logs the summary as one `[leads]` line, no personal
 * details. Throws on a Sanity error; the run logs it and carries on.
 */
export async function logLeadSummary(client: SanityClient, now: Date, ga4SecretSet: boolean): Promise<LeadSummary> {
  const today = leadDay(now);
  await client.createIfNotExists(emptyLeadDay(today), { visibility: "async" });
  const { first, days } = await client.fetch<{ first: string | null; days: LeadDayDoc[] }>(LEAD_DAYS_QUERY, {
    from: addDays(today, -14),
  });
  const summary = summarize(days ?? [], first ?? null, now, ga4SecretSet);
  console.info(`[leads] ${JSON.stringify(summary)}`);
  return summary;
}
