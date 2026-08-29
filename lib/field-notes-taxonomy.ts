/**
 * Field Notes taxonomy — the curated classification layer (Aug 2026).
 *
 * Vernon: "update all Field notes — Case Studies, Project Profiles, Guides,
 * White Papers, Blog posts! This is high priority, also SEO optimize, this is
 * a lead engine."
 *
 * WHY A MAP AND NOT 67 FRONTMATTER EDITS: the classification is editorial
 * judgement about the whole library — what counts as a Case Study only makes
 * sense next to what counts as a Project Profile. Keeping it in one reviewable
 * file means the taxonomy can be re-balanced in a single diff, and every post
 * keeps its original frontmatter untouched. Frontmatter still WINS if a post
 * declares its own `category` (see lib/mdx.ts), and any post missing from this
 * map falls through to inference — so new .mdx files just work.
 *
 * `keywords` are the SEO target phrases for that post, drawn from the Semrush
 * sweep of the Canadian market (Aug 2026). The whole niche is low-difficulty:
 *   rainbow crosswalk .............. 320/mo  KD 14
 *   thermoplastic pavement markings  140/mo  KD 11
 *   stamped asphalt ................ 110/mo  KD 14
 *   pattern paving .................  90/mo  KD 14
 *   stamped blacktop ...............  90/mo  KD  8
 * They surface as schema.org `keywords` and drive the related-reading lanes,
 * so a post that owns a phrase links to the others chasing the same intent.
 */

export type FieldNoteType =
  | "Case Study"
  | "Project Profile"
  | "Guide"
  | "White Paper"
  | "Blog";

export interface FieldNoteTypeMeta {
  /** Singular label shown on the card badge and the post hero. */
  label: FieldNoteType;
  /** Plural label for the hub page and filter pills. */
  plural: string;
  /** URL segment: /blog/case-studies */
  slug: string;
  /** One line under the hub-page H1 — also the hub's meta description lede. */
  blurb: string;
  /** What the reader gets — the promise, used on the hub page. */
  promise: string;
  /** schema.org @type for posts of this kind. */
  schemaType: string;
  /** Badge tint. Kept inside the brand: orange family + one neutral. */
  tint: string;
  border: string;
  text: string;
}

/**
 * Type definitions, ordered by how a specifier actually shops: proof first
 * (did it work somewhere real?), then instruction, then the deep documents.
 */
export const FIELD_NOTE_TYPES: FieldNoteTypeMeta[] = [
  {
    label: "Case Study",
    plural: "Case Studies",
    slug: "case-studies",
    blurb: "Named projects with the brief, the constraint, and the measured outcome.",
    promise:
      "Every case study documents a real Canadian installation: what the owner needed, what was specified, how it was installed, and how the surface has performed since. Written for the people who have to defend a specification.",
    schemaType: "Article",
    tint: "rgba(249,115,22,0.14)",
    border: "rgba(249,115,22,0.35)",
    text: "#FB923C",
  },
  {
    label: "Project Profile",
    plural: "Project Profiles",
    slug: "project-profiles",
    blurb: "Short-form records of installations across the country.",
    promise:
      "The field record: where it is, what went down, which system, and what it looks like now. Quick reads for browsing what is possible — and proof that the work exists outside a brochure.",
    schemaType: "Article",
    // Was #EAB308 — Tailwind yellow-500, a straggler from the pass that
    // collapsed the seven per-type tints. HUB has no yellow: the brand is
    // orange on charcoal, and a yellow chip on the hub the homepage CTA lands
    // on read as a second accent colour nobody chose. Project Profiles and
    // Case Studies are both "evidence that the work exists", so they share
    // one orange rather than inventing a hue to tell them apart — the label
    // already does that.
    tint: "rgba(249,115,22,0.14)",
    border: "rgba(249,115,22,0.35)",
    text: "#FB923C",
  },
  {
    label: "Guide",
    plural: "Guides",
    slug: "guides",
    blurb: "How to choose, specify, and defend a surface decision.",
    promise:
      "Decision support for engineers, landscape architects, and procurement teams — comparisons, lifecycle math, spec language, and the failure modes to design around in a freeze-thaw climate.",
    schemaType: "TechArticle",
    tint: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.28)",
    text: "#FDBA74",
  },
  {
    label: "White Paper",
    plural: "White Papers",
    slug: "white-papers",
    blurb: "Long-form technical documents for public works and engineering teams.",
    promise:
      "The deep documents: engineering challenges, material systems, installation standards, and cost modelling, assembled for teams building a multi-year surface program.",
    schemaType: "TechArticle",
    tint: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.16)",
    text: "#E5E7EB",
  },
  {
    label: "Blog",
    plural: "Posts",
    slug: "posts",
    blurb: "Industry notes, product context, and what we are seeing on the road.",
    promise:
      "Shorter reads on where decorative pavement is heading in Canada — material context, industry shifts, and the thinking behind the systems.",
    schemaType: "BlogPosting",
    tint: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.12)",
    text: "#9CA3AF",
  },
];

export const TYPE_BY_LABEL: Record<FieldNoteType, FieldNoteTypeMeta> =
  Object.fromEntries(FIELD_NOTE_TYPES.map((t) => [t.label, t])) as Record<
    FieldNoteType,
    FieldNoteTypeMeta
  >;

export const TYPE_BY_SLUG: Record<string, FieldNoteTypeMeta> =
  Object.fromEntries(FIELD_NOTE_TYPES.map((t) => [t.slug, t]));

interface Entry {
  type: FieldNoteType;
  /** SEO target phrases. First one is the primary. */
  keywords?: string[];
}

/**
 * The curated library. Classification rules used throughout:
 *
 *   Case Study      a named client/place AND a stated problem → solution →
 *                   outcome arc. The reader could cite it in a tender.
 *   Project Profile a named installation shown for what it is. No formal
 *                   problem statement; the photo and the system are the point.
 *   Guide           instructional or comparative. Answers "which should I
 *                   specify, and how do I justify it?"
 *   White Paper     a standalone technical document, or the hub that indexes
 *                   them.
 *   Blog            industry or product context with no single project anchor.
 */
export const FIELD_NOTES: Record<string, Entry> = {
  // ── White Papers ──────────────────────────────────────────────
  "white-paper-resilient-transit-infrastructure": {
    type: "White Paper",
    keywords: ["transit infrastructure surfacing", "bus lane surface treatment", "public works pavement specification"],
  },
  "white-paper-transportation-urban-design": {
    type: "White Paper",
    keywords: ["transportation surface design", "urban design pavement specification", "transit corridor materials"],
  },
  "transportation-infrastructure-guide": {
    type: "White Paper",
    keywords: ["transportation infrastructure guide", "public works technical resources"],
  },

  // ── Case Studies ──────────────────────────────────────────────
  "branded-crosswalks-vancouver-richmond": {
    type: "Case Study",
    keywords: ["branded crosswalk", "decorative crosswalk vancouver", "thermoplastic pavement markings"],
  },
  "commercial-applications": {
    type: "Case Study",
    keywords: ["commercial parking lot pavement", "decorative asphalt parking lot"],
  },
  "community-branding-case-study": {
    type: "Case Study",
    keywords: ["community branding pavement", "stamped asphalt development"],
  },
  "community-spaces": {
    type: "Case Study",
    keywords: ["decorative crosswalk", "community identity crosswalk", "thermoplastic pavement markings"],
  },
  "cycling-transit-integration-surface-solutions": {
    type: "Case Study",
    keywords: ["bus lane surface treatment", "coloured bike lane", "MMA bus lane"],
  },
  "decorative-asphalt-high-traffic": {
    type: "Case Study",
    keywords: ["decorative asphalt", "stamped asphalt", "high traffic pavement"],
  },
  "educational-facilities": {
    type: "Case Study",
    keywords: ["campus crosswalk", "decorative crosswalk", "Indigenous recognition crosswalk"],
  },
  "extending-transit-lane-lifespan": {
    type: "Case Study",
    keywords: ["transit lane lifespan", "bus lane surface treatment", "pavement lifecycle cost"],
  },
  "multimodal-connectivity-york-region": {
    type: "Case Study",
    keywords: ["complete streets surface design", "BRT corridor pavement", "vision zero crosswalk"],
  },
  "municipalities-case-study": {
    type: "Case Study",
    keywords: ["laneway activation", "municipal decorative pavement", "pattern paving"],
  },
  "playgrounds-recreation": {
    type: "Case Study",
    keywords: ["playground surface coating", "schoolyard pavement", "StreetBond playground"],
  },
  "safety-durability-transit-stations": {
    type: "Case Study",
    keywords: ["transit station surface", "thermoplastic pavement markings", "high traffic crosswalk"],
  },
  "streetbondsr-solar-reflective-coatings": {
    type: "Case Study",
    keywords: ["solar reflective pavement", "LEED heat island credit", "cool pavement coating"],
  },
  "trafficpatternsxd-urban-design": {
    type: "Case Study",
    keywords: ["heritage crosswalk", "brick pattern crosswalk", "pattern paving"],
  },

  // ── Guides ───────────────────────────────────────────────────
  "asphalt-concrete-renewal": {
    type: "Guide",
    keywords: ["asphalt restoration", "pavement rejuvenation", "decorative asphalt overlay"],
  },
  "commercial-parking-reit-specification": {
    type: "Guide",
    keywords: ["commercial parking lot pavement", "REIT property pavement", "decorative asphalt parking lot"],
  },
  "commercial-spaces-decorative-pavement": {
    type: "Guide",
    keywords: ["commercial decorative pavement", "retail entrance paving", "pattern paving"],
  },
  "community-identity-surface-design": {
    type: "Guide",
    keywords: ["community identity pavement", "placemaking surface design", "decorative crosswalk"],
  },
  "corporate-logos-branded-pavement": {
    type: "Guide",
    keywords: ["logo pavement marking", "branded pavement graphics", "corporate campus paving"],
  },
  "decorative-crosswalks-community-identity": {
    type: "Guide",
    keywords: ["decorative crosswalk", "rainbow crosswalk", "community identity crosswalk"],
  },
  "durable-transit-lanes-crossings": {
    type: "Guide",
    keywords: ["bus lane surface treatment", "thermoplastic pavement markings", "transit lane durability"],
  },
  "keeping-pedestrians-safe": {
    type: "Guide",
    keywords: ["pedestrian safety pavement", "high visibility crosswalk", "vision zero crosswalk"],
  },
  "pedestrian-channelization-public-spaces": {
    type: "Guide",
    keywords: ["pedestrian wayfinding pavement", "public space surface design"],
  },
  "pedestrian-safety-solutions": {
    type: "Guide",
    keywords: ["high visibility crosswalk", "pedestrian safety pavement", "vision zero crosswalk"],
  },
  "pedestrian-walkways-surface-systems": {
    type: "Guide",
    keywords: ["pathway surface coating", "greenway paving", "trail surface system"],
  },
  "residential-driveways-stamped-asphalt-upgrade": {
    type: "Guide",
    keywords: ["stamped asphalt driveway", "stamped blacktop", "stamped asphalt"],
  },
  "residential-driveways-stamped-asphalt": {
    type: "Guide",
    keywords: ["stamped asphalt vs interlocking stone", "stamped asphalt driveway", "stamped blacktop"],
  },
  "stamped-asphalt-vs-concrete": {
    type: "Guide",
    keywords: ["stamped asphalt vs concrete", "stamped asphalt", "decorative concrete alternative"],
  },
  "streetbond-leed-urban-heat-island": {
    type: "Guide",
    keywords: ["urban heat island pavement", "LEED heat island credit", "solar reflective pavement"],
  },
  "surface-signage-wayfinding": {
    type: "Guide",
    keywords: ["pavement wayfinding", "ground signage", "horizontal wayfinding"],
  },
  "traffic-calming-surface-design": {
    type: "Guide",
    keywords: ["traffic calming surface", "raised intersection treatment", "pattern paving"],
  },
  "university-campus-surface-branding": {
    type: "Guide",
    keywords: ["campus pavement branding", "university wayfinding paving", "logo pavement marking"],
  },
  "vancouver-decorative-crosswalk-design": {
    type: "Guide",
    keywords: ["decorative crosswalk vancouver", "district identity crosswalk", "rainbow crosswalk"],
  },
  "vision-zero-surface-markings": {
    type: "Guide",
    keywords: ["vision zero crosswalk", "high visibility surface markings", "thermoplastic pavement markings"],
  },
  "vision-zero-thermoplastic-crosswalks": {
    type: "Guide",
    keywords: ["thermoplastic pavement markings", "vision zero crosswalk", "preformed thermoplastic"],
  },

  // ── Project Profiles ──────────────────────────────────────────
  "bc-childrens-hospital-labyrinth": {
    type: "Project Profile",
    keywords: ["hospital pavement art", "decorative paving labyrinth"],
  },
  "bowen-island-asphalt-path": {
    type: "Project Profile",
    keywords: ["decorative asphalt path", "trail surface system"],
  },
  "complete-streets-new-westminster": {
    type: "Project Profile",
    keywords: ["complete streets surface design", "decorative crosswalk"],
  },
  "decorative-crosswalk-commercial-drive": {
    type: "Project Profile",
    keywords: ["decorative crosswalk vancouver", "community identity crosswalk"],
  },
  "decorative-crosswalk-meridian": {
    type: "Project Profile",
    keywords: ["decorative crosswalk", "coloured median treatment"],
  },
  "every-child-matters-crosswalk": {
    type: "Project Profile",
    keywords: ["Indigenous recognition crosswalk", "decorative crosswalk"],
  },
  "imprinted-asphalt-york-transit": {
    type: "Project Profile",
    keywords: ["imprinted asphalt", "BRT corridor pavement", "stamped asphalt"],
  },
  "laneway-project": {
    type: "Project Profile",
    keywords: ["laneway activation", "alley placemaking", "pattern paving"],
  },
  "murrayville-schoolhouse-sidewalk": {
    type: "Project Profile",
    keywords: ["decorative asphalt sidewalk", "townhome paving"],
  },
  "parc-riviera-streetbond-walkway": {
    type: "Project Profile",
    keywords: ["StreetBond walkway", "coloured pavement coating"],
  },
  "pictograph-crosswalk-sechelt": {
    type: "Project Profile",
    keywords: ["Indigenous recognition crosswalk", "pictograph crosswalk", "decorative crosswalk"],
  },
  "richmond-brighouse-crosswalk": {
    type: "Project Profile",
    keywords: ["decorative crosswalk", "transit station surface", "thermoplastic pavement markings"],
  },
  "roadway-accents-natures-walk": {
    type: "Project Profile",
    keywords: ["roadway accent paving", "stamped asphalt"],
  },
  "simcoe-rainbow-crosswalk": {
    // The strongest single keyword in the niche: 320/mo, KD 14.
    type: "Project Profile",
    keywords: ["rainbow crosswalk", "pride crosswalk", "decorative crosswalk"],
  },
  "spirit-trail-wayfinding-vancouver": {
    type: "Project Profile",
    keywords: ["trail wayfinding", "pavement wayfinding", "preformed thermoplastic"],
  },
  "stamped-asphalt-parking-lot": {
    type: "Project Profile",
    keywords: ["stamped asphalt parking lot", "stamped asphalt", "decorative asphalt parking lot"],
  },
  "terry-fox-plaza-coquitlam": {
    type: "Project Profile",
    keywords: ["decorative asphalt plaza", "coloured pavement coating"],
  },
  "tsain-ko-crosswalk-sechelt": {
    type: "Project Profile",
    keywords: ["decorative crosswalk", "Indigenous recognition crosswalk"],
  },
  "ubc-musqueam-crosswalk": {
    type: "Project Profile",
    keywords: ["campus crosswalk", "Indigenous recognition crosswalk", "decorative crosswalk"],
  },
  "veterans-crosswalk-kitchener": {
    type: "Project Profile",
    keywords: ["commemorative crosswalk", "community branding pavement", "decorative crosswalk"],
  },
  "white-rock-langley-trafficpatterns": {
    type: "Project Profile",
    keywords: ["decorative crosswalk", "thermoplastic pavement markings", "pattern paving"],
  },
  "white-rock-pier-crosswalk": {
    type: "Project Profile",
    keywords: ["decorative crosswalk", "waterfront paving"],
  },

  // ── Blog ─────────────────────────────────────────────────────
  "best-crosswalks-canada": {
    type: "Blog",
    keywords: ["best crosswalks canada", "durable crosswalk", "thermoplastic pavement markings"],
  },
  "decorative-asphalt-crosswalks": {
    type: "Blog",
    keywords: ["decorative asphalt crosswalks", "stamped asphalt", "pattern paving"],
  },
  "decorative-hardscape-grey-is-new-black": {
    type: "Blog",
    keywords: ["decorative hardscape", "urban design paving", "pattern paving"],
  },
  "decorative-paving-solutions": {
    type: "Blog",
    keywords: ["decorative paving solutions", "coloured pavement coating", "pattern paving"],
  },
  "durable-coatings-waterparks": {
    type: "Blog",
    keywords: ["splash pad coating", "waterpark surface coating"],
  },
  "performance-crosswalks-asphalt-concrete": {
    type: "Blog",
    keywords: ["performance crosswalk", "thermoplastic pavement markings"],
  },
  "the-street-is-your-canvas": {
    type: "Blog",
    keywords: ["street art pavement", "community identity pavement"],
  },
};

/** Curated type for a slug, or undefined when the post is new to the library. */
export function curatedType(slug: string): FieldNoteType | undefined {
  return FIELD_NOTES[slug]?.type;
}

/** Curated SEO keywords for a slug. */
export function curatedKeywords(slug: string): string[] {
  return FIELD_NOTES[slug]?.keywords ?? [];
}
