"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { telHref, type SiteSettings } from "@/lib/site-settings";

/**
 * The way to a price, kept under a thumb (4 Nov 2026, the phone walk of the
 * eleven pages the ads land on). Below lg the first screen of a product or
 * application page shows the two offices' phones and "Send us the project"
 * (components/sections/PricingStrip.tsx); after that the page runs 2,800 to
 * 4,300px (four to six screens) with no way to call or send until the Lunch
 * & Learn band, and the site's bar hides as the visitor scrolls down. So
 * once the first-screen card has scrolled off, this bar sits at the foot of
 * the screen with the same two things: Call (the two offices, a tap each,
 * with their towns, since a visitor can't be expected to know which office
 * is theirs) and Send the project. It leaves when the card is back in view
 * and at the page's close (the footer, which has the same numbers), and the
 * overlays (the menu, search, the lightbox) draw over it.
 *
 * Not the StickyBar of 2026-09 (components/StickyBar.tsx, off since 25 Sep:
 * every page, on a scroll up, "See the Systems" and "Book a Lunch & Learn",
 * the same ask a third time). This one is phone-only, on the pages a visitor
 * reaches from an ad, and it is the price path those ads promise ("Your
 * regional office prices the project"). The Lunch & Learn is in the
 * first-screen card and the band at the foot.
 *
 * Every tel: link is counted as phone_click, with its office, and the link
 * into /contact as cta_click, by the one listener in the root layout
 * (components/AnalyticsEvents.tsx): nothing to wire here.
 */
export default function PhoneActionBar({
  offices,
  contactHref,
}: {
  offices: SiteSettings["offices"];
  contactHref: string;
}) {
  // The first-screen card has scrolled off the top.
  const [past, setPast] = useState(false);
  // The page's close is in view.
  const [atFoot, setAtFoot] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const officesId = useId();

  // Read on every scroll (one frame at a time), not with an
  // IntersectionObserver: an observer only reports a change of state, so a
  // jump that carried the card from below the screen to above it between two
  // frames (a link to a place far down the page, a restored scroll position)
  // would have left the bar hidden for good (the review of #129).
  useEffect(() => {
    const card = document.querySelector("[data-pricing-strip]");
    if (!card) return;
    const foot = document.querySelector("footer");
    let frame = 0;
    const read = () => {
      frame = 0;
      setPast(card.getBoundingClientRect().bottom < 0);
      setAtFoot(foot ? foot.getBoundingClientRect().top < window.innerHeight : false);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const shown = past && !atFoot;

  // The office list folds away with the bar.
  useEffect(() => {
    if (!shown) setCallOpen(false);
  }, [shown]);

  return (
    <div className="cta-bar lg:hidden" data-shown={shown ? "true" : "false"} aria-hidden={!shown}>
      {callOpen && (
        <div id={officesId} className="cta-bar-offices" role="group" aria-label="Call an office">
          {[
            { label: "East office", ...offices.east },
            { label: "West office", ...offices.west },
          ].map((o) => (
            <a key={o.label} href={telHref(o.phone)} className="cta-bar-office" data-tap="44">
              <span className="cta-bar-office-where">
                {o.label} · {o.place}
              </span>
              <span className="cta-bar-office-phone">{o.phone}</span>
            </a>
          ))}
        </div>
      )}
      <div className="cta-bar-row">
        <button
          type="button"
          className="btn-ghost"
          aria-expanded={callOpen}
          aria-controls={callOpen ? officesId : undefined}
          onClick={() => setCallOpen((v) => !v)}
        >
          Call
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ transform: callOpen ? "rotate(180deg)" : undefined, transition: "transform var(--dur-1) var(--ease-out)" }}
          >
            <path d="M6 15l6-6 6 6" />
          </svg>
        </button>
        <Link href={contactHref} className="btn-accent">
          Send the project
        </Link>
      </div>
    </div>
  );
}
