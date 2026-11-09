"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { currentBrowserSignals, looksAutomated } from "@/lib/automated-browser";

/**
 * Apollo's website visitor tracker (Vern, 9 Nov 2026: "yes" to "add hubss.com
 * to Apollo's visitor tracking ... company names only, not people"). It tells
 * Apollo which organizations visit the site, from the network address a visit
 * comes from, and which pages they read, so outreach can follow the
 * organizations already reading about the systems.
 *
 * Company level only. Apollo's tracker loads its person-matching script
 * (LiveIntent, d-code.liadm.com) only when Apollo answers "can_track: true"
 * for this tracker, and the hubss.com domain is set up in Apollo with
 * contact-level tracking off: Apollo answered {"can_track":false} on
 * 9 Nov 2026. Keep it off; the privacy page says so (app/privacy/page.tsx).
 *
 * Loads like Google Analytics (components/HumanAnalytics.tsx): once the page
 * is up, for people only, never in the Studio or on the review page
 * (components/NotInStudio.tsx, in app/layout.tsx), and only on hubss.com, so a
 * preview or a local build sends nothing. The snippet is Apollo's own
 * (apollo_website_visitor_domain_tracker_install_script); the app id is
 * public, it is in every page that carries the tracker.
 * NEXT_PUBLIC_APOLLO_VISITORS=off in Vercel (then a deploy) turns it off.
 */
const APP_ID = "6ae428f90182b0000c63c965";
const HOST = "hubss.com";

export default function ApolloVisitors() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APOLLO_VISITORS === "off") return;
    if (window.location.hostname !== HOST) return;
    setOn(!looksAutomated(currentBrowserSignals()));
  }, []);
  if (!on) return null;
  return (
    <Script id="apollo-visitors" strategy="afterInteractive">
      {`function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"${APP_ID}"})},document.head.appendChild(o)}initApollo();`}
    </Script>
  );
}
