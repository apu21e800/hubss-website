import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_EMAIL ?? "info@hubss.com";
// Printed-catalogue requests are fulfilment, not enquiries: Doug wants to see
// them apart from the rest. Today a distinct subject line does that with a mail
// rule; setting CATALOGUE_EMAIL later moves them to their own inbox with no
// code change.
const CATALOGUE_TO_EMAIL = process.env.CATALOGUE_EMAIL ?? TO_EMAIL;

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
  formType: "contact" | "lunch-learn" | "newsletter" | "catalogue-print";
  name?: string;
  email?: string;
  company?: string;
  city?: string;
  phone?: string;
  address?: string; // catalogue-print: street, then "City PR A1A 1A1"
  projectType?: string;
  format?: string; // lunch-learn: In-person | Virtual | Either
  message?: string;
  website?: string; // honeypot
}

function buildEmailHtml(data: ContactPayload): string {
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
    data.projectType && `<tr><td><strong>Project Type</strong></td><td>${esc(data.projectType)}</td></tr>`,
    data.format && `<tr><td><strong>Session Format</strong></td><td>${esc(data.format)}</td></tr>`,
    data.message && `<tr><td valign="top"><strong>Message</strong></td><td style="white-space:pre-wrap">${esc(data.message)}</td></tr>`,
  ]
    .filter(Boolean)
    .join("\n");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <div style="background:#f97316;height:4px;margin-bottom:24px;border-radius:2px"></div>
      <h2 style="margin:0 0 16px;color:#1a1a1a">
        ${
          data.formType === "lunch-learn"
            ? "New Lunch &amp; Learn Request"
            : data.formType === "newsletter"
            ? "Newsletter Signup"
            : data.formType === "catalogue-print"
            ? "Printed Idea Book Request"
            : "New Contact Form Submission"
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
  if (data.formType === "lunch-learn") {
    return `Lunch & Learn Request — ${data.name ?? "Unknown"} @ ${data.company ?? "Unknown"}`;
  }
  if (data.formType === "newsletter") {
    return `Newsletter Signup — ${data.email}`;
  }
  if (data.formType === "catalogue-print") {
    return `Printed Idea Book Request — ${data.name ?? "Unknown"} @ ${data.company ?? "Unknown"}`;
  }
  return `Contact Form — ${data.name ?? "Unknown"} @ ${data.company ?? "Unknown"}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;

    // Honeypot: if the hidden "website" field is filled, silently succeed
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    // Basic validation
    if (!body.email || !body.formType) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      // Dev fallback: silently succeed when no key is configured
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "HUB Surface Systems <noreply@hubss.com>",
      to: [body.formType === "catalogue-print" ? CATALOGUE_TO_EMAIL : TO_EMAIL],
      replyTo: body.email,
      subject: buildSubjectLine(body),
      html: buildEmailHtml(body),
    });

    if (error) {
      console.error("[contact API] Resend error:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact API] Unexpected error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
