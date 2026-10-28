import Link from "next/link";
import { Mail, Phone, Plus } from "lucide-react";
import { BLOG_NAME } from "@/lib/field-notes-taxonomy";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { ideaBook } from "@/lib/catalogue";
import { CHROME_MARKS } from "@/lib/chrome-images.mjs";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { getSiteSettings } from "@/lib/sanity.queries";
import { mailtoHref, telHref } from "@/lib/site-settings";
// The footer is on every page; its two marks are baked at build time and
// served static rather than transformed by /_next/image on every visit.
import ChromeImg from "@/components/ui/ChromeImg";

// The homepage's nine applications, in the homepage's order (FEATURED_SLUGS in
// components/sections/ApplicationsGrid.tsx). The footer had its own eleven,
// two of them not on the homepage and missing two that are (QA, 27 Sep 2026).
// Names come from lib/applications.ts, the list the menus print, so the menus,
// the homepage and the footer name each application the same way.
const FOOTER_APPLICATION_SLUGS = [
  "crosswalks",
  "commercial-spaces",
  "parks-paths",
  "bike-lanes",
  "bus-lanes",
  "community-branding",
  "public-art",
  "traffic-calming",
  "townhomes",
];
const footerApplications = FOOTER_APPLICATION_SLUGS.flatMap((slug) => {
  const a = applications.find((x) => x.slug === slug);
  return a ? [{ label: a.name, href: `/applications/${a.slug}` }] : [];
});

const footerProducts = products
  .filter((p) => !p.comingSoon && !p.hideFromFooter)
  .map((p) => ({ label: p.name, href: `/products/${p.slug}` }));

// The pages the phone drawer reaches that the footer did not.
const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: BLOG_NAME, href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: ideaBook.short, href: ideaBook.href },
  { label: "Gallery", href: "/gallery" },
  { label: "Lunch & Learn", href: "/lunch-learn" },
];

// Tap height (QA, 27 Sep 2026): footer links measured 20 to 26 px tall on a
// phone. 44 px rows below 640 px wide, and on any touch screen through
// data-tap="44"; a mouse keeps the compact list (see the data-tap note in
// app/globals.css on why the desktop footer is not padded).
// Every Link below carries prefetch={false} (QA F5, 30 Sep 2026): the footer
// is on every page, and its thirty-odd links prefetched thirty routes' RSC
// payloads the moment a visitor scrolled to the bottom. A click still
// navigates instantly enough; nothing here is a primary path.
const footerLink =
  "text-sm flex items-center min-h-11 sm:min-h-0 transition-colors hover:text-[var(--accent-text-lg)] underline-offset-4 hover:underline";
const officeLink =
  "text-xs flex items-center min-h-11 sm:min-h-0 [overflow-wrap:anywhere] transition-colors hover:text-[var(--text-primary)]";
const legalLink =
  "text-xs inline-flex items-center min-h-11 sm:min-h-0 transition-colors hover:text-[var(--text-primary)] underline-offset-4 hover:underline";


type Office = { place: string; email: string; phone: string };

/** "Canadian", then the two lines under it, as the brand column prints them. */
function Provenance({ className = "" }: { className?: string }) {
  return (
    // Three deliberate lines (QA A22, 30 Sep 2026): the badge, then "Owned
    // and operated", then "Coast to coast · Since 1999". As one wrapping flex
    // line the column broke it into "Owned and operated · Coast to coast /
    // · Since 1999", a dot at a line's start. Blocks never leave a dot at
    // either end.
    <p className={`text-[12px] ${className}`} style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
      <span
        className="mb-1 inline-flex items-center gap-1.5"
        // role="img": an aria-label on a plain span is ignored
        // (QA F17, 30 Sep 2026); the same fix as the nav's flag.
        role="img"
        aria-label="Canadian"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 9600 4800"
          width={16}
          height={8}
          aria-hidden="true"
          style={{ display: "block", flexShrink: 0, borderRadius: 1 }}
        >
          <path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z" />
          <path fill="var(--text-primary)" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z" />
        </svg>
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--ink-55)", lineHeight: 1 }}>
          Canadian
        </span>
      </span>
      <span className="block">Owned and operated</span>
      <span className="block whitespace-nowrap">Coast to coast · Since 1999</span>
    </p>
  );
}

/**
 * An office on a phone or a tablet: its town, then its number and its
 * address as rows a thumb can take (each 44px, with its mark).
 */
function OfficeRows({ label, office }: { label: string; office: Office }) {
  const row = "flex items-center gap-3 min-h-11 transition-colors hover:text-[var(--text-primary)]";
  return (
    <div className="relative pl-4">
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: "linear-gradient(180deg, #F97316 0%, #EAB308 100%)" }}
      />
      <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--accent-text-lg)" }}>
        {label}
      </p>
      <p className="mt-1 text-[15px]" style={{ color: "var(--text-primary)" }}>{office.place}</p>
      <a href={telHref(office.phone)} className={`${row} mt-1 text-[15px]`} style={{ color: "var(--text-secondary)" }}>
        <Phone size={16} strokeWidth={2} aria-hidden="true" style={{ color: "var(--accent-text-lg)", flexShrink: 0 }} />
        {office.phone}
      </a>
      <a href={mailtoHref(office.email)} className={`${row} text-[14px] [overflow-wrap:anywhere]`} style={{ color: "var(--text-secondary)" }}>
        <Mail size={16} strokeWidth={2} aria-hidden="true" style={{ color: "var(--accent-text-lg)", flexShrink: 0 }} />
        {office.email}
      </a>
    </div>
  );
}

/**
 * A list of links folded under its name on a phone or a tablet (`.faq`
 * eases it open; `name` keeps one open at a time). The first link is the
 * section's own page.
 */
function FoldedLinks({ title, all, links }: { title: string; all?: { label: string; href: string }; links: { label: string; href: string }[] }) {
  const items = all ? [all, ...links] : links;
  return (
    <details className="faq ft-fold" name="footer-links">
      <summary className="flex min-h-[52px] cursor-pointer items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)", letterSpacing: 0, lineHeight: 1.3 }}>{title}</h2>
        <Plus size={18} strokeWidth={2} aria-hidden="true" className="ft-fold-mark" style={{ color: "var(--text-muted)", flexShrink: 0 }} />
      </summary>
      <ul className="grid grid-cols-2 gap-x-6 pb-4 sm:grid-cols-3">
        {items.map((l, i) => (
          <li key={l.href}>
            <Link
              prefetch={false}
              href={l.href}
              className="flex min-h-11 items-center text-[15px] transition-colors hover:text-[var(--accent-text-lg)]"
              style={{ color: i === 0 && all ? "var(--accent-text-lg)" : "var(--text-secondary)" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default async function Footer() {
  // The offices and the line under the logo, from Studio's Site Settings
  // (lib/site-settings.ts); the code's copy when Studio's is blank.
  const { offices, footerTagline } = await getSiteSettings();
  return (
    <footer
      /* always dark */
      data-surface="dark" className="asphalt-noise" style={{ background: "var(--bg-dark)", position: "relative" }}>

      {/* Full-width gradient divider */}
      <div
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #F97316 25%, #EAB308 75%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 lg:pt-14 lg:pb-10">
        {/* Below lg, the page's last word (28 Oct 2026; Vern: "footer on
            mobile experience is an awkward long scroll", then "improve the
            footer is a moral to a story"): who HUB is in a line, the two
            offices to call or write to, then the link lists folded under
            their names. 1,943px on a 390px phone before (2.3 screens, forty
            44px rows); one screen now. */}
        <div className="lg:hidden">
          <ChromeImg
            family="logo"
            src={CHROME_MARKS.logo}
            alt="HUB Surface Systems"
            width={140}
            height={44}
            sizes="153px"
            style={{ display: "block", height: 40, width: "auto" }}
          />
          <p className="mt-4 font-light tracking-wide text-pretty" style={{ color: "var(--text-primary)", fontSize: "0.9375rem", lineHeight: 1.45 }}>
            {footerTagline}
          </p>
          <Provenance className="mt-3" />

          <h2 className="sr-only">Offices</h2>
          <div className="mt-7 grid gap-6 sm:grid-cols-2 sm:gap-8">
            <OfficeRows label="West office" office={offices.west} />
            <OfficeRows label="East office" office={offices.east} />
          </div>

          <div className="mt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <FoldedLinks title="Products" all={{ label: "All products", href: "/products" }} links={footerProducts} />
            <FoldedLinks title="Applications" all={{ label: "All applications", href: "/applications" }} links={footerApplications} />
            <FoldedLinks title="Company" links={companyLinks} />
          </div>

          <SocialLinks className="mt-6" />
        </div>

        {/* From lg: five columns from xl (brand, products, applications,
            company, offices); at lg the company links stack over the offices
            in the fourth column. */}
        <div className="relative hidden lg:grid lg:grid-cols-4 xl:grid-cols-[1.3fr_1fr_1fr_1fr_1.15fr] gap-x-6 sm:gap-x-10 lg:gap-x-12 gap-y-10 lg:gap-y-12">

          {/* Wheel watermark, inside the grid (QA A24, D16, 30 Sep 2026). It
              used to hang off the footer's own corner, past the page grid
              and under "Terms of use" at 1440 and behind the copyright line
              on a phone. Now it sits in the grid's bottom right corner, the
              empty room under the offices in the five-column layout, and is
              off below xl, where the fourth column runs to the bottom. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 hidden xl:block"
            style={{ opacity: 0.04, zIndex: 0 }}
          >
            <ChromeImg family="wheel" src={CHROME_MARKS.wheel} alt="" width={150} height={150} sizes="150px" />
          </div>

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-5">
              {/* Fixed 44px tall, never scales with the viewport; at the
                  logo's 2432x701 aspect that is 153px wide. */}
              <ChromeImg
                family="logo"
                src={CHROME_MARKS.logo}
                alt="HUB Surface Systems"
                width={140}
                height={44}
                sizes="153px"
                style={{ display: "block", height: 44, width: "auto" }}
              />
            </div>

            {/* Monument tagline. Its second line, "Coast to coast since 1999.",
                went: the line below says it again (QA, 27 Sep 2026). */}
            <p
              className="font-light tracking-wide mb-3"
              style={{ color: "var(--text-primary)", fontSize: "0.9375rem", lineHeight: 1.45 }}
            >
              {footerTagline}
            </p>

            <Provenance className="mb-5" />

            <SocialLinks className="mt-1" />

          </div>

          {/* Products. The column headings are h2 (QA sweep, 16 Oct 2026): as h4,
              every page's outline jumped from its last h2 to h4. Same look. */}
          <div>
            <h2 className="font-semibold text-sm mb-3.5" style={{ color: "var(--text-primary)" }}>Products</h2>
            <ul className="space-y-0.5">
              {footerProducts.map((p) => (
                <li key={p.href}>
                  <Link
                    prefetch={false}
                    href={p.href}
                    className={footerLink}
                    data-tap="44"
                    style={{ color: "var(--text-secondary)", paddingTop: 3, paddingBottom: 3 }}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Applications */}
          <div>
            <h2 className="font-semibold text-sm mb-3.5" style={{ color: "var(--text-primary)" }}>Applications</h2>
            <ul className="space-y-0.5">
              {footerApplications.map((a) => (
                <li key={a.href}>
                  <Link
                    prefetch={false}
                    href={a.href}
                    className={footerLink}
                    data-tap="44"
                    style={{ color: "var(--text-secondary)", paddingTop: 3, paddingBottom: 3 }}
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company and offices: one column at lg, two columns from xl and
              below lg (display: contents lets them join the outer grid). */}
          {/* One column on a phone: in two, "cleve.stordy@hubss.com" broke
              as "hubss.co" / "m" on every page's foot (phone review, 17 Oct
              2026). */}
          <div className="col-span-2 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-0 lg:col-span-1 lg:flex lg:flex-col lg:gap-y-10 xl:contents">

            {/* Company */}
            <div>
              <h2 className="font-semibold text-sm mb-3.5" style={{ color: "var(--text-primary)" }}>Company</h2>
              <ul className="space-y-0.5">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      prefetch={false}
                      href={l.href}
                      className={footerLink}
                      data-tap="44"
                      style={{ color: "var(--text-secondary)", paddingTop: 3, paddingBottom: 3 }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Offices */}
            <div>
              <h2 className="font-semibold text-sm mb-3.5" style={{ color: "var(--text-primary)" }}>Offices</h2>
              <div className="space-y-6">

                {/* West */}
                <div className="relative pl-4">
                  <span
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ background: "linear-gradient(180deg, #F97316 0%, #EAB308 100%)" }}
                  />
                  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--accent-text-lg)" }}>
                    West office
                  </p>
                  <p className="text-sm mb-1" style={{ color: "var(--text-primary)" }}>{offices.west.place}</p>
                  <a href={mailtoHref(offices.west.email)} className={`${officeLink} underline-offset-4 hover:underline`} data-tap="44" style={{ color: "var(--text-secondary)", paddingTop: 2, paddingBottom: 2 }}>
                    {offices.west.email}
                  </a>
                  <a href={telHref(offices.west.phone)} className={officeLink} data-tap="44" style={{ color: "var(--text-secondary)", paddingTop: 2, paddingBottom: 2 }}>
                    {offices.west.phone}
                  </a>
                </div>

                {/* East */}
                <div className="relative pl-4">
                  <span
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ background: "linear-gradient(180deg, #F97316 0%, #EAB308 100%)" }}
                  />
                  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--accent-text-lg)" }}>
                    East office
                  </p>
                  <p className="text-sm mb-1" style={{ color: "var(--text-primary)" }}>{offices.east.place}</p>
                  <a href={mailtoHref(offices.east.email)} className={`${officeLink} underline-offset-4 hover:underline`} data-tap="44" style={{ color: "var(--text-secondary)", paddingTop: 2, paddingBottom: 2 }}>
                    {offices.east.email}
                  </a>
                  <a href={telHref(offices.east.phone)} className={officeLink} data-tap="44" style={{ color: "var(--text-secondary)", paddingTop: 2, paddingBottom: 2 }}>
                    {offices.east.phone}
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-8 lg:mt-12 pt-5 lg:pt-6 flex flex-col md:flex-row items-center justify-between gap-1 md:gap-3"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} HUB Surface Systems. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link prefetch={false} href="/privacy" className={legalLink} data-tap="44" style={{ color: "var(--text-muted)", paddingTop: 2, paddingBottom: 2 }}>
              Privacy policy
            </Link>
            <Link prefetch={false} href="/terms" className={legalLink} data-tap="44" style={{ color: "var(--text-muted)", paddingTop: 2, paddingBottom: 2 }}>
              Terms of use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
