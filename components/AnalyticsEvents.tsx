"use client";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window { gtag?: GtagFn; }
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
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  return null;
}
