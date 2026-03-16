"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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

const labelStyle = { color: "#374151", fontSize: "0.8125rem", fontWeight: 600 };

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
    <section id="lunch-learn" className="relative overflow-hidden" style={{ background: "#1C2333" }}>
      {/* Top divider */}
      <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #f97316, #f59e0b)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT — content ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Eyebrow */}
            <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Free Professional Development
            </p>

            {/* Headline */}
            <h2 className="text-5xl font-bold mb-4 leading-tight" style={{ color: "#f5f0eb" }}>
              Let&apos;s{" "}
              <em style={{ color: "#f97316", fontStyle: "italic" }}>Lunch</em>
              {" & Learn"}
            </h2>

            {/* Subhead */}
            <p className="text-lg mb-10 leading-relaxed" style={{ color: "#94a3b8" }}>
              Tough solutions. Real Canadian examples.{" "}
              <span style={{ color: "#f5f0eb" }}>Real free lunch.</span>
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
            <div className="mb-10">
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

            {/* Format options */}
            <div
              className="rounded-xl p-5 mb-8 space-y-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-base mt-0.5">🏢</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#f5f0eb" }}>In-Person</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>We bring lunch to your office.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base mt-0.5">💻</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#f5f0eb" }}>Virtual</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>$25 SkipTheDishes voucher on us.</p>
                </div>
              </div>
            </div>

            {/* SkipTheDishes badge */}
            <div
              className="inline-flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "#f97316", color: "#fff" }}
              >
                SD
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#f5f0eb" }}>SkipTheDishes</p>
                <p className="text-[11px]" style={{ color: "#94a3b8" }}>Voucher delivered on booking</p>
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
                <p className="text-sm" style={{ color: "#6b7280" }}>
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
                  <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
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
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Organization</label>
                      <input
                        type="text" required placeholder="City of Vancouver"
                        value={form.org} onChange={(e) => set("org", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all"
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
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Phone</label>
                      <input
                        type="tel" placeholder="604-555-0100"
                        value={form.phone} onChange={(e) => set("phone", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all"
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
                          className="py-2.5 rounded-lg text-sm font-semibold border-2 transition-all"
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
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all appearance-none cursor-pointer"
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
            <span className="font-semibold" style={{ color: "#f97316" }}>hubss.com/lunch-learn</span>
            {" "}— or fill out the form above.
          </p>
        </div>
      </div>
    </section>
  );
}
