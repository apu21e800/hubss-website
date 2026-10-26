/**
 * The captions sheet's CSV (docs/site-audits/gallery-captions-2026-10-26.csv),
 * read and written the way Python's csv module writes it (minimal quoting,
 * "\n" line ends, the byte order mark kept in the first cell), so a rewrite
 * changes only the cells that changed. scripts/gen-image-facts.ts and
 * scripts/test-image-names.ts read it.
 */

/** Rows of raw cells, nothing trimmed. */
export function parseRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false; }
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

/** One object per row, keyed by the header, cells trimmed. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows = parseRows(text);
  const head = rows[0].map((h) => h.replace(/^﻿/, "").trim());
  return rows.slice(1).filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

/** The rows back as CSV: a cell is quoted only when it holds a comma, a quote or a line break. */
export function toCsv(rows: string[][]): string {
  const cell = (c: string) => (/[",\r\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c);
  return rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
}
