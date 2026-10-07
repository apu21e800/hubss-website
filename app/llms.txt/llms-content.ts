/**
 * /llms.txt and /llms-full.txt, built from the data the pages use.
 *
 * 2 Oct 2026. Vern: "when I search Perplexity for key words like stamped
 * asphalt, I get zero results for hubss. we should fix that too, be
 * searchable on all LLM models." The hand-written public/llms.txt had gone
 * stale: it listed Private Driveways after that page merged into Residential
 * Driveways, called HUB a "Canadian leader" in "solutions" and printed claims
 * the pages no longer make. Both files now come from the merged products and
 * applications the product and application pages render (Sanity over code,
 * lib/cms-merge.ts), the families the Products menu prints, the StreetPrint
 * questions the page answers and the Insights posts the sitemap lists, so they
 * cannot drift from the site. No fs reads: every source is an import or a
 * Sanity query.
 *
 * Format: https://llmstxt.org (an H1, a summary blockquote, details, then H2
 * sections of link lists; "Optional" marks what can be skipped).
 */
import { getSiteSettings } from "@/lib/sanity.queries";
import { getMergedProducts, type MergedProduct } from "@/lib/products.server";
import { getMergedApplications, type MergedApplication } from "@/lib/applications.server";
import { getAllPosts } from "@/lib/blog";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { INSIGHTS_SECTIONS, sectionFor } from "@/lib/field-notes-taxonomy";
import { catalogueReady, ideaBook } from "@/lib/catalogue";
import { faqsFor } from "@/lib/product-faqs";

const SITE = "https://hubss.com";
const url = (path: string) => `${SITE}${path}`;

/** The house style has no em dashes; Studio text that carries one is set with a comma here. */
const clean = (s: string) => s.replace(/\s*—\s*/g, ", ").trim();
/** One line: list notes cannot break across lines. */
const line = (s: string) => clean(s).replace(/\s+/g, " ");

// The site's one-line description (SITE_DESCRIPTION in app/layout.tsx and the
// homepage), with the repair family added so all four families are named.
const SUMMARY =
  "Stamped asphalt, preformed thermoplastic pavement markings, pavement coatings and asphalt and concrete repair for Canadian municipalities, specifiers and contractors. Canadian-owned since 1999.";

// As the footer prints them: Studio's Site Settings (lib/site-settings.ts).
type OfficeLine = { name: string; place: string; email: string; phone: string };

type Data = {
  products: MergedProduct[];
  applications: MergedApplication[];
  productBySlug: Map<string, MergedProduct>;
  applicationBySlug: Map<string, MergedApplication>;
  /** Products in the families' order (lib/product-categories.ts); any product in no family last. */
  ordered: MergedProduct[];
  familyOf: Map<string, string>;
  offices: OfficeLine[];
};

async function load(): Promise<Data> {
  const [products, applications, settings] = await Promise.all([getMergedProducts(), getMergedApplications(), getSiteSettings()]);
  const offices: OfficeLine[] = [
    { name: "West office", place: settings.offices.west.place, email: settings.offices.west.email, phone: settings.offices.west.phone },
    { name: "East office", place: settings.offices.east.place, email: settings.offices.east.email, phone: settings.offices.east.phone },
  ];
  const live = products.filter((p) => !p.comingSoon);
  const productBySlug = new Map(live.map((p) => [p.slug, p]));
  const applicationBySlug = new Map(applications.map((a) => [a.slug, a]));
  const familyOf = new Map<string, string>();
  for (const family of PRODUCT_CATEGORIES) for (const slug of family.slugs) familyOf.set(slug, family.label);
  const inFamilies = PRODUCT_CATEGORIES.flatMap((f) => f.slugs)
    .map((slug) => productBySlug.get(slug))
    .filter((p): p is MergedProduct => Boolean(p));
  const ordered = [...inFamilies, ...live.filter((p) => !familyOf.has(p.slug))];
  return { products: live, applications, productBySlug, applicationBySlug, ordered, familyOf, offices };
}

/** The H1, the summary and the plain-words key to the product names. */
function head(d: Data): string[] {
  const families = PRODUCT_CATEGORIES.map((f) => {
    const names = f.slugs.map((slug) => d.productBySlug.get(slug)?.name).filter(Boolean);
    return `- ${f.label}: ${names.join(", ")}. ${line(f.intro)}`;
  });
  return [
    "# HUB Surface Systems",
    "",
    `> ${SUMMARY}`,
    "",
    `Two offices: the ${d.offices[0].name} in ${d.offices[0].place}, and the ${d.offices[1].name} in ${d.offices[1].place}, working coast to coast. Installation is by certified HUB applicators.`,
    "",
    "HUB's systems go by their own names. What each family is, and which systems are in it:",
    "",
    ...families,
  ];
}

function tail(d: Data): string[] {
  const resources = [
    `- [Resources](${url("/resources")}): Technical data sheets, spec sheets, brochures, safety guides and installation resources for every HUB product.`,
    ...(catalogueReady
      ? [`- [${ideaBook.title}](${url(ideaBook.href)}): Every HUB system, application and specification in one book, to read online.`]
      : []),
    `- [Request a printed ${ideaBook.short}](${url(ideaBook.requestHref)}): Have ${ideaBook.title} mailed to your office.`,
    `- [Lunch & Learn](${url("/lunch-learn")}): Book a free Lunch & Learn: HUB brings lunch and material samples to your office, in person or virtual.`,
    ...PRODUCT_CATEGORIES.flatMap((f) =>
      f.secondary ? [`- [${f.secondary.label}](${url(f.secondary.href)}): ${f.secondary.menuLine ?? f.secondary.label}.`] : []
    ),
    `- [Gallery](${url("/gallery")}): Photographs of decorative pavement across Canada: crosswalks, transit lanes, parks and paths, playgrounds and community branding.`,
  ];
  return [
    "## Insights",
    "",
    `- [Insights](${url("/blog")}): Projects, guides and articles on Canadian decorative pavement.`,
    ...INSIGHTS_SECTIONS.map((s) => `- [${s.plural}](${url(`/blog/${s.slug}`)}): ${line(s.blurb)}`),
    "",
    "## Resources",
    "",
    ...resources,
    "",
    "## Contact",
    "",
    `- [Contact](${url("/contact")}): The contact form and both offices.`,
    ...d.offices.map((o) => `- [${o.name}](${url("/contact")}): ${o.place}. ${o.phone}, ${o.email}`),
    `- [About](${url("/about")}): The company, Canadian-owned since 1999, and its two regional offices.`,
  ];
}

/** /llms.txt: what the site is, and a link with one line for every product, application and section. */
export async function buildLlmsTxt(): Promise<string> {
  const d = await load();
  return [
    ...head(d),
    "",
    "## Products",
    "",
    ...d.ordered.map((p) => `- [${p.name}](${url(`/products/${p.slug}`)}): ${line(p.shortDesc)}`),
    "",
    "## Applications",
    "",
    ...d.applications.map((a) => `- [${a.name}](${url(`/applications/${a.slug}`)}): ${line(a.shortDesc)}`),
    "",
    ...tail(d),
    "",
    "## Optional",
    "",
    `- [Full text](${url("/llms-full.txt")}): Every product and application page's description and specifications, the StreetPrint questions and answers, and every Insights post.`,
    "",
  ].join("\n");
}

/** /llms-full.txt: the same, with each page's own text in full and every Insights post. */
export async function buildLlmsFullTxt(): Promise<string> {
  const [d, posts] = await Promise.all([load(), getAllPosts()]);

  const product = (p: MergedProduct): string[] => {
    const uses = p.relatedApplications.map((slug) => d.applicationBySlug.get(slug)?.name).filter(Boolean);
    const faqs = faqsFor(p.slug) ?? [];
    return [
      `### ${p.name}`,
      "",
      `${url(`/products/${p.slug}`)}`,
      ...(d.familyOf.has(p.slug) ? [`Family: ${d.familyOf.get(p.slug)}`] : []),
      "",
      line(p.shortDesc),
      "",
      clean(p.description),
      ...(p.specs.length ? ["", "Specifications:", ...p.specs.map((s) => `- ${line(s.label)}: ${line(s.value)}`)] : []),
      ...(uses.length ? ["", `Applications: ${uses.join(", ")}`] : []),
      ...(faqs.length ? ["", "Questions and answers:", ...faqs.flatMap((f) => ["", `Q: ${line(f.q)}`, `A: ${line(f.a)}`])] : []),
      "",
    ];
  };

  const application = (a: MergedApplication): string[] => {
    const systems = a.relatedProducts.map((slug) => d.productBySlug.get(slug)?.name).filter(Boolean);
    return [
      `### ${a.name}`,
      "",
      `${url(`/applications/${a.slug}`)}`,
      "",
      line(a.shortDesc),
      "",
      clean(a.description),
      ...(systems.length ? ["", `Systems: ${systems.join(", ")}`] : []),
      "",
    ];
  };

  return [
    ...head(d),
    "",
    "## Products",
    "",
    ...d.ordered.flatMap(product),
    "## Applications",
    "",
    ...d.applications.flatMap(application),
    "## Insights posts",
    "",
    ...posts.map((p) => `- [${line(p.title)}](${url(`/blog/${p.slug}`)}): ${sectionFor(p.category).singular}, ${p.date}. ${line(p.excerpt)}`),
    "",
    ...tail(d),
    "",
  ].join("\n");
}
