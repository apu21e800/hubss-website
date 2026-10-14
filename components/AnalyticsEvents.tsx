"use client";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window { gtag?: GtagFn; }
}

// The pages where enquiries happen. A click into one of them from elsewhere on
// the site is reported as cta_click, with the page it came from and the link's
// words. This replaces the UTM tags the Product Book links used to carry: UTMs on
// internal links overwrite the visitor's real source in GA4 (Google, ChatGPT,
// the print ad) with our own page names, so a lead lost its origin (Oct 2026).
const LEAD_PATHS = ["/contact", "/lunch-learn", "/request-product-book", "/product-book"];

function isLeadPath(path: string): boolean {
  return LEAD_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function sameSitePath(href: string): string | null {
  try {
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin ? url.pathname : null;
  } catch {
    return null;
  }
}

export default function AnalyticsEvents() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        const number = href.slice(4);
        window.gtag?.("event", "phone_click", { event_category: "engagement", phone_number: number });
        track("phone_click", { phone_number: number });
      } else if (href.startsWith("mailto:")) {
        const email = href.slice(7).split("?")[0];
        window.gtag?.("event", "email_click", { event_category: "engagement", email_address: email });
        track("email_click", { email_address: email });
      } else {
        const to = sameSitePath(href);
        const from = window.location.pathname;
        if (!to || !isLeadPath(to) || to === from) return;
        // Turning pages inside the Product Book is reading, not a call to action.
        if (from.startsWith("/product-book") && to.startsWith("/product-book")) return;
        const text = (anchor.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
        window.gtag?.("event", "cta_click", { event_category: "engagement", cta_from: from, cta_to: to, cta_text: text });
        track("cta_click", { from, to });
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  return null;
}
