import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Products
      { source: "/trafficpatternsxd", destination: "/products/traffic-patterns-xd", permanent: true },
      { source: "/trafficpatterns", destination: "/products/traffic-patterns", permanent: true },
      { source: "/streetprint", destination: "/products/streetprint", permanent: true },
      { source: "/streetbond", destination: "/products/streetbond", permanent: true },
      { source: "/streetbondsr", destination: "/products/streetbond-sr", permanent: true },
      { source: "/mmax-2", destination: "/products/mmax", permanent: true },
      { source: "/decomark", destination: "/products/decomark", permanent: true },
      { source: "/duratherm-2", destination: "/products/duratherm", permanent: true },
      { source: "/durashield", destination: "/products/durashield", permanent: true },
      { source: "/premark", destination: "/products/premark", permanent: true },
      { source: "/airmark", destination: "/products/airmark", permanent: true },
      // Applications
      { source: "/crosswalks", destination: "/applications/crosswalks", permanent: true },
      { source: "/bike-bus-lanes", destination: "/applications/bus-bike-lanes", permanent: true },
      { source: "/parking-lots", destination: "/applications/parking-lots", permanent: true },
      { source: "/commercial-parking-lot-solutions", destination: "/applications/parking-lots", permanent: true },
      { source: "/commercial-parking-lot-surfaces", destination: "/applications/parking-lots", permanent: true },
      { source: "/parks-paths", destination: "/applications/parks-paths", permanent: true },
      { source: "/public-art", destination: "/applications/public-art", permanent: true },
      { source: "/community-branding", destination: "/applications/community-branding", permanent: true },
      { source: "/regulatory-markings", destination: "/applications/regulatory-markings", permanent: true },
      { source: "/air-ports", destination: "/applications/airports", permanent: true },
      { source: "/residential-driveways", destination: "/applications/driveways", permanent: true },
      { source: "/private-driveways", destination: "/applications/driveways", permanent: true },
      { source: "/townhomes", destination: "/applications/driveways", permanent: true },
      { source: "/leed-urban-heat-island", destination: "/applications/community-branding", permanent: true },
      { source: "/decorative-streetscape-solutions", destination: "/applications/crosswalks", permanent: true },
      // Blog post redirects
      { source: "/keeping-pedestrians-safe-and-operation-budgets-low", destination: "/blog/keeping-pedestrians-safe", permanent: true },
      { source: "/pedestrian-safety-solutions", destination: "/blog/pedestrian-safety-solutions", permanent: true },
      { source: "/vancouver-decorative-crosswalk-design", destination: "/blog/vancouver-decorative-crosswalk-design", permanent: true },
      { source: "/enhancing-multimodal-connectivity-in-york-region-toronto", destination: "/blog/multimodal-connectivity-york-region", permanent: true },
      { source: "/case-study-branded-crosswalks-and-pedestrian-safety-in-vancouver-richmond", destination: "/blog/branded-crosswalks-vancouver-richmond", permanent: true },
      { source: "/decorative-asphalt-for-high-traffic-areas", destination: "/blog/decorative-asphalt-high-traffic", permanent: true },
      { source: "/veterans-crosswalk-kitchener-trafficpatterns", destination: "/blog/veterans-crosswalk-kitchener", permanent: true },
      // Other pages
      { source: "/case-studies", destination: "/blog", permanent: true },
      { source: "/featured-projects", destination: "/projects", permanent: true },
      { source: "/documentation", destination: "/resources", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
