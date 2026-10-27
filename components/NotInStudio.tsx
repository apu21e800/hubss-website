"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Its children everywhere but the Studio (/studio and every page under it)
 * and Doug's review page (/review/<key>, app/review/[key]/page.tsx).
 * The Studio shares the root layout (app/layout.tsx), so until 24 Oct 2026
 * the chat bubble sat over it and every editor's session counted in GA4,
 * Vercel Analytics and Speed Insights as a visit to the site. Square One's
 * Studio has kept them out since 14 Oct 2026 the same way. The review page
 * (27 Oct 2026) is not a visit either, and its address carries a key that
 * must never reach an analytics report.
 */
export function outsideTheSite(pathname: string): boolean {
  return pathname === "/studio" || pathname.startsWith("/studio/") || pathname === "/review" || pathname.startsWith("/review/");
}

export default function NotInStudio({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  if (outsideTheSite(pathname)) return null;
  return <>{children}</>;
}
