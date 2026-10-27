/**
 * /review/<key>: the review page (27 Oct 2026; lib/review-first.ts says why,
 * lib/review-page.ts what it shows). No login: the key in the address is the
 * pass, and only the server can make one. Doug's key shows what 21e8 has put
 * on his page; Vern's shows everything waiting, with the button that puts it
 * there (./actions.ts). Any other key, or a server without a secret, gets the
 * site's 404, titled as every 404 is. Never cached, never indexed (the
 * X-Robots-Tag in next.config.ts too), no analytics or chat on it
 * (components/NotInStudio.tsx), and a referrer leaving it is only
 * "https://hubss.com/" (strict-origin), so a key stays in the address bar it
 * was typed into.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReviewView from "@/components/review/ReviewView";
import { reviewAudience } from "@/lib/review-first";
import { loadReview } from "@/lib/review-page.server";
import { setOnDougsPage } from "./actions";

export const dynamic = "force-dynamic";

const PRIVATE: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "strict-origin",
};

/** A wrong key's 404 is titled as the site's own, so nothing says what lives here. */
export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const audience = reviewAudience(key);
  if (!audience) return { ...PRIVATE, title: "Page Not Found" };
  return { ...PRIVATE, title: audience === "agency" ? "What's waiting" : "For your review" };
}

export default async function ReviewPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const audience = reviewAudience(key);
  if (!audience) notFound();
  const now = new Date();
  const data = await loadReview(audience, now);
  return audience === "agency" ? (
    <ReviewView data={data} now={now} actionKey={key} action={setOnDougsPage} />
  ) : (
    <ReviewView data={data} now={now} />
  );
}
