/**
 * One email to the editors (BLOG_DRAFT_NOTIFY, comma-separated), through
 * Resend. Shared by the daily run's three steps (lib/social-pipeline.ts,
 * lib/project-posts.ts). Never throws: a lost email must not stop a run, so
 * a missing setting or a refusal is logged and the work goes on.
 */
import { Resend } from "resend";

export const FROM = "HUB Surface Systems <noreply@hubss.com>";

/** Who gets the editors' emails, as BLOG_DRAFT_NOTIFY lists them. */
export function editorAddresses(): string[] {
  return (process.env.BLOG_DRAFT_NOTIFY ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

export interface Mail {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  /** Where a reply goes (the From is noreply). */
  replyTo?: string;
  /** Copies nobody else on the email sees. */
  bcc?: string[];
  /** The From line; FROM when not given. Always an address at hubss.com. */
  from?: string;
}

/**
 * One email to anyone (12 Nov 2026: Doug's "ready for your OK" email,
 * lib/review-notify.ts). Returns the To addresses it went to, none when it
 * couldn't. Never throws, as emailEditors.
 */
export async function sendMail(mail: Mail, tag = "mail"): Promise<string[]> {
  if (!mail.to.length || !process.env.RESEND_API_KEY) {
    console.error(`[${tag}] no email sent (${mail.to.length ? "RESEND_API_KEY missing" : "no address"}): ${mail.subject}`);
    return [];
  }
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: mail.from ?? FROM,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      ...(mail.html ? { html: mail.html } : {}),
      ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
      ...(mail.bcc?.length ? { bcc: mail.bcc } : {}),
    });
    if (error) {
      console.error(`[${tag}] email failed:`, error);
      return [];
    }
    return mail.to;
  } catch (err) {
    console.error(`[${tag}] email failed:`, err);
    return [];
  }
}

/** Sends one email; returns the addresses it went to (none when it couldn't). `tag` names the log line. */
export async function emailEditors(subject: string, text: string, tag = "mail"): Promise<string[]> {
  const to = editorAddresses();
  if (!to.length || !process.env.RESEND_API_KEY) {
    console.error(`[${tag}] no email sent (BLOG_DRAFT_NOTIFY or RESEND_API_KEY missing): ${subject}`);
    return [];
  }
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: FROM, to, subject, text });
    if (error) {
      console.error(`[${tag}] email failed:`, error);
      return [];
    }
    return to;
  } catch (err) {
    console.error(`[${tag}] email failed:`, err);
    return [];
  }
}
