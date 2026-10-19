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
