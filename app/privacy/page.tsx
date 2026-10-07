import { getSiteSettings } from "@/lib/sanity.queries";
import type { SiteSettings } from "@/lib/site-settings";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How HUB Surface Systems collects, uses, and protects your personal information under PIPEDA, Canada's Personal Information Protection and Electronic Documents Act.",
  slug: "privacy",
});

// A section body is a run of blocks: a string is a paragraph, an array of
// strings is a bulleted list. The lists used to be typed hyphens inside one
// pre-formatted string, which printed as "- Contact details: …" (QA, 27 Sep
// 2026); they are real <ul> lists now.
type Block = string | string[];

// Sep 2026 review. Mailing addresses are listed because /request-idea-book
// asks for one. The third-party services are the ones the code calls, checked
// against it on 27 Sep 2026: Resend (app/api/contact/route.ts), Vercel hosting
// with Vercel Web Analytics and Speed Insights, Google Analytics (both in
// app/layout.tsx), Sanity (text and photographs, cdn.sanity.io) and CARTO (the
// homepage map's tiles, components/sections/CanadaMap.tsx). The Crisp chat
// component does nothing unless NEXT_PUBLIC_CRISP_WEBSITE_ID is set, and the
// live build does not set it, so Crisp is not listed; add it here if it is
// ever switched on. The old list's "data processed in North America" and
// "anonymized ... IP anonymization enabled" were dropped: nothing in the repo
// configures or documents either. 6 Oct 2026: the forms gained Vercel BotID
// (part of the Vercel line) and a spam screen that sends the name, company,
// email domain, project fields and the message, with phone numbers and email
// addresses replaced, to Anthropic's Claude (lib/form-screen.ts). Never the
// phone field, the full email or the mailing address (an Idea Book request's
// city included). Hence the new line.
// The contact lines carry the offices from Studio's Site Settings
// (lib/site-settings.ts), so they match the footer.
const buildSections = (offices: SiteSettings["offices"]): { heading: string; blocks: Block[] }[] => [
  {
    heading: "1. Information we collect",
    blocks: [
      "When you use hubss.com or submit an inquiry, we may collect the following personal information:",
      [
        "Contact details: name, email address, phone number, company name, and job title",
        "Mailing address: the address you give us when you request a printed Idea Book",
        "Project information: location, project type, and details you provide in form submissions",
        "Usage data: pages visited, time on site, browser type, and referring URL (collected via cookies and analytics tools)",
        "Communications: records of email correspondence or form submissions",
      ],
      "We collect this information only when you voluntarily provide it, or when it is automatically collected through your use of the site.",
    ],
  },
  {
    heading: "2. How we use your information",
    blocks: [
      "We use collected information to:",
      [
        "Respond to your inquiries and project requests",
        "Send requested product information, spec sheets, or follow-up materials",
        "Mail the printed Idea Book to the address you give us",
        "Schedule and confirm Lunch & Learn sessions",
        "Improve our website and service offerings",
        "Send relevant updates or product announcements (only with your consent)",
        "Comply with legal obligations",
      ],
      "We do not sell, rent, or trade your personal information to third parties.",
    ],
  },
  {
    heading: "3. Legal basis (PIPEDA)",
    blocks: [
      "HUB Surface Systems is a Canadian company subject to the Personal Information Protection and Electronic Documents Act (PIPEDA). We collect, use, and disclose personal information with your consent, either express (you fill out a form) or implied (you provide a business card at a trade show).",
      "You may withdraw consent at any time by contacting us at the addresses below, subject to legal or contractual restrictions.",
    ],
  },
  {
    heading: "4. Third-party services",
    blocks: [
      "We use the following third-party services that may process your data:",
      [
        "Email delivery: Resend (sends the forms on this site to our inbox)",
        "Hosting: Vercel (hosts the site and checks that our forms are sent from a real browser; Vercel Web Analytics and Speed Insights measure page visits and loading speed)",
        "Spam screening: Anthropic (reads what you send through our forms, with phone numbers and email addresses taken out and never your mailing address, to keep spam out of our inbox)",
        "Analytics: Google Analytics (pages visited, time on site, browser type, and referring URL)",
        "Content: Sanity (stores the site's text and serves its photographs)",
        "Maps: CARTO (supplies the map on the homepage)",
      ],
      "Each service operates under its own privacy policy. We choose partners who maintain data protection standards consistent with PIPEDA.",
    ],
  },
  {
    heading: "5. Cookies",
    blocks: [
      "hubss.com uses cookies to:",
      [
        "Remember your preferences and session state",
        "Collect analytics data",
        "Improve site performance",
      ],
      "You can disable cookies in your browser settings. Disabling cookies may affect some site functionality. We do not use cookies for advertising or cross-site tracking.",
    ],
  },
  {
    heading: "6. Data retention",
    blocks: [
      "We retain personal information for as long as necessary to fulfil the purposes described in this policy, or as required by law. Inquiry records are typically retained for 3 years from the date of last contact. You may request deletion of your data at any time.",
    ],
  },
  {
    heading: "7. Your rights",
    blocks: [
      "Under PIPEDA, you have the right to:",
      [
        "Access the personal information we hold about you",
        "Correct inaccurate or incomplete information",
        "Withdraw consent to our use of your information",
        "Request deletion of your personal information",
        "File a complaint with the Office of the Privacy Commissioner of Canada",
      ],
      "To exercise any of these rights, contact us using the information below.",
    ],
  },
  {
    heading: "8. Contact us",
    blocks: [
      "For privacy-related inquiries, contact:",
      "HUB Surface Systems",
      `East office · ${offices.east.place}\n${offices.east.email} · ${offices.east.phone}`,
      `West office · ${offices.west.place}\n${offices.west.email} · ${offices.west.phone}`,
    ],
  },
];

export default async function PrivacyPage() {
  const { offices } = await getSiteSettings();
  const sections = buildSections(offices);
  return (
    <main style={{ background: "var(--bg-section-asphalt)", minHeight: "100vh" }}>
      <Nav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--accent-text-lg)" }}>
          Legal
        </p>
        <h1 className="text-5xl font-bold mb-3 leading-tight" style={{ color: "var(--text-primary)" }}>
          Privacy policy
        </h1>
        <p className="text-sm mb-12" style={{ color: "var(--text-muted)" }}>
          Last updated: Oct 6, 2026
        </p>

        <p className="text-base leading-relaxed mb-12" style={{ color: "var(--text-muted)" }}>
          HUB Surface Systems (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy.
          This policy explains how we collect, use, and safeguard your personal information when
          you visit hubss.com or contact us about our products and services.
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.heading} style={{ borderTop: "1px solid var(--border-strong)", paddingTop: "32px" }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                {section.heading}
              </h2>
              <div className="text-sm leading-relaxed space-y-3" style={{ color: "var(--text-muted)" }}>
                {section.blocks.map((block, i) =>
                  typeof block === "string" ? (
                    <p key={i} className="whitespace-pre-line">{block}</p>
                  ) : (
                    <ul key={i} className="list-disc pl-5 space-y-1.5 marker:text-[var(--text-hint)]">
                      {block.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
