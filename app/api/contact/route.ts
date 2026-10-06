import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkBotId } from "botid/server";
import { screenSubmission, type ScreenVerdict } from "@/lib/form-screen";

const TO_EMAIL = process.env.CONTACT_EMAIL ?? "info@hubss.com";
// Printed-catalogue requests are fulfilment, not enquiries: Doug wants to see
// them apart from the rest. Today a distinct subject line does that with a mail
// rule; setting CATALOGUE_EMAIL later moves them to their own inbox with no
// code change.
const CATALOGUE_TO_EMAIL = process.env.CATALOGUE_EMAIL ?? TO_EMAIL;
// Where the spam screen (lib/form-screen.ts) sends what it holds back from
// Doug: Vern's inbox, so a wrong call can be forwarded on. Set
// FORM_SCREENED_EMAIL=none to drop screened mail and keep only the log line,
// once a few weeks of it show the screen makes no wrong calls.
const SCREENED_TO_EMAIL = process.env.FORM_SCREENED_EMAIL ?? "cleve.stordy@hubss.com";

const FORM_TYPES = ["contact", "lunch-learn", "newsletter", "catalogue-print"] as const;
type FormType = (typeof FORM_TYPES)[number];

/** The longest a real visitor plausibly types into each field. Anything longer is refused, not cut. */
const MAX_LEN: Record<string, number> = {
  name: 120, email: 254, company: 160, city: 120, phone: 40, address: 400,
  projectType: 120, format: 40, topic: 120, from: 60, message: 10000, website: 400,
};

const UNVERIFIED =
  "Sorry, we couldn't send that. Please email info@hubss.com or call 416-540-9287 (East) or 604-309-8212 (West).";

/**
 * Everything below is interpolated into an HTML email. Unescaped, a stray "<"
 * in a message body silently mangles the rest of the mail, and a deliberate one
 * injects markup into Doug's inbox. Escape at the boundary.
 */
function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface ContactPayload {
  formType: FormType;
  name?: string;
  email?: string;
  company?: string;
  city?: string;
  phone?: string;
  address?: string; // catalogue-print: street, then "City PR A1A 1A1"
  projectType?: string;
  format?: string; // lunch-learn: In-person | Virtual | Either
  topic?: string; // lunch-learn: what the session is about, from the link that sent them (lib/lunch-learn.ts)
  from?: string; // lunch-learn: the kind of page that sent them (product, application, insights, menu)
  message?: string;
  website?: string; // honeypot
}

function buildEmailHtml(data: ContactPayload, screened?: ScreenVerdict): string {
  // City is folded into the address block for catalogue requests, so printing
  // it twice would just look like a mistake on a shipping label.
  const showCity = Boolean(data.city) && data.formType !== "catalogue-print";
  const rows = [
    data.name && `<tr><td><strong>Name</strong></td><td>${esc(data.name)}</td></tr>`,
    data.email && `<tr><td><strong>Email</strong></td><td>${esc(data.email)}</td></tr>`,
    data.company && `<tr><td><strong>Company</strong></td><td>${esc(data.company)}</td></tr>`,
    showCity && `<tr><td><strong>City</strong></td><td>${esc(data.city!)}</td></tr>`,
    data.phone && `<tr><td><strong>Phone</strong></td><td>${esc(data.phone)}</td></tr>`,
    data.address && `<tr><td valign="top"><strong>Mail to</strong></td><td style="white-space:pre-wrap">${esc(data.address)}</td></tr>`,
    data.projectType && `<tr><td><strong>Project type</strong></td><td>${esc(data.projectType)}</td></tr>`,
    data.format && `<tr><td><strong>Session format</strong></td><td>${esc(data.format)}</td></tr>`,
    data.topic && `<tr><td><strong>Session topic</strong></td><td>${esc(data.topic.slice(0, 80))}</td></tr>`,
    data.from && `<tr><td><strong>Booked from</strong></td><td>${esc(data.from.slice(0, 40))}</td></tr>`,
    data.message && `<tr><td valign="top"><strong>Message</strong></td><td style="white-space:pre-wrap">${esc(data.message)}</td></tr>`,
  ]
    .filter(Boolean)
    .join("\n");

  // A screened message says so first, and why, so a wrong call is easy to
  // spot and forward. Links in it are left as text: never click them.
  const banner = screened
    ? `<div style="background:#fff7ed;border:1px solid #fdba74;border-radius:6px;padding:12px 14px;margin:0 0 20px;font-size:13px;line-height:1.6;color:#7c2d12">
        <strong>Held back from ${esc(TO_EMAIL)} by the spam screen.</strong><br>
        Reason (${screened.by === "model" ? "Claude" : "rules"}): ${esc(screened.reason || "none given")}.<br>
        If this is a real enquiry, forward it to ${esc(TO_EMAIL)}. Don't open links in a message like this.
      </div>`
    : "";

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <div style="background:#f97316;height:4px;margin-bottom:24px;border-radius:2px"></div>
      ${banner}
      <h2 style="margin:0 0 16px;color:#1a1a1a">
        ${
          data.formType === "lunch-learn"
            ? "New Lunch &amp; Learn request"
            : data.formType === "newsletter"
            ? "Newsletter signup"
            : data.formType === "catalogue-print"
            ? "Printed Idea Book request"
            : "New contact form submission"
        }
      </h2>
      <table style="width:100%;border-collapse:collapse">
        <tbody style="font-size:14px;line-height:1.8;color:#333">
          ${rows}
        </tbody>
      </table>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
      <p style="font-size:12px;color:#999;margin:0">
        Submitted via hubss.com &nbsp;·&nbsp; ${new Date().toLocaleString("en-CA", { timeZone: "America/Toronto" })} ET
      </p>
    </div>
  `;
}

function buildSubjectLine(data: ContactPayload): string {
  // Company is optional on every form since 27 Sep 2026: leave the "@ …" out
  // when it is blank rather than printing "@ Unknown" in Doug's inbox.
  const who = `${data.name?.trim() || "Unknown"}${data.company?.trim() ? ` @ ${data.company.trim()}` : ""}`;
  if (data.formType === "lunch-learn") {
    const topic = data.topic?.trim() ? ` · ${data.topic.trim().slice(0, 80)}` : "";
    return `Lunch & Learn Request: ${who}${topic}`;
  }
  if (data.formType === "newsletter") {
    return `Newsletter Signup: ${data.email}`;
  }
  if (data.formType === "catalogue-print") {
    return `Printed Idea Book Request: ${who}`;
  }
  return `Contact Form: ${who}`;
}

/**
 * Only known fields, only strings, only real lengths. A form sends strings;
 * anything else (numbers, objects, a 2 MB message) is a script, and used to
 * reach the HTML builder, where a non-string threw and Doug got nothing.
 */
function readPayload(raw: unknown): ContactPayload | { error: string } {
  if (!raw || typeof raw !== "object") return { error: "Missing required fields." };
  const src = raw as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of Object.keys(MAX_LEN)) {
    const v = src[key];
    if (v === undefined || v === null || v === "") continue;
    if (typeof v !== "string") return { error: "Missing required fields." };
    if (v.length > MAX_LEN[key]) {
      return key === "message"
        ? { error: "That message is too long for the form. Please email it to info@hubss.com." }
        : { error: "One of the fields is too long. Please shorten it and try again." };
    }
    out[key] = v;
  }
  const formType = src.formType;
  if (typeof formType !== "string" || !(FORM_TYPES as readonly string[]).includes(formType) || !out.email) {
    return { error: "Missing required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email.trim())) {
    return { error: "Please check your email address." };
  }
  return { ...out, formType: formType as FormType };
}

/** One line per submission, no names, addresses or messages: what happened and why. */
function logOutcome(form: string, outcome: string, by: string, reason = "") {
  console.info(`[contact] ${JSON.stringify({ form, outcome, by, reason: reason.slice(0, 160) })}`);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Was it sent from a real browser on this site? BotID answers from the
    //    request's headers alone, so a script is turned away before its body
    //    is read. instrumentation-client.ts adds the proof to every form's
    //    request. If the check itself fails (a Vercel outage), carry on to
    //    the screen rather than refuse a visitor who may be real.
    try {
      const verification = await checkBotId();
      if (verification.isBot) {
        logOutcome("unknown", "blocked", "botid");
        return NextResponse.json({ error: UNVERIFIED }, { status: 403 });
      }
    } catch (err) {
      console.error("[contact] BotID check failed; screening instead:", err instanceof Error ? err.message : err);
    }

    if (Number(req.headers.get("content-length") ?? 0) > 64_000) {
      return NextResponse.json({ error: "That message is too long for the form. Please email it to info@hubss.com." }, { status: 413 });
    }

    const parsed = readPayload(await req.json().catch(() => null));
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const body = parsed;

    // 2. Honeypot: if the hidden "website" field is filled, silently succeed
    if (body.website) {
      logOutcome(body.formType, "dropped", "honeypot");
      return NextResponse.json({ success: true });
    }

    // 3. Read it before Doug does (lib/form-screen.ts). Spam goes to the
    //    screened inbox with a banner saying why; the visitor sees the same
    //    "sent" either way, so a spammer learns nothing.
    const verdict = await screenSubmission({
      formType: body.formType,
      name: body.name,
      company: body.company,
      email: body.email,
      city: body.city,
      projectType: body.projectType,
      format: body.format,
      topic: body.topic,
      hasPhone: Boolean(body.phone?.trim()),
      hasAddress: Boolean(body.address?.trim()),
      message: body.message,
    });
    const screened = verdict.verdict === "spam";

    if (!process.env.RESEND_API_KEY) {
      // Dev fallback: no key, no mail. The log line still shows the verdict.
      logOutcome(body.formType, screened ? "screened-not-sent" : "delivered-not-sent", verdict.by, verdict.reason);
      return NextResponse.json({ success: true });
    }

    if (screened && /^(none|off|drop)$/i.test(SCREENED_TO_EMAIL.trim())) {
      logOutcome(body.formType, "screened-dropped", verdict.by, verdict.reason);
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "HUB Surface Systems <noreply@hubss.com>",
      to: [screened ? SCREENED_TO_EMAIL : body.formType === "catalogue-print" ? CATALOGUE_TO_EMAIL : TO_EMAIL],
      replyTo: body.email,
      subject: `${screened ? "[Screened] " : ""}${buildSubjectLine(body)}`,
      html: buildEmailHtml(body, screened ? verdict : undefined),
    });

    if (error) {
      console.error("[contact API] Resend error:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    logOutcome(body.formType, screened ? "screened" : "delivered", verdict.by, verdict.reason);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact API] Unexpected error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
