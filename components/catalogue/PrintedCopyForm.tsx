"use client";

/**
 * Request a printed catalogue.
 *
 * Used twice from one definition: as the body of /request-product-book, and as an
 * overlay inside the reader so nobody has to leave page 78 to ask for the book.
 *
 * Submissions go to /api/contact with formType "catalogue-print", which gives
 * them their own subject line ("Printed Catalogue Request - ...") and, if
 * CATALOGUE_EMAIL is ever set, their own inbox. Doug asked to be able to see
 * catalogue requests apart from general enquiries; a distinct subject does that
 * with a mail rule today and a separate address later, without a code change.
 */

import { useState } from "react";
import { track } from "@vercel/analytics";
import { postForm } from "@/lib/post-form";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { telHref } from "@/lib/site-settings";
import { lunchLearnHref } from "@/lib/lunch-learn";
import { NextSteps, SentPanel, bookStep } from "@/components/ui/SentPanel";

const PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
];

type Status = "idle" | "sending" | "sent" | "error";

export default function PrintedCopyForm({ compact = false }: { compact?: boolean }) {
  // The office phones for the "sent" panel, from Studio's Site Settings.
  const { offices } = useSiteSettings();
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
      // postForm: the spam check, with a way round it for browsers that
      // block it (lib/post-form.ts).
      const res = await postForm({
        formType: "catalogue-print",
        name: get("name"),
        company: get("company"),
        email: get("email"),
        phone: get("phone"),
        city,
        address: [street, `${city} ${province} ${postal}`.trim()].filter(Boolean).join("\n"),
        message: get("message"),
        website: get("website"),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong.");
      }
      setStatus("sent");
      form.reset();
      // A request for the printed book is a lead, like the contact and Lunch &
      // Learn forms (until 15 Oct 2026 it was the one form GA never heard of).
      // Since 20 Oct 2026 the route sends the lead (generate_lead) once the
      // request is delivered (lib/ga4-lead.ts); form_sent is the "sent" screen,
      // held or not.
      window.gtag?.("event", "form_sent", { event_category: "conversion", form_type: "product-book-print" });
      track("product_book_request", { form_type: "product-book-print" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      /* SentPanel: the confirmation comes into view and takes the focus. The
         form is the longest on the site, so this short panel in its place
         sat 450px above a phone's screen and under the bar on a laptop, the
         footer in view (final QA, 10 Nov 2026).
         Until then the second line said "reply to the confirmation and tell
         us the date". No confirmation is sent: the route mails the office
         only (app/api/contact/route.ts). The offices' numbers stand in. */
      <SentPanel className="rounded-xl p-7 text-center" style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}>
        <p data-sent-heading className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          Request received.
        </p>
        {/* Balanced lines, and a number never breaks at its hyphen. */}
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)", textWrap: "balance" }}>
          We will put a copy in the mail. Need it by a certain date? Call your regional office: East{" "}
          <a href={telHref(offices.east.phone)} className="font-semibold underline underline-offset-2 whitespace-nowrap" style={{ color: "var(--text-primary)" }}>{offices.east.phone}</a>
          , West{" "}
          <a href={telHref(offices.west.phone)} className="font-semibold underline underline-offset-2 whitespace-nowrap" style={{ color: "var(--text-primary)" }}>{offices.west.phone}</a>
          .
        </p>
        {/* In the reader (compact) the book is already open behind this. */}
        <NextSteps
          steps={[
            ...(compact ? [] : bookStep("Read it online now")),
            { label: "Book a Lunch & Learn", href: lunchLearnHref(undefined, "product-book") },
          ]}
        />
      </SentPanel>
    );
  }

  const field =
    "w-full rounded-lg px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-[rgba(249,115,22,0.55)]";
  const fieldStyle = {
    background: "var(--bg-card-neutral)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
  } as const;
  const label = "block text-[12px] font-semibold uppercase tracking-[0.16em] mb-1.5";
  const labelStyle = { color: "var(--text-secondary)" } as const;

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
          <label className={label} style={labelStyle} htmlFor="pc-company">Company or organization</label>
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
            Phone <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
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
          {/* The fields' height, set outright: Chrome sizes a select by its
              font, not the line height, and it sat 4.5 px shorter than City
              and Postal code beside it (QA, 28 Sep 2026). 15 px text at the
              body's 1.7 line height, 10 px padding and a 1 px border above
              and below, as the inputs have. */}
          <select id="pc-province" name="province" required defaultValue="" className={field} style={{ ...fieldStyle, height: "calc(1.7em + 22px)" }}>
            <option value="" disabled>Select province</option>
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
        {/* "(optional)" as the Phone label above writes it. It was the
            label's capitals at 60% opacity: 2.67:1 on the paper (final QA,
            10 Nov 2026). */}
        <label className={label} style={labelStyle} htmlFor="pc-message">
          Anything we should know? <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span>
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
        <p role="alert" className="text-sm" style={{ color: "var(--err-text)" }}>
          {error} You can also email <a href="mailto:info@hubss.com" className="underline">info@hubss.com</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-accent btn-lg btn-block sm:w-auto sm:inline-flex disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Request a printed copy"}
      </button>

      {/* Was "to follow up once - nothing else": a typed dash standing in for
          an em dash (QA, 27 Sep 2026). Same promise, plainly. */}
      {/* --text-muted: --text-hint was 4.06:1 on the paper at this size. */}
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Canadian addresses only. We use this only to mail the Product Portfolio Book and to follow up once.
      </p>
    </form>
  );
}
