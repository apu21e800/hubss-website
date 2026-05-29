"use client";

import { useState } from "react";

interface Props {
  formToken: string;
  onSubmitted: () => void;
  onBack: () => void;
}

type Status = "idle" | "submitting" | "done" | "error";

export default function PrizeDrawForm({ formToken, onSubmitted, onBack }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    optInMarketing: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/connect/prize-draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, formToken, website: "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      onSubmitted();
      setStatus("done");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
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
          className="text-xl sm:text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Thanks — you&apos;re entered.
        </h2>
        <p className="text-[15px]" style={{ color: "var(--text-body)" }}>
          Winners announced after the show.
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

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl p-5 sm:p-8 space-y-5"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5"
          style={{ color: "#F97316" }}
        >
          Prize draw
        </p>
        <h2
          className="font-bold"
          style={{
            color: "var(--text-primary)",
            fontSize: "20px",
            letterSpacing: "-0.01em",
          }}
        >
          Enter to win.
        </h2>
        <p className="mt-1 text-[14px]" style={{ color: "var(--text-body)" }}>
          One entry per person. Winner announced after the show.
        </p>
      </div>

      <Field
        label="Full name"
        required
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
        autoComplete="name"
        placeholder="Jane Smith"
      />
      <Field
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
        autoComplete="email"
        placeholder="jane@city.ca"
        inputMode="email"
      />
      <Field
        label="Company"
        required
        value={form.company}
        onChange={(v) => setForm({ ...form, company: v })}
        autoComplete="organization"
        placeholder="City of Toronto"
      />
      <Field
        label="Role / title"
        hint="Optional"
        value={form.role}
        onChange={(v) => setForm({ ...form, role: v })}
        autoComplete="organization-title"
        placeholder="Public Realm Designer"
      />
      <Field
        label="Phone"
        type="tel"
        hint="Optional"
        value={form.phone}
        onChange={(v) => setForm({ ...form, phone: v })}
        autoComplete="tel"
        placeholder="416-555-0100"
        inputMode="tel"
      />

      {/* ── CASL opt-in ─────────────────────────────────────────────── */}
      <label
        className="flex gap-3 items-start cursor-pointer"
        style={{ color: "var(--text-body)" }}
      >
        <input
          type="checkbox"
          checked={form.optInMarketing}
          onChange={(e) => setForm({ ...form, optInMarketing: e.target.checked })}
          className="mt-1 h-5 w-5 shrink-0 rounded border accent-orange-500"
          style={{ accentColor: "#F97316" }}
        />
        <span className="text-[14px] leading-snug">
          I&apos;d like to receive HUBSS updates and product news.
          <span
            className="block text-[12px] mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            You can unsubscribe at any time. We never share your information.
          </span>
        </span>
      </label>

      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {error && (
        <p
          role="alert"
          className="text-[14px]"
          style={{ color: "#fca5a5" }}
        >
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg py-3.5 text-base font-semibold transition-all disabled:opacity-60"
          style={{
            background: "#F97316",
            color: "#fff",
            minHeight: 48,
          }}
        >
          {submitting ? "Submitting…" : "Enter the draw"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="w-full rounded-lg py-3.5 text-base font-semibold transition-all disabled:opacity-60"
          style={{
            background: "transparent",
            color: "var(--text-body)",
            border: "1px solid var(--border-color)",
            minHeight: 48,
          }}
        >
          No thanks
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  hint,
  placeholder,
  autoComplete,
  inputMode,
}: FieldProps) {
  return (
    <div>
      <label className="flex justify-between items-baseline text-[13px] mb-1.5" style={{ color: "var(--text-body)" }}>
        <span>
          {label}
          {required && <span style={{ color: "#F97316" }}>{" *"}</span>}
        </span>
        {hint && (
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {hint}
          </span>
        )}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        className="w-full rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-orange-500"
        style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
          minHeight: 48,
        }}
      />
    </div>
  );
}
