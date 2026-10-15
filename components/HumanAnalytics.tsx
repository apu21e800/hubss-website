"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { currentBrowserSignals, looksAutomated } from "@/lib/automated-browser";

/**
 * Google Analytics for people (lib/automated-browser.ts): the tag loads once
 * the page is up, unless the browser is plainly driven by a program. Without
 * the tag there is no window.gtag, so the site's own events (leads, phone and
 * email clicks, components/AnalyticsEvents.tsx) are skipped for it too.
 *
 * The tag already loaded after the page became interactive (next/script's
 * afterInteractive), so a person's visit is counted as before.
 */
export default function HumanAnalytics({ gaId }: { gaId: string }) {
  const [person, setPerson] = useState(false);
  useEffect(() => {
    setPerson(!looksAutomated(currentBrowserSignals()));
  }, []);
  return person ? <GoogleAnalytics gaId={gaId} /> : null;
}
