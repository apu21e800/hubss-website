/**
 * Insights taxonomy — the curated classification layer (Aug 2026).
 *
 * "Field Notes" became "Insights" on the site on 25 Sep 2026 (Doug's round:
 * the industry-standard name for a B2B manufacturer's library). Labels only:
 * the /blog URLs, the Sanity type names (blogPost, storyIdea), the cron routes
 * and the env names all keep their old spelling, so nothing in the pipeline
 * moved. The type VALUES below ("Blog" included) are what Sanity stores on
 * every post, so they stay too; what the site prints is `badge`.
 *
 * SINCE SEP 2026 the posts live in Sanity, and each post's type and search
 * phrases are fields on it in Studio ("Type", "Search phrases"). The per-post
 * map below (FIELD_NOTES, curatedType, curatedKeywords) was where the import
 * (scripts/import-blog-to-sanity.ts) got them from; the site no longer reads
 * it, so change a post's type in Studio, not here. The types themselves
 * (FIELD_NOTE_TYPES: values, schema types, Studio's Type list) are still read
 * everywhere. Since 28 Sep 2026 the site lists them in three sections
 * (INSIGHTS_SECTIONS, below): Projects, Guides and Articles.
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

/**
 * THE THREE SECTIONS (Vern, 28 Sep 2026): "Case Studies 14, Project Profiles
 * 25, Guides 24, White Papers 3, Articles: these categories feel like they
 * have not been refined enough. Insights = blog." Five hubs split one library
 * along lines a reader could not see (a case study and a project profile are
 * both a write-up of a job; a white paper is a long guide), and two of them
 * held three posts and eight. The site now shows three sections, and a card
 * or a post carries one label: Project, Guide or Article.
 *
 * Labels and routes only. The five stored values below are unchanged, so
 * Studio, the drafter and every published post keep working; each type just
 * names the section it is listed in. The old hub addresses redirect
 * (next.config.ts): /blog/case-studies and /blog/project-profiles to
 * /blog/projects, /blog/white-papers to /blog/guides, /blog/posts to
 * /blog/articles.
 */
export type InsightsSectionKey = "projects" | "guides" | "articles";

export interface InsightsSection {
  key: InsightsSectionKey;
  /** The label on a card and on the post hero: "Project". */
  singular: string;
  /** The section's name: its page H1, its filter pill, its breadcrumb. */
  plural: string;
  /** URL segment: /blog/projects */
  slug: string;
  /** The stored types the section lists. */
  types: FieldNoteType[];
  /** One line: the section's meta description lede and its cross-link card. */
  blurb: string;
  /** The paragraph under the section page's H1. */
  promise: string;
  /** Label tint, border and text. The brand's orange family and one neutral. */
  tint: string;
  border: string;
  text: string;
}

export const INSIGHTS_SECTIONS: InsightsSection[] = [
  {
    key: "projects",
    singular: "Project",
    plural: "Projects",
    slug: "projects",
    types: ["Case Study", "Project Profile"],
    blurb: "Canadian installations, written up, with the system used on each.",
    // Merged from the two old hub promises, keeping only what both could
    // stand behind: a profile is a short record, a case study the full brief.
    promise:
      "Installations across Canada, written up: where each one is, which system went down and how it looks now. The case studies add the brief and the specification, for the people who have to defend one.",
    tint: "rgba(249,115,22,0.14)",
    border: "rgba(249,115,22,0.35)",
    text: "var(--accent-text)",
  },
  {
    key: "guides",
    singular: "Guide",
    plural: "Guides",
    slug: "guides",
    types: ["Guide", "White Paper"],
    blurb: "How to choose, specify and defend a surface decision.",
    promise:
      "Decision support for engineers, landscape architects and procurement teams: comparisons, lifecycle math, spec language and the failure modes to design around in a freeze-thaw climate. The long technical papers for public works teams are here too.",
    tint: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.28)",
    text: "var(--accent-soft-text)",
  },
  {
    key: "articles",
    singular: "Article",
    plural: "Articles",
    slug: "articles",
    types: ["Blog"],
    blurb: "Industry notes, product context and what we are seeing on the road.",
    promise:
      "Shorter reads on where decorative pavement is heading in Canada: material context, industry shifts and the thinking behind the systems.",
    tint: "var(--ink-05)",
    border: "var(--ink-12)",
    text: "var(--text-muted)",
  },
];

export const SECTION_BY_KEY: Record<InsightsSectionKey, InsightsSection> =
  Object.fromEntries(INSIGHTS_SECTIONS.map((s) => [s.key, s])) as Record<InsightsSectionKey, InsightsSection>;

export interface FieldNoteTypeMeta {
  /**
   * The type's VALUE: what Sanity stores in a post's `category` and what the
   * drafter writes. Never rename one - every post filed under it would fall
   * back to guessing its type. Print `badgeFor()`, not this.
   */
  label: FieldNoteType;
  /**
   * The type's name in Studio's Type list (sanity/schemas/blogPost.ts and
   * storyIdea.ts read it), so an editor still sees five distinct choices.
   * Since 28 Sep 2026 the site prints the section's label instead: badgeFor().
   */
  badge: string;
  /** Which of the three sections lists it. */
  section: InsightsSectionKey;
  /**
   * The type's plural, hub segment, blurb and promise, from when each type
   * had its own hub. The site prints the section's (INSIGHTS_SECTIONS); the
   * old hub addresses redirect to it.
   */
  plural: string;
  slug: string;
  blurb: string;
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
    badge: "Case Study",
    section: "projects",
    plural: "Case Studies",
    slug: "case-studies",
    blurb: "Named projects with the brief, the constraint, and the measured outcome.",
    promise:
      "Every case study documents a real Canadian installation: what the owner needed, what was specified, how it was installed, and how the surface has performed since. Written for the people who have to defend a specification.",
    schemaType: "Article",
    tint: "rgba(249,115,22,0.14)",
    border: "rgba(249,115,22,0.35)",
    text: "var(--accent-text)",
  },
  {
    label: "Project Profile",
    badge: "Project Profile",
    section: "projects",
    plural: "Project Profiles",
    slug: "project-profiles",
    blurb: "Short-form records of installations across the country.",
    promise:
      "The field record: where it is, what went down, which system, and what it looks like now. Quick reads for browsing what is possible, and proof that the work exists outside a brochure.",
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
    text: "var(--accent-text)",
  },
  {
    label: "Guide",
    badge: "Guide",
    section: "guides",
    plural: "Guides",
    slug: "guides",
    blurb: "How to choose, specify, and defend a surface decision.",
    promise:
      "Decision support for engineers, landscape architects, and procurement teams: comparisons, lifecycle math, spec language, and the failure modes to design around in a freeze-thaw climate.",
    schemaType: "TechArticle",
    tint: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.28)",
    text: "var(--accent-soft-text)",
  },
  {
    label: "White Paper",
    badge: "White Paper",
    section: "guides",
    plural: "White Papers",
    slug: "white-papers",
    blurb: "Long-form technical documents for public works and engineering teams.",
    promise:
      "The deep documents: engineering challenges, material systems, installation standards, and cost modelling, assembled for teams building a multi-year surface program.",
    schemaType: "TechArticle",
    tint: "var(--ink-06)",
    border: "var(--ink-16)",
    text: "var(--text-body)",
  },
  {
    label: "Blog",
    badge: "Article",
    section: "articles",
    plural: "Articles",
    // Its hub was /blog/posts until 28 Sep 2026; that address now redirects
    // to /blog/articles, the Articles section.
    slug: "posts",
    blurb: "Industry notes, product context, and what we are seeing on the road.",
    promise:
      "Shorter reads on where decorative pavement is heading in Canada: material context, industry shifts, and the thinking behind the systems.",
    schemaType: "BlogPosting",
    tint: "var(--ink-05)",
    border: "var(--ink-12)",
    text: "var(--text-muted)",
  },
];

export const TYPE_BY_LABEL: Record<FieldNoteType, FieldNoteTypeMeta> =
  Object.fromEntries(FIELD_NOTE_TYPES.map((t) => [t.label, t])) as Record<
    FieldNoteType,
    FieldNoteTypeMeta
  >;

export const TYPE_BY_SLUG: Record<string, FieldNoteTypeMeta> =
  Object.fromEntries(FIELD_NOTE_TYPES.map((t) => [t.slug, t]));

/**
 * The section a post's stored type is listed in. A value the taxonomy doesn't
 * know (an old import, a typo in Studio) is listed with the articles, as an
 * untyped post always was.
 */
export function sectionFor(category: string | undefined | null): InsightsSection {
  const type = category ? TYPE_BY_LABEL[category as FieldNoteType] : undefined;
  return SECTION_BY_KEY[type?.section ?? "articles"];
}

/** What a card or a post hero prints for a post's stored type: Project, Guide or Article. */
export function badgeFor(category: string | undefined | null): string {
  return sectionFor(category).singular;
}

/**
 * Posts that are still published in Studio but kept off the site, each with
 * the post that replaced it (28 Sep 2026). next.config.ts redirects the old
 * address to the new one, and lib/blog.ts and lib/search.ts leave the post out
 * of every listing, related list, the sitemap and search. Sanity is not
 * touched; once a post is unpublished there, its line here does nothing.
 */
export const ARCHIVED_POSTS: Record<string, string> = {
  // "Imprinted Asphalt Crosswalks for York Transit Corridor": one paragraph
  // saying it has been archived and pointing at the York Region case study
  // (QA rest#9).
  "imprinted-asphalt-york-transit": "multimodal-connectivity-york-region",
};

export const ARCHIVED_SLUGS: readonly string[] = Object.keys(ARCHIVED_POSTS);

/**
 * The /projects/<slug> pages, retired 28 Sep 2026, each with the Insights
 * write-up of the same job. next.config.ts sends every project in
 * lib/projects.ts to its line here (308), and app/projects/[slug]/page.tsx
 * does the same if that rule is ever removed; a project with no line goes to
 * /blog/projects. The pages were built from lib/projects.ts, a short list
 * written before the posts, and had drifted from them: UBC Musqueam as
 * StreetPrint stamped asphalt over a playground photo, the East London Link
 * as StreetBond, and figures no source supports ("outlasted paint by 8x",
 * "12 major arterials"). Each destination covers the same project: Toronto's
 * is the TTC bus-priority section of the transit-lane case study.
 */
export const RETIRED_PROJECT_PAGES: Record<string, string> = {
  "keeping-pedestrians-safe": "/blog/keeping-pedestrians-safe",
  "pedestrian-safety-high-visibility": "/blog/pedestrian-safety-solutions",
  "vancouver-crosswalk-design-2025": "/blog/vancouver-decorative-crosswalk-design",
  "york-region-hwy7-viva": "/blog/multimodal-connectivity-york-region",
  "toronto-priority-bus-lanes": "/blog/extending-transit-lane-lifespan",
  "london-east-link-brt": "/blog/london-east-link-brt",
  "kitchener-veterans-memorial": "/blog/veterans-crosswalk-kitchener",
  "ubc-musqueam-crosswalk": "/blog/ubc-musqueam-crosswalk",
  "vancouver-more-awesome-laneway": "/blog/laneway-project",
};

/** Where a retired /projects/<slug> page now points. */
export const retiredProjectHref = (slug: string): string =>
  Object.prototype.hasOwnProperty.call(RETIRED_PROJECT_PAGES, slug) ? RETIRED_PROJECT_PAGES[slug] : "/blog/projects";

export const isArchivedPost = (slug: string): boolean =>
  Object.prototype.hasOwnProperty.call(ARCHIVED_POSTS, slug);

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

  // ── From the 2027 print catalogue (Sep 2026) ──────────────────
  // Seven posts written out of the booklet's own spreads and project stories,
  // so the site says in long form what the book says in print.
  "how-stamped-asphalt-is-installed": {
    type: "Guide",
    keywords: ["how is stamped asphalt installed", "stamped asphalt process", "infrared asphalt reheating"],
  },
  "snowplow-safe-decorative-pavement": {
    type: "Guide",
    keywords: ["snowplow safe pavement marking", "freeze-thaw decorative pavement", "durable crosswalk material"],
  },
  "thermoplastic-colour-selection": {
    type: "Guide",
    keywords: ["thermoplastic pavement colours", "StreetBond colour chart", "pavement marking Pantone"],
  },
  "hub-certified-installer-network": {
    type: "Blog",
    keywords: ["certified pavement installer Canada", "thermoplastic applicator", "stamped asphalt contractor"],
  },
  "london-east-link-brt": {
    type: "Project Profile",
    keywords: ["BRT lane surface", "red bus lane London Ontario", "transit corridor pavement"],
  },
  "toronto-premium-outlets-14-years": {
    type: "Project Profile",
    keywords: ["retail parking lot crosswalk", "commercial pavement durability", "decorative crossing service life"],
  },
  "geary-works-toronto-park-walkway": {
    type: "Project Profile",
    keywords: ["park walkway graphics", "pavement placemaking", "DecoMark thermoplastic"],
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
