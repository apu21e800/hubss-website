import type { NextConfig } from "next";
import path from "path";
import { projects } from "./lib/projects";

// The 9 real, currently-built project pages. Derived from lib/projects.ts so
// adding a project can never silently re-break the redirect below.
const LIVE_PROJECT_SLUGS = projects.map((p) => p.slug);

// ── Security headers ────────────────────────────────────────────────────────
// Production-safe set. CSP is shipped in REPORT-ONLY mode for launch — it
// surfaces violations to the browser console + Vercel logs without blocking
// anything. After a week of monitoring, flip to enforced mode by changing the
// header key to "Content-Security-Policy".
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  // Inline + eval needed for Next.js + framer-motion runtime
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://client.crisp.chat https://*.vercel-scripts.com https://*.vercel-insights.com https://va.vercel-scripts.com",
  // Inline styles from framer-motion + Tailwind v4 + Crisp
  "style-src 'self' 'unsafe-inline' https://client.crisp.chat https://fonts.googleapis.com",
  // Images from Unsplash, Vercel optimization, data URIs, blob (for clipboard), Crisp avatars
  "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://*.crisp.chat https://image.crisp.chat https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com",
  // Google Fonts files
  "font-src 'self' data: https://fonts.gstatic.com https://client.crisp.chat",
  // Resend API, Crisp WS, Vercel telemetry, MapLibre tiles
  "connect-src 'self' https://api.resend.com https://*.crisp.chat wss://*.crisp.chat https://*.vercel-insights.com https://va.vercel-scripts.com https://*.cartocdn.com https://basemaps.cartocdn.com",
  // Frame sources — Crisp chat iframe + YouTube embeds (just in case)
  "frame-src 'self' https://client.crisp.chat https://www.youtube.com https://www.youtube-nocookie.com",
  // Disallow plugins
  "object-src 'none'",
  // Block forms from being submitted to off-domain endpoints
  "form-action 'self'",
  // Don't allow this site to be embedded anywhere
  "frame-ancestors 'self'",
  // Force https for all sub-resources
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Report-Only — does NOT block. Switch the key to "Content-Security-Policy"
  // after monitoring browser-console / Vercel-logs reports for ~7 days.
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "autoplay=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  // Mirror Vercel's VERCEL_ENV into a NEXT_PUBLIC_* variable so client
  // components can read it (Next inlines NEXT_PUBLIC_* at build time).
  // Used by lib/feature-flags.ts → showCatalogue() in the Nav mega menu.
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV ?? "",
  },
  // Sanity Studio uses rxjs + CommonJS internals that Turbopack can't bundle.
  // Marking them external lets Node handle them at runtime instead.
  serverExternalPackages: ["sanity", "@sanity/client", "next-sanity", "@sanity/vision"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  async redirects() {
    return [
      // 2026 colour card supersedes the old StreetBond colour guide — keep the
      // old URL alive (Sanity resource entries + external links still point at it).
      { source: "/docs/StreetBond/StreetBond/StreetBond-Colour-Guide.pdf", destination: "/docs/StreetBond/StreetBond/StreetBond-Colour-Card-2026.pdf", permanent: true },
      // Products
      { source: "/trafficpatternsxd", destination: "/products/traffic-patterns-xd", permanent: true },
      { source: "/trafficpatterns", destination: "/products/traffic-patterns", permanent: true },
      { source: "/streetprint", destination: "/products/streetprint", permanent: true },
      { source: "/streetbond", destination: "/products/streetbond", permanent: true },
      { source: "/streetbondsr", destination: "/products/streetbondsr", permanent: true },
      { source: "/mmax-2", destination: "/products/mmax", permanent: true },
      { source: "/decomark", destination: "/products/decomark", permanent: true },
      { source: "/duratherm-2", destination: "/products/duratherm", permanent: true },
      { source: "/durashield", destination: "/products/durashield", permanent: true },
      { source: "/premark", destination: "/products/premark", permanent: true },
      { source: "/airmark", destination: "/products/airmark", permanent: true },
      // Applications
      { source: "/crosswalks", destination: "/applications/crosswalks", permanent: true },
      { source: "/bike-bus-lanes", destination: "/applications/bike-lanes", permanent: true },
      { source: "/applications/bus-bike-lanes", destination: "/applications/bus-lanes", permanent: true },
      { source: "/parking-lots", destination: "/applications/parking-lots", permanent: true },
      { source: "/commercial-parking-lot-solutions", destination: "/applications/parking-lots", permanent: true },
      { source: "/commercial-parking-lot-surfaces", destination: "/applications/parking-lots", permanent: true },
      { source: "/parks-paths", destination: "/applications/parks-paths", permanent: true },
      { source: "/public-art", destination: "/applications/public-art", permanent: true },
      { source: "/community-branding", destination: "/applications/community-branding", permanent: true },
      { source: "/regulatory-markings", destination: "/applications/regulatory-markings", permanent: true },
      { source: "/air-ports", destination: "/applications/airports", permanent: true },
      { source: "/residential-driveways", destination: "/applications/private-driveways", permanent: true },
      { source: "/private-driveways", destination: "/applications/private-driveways", permanent: true },
      { source: "/townhomes", destination: "/applications/townhomes", permanent: true },
      { source: "/leed-urban-heat-island", destination: "/applications/leed-urban-heat-island", permanent: true },
      { source: "/splash-pads", destination: "/applications/splash-pads", permanent: true },
      { source: "/applications/driveways", destination: "/applications/private-driveways", permanent: true },
      // Public Art now has its own dedicated page — no redirect needed
      // { source: "/applications/public-art", destination: "/applications/community-branding", permanent: true },
      // Public Spaces now has its own page in applications.ts — redirect removed
      { source: "/decorative-streetscape-solutions", destination: "/applications/crosswalks", permanent: true },
      // Blog post redirects
      { source: "/keeping-pedestrians-safe-and-operation-budgets-low", destination: "/blog/keeping-pedestrians-safe", permanent: true },
      { source: "/pedestrian-safety-solutions", destination: "/blog/pedestrian-safety-solutions", permanent: true },
      { source: "/vancouver-decorative-crosswalk-design", destination: "/blog/vancouver-decorative-crosswalk-design", permanent: true },
      { source: "/enhancing-multimodal-connectivity-in-york-region-toronto", destination: "/blog/multimodal-connectivity-york-region", permanent: true },
      { source: "/case-study-branded-crosswalks-and-pedestrian-safety-in-vancouver-richmond", destination: "/blog/branded-crosswalks-vancouver-richmond", permanent: true },
      { source: "/decorative-asphalt-for-high-traffic-areas", destination: "/blog/decorative-asphalt-high-traffic", permanent: true },
      { source: "/veterans-crosswalk-kitchener-trafficpatterns", destination: "/blog/veterans-crosswalk-kitchener", permanent: true },
      { source: "/trafficpatternsdx-mmax-durable-transit-lanes-crossings", destination: "/blog/durable-transit-lanes-crossings", permanent: true },
      { source: "/trafficpatterns-crosswalks-white-rock-langley", destination: "/blog/white-rock-langley-trafficpatterns", permanent: true },
      { source: "/decorative-hardscape-solutions-grey-is-the-new-black", destination: "/blog/decorative-hardscape-grey-is-new-black", permanent: true },
      { source: "/decorative-paving-solutions", destination: "/blog/decorative-paving-solutions", permanent: true },
      { source: "/trafficpatternsxd-urban-design-solutions", destination: "/blog/trafficpatternsxd-urban-design", permanent: true },
      { source: "/hubss-com-rainbow-crosswalk", destination: "/blog/simcoe-rainbow-crosswalk", permanent: true },
      { source: "/streetbondsr-solar-reflective-coatings", destination: "/blog/streetbondsr-solar-reflective-coatings", permanent: true },
      { source: "/new-traffic-pattern-crosswalk-upgrade-for-tsain-ko-centre-2", destination: "/blog/pictograph-crosswalk-sechelt", permanent: true },
      { source: "/strengthening-cycling-and-transit-integration-with-long-lasting-surface-solutions", destination: "/blog/cycling-transit-integration-surface-solutions", permanent: true },
      { source: "/enhancing-safety-and-durability-for-high-traffic-transit-stations", destination: "/blog/safety-durability-transit-stations", permanent: true },
      { source: "/extending-transit-lane-lifespan", destination: "/blog/extending-transit-lane-lifespan", permanent: true },
      { source: "/transportation-infrastructure-guide", destination: "/blog/transportation-infrastructure-guide", permanent: true },
      { source: "/playgrounds-recreation-case-studies", destination: "/blog/playgrounds-recreation", permanent: true },
      { source: "/educational-facilities-case-study", destination: "/blog/educational-facilities", permanent: true },
      { source: "/community-spaces-case-study", destination: "/blog/community-spaces", permanent: true },
      { source: "/community-branding-case-study", destination: "/blog/community-branding-case-study", permanent: true },
      { source: "/commercial-applications-case-study", destination: "/blog/commercial-applications", permanent: true },
      { source: "/municipalities-case-studies", destination: "/blog/municipalities-case-study", permanent: true },
      { source: "/stamped-asphalt-vs-stamped-concrete", destination: "/blog/stamped-asphalt-vs-concrete", permanent: true },
      // White papers
      { source: "/white-paper-transportation-and-urban-design", destination: "/blog/white-paper-transportation-urban-design", permanent: true },
      { source: "/white-paper-surface-solutions-for-resilient-transit-infrastructure", destination: "/blog/white-paper-resilient-transit-infrastructure", permanent: true },
      // Blog posts & project profiles (2020–2022)
      { source: "/surface-system-solutions-for-school-playgrounds", destination: "/blog/surface-solutions-school-playgrounds", permanent: true },
      { source: "/decorative-asphalt-for-communities", destination: "/blog/decorative-asphalt-communities", permanent: true },
      { source: "/asphalt-coatings-for-parks-and-plazas", destination: "/blog/asphalt-coatings-parks-plazas", permanent: true },
      { source: "/streetbondsr-for-cooler-asphalt-surfaces", destination: "/blog/streetbondsr-cooler-asphalt", permanent: true },
      { source: "/enhancing-transit-hubs-in-the-gta-and-metro-vancouver", destination: "/blog/enhancing-transit-hubs-gta-vancouver", permanent: true },
      { source: "/new-traffic-pattern-crosswalk-upgrade-for-tsain-ko-centre", destination: "/blog/tsain-ko-crosswalk-sechelt", permanent: true },
      { source: "/decorative-asphalt-crosswalks", destination: "/blog/decorative-asphalt-crosswalks", permanent: true },
      { source: "/roadway-accents-natures-walk", destination: "/blog/roadway-accents-natures-walk", permanent: true },
      { source: "/every-child-matters-decorative-asphalt-crosswalk", destination: "/blog/every-child-matters-crosswalk", permanent: true },
      { source: "/stamped-asphalt-parking-lot", destination: "/blog/stamped-asphalt-parking-lot", permanent: true },
      { source: "/terry-fox-decorative-asphalt-plaza-coquitlam", destination: "/blog/terry-fox-plaza-coquitlam", permanent: true },
      { source: "/decorative-crosswalk-and-meridian", destination: "/blog/decorative-crosswalk-meridian", permanent: true },
      { source: "/the-laneway-project", destination: "/blog/laneway-project", permanent: true },
      { source: "/parc-riviera-mews-streetbond-asphalt-walkway", destination: "/blog/parc-riviera-streetbond-walkway", permanent: true },
      { source: "/decorative-asphalt-for-rutland-centennial-park-kelowna", destination: "/blog/rutland-centennial-park-kelowna", permanent: true },
      { source: "/societe-de-transport-du-saguenay", destination: "/blog/societe-transport-saguenay", permanent: true },
      { source: "/bikeway-intersection", destination: "/blog/bikeway-intersection", permanent: true },
      { source: "/decorative-asphalt-renewal", destination: "/blog/decorative-asphalt-renewal", permanent: true },
      { source: "/asphalt-coatings-for-playgrounds", destination: "/blog/asphalt-coatings-playgrounds", permanent: true },
      { source: "/west-vancouver-rainbow-crosswalk", destination: "/blog/west-vancouver-rainbow-crosswalk", permanent: true },
      { source: "/ackerys-alley-decorative-asphalt-orpheum-theatre-laneway", destination: "/blog/ackerys-alley-orpheum-laneway", permanent: true },
      { source: "/decorative-paving-stamped-asphalt-after-2-years-wear", destination: "/blog/stamped-asphalt-2-years-wear", permanent: true },
      { source: "/ralphs-farm-market-decorative-asphalt-parking-lot", destination: "/blog/ralphs-farm-market-parking-lot", permanent: true },
      { source: "/reunion-murrayville-schoolhouse-decorative-asphalt-sidewalk", destination: "/blog/murrayville-schoolhouse-sidewalk", permanent: true },
      { source: "/decorative-crosswalk_richmond-brighouse", destination: "/blog/richmond-brighouse-crosswalk", permanent: true },
      { source: "/decorative-asphalt-path", destination: "/blog/bowen-island-asphalt-path", permanent: true },
      { source: "/ubc-musqueam-crosswalk", destination: "/blog/ubc-musqueam-crosswalk", permanent: true },
      { source: "/white-rock-pier-decoraive-crosswalk", destination: "/blog/white-rock-pier-crosswalk", permanent: true },
      { source: "/squamish-nation-rainbow-crosswalk", destination: "/blog/squamish-nation-rainbow-crosswalk", permanent: true },
      { source: "/melfort-saskatchewan-waterpark-splash-pad", destination: "/blog/melfort-waterpark-splash-pad", permanent: true },
      { source: "/victoria-harbor-decorative-asphalt-walkway", destination: "/blog/victoria-harbour-walkway", permanent: true },
      { source: "/sports-court-asphalt-paving", destination: "/blog/sports-court-asphalt-paving", permanent: true },
      { source: "/rainbow-crosswalk-sechelt", destination: "/blog/rainbow-crosswalk-sechelt", permanent: true },
      { source: "/white-rock-stamped-asphalt-pathway", destination: "/blog/white-rock-stamped-pathway", permanent: true },
      { source: "/checkerboard-decorative-asphalt-crosswalk", destination: "/blog/checkerboard-crosswalk-coquitlam", permanent: true },
      { source: "/first-nations-decorative-crosswalk-design-granville-street", destination: "/blog/first-nations-crosswalk-granville", permanent: true },
      { source: "/lickman-interchange-decorative-asphalt-roundabout", destination: "/blog/lickman-interchange-roundabout", permanent: true },
      { source: "/stamped-asphalt-streetscapes-viva-next", destination: "/blog/stamped-asphalt-viva-next", permanent: true },
      { source: "/decorative-paving-for-townhomes-canada", destination: "/blog/decorative-paving-townhomes", permanent: true },
      { source: "/decorative-paving-public-art", destination: "/blog/decorative-paving-public-art-joyce", permanent: true },
      { source: "/decorative-crosswalk-commercial-drive", destination: "/blog/decorative-crosswalk-commercial-drive", permanent: true },
      { source: "/pedestrian-channelization-public-spaces", destination: "/blog/pedestrian-channelization-public-spaces", permanent: true },
      { source: "/decorative-paving-labyrinth-bc-childrens-hospital", destination: "/blog/bc-childrens-hospital-labyrinth", permanent: true },
      { source: "/best-crosswalks-canada", destination: "/blog/best-crosswalks-canada", permanent: true },
      { source: "/durable-pavement-coatings-ideal-for-waterparks", destination: "/blog/durable-coatings-waterparks", permanent: true },
      { source: "/complete-streets-new-westminster", destination: "/blog/complete-streets-new-westminster", permanent: true },
      { source: "/community-branding-horizontal-wayfinding-for-vancouvers-spirit-trail", destination: "/blog/spirit-trail-wayfinding-vancouver", permanent: true },
      { source: "/performance-crosswalks-for-asphalt-and-concrete", destination: "/blog/performance-crosswalks-asphalt-concrete", permanent: true },
      { source: "/imprinted-asphalt-crosswalks-for-york-transit-corridor", destination: "/blog/imprinted-asphalt-york-transit", permanent: true },
      { source: "/residential-decorative-paving", destination: "/blog/residential-decorative-paving", permanent: true },
      { source: "/laneway-revitalization", destination: "/blog/laneway-revitalization-vancouver", permanent: true },
      { source: "/residential-decorative-driveways", destination: "/blog/residential-decorative-driveways", permanent: true },
      { source: "/decorative-paving-for-playgrounds", destination: "/blog/decorative-paving-playgrounds", permanent: true },
      { source: "/parking-lot-wayfinding", destination: "/blog/parking-lot-wayfinding", permanent: true },
      { source: "/durable-coatings-for-asphalt", destination: "/blog/durable-coatings-asphalt", permanent: true },
      { source: "/stamped-asphalt-decorative-crosswalks", destination: "/blog/stamped-asphalt-decorative-crosswalks", permanent: true },
      { source: "/enhanced-parking-lot-surfaces", destination: "/blog/enhanced-parking-lot-surfaces", permanent: true },
      // Footer/nav link variants
      { source: "/traffic-patterns", destination: "/products/traffic-patterns", permanent: true },
      // Other pages
      { source: "/case-studies", destination: "/blog", permanent: true },
      { source: "/featured-projects", destination: "/blog", permanent: true },
      { source: "/documentation", destination: "/resources", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },

      // ── WordPress → Next.js migration redirects (added 2026-05-10) ────────
      // Legacy .php product pages
      { source: "/trafficpatterns.php", destination: "/products/traffic-patterns", permanent: true },
      { source: "/trafficpatterns-xd.php", destination: "/products/traffic-patterns-xd", permanent: true },
      { source: "/trafficpatterns-xd.php/:path*", destination: "/products/traffic-patterns-xd", permanent: true },

      // Legal pages
      { source: "/terms-conditions", destination: "/terms", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },

      // Old WP gallery pages — fold into matching product/application pages
      { source: "/trafficpatterns-gallery", destination: "/products/traffic-patterns", permanent: true },
      { source: "/trafficpatternsxd-gallery", destination: "/products/traffic-patterns-xd", permanent: true },
      { source: "/streetprint-gallery", destination: "/products/streetprint", permanent: true },
      { source: "/streetbond-gallery", destination: "/products/streetbond", permanent: true },
      { source: "/streetbond-sr-gallery", destination: "/products/streetbondsr", permanent: true },
      { source: "/decomark-gallery", destination: "/products/decomark", permanent: true },
      { source: "/mma-gallery", destination: "/products/mmax", permanent: true },
      { source: "/duratherm-gallery", destination: "/products/duratherm", permanent: true },
      { source: "/durashield-gallery", destination: "/products/durashield", permanent: true },
      { source: "/airmark-gallery", destination: "/products/airmark", permanent: true },
      { source: "/premark-gallery", destination: "/products/premark", permanent: true },
      { source: "/crosswalks-gallery", destination: "/applications/crosswalks", permanent: true },
      { source: "/parking-lots-gallery", destination: "/applications/parking-lots", permanent: true },
      { source: "/parks-paths-gallery", destination: "/applications/parks-paths", permanent: true },
      { source: "/community-branding-gallery", destination: "/applications/community-branding", permanent: true },
      { source: "/townhomes-gallery", destination: "/applications/townhomes", permanent: true },
      { source: "/driveways-gallery", destination: "/applications/private-driveways", permanent: true },
      { source: "/public-art-gallery", destination: "/applications/public-art", permanent: true },
      { source: "/regulatory-safety-markings-gallery", destination: "/applications/regulatory-markings", permanent: true },
      { source: "/streetscapes-gallery", destination: "/projects", permanent: true },

      // WordPress projects sub-tree — bulk taxonomy/pagination URLs
      { source: "/projects/category/:cat*", destination: "/projects", permanent: true },
      { source: "/projects/page/:n", destination: "/projects", permanent: true },
      { source: "/projects/featured-projects/:n", destination: "/projects", permanent: true },

      // /projects/[slug] — route to matching blog post on new site
      { source: "/projects/best-crosswalks-canada", destination: "/blog/best-crosswalks-canada", permanent: true },
      { source: "/projects/stamped-asphalt-vs-stamped-concrete", destination: "/blog/stamped-asphalt-vs-concrete", permanent: true },
      { source: "/projects/decorative-stamped-asphalt-crosswalks", destination: "/blog/decorative-asphalt-crosswalks", permanent: true },
      { source: "/projects/airfield-markings", destination: "/applications/airports", permanent: true },
      { source: "/projects/community-branding", destination: "/applications/community-branding", permanent: true },
      { source: "/projects/decorative-crosswalk_richmond-brighouse", destination: "/blog/richmond-brighouse-crosswalk", permanent: true },
      { source: "/projects/decorative-paving-public-art", destination: "/blog/decorative-paving-public-art-joyce", permanent: true },
      { source: "/projects/decorative-paving-for-townhomes-canada", destination: "/blog/decorative-paving-townhomes", permanent: true },
      { source: "/projects/solar-reflective-asphalt-surfaces", destination: "/blog/streetbondsr-solar-reflective-coatings", permanent: true },
      { source: "/projects/solar-reflective-coatings-for-asphalt-and-concrete", destination: "/blog/streetbondsr-solar-reflective-coatings", permanent: true },
      { source: "/projects/solar-reflective-hardscapes", destination: "/blog/streetbondsr-solar-reflective-coatings", permanent: true },
      { source: "/projects/decorative-greenway-for-spirit-trail", destination: "/blog/spirit-trail-wayfinding-vancouver", permanent: true },
      { source: "/projects/complete-streets-richmond", destination: "/blog/complete-streets-new-westminster", permanent: true },
      { source: "/projects/community-branding-for-asphalt-and-concrete", destination: "/applications/community-branding", permanent: true },
      { source: "/projects/attractive-waterpark-pavement-surfaces", destination: "/blog/durable-coatings-waterparks", permanent: true },
      { source: "/projects/decorative-asphalt-pedestrian-plaza", destination: "/blog/terry-fox-plaza-coquitlam", permanent: true },
      { source: "/projects/avenue-of-the-arts-crosswalks", destination: "/applications/public-art", permanent: true },
      { source: "/projects/complete-streets-intersections", destination: "/blog/complete-streets-new-westminster", permanent: true },
      { source: "/projects/extreme-pavement-surfacing-with-trafficpatternsxd", destination: "/blog/trafficpatternsxd-urban-design", permanent: true },
      { source: "/projects/decorative-paving-for-parks-and-paths", destination: "/applications/parks-paths", permanent: true },
      { source: "/projects/high-visibility-decorative-crosswalks", destination: "/blog/pedestrian-safety-solutions", permanent: true },
      { source: "/projects/community-branding-and-crosswalks-in-canada", destination: "/blog/community-branding-case-study", permanent: true },

      // Legacy spec-sheet PDFs — safety-net redirect to resources hub
      { source: "/assets/specification-documents/:path*", destination: "/resources", permanent: true },

      // ── Old WordPress URL patterns → catch remaining 404s ────────────────
      // WordPress project category archives → relevant destination
      { source: "/projects/category/streetprint/:path*", destination: "/products/streetprint", permanent: true },
      { source: "/projects/category/stamped-asphalt/:path*", destination: "/products/streetprint", permanent: true },
      { source: "/projects/category/streetbond/:path*", destination: "/products/streetbond", permanent: true },
      { source: "/projects/category/trafficpatterns/:path*", destination: "/products/traffic-patterns", permanent: true },
      { source: "/projects/category/mmax/:path*", destination: "/products/mmax", permanent: true },
      { source: "/projects/category/public-art/:path*", destination: "/applications/public-art", permanent: true },
      { source: "/projects/category/community-branding/:path*", destination: "/applications/community-branding", permanent: true },
      { source: "/projects/category/crosswalks/:path*", destination: "/applications/crosswalks", permanent: true },
      { source: "/projects/category/parking-lots/:path*", destination: "/applications/parking-lots", permanent: true },
      { source: "/projects/category/bike-lanes/:path*", destination: "/applications/bike-lanes", permanent: true },
      { source: "/projects/category/bus-lanes/:path*", destination: "/applications/bus-lanes", permanent: true },
      { source: "/projects/category/driveways/:path*", destination: "/applications/private-driveways", permanent: true },
      // WordPress date archives → gallery
      { source: "/projects/:year(\\d{4})/:path*", destination: "/gallery", permanent: true },
      // Any remaining /projects/category/... → gallery
      { source: "/projects/category/:path*", destination: "/gallery", permanent: true },
      // Old commercial parking lots section
      { source: "/commercial-parking-lots/:path*", destination: "/applications/parking-lots", permanent: true },
      // WordPress blog old slugs (blog-slug format)
      { source: "/blog-:slug", destination: "/blog", permanent: true },
      // ── Legacy WordPress image URLs (Google Image search) ───────────────
      // WordPress stored media under /wp-content/uploads/YYYY/MM/<file>.
      // The /wp-content/:path* catch-all below would 301 those to the
      // homepage HTML, which Google Images treats as a broken image
      // (image-typed URL → text/html response → thumbnail dropped).
      // Routing /uploads/ specifically to a real image gives the bot a
      // valid 200 image response so indexed thumbnails stop showing as
      // broken. MUST appear before the /wp-content/:path* catch-all.
      { source: "/wp-content/uploads/:path*", destination: "/images/hero/hero-bg.jpg", permanent: true },
      // WordPress wp-content → 410 is ideal but redirect to home is fine
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: true },
      { source: "/wp-json/:path*", destination: "/", permanent: true },
      // Old feed URLs
      { source: "/feed", destination: "/blog", permanent: true },
      { source: "/feed/:path*", destination: "/blog", permanent: true },
      // Catch-all for any remaining LEGACY /projects/ URLs → gallery.
      //
      // This rule used to be an unguarded /projects/:path*, which meant it also
      // swallowed the 9 REAL project pages the site builds and advertises in its
      // own sitemap. Every one of them — UBC Musqueam Crosswalk, York Region
      // Hwy7 Viva, Toronto Priority Bus Lanes and the rest — was prerendered,
      // listed for Google, and then 308'd to a generic gallery. Nine named
      // municipal case studies, built and unreachable, and nine sitemap URLs
      // that all redirected to the same page.
      //
      // The negative lookahead exempts exactly the slugs in lib/projects.ts and
      // nothing else, so genuine WordPress leftovers still land on /gallery.
      {
        source: `/projects/:path((?!(?:${LIVE_PROJECT_SLUGS.join("|")})$).*)`,
        destination: "/gallery",
        permanent: true,
      },
    ];
  },
  // turbopack config removed — Sanity Studio is incompatible with Turbopack
  // production builds. Webpack handles both correctly. Dev server can still
  // use `next dev --turbopack` manually if needed.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
