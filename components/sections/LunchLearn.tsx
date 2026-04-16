"use client";

import { useState } from "react";
import Image from "next/image";

interface LunchLearnProps {
  /** Pass true on the dedicated /lunch-learn page — moose is rendered in the hero there */
  hideMoose?: boolean;
}

export default function LunchLearn({ hideMoose = false }: LunchLearnProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    city: "",
    phone: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "lunch-learn", ...form }),
      });
      if (!res.ok) throw new Error("Send failed");
      setStatus("sent");
      setForm({ name: "", email: "", company: "", city: "", phone: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0d1117 0%, #141b2d 60%, #0d1117 100%)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Orange glow — top left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -120,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-48 sm:pb-52">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Left — content panel ──────────────────────────── */}
          <div className="relative">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#f97316" }}
            >
              Free Professional Development
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
              style={{ color: "#ffffff" }}
            >
              Lunch Is On Us.
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #F97316, #EAB308)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Knowledge Is Free.
              </span>
            </h2>
            <p
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: "#8b8b8b" }}
            >
              We bring lunch to your office and walk your team through everything
              you need to know about modern pavement marking systems — real Canadian
              case studies, lifecycle cost analysis, and practical specs you can drop
              straight into your next RFP.
            </p>

            {/* What you get */}
            <ul className="space-y-3 mb-10">
              {[
                "Live product demonstrations + take-home samples",
                "Canadian case studies — York Region, Vancouver, UBC",
                "Free continuing education credits for engineers",
                "Lifecycle cost comparison vs paint and concrete",
                "Tailored to your municipality's active projects",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}
                  >
                    ✓
                  </span>
                  <span className="text-sm leading-snug" style={{ color: "#c0c0c0" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

          </div>

          {/* ── Right — form card ────────────────────────────── */}
          <div
            className="rounded-2xl p-8 sm:p-10 relative overflow-hidden"
            style={{
              background: "#1a1e28",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Orange top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, #f97316 0%, rgba(249,115,22,0.3) 60%, transparent 100%)" }}
            />

            {status === "sent" ? (
              <div className="py-10 text-center">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
                  style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)" }}
                >
                  <span style={{ color: "#f97316", fontSize: 22 }}>✓</span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#ffffff" }}>
                  You&apos;re on the list.
                </h3>
                <p className="text-sm" style={{ color: "#8b8b8b" }}>
                  We&apos;ll reach out within one business day to coordinate a date that works for your team.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#ffffff" }}>
                  Book Your Session
                </h3>
                <p className="text-sm mb-8" style={{ color: "#5a5a5a" }}>
                  Available anywhere in Canada — East or West office will coordinate.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#5a5a5a" }}>
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jane Smith"
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors focus:border-[#f97316]"
                        style={{
                          background: "#0f1620",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#ffffff",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#5a5a5a" }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@municipality.ca"
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors focus:border-[#f97316]"
                        style={{
                          background: "#0f1620",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#ffffff",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#5a5a5a" }}>
                      Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="City of Vancouver / Stantec / etc."
                      className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors focus:border-[#f97316]"
                      style={{
                        background: "#0f1620",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#5a5a5a" }}>
                        City / Region
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Milton, ON"
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors focus:border-[#f97316]"
                        style={{
                          background: "#0f1620",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#ffffff",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "#5a5a5a" }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="416-555-0100"
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors focus:border-[#f97316]"
                        style={{
                          background: "#0f1620",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#ffffff",
                        }}
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-red-400">
                      Something went wrong. Email us directly at info@hubss.com
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-lg py-4 text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #f97316 0%, #ea6c10 100%)",
                      color: "#ffffff",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {status === "sending" ? "Sending…" : "Book a Free Lunch & Learn →"}
                  </button>

                  <p className="text-xs text-center" style={{ color: "#3a3a3a" }}>
                    We respond within 1 business day. No spam, ever.
                  </p>
                </form>
              </>
            )}
          </div>


        </div>
      </div>

      {/* Moose — paws on section fold line, tracks form card right edge at all widths */}
      {!hideMoose && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            bottom: 0,
            right: "clamp(16px, calc((100vw - 1280px) / 2 + 16px), 400px)",
            width: "clamp(220px, 22vw, 290px)",
          }}
        >
          <Image
            src="/images/assets/mascot/moose-1.png"
            alt="HUB Surface Systems Moose mascot"
            width={290}
            height={290}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              objectPosition: "bottom",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
              display: "block",
            }}
            unoptimized
          />
        </div>
      )}
    </section>
  );
}
