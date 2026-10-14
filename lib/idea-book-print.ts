/**
 * The Idea Book's system and application pages, as printed.
 *
 * WHY A SECOND TRANSCRIPTION. lib/product-catalogue.ts and
 * lib/application-catalogue.ts were taken from the Figma master ("Catalogue
 * 2027") on 7 Sep 2026 and feed the product and application pages. The
 * printed book (public/catalogue/HUBSS-Catalogue-2026-27.pdf, the page renders
 * the reader shows) went to press with different wording on most of those
 * pages: subheads, bodies, SPECIFY notes and the uses strips were edited
 * between the two. The digital edition (lib/idea-book-edition.ts) sits
 * beside the printed page and links to it, so it says what the printed page
 * says, from this file, and the site's pages keep theirs until Doug decides
 * which wording is current (noted in the 14 Oct 2026 release record).
 *
 * Read from the PDF's text layer (pdftotext -layout) on 14 Oct 2026, and from
 * the 2000px renders where the layer is garbled (pages 13, 37, 39, 50, 68,
 * 78). Verbatim, with two house rules: em dashes written out (docs/STYLE.md)
 * and the SPECIFY notes in sentence case. Print typos are left as printed
 * and flagged in the release record.
 */

export interface PrintSpec {
  label: string;
  value: string;
}

export interface PrintSystem {
  /** The headline under the system's name. */
  title: string;
  /** The line under it. */
  subhead: string;
  /** The paragraph. */
  description: string;
  /** Four label/value pairs, as the page sets them. */
  specs: [PrintSpec, PrintSpec, PrintSpec, PrintSpec];
  /** Colour chip rows the page prints (keys in lib/colours.ts). */
  families?: string[];
  /** The strip along the foot of the page. */
  uses: string[];
  /** The printed page. */
  page: number;
}

export interface PrintSpecify {
  slug: string;
  note: string;
}

export interface PrintApplication {
  /** The headline. */
  title: string;
  /** The pull line under it. */
  statement: string;
  /** The paragraph. */
  body: string;
  /** SPECIFY: the systems and why. */
  specify: PrintSpecify[];
  /** The printed caption on the photograph opposite, when the page carries one. */
  caption?: { place: string; system?: string };
  /** The printed page. */
  page: number;
}

export const PRINT_SYSTEMS: Record<string, PrintSystem> = {
  "traffic-patterns": {
    title: "Preformed thermoplastic.",
    subhead: "You design it, we build it, our certified installers make it last.",
    description: "Anti-skid aggregate is intermixed through the full cross-section, so the grip lasts as long as the colour. Custom designs to fit with the community.",
    specs: [
      { label: "Thickness", value: "125 mil" },
      { label: "Skid resistance", value: "60 BPN, ASTM E303" },
      { label: "Open to traffic", value: "Hours" },
      { label: "Service life", value: "8+ years" },
    ],
    uses: ["Crosswalks", "Entrance features", "Parks", "Parking lots"],
    page: 11,
  },
  "traffic-patterns-xd": {
    title: "For the toughest environments.",
    subhead: "Aggregate-reinforced, preformed thermoplastic. Traffic tough, proven coast to coast.",
    description: "The toughest material in the product range, built for performance in Canada. Proven in high traffic with concentrated wheel loads. High colour contrast for increased safety. Specified by Canadian transit authorities, municipalities and commercial stakeholders across Canada.",
    specs: [
      { label: "Thickness", value: "150 mil" },
      { label: "Aggregate", value: "8–9 Mohs rating" },
      { label: "Skid resistance", value: "60 BPN, ASTM E303" },
      { label: "Service life", value: "10+ years" },
    ],
    uses: ["Crosswalks", "Entrances", "Transit", "Streetscapes"],
    page: 13,
  },
  streetprint: {
    title: "Stamped asphalt.",
    subhead: "The original. Since 1992. A Canadian invention, eh?",
    description: "Patterns are stamped into existing asphalt, then coloured with StreetBond coatings. The surface stays flush: no slip, no trip. Nothing for a plow blade to catch, no joints to weed, no pavers to settle, asphalt stays flexible.",
    specs: [
      { label: "System", value: "Stamping + StreetBond coating" },
      { label: "Patterns", value: "Standard and custom options" },
      { label: "Service life", value: "10–20 years" },
      { label: "Base", value: "New or existing asphalt" },
    ],
    uses: ["Crosswalks", "Driveways", "Parks", "Streetscapes"],
    page: 19,
  },
  streetbond: {
    title: "The colour.",
    subhead: "Engineered for life in Canada",
    description: "Designed to move with the pavement, avoiding the three failures of rigid coatings: cracking, premature wear, and being slippery in wet conditions. Sixty-three standard colours plus full custom colour matching.",
    specs: [
      { label: "Type", value: "Water-based, epoxy-modified acrylic" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Colours", value: "63 standard + custom colours" },
      { label: "Life cycle", value: "8+ years / easily refreshed" },
    ],
    uses: ["Parks", "Playgrounds", "Courts", "Area markings"],
    page: 25,
  },
  streetbondsr: {
    title: "Solar reflective coating.",
    subhead: "Mitigating the urban heat island effect.",
    description: "StreetBond colours that are formulated to reflect rather than absorb. Twelve colours carry SR 0.33 or higher and can contribute to LEED V5 urban heat-island credits (non-roof).",
    specs: [
      { label: "Solar reflectance", value: "≥ 0.33 initial" },
      { label: "LEED", value: "V5 SS Credit: Urban Heat Island" },
      { label: "Surfaces", value: "Asphalt" },
      { label: "Life cycle", value: "8+ years" },
    ],
    uses: ["Parking", "Plazas", "LEED projects", "Schools"],
    page: 29,
  },
  decomark: {
    title: "Custom graphics.",
    subhead: "Community identity. Public art. Innovative material.",
    description: "Factory fabricated to your vector artwork using our colour palette, then heat-fused to the substrate. Community identity, commemorative art, wayfinding and civic landmarks at street scale.",
    specs: [
      { label: "System", value: "Preformed thermoplastic" },
      { label: "Colour", value: "Standard and premium options" },
      { label: "Design", value: "Vector artwork" },
      { label: "Installation", value: "Heat-fused" },
    ],
    uses: ["Identity", "Wayfinding", "Public art", "Memorial"],
    page: 31,
  },
  mmax: {
    title: "MMA area markings.",
    subhead: "Fast installation. Built for tough environments.",
    description: "Methyl methacrylate allows for fast return to service, so an active corridor is installed with minimal community disruption. Best in class performance. Available in 8 standard colours along with 15 premium colours.",
    specs: [
      { label: "Material", value: "Methyl methacrylate (MMA) resin" },
      { label: "Cure", value: "45–60 min, traffic-ready" },
      { label: "Traction", value: "Embedded aggregate / non-slip" },
      { label: "Min. installation temp.", value: "+3°C" },
    ],
    families: ["mmax-standard", "mmax-premium"],
    uses: ["Bus lanes", "Bike lanes", "Calming", "Transit"],
    page: 33,
  },
  duratherm: {
    title: "Inlaid thermoplastic.",
    subhead: "Heat-fused thermoplastic in a stamped surface. Zero profile above grade.",
    description: "Inlaid into stamped impressions so the finished surface sits flush with the road: nothing for a plow blade to catch, nothing to trip on. Reflective options.",
    specs: [
      { label: "Install", value: "Inlaid into a stamped surface" },
      { label: "Profile", value: "Zero, flush with road" },
      { label: "Snowplow safe", value: "Yes, no shear risk" },
      { label: "Bond", value: "Heat-fused to asphalt substrate" },
    ],
    uses: ["Crosswalks", "Speed bumps", "Calming", "Identity"],
    page: 35,
  },
  durashield: {
    title: "Pavement maintenance coating.",
    subhead: "Two-component epoxy-modified acrylic. Solar-reflective options.",
    description: "A maintenance coating for asphalt. Resists fuel, oil and de-icing agents, cools the surface, and protects the substrate underneath, extending the service life of the pavement.",
    specs: [
      { label: "Type", value: "Epoxy-modified acrylic coating" },
      { label: "Solar reflectance", value: "Optional" },
      { label: "Chemical resistance", value: "Fuel, oil, de-icing agents" },
      { label: "Applications", value: "Preserves and protects asphalt, old and new" },
    ],
    uses: ["Parking", "Driveways", "Pathways", "LEED sites"],
    page: 37,
  },
  premark: {
    title: "Road marking symbols.",
    subhead: "Arrows. Stop bars. Legends. Bike symbols. Custom.",
    description: "Arrows, stop bars, yield triangles, school legends, bike symbols and ladder lines, pre-cut to specification. Heat-applied by torch: no stencils, no curing window, drive on immediately. Provincially approved across Canada.",
    specs: [
      { label: "Thickness", value: "125 mil standard / 90 mil ViziGrip" },
      { label: "Installation", value: "Heat-applied" },
      { label: "Retroreflectivity", value: "Integrated glass beads" },
      { label: "Service life", value: "6–8 years" },
    ],
    uses: ["Bike lanes", "Crosswalks", "Regulatory", "Parking"],
    page: 39,
  },
};

export const PRINT_APPLICATIONS: Record<string, PrintApplication> = {
  crosswalks: {
    title: "Crosswalks that hold their colour and their grip.",
    statement: "Providing increased visibility and safety for pedestrians.",
    body: "Preformed thermoplastic holds ASTM-rated skid resistance and high-contrast colour through snowplow cycles and de-icing seasons. Providing performance year after year.",
    specify: [
      { slug: "traffic-patterns-xd", note: "150 mil, aggregate-reinforced" },
      { slug: "traffic-patterns", note: "125 mil, aggregate-reinforced" },
      { slug: "decomark", note: "Custom graphics: community identity" },
    ],
    caption: { place: "Brampton, Ontario" },
    page: 46,
  },
  "sport-courts": {
    title: "Court colours expanded.",
    statement: "A court is one of the hardest colour environments in outdoor pavement.",
    body: "StreetBond can transform an asphalt playground into a vibrant, coloured surface. Non-slip, UV-stable and tough enough for years of play and hours of laughter.",
    specify: [
      { slug: "streetbond", note: "Court colour on asphalt or concrete" },
      { slug: "streetbondsr", note: "Solar reflective: cooler underfoot" },
    ],
    caption: { place: "Montréal, Québec" },
    page: 48,
  },
  "bike-lanes": {
    title: "Visibility. Season after season.",
    statement: "Durability. Performance. Visibility. Safety.",
    body: "With proven performance coast to coast, our materials offer cyclists the added safety of non-slip, high-contrast, durable cycling surfaces.",
    specify: [
      { slug: "mmax", note: "Methyl methacrylate with corundum or sand" },
      { slug: "premark", note: "Preformed thermoplastic bike lane markings. Optional integrated symbols." },
    ],
    page: 50,
  },
  "bus-lanes": {
    title: "Moving thousands of people every day.",
    statement: "In high-traffic corridors, every detail counts.",
    body: "Transit corridors, campus arteries and shopping-centre entrances concentrate wear into a few square metres. Aggregate-reinforced thermoplastic and MMA markings perform year after year.",
    specify: [
      { slug: "traffic-patterns-xd", note: "150 mil, aggregate-reinforced" },
      { slug: "mmax", note: "MMA resin: lane and area markings" },
    ],
    caption: { place: "Vaughan, Ontario" },
    page: 52,
  },
  "traffic-calming": {
    title: "Drivers slow down with visual cues.",
    statement: "A change in surface is a change in speed.",
    body: "Traffic calming devices such as roundabouts, medians, truck aprons, gateway treatments and speed tables. Changing colour and texture tells a driver the environment has changed before any sign does. Our systems can help with this.",
    specify: [
      { slug: "streetprint", note: "Traffic calming device treatments" },
      { slug: "streetbond", note: "Sidewalks, pathways and plazas" },
      { slug: "traffic-patterns-xd", note: "Durable road surface treatments" },
    ],
    caption: { place: "Cowichan Valley, British Columbia" },
    page: 54,
  },
  "creative-design": {
    title: "Seen from the sidewalk as well as the driver's seat.",
    statement: "An Indigenous-designed crossing: intricate line work that reads as art up close and as high-visibility contrast for drivers.",
    body: "Preformed thermoplastic can reproduce artwork while holding the contrast, grip and visibility a crossing is designed for.",
    specify: [
      { slug: "traffic-patterns", note: "125 mil preformed: custom designs" },
      { slug: "decomark", note: "125 mil preformed custom graphics" },
    ],
    caption: { place: "London, Ontario" },
    page: 56,
  },
  playgrounds: {
    title: "Vibrant, slip-resistant, built for FUN.",
    statement: "Make concrete and asphalt your canvas.",
    body: "With unlimited design potential, vibrant colour options and non-slip surfaces. Adding colour to community spaces.",
    specify: [
      { slug: "streetbond", note: "Any colour, UV stable" },
      { slug: "decomark", note: "Custom graphics and play markings" },
      { slug: "streetbondsr", note: "Cooler underfoot in full sun" },
    ],
    caption: { place: "Hamilton, Ontario" },
    page: 58,
  },
  "splash-pads": {
    title: "Slip-resistant. Cool underfoot. Vivid colours.",
    statement: "Splash pad surfaces are uniquely demanding: constant water exposure, chemical treatments, bare feet.",
    body: "A slip-resistant texture built for constant water, chemical treatment and bare feet, with solar-reflective options that stay cooler underfoot. Laughter for years to come!",
    specify: [
      { slug: "streetbond", note: "Skid resistant, UV stable" },
      { slug: "streetbondsr", note: "LEED compliant SR ≥ 0.33, coatings keep surfaces cooler" },
    ],
    caption: { place: "Saint-Antoine-sur-Richelieu, Québec" },
    page: 60,
  },
  "pedestrian-safety": {
    title: "Vision Zero, starting at the surface.",
    statement: "Pedestrian safety isn't just aesthetic aspiration: it's a measurable outcome.",
    body: "High-contrast materials, combined with retroreflective markings that stay visible year round. Proven performance in the harshest environments.",
    specify: [
      { slug: "traffic-patterns-xd", note: "150 mil, aggregate-reinforced, stamped surface" },
      { slug: "traffic-patterns", note: "125 mil, aggregate-reinforced" },
      { slug: "premark", note: "Retroreflective symbols and legends" },
      { slug: "mmax", note: "MMA resin: 45–60 minute cure" },
    ],
    caption: { place: "Kitchener, Ontario" },
    page: 62,
  },
  "public-spaces": {
    title: "Nobody wants boring.",
    statement: "Dynamic surface treatments for high-visibility community projects.",
    body: "Stamped asphalt gives parks, plazas and streetscapes added aesthetics, with minimal maintenance. Unlimited design potential.",
    specify: [
      { slug: "streetprint", note: "A wide range of imprinted patterns" },
      { slug: "streetbond", note: "Vibrant and durable, colourful hardscapes" },
    ],
    caption: { place: "Montréal, Québec", system: "StreetBond" },
    page: 64,
  },
  "public-art": {
    title: "Public art, at the scale of the street.",
    statement: "The street is one of the largest untapped canvases in any city.",
    body: "Artist artwork can be reproduced and installed into the roadway: durable, slip-resistant, vibrant additions to any community.",
    specify: [
      { slug: "decomark", note: "Artwork / graphics" },
      { slug: "streetbond", note: "Large-scale colour fields" },
      { slug: "traffic-patterns", note: "Large-scale interconnected thermoplastic" },
    ],
    caption: { place: "Toronto, Ontario", system: "artwork by Fauxreel" },
    page: 66,
  },
  "community-branding": {
    title: "Neighbourhood identity. Becoming part of the street.",
    statement: "Every neighbourhood has a story.",
    body: "Crests, wayfinding, heritage markers along with BIA identities add to the surface. The street can tell the story.",
    specify: [
      { slug: "decomark", note: "Horizontal wayfinding and community/BIA branding" },
      { slug: "traffic-patterns-xd", note: "High performance decorative crosswalks" },
      { slug: "traffic-patterns", note: "Streetscape enhancement and beautification" },
    ],
    caption: { place: "White Rock, British Columbia" },
    page: 68,
  },
  durability: {
    title: "Tough.",
    statement: "The \"secret sauce\" is in the aggregate. Using materials that reach 8-9 on the Mohs scale, provides one of the toughest wearing surfaces you can use.",
    body: "TrafficPatterns fuses 125 mil of preformed thermoplastic into the road. TrafficPatternsXD steps up to a 150 mil aggregate-reinforced build for the hardest-working surfaces: intersections, transit corridors, loading aprons.",
    specify: [
      { slug: "traffic-patterns", note: "125 mil, aggregate-reinforced" },
      { slug: "traffic-patterns-xd", note: "150 mil, aggregate-reinforced" },
    ],
    caption: { place: "Markham, Ontario" },
    page: 70,
  },
  "commercial-spaces": {
    title: "Premium materials for commercial parking lots.",
    statement: "Complementing urban design elements with performance-based solutions. TrafficPatternsXD performs year after year.",
    body: "After 10 years of constant use, these crossings have provided a safe and durable path for pedestrians.",
    specify: [{ slug: "traffic-patterns-xd", note: "Pedestrian channelization; the look of pavers, stones and cobbles" }],
    caption: { place: "Oakville, Ontario", system: "TrafficPatternsXD" },
    page: 72,
  },
  townhomes: {
    title: "Cohesive hardscape for strata developments.",
    statement: "Townhome and strata developments need to have a positive first impression.",
    body: "Entry courts and shared drives with the look of clay pavers or stone cobble. Almost no maintenance and easy to refresh.",
    specify: [
      { slug: "streetprint", note: "Stamped entry courts and driveways" },
      { slug: "streetbond", note: "Colour and sealing" },
      { slug: "durashield", note: "Shared-drive maintenance" },
    ],
    caption: { place: "Richmond, British Columbia" },
    page: 74,
  },
  "residential-driveways": {
    title: "The look of stone without the headaches.",
    statement: "Most driveways fail on appearance long before they fail on structure.",
    body: "Stamped asphalt can transform new or existing asphalt into the look of cobble, brick, herringbone or slate. Pick a pattern, pick a colour and enjoy years of maintenance-free performance.",
    specify: [{ slug: "streetprint", note: "Stamped and coloured asphalt" }],
    caption: { place: "Residential Driveway, British Columbia" },
    page: 76,
  },
  "parking-lots": {
    title: "First impressions. Solutions for any budget.",
    statement: "Parking lots need to be tough.",
    body: "Asphalt breaks down when it's exposed to the elements. By using StreetPrint, StreetBond, DuraShield or TrafficPatternsXD you are adding aesthetic value all while preserving the underlying asphalt.",
    specify: [
      { slug: "durashield", note: "Maintenance coating" },
      { slug: "streetbond", note: "Coloured coating to enhance and preserve" },
      { slug: "streetprint", note: "Stamped asphalt treated with StreetBond coating" },
      { slug: "traffic-patterns-xd", note: "150 mil, aggregate-reinforced: high-traffic bays and crossings" },
    ],
    caption: { place: "Halton Hills, Ontario", system: "StreetPrint" },
    page: 78,
  },
};
