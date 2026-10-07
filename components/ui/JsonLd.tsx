interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Structured data for search engines, written into a <script> tag as raw
 * text. JSON.stringify leaves "<" alone, so a string from Studio containing
 * "</script>" (a post title, an excerpt, a product name) would close the tag
 * early and whatever followed would run as code on the page. Escaping <, >
 * and & as \u003c, \u003e and \u0026 keeps the JSON identical for every
 * parser that reads it and inert for the browser. Security pass, 7 Oct 2026.
 */
export function jsonLdText(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export default function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(data) }} />;
}
