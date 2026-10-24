"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Its children everywhere but the Studio (/studio and every page under it).
 * The Studio shares the root layout (app/layout.tsx), so until 24 Oct 2026
 * the chat bubble sat over it and every editor's session counted in GA4,
 * Vercel Analytics and Speed Insights as a visit to the site. Square One's
 * Studio has kept them out since 14 Oct 2026 the same way.
 */
export default function NotInStudio({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  if (pathname === "/studio" || pathname.startsWith("/studio/")) return null;
  return <>{children}</>;
}
