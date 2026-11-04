import { useEffect, useState } from "react";
import { useClient } from "sanity";
import OfficeGuide from "../../components/OfficeGuide";
import { GUIDE_PATH } from "../../lib/office-guide";
import { DOUGS_LINK_ID } from "../../lib/review-link-record";

/** The orange for text on white (--accent-text on light ground, app/globals.css). */
const ACCENT = "#B83E0B";
const MUTED = "#5B5B5B";

/**
 * "Open your review page": Doug's link, read from the private record the
 * morning run keeps up to date (lib/review-link-record.ts) with the signed-in
 * editor's own Studio session. The link is never in the Studio's code or its
 * bundle; a visitor to the site can't read the record (its id has a dot, so
 * the public API never returns it); and when the keys change in Vercel the
 * button follows the next morning. Until the run has written it once (or
 * with no key set), the line says to use the link Vern sent.
 */
function ReviewPageButton() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [href, setHref] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    client
      .fetch<string | null>(`*[_id == $id][0].url`, { id: DOUGS_LINK_ID })
      .then((url) => { if (live) setHref(typeof url === "string" && url.startsWith("https://") ? url : null); })
      .catch(() => { if (live) setHref(null); });
    return () => { live = false; };
  }, [client]);
  if (href === undefined) return null;
  if (href === null) {
    return (
      <p style={{ margin: 0, fontSize: 15, color: MUTED }}>
        Your review page: use the link Vern sent you.
      </p>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minHeight: 44,
        padding: "0 18px",
        borderRadius: 8,
        background: "#F97316",
        color: "#1A0E05",
        fontSize: 15,
        fontWeight: 700,
        textDecoration: "none",
      }}
    >
      Open your review page
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  );
}

/**
 * The Studio's first item, "Start here" (sanity/structure.ts): Doug's
 * one-page guide inside the Studio, his review page's button above it, and
 * the address of the same guide to bookmark on a phone
 * (app/studio/guide/page.tsx). White in either Studio theme: the guide's
 * colours are set for a light page.
 */
export default function GuidePane() {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#fff" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 20px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 24px" }}>
        <ReviewPageButton />
        <a href={GUIDE_PATH} target="_blank" rel="noopener" style={{ fontSize: 15, color: ACCENT }}>
          Open this guide as a page to bookmark
        </a>
      </div>
      <OfficeGuide compact />
    </div>
  );
}
