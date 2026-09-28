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
    smGap ? "sm:flex" : "sm:hidden",
    lgSpan === 0 ? "lg:hidden" : lgSpan === 2 ? "lg:flex lg:col-span-2 lg:flex-row" : "lg:flex lg:col-span-1 lg:flex-col",
  ].join(" ");
  const wide = lgSpan === 2;

  return (
    <Link
      href={lunchLearnHref(topic, from)}
      aria-label={topic ? `Book a Lunch & Learn on ${topic}` : "Book a Lunch & Learn"}
      className={`group ${visibility} h-full flex-col overflow-hidden rounded-xl border border-[var(--border-color)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_8px_28px_rgba(249,115,22,0.14)]`}
      style={{ background: "var(--bg-card)" }}
    >
      {/* The picture slot of a card: Moose on charcoal, dark in every theme. */}
      <div
        data-surface="dark"
        className={`relative flex-shrink-0 overflow-hidden h-52 ${wide ? "lg:h-auto lg:w-[42%]" : ""}`}
        style={{
          background:
            "radial-gradient(120% 90% at 50% 110%, rgba(249,115,22,0.38) 0%, rgba(249,115,22,0.08) 45%, transparent 70%), var(--bg-card)",
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />
        <ChromeImg
          family="moose"
          src={CHROME_MARKS.moose}
          alt=""
          width={320}
          height={322}
          sizes="176px"
          className="absolute bottom-0 left-1/2 w-auto transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ height: "86%", maxWidth: "none", transform: "translateX(-50%)", transformOrigin: "50% 100%", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.45))" }}
        />
      </div>

      <div className={`p-5 flex flex-col flex-1 ${wide ? "lg:p-8 lg:justify-center" : ""}`}>
        <span
          className="self-start text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider mb-2.5"
          style={{ background: "rgba(249,115,22,0.14)", color: "var(--accent-text)", border: "1px solid rgba(249,115,22,0.35)" }}
        >
          Lunch &amp; Learn
        </span>
        <h3
          className={`font-bold leading-snug mb-2 ${wide ? "text-[15px] lg:text-[22px] lg:mb-3" : "text-[15px]"}`}
          style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
        >
          {topic ? `Bring ${topic} to your team` : "Bring HUB to your team"}
        </h3>
        {/* Worded apart from the Lunch & Learn band that closes the page,
            which on /blog comes straight after this card. */}
        <p className={`text-[13px] leading-relaxed mb-4 ${wide ? "flex-1 lg:flex-none lg:text-[14px] lg:mb-5" : "flex-1"}`} style={{ color: "var(--text-secondary)", maxWidth: "46ch" }}>
          We bring physical samples, the technical data sheets and the certified installer list for your region: 45 minutes, in your office or online, and lunch is on us.
        </p>
        <span className={`text-xs font-semibold flex items-center gap-1 ${wide ? "mt-auto lg:mt-0 lg:text-[13px]" : "mt-auto"}`} style={{ color: "var(--accent-text-lg)" }}>
          Book a Lunch &amp; Learn &rarr;
        </span>
      </div>
    </Link>
  );
}
