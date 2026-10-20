/**
 * `npm run test:ga4`: the lead the server sends GA4 for a delivered message
 * (lib/ga4-lead.ts), the GA ids the forms read from the tag's cookies
 * (lib/post-form.ts) and the route's check of them. No network: the sender
 * runs against a stand-in fetch.
 *
 * `npm run test:ga4 -- --live` also posts built events to GA4's validation
 * server (/debug/mp/collect: it checks the shape, not the secret, and records
 * nothing) and fails on anything it flags. Never the real collection address.
 */
import assert from "node:assert/strict";
import {
  GA4_TIMEOUT_MS,
  GA_MEASUREMENT_ID,
  leadEvent,
  readGaIds,
  sendLeadEvent,
  serverClientId,
  type LeadEvent,
} from "../lib/ga4-lead";
import { gaIdsFromCookie } from "../lib/post-form";

const LIVE = process.argv.includes("--live");

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

const CLIENT = "1234567890.1700000000";
const SESSION = "1700000123";
const FIXED_ID = () => "server.0123456789abcdef";
const ALLOWED = ["form_type", "project", "session_id", "lead_attribution", "engagement_time_msec"];

// Everything a form can post: made-up personal details that must never reach
// GA4, and the other fields, which have no place in the event either.
const PERSONAL = {
  name: "Jane Tester",
  email: "jane.tester@example.ca",
  phone: "416-555-0100",
  company: "Town of Example",
  city: "Milton",
  address: "1 Test Street\nMilton ON L9T 0A1",
  message: "Six crosswalks near two schools next spring. Call me on 416-555-0100.",
};
const OTHER = { website: "", format: "In-person", from: "insights" };
const FORMS = [
  { formType: "contact", projectType: "Crosswalk or pedestrian safety", ...PERSONAL, ...OTHER },
  { formType: "lunch-learn", topic: "StreetPrint", ...PERSONAL, ...OTHER },
  { formType: "catalogue-print", ...PERSONAL, ...OTHER },
];

/** Runs `fn` with fetch and the console replaced, and hands back what was logged. */
async function withStubs(fakeFetch: typeof fetch, fn: () => Promise<void>): Promise<string[]> {
  const lines: string[] = [];
  const real = { fetch: globalThis.fetch, info: console.info, error: console.error };
  globalThis.fetch = fakeFetch;
  console.info = (...a: unknown[]) => void lines.push(a.join(" "));
  console.error = (...a: unknown[]) => void lines.push(a.join(" "));
  try {
    await fn();
  } finally {
    globalThis.fetch = real.fetch;
    console.info = real.info;
    console.error = real.error;
  }
  return lines;
}

async function main() {
  console.log("the event");
  await check("the payload GA4 gets for a contact lead with the visitor's ids", () => {
    const event = leadEvent({ formType: "contact", projectType: "Parking lot", ga: { client_id: CLIENT, session_id: SESSION } }, FIXED_ID);
    assert.deepEqual(event, {
      client_id: CLIENT,
      events: [{
        name: "generate_lead",
        params: { form_type: "contact", project: "Parking lot", session_id: SESSION, lead_attribution: "cookie", engagement_time_msec: 1 },
      }],
    });
    assert.deepEqual(JSON.parse(JSON.stringify(event)), event, "no undefined values left in the JSON");
  });
  await check("form_type is what the browser's events have always said", () => {
    assert.equal(leadEvent({ formType: "contact" }).events[0].params.form_type, "contact");
    assert.equal(leadEvent({ formType: "lunch-learn" }).events[0].params.form_type, "lunch-learn");
    assert.equal(leadEvent({ formType: "catalogue-print" }).events[0].params.form_type, "product-book-print");
    assert.equal(leadEvent({ formType: "toString" }).events[0].params.form_type, "toString", "never an object's own machinery");
  });
  await check("project is the Lunch & Learn topic or the contact form's project type; the book request has none", () => {
    assert.equal(leadEvent({ formType: "lunch-learn", topic: "StreetPrint" }).events[0].params.project, "StreetPrint");
    assert.equal(
      leadEvent({ formType: "contact", projectType: "StreetPrint (from the StreetPrint page)" }).events[0].params.project,
      "StreetPrint (from the StreetPrint page)",
    );
    assert.ok(!("project" in leadEvent({ formType: "catalogue-print" }).events[0].params));
    assert.ok(!("project" in leadEvent({ formType: "contact", projectType: "   " }).events[0].params));
  });
  await check("a project carrying an email address or a phone number stays out; a long one is cut to 100", () => {
    for (const v of ["jane@example.ca", "call 416 555 0100", "4165550100"]) {
      assert.ok(!("project" in leadEvent({ formType: "contact", projectType: v }).events[0].params), v);
      assert.ok(!("project" in leadEvent({ formType: "lunch-learn", topic: v }).events[0].params), v);
    }
    assert.equal(leadEvent({ formType: "lunch-learn", topic: "2027 budget season" }).events[0].params.project, "2027 budget season");
    assert.equal(leadEvent({ formType: "lunch-learn", topic: "x".repeat(150) }).events[0].params.project?.length, 100);
  });
  await check("no GA ids: still counted, under server.<16 hex>, lead_attribution none, no session", () => {
    const a = leadEvent({ formType: "contact" });
    const b = leadEvent({ formType: "contact" });
    assert.match(a.client_id, /^server\.[0-9a-f]{16}$/);
    assert.notEqual(a.client_id, b.client_id, "a new id every time");
    assert.match(serverClientId(), /^server\.[0-9a-f]{16}$/);
    assert.deepEqual(a.events[0].params, { form_type: "contact", lead_attribution: "none", engagement_time_msec: 1 });
  });
  await check("a session id without its client id is dropped; a client id alone is kept", () => {
    const orphan = leadEvent({ formType: "contact", ga: { session_id: SESSION } }, FIXED_ID);
    assert.equal(orphan.client_id, "server.0123456789abcdef");
    assert.ok(!("session_id" in orphan.events[0].params));
    assert.equal(orphan.events[0].params.lead_attribution, "none");
    const alone = leadEvent({ formType: "contact", ga: { client_id: CLIENT } });
    assert.equal(alone.client_id, CLIENT);
    assert.ok(!("session_id" in alone.events[0].params));
    assert.equal(alone.events[0].params.lead_attribution, "cookie");
  });
  await check("nothing personal reaches GA4: a whole form body in, only the five params out", () => {
    for (const form of FORMS) {
      for (const ga of [{ client_id: CLIENT, session_id: SESSION }, undefined]) {
        const event = leadEvent({ ...form, ga });
        const keys = Object.keys(event.events[0].params);
        assert.deepEqual(keys.filter((k) => !ALLOWED.includes(k)), [], `${form.formType}: ${keys.join(", ")}`);
        assert.deepEqual(Object.keys(event).sort(), ["client_id", "events"]);
        const json = JSON.stringify(event);
        for (const [field, value] of Object.entries(PERSONAL)) {
          assert.ok(!json.includes(value), `${form.formType} leaked ${field}`);
        }
        for (const part of ["416-555", "example.ca", "Test Street", "Jane", "In-person", "insights"]) {
          assert.ok(!json.includes(part), `${form.formType} leaked ${part}`);
        }
      }
    }
  });

  console.log("the cookies (lib/post-form.ts)");
  await check("_ga, GA1 shape: the client id is the last two parts", () => {
    assert.deepEqual(gaIdsFromCookie(`_ga=GA1.1.${CLIENT}`), { client_id: CLIENT });
    assert.deepEqual(gaIdsFromCookie("_ga=GA1.2.987654321.1699999999"), { client_id: "987654321.1699999999" });
  });
  await check("_ga_<property>, GS1 shape: the session id is the third part", () => {
    assert.deepEqual(gaIdsFromCookie("_ga_7YSFCGRL5E=GS1.1.1700000123.4.1.1700000999.0.0.0"), { session_id: SESSION });
  });
  await check("_ga_<property>, GS2 shape: without the s, up to the first $ (or %24)", () => {
    assert.deepEqual(gaIdsFromCookie("_ga_7YSFCGRL5E=GS2.1.s1700000123$o4$g1$t1700000999$j60$l0$h0"), { session_id: SESSION });
    assert.deepEqual(gaIdsFromCookie("_ga_7YSFCGRL5E=GS2.1.s1700000123%24o4%24g1%24t1700000999"), { session_id: SESSION });
  });
  await check("a real cookie jar: both ids, other cookies and other GA properties ignored", () => {
    const jar = [
      "hubss-theme=mixed",
      `_ga=GA1.1.${CLIENT}`,
      "crisp-client%2Fsession%2Fabc=session_0f1e",
      "_ga_OTHER12345=GS2.1.s1111111111$o1$g0",
      "_ga_7YSFCGRL5E=GS2.1.s1700000123$o4$g1$t1700000999$j60$l0$h0",
    ].join("; ");
    assert.deepEqual(gaIdsFromCookie(jar), { client_id: CLIENT, session_id: SESSION });
    assert.deepEqual(gaIdsFromCookie("_ga_OTHER12345=GS2.1.s1111111111$o1"), {}, "only this site's property counts");
    assert.equal(GA_MEASUREMENT_ID, "G-7YSFCGRL5E");
    assert.deepEqual(gaIdsFromCookie("_ga_ABC=GS1.1.42.1", "G-ABC"), { session_id: "42" });
  });
  await check("missing cookies give nothing", () => {
    assert.deepEqual(gaIdsFromCookie(""), {});
    assert.deepEqual(gaIdsFromCookie("hubss-theme=mixed; other=1"), {});
  });
  await check("garbage gives nothing", () => {
    for (const jar of [
      "_ga=hello",
      "_ga=GA1.1.abc.def",
      "_ga=GA1.1.123",
      "_ga=XX1.1.123.456",
      "_ga=GA1.1.<script>.1700000000",
      "_ga=GA1.1.1234567890.17000000000000000000000",
      "_ga_7YSFCGRL5E=GS2.1.sXYZ$o1",
      "_ga_7YSFCGRL5E=GS2.1.s$o1",
      "_ga_7YSFCGRL5E=GS1",
      "_ga_7YSFCGRL5E=GS1.1.",
      "_ga_7YSFCGRL5E=GS1.1.1700000123x.1",
      "=;;=; _ga; _ga=",
    ]) assert.deepEqual(gaIdsFromCookie(jar), {}, jar);
  });
  await check("the first of two _ga cookies wins", () => {
    assert.deepEqual(gaIdsFromCookie(`_ga=GA1.1.${CLIENT}; _ga=GA1.1.1.2`), { client_id: CLIENT });
  });

  console.log("the route's check (readGaIds)");
  await check("short strings of digits and dots pass", () => {
    assert.deepEqual(readGaIds({ formType: "contact", ga: { client_id: CLIENT, session_id: SESSION } }), { client_id: CLIENT, session_id: SESSION });
    assert.deepEqual(readGaIds({ ga: { session_id: SESSION } }), { session_id: SESSION });
  });
  await check("a missing or malformed ga object is nothing, never an error", () => {
    for (const body of [null, undefined, "text", 42, {}, { ga: null }, { ga: "1.2" }, { ga: [] }, { ga: {} }]) {
      assert.equal(readGaIds(body), undefined, JSON.stringify(body));
    }
  });
  await check("anything but digits and dots is dropped", () => {
    assert.deepEqual(readGaIds({ ga: { client_id: `${CLIENT}<script>`, session_id: SESSION } }), { session_id: SESSION });
    for (const bad of ["abc", "", ".123", "12 34", "1".repeat(41), "jane@example.ca", "1e9", "-1"]) {
      assert.equal(readGaIds({ ga: { client_id: bad, session_id: bad } }), undefined, bad);
    }
    assert.equal(readGaIds({ ga: { client_id: 1234567890.17, session_id: 1700000123 } }), undefined, "numbers are not strings");
    assert.deepEqual(readGaIds({ ga: { client_id: CLIENT, extra: "x", name: "Jane" } }), { client_id: CLIENT });
  });

  console.log("the sender (stand-in fetch)");
  const event = leadEvent({ formType: "contact", projectType: "Parking lot", ga: { client_id: CLIENT, session_id: SESSION } });
  const SECRET = "test-secret-not-real";
  const clean = (lines: string[]) => {
    for (const l of lines) {
      assert.ok(l.startsWith("[contact] ga4 "), l);
      assert.ok(!l.includes(SECRET) && !l.includes("api_secret"), `the secret was logged: ${l}`);
      assert.ok(!l.includes(CLIENT), `an id was logged: ${l}`);
    }
  };
  await check("no secret: nothing is sent, one line says so", async () => {
    let calls = 0;
    const lines = await withStubs((async () => { calls++; return new Response(null, { status: 204 }); }) as typeof fetch, () => sendLeadEvent(event, ""));
    assert.equal(calls, 0);
    assert.deepEqual(lines, ["[contact] ga4 skipped: no secret"]);
  });
  await check("with a secret: one POST to the collection address, the event as its body", async () => {
    const seen: { url: string; init?: RequestInit }[] = [];
    const lines = await withStubs((async (url: string | URL | Request, init?: RequestInit) => {
      seen.push({ url: String(url), init });
      return new Response(null, { status: 204 });
    }) as typeof fetch, () => sendLeadEvent(event, SECRET));
    assert.equal(seen.length, 1);
    assert.equal(seen[0].url, `https://www.google-analytics.com/mp/collect?measurement_id=G-7YSFCGRL5E&api_secret=${SECRET}`);
    assert.equal(seen[0].init?.method, "POST");
    assert.deepEqual(JSON.parse(String(seen[0].init?.body)), event);
    assert.ok(seen[0].init?.signal, "the request can be cut off");
    assert.deepEqual(lines, ["[contact] ga4 sent: contact (cookie)"]);
    clean(lines);
  });
  await check("GA4 refuses: one line, no throw", async () => {
    const lines = await withStubs((async () => new Response("no", { status: 500 })) as typeof fetch, () => sendLeadEvent(event, SECRET));
    assert.deepEqual(lines, ["[contact] ga4 failed: HTTP 500"]);
  });
  await check("the network fails: one line, no throw, no secret in it", async () => {
    const lines = await withStubs((async () => {
      throw new TypeError(`fetch failed for https://www.google-analytics.com/mp/collect?api_secret=${SECRET}`, { cause: { code: "ECONNRESET" } });
    }) as typeof fetch, () => sendLeadEvent(event, SECRET));
    assert.deepEqual(lines, ["[contact] ga4 failed: ECONNRESET"]);
    clean(lines);
  });
  await check(`GA4 never answers: given up at ${GA4_TIMEOUT_MS} ms, one line`, async () => {
    const start = Date.now();
    const lines = await withStubs(((_url: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("This operation was aborted", "AbortError")));
      })) as typeof fetch, () => sendLeadEvent(event, SECRET));
    const took = Date.now() - start;
    assert.ok(took >= GA4_TIMEOUT_MS - 50 && took < GA4_TIMEOUT_MS + 1000, `took ${took} ms`);
    assert.deepEqual(lines, [`[contact] ga4 failed: no answer in ${GA4_TIMEOUT_MS} ms`]);
  });

  if (LIVE) await live();

  if (failures) {
    console.log(`\n${failures} failed`);
    process.exit(1);
  }
  console.log("\nAll passed");
}

/** GA4's validation server: it checks the shape, not the secret, and records nothing. */
async function live() {
  console.log("GA4's validation server (--live)");
  const url = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=test`;
  const validate = async (body: unknown) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    return ((await res.json()) as { validationMessages?: unknown[] }).validationMessages ?? [];
  };
  try {
    await validate({ client_id: CLIENT, events: [] });
  } catch (err) {
    const code = (err as { cause?: { code?: string } }).cause?.code ?? (err instanceof Error ? err.name : "error");
    console.log(`  --    not reachable from here (${code}); the tests above still hold`);
    return;
  }
  const cases: [string, LeadEvent][] = [
    ["contact, with the visitor's ids", leadEvent({ formType: "contact", projectType: "Crosswalk or pedestrian safety", ga: { client_id: CLIENT, session_id: SESSION } })],
    ["Lunch & Learn, with a topic", leadEvent({ formType: "lunch-learn", topic: "StreetPrint", ga: { client_id: CLIENT, session_id: SESSION } })],
    ["printed book, no GA ids (server id)", leadEvent({ formType: "catalogue-print" })],
  ];
  for (const [name, body] of cases) {
    await check(`${name}: no validation messages`, async () => {
      const messages = await validate(body);
      console.log(`        validationMessages: ${JSON.stringify(messages)}`);
      assert.deepEqual(messages, []);
    });
  }
  await check("the validator does flag a bad event (a ga_ parameter name is reserved)", async () => {
    const [{ name, params }] = cases[0][1].events;
    const messages = await validate({ client_id: CLIENT, events: [{ name, params: { ...params, ga_attribution: "none" } }] });
    console.log(`        validationMessages: ${JSON.stringify(messages)}`);
    assert.ok(JSON.stringify(messages).includes("NAME_RESERVED"));
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
