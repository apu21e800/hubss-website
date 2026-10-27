/**
 * `npm run leads`: the forms' counts, day by day (lib/lead-counts.ts). Read
 * only. The counts are private documents, so this reads with a Sanity token
 * from .env.local (SANITY_API_READ_TOKEN, else SANITY_API_WRITE_TOKEN), on
 * Vern's PC; the cloud sessions read the daily `[leads]` log line instead.
 *
 *   npm run leads           # the last 14 days, then the two weeks' totals
 *   npm run leads -- 30     # the last 30 days
 *
 * delivered = to the office (the real leads); held = screened, to Vern
 * marked [Screened] (never a lead); failed = the mail service refused it and
 * the visitor saw an error. A day with no row was not counted (before the
 * counts began); a row of zeros is a day with no message.
 */
import { createClient } from "@sanity/client";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";
import {
  COUNTED_OUTCOMES,
  FORM_FIELDS,
  LEAD_DAYS_QUERY,
  addDays,
  leadDay,
  summarize,
  type CountedForm,
  type LeadDayDoc,
} from "../lib/lead-counts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(root, ".env.local"), quiet: true });

const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("No Sanity token: add SANITY_API_READ_TOKEN (or SANITY_API_WRITE_TOKEN) to .env.local. The counts are private.");
  process.exit(1);
}

const span = Math.max(1, Math.min(366, Number(process.argv[2]) || 14));
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "raw",
  token,
});

const FORMS = Object.keys(FORM_FIELDS) as CountedForm[];
const cell = (doc: LeadDayDoc, form: CountedForm) =>
  COUNTED_OUTCOMES.map((o) => {
    const v = doc[FORM_FIELDS[form]]?.[o];
    return typeof v === "number" ? v : 0;
  }).join("/");

async function main() {
  const now = new Date();
  const today = leadDay(now);
  const from = addDays(today, -(span - 1));
  const { first, days } = await client.fetch<{ first: string | null; days: LeadDayDoc[] }>(LEAD_DAYS_QUERY, { from });
  console.log(`Form messages by day (Toronto), ${from} to ${today}. Each cell: delivered/held/failed.`);
  console.log(first ? `Counting since ${first}.` : "Nothing counted yet: the counts begin with the first message or daily run after the change goes live.");
  console.log(["date      ", ...FORMS.map((f) => f.padEnd(15))].join("  "));
  for (const doc of days ?? []) {
    console.log([doc.date.padEnd(10), ...FORMS.map((f) => cell(doc, f).padEnd(15))].join("  "));
  }
  const s = summarize(days ?? [], first ?? null, now, true);
  const line = (label: string, t: typeof s.last7) =>
    `${label} ${t.from} to ${t.to}: delivered ${t.delivered}, held ${t.held}, failed ${t.failed}${t.complete ? "" : " (not every day counted)"}`;
  console.log("");
  console.log(line("Last 7 days ", s.last7));
  console.log(line("7 days before", s.prior7));
  console.log(line("Today so far ", s.today));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
