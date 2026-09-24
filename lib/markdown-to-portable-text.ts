/**
 * Markdown (the body of a content/blog/*.mdx post) → Sanity portable text.
 *
 * Used by the one-time import (scripts/import-blog-to-sanity.ts) and by the
 * AI drafter (lib/field-note-drafter.ts), which writes markdown. It covers
 * exactly what the 74 posts contained, checked on 24 Sep 2026: headings,
 * paragraphs with bold, italic and links, bullet and numbered lists (nested),
 * quotes, tables, horizontal rules and images. It is written so that
 * components/blog/PostBody.tsx renders the result as the same HTML the MDX
 * renderer produced.
 *
 * unified and remark-parse arrive through next-mdx-remote and @next/mdx
 * (remark-gfm is a direct dependency). If those two are ever removed from
 * package.json, add unified and remark-parse there first.
 *
 * Rules that keep the rendered page identical:
 *  - MDX authoring comments ({/* … *\/}) are removed.
 *  - A leading `# Title` is dropped (the page already prints the title as its
 *    h1; app/blog/[slug] used to strip it at render time). Any later h1 becomes h2.
 *  - A soft line wrap inside a paragraph is a space, as in HTML; only a hard
 *    break becomes "\n" (rendered as <br>).
 *  - Relative links become https://hubss.com/…, because the Studio link field
 *    only accepts full URLs. PostBody turns them back into relative links.
 *  - Table cells keep **bold** as markdown in their text; PostBody renders it.
 *  - Images become image blocks; the caller uploads the file and fills in the
 *    asset reference (see `images`).
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

// Minimal mdast types, just what this file reads.
interface MdNode {
  type: string;
  children?: MdNode[];
  value?: string;
  depth?: number;
  ordered?: boolean;
  url?: string;
  alt?: string | null;
  title?: string | null;
}

export interface Span { _type: "span"; _key: string; text: string; marks: string[] }
export interface LinkDef { _type: "link"; _key: string; href: string; blank?: boolean }
export interface TextBlock {
  _type: "block";
  _key: string;
  style: string;
  markDefs: LinkDef[];
  children: Span[];
  listItem?: "bullet" | "number";
  level?: number;
}
export interface ImageBlock { _type: "image"; _key: string; alt: string; caption?: string; src: string }
export interface TableBlock { _type: "table"; _key: string; rows: { _type: "tableRow"; _key: string; cells: string[] }[] }
export interface DividerBlock { _type: "divider"; _key: string; style: "line" }
export type PortableNode = TextBlock | ImageBlock | TableBlock | DividerBlock;

const SITE = "https://hubss.com";

export function stripMdxComments(md: string): string {
  return md.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
}

/** Deterministic keys, so a re-import produces identical documents. */
function keyMaker(prefix: string) {
  let n = 0;
  return () => `${prefix}${(n++).toString(36)}`;
}

function absoluteHref(url: string): string {
  if (url.startsWith("/")) return `${SITE}${url}`;
  return url;
}

/** Inline content → spans + link definitions. */
function inline(nodes: MdNode[], key: () => string, defs: LinkDef[], marks: string[] = []): Span[] {
  const out: Span[] = [];
  for (const n of nodes) {
    switch (n.type) {
      case "text":
        out.push({ _type: "span", _key: key(), text: (n.value ?? "").replace(/\s*\n\s*/g, " "), marks: [...marks] });
        break;
      case "break":
        out.push({ _type: "span", _key: key(), text: "\n", marks: [...marks] });
        break;
      case "strong":
        out.push(...inline(n.children ?? [], key, defs, [...marks, "strong"]));
        break;
      case "emphasis":
        out.push(...inline(n.children ?? [], key, defs, [...marks, "em"]));
        break;
      case "delete":
        // No strike-through in the Studio schema; keep the words.
        out.push(...inline(n.children ?? [], key, defs, marks));
        break;
      case "inlineCode":
        out.push({ _type: "span", _key: key(), text: n.value ?? "", marks: [...marks] });
        break;
      case "link": {
        const href = absoluteHref(n.url ?? "");
        let def = defs.find((d) => d.href === href);
        if (!def) {
          // No "open in new tab": the MDX pages opened every link in place.
          def = { _type: "link", _key: key(), href };
          defs.push(def);
        }
        out.push(...inline(n.children ?? [], key, defs, [...marks, def._key]));
        break;
      }
      case "image":
        // Inline images inside text are split out by the paragraph handler.
        break;
      default:
        if (n.children) out.push(...inline(n.children, key, defs, marks));
        else if (typeof n.value === "string") out.push({ _type: "span", _key: key(), text: n.value, marks: [...marks] });
    }
  }
  // Merge neighbours with identical marks, so the text reads as it was written.
  const merged: Span[] = [];
  for (const s of out) {
    const prev = merged[merged.length - 1];
    if (prev && prev.marks.join("|") === s.marks.join("|")) prev.text += s.text;
    else merged.push(s);
  }
  return merged;
}

/** Plain text of a node, with **bold** kept as markdown (for table cells). */
function cellText(nodes: MdNode[]): string {
  return nodes.map((n) => {
    if (n.type === "strong") return `**${cellText(n.children ?? [])}**`;
    if (n.type === "text" || n.type === "inlineCode") return n.value ?? "";
    if (n.type === "break") return " ";
    return cellText(n.children ?? []);
  }).join("").replace(/\s*\n\s*/g, " ").trim();
}

export function markdownToPortableText(markdown: string, keyPrefix = "k"): { blocks: PortableNode[]; images: ImageBlock[] } {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(stripMdxComments(markdown)) as unknown as MdNode;
  const key = keyMaker(keyPrefix);
  const blocks: PortableNode[] = [];
  const images: ImageBlock[] = [];

  const textBlock = (children: MdNode[], style: string, extra: Partial<TextBlock> = {}): TextBlock | null => {
    const defs: LinkDef[] = [];
    const spans = inline(children, key, defs);
    if (!spans.some((s) => s.text.trim())) return null;
    // Trim the outer whitespace the markdown left.
    spans[0].text = spans[0].text.replace(/^\s+/, "");
    spans[spans.length - 1].text = spans[spans.length - 1].text.replace(/\s+$/, "");
    return { _type: "block", _key: key(), style, markDefs: defs, children: spans, ...extra };
  };

  const pushImage = (n: MdNode) => {
    const img: ImageBlock = { _type: "image", _key: key(), alt: (n.alt ?? "").trim(), src: n.url ?? "", ...(n.title ? { caption: n.title } : {}) };
    blocks.push(img);
    images.push(img);
  };

  const paragraph = (n: MdNode, extra: Partial<TextBlock> = {}, style = "normal") => {
    // Split images out of the paragraph, keeping the text around them in order.
    let run: MdNode[] = [];
    const flush = () => {
      if (run.length) { const b = textBlock(run, style, extra); if (b) blocks.push(b); run = []; }
    };
    for (const c of n.children ?? []) {
      if (c.type === "image") { flush(); pushImage(c); }
      else run.push(c);
    }
    flush();
  };

  const list = (n: MdNode, level: number) => {
    const kind = n.ordered ? "number" : "bullet";
    for (const item of n.children ?? []) {
      // An item's own text: its paragraphs, joined by a hard break.
      const own: MdNode[] = [];
      const nested: MdNode[] = [];
      for (const c of item.children ?? []) {
        if (c.type === "list") nested.push(c);
        else if (c.type === "paragraph") {
          if (own.length) own.push({ type: "break" });
          own.push(...(c.children ?? []));
        } else own.push(c);
      }
      const b = textBlock(own, "normal", { listItem: kind, level });
      if (b) blocks.push(b);
      for (const sub of nested) list(sub, level + 1);
    }
  };

  const children = tree.children ?? [];
  children.forEach((n, i) => {
    switch (n.type) {
      case "heading": {
        if (n.depth === 1 && i === 0) return; // the title, restated
        const style = n.depth === 1 || n.depth === 2 ? "h2" : n.depth === 3 ? "h3" : "h4";
        const b = textBlock(n.children ?? [], style);
        if (b) blocks.push(b);
        return;
      }
      case "paragraph":
        return paragraph(n);
      case "list":
        return list(n, 1);
      case "blockquote":
        for (const c of n.children ?? []) {
          if (c.type === "paragraph") paragraph(c, {}, "blockquote");
        }
        return;
      case "thematicBreak":
        blocks.push({ _type: "divider", _key: key(), style: "line" });
        return;
      case "table":
        blocks.push({
          _type: "table",
          _key: key(),
          rows: (n.children ?? []).map((row) => ({
            _type: "tableRow" as const,
            _key: key(),
            cells: (row.children ?? []).map((cell) => cellText(cell.children ?? [])),
          })),
        });
        return;
      case "html":
        // None in the posts today; keep any text rather than lose it.
        if (n.value?.trim()) {
          const b = textBlock([{ type: "text", value: n.value.replace(/<[^>]+>/g, " ") }], "normal");
          if (b) blocks.push(b);
        }
        return;
      default:
        if (n.children) paragraph(n);
    }
  });

  return { blocks, images };
}

/** The words of a converted body, for word counts and product scanning. */
export function portableTextToPlain(blocks: PortableNode[]): string {
  return blocks.map((b) => {
    if (b._type === "block") return b.children.map((c) => c.text).join("");
    if (b._type === "table") return b.rows.map((r) => r.cells.join(" ")).join("\n");
    return "";
  }).join("\n\n");
}
