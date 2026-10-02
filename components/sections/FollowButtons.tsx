import { SOCIAL_LINKS, INSTAGRAM_HANDLE } from "@/lib/social-links";

/**
 * The homepage's one set of follow links, as labelled buttons: Instagram,
 * LinkedIn, YouTube, Facebook and X. Every address comes from
 * lib/social-links.ts; nothing is typed here. The glyphs are the ones
 * components/ui/SocialLinks.tsx draws in the footer.
 *
 * On a phone the five sit in one row, glyph above name, each a 64px-tall
 * target. From md up they are pills in a row, beside the label from lg up.
 */
const CHANNELS = [
  {
    key: "instagram",
    name: "Instagram",
    // The handle is derived from the URL in lib/social-links.ts.
    label: `HUB Surface Systems on Instagram, ${INSTAGRAM_HANDLE} (opens in a new tab)`,
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    label: "HUB Surface Systems on LinkedIn (opens in a new tab)",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    key: "youtube",
    name: "YouTube",
    label: "HUB Surface Systems on YouTube (opens in a new tab)",
    path: "M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z",
  },
  {
    key: "facebook",
    name: "Facebook",
    label: "HUB Surface Systems on Facebook (opens in a new tab)",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    key: "x",
    name: "X",
    label: "HUB Surface Systems on X (opens in a new tab)",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z",
  },
] as const;

export default function FollowButtons() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        Follow HUB Surface Systems
      </p>
      <ul className="grid grid-cols-5 gap-2 md:flex md:flex-wrap md:gap-2.5">
        {CHANNELS.map((ch) => (
          <li key={ch.key} className="min-w-0">
            {/* .btn-ghost (app/globals.css) owns the border, colour, hover
                and focus ring (QA A3/C11, 30 Sep 2026): the inline colour and
                border it had beat its hover classes, so nothing changed under
                the pointer. The resting card fill is a class for the same
                reason. */}
            <a
              href={SOCIAL_LINKS[ch.key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ch.label}
              title={ch.key === "instagram" ? INSTAGRAM_HANDLE : undefined}
              className="btn-ghost flex h-16 w-full flex-col items-center justify-center gap-1.5 rounded-lg bg-[var(--bg-card)] px-1 text-[11px] font-semibold md:h-11 md:w-auto md:flex-row md:gap-2 md:px-4 md:text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
                <path d={ch.path} />
              </svg>
              <span className="truncate">{ch.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
