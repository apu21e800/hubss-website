import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
// ThemeToggle deferred — light mode requires full CSS var migration of hardcoded hex sections
// import ThemeToggle from "@/components/ui/ThemeToggle";
// Crisp Chat — sign up at crisp.chat (free), grab Website ID from Settings → Setup
import CrispChat from "@/components/CrispChat";
import StickyBar from "@/components/StickyBar";
import { VercelToolbar } from "@vercel/toolbar/next";

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
    <html lang="en">
      <body className={`${geist.variable} ${inter.variable} antialiased`}>
        {children}
        <StickyBar />
        <CrispChat />
        <VercelToolbar />
      </body>
    </html>
  );
}
