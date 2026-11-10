"use client";

/**
 * What a visitor sees once a form has gone: the confirmation, in view and
 * with the focus, and one or two quiet ways on.
 *
 * The final QA of 10 Nov 2026 measured the three forms after a send, with the
 * request answered inside the browser so nothing left it. The confirmation
 * replaces the form and is shorter than it, and the page stayed where the
 * Send button had been:
 *  - the printed-book form: "Request received." sat 450px above a phone's
 *    screen and under the bar on a laptop, with the footer in view;
 *  - the contact form on a phone: "Message sent" sat 90px above the screen,
 *    with the offices in view;
 *  - on all three the focus fell back to the page's start, so a keyboard or
 *    a screen reader was told nothing.
 * A visitor who can't see that a request went is one who sends it twice, or
 * leaves unsure. So the panel takes the focus (its heading, which a screen
 * reader then reads) and, only when it isn't already whole on the screen,
 * moves to the middle of it. role="status" tells assistive technology the
 * same thing where the focus alone doesn't.
 *
 * The page moves by itself here, so the bar stays as it is
 * (components/sections/useTuckAway.ts); the middle of the screen is clear of
 * it either way.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ideaBook } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";

export function SentPanel({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const heading = el.querySelector<HTMLElement>("[data-sent-heading]") ?? el;
    if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    // It takes the focus to be read, not to be used: no ring round a heading.
    heading.style.outline = "none";
    heading.focus({ preventScroll: true });
    // Whole on the screen already (a laptop's contact form, the Lunch & Learn
    // card): leave the page where it is. 84px: the bar and a little air.
    // "instant": html scrolls smoothly, and "auto" would take that up. An
    // older browser that doesn't know the word throws on it, and nothing
    // here may break a form that has just been sent: it gets the plain call.
    const r = el.getBoundingClientRect();
    const whole = r.top >= 84 && r.bottom <= window.innerHeight - 12;
    if (whole) return;
    try {
      el.scrollIntoView({ block: "center", behavior: "instant" });
    } catch {
      el.scrollIntoView();
    }
  }, []);

  return (
    <div ref={ref} role="status" className={className} style={style}>
      {children}
    </div>
  );
}

export interface NextStep {
  label: string;
  href: string;
}

/**
 * The book as a way on, by its one name (lib/catalogue.ts) and only while it
 * is switched on (lib/feature-flags.ts): with the book off its address is a
 * 404, and this would be the one link left pointing at it.
 */
export const bookStep = (label = `Read the ${ideaBook.short}`): NextStep[] =>
  showCatalogue() ? [{ label, href: ideaBook.href }] : [];

/** The jobs, written up: the blog's Projects section. */
export const PROJECTS_STEP: NextStep = { label: "See recent projects", href: "/blog/projects" };

/**
 * One or two ways on, under the confirmation (Vern, 10 Nov 2026: the sales
 * funnels, "gentle"). Text links, never buttons: the visitor has just done
 * the thing the page asked for.
 */
export function NextSteps({ lead = "While you wait", steps }: { lead?: string; steps: NextStep[] }) {
  if (!steps.length) return null;
  return (
    <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--ink-08)" }}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
        {lead}
      </p>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-6">
        {steps.map((s) => (
          <Link key={s.href} href={s.href} className="link-arrow">
            {s.label}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
