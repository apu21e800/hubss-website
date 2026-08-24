"use client";

import { useState } from "react";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { track } from "@vercel/analytics";

// Note: metadata must be in a server component — defined in layout or a parallel route.
// Page-level metadata for client components requires moving meta to a parent layout.

const projectTypes = [
  "Crosswalk / Pedestrian Safety",
  "Bus & Bike Lane Markings",
  "Decorative Pavement / StreetPrint",
  "Regulatory / Road Markings",
  "Community / Public Art",
  "Parking Lot",
  "Other",
];

interface ContactFormProps {
  eyebrow: string;
  heading: string;
  subheading: string;
}

export default function ContactForm({ eyebrow, heading, subheading }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", projectType: "", message: ""
  });

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* Asphalt background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('/images/hero/hero-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "rgba(8,8,8,0.88)" }}
      />
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left */}
          <div className="pt-4">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>{eyebrow}</p>
            <h1
              className="font-black mb-8"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
              }}
            >
              {heading}
            </h1>
            <p className="text-[16px] leading-relaxed mb-12" style={{ color: "var(--text-body)" }}>
              {subheading}
            </p>
            <div className="space-y-8">
              {[
                { region: "West Office", city: "Ladysmith, BC", email: "cleve.stordy@hubss.com", phone: "604-309-8212" },
                { region: "East Office", city: "Milton, Ontario", email: "doug.bain@hubss.com", phone: "416-540-9287" },
              ].map((office) => (
                <div key={office.region}>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#f97316" }}>{office.region}</p>
                  <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>{office.city}</p>
                  <a href={`mailto:${office.email}`} className="text-sm flex items-center transition-colors hover:text-[#f97316]" style={{ color: "#d1d5db", minHeight: 44 }}>{office.email}</a>
                  <a href={`tel:${office.phone.replace(/-/g, "")}`} className="text-sm flex items-center transition-colors hover:text-[#f97316]" style={{ color: "#d1d5db", minHeight: 44 }}>{office.phone}</a>
                </div>
              ))}

              <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-xs font-semibold uppercase tracking-widest flex-shrink-0" style={{ color: "rgba(255,255,255,0.5)" }}>Follow Our Work</p>
                  <SocialLinks size="sm" className="gap-4" />
                </div>
              </div>
            </div>

          </div>

          {/* Right: form */}
          <div className="rounded-xl p-6 sm:p-10" style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)" }}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(249,115,22,0.15)" }}>
                  <svg className="w-7 h-7" style={{ color: "#f97316" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: "#d1d5db" }}>We&apos;ll be in touch within one business day.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError("");
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...form, formType: "contact", website: "" }),
                    });
                    const data = await res.json();
                    if (!res.ok || data.error) {
                      setError(data.error ?? "Something went wrong. Please try again.");
                    } else {
                      setSubmitted(true);
                      window.gtag?.("event", "generate_lead", { event_category: "conversion", form_type: "contact" });
                      track("contact_submit", { form_type: "contact" });
                    }
                  } catch {
                    setError("Network error. Please check your connection and try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "Jane Smith" },
                    { label: "Company", key: "company", type: "text", placeholder: "City of Toronto" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label htmlFor={`contact-${f.key}`} className="block text-sm mb-2" style={{ color: "#d1d5db" }}>{f.label}</label>
                      <input
                        id={`contact-${f.key}`}
                        type={f.type}
                        required
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 rounded-lg text-base outline-none focus:ring-1 focus:ring-orange-500 min-h-[48px]"
                        style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                      />
                    </div>
                  ))}
                </div>
                {[
                  { label: "Email", key: "email", type: "email", placeholder: "jane@city.ca" },
                  { label: "Phone", key: "phone", type: "tel", placeholder: "416-555-0100" },
                ].map((f) => (
                  <div key={f.key}>
                    <label htmlFor={`contact-${f.key}`} className="block text-sm mb-2" style={{ color: "#d1d5db" }}>{f.label}</label>
                    <input
                      id={`contact-${f.key}`}
                      type={f.type}
                      required={f.key === "email"}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-lg text-base outline-none focus:ring-1 focus:ring-orange-500 min-h-[48px]"
                      style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="contact-projectType" className="block text-sm mb-2" style={{ color: "#d1d5db" }}>Project Type</label>
                  <select
                    id="contact-projectType"
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-base outline-none focus:ring-1 focus:ring-orange-500 min-h-[48px]"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                  >
                    <option value="">Select project type...</option>
                    {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm mb-2" style={{ color: "#d1d5db" }}>Message</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 rounded-lg text-base outline-none resize-none focus:ring-1 focus:ring-orange-500"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                  />
                </div>
                {/* Honeypot — hidden from real users */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold py-4 rounded-lg text-base transition-all disabled:opacity-60 min-h-[48px]"
                  style={{ background: "#f97316", color: "#fff" }}
                >
                  {loading ? "Sending..." : "Send Us Your Project"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <LunchLearn />
      <Footer />
    </main>
  );
}
