import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { sectionFor } from "@/lib/field-notes-taxonomy";
import { primarySystem } from "@/lib/blog-taxonomy";
import { lunchLearnHref } from "@/lib/lunch-learn";

/**
 * End-of-post conversion block — the Insights lead engine (Aug 2026).
 *
 * Vernon: "In the end we need to generate lunch and learns, which churns
 * business the fastest, on top of organic search, AI search etc."
 *
 * Every post used to end with the same two buttons under the same headline
 * ("Ready to transform your streetscape?"), and the primary button said
 * "See the Systems" while pointing at /contact. Two problems: a reader who
 * just finished a 1,300-word driveway comparison and a public-works director
 * who finished a transit white paper were asked the identical question, and
 * the one button that promised systems delivered a contact form.
 *
 * Now the ask matches what the reader just did. A Guide reader is mid-decision
 * → offer the session that answers the rest. A Case Study reader is looking
 * for proof → offer the session where they see the samples. The Lunch & Learn
 * is the primary action on every one of them, because it is the fastest path
 * from "interested" to "specified" — but the sentence around it changes, and
 * the secondary link goes where the label says it goes.
 *
 * 28 Sep 2026 (QA round): the system is the one the post is about
 * (postFocus), not the first one it lists (rest#9); the booking link carries
 * it as the session's topic; both offices' numbers are printed, not the East
 * one alone on BC projects (rest#37); and every link is a target at least
 * 44 px tall. The eyebrow names the offer instead of asking a question.
 */

const ASK: Record<string, { heading: string; body: string }> = {
  "Guide": {
    heading: "Bring the rest of this decision to your team.",
    body: "A 45-minute Lunch & Learn covers the comparisons this piece opened: lifecycle math for your climate, spec language you can paste into a tender, and material samples on the table for the people who have to sign off.",
  },
  "Case Study": {
    heading: "See the system that did it, in person.",
    body: "We bring the same materials from this project to your office: physical samples, the technical data sheets, and the certified installer list for your region. Lunch included, no obligation.",
  },
  "Project Profile": {
    heading: "Let's talk about what your surface could do.",
    body: "Book a 45-minute session and we will walk your team through the systems behind installations like this one: what they cost, how they hold up through Canadian winters, and who installs them near you.",
  },
  "White Paper": {
    heading: "Turn the document into a working session.",
    body: "We present this material directly to public works, engineering, and procurement teams: the engineering challenges, the material systems, and the cost modelling, with time for the questions a document cannot answer.",
  },
  "Blog": {
    heading: "Get the technical version, over lunch.",
    body: "A 45-minute Lunch & Learn puts the specifications, samples, and Canadian case data in front of your whole team. In your office or virtual, lunch is on us either way.",
  },
};

/**
 * What a post is about, for its calls to action: the HUB system (the "See
 * StreetPrint" button, the Lunch & Learn topic) or, for a post about no one
 * system, its subject ("parking lots"), which becomes the topic alone.
 */
export function postFocus(post: PostMeta): { system?: string; topic?: string } {
  const system = primarySystem(post.title, post.slug, post.products, post.declaredProducts);
  const subject = post.applications[0]?.toLowerCase();
  return { system, topic: system ?? subject };
}

const PHONES = [
  { office: "East", display: "416-540-9287", tel: "+14165409287" },
  { office: "West", display: "604-309-8212", tel: "+16043098212" },
];

export default function PostConversion({ post }: { post: PostMeta }) {
  const ask = ASK[post.category] ?? ASK["Blog"];
  const section = sectionFor(post.category);
  const { system, topic } = postFocus(post);
  const productSlug = system ? PRODUCT_SLUGS[system] : undefined;

  const secondary = "inline-flex items-center justify-center px-6 rounded-lg font-semibold text-sm transition-colors hover:bg-[var(--ink-05)] border border-[var(--ink-20)]";

  // No page margins of its own: the post page sets it in the reading column.
  return (
    <div>
      <div
        className="relative overflow-hidden rounded-2xl p-7 sm:p-10"
        style={{
          background: "var(--bg-card)",
          border: "1px solid rgba(249,115,22,0.28)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 18px 48px rgba(0,0,0,0.07)",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} aria-hidden="true" />
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: section.text }}>
          Lunch &amp; Learn
        </p>
        <h2
          className="font-black mb-3"
          style={{
            fontSize: "clamp(1.45rem, 2.6vw, 2.15rem)",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          {ask.heading}
        </h2>
        <p className="text-[15px] leading-relaxed mb-7" style={{ color: "var(--ink-68)", maxWidth: "58ch" }}>
          {ask.body}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={lunchLearnHref(topic, "insights")}
            className="inline-flex items-center justify-center gap-2 px-7 rounded-lg font-bold text-sm transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
              color: "var(--on-accent)",
              boxShadow: "0 6px 20px rgba(249,115,22,0.28)",
              minHeight: 48,
            }}
          >
            Book a Lunch &amp; Learn
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link href={productSlug ? `/products/${productSlug}` : "/products"} className={secondary} style={{ color: "var(--text-primary)", minHeight: 48 }}>
            {productSlug ? `See ${system}` : "See the systems"}
          </Link>
        </div>

        {/* Both offices, as targets a thumb can hit, written the house way
            ("West · 604-309-8212", docs/STYLE.md). */}
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-0 text-[13px]" style={{ color: "var(--text-muted)" }}>
          <span>Or call</span>
          {PHONES.map((p) => (
            <a
              key={p.tel}
              href={`tel:${p.tel}`}
              className="inline-flex items-center rounded-md px-2 -mx-0.5 font-semibold tabular-nums transition-colors hover:text-[var(--accent-text)] hover:bg-[var(--ink-05)]"
              style={{ color: "var(--text-secondary)", minHeight: 44 }}
            >
              {p.office} · {p.display}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Product display name → product page slug. */
export const PRODUCT_SLUGS: Record<string, string> = {
  TrafficPatternsXD: "traffic-patterns-xd",
  TrafficPatterns: "traffic-patterns",
  StreetBond: "streetbond",
  StreetBondSR: "streetbondsr",
  StreetPrint: "streetprint",
  MMAX: "mmax",
  DecoMark: "decomark",
  DuraTherm: "duratherm",
  DuraShield: "durashield",
  PreMark: "premark",
  AirMark: "airmark",
  ChipFill: "chipfill",
  AggreFill: "aggrefill",
};
