"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { track } from "@vercel/analytics";

export interface LunchLearnFunnelProps {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  subheading?: string;
  ctaLabel?: string;
  formHeading?: string;
  formSubheading?: string;
  submitLabel?: string;
  // Optional Sanity-sourced overrides for the mid-page sections. When unset,
  // the component falls back to the const arrays defined just below.
  whatYouGet?: { num: string; title: string; desc: string }[];
  personas?: { title: string; desc: string; badge: string }[];
  faqs?: { q: string; a: string }[];
  sectionHeadings?: {
    whatYouGetEyebrow?: string;
    whatYouGetHeading?: string;
    personasEyebrow?: string;
    personasHeading?: string;
    faqEyebrow?: string;
    faqHeading?: string;
  };
}

interface FormState {
  name: string;
  email: string;
  company: string;
  city: string;
  phone: string;
}

interface SubmitState {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

const WHAT_YOU_GET = [
  {
    num: "01",
    title: "Spec Language Ready for Your RFP",
    desc: "Pre-written specification language for thermoplastic crosswalks, MMA bus lanes, coloured bike lanes, and more. Copy it straight into your next tender document.",
  },
  {
    num: "02",
    title: "The Lifecycle Cost Math",
    desc: "Lifecycle cost math, side by side. How HUB systems deliver years of high-performance service versus repeated seasonal interventions — asphalt-life math your procurement team will ask for.",
  },
  {
    num: "03",
    title: "Samples, Sheets, and an Installer Map",
    desc: "Physical material samples, current technical data sheets, and the certified HUB applicator list for your region — everything a team needs to move from interest to tender.",
  },
];

const PERSONAS = [
  {
    title: "Municipal Engineers & Planners",
    desc: "Crosswalks, transit corridors, and complete streets that meet Vision Zero and Complete Streets specifications, with accessibility-aware design. Real installation data from Canadian municipalities coast to coast.",
    badge: "Vision Zero · Complete Streets",
  },
  {
    title: "Landscape Architects & Designers",
    desc: "12+ StreetPrint patterns, full StreetBond Pantone palette, and decorative surfaces engineered to outlast the design life of the asphalt beneath them. Snowplow-safe. Engineering-approved.",
    badge: "Public Art · Driveways",
  },
  {
    title: "Engineering & Consulting Firms",
    desc: "Lifecycle cost data, performance specs, and installation standards you can cite directly in tender documents — plus the certified HUB applicator contacts for your region.",
    badge: "Spec Support",
  },
  {
    title: "Contractors & Applicators",
    desc: "Learn about the HUB certified applicator program — territory-protected bidding and direct manufacturer support through the certified program.",
    badge: "Certified Applicator Program",
  },
];

const FAQS = [
  {
    q: "How long is the session?",
    a: "30–45 minutes of presentation, followed by open Q&A. We're respectful of your team's calendar and stick to the time we agree on.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. Sessions are how we introduce our systems to the people who specify them — no invoice, no minimum order, and no follow-up pressure.",
  },
  {
    q: "Who should be in the room?",
    a: "Engineers, planners, landscape architects, project managers, procurement — anyone who touches the surface spec. Sessions are built for mixed teams, and there's no cap on seats.",
  },
  {
    q: "In-person or virtual?",
    a: "Both. In-person sessions are available coast to coast through our certified applicator network. Virtual sessions use Zoom or Teams — we mail sample kits before we connect.",
  },
];

const CITIES = [
  "City of Toronto", "York Region", "City of Vancouver", "University of British Columbia",
  "City of Ottawa", "City of Calgary", "City of Brampton", "City of Mississauga",
  "TransLink", "City of Surrey", "City of Edmonton", "City of Winnipeg",
  "City of Burnaby", "City of Richmond Hill", "Halifax Regional Municipality",
  "City of Victoria", "District of Saanich", "Strathcona County",
];
const TICKER = [...CITIES, ...CITIES];

const STATS = [
  { value: "45 min", label: "Focused Session" },
  { value: "No Cost", label: "Hosted by HUB" },
  { value: "Lunch Included", label: "Every In-Person" },
  { value: "2 Offices", label: "Milton ON · Ladysmith BC" },
];

const FORMATS = ["In-Person", "Virtual", "Either"] as const;
type SessionFormat = (typeof FORMATS)[number];

export default function LunchLearnFunnel({
  eyebrow      = "Lunch & Learn · In-Person or Virtual · Coast to Coast",
  headingLine1 = "Specify with confidence.",
  headingLine2 = "Lunch is on us.",
  subheading   = "A focused 45-minute session that gives your team the technical grounding to specify decorative pavement, thermoplastic crosswalks, and coloured coatings — real Canadian case studies and spec language you can drop straight into your next RFP.",
  ctaLabel     = "Book a Session",
  formHeading  = "Book your Lunch & Learn",
  formSubheading = "Tell us who you are and where you are — we confirm date and details within one business day.",
  submitLabel  = "Book the Session →",
  whatYouGet,
  personas,
  faqs,
  sectionHeadings,
}: LunchLearnFunnelProps = {}) {
  const whatYouGetItems    = whatYouGet?.length ? whatYouGet : WHAT_YOU_GET;
  const personaItems       = personas?.length   ? personas   : PERSONAS;
  const faqItems           = faqs?.length       ? faqs       : FAQS;
  const whatYouGetEyebrow  = sectionHeadings?.whatYouGetEyebrow ?? "What You Walk Away With";
  const whatYouGetHeading  = sectionHeadings?.whatYouGetHeading ?? "Not a sales pitch. A working session.";
  const personasEyebrow    = sectionHeadings?.personasEyebrow   ?? "Who It's Built For";
  const personasHeading    = sectionHeadings?.personasHeading   ?? "Your Whole Team. One Session.";
  const faqEyebrow         = sectionHeadings?.faqEyebrow        ?? "Common Questions";
  const faqHeading         = sectionHeadings?.faqHeading        ?? "Everything You Need to Know";
  const [formData, setFormData] = useState<FormState>({
    name: "", email: "", company: "", city: "", phone: "",
  });
  const [format, setFormat] = useState<SessionFormat>("Either");
  const [hp, setHp] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Honeypot: bots that fill the hidden field get a silent "success".
    if (hp) {
      setSubmitState({ status: "success", message: "You're booked in. We'll be in touch within one business day to confirm your date and details." });
      return;
    }
    setSubmitState({ status: "loading" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, format, formType: "lunch-learn" }),
      });
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      setSubmitState({ status: "success", message: "You're booked in. We'll be in touch within one business day to confirm your date and details." });
      setFormData({ name: "", email: "", company: "", city: "", phone: "" });
      window.gtag?.("event", "generate_lead", { event_category: "conversion", form_type: "lunch-learn" });
      track("lunch_learn_submit", { form_type: "lunch-learn" });
    } catch {
      setSubmitState({ status: "error", message: "Something went wrong. Call us directly: 416-540-9287 (East) or 604-309-8212 (West)." });
    }
  };

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ── HERO ────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#070b12", minHeight: "80vh" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 12% 65%, rgba(249,115,22,0.18) 0%, transparent 55%)",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(234,179,8,0.09) 0%, transparent 60%)",
        }} />
        <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{
          background: "radial-gradient(ellipse at 90% 70%, rgba(249,115,22,0.08) 0%, transparent 50%)",
        }} />
        <div className="absolute top-0 inset-x-0 h-px" style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.5) 50%, transparent 100%)",
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-end" style={{ minHeight: "calc(80vh - 7rem)" }}>

            <motion.div
              className="pb-12 lg:pb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-bold tracking-[0.22em] uppercase mb-5" style={{ color: "#FB923C" }}>
                {eyebrow}
              </p>
              <h1
                className="font-black mb-6"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.04em",
                  color: "#F5F0EB",
                }}
              >
                {headingLine1}
                <br />
                <span style={{
                  background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {headingLine2}
                </span>
              </h1>
              <p
                className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {subheading}
              </p>

              <div className="flex flex-wrap gap-5 mb-10">
                {["30+ Years in Canada", "10 Provinces", "Lunch Included"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#f97316" }} />
                    <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>{t}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="#book"
                  className="inline-flex items-center justify-center gap-2 px-8 rounded-lg font-bold text-sm transition-all self-start hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                    color: "#fff",
                    boxShadow: "0 6px 28px rgba(249,115,22,0.42)",
                    minHeight: "48px",
                  }}
                >
                  {ctaLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <div className="flex items-center gap-4 flex-wrap">
                  <a href="tel:+14165409287" className="text-sm font-semibold transition-colors hover:text-orange-400" style={{ color: "rgba(255,255,255,0.45)" }}>
                    East: 416-540-9287
                  </a>
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                  <a href="tel:+16043098212" className="text-sm font-semibold transition-colors hover:text-orange-400" style={{ color: "rgba(255,255,255,0.45)" }}>
                    West: 604-309-8212
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative flex items-end justify-center lg:justify-end pb-12 lg:pb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ height: "clamp(310px, 42vw, 530px)" }}
            >
              <Image
                src="/images/lunch-learn/moose-final.png"
                alt="Moose, the HUB Surface Systems site dog, in a hard hat and safety vest — book a Lunch & Learn"
                width={256}
                height={290}
                style={{
                  width: "auto",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom",
                  filter: "drop-shadow(0 0 20px rgba(249,115,22,0.2))",
                  mixBlendMode: "screen",
                }}
                priority
                unoptimized
              />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none" style={{
          background: "linear-gradient(to bottom, transparent, var(--bg-section-asphalt))",
        }} />
      </section>

      {/* ── STATS STRIP — asphalt band starts here ──────────────────── */}
      <section
        className="py-10"
        style={{
          background: "var(--bg-section-asphalt)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="flex flex-col items-center text-center lg:border-r last:border-r-0"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <span
                  className="font-black mb-1"
                  style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                    letterSpacing: "-0.03em",
                    background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </span>
                {/* Solid #9CA3AF, not white-alpha: on the asphalt band (#16181B,
                    lighter than the old navy) rgba(255,255,255,0.45) composites
                    to ~4.3:1 — under WCAG AA's 4.5:1. #9CA3AF clears it at ~6.6:1
                    and matches the body-grey used on every asphalt card. */}
                <span className="text-xs font-semibold tracking-[0.12em] uppercase" style={{ color: "#9CA3AF" }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU WALK AWAY WITH — same asphalt band ──────────────── */}
      <section className="py-20 lg:py-24" style={{ background: "var(--bg-section-asphalt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FB923C" }}>
              {whatYouGetEyebrow}
            </p>
            <h2
              className="font-black"
              style={{
                fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#F5F0EB",
              }}
            >
              {whatYouGetHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whatYouGetItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="relative rounded-2xl p-8 flex flex-col gap-5"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                  style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }}
                />
                <span
                  className="font-black leading-none select-none"
                  style={{
                    fontSize: "4.25rem",
                    background: "linear-gradient(135deg, #F97316 0%, #EAB308 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    opacity: 0.85,
                  }}
                >
                  {item.num}
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-2 leading-snug" style={{ color: "#F5F0EB" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERFECT FOR — back to navy canvas ────────────────────── */}
      <section className="py-20" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FB923C" }}>
              {personasEyebrow}
            </p>
            <h2
              className="font-black"
              style={{
                fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#F5F0EB",
              }}
            >
              {personasHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personaItems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="flex flex-col p-8 rounded-xl"
                style={{
                  background: "var(--bg-card-neutral)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="font-semibold text-base leading-snug" style={{ color: "#F5F0EB", fontWeight: 500 }}>{p.title}</p>
                  <span
                    className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap"
                    style={{
                      background: "rgba(249,115,22,0.12)",
                      color: "#FB923C",
                      border: "1px solid rgba(249,115,22,0.22)",
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITY MARQUEE ─────────────────────────────────────── */}
      <div style={{ background: "var(--bg-primary)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-center text-[10px] font-bold tracking-[0.2em] uppercase pt-8 pb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
          You&apos;ll find HUB systems on the ground with
        </p>
        <div
          className="overflow-hidden pb-8"
          style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)" }}
        >
          <div className="flex gap-0 whitespace-nowrap" style={{ animation: "ll-marquee 40s linear infinite" }}>
            {TICKER.map((name, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
                <span className="text-sm font-medium px-5" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1 }}>{name}</span>
                <span aria-hidden="true" style={{ display: "block", width: 4, height: 4, borderRadius: "50%", background: "rgba(249,115,22,0.45)", flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ — asphalt band ───────────────────────────────── */}
      <section className="py-20 lg:py-24" style={{ background: "var(--bg-section-asphalt)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FB923C" }}>{faqEyebrow}</p>
            <h2 className="font-black" style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#F5F0EB" }}>
              {faqHeading}
            </h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <div key={faq.q} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", background: openFaq === i ? "var(--bg-card)" : "var(--bg-card-neutral)" }}>
                <button className="w-full text-left flex items-center justify-between gap-4 px-6 py-5" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-base" style={{ color: "#F5F0EB" }}>{faq.q}</span>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200" style={{ background: openFaq === i ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.07)", color: openFaq === i ? "#FB923C" : "#9CA3AF", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
                      <p className="px-6 pb-6 text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ────────────────────────────────────────────── */}
      <section id="book" className="py-20 lg:py-28 relative overflow-hidden" style={{ background: "#070b12" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.09) 0%, transparent 65%)" }} />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.4) 50%, transparent 100%)" }} />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FB923C" }}>Book Your Session</p>
            <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.0, letterSpacing: "-0.035em", background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {formHeading}
            </h2>
            <p className="text-base" style={{ color: "#9CA3AF" }}>{formSubheading}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
            {["HUB responds within 24 hours", "No commitment required", "In-person, virtual, or hybrid"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#f97316" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{item}</span>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="relative rounded-2xl p-8 sm:p-10" style={{ background: "var(--bg-card)", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 0 0 1px rgba(249,115,22,0.06) inset, 0 20px 60px rgba(0,0,0,0.3)" }}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />

            {submitState.status === "success" ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#86efac" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ color: "#F5F0EB" }}>You&apos;re on the list.</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#86efac" }}>{submitState.message}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "name", placeholder: "Your name", type: "text", required: true },
                    { name: "email", placeholder: "Email address", type: "email", required: true },
                    { name: "company", placeholder: "Organization (optional)", type: "text", required: false },
                    { name: "city", placeholder: "City (optional)", type: "text", required: false },
                  ].map((field) => (
                    <input key={field.name} type={field.type} name={field.name} placeholder={field.placeholder} aria-label={field.placeholder} value={formData[field.name as keyof FormState]} onChange={handleChange} required={field.required} className="px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-500/50 transition-all" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#F5F0EB" }} />
                  ))}
                </div>
                <input type="tel" name="phone" placeholder="Phone number (optional)" aria-label="Phone number (optional)" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-500/50 transition-all" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#F5F0EB" }} />

                <div>
                  <p className="text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: "#9CA3AF" }}>Session format</p>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Session format">
                    {FORMATS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        role="radio"
                        aria-checked={format === f}
                        onClick={() => setFormat(f)}
                        className="py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
                        style={format === f
                          ? { background: "rgba(249,115,22,0.16)", border: "1px solid rgba(249,115,22,0.55)", color: "#FDBA74" }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Honeypot — hidden from real users, tempting to bots */}
                <input type="text" name="website" value={hp} onChange={(e) => setHp(e.currentTarget.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                <button type="submit" disabled={submitState.status === "loading"} className="w-full py-5 rounded-xl font-bold text-base transition-all disabled:opacity-50 hover:brightness-110 active:scale-[0.99]" style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(249,115,22,0.38)" }}>
                  {submitState.status === "loading" ? "Sending your request…" : submitLabel}
                </button>
                <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>No obligation. No invoice. Lunch included. We&apos;ll reach out within 24 hours.</p>
                {submitState.status === "error" && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                    {submitState.message}
                  </motion.div>
                )}
              </form>
            )}
          </motion.div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { region: "Eastern Canada", name: "Doug Bain", phone: "416-540-9287", email: "doug.bain@hubss.com" },
              { region: "Western Canada", name: "Cleve Stordy", phone: "604-309-8212", email: "cleve.stordy@hubss.com" },
            ].map((office) => (
              <div key={office.region} className="rounded-xl p-5 text-center" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#FB923C" }}>{office.region}</p>
                <p className="text-sm font-semibold mb-1" style={{ color: "#F5F0EB" }}>{office.name}</p>
                <a href={`tel:+1${office.phone.replace(/-/g, "")}`} className="text-xs block mb-0.5 hover:text-orange-400 transition-colors" style={{ color: "#9CA3AF" }}>{office.phone}</a>
                <a href={`mailto:${office.email}`} className="text-xs hover:text-orange-400 transition-colors" style={{ color: "#9CA3AF" }}>{office.email}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ll-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
