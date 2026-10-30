import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
// Crisp Chat — sign up at crisp.chat (free), grab Website ID from Settings → Setup
import CrispChat from "@/components/CrispChat";
import AnalyticsEvents from "@/components/AnalyticsEvents";
// VercelToolbar — only on staging/preview, never on production
import { VercelToolbar } from "@vercel/toolbar/next";
import HumanAnalytics from "@/components/HumanAnalytics";
// One GA4 id for the tag, the cookie lib/post-form.ts reads and the server's leads.
import { GA_MEASUREMENT_ID } from "@/lib/ga4-lead";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import { draftMode } from "next/headers";
import PreviewTools from "@/components/PreviewTools";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import NavigationProgress from "@/components/NavigationProgress";
import SkipLink from "@/components/SkipLink";
import HistoryScroll from "@/components/HistoryScroll";
import FieldValidity from "@/components/FieldValidity";
import NotInStudio from "@/components/NotInStudio";
import MotionProvider from "@/components/MotionProvider";
import { NavMenuProvider } from "@/components/NavMenuProvider";
import { NAV_MENU } from "@/lib/nav-menu";
import { getSiteSettings } from "@/lib/sanity.queries";
import { mailtoHref, telHref } from "@/lib/site-settings";

// Runs before first paint. Order: ?theme= in the URL (persisted, so a link
// sticks as the reader navigates) → localStorage → the server's own
// data-theme, which is mixed.
//
// Mixed is the default as of 21 Sep, on Vern's call. The <html> tag ships with
// data-theme="mixed" already on it, so a first-time visitor never sees a frame
// of anything else and this script's only job is to honour a saved choice.
const THEME_INIT = `(function(){try{var q=location.search,m=/[?&]theme=(dark|mixed|light)(?=[&#]|$)/.exec(q),t=m?m[1]:null;if(t){try{localStorage.setItem('hubss-theme',t)}catch(e){}}if(!t){try{t=localStorage.getItem('hubss-theme')}catch(e){}}if(t!=='mixed'&&t!=='light'&&t!=='dark'){t='mixed'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300","400","500","600","700"] });

// The site's default title and description, 30 Sep 2026 (QA A1, E2, E4): the
// banned word "solutions" is out of the title, and the description is one
// factual line with no superlative in place of "Canadian leader in ...". The
// homepage sets its own in app/page.tsx with the same words (a layout file
// exports only what Next expects, so the string is repeated there).
const SITE_TITLE = "Decorative Pavement & Road Marking Systems | HUB Surface Systems";
const SITE_DESCRIPTION =
  "Stamped asphalt, preformed thermoplastic markings and pavement coatings for Canadian municipalities, specifiers and contractors. Canadian-owned since 1999.";
// The share image, 30 Sep 2026 (QA F12): a real 1200 x 630 crop of the hero
// (public/images/og/default.jpg) in place of the 1920 x 1200 hero file that
// was declared as 1200 x 630. lib/seo.ts still names the hero file for the
// other pages (DEFAULT_OG_IMAGE); point it here too.
const OG_IMAGE = { url: "/images/og/default.jpg", width: 1200, height: 630, alt: "The UBC Musqueam crosswalk in Vancouver: Coast Salish artwork in coloured pavement by HUB Surface Systems" };

/** The browser chrome's colour on a phone: the bar's charcoal. */
export const viewport: Viewport = { themeColor: "#0b0b0b" };

export const metadata: Metadata = {
  metadataBase: new URL("https://hubss.com"),
  title: {
    template: "%s | HUB Surface Systems",
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "decorative pavement Canada",
    "preformed thermoplastic crosswalks",
    "StreetPrint stamped asphalt",
    "StreetBond pavement coating",
    "TrafficPatterns thermoplastic",
    "MMAX MMA bus lanes",
    "bike lane coatings",
    "municipal pavement markings",
    "Vision Zero crosswalks",
    "Complete Streets Canada",
    "decorative asphalt",
    "pavement marking contractor Canada",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://hubss.com",
    siteName: "HUB Surface Systems",
    images: [OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: "https://hubss.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Studio's "Edit on the page" (lib/sanity.preview.ts). False on every
  // statically built page and for every visitor; true only in a browser that
  // came through /api/draft-mode/enable from Studio.
  const preview = (await draftMode()).isEnabled;
  // The offices, social accounts and footer line from Studio, for the client
  // components that print them (components/SiteSettingsProvider.tsx).
  const settings = await getSiteSettings();
  // Which office a tel: or mailto: link reaches, so a phone_click or
  // email_click says "east" or "west", never the number or the address
  // (components/AnalyticsEvents.tsx).
  const officeByHref: Record<string, "east" | "west"> = {};
  for (const office of ["east", "west"] as const) {
    officeByHref[telHref(settings.offices[office].phone)] = office;
    officeByHref[mailtoHref(settings.offices[office].email).toLowerCase()] = office;
  }
  return (
    // suppressHydrationWarning: the theme bootstrap below sets data-theme on
    // <html> before React hydrates, and that attribute is not in the server
    // markup by design (it depends on the visitor's saved choice).
    //
    // data-scroll-behavior="smooth": tells Next.js that html scrolls smoothly
    // (app/globals.css), so it switches that off while it moves a new page to
    // the top. Since Next.js 16 it only does so when asked. Without it every
    // link tapped from down a page opened the new page at the old depth, often
    // its very bottom, and glided up for most of a second; a touch on the way
    // stopped it there (Vern and Doug, 23 Oct 2026: "some clicks start users
    // at the bottom of the page"). In-page anchors (#map) still glide.
    <html lang="en" data-theme="mixed" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Theme bootstrap — runs before first paint so a saved "light" never
            flashes dark. Order: ?theme= in the URL (persisted, so a review link
            sticks as the reader navigates) → localStorage → dark. The three
            modes are documented in components/ui/ThemeToggle.tsx. */}
        {/* A plain <script>, not next/script: `beforeInteractive` does not emit
            inline children in the App Router — it only ships them in the RSC
            payload, which runs after paint and defeats the purpose. */}
        <script
          id="hubss-theme-init"
          dangerouslySetInnerHTML={{ __html: THEME_INIT }}
        />
      </head>
      <body className={`${geist.variable} ${inter.variable} antialiased`}>
        <SkipLink />
        {/* Back and Forward land in one step, not a glide. */}
        <HistoryScroll />
        {/* A wrongly filled field says so to a screen reader (aria-invalid). */}
        <FieldValidity />
        {/* Resource hints — React 19 hoists these into <head>. The landing
            page's map pulls style + tiles + glyphs from CARTO; warming the
            connection here shaves the first paint of the section. */}
        <link rel="preconnect" href="https://basemaps.cartocdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://basemaps.cartocdn.com" />
        {/* Sanity's image CDN serves the product, application and Insights
            photos on nearly every page (lib/photos.ts); warming it too saves
            the TLS handshake before the first card photo (QA F13, 30 Sep 2026).
            No crossOrigin (28 Oct 2026): the photos are plain <img>s, which
            never use a connection opened for CORS requests, so with it the
            hero of every product and application page still waited for a
            connection of its own. The map's CORS hosts keep theirs. */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        {/* The line under the bar while the next page loads; useSearchParams
            needs the boundary. */}
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {/* The animation engine arrives after the first screen
            (components/MotionProvider.tsx); the menus' names come from
            the server (lib/nav-menu.ts), not from the product copy. */}
        <MotionProvider>
          <SiteSettingsProvider settings={settings}>
            <NavMenuProvider menu={NAV_MENU}>{children}</NavMenuProvider>
          </SiteSettingsProvider>
        </MotionProvider>
        {/* The scroll-up sticky bar (components/StickyBar.tsx) is off since
            25 Sep 2026: with the header's Lunch & Learn button and the band at
            the foot of every page it was the same ask a third time. */}
        {preview ? (
          <>
            {/* The click-to-edit outlines and live refresh while Doug edits
                in Studio. No chat, no analytics: a preview isn't a visit. */}
            <Suspense fallback={null}>
              <PreviewTools />
            </Suspense>
          </>
        ) : (
          // Not on /studio either: an editor's session isn't a visit, and the
          // chat bubble sat over the Studio (components/NotInStudio.tsx).
          <NotInStudio>
            <CrispChat />
            {process.env.VERCEL_ENV !== "production" && <VercelToolbar />}
            <Analytics />
            <SpeedInsights />
            {/* Google Analytics for people: not for browsers driven by a
                program (components/HumanAnalytics.tsx, 15 Oct 2026). */}
            <HumanAnalytics gaId={GA_MEASUREMENT_ID} />
            <AnalyticsEvents officeByHref={officeByHref} />
          </NotInStudio>
        )}
      </body>
    </html>
  );
}
