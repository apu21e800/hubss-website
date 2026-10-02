import Link from "next/link";
import ChromeImg from "@/components/ui/ChromeImg";
import { CHROME_MARKS } from "@/lib/chrome-images.mjs";
import { lunchLearnHref } from "@/lib/lunch-learn";

/**
 * The card that closes an Insights grid (QA rest#33, 28 Sep 2026).
 *
 * Every card grid used to end on a ragged row: 2 of 3, or one card on its
 * own. This tile fills the gap in the grid's own card style, with the one
 * offer the library exists to make (Vern, 27 Sep: the Lunch & Learn "placed
 * where it will clearly lead to conversion"). It only appears where there is
 * a gap: one column never has one; two columns only after an odd count;
 * three columns after a count that isn't a multiple of three, and there it
 * spans whatever is left of the row (one card's width or two). The classes
 * are written out in full so Tailwind finds them.
 *
 * No state and no hooks: the filter (a client component) and the section
 * pages (server) both render it.
 */
export default function LunchLearnTile({
  count,
  topic,
  from = "insights",
}: {
  /** How many cards come before it in the grid. */
  count: number;
  /** The session's subject, when the grid has one ("StreetPrint"). */
  topic?: string;
  from?: string;
}) {
  if (count <= 0) return null;
  const smGap = count % 2 === 1;
  const lgSpan = (3 - (count % 3)) % 3; // 0: the row is full
  if (!smGap && lgSpan === 0) return null;

  const visibility = [
    "hidden",
    smGap ? "sm:block" : "sm:hidden",
    lgSpan === 0 ? "lg:hidden" : lgSpan === 2 ? "lg:grid lg:col-span-2 lg:grid-cols-2 lg:items-start lg:gap-8" : "lg:block lg:col-span-1",
  ].join(" ");
  const wide = lgSpan === 2;

  // 30 Sep 2026: drawn like the editorial cards around it (BlogCard): a
  // picture, a kicker, a headline and one line, no box. The picture is the
  // same 3:2 frame, Moose on charcoal, so the row still reads as one row.
  return (
    <Link
      href={lunchLearnHref(topic, from)}
      aria-label={topic ? `Book a Lunch & Learn on ${topic}` : "Book a Lunch & Learn"}
      className={`group ${visibility}`}
    >
      <span
        data-surface="dark"
        className="relative block aspect-[3/2] overflow-hidden rounded-xl"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 110%, rgba(249,115,22,0.38) 0%, rgba(249,115,22,0.08) 45%, transparent 70%), var(--bg-card)",
        }}
        aria-hidden="true"
      >
        <span className="absolute inset-x-0 top-0 block h-[3px]" style={{ background: "var(--gradient-brand)" }} />
        <ChromeImg
          family="moose"
          src={CHROME_MARKS.moose}
          alt=""
          width={320}
          height={322}
          sizes="176px"
          className="absolute bottom-0 left-1/2 w-auto transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ height: "82%", maxWidth: "none", transform: "translateX(-50%)", transformOrigin: "50% 100%", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.45))" }}
        />
      </span>

      {/* Wide, the picture's top lines up with the photographs beside it and
          the words sit in the middle of the picture's height. */}
      <span className={`block ${wide ? "mt-4 lg:mt-0 lg:self-center" : "mt-4"}`}>
        <span className="block text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent-text)" }}>
          Lunch &amp; Learn
        </span>
        <span
          className={`font-display mt-2 block font-bold text-balance transition-colors duration-200 group-hover:text-[var(--accent-text)] ${wide ? "text-[19px] lg:text-[26px] lg:leading-[1.12]" : "text-[19px] leading-[1.24]"}`}
          style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
        >
          {topic ? `Bring ${topic} to your team` : "Bring HUB to your team"}
        </span>
        {/* Worded apart from the Lunch & Learn band that closes the page,
            which on /blog comes straight after this card. */}
        <span className="mt-2 block text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)", maxWidth: "40ch" }}>
          Samples, data sheets and your region&rsquo;s certified installers, in your office or online. Lunch is on us.
        </span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold" style={{ color: "var(--accent-text-lg)" }}>
          Book a session
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </Link>
  );
}
