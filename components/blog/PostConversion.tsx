import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import type { FieldNoteTypeMeta } from "@/lib/field-notes-taxonomy";

/**
 * End-of-post conversion block — the Field Notes lead engine (Aug 2026).
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
 */

const ASK: Record<string, { eyebrow: string; heading: string; body: string; cta: string }> = {
  "Guide": {
    eyebrow: "Still deciding?",
    heading: "Bring the rest of this decision to your team.",
    body: "A 45-minute Lunch & Learn covers the comparisons this piece opened — lifecycle math for your climate, spec language you can paste into a tender, and material samples on the table for the people who have to sign off.",
    cta: "Book a Lunch & Learn",
  },
  "Case Study": {
    eyebrow: "Want this on your project?",
    heading: "See the system that did it — in person.",
    body: "We bring the same materials from this project to your office: physical samples, the technical data sheets, and the certified installer list for your region. Lunch included, no obligation.",
    cta: "Book a Lunch & Learn",
  },
  "Project Profile": {
    eyebrow: "Something like this?",
    heading: "Let's talk about what your surface could do.",
    body: "Book a 45-minute session and we will walk your team through the systems behind installations like this one — what they cost, how they hold up through Canadian winters, and who installs them near you.",
    cta: "Book a Lunch & Learn",
  },
  "White Paper": {
    eyebrow: "Take it further",
    heading: "Turn the document into a working session.",
    body: "We present this material directly to public works, engineering, and procurement teams — the engineering challenges, the material systems, and the cost modelling, with time for the questions a document cannot answer.",
    cta: "Book a Lunch & Learn",
  },
  "Blog": {
    eyebrow: "Go deeper",
    heading: "Get the technical version, over lunch.",
    body: "A 45-minute Lunch & Learn puts the specifications, samples, and Canadian case data in front of your whole team. In your office or virtual — lunch is on us either way.",
    cta: "Book a Lunch & Learn",
  },
};

export default function PostConversion({
  post,
  type,
}: {
  post: PostMeta;
  type: FieldNoteTypeMeta;
}) {
  const ask = ASK[post.category] ?? ASK["Blog"];
  // Secondary link points at the system the post actually spends its time on,
  // so "See the system" is a promise the next page keeps.
  const primaryProduct = post.products[0];
  const productSlug = primaryProduct
    ? PRODUCT_SLUGS[primaryProduct]
    : undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div
        className="rounded-2xl p-7 sm:p-10 lg:p-12"
        style={{
          background: "var(--bg-card)",
          border: "1px solid rgba(249,115,22,0.22)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <p
          className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3"
          style={{ color: type.text }}
        >
          {ask.eyebrow}
        </p>
        <h2
          className="font-black mb-3"
          style={{
            fontSize: "clamp(1.45rem, 2.6vw, 2.15rem)",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: "#F5F0EB",
          }}
        >
          {ask.heading}
        </h2>
        <p
          className="text-[15px] leading-relaxed mb-7"
          style={{ color: "rgba(255,255,255,0.68)", maxWidth: "58ch" }}
        >
          {ask.body}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/lunch-learn"
            className="inline-flex items-center gap-2 px-7 rounded-lg font-bold text-sm transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
              color: "#fff",
              boxShadow: "0 6px 24px rgba(249,115,22,0.35)",
              minHeight: 48,
            }}
          >
            {ask.cta}
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {productSlug ? (
            <Link
              href={`/products/${productSlug}`}
              className="inline-flex items-center px-6 rounded-lg font-semibold text-sm transition-colors hover:bg-white/5"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#F5F0EB",
                minHeight: 48,
              }}
            >
              See {primaryProduct}
            </Link>
          ) : (
            <Link
              href="/products"
              className="inline-flex items-center px-6 rounded-lg font-semibold text-sm transition-colors hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#F5F0EB", minHeight: 48 }}
            >
              See the systems
            </Link>
          )}

          <a
            href="tel:+14165409287"
            className="text-[13px] font-semibold transition-colors hover:text-orange-400"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            or call 416-540-9287
          </a>
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
