/**
 * Lunch & Learn page copy: the defaults /lunch-learn serves when the Sanity
 * page document is untouched (see the shim in app/lunch-learn/page.tsx).
 *
 * One source for the page and its FAQPage schema, so the answers Google reads
 * are the answers a visitor reads. Facts here are the site's own: a 45-minute
 * session, in person or virtual, lunch on HUB and a $25 voucher when it's
 * virtual, confirmed within one business day. Do not add CE credits: HUB does
 * not offer them (the launch-era Sanity copy claimed they did).
 *
 * Pure data: safe in server and client components.
 */

export interface LunchLearnItem { num: string; title: string; desc: string }
export interface LunchLearnPersona { title: string; desc: string; badge: string }
export interface LunchLearnFaq { q: string; a: string }

export const LL_WHAT_YOU_GET: LunchLearnItem[] = [
  {
    num: "01",
    title: "Spec language ready for your RFP",
    desc: "Specification language for crosswalks, MMA bus lanes and coloured bike lanes, ready for your next tender.",
  },
  {
    num: "02",
    title: "The lifecycle cost math",
    desc: "Years of service from a HUB system, costed against repeat seasonal repairs: the numbers procurement asks for.",
  },
  {
    num: "03",
    title: "Samples, sheets and an installer map",
    desc: "Material samples, current data sheets and the certified HUB applicators for your region.",
  },
];

export const LL_PERSONAS: LunchLearnPersona[] = [
  {
    title: "Municipal engineers & planners",
    desc: "Crosswalks, transit corridors and complete streets, with installation data from Canadian municipalities.",
    badge: "Vision Zero · Complete Streets",
  },
  {
    title: "Landscape architects & designers",
    desc: "StreetPrint patterns and the full StreetBond Pantone palette, on snowplow-safe surfaces.",
    badge: "Public art · Driveways",
  },
  {
    title: "Engineering & consulting firms",
    desc: "Lifecycle cost data and performance specs you can cite in tender documents.",
    badge: "Spec support",
  },
  {
    title: "Contractors & applicators",
    desc: "The HUB certified applicator program: territory-protected bidding and direct manufacturer support.",
    badge: "Certified applicator program",
  },
];

export const LL_FAQS: LunchLearnFaq[] = [
  {
    q: "How long is the session?",
    a: "About 45 minutes, built around your projects, with time for your team's questions. We keep to the time we agree on.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. Sessions are how we introduce our systems to the people who specify them: no invoice, no minimum order, and no follow-up pressure.",
  },
  {
    q: "Can the session focus on one kind of work?",
    a: "Yes. Pick a topic on this page or name it in the form, and we build the session around the systems and the Canadian projects for that work.",
  },
  {
    q: "Who should be in the room?",
    a: "Engineers, planners, landscape architects, project managers, procurement: anyone who touches the surface spec. Sessions are built for mixed teams, and there's no cap on seats.",
  },
  {
    q: "In-person or virtual?",
    a: "Both. In-person sessions are available coast to coast through our certified applicator network. Virtual sessions use Zoom or Teams. We mail sample kits before we connect.",
  },
];

/**
 * The work a session can be built around. The topic is the application's name
 * as it reads in a sentence, the same string the application pages send
 * (lunchLearnHref(nameInSentence, "application")), so the request email reads
 * the same whichever way the visitor arrived. Photos are those applications'
 * hero photos on Sanity's CDN (never /_next/image, see lib/photos.ts).
 */
export interface LunchLearnTopic { label: string; topic: string; href: string; src: string; alt: string }

export const LL_TOPICS: LunchLearnTopic[] = [
  {
    label: "Crosswalks",
    topic: "crosswalks",
    href: "/applications/crosswalks",
    src: "https://cdn.sanity.io/images/9dbro2m1/production/36497374754a6f6c1668e66b8f8c143c0411fd67-2400x1800.jpg",
    alt: "TrafficPatternsXD crosswalk in alternating red and pale brick-pattern bands at a bus terminal, buses at the platforms behind",
  },
  {
    label: "Bus lanes",
    topic: "bus lanes",
    href: "/applications/bus-lanes",
    src: "https://cdn.sanity.io/images/9dbro2m1/production/4fd7f6cd4287218afc39d6529b4a3de805e432eb-2400x1800.jpg",
    alt: "Blue articulated rapid-transit bus on a red bus-only lane at an intersection, beside a station platform",
  },
  {
    label: "Bike lanes",
    topic: "bike lanes",
    href: "/applications/bike-lanes",
    src: "https://cdn.sanity.io/images/9dbro2m1/production/f8f17e6758e0bf6c3ad25a0ca3b42a6f058743b6-2400x1350.jpg",
    alt: "Green bike box with a white bicycle symbol and turn arrows at an intersection, a cyclist riding past",
  },
  {
    label: "Parks & paths",
    topic: "parks & paths",
    href: "/applications/parks-paths",
    src: "https://cdn.sanity.io/images/9dbro2m1/production/e6b1c9845699e4e453e1800a8748592281ce6346-2400x1350.jpg",
    alt: "Waterside multi-use path with white direction arrows and a curving centre line, bike racks and a paver edge in the foreground",
  },
  {
    label: "Public art",
    topic: "public art",
    href: "/applications/public-art",
    src: "https://cdn.sanity.io/images/9dbro2m1/production/160c5daf2482b37a41234bde5efb39732cdfabd4-2400x1800.jpg",
    alt: "Pavement artwork of green roots and a blue water drop spreading across a street-corner plaza",
  },
  {
    label: "Airports",
    topic: "airports",
    href: "/applications/airports",
    src: "https://cdn.sanity.io/images/9dbro2m1/production/1facb1e93a16bf687b28a9744c3650d03a28ee28-2016x1512.jpg",
    alt: "Red octagon marking with white aircraft symbols on an airport apron, orange airside trucks and an Air Canada jet behind",
  },
];
