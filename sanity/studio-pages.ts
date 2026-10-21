/**
 * Where each Studio document shows on the site, and the link that opens it
 * there in "Edit on the page" (Sanity's Presentation tool, sanity.config.ts).
 *
 * One source for both ways in (21 Oct 2026): the "Used on N pages" list
 * Studio prints at the top of a document (`locations` in sanity.config.ts)
 * and the "Edit on the page" button above the form
 * (sanity/components/EditOnThePage.tsx). Vern, 21 Oct: "when I try to click
 * the 'Edit on the page' button on a blog article, it takes me to the
 * homepage". The tool in the top bar always opens on the homepage; the button
 * opens the document's own page with the document beside it.
 *
 * Pure: no Studio imports, so scripts/test-edit-on-the-page.ts runs it in Node.
 */

/** The Presentation tool's name: its address in Studio is /studio/edit-on-the-page. */
export const EDIT_ON_THE_PAGE_TOOL = "edit-on-the-page";

/** The four page documents and where each lives on the site. */
export const PAGE_ROUTES: Readonly<Record<string, { href: string; title: string }>> = {
  homepage:      { href: "/",            title: "Homepage" },
  about:         { href: "/about",       title: "About" },
  contact:       { href: "/contact",     title: "Contact" },
  "lunch-learn": { href: "/lunch-learn", title: "Lunch & Learn" },
};

/** The document types that have a page of their own on the site. */
export const TYPES_WITH_A_PAGE: ReadonlySet<string> = new Set(["page", "product", "application", "blogPost"]);

export interface StudioPage { href: string; title: string }

/** What a resolver or the form knows about a document. */
export interface PageFields { slug?: string | null; name?: string | null; title?: string | null }

/**
 * The page a document is edited on, or null when it has none (yet): an
 * article before its URL slug is made, or a page document the site doesn't
 * read. Pure.
 */
export function documentPage(type: string, doc: PageFields | null | undefined): StudioPage | null {
  const slug = doc?.slug?.trim();
  if (!slug) return null;
  switch (type) {
    case "page":
      return PAGE_ROUTES[slug] ?? null;
    case "product":
      return { title: doc?.name?.trim() || "Product page", href: `/products/${slug}` };
    case "application":
      return { title: doc?.name?.trim() || "Application page", href: `/applications/${slug}` };
    case "blogPost":
      return { title: doc?.title?.trim() || "Article", href: `/blog/${slug}` };
    default:
      return null;
  }
}

/** A document id without Studio's draft or release prefix. Pure. */
export function publishedId(id: string): string {
  return id.replace(/^drafts\./, "").replace(/^versions\.[^.]+\./, "");
}

/**
 * The intent link that opens "Edit on the page" at `href` with the document
 * open beside it: the same intent Studio's own "Used on N pages" links send
 * (LocationItem in sanity/lib/_chunks-es/presentation.js, Sanity 5.25:
 * intent "edit", mode "presentation", the tool's name, `preview` the page).
 * scripts/test-edit-on-the-page.ts checks the installed Sanity still sends
 * that. Pure.
 */
export function editOnThePageIntent(id: string, type: string, href: string) {
  return {
    intent: "edit",
    params: {
      id: publishedId(id),
      type,
      mode: "presentation",
      presentation: EDIT_ON_THE_PAGE_TOOL,
      preview: href,
    },
  };
}
