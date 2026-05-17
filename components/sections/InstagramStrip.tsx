// Server component — fetches live from Instagram Graph API every hour.
// Falls back to static project photos if token is missing or API fails.
import Image from "next/image";
import { SOCIAL_LINKS } from '@/lib/social-links';
import { SocialLinks } from '@/components/ui/SocialLinks';

export const revalidate = 3600; // re-fetch every hour

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
}

// Static fallback — shown when token is not set or API is down
const FALLBACK_PHOTOS = [
  { src: "/images/blog/decorative-crosswalk-commercial-drive/featured.jpg", alt: "Commercial Drive Crosswalk — Vancouver, BC", instagramUrl: "https://www.instagram.com/hub_surface_systems/p/DYCPYXcDtB7/" },
  { src: "/images/blog/simcoe-rainbow-crosswalk/featured.jpg", alt: "Rainbow Crosswalk — Simcoe, ON", instagramUrl: "https://www.instagram.com/hub_surface_systems/p/DXwNzFIDg69/" },
  { src: "/images/blog/ubc-musqueam-crosswalk/featured.jpg", alt: "UBC Musqueam Crosswalk — Vancouver, BC", instagramUrl: "https://www.instagram.com/hub_surface_systems/p/DXeMNLvjubp/" },
  { src: "/images/blog/bc-childrens-hospital-labyrinth/featured.jpg", alt: "BC Children's Hospital Labyrinth — Vancouver, BC", instagramUrl: "https://www.instagram.com/hub_surface_systems/p/DXceVE4iQ5C/" },
  { src: "/images/blog/complete-streets-new-westminster/featured.jpg", alt: "Complete Streets — New Westminster, BC", instagramUrl: "https://www.instagram.com/hub_surface_systems/p/DXW5RQ3jr6n/" },
  { src: "/images/blog/branded-crosswalks-vancouver-richmond/featured.jpg", alt: "Branded Crosswalks — Vancouver & Richmond, BC", instagramUrl: "https://www.instagram.com/hub_surface_systems/p/DXRUNlFDjjG/" },
];

async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return [];

  try {
    const res = await fetch(
      `https://graph.instagram.com/v21.0/${userId}/media?fields=id,media_url,permalink,media_type&limit=9&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.data) return [];
    // Images and carousels only (videos have no still media_url)
    return (data.data as InstagramPost[])
      .filter(p => p.media_type === "IMAGE" || p.media_type === "CAROUSEL_ALBUM")
      .slice(0, 6);
  } catch {
    return [];
  }
}

const SOCIAL_CHANNELS = [
  {
    name: "Instagram",
    handle: "@hubsurfacesystems",
    href: SOCIAL_LINKS.instagram,
    desc: "Project installs, before & afters",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    name: "LinkedIn",
    handle: "HUB Surface Systems",
    href: SOCIAL_LINKS.linkedin,
    desc: "Industry news & case studies",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    name: "YouTube",
    handle: "HUB Surface Systems",
    href: SOCIAL_LINKS.youtube,
    desc: "Installation videos & demos",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
];

export default async function InstagramStrip() {
  const livePosts = await fetchInstagramPosts();
  const useLive = livePosts.length > 0;

  return (
    <section
      className="py-24"
      style={{ background: "#080d16", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(249,115,22,0.8)" }}>
              On The Ground
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#ffffff" }}>
              Follow the Work
            </h2>
            <p className="mt-3 text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
              Projects across Canada — documented as they happen.
            </p>
          </div>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold flex-shrink-0 transition-colors hover:border-orange-500 hover:text-orange-400"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.03)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @hubsurfacesystems
          </a>
        </div>

        {/* Photo grid — live from Instagram or static fallback */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-14">
          {useLive
            ? livePosts.map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(249,115,22,0.2)]"
                  style={{ aspectRatio: "1/1", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <Image
                    src={post.media_url}
                    alt="@hub_surface_systems on Instagram"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 17vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(0,0,0,0.55)" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.9, marginBottom: 6 }}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-white text-xs font-semibold opacity-80">View on Instagram</span>
                  </div>
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-30" style={{ background: "#f97316" }} />
                </a>
              ))
            : FALLBACK_PHOTOS.map((photo) => (
                <a
                  key={photo.src}
                  href={photo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(249,115,22,0.2)]"
                  style={{ aspectRatio: "1/1", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 17vw"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(0,0,0,0.55)" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.9, marginBottom: 6 }}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-white text-xs font-semibold opacity-80">View on Instagram</span>
                  </div>
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-30" style={{ background: "#f97316" }} />
                </a>
              ))
          }
        </div>

        {/* Social channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {SOCIAL_CHANNELS.map((channel) => (
            <a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-white/[0.06] hover:border-orange-500/20"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-orange-500/15" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                {channel.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold group-hover:text-orange-400 transition-colors" style={{ color: "rgba(255,255,255,0.8)" }}>{channel.name}</p>
                <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.50)" }}>{channel.desc}</p>
              </div>
              <svg className="w-4 h-4 flex-shrink-0 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>

        <div className="border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <SocialLinks className="justify-center gap-8" iconClassName="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
