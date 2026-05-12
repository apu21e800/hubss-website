"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Spec Language Ready for Your RFP",
    desc: "Pre-written specification language for thermoplastic crosswalks, MMA bus lanes, coloured bike lanes, and more. Copy it straight into your next tender document.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "The Lifecycle Cost Math",
    desc: "Paint every 18 months vs. thermoplastic that outlasts it 6:1. We show you the numbers side by side. The math usually surprises people.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    title: "Lunch Included. No Catch.",
    desc: "In-person sessions include catered lunch for your team. Virtual sessions come with a $50 gift card delivered before we connect.",
  },
];

const PERSONAS = [
  {
    title: "Municipal Engineers & Planners",
    desc: "Crosswalks, transit corridors, and complete streets that meet Vision Zero and Complete Streets specifications, with accessibility-aware design. Real installation data from Canadian municipalities coast to coast.",
  },
  {
    title: "Landscape Architects & Designers",
    desc: "12+ StreetPrint patterns, full StreetBond Pantone palette, and decorative surfaces engineered to outlast the design life of the asphalt beneath them. Snowplow-safe. Engineering-approved.",
  },
  {
    title: "Engineering & Consulting Firms",
    desc: "CE credits available. Walk away with real spec sheets, sample materials, and a list of certified HUB installers in your region.",
  },
  {
    title: "Contractors & Applicators",
    desc: "Learn about the HUB certified applicator program — unlock territory rights and bid on jobs your competitors can't touch.",
  },
];

const FAQS = [
  {
    q: "How long is the session?",
    a: "30–45 minutes of presentation, followed by open Q&A. We're respectful of your team's calendar and stick to the time we agree on.",
  },
  {
    q: "Is this actually free?",
    a: "100% free. No invoice, no minimum order attached, and we won't badger you afterward. We just want you to know what you're specifying — the rest follows naturally.",
  },
  {
    q: "Do we get continuing education credits?",
    a: "Yes. HUB Lunch & Learn sessions count toward AIBC, RAIC, and PEO continuing professional development requirements. We provide the documentation.",
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

export default function LunchLearnFunnel() {
  const [formData, setFormData] = useState<FormState>({
    name: "", email: "", company: "", city: "", phone: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState({ status: "loading" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, formType: "lunch-learn" }),
      });
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      setSubmitState({ status: "success", message: "You're on the list. We'll be in touch within 24 hours to confirm your date and details." });
      setFormData({ name: "", email: "", company: "", city: "", phone: "" });
    } catch {
      setSubmitState({ status: "error", message: "Something went wrong. Call us directly: 416-540-9287 (East) or 604-309-8212 (West)." });
    }
  };

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#070b12", minHeight: "72vh" }}
      >
        {/* Atmospheric glows */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 15% 60%, rgba(249,115,22,0.13) 0%, transparent 55%)",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(234,179,8,0.06) 0%, transparent 60%)",
        }} />
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px" style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.5) 50%, transparent 100%)",
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">

            {/* Left: Text + trust + CTAs */}
            <motion.div
              className="pb-12 lg:pb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-bold tracking-[0.22em] uppercase mb-5" style={{ color: "#f97316" }}>
                Free &middot; No Obligation &middot; Coast to Coast
              </p>
              <h1
                className="font-black mb-6"
                style={{
                  fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  color: "#F5F0EB",
                }}
              >
                Lunch Is On Us.
                <br />
                <span style={{
                  background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Your Next Spec Is Free.
                </span>
              </h1>
              <p
                className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                A 45-minute HUB Lunch &amp; Learn delivers everything your team needs
                to confidently specify decorative pavement, thermoplastic crosswalks,
                and coloured coatings — real Canadian case studies and spec language
                you can drop straight into your next RFP.
              </p>

              {/* Trust trio */}
              <div className="flex flex-wrap gap-5 mb-10">
                {["30+ Years in Canada", "500+ Municipalities", "Free CE Credits"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#f97316" }} />
                    <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>{t}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#book"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-sm transition-all"
                  style={{
                    background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                    color: "#fff",
                    boxShadow: "0 6px 28px rgba(249,115,22,0.42)",
                  }}
                >
                  Book Your Free Session
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <div className="flex items-center gap-4">
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

            {/* Right: Moose mascot — one and only */}
            <motion.div
              className="relative flex items-end justify-center lg:justify-end"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ height: "clamp(224px, 34vw, 416px)" }}
            >
              <Image
                src="/images/lunch-learn/moose-final.png"
                alt="HUB Surface Systems moose mascot — book a free Lunch & Learn"
                width={368}
                height={416}
                style={{
                  width: "auto",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom",
                  filter: "drop-shadow(0 0 30px rgba(249,115,22,0.25)) drop-shadow(0 12px 32px rgba(0,0,0,0.5))",
                }}
                priority
                unoptimized
              />
              {/* Glow pool under moose */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-16 pointer-events-none" style={{
                background: "radial-gradient(ellipse, rgba(249,115,22,0.22) 0%, transparent 70%)",
                filter: "blur(12px)",
              }} />
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none" style={{
          background: "linear-gradient(to bottom, transparent, var(--bg-primary))",
        }} />
      </section>

      {/* ── WHAT YOU WALK AWAY WITH ──────────────────────────────── */}
      <section className="py-20 lg:py-24" style={{ background: "#0a0f1a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#f97316" }}>
              What You Walk Away With
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
              Not a Sales Pitch. An Education.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHAT_YOU_GET.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="relative rounded-2xl p-8 flex flex-col gap-4"
                style={{
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                  style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(249,115,22,0.12)", color: "#f97316" }}
                >
                  {item.icon}
                </div>
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

      {/* ── PERFECT FOR ──────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#070b12" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#f97316" }}>
              Who It&apos;s Built For
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
              Your Whole Team. One Session.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PERSONAS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="flex gap-5 p-6 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span
                  className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#f97316" }}
                />
                <div>
                  <p className="font-bold text-base mb-1.5" style={{ color: "#F5F0EB" }}>{p.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITY MARQUEE ─────────────────────────────────────────────── */}
      <div style={{ background: "#070b12", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-center text-[10px] font-bold tracking-[0.2em] uppercase pt-8 pb-4" style={{ color: "rgba(255,255,255,0.18)" }}>
          Previous Lunch &amp; Learn clients include
        </p>
        <div
          className="overflow-hidden pb-8"
          style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)" }}
        >
          <div className="flex gap-0 whitespace-nowrap" style={{ animation: "ll-marquee 40s linear infinite" }}>
            {TICKER.map((name, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
                <span className="text-sm font-medium px-5" style={{ color: "rgba(255,255,255,0.32)", lineHeight: 1 }}>{name}</span>
                <span aria-hidden="true" style={{ display: "block", width: 4, height: 4, borderRadius: "50%", background: "rgba(249,115,22,0.45)", flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24" style={{ background: "#0a0f1a" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#f97316" }}>
              Common Questions
            </p>
            <h2
              className="font-black"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#F5F0EB" }}
            >
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: openFaq === i ? "#111827" : "rgba(255,255,255,0.02)" }}
              >
                <button
                  className="w-full text-left flex items-center justify-between gap-4 px-6 py-5"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-base" style={{ color: "#F5F0EB" }}>{faq.q}</span>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200"
                    style={{
                      background: openFaq === i ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)",
                      color: openFaq === i ? "#f97316" : "#9CA3AF",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ──────────────────────────────────────────────────────────── */}
      <section
        id="book"
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: "#070b12" }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.09) 0%, transparent 65%)",
        }} />
        <div className="absolute top-0 inset-x-0 h-px" style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.4) 50%, transparent 100%)",
        }} />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#f97316" }}>
              Book Your Session
            </p>
            <h2
              className="font-black mb-4"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.035em",
                background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Claim Your Free Lunch &amp; Learn
            </h2>
            <p className="text-base" style={{ color: "#9CA3AF" }}>
              Tell us who you are and where you are — we handle the rest. Usually within 24 hours.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="relative rounded-2xl p-8 sm:p-10"
            style={{
              background: "#0f1520",
              border: "1px solid rgba(249,115,22,0.2)",
              boxShadow: "0 0 0 1px rgba(249,115,22,0.06) inset, 0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{
              background: "linear-gradient(90deg, #F97316, #EAB308)",
            }} />

            {submitState.status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#86efac" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
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
                    { name: "company", placeholder: "Company or organization", type: "text", required: false },
                    { name: "city", placeholder: "City", type: "text", required: false },
                  ].map((field) => (
                    <input
                      key={field.name}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof FormState]}
                      onChange={handleChange}
                      required={field.required}
                      className="px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#F5F0EB",
                      }}
                    />
                  ))}
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#F5F0EB",
                  }}
                />

                <button
                  type="submit"
                  disabled={submitState.status === "loading"}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                    color: "#fff",
                    boxShadow: "0 6px 24px rgba(249,115,22,0.38)",
                  }}
                >
                  {submitState.status === "loading" ? "Sending your request…" : "Claim Your Free Lunch & Learn →"}
                </button>

                <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
                  No obligation. No invoice. Lunch included. We&apos;ll reach out within 24 hours.
                </p>

                {submitState.status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl text-sm"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
                  >
                    {submitState.message}
                  </motion.div>
                )}
              </form>
            )}
          </motion.div>

          {/* Bottom office info */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { region: "Eastern Canada", name: "Doug Bain", phone: "416-540-9287", email: "doug.bain@hubss.com" },
              { region: "Western Canada", name: "Cleve Stordy", phone: "604-309-8212", email: "cleve.stordy@hubss.com" },
            ].map((office) => (
              <div
                key={office.region}
                className="rounded-xl p-5 text-center"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#f97316" }}>
                  {office.region}
                </p>
                <p className="text-sm font-semibold mb-1" style={{ color: "#F5F0EB" }}>{office.name}</p>
                <a href={`tel:+1${office.phone.replace(/-/g, "")}`} className="text-xs block mb-0.5 hover:text-orange-400 transition-colors" style={{ color: "#9CA3AF" }}>
                  {office.phone}
                </a>
                <a href={`mailto:${office.email}`} className="text-xs hover:text-orange-400 transition-colors" style={{ color: "#9CA3AF" }}>
                  {office.email}
                </a>
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
