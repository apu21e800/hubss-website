"use client";

import { useEffect, useId, useRef, useState } from "react";
import { track } from "@vercel/analytics";

interface Props {
  formToken: string;
  onSubmitted: () => void;
  onBack: () => void;
}

type Status = "idle" | "submitting" | "done" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fire GA + Vercel analytics — match the helper in ConnectClient.
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

export default function PrizeDrawForm({ formToken, onSubmitted, onBack }: Props) {
  const formAriaId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const firstErrorRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    optInMarketing: false,
  });

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear that field's error as the user edits — gentle correction.
    if (fieldErrors[key as string]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  // Client-side validation runs BEFORE we hit the API. Saves a network
  // round-trip on typos and avoids burning the user's rate-limit budget
  // on validation mistakes.
  function validateClient(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim())    errs.name    = "Please enter your full name.";
    if (!form.email.trim())   errs.email   = "Please enter your email.";
    else if (!EMAIL_RE.test(form.email.trim())) errs.email = "Please enter a valid email address.";
    if (!form.company.trim()) errs.company = "Please enter your company or municipality.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    if (!validateClient()) {
      // Focus the first invalid field for keyboard + screen-reader users.
      firstErrorRef.current?.focus();
      fireEvent("connect_draw_validation_error");
      return;
    }

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
        fireEvent("connect_draw_error", { http_status: res.status });
        return;
      }
      onSubmitted();
      setStatus("done");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
      fireEvent("connect_draw_error", { http_status: 0 });
    }
  }

  // ── Success view ─────────────────────────────────────────────────────
  if (status === "done") {
    return <SuccessView onBack={onBack} />;
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={`${formAriaId}-title`}
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
          id={`${formAriaId}-title`}
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
        onChange={(v) => setField("name", v)}
        autoComplete="name"
        placeholder="Jane Smith"
        error={fieldErrors.name}
        innerRef={fieldErrors.name ? firstErrorRef : undefined}
      />
      <Field
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(v) => setField("email", v)}
        autoComplete="email"
        placeholder="jane@city.ca"
        inputMode="email"
        error={fieldErrors.email}
        innerRef={!fieldErrors.name && fieldErrors.email ? firstErrorRef : undefined}
      />
      <Field
        label="Company"
        required
        value={form.company}
        onChange={(v) => setField("company", v)}
        autoComplete="organization"
        placeholder="City of Toronto"
        error={fieldErrors.company}
        innerRef={
          !fieldErrors.name && !fieldErrors.email && fieldErrors.company
            ? firstErrorRef
            : undefined
        }
      />
      <Field
        label="Role / title"
        hint="Optional"
        value={form.role}
        onChange={(v) => setField("role", v)}
        autoComplete="organization-title"
        placeholder="Public Realm Designer"
      />
      <Field
        label="Phone"
        type="tel"
        hint="Optional"
        value={form.phone}
        onChange={(v) => setField("phone", v)}
        autoComplete="tel"
        placeholder="416-555-0100"
        inputMode="tel"
      />

      {/* ── CASL opt-in ─────────────────────────────────────────────── */}
      <label
        className="flex gap-3 items-start cursor-pointer rounded-lg p-2 -mx-2 hover:bg-white/[0.02] transition-colors"
        style={{ color: "var(--text-body)" }}
      >
        <input
          type="checkbox"
          checked={form.optInMarketing}
          onChange={(e) => setField("optInMarketing", e.target.checked)}
          className="mt-0.5 h-6 w-6 shrink-0 rounded border accent-orange-500 cursor-pointer"
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
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg px-3 py-2.5 text-[14px]"
          style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.25)",
            color: "#fca5a5",
          }}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3.5 text-base font-semibold transition-all disabled:opacity-70"
          style={{
            background: "#F97316",
            color: "#fff",
            minHeight: 48,
          }}
        >
          {submitting && (
            <span
              aria-hidden
              className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
              style={{ animation: "connect-spin 0.7s linear infinite" }}
            />
          )}
          {submitting ? "Submitting your entry…" : "Enter the draw"}
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

      <style>{`
        @keyframes connect-spin { to { transform: rotate(360deg); } }
      `}</style>
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
  error?: string;
  innerRef?: React.RefObject<HTMLInputElement | null>;
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
  error,
  innerRef,
}: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="flex justify-between items-baseline text-[13px] mb-1.5"
        style={{ color: "var(--text-body)" }}
      >
        <span>
          {label}
          {required && (
            <span aria-hidden style={{ color: "#F97316" }}>
              {" *"}
            </span>
          )}
        </span>
        {hint && (
          <span id={hintId} className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {hint}
          </span>
        )}
      </label>
      <input
        id={id}
        ref={innerRef}
        type={type}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        className="w-full rounded-lg px-4 py-3 text-base outline-none transition-shadow focus:ring-2 focus:ring-orange-500"
        style={{
          background: "var(--bg-primary)",
          border: error
            ? "1px solid rgba(248,113,113,0.55)"
            : "1px solid var(--border-color)",
          color: "var(--text-primary)",
          minHeight: 48,
        }}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[12px]"
          style={{ color: "#fca5a5" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ── Success view ──────────────────────────────────────────────────────────
// Splits out so we can run useEffect for focus management — putting the focus
// on the heading on mount makes screen reader users hear the confirmation
// and gives keyboard users a real landing spot.
function SuccessView({ onBack }: { onBack: () => void }) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // Small delay so the entrance animation has started before focus jumps —
    // sighted users still get the bloom + check, screen reader users get the
    // announcement.
    const t = window.setTimeout(() => headingRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl p-7 sm:p-12 text-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-card) 0%, rgba(249,115,22,0.06) 100%)",
        border: "1px solid rgba(249,115,22,0.25)",
      }}
    >
      {/* Soft orange bloom — premium-quiet celebration */}
      <div
        aria-hidden
        className="connect-success-bloom pointer-events-none absolute inset-x-0 -top-24 h-48"
        style={{
          background:
            "radial-gradient(50% 100% at 50% 0%, rgba(249,115,22,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Animated check */}
      <div
        className="connect-success-pop mx-auto mb-6 grid place-items-center rounded-full relative"
        style={{
          width: 72,
          height: 72,
          background: "rgba(249,115,22,0.18)",
          color: "#F97316",
        }}
        aria-hidden
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            className="connect-success-tick"
            d="M5 13l4 4L19 7"
            style={{ strokeDasharray: 30, strokeDashoffset: 30 }}
          />
        </svg>
      </div>

      <p
        className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5"
        style={{ color: "#F97316" }}
      >
        You&apos;re in
      </p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl sm:text-3xl font-bold mb-3 outline-none"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
      >
        Entry confirmed.
      </h2>
      <p
        className="text-[15px] leading-relaxed mx-auto max-w-sm"
        style={{ color: "var(--text-body)" }}
      >
        Winner announced after the show. Until then — have a look around.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-all hover:translate-y-[-1px]"
        style={{
          background: "#F97316",
          color: "#fff",
          minHeight: 48,
          minWidth: 200,
        }}
      >
        Back to options
      </button>

      <style>{`
        .connect-success-pop {
          animation: connect-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .connect-success-tick {
          animation: connect-draw-check 0.5s ease-out 0.15s forwards;
        }
        @keyframes connect-pop {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes connect-draw-check {
          from { stroke-dashoffset: 30; }
          to   { stroke-dashoffset: 0;  }
        }
        @media (prefers-reduced-motion: reduce) {
          .connect-success-pop,
          .connect-success-tick { animation: none !important; }
          .connect-success-tick { stroke-dashoffset: 0 !important; }
        }
      `}</style>
    </div>
  );
}
