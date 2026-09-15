import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
// Crisp Chat — sign up at crisp.chat (free), grab Website ID from Settings → Setup
import CrispChat from "@/components/CrispChat";
import StickyBar from "@/components/StickyBar";
import AnalyticsEvents from "@/components/AnalyticsEvents";
// VercelToolbar — only on staging/preview, never on production
import { VercelToolbar } from "@vercel/toolbar/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Runs before first paint. Order: ?theme= in the URL (persisted, so a review
// link sticks as the reader navigates) → localStorage → dark.
const THEME_INIT = `(function(){try{var q=location.search,m=/[?&]theme=(dark|mixed|light)(?=[&#]|$)/.exec(q),t=m?m[1]:null;if(t){try{localStorage.setItem('hubss-theme',t)}catch(e){}}if(!t){try{t=localStorage.getItem('hubss-theme')}catch(e){}}if(t!=='mixed'&&t!=='light'){t='dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hubss.com"),
  title: {
    template: "%s | HUB Surface Systems",
    default: "HUB Surface Systems | Decorative Hardscape & Pavement Solutions",
  },
  description: "Canadian leader in decorative pavement and traffic safety solutions. Stamped asphalt, thermoplastic markings, and specialty coatings for municipalities and developers across Canada.",
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
    title: "HUB Surface Systems | Decorative Hardscape & Pavement Solutions",
    description: "Canadian leader in decorative pavement and traffic safety solutions. Stamped asphalt, thermoplastic markings, and specialty coatings for municipalities and developers across Canada.",
    url: "https://hubss.com",
    siteName: "HUB Surface Systems",
    images: [{ url: "/images/hero/hero-1.jpg", width: 1200, height: 630, alt: "HUB Surface Systems — Decorative Pavement Solutions" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HUB Surface Systems | Decorative Hardscape & Pavement Solutions",
    description: "Canadian leader in decorative pavement and traffic safety solutions. Stamped asphalt, thermoplastic markings, and specialty coatings for municipalities and developers across Canada.",
    images: ["/images/hero/hero-1.jpg"],
  },
  alternates: {
    canonical: "https://hubss.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the theme bootstrap below sets data-theme on
    // <html> before React hydrates, and that attribute is not in the server
    // markup by design (it depends on the visitor's saved choice).
    <html lang="en" suppressHydrationWarning>
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
        {/* Resource hints — React 19 hoists these into <head>. The landing
            page's map pulls style + tiles + glyphs from CARTO; warming the
            connection here shaves the first paint of the section. */}
        <link rel="preconnect" href="https://basemaps.cartocdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://basemaps.cartocdn.com" />
        {children}
        <StickyBar />
        <CrispChat />
        {process.env.VERCEL_ENV !== "production" && <VercelToolbar />}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-7YSFCGRL5E" />
        <AnalyticsEvents />
      </body>
    </html>
  );
}
