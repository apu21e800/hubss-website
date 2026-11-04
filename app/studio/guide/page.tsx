import type { Metadata } from "next";
import OfficeGuide from "@/components/OfficeGuide";
import { OFFICE_GUIDE } from "@/lib/office-guide";

/**
 * /studio/guide: Doug's one-page guide (lib/office-guide.ts), a page to
 * bookmark on a phone; the same guide is the Studio's first item. Under
 * /studio, so it is never indexed (app/studio/layout.tsx, next.config.ts's
 * X-Robots-Tag, robots.txt) and never in the sitemap. A static route: it
 * wins over the Studio's own catch-all at /studio/[[...tool]]. His review
 * page's button is in the Studio only: this page needs no login, so it
 * carries nothing private.
 */
export const metadata: Metadata = {
  title: { absolute: `${OFFICE_GUIDE.title} | HUB Surface Systems` },
  description: OFFICE_GUIDE.lead,
  robots: { index: false, follow: false },
};

export default function GuidePage() {
  return (
    <main style={{ background: "#fff", minHeight: "100vh" }}>
      <OfficeGuide />
    </main>
  );
}
