import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import PhotoImage from "@/components/ui/PhotoImage";
import Link from "next/link";
import { getMergedApplications } from "@/lib/applications.server";
import { buildMetadata } from "@/lib/seo";
import { applicationImages, resolveImage } from "@/lib/featured-images";
import { HERO_POSITION } from "@/lib/hero-framing";

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

        {/* Four across from xl: twenty cards make five full rows, where three
            across left two cards on the last (QA pa#25). Each card shows the
            application's own hero from Sanity, the photo its page leads with,
            so no photo repeats between two cards (QA pa#4) and nothing goes
            through /_next/image (QA pa#40). The line under the name is the
            whole short description: it was cut at 80 characters mid-phrase
            ("protect cyclists season…", QA pa#24). */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {applications.map((app) => {
            const featured = applicationImages[app.slug] ? resolveImage(applicationImages[app.slug]) : null;
            const photo = app.heroPhoto ?? { src: featured?.src ?? app.imageUrl, alt: featured?.alt ?? app.name };
            return (
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
              <PhotoImage
                src={photo.src}
                alt={photo.alt}
                fill
                // A /public fallback is served as the file itself, never
                // through the optimiser that ran out in Aug 2026.
                unoptimized={!photo.src.startsWith("https://")}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ objectPosition: HERO_POSITION[photo.origin ?? photo.src] ?? "center" }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              {/* A bottom-weighted scrim: the photograph reads at the top,
                  the type sits on the darkest part. */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(13,13,13,0.04) 0%, rgba(13,13,13,0.22) 42%, rgba(13,13,13,0.86) 100%)" }}
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(249,115,22,0.16)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="font-bold text-lg mb-1 leading-tight" style={{ color: "var(--text-primary)", textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}>{app.name}</h2>
                {/* Two lines, always two lines tall, so the names across a
                    row sit at one height whatever the line under them runs to
                    (QA C14: they stepped up and down with the description).
                    13.5 px, up from 12.5, which was under the 13 px floor on
                    phones (QA C22). 30 Sep 2026. */}
                <p
                  className="text-[13.5px] leading-snug line-clamp-2"
                  style={{ color: "var(--text-body)", textShadow: "0 1px 2px rgba(0,0,0,0.5)", minHeight: "calc(2 * 1.375em)" }}
                >
                  {app.shortDesc}
                </p>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
      <LunchLearn compact from="applications" />
      <Footer />
    </main>
  );
}
