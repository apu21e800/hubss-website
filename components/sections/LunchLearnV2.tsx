"use client";

/**
 * LunchLearnV2 — the site-wide Lunch & Learn conversion section, redesigned.
 * Vernon (Aug 2026): "the L&L page is not looking professional enough yet…
 * it just reads kinda lame compared to the rest of the site… 2 or 3 options
 * would be good even."
 *
 * Three variants, one shared form/brain. Moose stays in every one of them —
 * Doug's orders.
 *
 *   "boardroom" — one elevated card, copy left / inset form right. The most
 *                 buttoned-up read; Moose anchors the corner.
 *   "ticket"    — a session ticket + booking panel. Feels like reserving a
 *                 slot in an app; format picker feeds the actual email.
 *   "proof"     — photo-led with caption bar and city wall; slim wide form
 *                 underneath. Boldest, most editorial.
 */

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export type LunchLearnVariant = "boardroom" | "ticket" | "proof";

interface FormState {
  name: string;
  email: string;
  company: string;
  city: string;
  phone: string;
  website: string; // honeypot — hidden field, humans never fill it
}

interface SubmitState {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

const EMPTY: FormState = { name: "", email: "", company: "", city: "", phone: "", website: "" };

const BENEFITS = [
  "45-minute session tailored to your projects — in your office or virtual",
  "Spec language you can drop straight into your next RFP",
  "Physical samples, technical data sheets, and the certified installer map",
  "Lunch on HUB — and a $25 voucher when the session's virtual",
];

const STAT_CHIPS = [
  { v: "45 min", l: "focused" },
  { v: "$0", l: "hosted by HUB" },
  { v: "30+", l: "years in the field" },
  { v: "10", l: "provinces served" },
];

const CITY_WALL = ["City of Toronto", "York Region", "City of Vancouver", "UBC", "TransLink", "City of Ottawa", "Halifax RM", "City of Calgary"];

const IMG = { src: "/images/products/streetbond/streetbond-112.jpg", alt: "StreetBond coloured pavement installation — the systems covered in a HUB Lunch & Learn session" };
const MOOSE = { src: "/images/lunch-learn/moose.png", alt: "Moose, the HUB Surface Systems site dog, in his hard hat and safety vest" };

// ── Shared form brain ────────────────────────────────────
function useLunchLearnForm(withFormat: boolean) {
  const [formData, setFormData] = useState<FormState>(EMPTY);
  const [format, setFormat] = useState<string>("Either");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

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
        body: JSON.stringify({
          ...formData,
          ...(withFormat ? { format } : {}),
          formType: "lunch-learn",
        }),
      });
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      setSubmitState({
        status: "success",
        message: "You're booked in. We'll be in touch within one business day to confirm your date and details.",
      });
      setFormData(EMPTY);
    } catch {
      setSubmitState({
        status: "error",
        message: "Something went wrong. Call us directly: 416-540-9287 (East) or 604-309-8212 (West).",
      });
    }
  };

  return { formData, format, setFormat, submitState, handleChange, handleSubmit };
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#F5F0EB",
};

function Field({ name, placeholder, type = "text", required = false, value, onChange }: {
  name: string; placeholder: string; type?: string; required?: boolean;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder + (required ? "" : " (optional)")}
      aria-label={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
      style={inputStyle}
    />
  );
}

function Honeypot({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={onChange}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
    />
  );
}

function SuccessPanel({ message }: { message?: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}>
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#86efac" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-bold text-lg mb-2" style={{ color: "#F5F0EB" }}>You&apos;re on the list.</h3>
      <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "#86efac" }}>{message}</p>
    </motion.div>
  );
}

function ErrorNote({ message }: { message?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
      {message}
    </motion.div>
  );
}

function MoreLink() {
  return (
    <Link href="/lunch-learn" className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:text-orange-300" style={{ color: "#FB923C" }}>
      Everything about the session
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Link>
  );
}

// ═════════════════════════════════════════════════════════════════════
// Variant A — "Boardroom": one elevated card, inset form, Moose as host
// ═════════════════════════════════════════════════════════════════════
function Boardroom() {
  const f = useLunchLearnForm(true);
  return (
    <section className="relative py-16 sm:py-20 lg:py-24" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Copy side */}
              <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 lg:pr-6">
                {/* Vernon (Aug 2026): corner Moose removed; the host avatar
                    carries him instead — bigger, ringed, face-first billing. */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Breakout avatar — Vernon: "make the dog bigger, or like
                      he's coming out of the circle." The ring clips nothing:
                      Moose is drawn unclipped and bottom-anchored, so his hard
                      hat rises past the rim. */}
                  <span className="relative flex-shrink-0 w-[72px] h-[72px] sm:w-20 sm:h-20">
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "rgba(249,115,22,0.14)",
                        border: "2px solid rgba(249,115,22,0.5)",
                        boxShadow: "0 0 0 3px rgba(249,115,22,0.12), 0 6px 20px rgba(0,0,0,0.35)",
                      }}
                    />
                    <Image
                      src={MOOSE.src}
                      alt={MOOSE.alt}
                      width={320}
                      height={400}
                      sizes="96px"
                      className="absolute bottom-0 left-1/2 w-auto"
                      style={{ height: "127%", maxWidth: "none", transform: "translateX(-50%)", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.45))" }}
                    />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "#FB923C" }}>
                      Lunch &amp; Learn
                    </p>
                    <p className="text-[14px] font-semibold mt-0.5" style={{ color: "#F5F0EB" }}>
                      Hosted by the HUB team — and Moose, site dog
                    </p>
                  </div>
                </div>

                <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3.1rem)", lineHeight: 1.0, letterSpacing: "-0.03em", color: "#F5F0EB" }}>
                  Specify with confidence.{" "}
                  <span style={{ background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Lunch is on us.
                  </span>
                </h2>
                <p className="text-[15px] leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
                  A working session for engineers, architects, and municipal teams — real Canadian
                  case studies, spec language, and samples on the table.
                </p>

                <div className="space-y-3.5 mb-9">
                  {BENEFITS.map((b) => (
                    <div key={b} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center mt-0.5" style={{ background: "rgba(249,115,22,0.14)" }}>
                        <svg className="w-3 h-3" fill="none" stroke="#FB923C" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <span className="text-[14px] leading-snug" style={{ color: "#F5F0EB" }}>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  {STAT_CHIPS.map((s) => (
                    <span key={s.v} className="inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <span className="text-[13px] font-black" style={{ color: "#FB923C" }}>{s.v}</span>
                      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.55)" }}>{s.l}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <MoreLink />
                  <span className="hidden sm:block" style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                  <a href="tel:+14165409287" className="text-[13px] font-semibold hover:text-orange-400 transition-colors" style={{ color: "rgba(255,255,255,0.45)" }}>East 416-540-9287</a>
                  <a href="tel:+16043098212" className="text-[13px] font-semibold hover:text-orange-400 transition-colors" style={{ color: "rgba(255,255,255,0.45)" }}>West 604-309-8212</a>
                </div>
              </div>

              {/* Form side — inset panel */}
              <div className="lg:col-span-5 p-5 sm:p-7 lg:p-8 lg:pl-2 flex">
                <div className="relative w-full rounded-2xl p-6 sm:p-7 self-center" style={{ background: "var(--bg-card-neutral)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {f.submitState.status === "success" ? (
                    <SuccessPanel message={f.submitState.message} />
                  ) : (
                    <form onSubmit={f.handleSubmit} className="space-y-3.5">
                      <div className="mb-5">
                        <h3 className="font-bold text-lg mb-1" style={{ color: "#F5F0EB" }}>Book your session</h3>
                        <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>Confirmed within one business day.</p>
                      </div>
                      <Honeypot value={f.formData.website} onChange={f.handleChange} />
                      {/* Format picker — grafted from the Ticket option; feeds the email */}
                      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Session format">
                        {["In-person", "Virtual", "Either"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={f.format === opt}
                            onClick={() => f.setFormat(opt)}
                            className="py-2 rounded-lg text-[12.5px] font-semibold transition-all active:scale-[0.97]"
                            style={
                              f.format === opt
                                ? { background: "rgba(249,115,22,0.16)", border: "1px solid rgba(249,115,22,0.5)", color: "#FB923C" }
                                : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }
                            }
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <Field name="name" placeholder="Your name" required value={f.formData.name} onChange={f.handleChange} />
                        <Field name="email" placeholder="Email address" type="email" required value={f.formData.email} onChange={f.handleChange} />
                      </div>
                      <Field name="company" placeholder="Company or organization" value={f.formData.company} onChange={f.handleChange} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <Field name="city" placeholder="City" value={f.formData.city} onChange={f.handleChange} />
                        <Field name="phone" placeholder="Phone" type="tel" value={f.formData.phone} onChange={f.handleChange} />
                      </div>
                      <button
                        type="submit"
                        disabled={f.submitState.status === "loading"}
                        className="w-full py-4 rounded-xl font-bold text-[15px] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(249,115,22,0.35)" }}
                      >
                        {f.submitState.status === "loading" ? "Sending…" : "Request Lunch & Learn"}
                      </button>
                      <p className="text-center text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        No obligation. No invoice. Lunch included.
                      </p>
                      {f.submitState.status === "error" && <ErrorNote message={f.submitState.message} />}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════
// Variant B — "Ticket": session ticket + booking panel with a format picker
// ═════════════════════════════════════════════════════════════════════
const TICKET_META = [
  { k: "Duration", v: "45 minutes + Q&A" },
  { k: "Cost", v: "$0 — hosted by HUB" },
  { k: "Format", v: "In-person or virtual" },
  { k: "Materials", v: "Samples + spec sheets" },
];

function Ticket() {
  const f = useLunchLearnForm(true);
  return (
    <section className="relative py-16 sm:py-20 lg:py-24" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FB923C" }}>Lunch &amp; Learn</p>
          <h2 className="font-black" style={{ fontSize: "clamp(2rem, 4vw, 3.1rem)", lineHeight: 1.0, letterSpacing: "-0.03em", color: "#F5F0EB" }}>
            Reserve a session for your team.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* The ticket */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 rounded-2xl overflow-hidden flex flex-col"
            style={{ background: "var(--bg-card-neutral)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)" }}>
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white">HUB · Lunch &amp; Learn</span>
              <span className="text-[11px] font-bold text-white/85">Admits your whole team</span>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col">
              <div className="flex items-center gap-3 pb-5 mb-5" style={{ borderBottom: "1px dashed rgba(255,255,255,0.15)" }}>
                <span className="relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden" style={{ background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.3)" }}>
                  <Image src={MOOSE.src} alt={MOOSE.alt} fill className="object-cover object-top" sizes="48px" />
                </span>
                <div>
                  <p className="text-[14px] font-bold leading-tight" style={{ color: "#F5F0EB" }}>Hosted by the HUB technical team</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>Moose, site dog — attendance subject to snack availability.</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {TICKET_META.map((m) => (
                  <div key={m.k} className="flex items-baseline justify-between gap-4">
                    <span className="text-[11px] font-bold tracking-[0.14em] uppercase flex-shrink-0" style={{ color: "rgba(255,255,255,0.45)" }}>{m.k}</span>
                    <span className="flex-1" style={{ borderBottom: "1px dotted rgba(255,255,255,0.12)", transform: "translateY(-4px)" }} />
                    <span className="text-[13px] font-semibold text-right" style={{ color: "#F5F0EB" }}>{m.v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 mb-6">
                {["Spec language for your next RFP", "Samples + technical data sheets", "Certified installer map for your region"].map((b) => (
                  <div key={b} className="flex items-center gap-2.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="#FB923C" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.75)" }}>{b}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between gap-3" style={{ borderTop: "1px dashed rgba(255,255,255,0.15)" }}>
                <span className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>Lunch included — $25 voucher on virtual</span>
                <MoreLink />
              </div>
            </div>
          </motion.div>

          {/* The booking panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:col-span-7 rounded-2xl p-6 sm:p-8"
            style={{ background: "var(--bg-card)", border: "1px solid rgba(249,115,22,0.18)", boxShadow: "0 0 0 1px rgba(249,115,22,0.05) inset, 0 16px 50px rgba(0,0,0,0.3)" }}
          >
            {f.submitState.status === "success" ? (
              <SuccessPanel message={f.submitState.message} />
            ) : (
              <form onSubmit={f.handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                  <h3 className="font-bold text-lg" style={{ color: "#F5F0EB" }}>Book it</h3>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <span className="relative flex w-2 h-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "#4ade80" }} />
                      <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: "#4ade80" }} />
                    </span>
                    Usually confirmed within 24 hours
                  </span>
                </div>

                {/* Format picker — feeds the email */}
                <div>
                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>Session format</p>
                  <div className="grid grid-cols-3 gap-2" role="group" aria-label="Session format">
                    {["In-person", "Virtual", "Either"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={f.format === opt}
                        onClick={() => f.setFormat(opt)}
                        className="py-2.5 rounded-lg text-[13px] font-semibold transition-all active:scale-[0.97]"
                        style={
                          f.format === opt
                            ? { background: "rgba(249,115,22,0.16)", border: "1px solid rgba(249,115,22,0.5)", color: "#FB923C" }
                            : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }
                        }
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <Honeypot value={f.formData.website} onChange={f.handleChange} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field name="name" placeholder="Your name" required value={f.formData.name} onChange={f.handleChange} />
                  <Field name="email" placeholder="Email address" type="email" required value={f.formData.email} onChange={f.handleChange} />
                  <Field name="company" placeholder="Company or organization" value={f.formData.company} onChange={f.handleChange} />
                  <Field name="city" placeholder="City" value={f.formData.city} onChange={f.handleChange} />
                </div>
                <Field name="phone" placeholder="Phone" type="tel" value={f.formData.phone} onChange={f.handleChange} />

                <button
                  type="submit"
                  disabled={f.submitState.status === "loading"}
                  className="w-full py-4 rounded-xl font-bold text-[15px] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(249,115,22,0.35)" }}
                >
                  {f.submitState.status === "loading" ? "Sending…" : `Reserve — ${f.format.toLowerCase()}`}
                </button>
                <p className="text-center text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>No obligation. No invoice. We reach out within one business day.</p>
                {f.submitState.status === "error" && <ErrorNote message={f.submitState.message} />}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════
// Variant C — "Proof": photo-led with caption + city wall; slim form below
// ═════════════════════════════════════════════════════════════════════
function Proof() {
  const f = useLunchLearnForm(false);
  return (
    <section className="relative py-16 sm:py-20 lg:py-24" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-10 lg:mb-12">
          {/* Copy */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: "#FB923C" }}>Lunch &amp; Learn</p>
            <h2 className="font-black mb-5" style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)", lineHeight: 0.98, letterSpacing: "-0.03em", color: "#F5F0EB" }}>
              The teams that specify Canada&apos;s streets{" "}
              <span style={{ background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                learn over lunch.
              </span>
            </h2>
            <p className="text-[15px] leading-relaxed mb-7 max-w-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
              45 minutes with the HUB technical team — spec language for your next RFP and samples
              on the table. In your office or virtual, lunch on us.
            </p>

            <div className="mb-7">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>Previous sessions include</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 max-w-lg">
                {CITY_WALL.map((c, i) => (
                  <span key={c} className="inline-flex items-center gap-3">
                    <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>{c}</span>
                    {i < CITY_WALL.length - 1 && <span className="w-1 h-1 rounded-full" style={{ background: "rgba(249,115,22,0.5)" }} />}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <MoreLink />
              <span className="hidden sm:block" style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>Samples and spec sheets included</span>
            </div>
          </motion.div>

          {/* Photo with caption bar + Moose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "5/4", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
              <Image src={IMG.src} alt={IMG.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black tracking-[0.14em] uppercase" style={{ background: "rgba(7,11,18,0.75)", color: "#FB923C", border: "1px solid rgba(249,115,22,0.3)", backdropFilter: "blur(6px)" }}>
                StreetBond · Real installation
              </span>
              {/* Caption keeps clear of Moose (right padding tracks his width) */}
              <div className="absolute bottom-0 inset-x-0 pl-5 pr-[38%] sm:pr-[34%] py-3.5" style={{ background: "linear-gradient(to top, rgba(7,11,18,0.92) 0%, rgba(7,11,18,0.55) 70%, transparent 100%)" }}>
                <p className="text-[13px] font-semibold leading-snug" style={{ color: "#F5F0EB" }}>The systems your team gets hands-on</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>Coatings · thermoplastics · stamped asphalt</p>
              </div>
            </div>
            {/* Moose keeps his spot */}
            <div className="absolute -bottom-2 -right-1 sm:-right-4 pointer-events-none select-none" style={{ width: "34%", maxWidth: 175 }}>
              <Image src={MOOSE.src} alt={MOOSE.alt} width={320} height={400} className="w-full h-auto drop-shadow-2xl" sizes="(max-width: 640px) 42vw, 190px" />
            </div>
          </motion.div>
        </div>

        {/* Slim wide form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl p-6 sm:p-7"
          style={{ background: "var(--bg-card)", border: "1px solid rgba(249,115,22,0.18)", boxShadow: "0 0 0 1px rgba(249,115,22,0.05) inset, 0 16px 50px rgba(0,0,0,0.3)" }}
        >
          {f.submitState.status === "success" ? (
            <SuccessPanel message={f.submitState.message} />
          ) : (
            <form onSubmit={f.handleSubmit}>
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <h3 className="font-bold text-base" style={{ color: "#F5F0EB" }}>Book your Lunch &amp; Learn</h3>
                <span className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Confirmed within one business day · no obligation</span>
              </div>
              <Honeypot value={f.formData.website} onChange={f.handleChange} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-3.5">
                <Field name="name" placeholder="Your name" required value={f.formData.name} onChange={f.handleChange} />
                <Field name="email" placeholder="Email address" type="email" required value={f.formData.email} onChange={f.handleChange} />
                <Field name="company" placeholder="Company or organization" value={f.formData.company} onChange={f.handleChange} />
                <Field name="city" placeholder="City" value={f.formData.city} onChange={f.handleChange} />
                <Field name="phone" placeholder="Phone" type="tel" value={f.formData.phone} onChange={f.handleChange} />
                <button
                  type="submit"
                  disabled={f.submitState.status === "loading"}
                  className="w-full py-3.5 rounded-xl font-bold text-[14px] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(249,115,22,0.35)" }}
                >
                  {f.submitState.status === "loading" ? "Sending…" : "Request Lunch & Learn"}
                </button>
              </div>
              {f.submitState.status === "error" && <ErrorNote message={f.submitState.message} />}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ── Export ────────────────────────────────────────────────────────────────
export default function LunchLearnV2({ variant = "boardroom" }: { variant?: LunchLearnVariant }) {
  if (variant === "ticket") return <Ticket />;
  if (variant === "proof") return <Proof />;
  return <Boardroom />;
}
