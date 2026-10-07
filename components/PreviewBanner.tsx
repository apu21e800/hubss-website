"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * A small pill at the foot of the screen while Studio's preview is on in this
 * browser (lib/sanity.preview.ts). Draft mode is a cookie, so after closing
 * "Edit on the page" Doug's browser would keep showing drafts on hubss.com
 * with nothing to say so; this says so, and turns it off.
 *
 * Not shown inside Studio's frame, where Studio has its own controls.
 * Rendered only when draft mode is on (app/layout.tsx), so visitors never get it.
 */
export default function PreviewBanner() {
  const pathname = usePathname();
  const [framed, setFramed] = useState(true);

  useEffect(() => {
    try {
      setFramed(window.self !== window.top);
    } catch {
      // A cross-origin parent throws on window.top: that's a frame too.
      setFramed(true);
    }
  }, []);

  if (framed) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 16,
        transform: "translateX(-50%)",
        zIndex: 2147483000,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 8px 8px 16px",
        borderRadius: 999,
        background: "rgba(13,17,23,0.94)",
        color: "#f5f0eb",
        font: "500 13px/1.2 var(--font-inter), system-ui, sans-serif",
        boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
        border: "1px solid rgba(249,115,22,0.55)",
      }}
    >
      <span>Previewing unpublished changes</span>
      <a
        href={`/api/draft-mode/disable?to=${encodeURIComponent(pathname || "/")}`}
        style={{
          padding: "6px 12px",
          borderRadius: 999,
          background: "#f97316",
          color: "#111",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Exit preview
      </a>
    </div>
  );
}
