/**
 * `npm run test:leads`: the forms' counts by day (lib/lead-counts.ts) and
 * where the site writes and reads them. No network: the Sanity client is a
 * real one pointed at nothing, used only to build the mutations, and a stand-in
 * that records calls.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient, type SanityClient } from "@sanity/client";
import {
  FORM_FIELDS,
  LEAD_DAYS_QUERY,
  addDays,
  addToLeadCount,
  countTransaction,
  countingOn,
  emptyLeadDay,
  isCountedForm,
  leadDay,
  leadDayId,
  logLeadSummary,
  summarize,
  type LeadDayDoc,
} from "../lib/lead-counts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

let failures = 0;
async function check(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`  ok    ${name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${name}\n        ${err instanceof Error ? err.message : err}`);
  }
}

const offline = createClient({ projectId: "test1234", dataset: "test", apiVersion: "2024-01-01", useCdn: false });

async function main() {
  console.log("lead-counts");

  await check("a day is Toronto's calendar day, either side of midnight and of the clock change", () => {
    assert.equal(leadDay(new Date("2026-10-27T03:59:59Z")), "2026-10-26"); // 23:59:59 EDT
    assert.equal(leadDay(new Date("2026-10-27T04:00:00Z")), "2026-10-27"); // 00:00 EDT
    assert.equal(leadDay(new Date("2026-11-02T04:30:00Z")), "2026-11-01"); // 23:30 EST, after 1 Nov
    assert.equal(leadDay(new Date("2026-11-02T05:00:00Z")), "2026-11-02");
    assert.equal(leadDay(new Date("2027-01-01T04:59:00Z")), "2026-12-31");
  });

  await check("days add across months and years", () => {
    assert.equal(addDays("2026-10-31", 1), "2026-11-01");
    assert.equal(addDays("2026-11-01", -1), "2026-10-31");
    assert.equal(addDays("2027-01-01", -14), "2026-12-18");
    assert.equal(addDays("2026-03-08", 1), "2026-03-09");
  });

  await check("the id has a dot, so a public dataset never serves it", () => {
    assert.equal(leadDayId("2026-10-27"), "leads.2026-10-27");
    assert.ok(leadDayId("2026-10-27").includes("."));
    assert.match(LEAD_DAYS_QUERY, /_id in path\("leads\.\*"\)/);
  });

  await check("the four forms the route takes, and nothing else, are counted", () => {
    const route = read("app/api/contact/route.ts");
    const types = route.match(/const FORM_TYPES = \[([^\]]+)\]/)?.[1] ?? "";
    const forms = [...types.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual([...forms].sort(), Object.keys(FORM_FIELDS).sort());
    for (const f of forms) assert.ok(isCountedForm(f), f);
    assert.equal(isCountedForm("unknown"), false);
    assert.equal(isCountedForm("__proto__"), false);
    assert.equal(isCountedForm("toString"), false);
  });

  await check("one count is one transaction: the day if new, the field if missing, then +1", () => {
    const at = new Date("2026-10-26T18:36:48Z");
    const mutations = countTransaction(offline, "lunch-learn", "delivered", at).serialize();
    assert.equal(mutations.length, 4);
    assert.deepEqual(mutations[0], { createIfNotExists: emptyLeadDay("2026-10-26") });
    assert.deepEqual(mutations[1], { patch: { id: "leads.2026-10-26", setIfMissing: { lunchLearn: {} } } });
    assert.deepEqual(mutations[2], { patch: { id: "leads.2026-10-26", setIfMissing: { "lunchLearn.delivered": 0 } } });
    assert.deepEqual(mutations[3], {
      patch: { id: "leads.2026-10-26", inc: { "lunchLearn.delivered": 1 }, set: { updatedAt: "2026-10-26T18:36:48.000Z" } },
    });
  });

  await check("a new day starts with every count at zero", () => {
    const doc = emptyLeadDay("2026-10-27");
    assert.equal(doc._id, "leads.2026-10-27");
    assert.equal(doc._type, "leadDay");
    assert.equal(doc.date, "2026-10-27");
    for (const field of Object.values(FORM_FIELDS)) {
      assert.deepEqual(doc[field], { delivered: 0, held: 0, failed: 0 }, field);
    }
  });

  await check("a count that fails never throws, and its log line names no one", async () => {
    const lines: string[] = [];
    const error = console.error;
    console.error = (...a: unknown[]) => lines.push(a.join(" "));
    try {
      const broken = {
        transaction: () => {
          const t = offline.transaction();
          (t as unknown as { commit: () => Promise<never> }).commit = () => Promise.reject(new Error("Sanity said no"));
          return t;
        },
      } as unknown as SanityClient;
      await addToLeadCount(broken, "contact", "held", new Date("2026-10-26T12:00:00Z"));
      await addToLeadCount(broken, "not-a-form", "held");
    } finally {
      console.error = error;
    }
    assert.deepEqual(lines, ["[leads] count failed: Sanity said no"]);
  });

  await check("counting is on in production with a token, from the runtime's VERCEL_ENV or the build's", () => {
    const keep = { ...process.env };
    try {
      process.env.SANITY_API_WRITE_TOKEN = "t";
      process.env.VERCEL_ENV = "production";
      delete process.env.NEXT_PUBLIC_VERCEL_ENV;
      assert.equal(countingOn(), true);
      delete process.env.VERCEL_ENV;
      process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
      assert.equal(countingOn(), true, "the build's value when the runtime has none");
      process.env.VERCEL_ENV = "preview";
      assert.equal(countingOn(), false, "a preview never counts");
      delete process.env.VERCEL_ENV;
      delete process.env.NEXT_PUBLIC_VERCEL_ENV;
      assert.equal(countingOn(), false, "a laptop never counts");
      process.env.VERCEL_ENV = "production";
      delete process.env.SANITY_API_WRITE_TOKEN;
      assert.equal(countingOn(), false, "no token, no count");
    } finally {
      for (const k of ["SANITY_API_WRITE_TOKEN", "VERCEL_ENV", "NEXT_PUBLIC_VERCEL_ENV"]) {
        if (keep[k] === undefined) delete process.env[k];
        else process.env[k] = keep[k];
      }
    }
  });

  await check("the weeks add up by form, and say when a week was not all counted", () => {
    const docs: LeadDayDoc[] = [
      { date: "2026-11-01", contact: { delivered: 1, held: 2, failed: 0 }, cataloguePrint: { held: 1 } },
      { date: "2026-11-08", contact: { delivered: 2 }, lunchLearn: { delivered: 1 }, newsletter: null },
      { date: "2026-11-09", contact: { held: 3 } },
      { date: "2026-11-16", contact: { delivered: 9 } }, // today: not in the weeks
    ];
    // Monday 16 Nov 2026, 16:00 UTC (11:00 in Toronto): the Monday report's hour.
    const s = summarize(docs, "2026-10-28", new Date("2026-11-16T16:00:00Z"), false);
    assert.equal(s.timezone, "America/Toronto");
    assert.deepEqual([s.last7.from, s.last7.to], ["2026-11-09", "2026-11-15"]);
    assert.deepEqual([s.prior7.from, s.prior7.to], ["2026-11-02", "2026-11-08"]);
    assert.deepEqual([s.last7.delivered, s.last7.held, s.last7.failed], [0, 3, 0]);
    assert.deepEqual([s.prior7.delivered, s.prior7.held], [3, 0]);
    assert.deepEqual(s.prior7.byForm.contact, { delivered: 2, held: 0, failed: 0 });
    assert.deepEqual(s.prior7.byForm["lunch-learn"], { delivered: 1, held: 0, failed: 0 });
    assert.equal(s.last7.complete, true);
    assert.equal(s.prior7.complete, true);
    assert.equal(s.today.delivered, 9);
    assert.match(s.ga4, /not set/);
    assert.equal(s.counting, "on");
    assert.match(summarize(docs, "2026-10-28", new Date("2026-11-16T16:00:00Z"), true, false).counting, /^OFF/);
    const early = summarize(docs, "2026-11-05", new Date("2026-11-16T16:00:00Z"), true);
    assert.equal(early.prior7.complete, false);
    assert.equal(early.last7.complete, true);
    assert.doesNotMatch(early.ga4, /not set/);
    assert.equal(summarize([], null, new Date("2026-11-16T16:00:00Z"), true).last7.complete, false);
  });

  await check("the daily step marks today, reads two weeks and logs one [leads] line", async () => {
    const calls: { op: string; args: unknown[] }[] = [];
    const stub = {
      createIfNotExists: (...args: unknown[]) => {
        calls.push({ op: "createIfNotExists", args });
        return Promise.resolve({});
      },
      fetch: (...args: unknown[]) => {
        calls.push({ op: "fetch", args });
        return Promise.resolve({ first: "2026-10-27", days: [{ date: "2026-10-28", contact: { delivered: 1 } }] });
      },
    } as unknown as SanityClient;
    const lines: string[] = [];
    const info = console.info;
    console.info = (...a: unknown[]) => lines.push(a.join(" "));
    let summary;
    try {
      summary = await logLeadSummary(stub, new Date("2026-11-02T14:00:00Z"), true, true);
    } finally {
      console.info = info;
    }
    assert.deepEqual(calls[0], { op: "createIfNotExists", args: [emptyLeadDay("2026-11-02"), { visibility: "async" }] });
    assert.equal(calls[1].op, "fetch");
    assert.deepEqual(calls[1].args[1], { from: "2026-10-19" });
    assert.equal(lines.length, 1);
    assert.ok(lines[0].startsWith("[leads] {"), lines[0]);
    const logged = JSON.parse(lines[0].slice("[leads] ".length));
    assert.deepEqual(logged, JSON.parse(JSON.stringify(summary)));
    assert.equal(logged.last7.delivered, 1);
    assert.ok(lines[0].length < 4000, `the line is ${lines[0].length} characters`);
  });

  await check("the route counts delivered, held and failed, in production only, after the response", () => {
    const route = read("app/api/contact/route.ts");
    assert.match(route, /countOutcome\(body\.formType, hold \? "held" : "delivered"\)/);
    assert.match(route, /countOutcome\(body\.formType, "failed"\)/);
    assert.match(route, /if \(!countingOn\(\)\) return;/);
    assert.match(route, /after\(\(\) => addToLeadCount\(/);
    // Never for blocked or rejected requests: no count before the mail is sent.
    const firstCount = route.indexOf("countOutcome(body.formType");
    assert.ok(firstCount > route.indexOf("resend.emails.send("), "counts come after the send");
  });

  await check("the daily run logs the summary first, and a failure there doesn't fail the run", () => {
    const run = read("app/api/cron/social-drafts/route.ts");
    const step = run.indexOf("logLeadSummary(");
    assert.ok(step > 0, "logLeadSummary is called");
    assert.ok(step < run.indexOf("publishDueDrafts(client"), "before the blog step");
    const block = run.slice(step, run.indexOf("// 1. The blog"));
    assert.doesNotMatch(block, /failed = true/);
    assert.doesNotMatch(block, /emailEditors|notifyRunFailure/);
    assert.match(block, /maxRetries: 0/, "no retries, so a Sanity outage can't eat the run's time");
    const crons = JSON.parse(read("vercel.json")).crons as { path: string }[];
    assert.equal(crons.length, 2, "the site's crons stay at two");
  });

  if (failures) {
    console.log(`\n${failures} failed`);
    process.exit(1);
  }
  console.log("\nall passed");
}

main();
