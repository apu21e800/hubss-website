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
        <Image src="/images/hub-wheel-orange.png" alt="" width={180} height={180} unoptimized aria-hidden="true" />
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
              <Image
                src="/images/hub-logo-white.png"
                alt="HUB Surface Systems"
                width={130}
                height={40}
                unoptimized
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
              Canadian-operated · All 10 provinces · Since 1994
            </p>

            <SocialLinks className="mt-3" />

            <p className="text-xs mt-4 font-medium flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <Image src="/images/flags/canada-flag.svg" alt="Canadian flag" width={24} height={16} unoptimized className="inline-block align-middle flex-shrink-0 rounded-sm" />
              Proudly Canadian · Serving all 10 provinces since 1994
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-sm mb-5" style={{ color: "var(--text-primary)" }}>Products</h4>
            <ul className="space-y-2.5">
              {products.map((p) => (
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
            <ul className="space-y-2.5">
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
