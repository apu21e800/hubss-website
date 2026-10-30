import { getSiteSettings } from "@/lib/sanity.queries";
import type { SiteSettings } from "@/lib/site-settings";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How HUB Surface Systems collects, uses and protects your personal information under PIPEDA, Canada's federal private-sector privacy law.",
  slug: "privacy",
});

// A section body is a run of blocks: a string is a paragraph, an array of
// strings is a bulleted list. The lists used to be typed hyphens inside one
// pre-formatted string, which printed as "- Contact details: …" (QA, 27 Sep
// 2026); they are real <ul> lists now.
type Block = string | string[];

// Sep 2026 review. Mailing addresses are listed because /request-product-book
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
// phone field, the full email or the mailing address (a Product Book request's
// city included). Hence the new line. 30 Oct 2026: Google Ads, for the
// Western Canada campaign (claude/HUBSS-google-ads-plan-2026-10.md): it shows
// the ads and, through GA4, counts the enquiries they bring. Later the same
// day (Vern: "add the new line on the privacy page if it does not hurt"), the
// cookie section says we may use remarketing, with what Google requires a site
// to disclose (support.google.com/analytics/answer/2700409 and
// support.google.com/google-ads/answer/2549063). The measurement sentence is
// true now: with GA4 linked to Google Ads the tag sends each page view to
// stats.g.doubleclick.net and each key event to
// www.google.com/measurement/conversion (seen 30 Oct 2026). "May" keeps the
// remarketing sentence true while it is off (personalised advertising off in
// the link, no list of ours, Google signals off). The same review added how a
// form says where the visitor came from (lib/visit-source.ts) and that the
// services above may process data in the US. Before switching remarketing on:
// - PIPEDA (OPC guidance gl_ba_1112): a notice outside this page, at or before
//   collection, with the opt-outs one click away (a first-visit notice or an
//   "Ad choices" footer link, and these addresses as links), and a stated
//   list duration.
// - Quebec (Law 25 s. 8.1): profiling off until the visitor turns it on, so
//   consent defaults (ad_storage, ad_user_data, ad_personalization) denied
//   for Quebec visitors (x-vercel-ip-country-region QC) until they agree.
// - EEA, UK, Switzerland (Google's EU user consent policy): ads
//   personalization off for them in GA4's advanced settings, or consent.
// - Lists from all visitors or product and application pages, never from
//   posts on sensitive subjects (the Pride or Every Child Matters posts). No
//   Google-engaged audience on a campaign until this is done.
// - Then "may also use" becomes "also use" and the date changes. If Google
//   signals is turned on, say Google may recognize signed-in visitors on
//   other devices.
// The contact lines carry the offices from Studio's Site Settings
// (lib/site-settings.ts), so they match the footer.
const buildSections = (offices: SiteSettings["offices"]): { heading: string; blocks: Block[] }[] => [
  {
    heading: "1. Information we collect",
    blocks: [
      "When you use hubss.com or submit an inquiry, we may collect the following personal information:",
      [
        "Contact details: name, email address, phone number, company name, and job title",
        "Mailing address: the address you give us when you request a printed Product Portfolio Book",
        "Project information: location, project type, and details you provide in form submissions",
        "Usage data: pages visited, time on site, browser type, and referring URL (collected via cookies and analytics tools)",
        "How you reached us: when you send a form, the ad, search or website that brought you to hubss.com and the first page you landed on, sent with your message",
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
        "Mail the printed Product Portfolio Book to the address you give us",
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
        "Email newsletters: Constant Contact (sends our e-blasts to the contacts on our list; every e-blast has an unsubscribe link)",
        "Hosting: Vercel (hosts the site and checks that our forms are sent from a real browser; Vercel Web Analytics and Speed Insights measure page visits and loading speed)",
        "Spam screening: Anthropic (reads what you send through our forms, with phone numbers and email addresses taken out and never your mailing address, to keep spam out of our inbox)",
        "Analytics: Google Analytics (pages visited, time on site, browser type, and referring URL)",
        "Advertising: Google Ads (shows our ads, measures which of them lead to inquiries, and may show our ads to people who have visited this site)",
        "Content: Sanity (stores the site's text and serves its photographs)",
        "Maps: CARTO (supplies the map on the homepage)",
      ],
      "Each service operates under its own privacy policy. We choose partners who maintain data protection standards consistent with PIPEDA. Some of these services store or process data outside Canada, including in the United States, where it may be accessible to courts and authorities there.",
    ],
  },
  {
    heading: "5. Cookies and advertising",
    blocks: [
      "hubss.com uses cookies to:",
      [
        "Remember your preferences and session state",
        "Collect analytics data",
        "Improve site performance",
        "Measure our advertising and, if we use remarketing, show our ads to people who have visited the site",
      ],
      "You can disable cookies in your browser settings. Disabling cookies may affect some site functionality.",
      "We use Google Ads to show our ads and to measure which of them lead to inquiries. To measure them, our Google Analytics cookies work with Google's own advertising cookies, where your browser allows them, so Google can connect a visit or an inquiry to one of our ads. We may also use remarketing, a Google Analytics and Google Ads feature: Google may then show our ads to people who have visited hubss.com, on other websites and apps, including Google's own, such as Search and YouTube. Remarketing uses the same cookies to recognize a browser that has been here before.",
      "To opt out of remarketing, turn off personalized ads in Google's ad settings (adssettings.google.com), or opt out of interest-based ads from participating companies, Google included, at youradchoices.ca. To stop Google Analytics in your browser, and with it the ad measurement above, install Google's opt-out add-on for Google Analytics (tools.google.com/dlpage/gaoptout). When you send one of our forms, our server still tells Google Analytics that an inquiry arrived, without your name or contact details, so we can count it.",
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
  // Paper, on the site's grid, with the text in a 768px measure: the legal
  // pages were the one dark reading surface left, centred on their own
  // column (uniformity pass, 17 Oct 2026).
  return (
    <main data-surface="paper" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-24">
        <div className="max-w-3xl">
        <p className="eyebrow mb-3">
          Legal
        </p>
        <h1 className="h1-page mb-3" style={{ color: "var(--text-primary)" }}>
          Privacy policy
        </h1>
        <p className="text-sm mb-12" style={{ color: "var(--text-muted)" }}>
          Last updated: Oct 30, 2026
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
      </div>
      <Footer />
    </main>
  );
}
