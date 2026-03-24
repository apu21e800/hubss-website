"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const COVERS = [
  "Why preformed thermoplastic markings last 10x longer than paint",
  "Real Canadian case studies: before/after durability comparisons",
  "Budget planning: upfront costs vs lifecycle savings",
];

const TAKEAWAYS = [
  "Practical specs you can use in your next RFP",
  "Direct answers to your toughest pavement marking questions",
];

const PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland & Labrador", "Nova Scotia", "Ontario",
  "Prince Edward Island", "Quebec", "Saskatchewan",
];

const inputStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  color: "#111827",
};

const labelStyle = { color: "var(--text-hint)" as string, fontSize: "0.8125rem", fontWeight: 600 };

export default function LunchLearn() {
  const [form, setForm] = useState({
    name: "", org: "", email: "", phone: "", format: "In-Person", province: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, formType: "lunch-learn", website: "" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="lunch-learn" className="relative overflow-hidden" style={{ background: "var(--bg-slate)", zIndex: 0, position: "relative" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 pt-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT — content ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Eyebrow + CPD Badge */}
            <div className="flex items-center gap-3 mb-4">
              <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase">
                Free Professional Development
              </p>
              <span
                className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full"
                style={{
                  background: "linear-gradient(90deg, rgba(249,115,22,0.15), rgba(234,179,8,0.15))",
                  color: "#f97316",
                  border: "1px solid rgba(249,115,22,0.3)",
                }}
              >
                CPD-Accredited
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ color: "var(--text-primary)" }}>
              Let&apos;s{" "}
              <em style={{ color: "#f97316", fontStyle: "italic" }}>Lunch</em>
              {" & Learn"}
            </h2>

            {/* Subhead */}
            <p className="text-lg mb-10 leading-relaxed" style={{ color: "#cbd5e1" }}>
              Tough solutions. Real Canadian examples.{" "}
              <span style={{ color: "var(--text-primary)" }}>Real free lunch.</span>
            </p>

            {/* What we'll cover */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#f97316" }}>
                What we&apos;ll cover
              </p>
              <ul className="space-y-3">
                {COVERS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-sm font-bold flex-shrink-0" style={{ color: "#f97316" }}>✓</span>
                    <span className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* You'll leave with */}
            <div className="mb-8 pb-8">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-4" style={{ color: "#f97316" }}>
                You&apos;ll leave with
              </p>
              <ul className="space-y-3">
                {TAKEAWAYS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-sm font-bold flex-shrink-0" style={{ color: "#f97316" }}>✓</span>
                    <span className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pug peeker — paws sit flush against the orange fold line below */}
            <div style={{ position: "relative", height: "120px", marginBottom: "-32px", zIndex: 10, pointerEvents: "none" }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  zIndex: 10,
                }}
              >
                <Image
                  src="/images/lunch-learn/pug-peeker.png"
                  alt="Pug mascot peeking over the edge"
                  width={190}
                  height={148}
                  style={{ objectFit: "contain", objectPosition: "bottom", display: "block" }}
                  unoptimized
                />
              </motion.div>
            </div>

            {/* Format options — orange top border IS the fold line the pug peers over */}
            <div
              className="p-5 mb-8 space-y-3"
              style={{ position: "relative", zIndex: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: "2px solid #F97316", borderRadius: "0.5rem" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-base mt-0.5">🏢</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>In-Person</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>We bring lunch to your office.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base mt-0.5">💻</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Virtual</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>$25 SkipTheDishes voucher on us.</p>
                </div>
              </div>
            </div>

            {/* SkipTheDishes badge */}
            <div
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(234,179,8,0.08) 100%)",
                border: "1px solid rgba(249,115,22,0.25)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm tracking-tight shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #f97316, #f59e0b)",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(249,115,22,0.4)",
                }}
              >
                Skip
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>$25 SkipTheDishes Voucher</p>
                <p className="text-[11px]" style={{ color: "#94a3b8" }}>Delivered to virtual attendees on booking</p>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT — form card ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "#ffffff" }}
          >
            {submitted ? (
              <div className="text-center py-16 px-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(249,115,22,0.12)" }}
                >
                  <svg className="w-7 h-7" style={{ color: "#f97316" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#111827" }}>You&apos;re on the list!</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  We&apos;ll be in touch within one business day to confirm your session.
                </p>
              </div>
            ) : (
              <>
                {/* Card header */}
                <div className="px-8 pt-8 pb-6" style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <h3 className="text-xl font-bold" style={{ color: "#111827" }}>
                    Schedule Your Free Lunch &amp; Learn
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    We&apos;ll confirm within one business day.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                  {/* Full Name + Organization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Full Name</label>
                      <input
                        type="text" required placeholder="Jane Smith"
                        value={form.name} onChange={(e) => set("name", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all min-h-[44px]"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Organization</label>
                      <input
                        type="text" required placeholder="City of Vancouver"
                        value={form.org} onChange={(e) => set("org", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all min-h-[44px]"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Email</label>
                      <input
                        type="email" required placeholder="jane@city.ca"
                        value={form.email} onChange={(e) => set("email", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all min-h-[44px]"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Phone</label>
                      <input
                        type="tel" placeholder="604-555-0100"
                        value={form.phone} onChange={(e) => set("phone", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all min-h-[44px]"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Preferred Format */}
                  <div>
                    <label className="block mb-2" style={labelStyle}>Preferred Format</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["In-Person", "Virtual"] as const).map((opt) => (
                        <button
                          key={opt} type="button"
                          onClick={() => set("format", opt)}
                          className="py-2.5 rounded-lg text-sm font-semibold border-2 transition-all min-h-[44px]"
                          style={{
                            background:     form.format === opt ? "#fff7ed" : "#f9fafb",
                            borderColor:    form.format === opt ? "#f97316" : "#e5e7eb",
                            color:          form.format === opt ? "#ea580c" : "#6b7280",
                          }}
                        >
                          {opt === "In-Person" ? "🏢 In-Person" : "💻 Virtual"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Province</label>
                    <select
                      required
                      value={form.province} onChange={(e) => set("province", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all appearance-none cursor-pointer min-h-[44px]"
                      style={inputStyle}
                    >
                      <option value="">Select province…</option>
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* Honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button
                    type="submit" disabled={loading}
                    className="w-full font-bold py-4 rounded-xl text-sm mt-2 transition-all disabled:opacity-60 hover:brightness-110"
                    style={{ background: "linear-gradient(90deg, #f97316, #f59e0b)", color: "#fff" }}
                  >
                    {loading ? "Sending…" : "Schedule Your Free Lunch & Learn →"}
                  </button>
                </form>
              </>
            )}
          </motion.div>

        </div>
      </div>

      {/* ── Bottom CTA bar ──────────────────────────────────── */}
      <div style={{ background: "#0f1420", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <p className="text-sm" style={{ color: "#94a3b8" }}>
            Book your session at{" "}
            <a href="/lunch-learn" className="font-semibold transition-colors hover:text-white" style={{ color: "#f97316" }}>hubss.com/lunch-learn</a>
            {" "}— or fill out the form above.
          </p>
        </div>
      </div>
    </section>
  );
}
