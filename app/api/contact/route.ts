import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkBotId } from "botid/server";
import { screenSubmission } from "@/lib/form-screen";

const TO_EMAIL = process.env.CONTACT_EMAIL ?? "info@hubss.com";
// Printed-catalogue requests are fulfilment, not enquiries: Doug wants to see
// them apart from the rest. Today a distinct subject line does that with a mail
// rule; setting CATALOGUE_EMAIL later moves them to their own inbox with no
// code change.
const CATALOGUE_TO_EMAIL = process.env.CATALOGUE_EMAIL ?? TO_EMAIL;
// Where everything held back from Doug goes (spam, a browser BotID doubts, a
// filled honeypot): Vern's inbox, marked [Screened], so a wrong call is one
// forward away. Nothing a visitor sends is ever thrown away.
const SCREENED_TO_EMAIL = process.env.FORM_SCREENED_EMAIL || "cleve.stordy@hubss.com";

const FORM_TYPES = ["contact", "lunch-learn", "newsletter", "catalogue-print"] as const;
type FormType = (typeof FORM_TYPES)[number];

/** Longest kept per field. Longer is trimmed, never refused: a long phone line is still a lead. */
const MAX_LEN: Record<string, number> = {
  name: 200, email: 254, company: 200, city: 120, phone: 80, address: 600,
  projectType: 120, format: 40, topic: 120, from: 60, message: 20000, website: 400,
};
/** A real form sends a few kilobytes; this only stops a script posting megabytes. */
const MAX_BODY_BYTES = 200_000;
/** BotID's answer normally takes milliseconds; past this, carry on without it. */
const BOTID_TIMEOUT_MS = 2500;

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

/**
 * In screened mail, links can't be clicked by accident: any word that looks
 * like a web or email address gets "hxxp" for "http" and "[.]" for its dots.
 * One word at a time, so a hostile message can't make it slow.
 */
function defang(v: string): string {
  return v.replace(/\S+/g, (word) =>
    /^(?:https?:\/\/|www\.)|\/|@|\.[a-z]{2,24}$/i.test(word) && /[a-z0-9-]\.[a-z]/i.test(word)
      ? word.replace(/^http/i, "hxxp").replace(/\./g, "[.]")
      : word
  );
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

type Hold = { by: string; reason: string };

function buildEmailHtml(data: ContactPayload, hold?: Hold): string {
  // Held-back mail has its links defanged; Doug's mail is exactly as typed.
  const show = (v: string) => esc(hold ? defang(v) : v);
  // City is folded into the address block for catalogue requests, so printing
  // it twice would just look like a mistake on a shipping label.
  const showCity = Boolean(data.city) && data.formType !== "catalogue-print";
  const rows = [
    data.name && `<tr><td><strong>Name</strong></td><td>${show(data.name)}</td></tr>`,
    data.email && `<tr><td><strong>Email</strong></td><td>${show(data.email)}</td></tr>`,
    data.company && `<tr><td><strong>Company</strong></td><td>${show(data.company)}</td></tr>`,
    showCity && `<tr><td><strong>City</strong></td><td>${show(data.city!)}</td></tr>`,
    data.phone && `<tr><td><strong>Phone</strong></td><td>${show(data.phone)}</td></tr>`,
    data.address && `<tr><td valign="top"><strong>Mail to</strong></td><td style="white-space:pre-wrap">${show(data.address)}</td></tr>`,
    data.projectType && `<tr><td><strong>Project type</strong></td><td>${show(data.projectType)}</td></tr>`,
    data.format && `<tr><td><strong>Session format</strong></td><td>${show(data.format)}</td></tr>`,
    data.topic && `<tr><td><strong>Session topic</strong></td><td>${show(data.topic.slice(0, 80))}</td></tr>`,
    data.from && `<tr><td><strong>Booked from</strong></td><td>${show(data.from.slice(0, 40))}</td></tr>`,
    data.message && `<tr><td valign="top"><strong>Message</strong></td><td style="white-space:pre-wrap">${show(data.message)}</td></tr>`,
    hold && data.website && `<tr><td valign="top"><strong>Hidden field</strong></td><td>${show(data.website)}</td></tr>`,
  ]
    .filter(Boolean)
    .join("\n");

  // Held-back mail says so first, and why, so a wrong call is easy to spot
  // and forward.
  const banner = hold
    ? `<div style="background:#fff7ed;border:1px solid #fdba74;border-radius:6px;padding:12px 14px;margin:0 0 20px;font-size:13px;line-height:1.6;color:#7c2d12">
        <strong>Held back from ${esc(TO_EMAIL)}.</strong><br>
        Why (${esc(hold.by)}): ${esc(hold.reason || "no reason given")}.<br>
        If this is a real enquiry, forward it to ${esc(TO_EMAIL)}. Links in it are disabled; don't retype them.
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
 * Only known fields, only strings, trimmed to their real lengths. The site's
 * three forms send strings only, and require an email (checked against these
 * forms on 6 Oct 2026). Anything else is a script: numbers or objects used to
 * reach the HTML builder, where a non-string threw and nobody got anything.
 */
function readPayload(raw: unknown): ContactPayload | { error: string; code: string } {
  const missing = { error: "Missing required fields.", code: "missing-fields" };
  if (!raw || typeof raw !== "object") return { ...missing, code: "not-json" };
  const src = raw as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of Object.keys(MAX_LEN)) {
    const v = src[key];
    if (v === undefined || v === null || v === "") continue;
    if (typeof v !== "string") return { ...missing, code: `not-a-string:${key}` };
    out[key] = v.length > MAX_LEN[key]
      ? key === "message"
        ? `${v.slice(0, MAX_LEN[key])}\n\n[Trimmed at ${MAX_LEN[key].toLocaleString("en-CA")} characters]`
        : v.slice(0, MAX_LEN[key])
      : v;
  }
  const formType = src.formType;
  if (typeof formType !== "string" || !(FORM_TYPES as readonly string[]).includes(formType)) {
    return { ...missing, code: "form-type" };
  }
  // What the browser's own email check lets through ("jane@gmail" included).
  if (!out.email || !/^[^\s@]+@[^\s@]+$/.test(out.email.trim())) return { ...missing, code: "email" };
  return { ...out, email: out.email.trim(), formType: formType as FormType };
}

/** One line per request, no names, addresses or messages: what happened and why. */
function logOutcome(form: string, outcome: string, gate: string, by = "", reason = "") {
  console.info(`[contact] ${JSON.stringify({ form, outcome, gate, by, reason: reason.slice(0, 160) })}`);
}

/**
 * BotID's view of the request. "human": checked and fine. "bot": checked and
 * doubted. "unchecked": the check failed or took too long, or the browser
 * could not run it (a content blocker, a strict office network) and the form
 * sent without it (lib/post-form.ts). "script": no check and not sent from
 * this site's pages at all.
 */
async function botGate(req: NextRequest): Promise<"human" | "bot" | "unchecked" | "script"> {
  if (!req.headers.has("x-is-human")) {
    // A browser always sends Origin on a POST; scripts usually don't bother.
    const origin = req.headers.get("origin");
    let sameSite = false;
    try {
      sameSite = Boolean(origin) && new URL(origin!).host === req.headers.get("host");
    } catch {}
    return sameSite ? "unchecked" : "script";
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const verification = await Promise.race([
      checkBotId(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`no answer in ${BOTID_TIMEOUT_MS} ms`)), BOTID_TIMEOUT_MS);
      }),
    ]);
    return verification.isBot ? "bot" : "human";
  } catch (err) {
    console.error("[contact] BotID check failed; screening instead:", err instanceof Error ? err.message : err);
    return "unchecked";
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
      logOutcome("unknown", "rejected", "-", "size", "body too large");
      return NextResponse.json({ error: UNVERIFIED }, { status: 413 });
    }

    // 1. Was it sent from this site in a browser? (instrumentation-client.ts
    //    adds BotID's proof to every form's request.) Only a request with no
    //    proof that didn't come from the site's own pages is refused.
    const gate = await botGate(req);
    if (gate === "script") {
      logOutcome("unknown", "blocked", gate);
      return NextResponse.json({ error: UNVERIFIED }, { status: 403 });
    }

    const parsed = readPayload(await req.json().catch(() => null));
    if ("error" in parsed) {
      logOutcome("unknown", "rejected", gate, "validation", parsed.code);
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const body = parsed;

    // 2. Who should read it? Doug, unless something says otherwise; then the
    //    screened inbox, with the reason on top. Never nobody.
    let hold: Hold | undefined;
    let decidedBy = "";
    if (body.website) {
      hold = { by: "honeypot", reason: "the hidden field only bots fill was filled in" };
    } else if (gate === "bot") {
      hold = { by: "Vercel BotID", reason: "the bot check doubted this browser" };
    } else {
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
      decidedBy = verdict.by;
      if (verdict.verdict === "spam") {
        hold = { by: verdict.by === "model" ? "Claude" : "the backup rules", reason: verdict.reason };
      }
    }
    const logBy = hold?.by ?? decidedBy;
    const logReason = hold?.reason ?? "";

    if (!process.env.RESEND_API_KEY) {
      // Dev fallback: no key, no mail. The log line still shows the decision.
      logOutcome(body.formType, hold ? "held-not-sent" : "delivered-not-sent", gate, logBy, logReason);
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    // A reply-to the mail server would refuse ("jane@gmail") would cost the
    // whole message; the address is in the body either way.
    const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email ?? "") ? body.email : undefined;
    const { error } = await resend.emails.send({
      from: "HUB Surface Systems <noreply@hubss.com>",
      to: [hold ? SCREENED_TO_EMAIL : body.formType === "catalogue-print" ? CATALOGUE_TO_EMAIL : TO_EMAIL],
      ...(replyTo ? { replyTo } : {}),
      subject: `${hold ? "[Screened] " : ""}${buildSubjectLine(body)}`,
      html: buildEmailHtml(body, hold),
    });

    if (error) {
      console.error("[contact API] Resend error:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    // The visitor sees the same "sent" either way, so a spammer learns nothing.
    logOutcome(body.formType, hold ? "held" : "delivered", gate, logBy, logReason);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact API] Unexpected error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
