import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import type { SanityBlock } from "@/types/sanity";

/**
 * Sanity rich text (portable text) in the site's body style.
 *
 * Paragraphs, h2–h4, quotes, bullet and numbered lists, links, bold, italic,
 * underline and strike-through all survive from Studio to the page. Until Sep
 * 2026 every description was flattened to one string in a single <p>, so a
 * heading or a link typed in Studio disappeared on the way in.
 *
 * A one-paragraph description renders exactly as before: the same text, type
 * size, line height, colour and measure.
 *
 * Why not @portabletext/react: next.config.ts lists next-sanity in
 * serverExternalPackages, so its PortableText runs against a second copy of
 * React in a server component and the build dies on `useMemo`. Adding the
 * package directly made npm drop other platforms' binaries from the lockfile.
 * The block types the Studio schema allows are few, and this renders them with
 * no dependency and no client JavaScript.
 */

type MarkDef = NonNullable<SanityBlock["markDefs"]>[number];

const body = {
  color: "var(--text-body)",
  fontSize: "clamp(1rem, 1.8vw, 1.075rem)",
} as const;
const heading = { color: "var(--text-primary)", letterSpacing: "-0.02em" } as const;
const link = { color: "var(--accent-text)", textDecoration: "underline", textUnderlineOffset: "3px" } as const;

/** Text with Studio's soft line breaks (Shift+Enter) as <br />. */
function withBreaks(text: string, key: string): ReactNode {
  const lines = text.split("\n");
  if (lines.length === 1) return text;
  return lines.map((line, i) => (
    <Fragment key={`${key}-${i}`}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

function applyMark(mark: string, node: ReactNode, defs: Map<string, MarkDef>, key: string): ReactNode {
  switch (mark) {
    case "strong": return <strong key={key} style={{ color: "var(--text-primary)" }}>{node}</strong>;
    case "em": return <em key={key}>{node}</em>;
    case "underline": return <span key={key} style={{ textDecoration: "underline" }}>{node}</span>;
    case "strike-through": return <s key={key}>{node}</s>;
    case "code": return <code key={key}>{node}</code>;
  }
  const def = defs.get(mark);
  if (def?._type === "link" && typeof def.href === "string" && def.href) {
    const href = def.href;
    if (href.startsWith("/")) return <Link key={key} href={href} style={link}>{node}</Link>;
    return <a key={key} href={href} target="_blank" rel="noopener noreferrer" style={link}>{node}</a>;
  }
  return node; // an annotation this site doesn't render: keep the text
}

function spans(block: SanityBlock): ReactNode[] {
  const defs = new Map((block.markDefs ?? []).map((d) => [d._key, d]));
  return (block.children ?? []).map((span, i) => {
    const key = span._key || `s${i}`;
    let node: ReactNode = withBreaks(span.text ?? "", key);
    for (const mark of span.marks ?? []) node = applyMark(mark, node, defs, `${key}-${mark}`);
    return <Fragment key={key}>{node}</Fragment>;
  });
}

const hasText = (b: SanityBlock) => (b.children ?? []).some((c) => (c.text ?? "").trim().length > 0);

function renderBlock(b: SanityBlock, key: string): ReactNode {
  const content = spans(b);
  switch (b.style) {
    // One H1 per page, and it is the product or application name.
    case "h1":
    case "h2": return <h2 key={key} className="text-xl sm:text-2xl font-bold pt-3" style={heading}>{content}</h2>;
    case "h3": return <h3 key={key} className="text-lg sm:text-xl font-bold pt-2" style={heading}>{content}</h3>;
    case "h4":
    case "h5":
    case "h6": return <h4 key={key} className="text-base font-bold pt-1" style={heading}>{content}</h4>;
    case "blockquote":
      return (
        <blockquote key={key} className="border-l-2 pl-5 italic leading-[1.85]" style={{ ...body, borderColor: "var(--accent)" }}>
          {content}
        </blockquote>
      );
    default: return <p key={key} className="leading-[1.85]" style={body}>{content}</p>;
  }
}

function renderList(type: "bullet" | "number", items: SanityBlock[], key: string): ReactNode {
  const List = type === "number" ? "ol" : "ul";
  return (
    <List key={key} className={`${type === "number" ? "list-decimal" : "list-disc"} pl-6 space-y-2 leading-[1.75]`} style={body}>
      {items.map((item, i) => (
        <li key={item._key || `${key}-${i}`} style={{ marginLeft: `${Math.max(0, (item.level ?? 1) - 1) * 1.5}rem` }}>
          {spans(item)}
        </li>
      ))}
    </List>
  );
}

export default function RichText({ value, className = "mb-12" }: { value: SanityBlock[]; className?: string }) {
  const blocks = (value ?? []).filter((b) => b && b._type === "block" && hasText(b));
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; ) {
    const b = blocks[i];
    if (b.listItem) {
      const type = b.listItem;
      const items: SanityBlock[] = [];
      while (i < blocks.length && blocks[i].listItem === type) items.push(blocks[i++]);
      out.push(renderList(type, items, `list-${b._key || i}`));
      continue;
    }
    out.push(renderBlock(b, b._key || `b${i}`));
    i++;
  }
  return (
    <div className={`${className} space-y-5`} style={{ maxWidth: "65ch" }}>
      {out}
    </div>
  );
}
