/**
 * A Field Notes post body, as stored in Sanity (portable text), rendered as
 * plain semantic HTML.
 *
 * It produces the same elements the MDX renderer did before the blog moved to
 * Sanity in Sep 2026: p, h2–h4, nested ul/ol/li, blockquote, table, hr, img,
 * strong, em and a. So the .blog-prose styles in app/globals.css, the table of
 * contents and the speakable selector (".blog-prose > p:first-of-type") keep
 * working unchanged. It returns a fragment on purpose: those selectors need
 * the paragraphs to be direct children of the <article>.
 *
 * Not next-sanity's PortableText: next-sanity is in serverExternalPackages, so
 * its React is a second copy inside a server component and the render fails
 * (see components/ui/RichText.tsx, which has the same constraint).
 *
 * What it does beyond MDX:
 *  - every h2 gets an id, so a section can be linked (#the-lifecycle-diagnosis)
 *    before any JavaScript runs; TableOfContents keeps an id it finds;
 *  - photos come from Sanity's CDN at the width the reader needs, never
 *    through /_next/image (see lib/photos.ts);
 *  - links to https://hubss.com/... are made relative again. The Studio link
 *    field only accepts full URLs, so that is how they are stored.
 *  - empty paragraphs (Studio leaves one when you press Enter twice) are
 *    skipped; MDX never rendered them either.
 */

import { Fragment, type ReactNode } from "react";
import { isSanityImage, sanitySized } from "@/lib/photos";

export interface PostSpan {
  _type: "span";
  _key?: string;
  text: string;
  marks?: string[];
}

export interface PostMarkDef {
  _type: string;
  _key: string;
  href?: string;
  blank?: boolean;
}

export interface PostTextBlock {
  _type: "block";
  _key: string;
  style?: string;
  listItem?: string;
  level?: number;
  markDefs?: PostMarkDef[];
  children?: PostSpan[];
}

export interface PostImageBlock {
  _type: "image";
  _key: string;
  alt?: string | null;
  caption?: string | null;
  /** The CDN URL, from the GROQ projection in lib/blog.ts. */
  url?: string | null;
  /** A /public path. Only the import script's parity test passes one. */
  src?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface PostTableBlock {
  _type: "table";
  _key: string;
  rows?: { _key?: string; cells?: string[] }[];
}

export interface PostDividerBlock {
  _type: "divider";
  _key: string;
}

export type PostBodyNode = PostTextBlock | PostImageBlock | PostTableBlock | PostDividerBlock;

const SITE_ORIGINS = ["https://hubss.com", "https://www.hubss.com"];

/** The same slug TableOfContents makes from a heading's text. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function blockText(b: PostTextBlock): string {
  return (b.children ?? []).map((c) => c.text ?? "").join("");
}

function hrefFor(def: PostMarkDef | undefined): string {
  const href = def?.href?.trim() ?? "";
  for (const origin of SITE_ORIGINS) {
    if (href === origin) return "/";
    if (href.startsWith(`${origin}/`) || href.startsWith(`${origin}#`) || href.startsWith(`${origin}?`)) {
      return href.slice(origin.length);
    }
  }
  return href;
}

/** Text with its line breaks as <br>. */
function withBreaks(text: string, key: string): ReactNode {
  if (!text.includes("\n")) return text;
  const parts = text.split("\n");
  return parts.map((part, i) => (
    <Fragment key={`${key}-${i}`}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

/**
 * Spans → nested inline elements. Neighbouring spans that share a mark at the
 * same depth are wrapped once, so "**bold [link](/x) bold**" becomes one
 * <strong> around the text and the link, as MDX wrote it.
 */
function renderSpans(spans: PostSpan[], defs: PostMarkDef[], depth: number, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  while (i < spans.length) {
    const mark = spans[i].marks?.[depth];
    const key = `${keyBase}-${depth}-${i}`;
    if (mark === undefined) {
      out.push(<Fragment key={key}>{withBreaks(spans[i].text ?? "", key)}</Fragment>);
      i++;
      continue;
    }
    let j = i;
    while (j < spans.length && spans[j].marks?.[depth] === mark) j++;
    const inner = renderSpans(spans.slice(i, j), defs, depth + 1, key);
    if (mark === "strong") out.push(<strong key={key}>{inner}</strong>);
    else if (mark === "em") out.push(<em key={key}>{inner}</em>);
    else {
      const def = defs.find((d) => d._key === mark);
      if (def && def._type === "link" && def.href) {
        const blank = def.blank ? { target: "_blank", rel: "noopener noreferrer" } : {};
        out.push(<a key={key} href={hrefFor(def)} {...blank}>{inner}</a>);
      } else {
        // A decorator or annotation this renderer doesn't know: keep the words.
        out.push(<Fragment key={key}>{inner}</Fragment>);
      }
    }
    i = j;
  }
  return out;
}

function inline(b: PostTextBlock): ReactNode[] {
  return renderSpans(b.children ?? [], b.markDefs ?? [], 0, b._key);
}

// ── Lists ──────────────────────────────────────────────────────────────

interface ListNode {
  kind: "bullet" | "number";
  level: number;
  key: string;
  items: { block: PostTextBlock; lists: ListNode[] }[];
}

/** A run of list blocks → nested lists, by level, as markdown nested them. */
function buildLists(blocks: PostTextBlock[]): ListNode[] {
  const roots: ListNode[] = [];
  const stack: ListNode[] = [];
  for (const b of blocks) {
    const level = Math.max(1, b.level ?? 1);
    const kind = b.listItem === "number" ? "number" : "bullet";
    while (stack.length && stack[stack.length - 1].level > level) stack.pop();
    let top = stack[stack.length - 1];
    if (top && top.level === level && top.kind !== kind) {
      stack.pop();
      top = stack[stack.length - 1];
    }
    if (!top || top.level < level) {
      const list: ListNode = { kind, level, key: b._key, items: [] };
      const parentItem = top?.items[top.items.length - 1];
      if (parentItem) parentItem.lists.push(list);
      else roots.push(list);
      stack.push(list);
      top = list;
    }
    top.items.push({ block: b, lists: [] });
  }
  return roots;
}

function renderList(list: ListNode): ReactNode {
  const items = list.items.map(({ block, lists }) => (
    <li key={block._key}>
      {inline(block)}
      {lists.map(renderList)}
    </li>
  ));
  return list.kind === "number"
    ? <ol key={`list-${list.key}`}>{items}</ol>
    : <ul key={`list-${list.key}`}>{items}</ul>;
}

// ── Other blocks ───────────────────────────────────────────────────────

/** Table cells are plain strings; **bold** in them is rendered as <strong>. */
function cell(text: string, key: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4
      ? <strong key={`${key}-${i}`}>{part.slice(2, -2)}</strong>
      : <Fragment key={`${key}-${i}`}>{part}</Fragment>
  );
}

function renderTable(t: PostTableBlock): ReactNode {
  const rows = (t.rows ?? []).filter((r) => (r.cells ?? []).length > 0);
  if (!rows.length) return null;
  const [head, ...rest] = rows;
  return (
    <table key={t._key}>
      <thead>
        <tr>{(head.cells ?? []).map((c, i) => <th key={i}>{cell(c, `${t._key}-h${i}`)}</th>)}</tr>
      </thead>
      {rest.length > 0 && (
        <tbody>
          {rest.map((r, ri) => (
            <tr key={r._key ?? ri}>
              {(r.cells ?? []).map((c, i) => <td key={i}>{cell(c, `${t._key}-${ri}-${i}`)}</td>)}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}

const IMAGE_WIDTHS = [640, 960, 1280, 1600];

function renderImage(img: PostImageBlock): ReactNode {
  const src = img.url || img.src;
  if (!src) return null;
  const alt = img.alt?.trim() ?? "";
  let el: ReactNode;
  if (isSanityImage(src)) {
    // Never offer a width larger than the photo itself.
    const natural = img.width ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
    const widths = IMAGE_WIDTHS.filter((w) => w < natural).concat(Math.min(natural, 1600));
    el = (
      // eslint-disable-next-line @next/next/no-img-element -- Sanity's CDN sizes it; see lib/photos.ts
      <img
        src={sanitySized(src, Math.min(natural, 1280))}
        srcSet={widths.map((w) => `${sanitySized(src, w)} ${w}w`).join(", ")}
        sizes="(max-width: 768px) 100vw, 680px"
        alt={alt}
        width={img.width ?? undefined}
        height={img.height ?? undefined}
        loading="lazy"
        decoding="async"
      />
    );
  } else {
    // eslint-disable-next-line @next/next/no-img-element -- a /public file, as MDX rendered it
    el = <img src={src} alt={alt} loading="lazy" decoding="async" />;
  }
  const caption = img.caption?.trim();
  return caption
    ? <figure key={img._key}>{el}<figcaption>{caption}</figcaption></figure>
    : <p key={img._key}>{el}</p>;
}

function renderTextBlock(b: PostTextBlock, ids: Map<string, number>): ReactNode {
  const style = b.style ?? "normal";
  if (style === "h1" || style === "h2") {
    // Never a second h1: the page prints the title as its only h1.
    const base = headingId(blockText(b)) || `section-${b._key}`;
    const seen = ids.get(base) ?? 0;
    ids.set(base, seen + 1);
    return <h2 key={b._key} id={seen ? `${base}-${seen + 1}` : base}>{inline(b)}</h2>;
  }
  if (style === "h3") return <h3 key={b._key}>{inline(b)}</h3>;
  if (style === "h4" || style === "h5" || style === "h6") return <h4 key={b._key}>{inline(b)}</h4>;
  return <p key={b._key}>{inline(b)}</p>;
}

const isBlock = (n: PostBodyNode): n is PostTextBlock => n._type === "block";
const hasText = (b: PostTextBlock) => blockText(b).trim().length > 0;

export default function PostBody({ body }: { body: PostBodyNode[] | null | undefined }) {
  const nodes = (body ?? []).filter((n) => !isBlock(n) || hasText(n));
  const ids = new Map<string, number>();
  const out: ReactNode[] = [];

  let i = 0;
  while (i < nodes.length) {
    const n = nodes[i];

    if (isBlock(n) && n.listItem) {
      const run: PostTextBlock[] = [];
      while (i < nodes.length && isBlock(nodes[i]) && (nodes[i] as PostTextBlock).listItem) {
        run.push(nodes[i] as PostTextBlock);
        i++;
      }
      out.push(...buildLists(run).map(renderList));
      continue;
    }

    if (isBlock(n) && n.style === "blockquote") {
      const run: PostTextBlock[] = [];
      while (i < nodes.length && isBlock(nodes[i]) && (nodes[i] as PostTextBlock).style === "blockquote" && !(nodes[i] as PostTextBlock).listItem) {
        run.push(nodes[i] as PostTextBlock);
        i++;
      }
      out.push(
        <blockquote key={`q-${run[0]._key}`}>
          {run.map((b) => <p key={b._key}>{inline(b)}</p>)}
        </blockquote>
      );
      continue;
    }

    if (isBlock(n)) out.push(renderTextBlock(n, ids));
    else if (n._type === "image") out.push(renderImage(n as PostImageBlock));
    else if (n._type === "table") out.push(renderTable(n as PostTableBlock));
    else if (n._type === "divider") out.push(<hr key={n._key} />);
    i++;
  }

  return <>{out}</>;
}
