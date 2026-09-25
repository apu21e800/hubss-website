"use client";

/**
 * Request a printed catalogue.
 *
 * Used twice from one definition: as the body of /request-idea-book, and as an
 * overlay inside the reader so nobody has to leave page 78 to ask for the book.
 *
 * Submissions go to /api/contact with formType "catalogue-print", which gives
 * them their own subject line ("Printed Catalogue Request - ...") and, if
 * CATALOGUE_EMAIL is ever set, their own inbox. Doug asked to be able to see
 * catalogue requests apart from general enquiries; a distinct subject does that
 * with a mail rule today and a separate address later, without a code change.
 */

import { useState } from "react";

const PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
];

type Status = "idle" | "sending" | "sent" | "error";

export default function PrintedCopyForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const street = get("street");
    const city = get("city");
    const province = get("province");
    const postal = get("postal");

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "catalogue-print",
          name: get("name"),
          company: get("company"),
          email: get("email"),
          phone: get("phone"),
          city,
          address: [street, `${city} ${province} ${postal}`.trim()].filter(Boolean).join("\n"),
          message: get("message"),
          website: get("website"),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl p-7 text-center" style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}>
        <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          Request received.
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          We will put a copy in the mail. If you need it for a specific meeting, reply to the confirmation and tell us
          the date.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-lg px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-[rgba(249,115,22,0.55)]";
  const fieldStyle = {
    background: "var(--bg-card-neutral)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
  } as const;
  const label = "block text-[11px] font-semibold uppercase tracking-[0.16em] mb-1.5";
  const labelStyle = { color: "var(--text-muted)" } as const;

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-3.5" : "space-y-4"}>
      {/* Honeypot: bots fill it, people never see it. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} style={labelStyle} htmlFor="pc-name">Name</label>
          <input id="pc-name" name="name" required autoComplete="name" className={field} style={fieldStyle} />
        </div>
        <div>
          <label className={label} style={labelStyle} htmlFor="pc-company">Company or municipality</label>
          <input id="pc-company" name="company" required autoComplete="organization" className={field} style={fieldStyle} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} style={labelStyle} htmlFor="pc-email">Email</label>
          <input id="pc-email" name="email" type="email" required autoComplete="email" className={field} style={fieldStyle} />
        </div>
        <div>
          <label className={label} style={labelStyle} htmlFor="pc-phone">
            Phone <span style={{ opacity: 0.6 }}>(optional)</span>
          </label>
          <input id="pc-phone" name="phone" type="tel" autoComplete="tel" className={field} style={fieldStyle} />
        </div>
      </div>

      <div>
        <label className={label} style={labelStyle} htmlFor="pc-street">Mailing address</label>
        <input
          id="pc-street"
          name="street"
          required
          autoComplete="street-address"
          placeholder="Street address, suite or unit"
          className={field}
          style={fieldStyle}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <div>
          <label className={label} style={labelStyle} htmlFor="pc-city">City</label>
          <input id="pc-city" name="city" required autoComplete="address-level2" className={field} style={fieldStyle} />
        </div>
        <div>
          <label className={label} style={labelStyle} htmlFor="pc-province">Province</label>
          <select id="pc-province" name="province" required defaultValue="" className={field} style={fieldStyle}>
            <option value="" disabled>--</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} style={labelStyle} htmlFor="pc-postal">Postal code</label>
          <input
            id="pc-postal"
            name="postal"
            required
            autoComplete="postal-code"
            inputMode="text"
            className={field + " sm:w-32"}
            style={fieldStyle}
          />
        </div>
      </div>

      <div>
        <label className={label} style={labelStyle} htmlFor="pc-message">
          Anything we should know? <span style={{ opacity: 0.6 }}>(optional)</span>
        </label>
        <textarea
          id="pc-message"
          name="message"
          rows={compact ? 2 : 3}
          placeholder="A project you are specifying, a deadline, how many copies you need."
          className={field}
          style={fieldStyle}
        />
      </div>

      {status === "error" && (
        <p className="text-sm" style={{ color: "#f97316" }}>
          {error} You can also email <a href="mailto:info@hubss.com" className="underline">info@hubss.com</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full px-6 py-3.5 text-[14px] font-semibold text-white transition-colors disabled:opacity-60 sm:w-auto"
        style={{ background: "#F97316", boxShadow: "0 4px 16px rgba(249,115,22,0.28)" }}
      >
        {status === "sending" ? "Sending..." : "Request a printed copy"}
      </button>

      <p className="text-xs" style={{ color: "var(--text-hint)" }}>
        Canadian addresses only. We use this to mail the Idea Book and to follow up once - nothing else.
      </p>
    </form>
  );
}
