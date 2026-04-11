import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import Image from "next/image";
import Link from "next/link";
import { applications } from "@/lib/applications";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pavement Marking Applications",
  description: "Crosswalks, bus lanes, bike infrastructure, airports, public art, and community branding — purpose-matched surface systems for Canadian municipal and commercial applications.",
  slug: "applications",
});

export default function ApplicationsPage() {
  return (
    <main style={{ background: "#0f1620", minHeight: "100vh" }}>
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#f97316" }}>
            Applications
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight" style={{ color: "var(--text-primary)" }}>
            Where Our Systems Live
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Each application carries its own demands — visibility, durability, tactile guidance, speed reduction, civic branding. We match the right system to the right context, then back it with certified installation and real warranties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <Link
              key={app.slug}
              href={`/applications/${app.slug}`}
              className="group relative overflow-hidden rounded-xl block"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={app.imageUrl}
                alt={app.name}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 transition-all" style={{ background: "rgba(26,26,26,0.6)" }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(249,115,22,0.2)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>{app.name}</h2>
                <p className="text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-primary)" }}>
                  {app.shortDesc.slice(0, 80)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <LunchLearn />
      <Footer />
    </main>
  );
}
