"use client";

import { usePathname } from "next/navigation";
import { VisualEditing } from "next-sanity/visual-editing/client-component";
import PreviewBanner from "@/components/PreviewBanner";

/**
 * What a browser in Studio's preview gets on top of the page
 * (lib/sanity.preview.ts): the click-to-edit outlines and live refresh, and
 * the "Exit preview" pill. Rendered by app/layout.tsx only when draft mode is
 * on. Nothing on /studio itself: Studio shares the root layout, and the tools
 * belong on the site it previews, not on Studio's own page.
 */
export default function PreviewTools() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return (
    <>
      <VisualEditing />
      <PreviewBanner />
    </>
  );
}
