/**
 * `npm run test:analytics`: lib/automated-browser.ts never calls a person a
 * program, and catches the automation that announces itself. No network.
 */
import assert from "node:assert/strict";
import { looksAutomated, type BrowserSignals } from "../lib/automated-browser";

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

const person = (userAgent: string, extra: Partial<BrowserSignals> = {}): BrowserSignals => ({
  webdriver: false, userAgent, languages: ["en-CA", "en"], outerWidth: 1440, outerHeight: 900, ...extra,
});

const PEOPLE = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:158.0) Gecko/20100101 Firefox/158.0",
  "Mozilla/5.0 (Linux; Android 14; CUBOT KINGKONG 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0",
];

console.log("People are counted");
check("everyday browsers on laptops and phones", () => {
  for (const ua of PEOPLE) assert.equal(looksAutomated(person(ua)), false, ua);
});
check("a browser that reports no window size (some in-app browsers) is still a person", () => {
  assert.equal(looksAutomated(person(PEOPLE[2], { outerWidth: undefined, outerHeight: undefined })), false);
});
check("a browser that doesn't expose navigator.languages is still a person", () => {
  assert.equal(looksAutomated(person(PEOPLE[0], { languages: undefined })), false);
});

console.log("Programs are not");
check("navigator.webdriver (Selenium, Puppeteer, Playwright)", () => {
  assert.equal(looksAutomated(person(PEOPLE[0], { webdriver: true })), true);
});
check("headless Chrome and named crawlers", () => {
  for (const ua of [
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/155.0.0.0 Safari/537.36",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)",
  ]) assert.equal(looksAutomated(person(ua)), true, ua);
});
check("no languages at all, or a zero-size window", () => {
  assert.equal(looksAutomated(person(PEOPLE[0], { languages: [] })), true);
  assert.equal(looksAutomated(person(PEOPLE[0], { outerWidth: 0, outerHeight: 0 })), true);
});

if (failures) {
  console.log(`\n${failures} failed`);
  process.exit(1);
}
console.log("\nAll passed");
