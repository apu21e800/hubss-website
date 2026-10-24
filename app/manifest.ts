import type { MetadataRoute } from "next";

/**
 * /manifest.webmanifest (23 Oct 2026, Doug: the favicon "is not working" in
 * Safari). Safari's Add to Dock, iOS's Add to Home Screen and Android read
 * their name and icons from here; the tab still takes app/favicon.ico and
 * app/icon.png. `display: "browser"` keeps the site a web page when it is
 * opened from a dock or home screen, so nothing about the site changes.
 * The colours are the bar's (viewport.themeColor in app/layout.tsx).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HUB Surface Systems",
    short_name: "HUB",
    description: "Decorative pavement and road marking systems, Canadian-owned since 1999.",
    start_url: "/",
    display: "browser",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
