import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
// ThemeToggle deferred — light mode requires full CSS var migration of hardcoded hex sections
// import ThemeToggle from "@/components/ui/ThemeToggle";
// Crisp Chat — sign up at crisp.chat (free), grab Website ID from Settings → Setup
import CrispChat from "@/components/CrispChat";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://hubss.com"),
  title: "HUB Surface Systems | Decorative Pavement & Traffic Markings — Canada",
  description: "Canada's leader in decorative hardscape and traffic safety surfaces. Preformed thermoplastic crosswalks, StreetPrint stamped asphalt, StreetBond coatings, and MMA lane markings — installed by certified professionals in all 10 provinces since 1994.",
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
    title: "HUB Surface Systems | Decorative Pavement & Traffic Markings",
    description: "Canada's leader in decorative hardscape and traffic safety surfaces. Thermoplastic crosswalks, stamped asphalt, MMA bus lanes, and coloured pavement coatings — 500+ projects, 10 provinces, since 1994.",
    url: "https://hubss.com",
    siteName: "HUB Surface Systems",
    images: [{ url: "/images/hero/hero-bg.jpg", width: 1200, height: 630, alt: "HUB Surface Systems — Decorative Pavement Solutions" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HUB Surface Systems | Decorative Pavement & Traffic Markings",
    description: "Canada's leader in decorative hardscape and traffic safety surfaces. Thermoplastic crosswalks, stamped asphalt, MMA bus lanes — 500+ projects across all 10 provinces.",
    images: ["/images/hero/hero-bg.jpg"],
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
        <CrispChat />
      </body>
    </html>
  );
}
