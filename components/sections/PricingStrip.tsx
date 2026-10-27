import Link from "next/link";
import { telHref, type SiteSettings } from "@/lib/site-settings";

/**
 * The way to a price on a phone's first screen (27 Oct 2026, Google Ads
 * readiness). The product and application pages keep their pricing card in
 * the sidebar, which a phone stacks under the whole page: on none of the ten
 * pages an ad would land on (the six main products, crosswalks, bike lanes,
 * bus lanes, regulatory markings) did a visitor's first phone screen show a
 * phone number or a way to send the project.
 *
 * So, under the hero and below lg, the sidebar card's own heading, the two
 * offices' phones and its "Send us the project" link, without the sentence,
 * so all of it fits a 360x640 phone's first screen. From lg up the sidebar
 * card is on the first screen and this isn't drawn. Its heading is a plain
 * line, not an h2: on a phone the sidebar's own h2 still follows, further
 * down.
 */
export default function PricingStrip({
  heading,
  offices,
  contactHref,
}: {
  heading: string;
  offices: SiteSettings["offices"];
  contactHref: string;
}) {
  return (
    <div
      className="lg:hidden mb-10 rounded-xl p-4 sm:p-5 relative overflow-hidden"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }} />
      <p className="font-bold text-base mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
        {heading}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <a href={telHref(offices.east.phone)} className="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--ink-04)]" style={{ border: "1px solid var(--border-color)", minHeight: 44 }}>
          <span className="block text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>East</span>
          <span className="block text-[15px] font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>{offices.east.phone}</span>
        </a>
        <a href={telHref(offices.west.phone)} className="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--ink-04)]" style={{ border: "1px solid var(--border-color)", minHeight: 44 }}>
          <span className="block text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>West</span>
          <span className="block text-[15px] font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>{offices.west.phone}</span>
        </a>
      </div>
      <Link href={contactHref} className="link-arrow">
        Send us the project
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </Link>
    </div>
  );
}
