import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { SocialLinks } from "@/components/ui/SocialLinks";

const footerApplications = [
  { label: "Crosswalks",          slug: "crosswalks" },
  { label: "Bike Lanes",          slug: "bike-lanes" },
  { label: "Bus Lanes",           slug: "bus-lanes" },
  { label: "Regulatory Markings", slug: "regulatory-markings" },
  { label: "Parks & Paths",       slug: "parks-paths" },
  { label: "Community Branding",  slug: "community-branding" },
  { label: "Parking Lots",        slug: "parking-lots" },
  { label: "Private Driveways",   slug: "private-driveways" },
  { label: "Public Art",            slug: "public-art" },
  { label: "Pedestrian Safety",    slug: "pedestrian-safety" },
  { label: "Traffic Calming",      slug: "traffic-calming" },
];


export default function Footer() {
  return (
    <footer className="asphalt-noise" style={{ background: "var(--bg-dark)", position: "relative" }}>

      {/* Wheel watermark — subtle background accent */}
      <div style={{ position: "absolute", bottom: "24px", right: "32px", opacity: 0.04, pointerEvents: "none", zIndex: 0 }}>
        <Image src="/images/assets/logos/hubss-logos/HUB-wheel_official-orange-transparent.svg" alt="" width={180} height={180} unoptimized aria-hidden="true" />
      </div>

      {/* Full-width gradient divider */}
      <div
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #F97316 25%, #EAB308 75%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hub-logo-white.png"
                alt="HUB Surface Systems"
                width={140}
                height={44}
                style={{ display: "block", height: 44, width: "auto" }}
              />
            </div>

            {/* Monument tagline */}
            <p
              className="font-light tracking-wide leading-snug mb-2"
              style={{ color: "var(--text-primary)", fontSize: "1rem" }}
            >
              Pedestrian safety. Traffic calming.<br />Civic identity. Coast to coast since 1994.
            </p>

            <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
              Canadian-operated · Coast to coast · Since 1994
            </p>

            <SocialLinks className="mt-3" />

            <p className="text-xs mt-4 font-medium flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9600 4800" width={20} height={10} aria-label="Flag of Canada" style={{ display: "inline-block", flexShrink: 0, minWidth: 20 }}>
                <path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z"/>
                <path fill="#fff" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"/>
              </svg>
              Proudly Canadian · Serving Canada since 1994
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-sm mb-5" style={{ color: "var(--text-primary)" }}>Products</h4>
            <ul className="space-y-1">
              {products.filter((p) => !p.comingSoon).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-sm transition-colors hover:text-[#f97316] underline-offset-4 hover:underline"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Applications */}
          <div>
            <h4 className="font-semibold text-sm mb-5" style={{ color: "var(--text-primary)" }}>Applications</h4>
            <ul className="space-y-1">
              {footerApplications.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/applications/${a.slug}`}
                    className="text-sm transition-colors hover:text-[#f97316] underline-offset-4 hover:underline"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h4 className="font-semibold text-sm mb-5" style={{ color: "var(--text-primary)" }}>Offices</h4>
            <div className="space-y-6">

              {/* West */}
              <div className="relative pl-4">
                <span
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{ background: "linear-gradient(180deg, #F97316 0%, #EAB308 100%)" }}
                />
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#f97316" }}>
                  West Office
                </p>
                <p className="text-sm mb-1" style={{ color: "var(--text-primary)" }}>Ladysmith, BC</p>
                <a href="mailto:cleve.stordy@hubss.com" className="text-xs block transition-colors hover:text-white underline-offset-4 hover:underline" style={{ color: "var(--text-secondary)" }}>
                  cleve.stordy@hubss.com
                </a>
                <a href="tel:6043098212" className="text-xs block transition-colors hover:text-white" style={{ color: "var(--text-secondary)" }}>
                  604-309-8212
                </a>
              </div>

              {/* East */}
              <div className="relative pl-4">
                <span
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{ background: "linear-gradient(180deg, #F97316 0%, #EAB308 100%)" }}
                />
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#f97316" }}>
                  East Office
                </p>
                <p className="text-sm mb-1" style={{ color: "var(--text-primary)" }}>Milton, Ontario</p>
                <a href="mailto:doug.bain@hubss.com" className="text-xs block transition-colors hover:text-white underline-offset-4 hover:underline" style={{ color: "var(--text-secondary)" }}>
                  doug.bain@hubss.com
                </a>
                <a href="tel:4165409287" className="text-xs block transition-colors hover:text-white" style={{ color: "var(--text-secondary)" }}>
                  416-540-9287
                </a>
              </div>

            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} HUB Surface Systems. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs transition-colors hover:text-white underline-offset-4 hover:underline" style={{ color: "var(--text-muted)" }}>
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs transition-colors hover:text-white underline-offset-4 hover:underline" style={{ color: "var(--text-muted)" }}>
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
