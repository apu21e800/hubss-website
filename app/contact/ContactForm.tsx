"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/sections/Nav";
import LunchLearn from "@/components/sections/LunchLearn";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { mailtoHref, telHref } from "@/lib/site-settings";
import { track } from "@vercel/analytics";
import { postForm } from "@/lib/post-form";
import { NextSteps, PROJECTS_STEP, SentPanel, bookStep } from "@/components/ui/SentPanel";

// Note: metadata must be in a server component — defined in layout or a parallel route.
// Page-level metadata for client components requires moving meta to a parent layout.

// Sentence case, as the Lunch & Learn topics are (copy review, 17 Oct 2026).
const projectTypes = [
  "Crosswalk or pedestrian safety",
  "Bus or bike lane markings",
  "Decorative pavement or StreetPrint",
  "Regulatory or road markings",
  "Community or public art",
  "Parking lot",
  "Other",
];

// The field labels. --text-muted, not the --text-secondary the other two
// forms' labels use: this form's card is the lighter --bg-card-surface, and
// on it --text-secondary came to 4.26:1 at 12px, under the 4.5 a small label
// needs. --text-muted is 5.66:1 there (final QA, 10 Nov 2026).
const LABEL_COLOUR = "var(--text-muted)";

interface ContactFormProps {
  footer: React.ReactNode;
  eyebrow: string;
  heading: string;
  subheading: string;
}

export default function ContactForm({ eyebrow, heading, subheading, footer }: ContactFormProps) {
  const { offices } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // `website` is the honeypot. It used to be a loose, uncontrolled input and
  // the submit body hardcoded `website: ""`, so the API's bot check never saw
  // what a bot had typed into it (QA F8, 30 Sep 2026). Bound to state now
  // and sent as typed.
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", projectType: "", message: "", website: ""
  });
  // The system or application the visitor came from ("Send us the project"
  // on a product or application page carries ?project=StreetPrint, as the
  // Lunch & Learn link carries its topic). Shown as a line above the form
  // and sent as the project type when none is chosen, so the office knows
  // which page the enquiry is about without the visitor typing it again
  // (interaction review, 17 Oct 2026).
  const [project, setProject] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("project")?.trim().slice(0, 80) ?? "";
    if (p) setProject(p);
  }, []);

  // Native validation scrolls the first invalid field into view, and the
  // sticky header (72px) then covers it on a phone (QA D10, 30 Sep 2026).
  // scroll-margin-top keeps the field, and the label above it, below the
  // header. Every field also carries name/autocomplete so browsers and
  // password managers can fill it (QA F9, F19).
  const fieldStyle = {
    background: "var(--bg-primary)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-primary)",
    scrollMarginTop: 28, // on top of html's scroll-padding-top (the bar's height, or 0 tucked, plus 20px)
  } as const;
  const AUTOCOMPLETE: Record<string, string> = {
    name: "name", company: "organization", email: "email", phone: "tel",
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* Asphalt background. One pre-darkened WebP (QA F14, 30 Sep 2026):
          the page downloaded the 495 KB homepage hero and laid an 88% black
          overlay on it. /images/contact/backdrop.webp is the same photo at
          1600 wide with that darkness baked in (26 KB), so the overlay went
          with the download. */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: "#080808",
          backgroundImage: "url('/images/contact/backdrop.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Nav />
      {/* Above the fold (Vern, 20 Oct 2026: "make all the hero content fit
          above the fold"): the heading, the two offices and the whole form
          sit inside 768px on a laptop, 730 at 125% scaling. Measured on the
          local build: the form's card ends at 720 on 1536x730 and 1366x768,
          and at 736 on 1440x900 (before: 922). */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-14 pb-16 sm:pb-24">
        {/* Three cells. A laptop: the words over the offices on the left, the
            form on the right spanning both rows. The first row is the words'
            own height and the second takes the rest (auto 1fr), with no row
            gap, so the offices follow the words and the form card keeps its
            height and place. A phone (the walk of 4 Nov 2026: the form began
            887px down, two scrolls for every lead): the words, then the form,
            then the offices. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-x-12 lg:gap-x-16 gap-y-10 lg:gap-y-0">
          {/* Left, the words */}
          <div className="lg:pt-2">
            <p className="eyebrow mb-3" style={{ color: "var(--accent-text-lg)" }}>{eyebrow}</p>
            <h1 className="h1-page mb-5" style={{ color: "var(--text-primary)" }}>
              {heading}
            </h1>
            <p className="text-[16px] leading-relaxed lg:mb-8 max-w-prose" style={{ color: "var(--text-body)" }}>
              {subheading}
            </p>
          </div>

          {/* Right: form (both rows on a laptop; second on a phone) */}
          <div className="rounded-xl p-6 sm:p-8 lg:row-span-2 lg:col-start-2" style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)" }}>
            {submitted ? (
              /* SentPanel: the confirmation comes into view and takes the
                 focus. On a phone it sat 90px above the screen, the offices
                 in view, and nothing said the message had gone (final QA,
                 10 Nov 2026). Then two quiet ways on. */
              <SentPanel className="flex flex-col items-center justify-center h-full py-12 sm:py-16 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(249,115,22,0.15)" }}>
                  <svg className="w-7 h-7" style={{ color: "var(--accent-text-lg)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 data-sent-heading className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Message sent</h3>
                <p className="text-sm" style={{ color: "var(--text-body)" }}>We&apos;ll be in touch within one business day.</p>
                <NextSteps steps={[...bookStep(), PROJECTS_STEP]} />
              </SentPanel>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError("");
                  try {
                    // A blank company is left out rather than sent as "",
                    // so the email drops its Company row and the subject
                    // line falls back instead of ending on "@ ".
                    // postForm: the spam check, with a way round it for
                    // browsers that block it (lib/post-form.ts).
                    const res = await postForm({ ...form, projectType: form.projectType || (project ? `${project} (from the ${project} page)` : ""), company: form.company.trim() || undefined, formType: "contact", website: form.website });
                    const data = await res.json();
                    if (!res.ok || data.error) {
                      setError(data.error ?? "Something went wrong. Please try again.");
                    } else {
                      setSubmitted(true);
                      // form_sent: the visitor saw "sent", held or not. The
                      // lead (generate_lead) is the route's to send, once the
                      // message is delivered (lib/ga4-lead.ts).
                      window.gtag?.("event", "form_sent", { event_category: "conversion", form_type: "contact" });
                      track("contact_submit", { form_type: "contact" });
                    }
                  } catch {
                    setError("Network error. Please check your connection and try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-4"
              >
                {/* Company is optional (QA, 27 Sep 2026): this is the only
                    enquiry form, and a homeowner coming from the driveway
                    pages had to invent a company to send it. The API
                    (app/api/contact/route.ts) requires only an email. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full name", key: "name", type: "text", placeholder: "Jane Smith", optional: false },
                    { label: "Company", key: "company", type: "text", placeholder: "City of Toronto", optional: true },
                  ].map((f) => (
                    <div key={f.key}>
                      {/* The label the Lunch & Learn and Product Portfolio Book
                          forms use (uniformity pass, 17 Oct 2026: three label
                          styles across three forms). */}
                      <label htmlFor={`contact-${f.key}`} className="block text-[12px] font-semibold uppercase tracking-[0.16em] mb-1.5" style={{ color: LABEL_COLOUR }}>
                        {f.label}
                        {f.optional && <span style={{ textTransform: "none", letterSpacing: 0 }}> (optional)</span>}
                      </label>
                      <input
                        id={`contact-${f.key}`}
                        name={f.key}
                        autoComplete={AUTOCOMPLETE[f.key]}
                        type={f.type}
                        required={!f.optional}
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 rounded-lg text-base outline-none focus:ring-1 focus:ring-orange-500 min-h-[48px]"
                        style={fieldStyle}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Email", key: "email", type: "email", placeholder: "jane@city.ca", optional: false },
                    { label: "Phone", key: "phone", type: "tel", placeholder: "416-555-0100", optional: true },
                  ].map((f) => (
                    <div key={f.key}>
                      <label htmlFor={`contact-${f.key}`} className="block text-[12px] font-semibold uppercase tracking-[0.16em] mb-1.5" style={{ color: LABEL_COLOUR }}>
                        {f.label}
                        {f.optional && <span style={{ textTransform: "none", letterSpacing: 0 }}> (optional)</span>}
                      </label>
                      <input
                        id={`contact-${f.key}`}
                        name={f.key}
                        autoComplete={AUTOCOMPLETE[f.key]}
                        type={f.type}
                        required={f.key === "email"}
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 rounded-lg text-base outline-none focus:ring-1 focus:ring-orange-500 min-h-[48px]"
                        style={fieldStyle}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label htmlFor="contact-projectType" className="block text-[12px] font-semibold uppercase tracking-[0.16em] mb-1.5" style={{ color: LABEL_COLOUR }}>Project type</label>
                  <select
                    id="contact-projectType"
                    name="projectType"
                    autoComplete="off"
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-base outline-none focus:ring-1 focus:ring-orange-500 min-h-[48px]"
                    // Empty, it reads in the placeholder grey of the fields
                    // above (Chrome's: the text colour at half strength), not
                    // in white like a chosen value (QA, 28 Sep 2026).
                    style={{ ...fieldStyle, color: form.projectType ? "var(--text-primary)" : "color-mix(in srgb, var(--text-primary) 50%, transparent)" }}
                  >
                    <option value="">{project ? `About ${project}` : "Choose one"}</option>
                    {projectTypes.map((t) => <option key={t} value={t} style={{ color: "var(--text-primary)" }}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-[12px] font-semibold uppercase tracking-[0.16em] mb-1.5" style={{ color: LABEL_COLOUR }}>Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    autoComplete="off"
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={project ? `The ${project} job: where it is, roughly when, and the size.` : "Where the job is, roughly when, and the size."}
                    className="w-full px-4 py-3 rounded-lg text-base outline-none resize-none focus:ring-1 focus:ring-orange-500"
                    style={fieldStyle}
                  />
                </div>
                {/* Honeypot, hidden from real users; its value travels with
                    the submit (see the `website` note on the form state). */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />

                {/* role="alert": a screen reader is told the send failed. The
                    numbers follow, as the Lunch & Learn form's error gives
                    them: on a phone the offices are a scroll below the form,
                    and a send that fails twice shouldn't cost the job. */}
                {error && (
                  <p role="alert" className="text-sm text-[var(--err-text)]">
                    {error} Or call East{" "}
                    <a href={telHref(offices.east.phone)} className="font-semibold underline underline-offset-2 whitespace-nowrap">{offices.east.phone}</a>
                    {" "}or West{" "}
                    <a href={telHref(offices.west.phone)} className="font-semibold underline underline-offset-2 whitespace-nowrap">{offices.west.phone}</a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-accent btn-lg btn-block disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send us your project"}
                </button>
              </form>
            )}
          </div>

          {/* Left, under the words on a laptop; last on a phone: the offices
              from Studio's Site Settings (lib/site-settings.ts), side by side
              so both sit above the fold on a laptop. */}
          <div className="lg:col-start-1">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { region: "West office", ...offices.west },
                  { region: "East office", ...offices.east },
                ].map((office) => (
                  <div key={office.region}>
                    <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--accent-text-lg)" }}>{office.region}</p>
                    <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>{office.place}</p>
                    <a href={mailtoHref(office.email)} className="text-sm flex items-center transition-colors hover:text-[var(--accent-text-lg)]" style={{ color: "var(--text-body)", minHeight: 44 }}>{office.email}</a>
                    <a href={telHref(office.phone)} className="text-sm flex items-center transition-colors hover:text-[var(--accent-text-lg)]" style={{ color: "var(--text-body)", minHeight: 44 }}>{office.phone}</a>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-xs font-semibold uppercase tracking-widest flex-shrink-0" style={{ color: "var(--ink-50)" }}>Follow our work</p>
                  <SocialLinks size="sm" className="gap-4" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* hideForm: /contact already asked for a name and an email forty pixels
          above this. Two forms on one page is two requests, or one request
          twice, and the visitor cannot tell which. */}
      <LunchLearn compact />
      {/* The footer is rendered on the server and passed in: it reads Studio's
          Site Settings, which a client component can't (lib/site-settings.ts). */}
      {footer}
    </main>
  );
}
