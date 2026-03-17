import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ui/ThemeToggle";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
  title: "HUB Surface Systems | Redefining Canadian Hardscapes",
  description: "Canadian leader in decorative and functional pavement solutions. Stamped asphalt, thermoplastics, and specialty coatings for municipalities and contractors.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Apply saved theme before first paint — prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('hubss-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');})();`,
          }}
        />
      </head>
      <body className={`${geist.variable} ${inter.variable} antialiased`}>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
