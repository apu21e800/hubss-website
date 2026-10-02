#!/usr/bin/env node
/**
 * Tell the IndexNow search engines (Bing, Yandex, Seznam, Naver and the rest
 * that share https://api.indexnow.org) that the site's pages changed.
 *
 * 2 Oct 2026. Vern: "when I search Perplexity for key words like stamped
 * asphalt, I get zero results for hubss. we should fix that too, be
 * searchable on all LLM models." ChatGPT search and Perplexity lean on Bing's
 * index, and IndexNow is how a site asks Bing to recrawl now instead of
 * whenever it next gets round to it. .github/workflows/indexnow.yml runs this
 * after every push to main, once Vercel has had time to deploy.
 *
 *   npm run indexnow                                  submit every URL in https://hubss.com/sitemap.xml
 *   node scripts/indexnow-submit.mjs --dry-run        print the payload, send nothing
 *   node scripts/indexnow-submit.mjs --base http://localhost:3000 --dry-run
 *                                                     read the sitemap from a dev server instead
 *
 * The key is the 32-hex-character file in /public (public/<key>.txt, whose
 * content is the key); search engines fetch it from https://hubss.com/<key>.txt
 * to prove the site sent the request. INDEXNOW_KEY or --key overrides it.
 * Only Node built-ins: the workflow runs it without npm ci.
 */
import { readdirSync, readFileSync } from "node:fs";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 10_000; // the protocol's limit per request

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
  const i = args.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (i < 0) return undefined;
  return args[i].includes("=") ? args[i].slice(args[i].indexOf("=") + 1) : args[i + 1];
};

const dryRun = flag("dry-run");
const base = (option("base") ?? "https://hubss.com").replace(/\/+$/, "");

function findKey() {
  const given = option("key") ?? process.env.INDEXNOW_KEY;
  if (given) return given.trim();
  const dir = new URL("../public/", import.meta.url);
  const keys = readdirSync(dir)
    .filter((f) => /^[0-9a-f]{32}\.txt$/.test(f))
    .map((f) => f.slice(0, -4))
    .filter((k) => readFileSync(new URL(`${k}.txt`, dir), "utf8").trim() === k);
  if (keys.length !== 1) {
    throw new Error(`expected one IndexNow key file (public/<32 hex>.txt containing its own name), found ${keys.length}`);
  }
  return keys[0];
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000), headers: { "User-Agent": "hubss-indexnow/1.0" } });
  if (!res.ok) throw new Error(`GET ${url} answered ${res.status}`);
  return res.text();
}

/** Page URLs from a sitemap (or a sitemap index). <image:loc> entries are photos, not pages, and are skipped. */
async function sitemapUrls(url) {
  const xml = await get(url);
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => decode(m[1]));
  if (/<sitemapindex[\s>]/.test(xml)) return (await Promise.all(locs.map(sitemapUrls))).flat();
  return locs;
}

const STATUS = {
  200: "OK, URLs submitted",
  202: "Accepted, key validation pending",
  400: "Bad request",
  403: "Forbidden: the key file was not found or does not match",
  422: "Unprocessable: a URL is not on the host, or the key does not match the protocol",
  429: "Too many requests: wait and try again",
};

async function main() {
  const key = findKey();
  const all = [...new Set(await sitemapUrls(`${base}/sitemap.xml`))];
  if (all.length === 0) throw new Error(`no <loc> URLs in ${base}/sitemap.xml`);

  // The sitemap names the canonical host whatever server served it, so the
  // payload is the production one even when --base is a dev server.
  const host = new URL(all[0]).host;
  const urlList = all.filter((u) => new URL(u).host === host);
  if (urlList.length < all.length) console.warn(`skipped ${all.length - urlList.length} URL(s) not on ${host}`);
  const keyLocation = `https://${host}/${key}.txt`;

  // The search engine checks keyLocation before it acts on a request, so a
  // submission before the key file is live is refused with a 403.
  const keyCheckUrl = dryRun ? `${base}/${key}.txt` : keyLocation;
  const served = await get(keyCheckUrl).then((t) => t.trim(), () => null);
  console.log(`key file ${keyCheckUrl}: ${served === key ? "served, matches" : "NOT served or does not match"}`);
  if (!dryRun && served !== key) throw new Error("the key file is not live yet: deploy first, then submit");

  console.log(`${urlList.length} URLs from ${base}/sitemap.xml for host ${host}${dryRun ? " (dry run: nothing is sent)" : ""}`);
  let failed = false;
  for (let i = 0; i < urlList.length; i += BATCH) {
    const payload = { host, key, keyLocation, urlList: urlList.slice(i, i + BATCH) };
    const label = `batch ${i / BATCH + 1} (${payload.urlList.length} URLs)`;
    if (dryRun) {
      console.log(`${label}: POST ${ENDPOINT}`);
      console.log(JSON.stringify(payload, null, 2));
      continue;
    }
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60_000),
    });
    console.log(`${label}: ${res.status} ${STATUS[res.status] ?? res.statusText}`);
    if (res.status !== 200 && res.status !== 202) {
      failed = true;
      const body = (await res.text()).trim();
      if (body) console.log(body.slice(0, 500));
    }
  }
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`indexnow: ${err.message}`);
  process.exitCode = 1;
});
