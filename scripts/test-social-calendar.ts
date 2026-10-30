/**
 * Tests for the calendar of posts written ahead (lib/social-calendar.ts and
 * lib/social-calendar-data.ts): part of `npm run test:social`. No network.
 *
 * What they protect: every post reads like the rest of HUB's social copy
 * (the house lint, the social writer's channel limits, one ask, the 60-minute
 * Lunch & Learn), links to its own article with its network's tags, carries a
 * public photo with a description, goes out on a Monday or Friday at 11:00
 * Toronto (Buffer's queue slots are Tuesdays and Thursdays), and is scheduled
 * once, never late.
 */
import assert from "node:assert/strict";
import { CALENDAR } from "../lib/social-calendar-data";
import { calendarDue, calendarEmail, calendarLink, calendarText, LEAD_MS, type CalendarNetwork } from "../lib/social-calendar";
import { lintCopy } from "../lib/style-lint";

let failures = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok    ${name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${name}\n        ${err instanceof Error ? err.message : err}`);
  }
}

const NETS: CalendarNetwork[] = ["linkedin", "facebook", "instagram"];
const LIMITS: Record<CalendarNetwork, [number, number]> = { linkedin: [500, 1100], facebook: [250, 600], instagram: [400, 1000] };
const HASHTAGS: Record<CalendarNetwork, [number, number]> = { linkedin: [0, 3], facebook: [0, 2], instagram: [8, 12] };
const hashtags = (t: string) => t.match(/(^|\s)#[\p{L}\p{N}_]+/gu)?.length ?? 0;

console.log("The calendar's entries");
check("every key is unique, and each links to its own article", () => {
  assert.equal(new Set(CALENDAR.map((e) => e.key)).size, CALENDAR.length);
  for (const e of CALENDAR) assert.equal(e.pageUrl, `https://hubss.com/blog/${e.key}`, e.key);
});
check("every post goes out on a Monday or Friday at 11:00 Toronto, one a day, in order", () => {
  let last = 0;
  const days = new Set<string>();
  for (const e of CALENDAR) {
    assert.match(e.dueAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, e.key);
    const t = Date.parse(e.dueAt);
    assert.ok(t > last, `${e.key} is out of order`);
    last = t;
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit" })
        .formatToParts(new Date(t))
        .map((p) => [p.type, p.value])
    );
    assert.ok(["Mon", "Fri"].includes(parts.weekday), `${e.key}: ${parts.weekday}`);
    assert.equal(`${parts.hour}:${parts.minute}`, "11:00", e.key);
    const day = `${parts.year}-${parts.month}-${parts.day}`;
    assert.ok(!days.has(day), `two posts on ${day}`);
    days.add(day);
  }
});
check("every photo is on Sanity's CDN and has a description", () => {
  for (const e of CALENDAR) {
    assert.match(e.image, /^https:\/\/cdn\.sanity\.io\/images\/9dbro2m1\/production\/[0-9a-f]{40}-\d+x\d+\.(jpg|png|webp)$/, e.key);
    assert.ok(e.imageAlt.length > 20 && e.imageAlt.length <= 200, `${e.key}: alt length ${e.imageAlt.length}`);
  }
});

console.log("The copy");
for (const e of CALENDAR) {
  check(`${e.key}: channel limits, one link, one ask`, () => {
    for (const n of NETS) {
      const raw = e.copy[n];
      const text = calendarText(e, n);
      const [min, max] = LIMITS[n];
      assert.ok(text.length >= min && text.length <= max, `${n}: ${text.length} characters (${min} to ${max})`);
      const [hmin, hmax] = HASHTAGS[n];
      const h = hashtags(text);
      assert.ok(h >= hmin && h <= hmax, `${n}: ${h} hashtags (${hmin} to ${hmax})`);
      assert.match(text, /60-minute Lunch & Learn/, `${n}: the ask`);
      assert.doesNotMatch(text, /45-minute|—|\bvs\.?\b|!|\bfree\b/i, `${n}: a word the house never uses`);
      if (n === "instagram") {
        assert.doesNotMatch(raw, /\{link\}|https?:/, "instagram: no link");
        assert.match(raw, /Link in bio/, "instagram: Link in bio");
        assert.match(raw.trim().split("\n").pop() ?? "", /^(#[\p{L}\p{N}_]+\s?)+$/u, "instagram: the hashtags on their own last line");
      } else {
        assert.equal(raw.split("{link}").length - 1, 1, `${n}: one {link}`);
        assert.ok(text.includes(calendarLink(e, n)), `${n}: its own tagged link`);
      }
    }
  });
  check(`${e.key}: the house lint is clean`, () => {
    for (const n of NETS) {
      // Hashtags are names, not prose: the lint reads the words before them.
      const prose = calendarText(e, n).replace(/(^|\s)#[\p{L}\p{N}_]+/gu, "$1");
      const issues = lintCopy(prose, { contact: true });
      assert.equal(issues.length, 0, `${n}: ${issues.map((i) => `${i.rule}: ${i.message} (${i.excerpt})`).join("; ")}`);
    }
  });
}

console.log("Scheduling");
const first = CALENDAR[0];
const before = new Date(Date.parse(first.dueAt) - 3 * LEAD_MS);
check("before the first post, everything within the horizon is scheduled, earliest first", () => {
  const { schedule, late } = calendarDue(CALENDAR, new Set(), before);
  assert.equal(late.length, 0);
  assert.equal(schedule[0].key, first.key);
  assert.ok(schedule.length >= 10, `only ${schedule.length}`);
});
check("an entry already logged is never scheduled again", () => {
  const { schedule } = calendarDue(CALENDAR, new Set([first.key]), before);
  assert.ok(!schedule.some((e) => e.key === first.key));
});
check("an entry whose time is too close or past is late, never sent", () => {
  const close = new Date(Date.parse(first.dueAt) - LEAD_MS / 2);
  const { schedule, late } = calendarDue(CALENDAR, new Set(), close);
  assert.ok(late.some((e) => e.key === first.key));
  assert.ok(!schedule.some((e) => e.key === first.key));
});
check("Instagram's text is the copy as written; the others get their tagged link", () => {
  assert.equal(calendarText(first, "instagram"), first.copy.instagram);
  assert.match(calendarText(first, "linkedin"), /utm_source=linkedin&utm_medium=social&utm_campaign=archive&utm_content=/);
});
check("the editors' email lists what was scheduled and what wasn't", () => {
  const [subject, body] = calendarEmail({ scheduled: [{ key: first.key, dueAt: first.dueAt, channels: ["linkedin", "facebook"], failed: ["instagram"] }], late: [], retry: [{ key: "x", why: "no channel took it" }] });
  assert.equal(subject, "1 calendar post scheduled in Buffer");
  assert.match(body, new RegExp(first.key));
  assert.match(body, /not on instagram/);
  assert.match(body, /tried again at the next run/);
});

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nAll calendar tests passed");
