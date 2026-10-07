/**
 * Sanity Studio — mounted at /studio.
 * Sanity's own per-user login protects it (middleware.ts leaves it alone).
 *
 * Rendered in the browser only (7 Oct 2026). Studio can't render on the
 * server: every visit used to fail there first and fall back to the browser
 * (React error #419 in the console), and once next-sanity was bundled
 * (next.config.ts) that failure also printed a hook error in the server log.
 * Skipping the server pass changes nothing Doug sees: Studio always ran in
 * the browser.
 */
"use client";

import nextDynamic from "next/dynamic";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";

const NextStudio = nextDynamic(() => import("next-sanity/studio").then((m) => m.NextStudio), { ssr: false });

export default function StudioPage() {
  return <NextStudio config={config} />;
}
