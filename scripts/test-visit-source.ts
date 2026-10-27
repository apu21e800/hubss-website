/**
 * `npm run test:source`: where a visit came from (lib/visit-source.ts), as the
 * browser records it on arrival, as the route checks it again, and as the
 * office's email describes it. No browser: the storage is a stand-in map.
 */
import assert from "node:assert/strict";
import {
  cleanVisitSource,
  describeVisitSource,
  readVisitSource,
  recordVisitSource,
  sourceFromUrl,
  storedVisitSource,
} from "../lib/visit-source";

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

const HOST = "hubss.com";
const AD =
  "https://hubss.com/products/streetprint?utm_source=google&utm_medium=cpc&utm_campaign=west-search-crosswalks&utm_content=rsa-1&utm_term=decorative+crosswalks&gclid=Cj0KCQjw-abc_123";

class MemoryStorage {
  map = new Map<string, string>();
  getItem(k: string) {
    return this.map.has(k) ? this.map.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, v);
  }
}

console.log("lib/visit-source.ts");

check("an ad click: the five tags, the click, the landing path; no click id, no query string", () => {
  const s = sourceFromUrl(AD, "https://www.google.com/", HOST);
  assert.deepEqual(s, {
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "west-search-crosswalks",
    utm_content: "rsa-1",
    utm_term: "decorative crosswalks",
    click: "google",
    landing: "/products/streetprint",
    referrer: "google.com",
  });
  assert.ok(!JSON.stringify(s).includes("Cj0KCQjw"), "the gclid itself is never kept");
});

check("gbraid and wbraid count as Google Ads clicks too", () => {
  assert.equal(sourceFromUrl("https://hubss.com/?gbraid=0AAAA", "", HOST).click, "google");
  assert.equal(sourceFromUrl("https://hubss.com/?wbraid=Cl0KCQ", "", HOST).click, "google");
});

check("the MediaEdge display click", () => {
  const s = sourceFromUrl(
    "https://hubss.com/lunch-learn?topic=TrafficPatternsXD&from=display-ad&utm_source=mediaedge&utm_medium=display&utm_campaign=oala-smart-channel-2026-11&utm_content=lunch-learn-crosswalk",
    "",
    HOST
  );
  assert.equal(describeVisitSource(s).cameFrom, "mediaedge / display · oala-smart-channel-2026-11 · lunch-learn-crosswalk");
  assert.equal(describeVisitSource(s).landing, "/lunch-learn");
});

check("the site's own links are not a referrer; another site's host is, without www", () => {
  assert.equal(sourceFromUrl("https://hubss.com/contact", "https://hubss.com/products", HOST).referrer, undefined);
  assert.equal(sourceFromUrl("https://hubss.com/", "https://www.bing.com/search?q=x", HOST).referrer, "bing.com");
  assert.equal(sourceFromUrl("https://hubss.com/", "not a url", HOST).referrer, undefined);
});

check("a tag with an @, markup or too many characters is dropped or cut", () => {
  const s = sourceFromUrl("https://hubss.com/?utm_source=jane%40example.ca&utm_medium=%3Cb%3Ex%3C%2Fb%3E&utm_campaign=" + "a".repeat(300), "", HOST);
  assert.equal(s.utm_source, undefined);
  assert.equal(s.utm_medium, undefined);
  assert.equal(s.utm_campaign?.length, 100);
});

check("accents and numeric campaign ids are kept", () => {
  const s = sourceFromUrl("https://hubss.com/?utm_source=google&utm_campaign=21734567890&utm_term=passage+pi%C3%A9ton", "", HOST);
  assert.equal(s.utm_campaign, "21734567890");
  assert.equal(s.utm_term, "passage piéton");
});

check("the route's check keeps only known keys of the right shape", () => {
  assert.equal(readVisitSource(null), undefined);
  assert.equal(readVisitSource({ source: "google" }), undefined);
  assert.equal(readVisitSource({ source: [1, 2] }), undefined);
  assert.equal(readVisitSource({ source: { utm_source: 42, click: "bing", landing: "products", referrer: "<x>" } }), undefined);
  assert.deepEqual(readVisitSource({ source: { utm_source: "google", extra: "x", landing: "/products/streetprint?x=1" } }), { utm_source: "google" });
  assert.deepEqual(cleanVisitSource({ landing: "/applications/bike-lanes", referrer: "Google.CA" }), { landing: "/applications/bike-lanes", referrer: "google.ca" });
});

check("the first page of a visit is kept; later pages only replace it with a source of their own", () => {
  const store = new MemoryStorage();
  recordVisitSource({ href: AD, host: HOST }, "https://www.google.com/", store);
  recordVisitSource({ href: "https://hubss.com/contact", host: HOST }, "https://hubss.com/products/streetprint", store);
  assert.equal(storedVisitSource(store)?.utm_campaign, "west-search-crosswalks");
  assert.equal(storedVisitSource(store)?.landing, "/products/streetprint");
  recordVisitSource({ href: "https://hubss.com/lunch-learn?utm_source=mediaedge&utm_medium=display", host: HOST }, "", store);
  assert.equal(storedVisitSource(store)?.utm_source, "mediaedge");
  const direct = new MemoryStorage();
  recordVisitSource({ href: "https://hubss.com/", host: HOST }, "", direct);
  assert.deepEqual(storedVisitSource(direct), { landing: "/" });
});

check("broken or blocked storage never throws", () => {
  const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("full"); } };
  recordVisitSource({ href: AD, host: HOST }, "", broken);
  assert.equal(storedVisitSource(broken), undefined);
  const junk = new MemoryStorage();
  junk.setItem("hubss:visit-source", "{not json");
  assert.equal(storedVisitSource(junk), undefined);
});

check("a browser that blocks storage (reading window.sessionStorage throws) never throws either", () => {
  // The Vercel Agent's review of #103: as default arguments, window.sessionStorage
  // was read before the try, so the SecurityError escaped and stopped
  // instrumentation-client.ts. Called the way instrumentation-client.ts calls it.
  const g = globalThis as Record<string, unknown>;
  const saved = { window: g.window, document: g.document };
  const blocked = {
    location: { href: AD, host: HOST },
    get sessionStorage(): never {
      throw new Error("SecurityError: Failed to read the 'sessionStorage' property from 'Window': Access is denied for this document.");
    },
  };
  g.window = blocked;
  g.document = { referrer: "https://www.google.com/" };
  try {
    assert.doesNotThrow(() => recordVisitSource());
    assert.equal(storedVisitSource(), undefined);
  } finally {
    g.window = saved.window;
    g.document = saved.document;
  }
});

check("the email's lines", () => {
  const ad = describeVisitSource(sourceFromUrl(AD, "", HOST));
  assert.equal(ad.cameFrom, 'google / cpc · west-search-crosswalks · rsa-1 · "decorative crosswalks" · Google Ads click');
  assert.equal(ad.label, "google/cpc");
  assert.deepEqual(describeVisitSource({ click: "google", landing: "/" }), { cameFrom: "Google Ads click", landing: "/", label: "google-ads" });
  assert.deepEqual(describeVisitSource({ referrer: "google.ca", landing: "/blog/x" }), { cameFrom: "a link or search on google.ca", landing: "/blog/x", label: "ref:google.ca" });
  assert.deepEqual(describeVisitSource({ landing: "/" }), { cameFrom: "direct (typed in, bookmarked or not recorded)", landing: "/", label: "direct" });
  assert.deepEqual(describeVisitSource(undefined), { label: "unknown" });
});

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nall passed");
