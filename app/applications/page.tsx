import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import Image from "next/image";
import Link from "next/link";
import { getMergedApplications } from "@/lib/applications.server";
import { buildMetadata } from "@/lib/seo";

// Sanity is the CMS for this page's copy, so the page has to be allowed to go
// and re-read it. Without a revalidate the route is prerendered once at build
// and never asks Sanity again — an editor's change sits invisible until the
// next deploy. One hour, matching the product pages.
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Pavement Marking Applications",
  description: "Crosswalks, bus lanes, bike infrastructure, airports, public art, and community branding. Purpose-matched surface systems for Canadian municipal and commercial applications.",
  slug: "applications",
});

/** The first 80 characters of a line, cut at a word, with an ellipsis. */
function blurb(text: string, max = 80): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "").replace(/[,;:]$/, "") + "…";
}

export default async function ApplicationsPage() {
  const applications = await getMergedApplications();
  return (
    <main data-surface="paper" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />
      {/* The ten application cards are a choosing surface; they read better on paper. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--accent-text-lg)" }}>
            In the field
          </p>
          <h1
            className="font-black mb-5"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            Where our systems live.
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Each application has its own performance demands: retroreflectivity, snowplow tolerance, slip resistance, urban heat reduction, decorative finish. Product specs are matched to the demand. Installation is by certified HUB applicators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <Link
              key={app.slug}
              href={`/applications/${app.slug}`}
              // data-hero: a photograph with type laid over it, so the text
              // tokens are the dark set whatever the page around it is. On
              // paper, --text-primary is charcoal, and Vern's phone (26 Sep
              // 2026) showed charcoal names on a charcoal scrim: unreadable.
              data-hero
              className="group relative overflow-hidden rounded-xl block"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={app.imageUrl}
                alt={app.name}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* A bottom-weighted scrim: the photograph reads at the top,
                  the type sits on the darkest part. */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(13,13,13,0.08) 0%, rgba(13,13,13,0.30) 45%, rgba(13,13,13,0.88) 100%)" }}
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(249,115,22,0.18)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)", textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}>{app.name}</h2>
                {/* Description always visible on mobile (no hover), fades in on desktop */}
                <p
                  className="text-xs leading-relaxed opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-body)", textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}
                >
                  {blurb(app.shortDesc)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <LunchLearn compact />
      <Footer />
    </main>
  );
}
