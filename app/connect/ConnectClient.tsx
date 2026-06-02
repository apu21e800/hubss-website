"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import PrizeDrawForm from "./PrizeDrawForm";

type View = "cards" | "draw" | "already";

interface ConnectClientProps {
  formToken:        string;
  hasEnteredBefore: boolean;
}

// ── Analytics helpers ─────────────────────────────────────────────────────
// Fire both GA4 (window.gtag) and Vercel Analytics. Skip silently if either
// isn't loaded — keeps SSR + ad-blocked browsers from throwing.
function fireEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* ignore */
  }
  try {
    track(name, params as Record<string, string | number | boolean | null>);
  } catch {
    /* ignore */
  }
}

export default function ConnectClient({ formToken, hasEnteredBefore }: ConnectClientProps) {
  const [view, setView] = useState<View>("cards");

  // Fire the view event exactly once per session load.
  useEffect(() => {
    fireEvent("connect_view");
  }, []);

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #0f1620 0%, #0d1117 100%)",
        color: "var(--text-primary)",
      }}
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-10 sm:pt-16 pb-16">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <header className="mb-10 sm:mb-12 text-center">
          <div className="mx-auto mb-7 inline-flex">
            <Image
              src="/images/hub-logo-white.png"
              alt="HUB Surface Systems"
              width={220}
              height={64}
              priority
              className="h-12 sm:h-14 w-auto"
              style={{ objectFit: "contain" }}
            />
          </div>
          <h1
            className="font-black tracking-tight"
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome to HUB Surface Systems.
          </h1>
          <p
            className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed"
            style={{ color: "var(--text-body)" }}
          >
            Decorative pavement, road safety markings, and surface solutions —
            pick where you&apos;d like to go.
          </p>
          <div
            aria-hidden
            className="mx-auto mt-6 h-[3px] w-12 rounded-full"
            style={{ background: "#F97316" }}
          />
        </header>

        {/* ── Card grid OR prize draw form ─────────────────────────── */}
        {view === "cards" ? (
          <div
            className="grid gap-4 sm:gap-5 md:grid-cols-2"
            role="navigation"
            aria-label="Choose where to go"
          >
            <ConnectCard
              href="/catalogue"
              eyebrow="Browse"
              title="Virtual Catalogue"
              subtitle="Our 2026 product book — flip through every system."
              icon={<BookIcon />}
              onClick={() => fireEvent("connect_catalogue_click", { position: 1, destination: "/catalogue" })}
            />

            <ConnectCard
              as="button"
              eyebrow={hasEnteredBefore ? "Entered" : "Win"}
              title={hasEnteredBefore ? "You're in the Prize Draw" : "Enter the Prize Draw"}
              subtitle={
                hasEnteredBefore
                  ? "Your entry is in. Winners announced after the show."
                  : "One quick form. Winner announced after the show."
              }
              icon={<GiftIcon />}
              onClick={() => {
                if (hasEnteredBefore) {
                  setView("already");
                  return;
                }
                fireEvent("connect_draw_open", { position: 2 });
                setView("draw");
              }}
            />

            <ConnectCard
              href="/"
              eyebrow="Explore"
              title="Visit hubss.com"
              subtitle="Products, projects, and how it all comes together."
              icon={<GlobeIcon />}
              onClick={() => fireEvent("connect_website_click", { position: 3, destination: "/" })}
            />

            <ConnectCard
              href="/contact"
              eyebrow="Talk"
              title="Contact Us"
              subtitle="Spec questions, samples, or a Lunch & Learn."
              icon={<MailIcon />}
              onClick={() => fireEvent("connect_contact_click", { position: 4, destination: "/contact" })}
            />
          </div>
        ) : view === "draw" ? (
          <PrizeDrawForm
            formToken={formToken}
            onSubmitted={() => fireEvent("connect_draw_submit")}
            onBack={() => setView("cards")}
          />
        ) : (
          <AlreadyEnteredCard onBack={() => setView("cards")} />
        )}

        {/* ── Footer line ───────────────────────────────────────── */}
        <footer
          className="mt-12 text-center text-xs tracking-[0.18em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          hubss.com · Redefining hardscapes
        </footer>
      </div>

      {/* Card hover treatment — subtle orange edge + arrow shift.
          Lives here (not globals.css) to keep /connect self-contained. */}
      <style>{`
        .connect-card:hover {
          border-color: rgba(249,115,22,0.45) !important;
          box-shadow: 0 8px 32px -12px rgba(249,115,22,0.18);
        }
        .connect-card:hover .connect-card-arrow {
          transform: translateX(4px);
          color: #F97316;
        }
        @media (prefers-reduced-motion: reduce) {
          .connect-card,
          .connect-card .connect-card-arrow { transition: none !important; }
        }
      `}</style>
    </main>
  );
}

// ── Card primitive ───────────────────────────────────────────────────────
interface ConnectCardProps {
  href?: string;
  as?: "link" | "button";
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function ConnectCard({
  href,
  as,
  eyebrow,
  title,
  subtitle,
  icon,
  onClick,
}: ConnectCardProps) {
  const inner = (
    <div className="flex h-full items-start gap-4">
      <div
        className="shrink-0 grid place-items-center rounded-xl"
        style={{
          width: 52,
          height: 52,
          background: "rgba(249,115,22,0.12)",
          color: "#F97316",
        }}
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5"
          style={{ color: "#F97316" }}
        >
          {eyebrow}
        </p>
        <p
          className="font-semibold leading-snug"
          style={{
            color: "var(--text-primary)",
            fontSize: "17px",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </p>
        <p
          className="mt-1.5 text-[14px] leading-snug"
          style={{ color: "var(--text-body)" }}
        >
          {subtitle}
        </p>
      </div>
      <div
        className="connect-card-arrow shrink-0 self-center transition-all duration-200"
        style={{ color: "var(--text-secondary)" }}
        aria-hidden
      >
        <ArrowIcon />
      </div>
    </div>
  );

  const sharedClass =
    "group connect-card block w-full text-left rounded-2xl p-5 sm:p-6 min-h-[112px] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500";
  const sharedStyle: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
  };

  if (as === "button" || !href) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={sharedClass}
        style={sharedStyle}
      >
        {inner}
      </button>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={sharedClass} style={sharedStyle}>
      {inner}
    </Link>
  );
}

// ── Inline icons (no extra lib) ───────────────────────────────────────────
function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function GiftIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C9 3 12 6 12 8 12 6 15 3 16.5 3a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function AlreadyEnteredCard({ onBack }: { onBack: () => void }) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => headingRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl p-6 sm:p-10 text-center"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="mx-auto mb-5 grid place-items-center rounded-full"
        style={{
          width: 64,
          height: 64,
          background: "rgba(249,115,22,0.15)",
          color: "#F97316",
        }}
        aria-hidden
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-xl sm:text-2xl font-bold mb-2 outline-none"
        style={{ color: "var(--text-primary)" }}
      >
        You&apos;re already entered.
      </h2>
      <p className="text-[15px]" style={{ color: "var(--text-body)" }}>
        We have your details — winners announced after the show.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-7 rounded-lg px-5 py-3 text-sm font-semibold transition-all"
        style={{ background: "#F97316", color: "#fff", minHeight: 44 }}
      >
        Back to options
      </button>
    </div>
  );
}
