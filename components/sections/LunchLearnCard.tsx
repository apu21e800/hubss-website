/**
 * LunchLearnCard: the Lunch & Learn offer at the moment of intent.
 *
 * The site-wide band at the foot of each page (LunchLearn compact) is the
 * closing statement. This card is the other half of Vern's 27 Sep brief:
 * the offer placed where a reader has just decided they are interested, named
 * for what they are reading ("a StreetPrint session"), in the sidebar of a
 * product, application or Insights post. It replaces the share block that
 * used to sit in the blog sidebar.
 *
 * Two layouts: "card" (sidebars, stacked) and "row" (inside the reading
 * column, side by side from sm up). Server-safe: no state, no client hooks.
 */
import Link from "next/link";
import ChromeImg from "@/components/ui/ChromeImg";
import { CHROME_MARKS } from "@/lib/chrome-images.mjs";
import { lunchLearnHref } from "@/lib/lunch-learn";
import { getSiteSettings } from "@/lib/sanity.queries";
import { telHref } from "@/lib/site-settings";

export default async function LunchLearnCard({
  topic,
  from,
  layout = "card",
  heading,
  body,
}: {
  /** What the session would be about, in the reader's words: "StreetPrint", "crosswalks". */
  topic?: string;
  /** Where the click came from, for the request email: "product", "application", "insights". */
  from?: string;
  layout?: "card" | "row";
  heading?: string;
  body?: string;
}) {
  // The office phones, from Studio's Site Settings (lib/site-settings.ts).
  const { offices } = await getSiteSettings();
  const title = heading ?? (topic ? `Bring ${topic} to your team` : "Bring HUB to your team");
  const line =
    body ??
    "A free 45-minute working session in your office or online: case studies, spec language and samples on the table. Lunch is on us.";
  const row = layout === "row";
  return (
    <aside
      aria-label="Lunch & Learn"
      className={`relative overflow-hidden rounded-2xl ${row ? "p-5 sm:p-6" : "p-5"}`}
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--card-shadow, 0 1px 2px rgba(0,0,0,0.06))" }}
    >
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} aria-hidden="true" />
      <div className={row ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6" : ""}>
        <div className={`flex items-center gap-3 ${row ? "sm:flex-1" : "mb-3"}`}>
          <span className="relative flex-shrink-0 w-12 h-12" aria-hidden="true">
            <span className="absolute inset-0 rounded-full" style={{ background: "rgba(249,115,22,0.14)", border: "2px solid rgba(249,115,22,0.45)" }} />
            <ChromeImg
              family="moose"
              src={CHROME_MARKS.moose}
              alt=""
              width={320}
              height={400}
              sizes="61px"
              className="absolute bottom-0 left-1/2 w-auto"
              style={{ height: "127%", maxWidth: "none", transform: "translateX(-50%)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}
            />
          </span>
          <div className="min-w-0">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent-text)" }}>
              Lunch &amp; Learn
            </p>
            <p className="text-[15px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
              {title}
            </p>
          </div>
        </div>
        {!row && (
          <p className="mb-4 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {line}
          </p>
        )}
        <div className={row ? "flex flex-col gap-2 sm:items-end" : "flex flex-col gap-2"}>
          {row && (
            <p className="text-[13px] leading-relaxed sm:hidden" style={{ color: "var(--text-secondary)" }}>
              {line}
            </p>
          )}
          <Link
            href={lunchLearnHref(topic, from)}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 text-[14px] font-bold transition-[filter] hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "var(--on-accent)", minHeight: 44 }}
          >
            Book a Lunch &amp; Learn
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          {row ? (
            <p className="flex flex-wrap gap-x-3 text-[12px]" style={{ color: "var(--text-muted)" }}>
              <span>Or call</span>
              <a href={telHref(offices.east.phone)} className="whitespace-nowrap font-semibold underline-offset-2 hover:underline" style={{ color: "var(--text-secondary)" }}>East {offices.east.phone}</a>
              <a href={telHref(offices.west.phone)} className="whitespace-nowrap font-semibold underline-offset-2 hover:underline" style={{ color: "var(--text-secondary)" }}>West {offices.west.phone}</a>
            </p>
          ) : (
            // In a sidebar the three pieces wrapped as "Or call East · …" over
            // "West · …", the second number under "Or call" (QA, 28 Sep 2026).
            // The two numbers stack in their own column, so East and West line up.
            <p className="flex gap-x-3 text-[12px]" style={{ color: "var(--text-muted)" }}>
              <span className="flex-shrink-0">Or call</span>
              <span className="flex flex-col">
                <a href={telHref(offices.east.phone)} className="whitespace-nowrap font-semibold underline-offset-2 hover:underline" style={{ color: "var(--text-secondary)" }}>East {offices.east.phone}</a>
                <a href={telHref(offices.west.phone)} className="whitespace-nowrap font-semibold underline-offset-2 hover:underline" style={{ color: "var(--text-secondary)" }}>West {offices.west.phone}</a>
              </span>
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
