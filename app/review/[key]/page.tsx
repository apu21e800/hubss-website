/**
 * /review/<key>: Doug's review page (27 Oct 2026; lib/review-first.ts says why,
 * lib/review-page.ts what it shows). No login: the key in the address is the
 * pass, and only the server can make it (reviewKey). Any other key, or a
 * server without a secret, gets the site's 404, which says nothing about the
 * page. Never cached, never indexed (the X-Robots-Tag in next.config.ts too),
 * no analytics or chat on it (components/NotInStudio.tsx), and no referrer
 * leaves it, so the key stays in the address bar it was typed into.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReviewView from "@/components/review/ReviewView";
import { isReviewKey } from "@/lib/review-first";
import { loadReview } from "@/lib/review-page.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "For your review",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default async function ReviewPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isReviewKey(key)) notFound();
  const now = new Date();
  const data = await loadReview(now);
  return <ReviewView data={data} now={now} />;
}
