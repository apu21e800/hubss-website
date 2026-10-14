"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect } from "react";
import { track } from "@vercel/analytics";
import { CLOSED_CLASS, CLOSED_DAYS, CLOSED_KEY } from "@/lib/idea-book-card";

// Before paint in the browser; a no-op on the server.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The Idea Book card in the homepage hero (Doug, 14 Oct 2026: "a clean CTA to
 * the booklet on the homepage"; Vern: a card at the bottom right that a
 * visitor can close). It sits in the hero's lower right on a laptop or wider,
 * level with the hero's buttons, and under the buttons on a phone or a
 * portrait tablet (on a short screen in between it stays out of the way, and
 * the Idea Book band below carries the ask). It belongs to the hero, so it
 * scrolls away with it rather than following the visitor down the page.
 *
 * Closing it hides it for CLOSED_DAYS (lib/idea-book-card.ts). HeroSlideshow
 * writes CLOSED_SCRIPT just before it, which marks <html> while the visitor
 * has it closed, so a returning visitor never sees it flash, and on a phone,
 * where it takes room under the buttons, nothing below moves as the page
 * loads.
 *
 * A click on it is reported as cta_click like every link into the Idea Book
 * (components/AnalyticsEvents.tsx); closing it as idea_book_card_close.
 */

export interface IdeaBookHeroCardProps {
  href: string;
  /** "The HUB Idea Book · Volume 5" */
  title: string;
  /** One line from Studio's homepage copy (the Idea Book section's heading). */
  line: string;
  /** "Idea Book", for the action. */
  short: string;
  cover: string;
  coverAlt: string;
}

export default function IdeaBookHeroCard({ href, title, line, short, cover, coverAlt }: IdeaBookHeroCardProps) {
  // The inline script only runs when the homepage is the first page loaded.
  // Arriving from another page of the site, this does its job before paint.
  useBeforePaint(() => {
    try {
      const t = Number(localStorage.getItem(CLOSED_KEY));
      if (t && Date.now() - t < CLOSED_DAYS * 864e5) document.documentElement.classList.add(CLOSED_CLASS);
    } catch {
      // Storage blocked: the card shows, as it does for a first visit.
    }
  }, []);

  function close() {
    try {
      localStorage.setItem(CLOSED_KEY, String(Date.now()));
    } catch {
      // Private windows and blocked storage: it closes for this visit only.
    }
    document.documentElement.classList.add(CLOSED_CLASS);
    window.gtag?.("event", "idea_book_card_close", { event_category: "engagement" });
    track("idea_book_card_close");
  }

  return (
    <aside className="ib-card" aria-label={title}>
      <style>{`
        .${CLOSED_CLASS} .ib-card { display: none; }
        .ib-card {
          position: relative;
          margin-top: 1.5rem;
          width: 100%;
          max-width: 26rem;
          animation: ib-card-in 0.5s ease-out 0.9s both;
        }
        @media (min-width: 1024px) {
          .ib-card { margin-top: 0; width: 21.5rem; flex-shrink: 0; }
        }
        /* Between a phone and a laptop the card sits under the buttons, and
           on a short screen there (a landscape tablet, a small window) it
           pushed the headline up into the HUB sign. The band further down
           the page keeps the call to action on those screens. */
        @media (min-width: 640px) and (max-width: 1023px) and (max-height: 799px) {
          .ib-card { display: none; }
        }
        @keyframes ib-card-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ib-card { animation: none; }
        }
        .ib-card-link {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.75rem 0.875rem 0.75rem 0.75rem;
          border-radius: 0.875rem;
          background: rgba(13, 17, 23, 0.72);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .ib-card-link:hover { border-color: rgba(249, 115, 22, 0.55); background: rgba(13, 17, 23, 0.82); }
        .ib-card-link:focus-visible { outline: 2px solid #f97316; outline-offset: 2px; }
        .ib-card-cover {
          width: 4rem;
          height: 4rem;
          flex-shrink: 0;
          border-radius: 0.25rem;
          object-fit: cover;
          /* Two page edges behind the cover, so it reads as a book. */
          box-shadow: 3px 3px 0 rgba(255, 255, 255, 0.22), 6px 6px 0 rgba(255, 255, 255, 0.1);
          transition: transform 0.25s ease;
        }
        .ib-card-link:hover .ib-card-cover { transform: translateY(-2px); }
        .ib-card-go { transition: transform 0.2s ease; }
        .ib-card-link:hover .ib-card-go { transform: translateX(2px); }
        .ib-card-close {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          width: 2.5rem;
          height: 2.5rem;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: rgba(255, 255, 255, 0.6);
          transition: color 0.2s ease, background 0.2s ease;
        }
        .ib-card-close:hover { color: #fff; background: rgba(255, 255, 255, 0.08); }
        .ib-card-close:focus-visible { outline: 2px solid #f97316; outline-offset: -2px; }
      `}</style>
      <Link href={href} className="ib-card-link">
        {/* The book's own cover raster: a plain <img>, never /_next/image (lib/catalogue.ts). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={coverAlt} width={64} height={64} decoding="async" className="ib-card-cover" />
        <span className="min-w-0">
          {/* The close button sits over the end of this line only. */}
          <span className="block pr-8 text-[12px] font-bold leading-tight" style={{ color: "#FDBA74" }}>
            {title}
          </span>
          <span className="mt-1 block text-[14px] font-semibold leading-snug text-white">{line}</span>
          <span className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-bold" style={{ color: "#FB923C" }}>
            Open the {short}
            <svg className="ib-card-go" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </Link>
      <button type="button" className="ib-card-close" onClick={close} aria-label={`Close the ${short} card`}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeWidth={2.2} strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  );
}
