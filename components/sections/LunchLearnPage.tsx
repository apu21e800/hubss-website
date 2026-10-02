"use client";

/**
 * /lunch-learn, rebuilt 30 Sep 2026. Vern: "optimize the L&L page, it needs work."
 *
 * What was wrong with the page it replaces (the boardroom card over
 * LunchLearnFunnel's sections):
 * - On a phone the form sat about 1,000 px down, under the pitch, four
 *   bullets and four chips, inside a card inside a card.
 * - It said the same four facts three times (bullets, chips, FAQ) and never
 *   showed a photograph, on a site where every other page leads with one.
 * - Bookings were not counted: the funnel's form sent generate_lead and
 *   lunch_learn_submit, the boardroom form that replaced it on 22 Sep sent
 *   nothing. The shared form hook in LunchLearnV2.tsx sends both again.
 * - The card animated in from opacity 0, so the page's h1 and form were
 *   invisible until the JavaScript ran.
 * - It was dark from top to bottom. Round 3 (28 Sep) put the reading on paper
 *   under a dark top on the product, application and Insights pages; this page
 *   now follows the same rule and closes in the dark like they do.
 *
 * The page: a dark top with the pitch and the form side by side (on a phone
 * the form comes straight after the headline), topic tiles that put the topic
 * into the form, then on paper what you walk away with, who it is for, the
 * trusted-by band and the questions, and a dark closing band with both
 * offices. Moose hosts, as in every version (Doug's orders).
 *
 * The mid-page copy can still come from Sanity (app/lunch-learn/page.tsx
 * decides); the topic tiles and the facts are code.
 */

import PhotoImage from "@/components/ui/PhotoImage";
import ChromeImg from "@/components/ui/ChromeImg";
import TrustedByMarquee from "@/components/sections/TrustedByMarquee";
import { CHROME_MARKS } from "@/lib/chrome-images.mjs";
import {
  useLunchLearnForm,
  setLunchLearnTopic,
  TopicChip,
  Field,
  Honeypot,
  SuccessPanel,
  ErrorNote,
} from "@/components/sections/LunchLearnV2";
import {
  LL_TOPICS,
  type LunchLearnItem,
  type LunchLearnPersona,
  type LunchLearnFaq,
  type LunchLearnTopic,
} from "@/lib/lunch-learn-content";

const MOOSE = { src: CHROME_MARKS.moose, alt: "Moose, the HUB Surface Systems site dog, in his hard hat and safety vest" };

const GRADIENT_TEXT: React.CSSProperties = {
  background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const H2_STYLE: React.CSSProperties = {
  fontSize: "clamp(1.85rem, 3.4vw, 2.75rem)",
  lineHeight: 1.05,
  letterSpacing: "-0.03em",
  color: "var(--text-primary)",
};

const OFFICES = [
  { region: "East", name: "Doug Bain", place: "Milton, Ontario", phone: "416-540-9287", email: "doug.bain@hubss.com" },
  { region: "West", name: "Cleve Stordy", place: "Ladysmith, British Columbia", phone: "604-309-8212", email: "cleve.stordy@hubss.com" },
];

const tel = (p: string) => `tel:+1${p.replace(/-/g, "")}`;

function Eyebrow({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="text-[11px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "var(--accent-text)" }}>
      {children}
    </p>
  );
}

function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/** Scroll to the form and put the cursor in it, gently unless the visitor asked for no motion. */
function goToForm() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("book")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => document.getElementById("ll-name")?.focus({ preventScroll: true }), reduce ? 0 : 500);
}

// ── The form ─────────────────────────────────────────────
function BookingPanel() {
  const f = useLunchLearnForm(true);
  return (
    <div
      className="relative rounded-2xl p-6 sm:p-7"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}
    >
      <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />
      {f.submitState.status === "success" ? (
        <SuccessPanel message={f.submitState.message} />
      ) : (
        <form onSubmit={f.handleSubmit} className="space-y-3.5" aria-labelledby="ll-form-title">
          <div className="mb-4">
            <h2 id="ll-form-title" className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>Book your session</h2>
            <p className="text-[13px] mt-1" style={{ color: "var(--ink-55)" }}>Confirmed within one business day.</p>
          </div>
          {f.topic && <TopicChip topic={f.topic} onClear={f.clearTopic} />}
          <Honeypot value={f.formData.website} onChange={f.handleChange} />
          <div>
            <p id="ll-format" className="text-[11px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: "var(--ink-55)" }}>Format</p>
            <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="ll-format">
              {["In-person", "Virtual", "Either"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={f.format === opt}
                  onClick={() => f.setFormat(opt)}
                  className="rounded-lg text-[13px] font-semibold transition-all active:scale-[0.97]"
                  style={
                    f.format === opt
                      ? { background: "rgba(249,115,22,0.16)", border: "1px solid rgba(249,115,22,0.5)", color: "var(--accent-text)", minHeight: 44 }
                      : { background: "var(--ink-05)", border: "1px solid var(--ink-10)", color: "var(--ink-65)", minHeight: 44 }
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field id="ll-name" autoComplete="name" name="name" placeholder="Your name" required value={f.formData.name} onChange={f.handleChange} />
            <Field autoComplete="email" name="email" placeholder="Email address" type="email" required value={f.formData.email} onChange={f.handleChange} />
          </div>
          <Field autoComplete="organization" name="company" placeholder="Organization" value={f.formData.company} onChange={f.handleChange} />
          <div className="grid grid-cols-2 gap-3.5">
            <Field autoComplete="address-level2" name="city" placeholder="City" value={f.formData.city} onChange={f.handleChange} />
            <Field autoComplete="tel" name="phone" placeholder="Phone" type="tel" value={f.formData.phone} onChange={f.handleChange} />
          </div>
          <button
            type="submit"
            disabled={f.submitState.status === "loading"}
            className="w-full py-4 rounded-xl font-bold text-[15px] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "var(--on-accent)", boxShadow: "0 6px 24px rgba(249,115,22,0.35)" }}
          >
            {f.submitState.status === "loading" ? "Sending…" : "Book a Lunch & Learn"}
          </button>
          <p className="text-center text-[12px]" style={{ color: "var(--ink-55)" }}>No obligation. Lunch on us, or a $25 voucher if it&apos;s virtual.</p>
          {f.submitState.status === "error" && <ErrorNote message={f.submitState.message} />}
          <p className="pt-3 text-center text-[12.5px]" style={{ color: "var(--ink-50)", borderTop: "1px solid var(--border-color)" }}>
            Prefer to call?{" "}
            <a href={tel(OFFICES[0].phone)} className="font-semibold whitespace-nowrap hover:text-[var(--accent-text)] transition-colors" style={{ color: "var(--ink-70)" }}>East · {OFFICES[0].phone}</a>
            {" · "}
            <a href={tel(OFFICES[1].phone)} className="font-semibold whitespace-nowrap hover:text-[var(--accent-text)] transition-colors" style={{ color: "var(--ink-70)" }}>West · {OFFICES[1].phone}</a>
          </p>
        </form>
      )}
    </div>
  );
}

// ── The top: pitch + form ────────────────────────────────
const FACTS = [
  {
    v: "45 minutes",
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  },
  {
    v: "In person or online",
    icon: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  },
  {
    v: "Lunch on HUB",
    icon: <><path d="M7 3v8a2 2 0 0 0 2 2v8" /><path d="M5 3v5a2 2 0 0 0 4 0V3" /><path d="M17 3c-2 1-3 3.5-3 6.5h3V21" /></>,
  },
];

function Top() {
  return (
    <section data-surface="shell" aria-labelledby="ll-title" className="relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 88% 8%, rgba(249,115,22,0.13) 0%, transparent 52%), radial-gradient(ellipse at 6% 96%, rgba(234,179,8,0.06) 0%, transparent 46%)" }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-9 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 lg:gap-y-10">
          {/* The pitch. Rendered as it will stand: nothing here waits for
              JavaScript to fade in, because it is the page's h1. */}
          <div className="lg:col-span-7 lg:row-start-1">
            <div className="flex items-center gap-4 mb-6 sm:mb-7">
              {/* Moose breaks out of his ring, as on the boardroom card */}
              <span className="relative flex-shrink-0 w-[64px] h-[64px] sm:w-[72px] sm:h-[72px]">
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(249,115,22,0.14)", border: "2px solid rgba(249,115,22,0.5)", boxShadow: "0 0 0 3px rgba(249,115,22,0.12), 0 6px 20px rgba(0,0,0,0.35)" }}
                />
                <ChromeImg
                  family="moose"
                  src={MOOSE.src}
                  alt={MOOSE.alt}
                  width={320}
                  height={400}
                  loading="eager"
                  sizes="(min-width: 640px) 92px, 81px"
                  className="absolute bottom-0 left-1/2 w-auto"
                  style={{ height: "127%", maxWidth: "none", transform: "translateX(-50%)", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.45))" }}
                />
              </span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--accent-text)" }}>Lunch &amp; Learn</p>
                <p className="text-[14px] font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>Hosted by the HUB team (and Moose, site dog)</p>
              </div>
            </div>
            <h1
              id="ll-title"
              className="font-black"
              style={{ fontSize: "clamp(2.35rem, 5.2vw, 4.1rem)", lineHeight: 0.98, letterSpacing: "-0.035em", color: "var(--text-primary)" }}
            >
              Specify with confidence.{" "}
              <span className="block" style={GRADIENT_TEXT}>Lunch is on us.</span>
            </h1>
            <p className="mt-5 text-[16px] sm:text-[17px] leading-relaxed max-w-xl" style={{ color: "var(--ink-70)" }}>
              A 45-minute working session for engineers, architects and municipal teams: real Canadian case
              studies, spec language for your next RFP, and samples on the table.
            </p>
          </div>

          {/* The form. #book is where every "Book a Lunch & Learn" link on the
              site lands (lib/lunch-learn.ts); on a phone it comes straight
              after the headline. */}
          <div id="book" className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 lg:self-start" style={{ scrollMarginTop: 88 }}>
            <BookingPanel />
          </div>

          <div className="lg:col-span-7 lg:row-start-2">
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FACTS.map((f) => (
                <li key={f.v} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "var(--ink-03)", border: "1px solid var(--border-color)" }}>
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(249,115,22,0.12)", color: "var(--accent-text)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.icon}</svg>
                  </span>
                  <span className="text-[14px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{f.v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex flex-wrap gap-x-2 text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--ink-45)" }}>
              <span className="whitespace-nowrap">27 years ·</span>
              <span className="whitespace-nowrap">1,000+ projects ·</span>
              <span className="whitespace-nowrap">coast to coast</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Topics ───────────────────────────────────────────────
/** Object positions that keep each subject in a 4:3 tile. */
const TILE_POSITION: Record<string, string> = { "public art": "50% 78%", airports: "50% 62%", "bike lanes": "50% 58%" };

function Topics({ topics }: { topics: LunchLearnTopic[] }) {
  const pick = (t: LunchLearnTopic) => {
    setLunchLearnTopic(t.topic);
    goToForm();
  };
  return (
    <section data-surface="paper" aria-labelledby="ll-topics" className="py-16 sm:py-20" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-4 items-end mb-8 sm:mb-10">
          <div className="lg:col-span-7">
            <Eyebrow>Session topics</Eyebrow>
            <h2 id="ll-topics" className="font-black" style={H2_STYLE}>Pick the work you&apos;re planning.</h2>
          </div>
          <p className="lg:col-span-5 text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Pick one and we build the session around it. Or leave it open and we cover the range.
          </p>
        </div>
        <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {topics.map((t) => (
            <li key={t.topic}>
              <button
                type="button"
                onClick={() => pick(t)}
                aria-label={`Book a session on ${t.topic}`}
                className="group relative block w-full overflow-hidden rounded-xl text-left focus-visible:outline-offset-4"
                style={{ aspectRatio: "4 / 3", background: "var(--bg-card-surface)" }}
              >
                <PhotoImage
                  src={t.src}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, 48vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  style={{ objectPosition: TILE_POSITION[t.topic] ?? "50% 50%" }}
                />
                <span aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(12,12,12,0.86) 0%, rgba(12,12,12,0.34) 42%, rgba(12,12,12,0) 68%)" }} />
                <span className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-4 flex items-end justify-between gap-3">
                  <span className="font-bold text-[15px] sm:text-[19px] leading-tight" style={{ color: "#FFFFFF" }}>{t.label}</span>
                  <span className="hidden sm:inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors group-hover:bg-[#F97316]" style={{ color: "#FFFFFF", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)" }}>
                    Book this topic <Arrow size={12} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── What you walk away with ──────────────────────────────
function WalkAwayWith({ items, eyebrow, heading }: { items: LunchLearnItem[]; eyebrow: string; heading: string }) {
  return (
    <section data-surface="paper" aria-labelledby="ll-get" className="py-16 sm:py-20" style={{ background: "var(--bg-section-asphalt)", borderTop: "1px solid var(--border-color)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id="ll-get" className="font-black max-w-2xl" style={H2_STYLE}>{heading}</h2>
        <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {items.map((it) => (
            <li key={it.title} className="pt-5" style={{ borderTop: "2px solid var(--text-primary)" }}>
              <span className="text-[13px] font-black tracking-[0.18em]" style={{ color: "var(--accent-text)" }}>{it.num}</span>
              <h3 className="mt-3 text-[19px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{it.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{it.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── Who it's for ─────────────────────────────────────────
function WhoItsFor({ personas, eyebrow, heading }: { personas: LunchLearnPersona[]; eyebrow: string; heading: string }) {
  return (
    <section data-surface="paper" aria-labelledby="ll-who" className="py-16 sm:py-20" style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-color)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id="ll-who" className="font-black max-w-2xl" style={H2_STYLE}>{heading}</h2>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {personas.map((p) => (
            <li key={p.title} className="flex flex-col rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
              <span className="text-[10.5px] font-bold tracking-[0.14em] uppercase" style={{ color: "var(--accent-text)" }}>{p.badge}</span>
              <h3 className="mt-2.5 text-[17px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Questions ────────────────────────────────────────────
/**
 * <details>, so every answer is in the page for search engines and for the
 * FAQPage schema to match, and the questions open without any JavaScript.
 */
function Questions({ faqs, eyebrow, heading }: { faqs: LunchLearnFaq[]; eyebrow: string; heading: string }) {
  return (
    <section data-surface="paper" aria-labelledby="ll-faq" className="py-16 sm:py-20" style={{ background: "var(--bg-section-asphalt)", borderTop: "1px solid var(--border-color)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8">
        <div className="lg:col-span-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="ll-faq" className="font-black" style={H2_STYLE}>{heading}</h2>
          <p className="mt-4 text-[15px] leading-relaxed max-w-sm" style={{ color: "var(--text-secondary)" }}>
            Anything else, call the office nearest you.
          </p>
          <p className="mt-3 flex flex-col gap-1 text-[14px] font-semibold">
            {OFFICES.map((o) => (
              <a key={o.region} href={tel(o.phone)} className="inline-flex items-center hover:text-[var(--accent-text)] transition-colors" style={{ color: "var(--text-primary)", minHeight: 36 }}>
                {o.region} · {o.phone}
              </a>
            ))}
          </p>
        </div>
        <div className="lg:col-span-8" style={{ borderBottom: "1px solid var(--border-strong)" }}>
          {faqs.map((faq) => (
            <details key={faq.q} className="group" style={{ borderTop: "1px solid var(--border-strong)" }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden" style={{ minHeight: 44 }}>
                <span className="text-[16.5px] font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{faq.q}</span>
                <span aria-hidden="true" className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 group-open:rotate-45" style={{ background: "var(--ink-06)", color: "var(--accent-text)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </summary>
              <p className="pb-6 pr-12 text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── The close ────────────────────────────────────────────
function Close() {
  return (
    <section data-surface="shell" aria-labelledby="ll-close" className="relative overflow-hidden py-16 sm:py-20" style={{ background: "var(--bg-primary)" }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 12% 50%, rgba(249,115,22,0.12) 0%, transparent 55%)" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
        <div className="lg:col-span-6">
          <Eyebrow>Lunch &amp; Learn</Eyebrow>
          <h2 id="ll-close" className="font-black" style={{ ...H2_STYLE, color: "var(--text-primary)" }}>
            Book a session for your team.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed max-w-md" style={{ color: "var(--ink-70)" }}>
            45 minutes, in your office or online. Lunch is on us.
          </p>
          <a
            href="#book"
            onClick={(e) => { e.preventDefault(); goToForm(); }}
            className="mt-7 inline-flex items-center gap-2 rounded-lg px-6 text-[15px] font-bold transition-[filter] hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "var(--on-accent)", boxShadow: "0 6px 24px rgba(249,115,22,0.35)", minHeight: 50 }}
          >
            Book a Lunch &amp; Learn <Arrow />
          </a>
        </div>
        <ul className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OFFICES.map((o) => (
            <li key={o.region} className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
              <p className="text-[10.5px] font-bold tracking-[0.16em] uppercase" style={{ color: "var(--accent-text)" }}>{o.region} office</p>
              <p className="mt-2 text-[17px] font-bold" style={{ color: "var(--text-primary)" }}>{o.name}</p>
              <p className="text-[13px]" style={{ color: "var(--ink-55)" }}>{o.place}</p>
              <p className="mt-3 flex flex-col text-[14px] font-semibold">
                <a href={tel(o.phone)} className="inline-flex items-center hover:text-[var(--accent-text)] transition-colors" style={{ color: "var(--ink-80)", minHeight: 36 }}>{o.phone}</a>
                <a href={`mailto:${o.email}`} className="inline-flex items-center hover:text-[var(--accent-text)] transition-colors break-all" style={{ color: "var(--ink-80)", minHeight: 36 }}>{o.email}</a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export interface LunchLearnPageProps {
  whatYouGet: LunchLearnItem[];
  personas: LunchLearnPersona[];
  faqs: LunchLearnFaq[];
  headings: {
    whatYouGetEyebrow: string;
    whatYouGetHeading: string;
    personasEyebrow: string;
    personasHeading: string;
    faqEyebrow: string;
    faqHeading: string;
  };
}

export default function LunchLearnPage({ whatYouGet, personas, faqs, headings }: LunchLearnPageProps) {
  return (
    <>
      <Top />
      <Topics topics={LL_TOPICS} />
      <WalkAwayWith items={whatYouGet} eyebrow={headings.whatYouGetEyebrow} heading={headings.whatYouGetHeading} />
      <WhoItsFor personas={personas} eyebrow={headings.personasEyebrow} heading={headings.personasHeading} />
      <TrustedByMarquee />
      <Questions faqs={faqs} eyebrow={headings.faqEyebrow} heading={headings.faqHeading} />
      <Close />
    </>
  );
}
