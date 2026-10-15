/**
 * Is this browser driven by a program rather than a person?
 *
 * Doug, 15 Oct 2026, looking at Google Analytics: "high traffic from
 * Singapore". Those visits are not people: 386 "users" from Singapore in Sep
 * 17 to Oct 14, 2026 spent 0 seconds on the site with a 2.6% engagement rate,
 * and before them 484 sessions from Seychelles arrived through
 * trafficheap.cc, a fake-traffic service. Programs that open the site in a
 * real browser run the analytics tag like a visitor does, so GA counts them.
 * HumanAnalytics (components/HumanAnalytics.tsx) loads GA only when none of
 * these signals is present.
 *
 * Every signal here is one only automation gives; a person's browser never
 * trips one, so no real visitor goes uncounted. A program that hides all of
 * them still gets counted: this is the cheap half; Vercel's Bot Protection
 * (Firewall, a dashboard setting) is the other.
 */
export interface BrowserSignals {
  /** navigator.webdriver: true under Selenium, Puppeteer, Playwright and the like. */
  webdriver?: boolean;
  userAgent: string;
  /** navigator.languages: a person's browser always has at least one. */
  languages?: readonly string[];
  /** window.outerWidth and outerHeight: 0 in a headless browser. */
  outerWidth?: number;
  outerHeight?: number;
}

// Names automated clients give themselves. Word boundaries, so a phone model
// like "CUBOT" never reads as "bot".
const AUTOMATED_UA = /HeadlessChrome|PhantomJS|Lighthouse|Google-InspectionTool|facebookexternalhit|Bytespider|selenium|puppeteer|playwright|\b(?:bot|crawler|spider|scraper)\b/i;

export function looksAutomated(s: BrowserSignals): boolean {
  if (s.webdriver === true) return true;
  if (AUTOMATED_UA.test(s.userAgent)) return true;
  if (Array.isArray(s.languages) && s.languages.length === 0) return true;
  if (s.outerWidth === 0 && s.outerHeight === 0) return true;
  return false;
}

/** The signals of the browser this runs in. Client only. */
export function currentBrowserSignals(): BrowserSignals {
  return {
    webdriver: navigator.webdriver,
    userAgent: navigator.userAgent,
    languages: navigator.languages,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
  };
}
