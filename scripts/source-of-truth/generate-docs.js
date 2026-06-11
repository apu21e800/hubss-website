#!/usr/bin/env node
/**
 * HUBSS Product Source-of-Truth Document Generator
 *
 * Generates one .docx per product into product-source-of-truth/, plus an INDEX.
 * Data is held in ./product-data.js; this file is just the renderer.
 *
 * Run from repo root: `node scripts/source-of-truth/generate-docs.js`
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  LevelFormat, PageBreak, Footer, PageNumber, Header,
} = require("docx");

const products = require("./product-data.js");

// ── Constants ─────────────────────────────────────────────────────────────────
const ORANGE = "F97316";
const NEAR_BLACK = "0A0A0A";
const MUTED = "6B7280";
const LIGHT_BORDER = "D1D5DB";
const FLAG_BG = "FEF3C7"; // amber-100
const FLAG_BORDER = "F59E0B";

const PAGE = {
  width: 12240,      // US Letter
  height: 15840,
  margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }, // 0.75"
};
const CONTENT_WIDTH = PAGE.width - PAGE.margin.left - PAGE.margin.right; // 10080

const BORDER = { style: BorderStyle.SINGLE, size: 6, color: LIGHT_BORDER };
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

// ── Helpers ───────────────────────────────────────────────────────────────────

function rule(color = LIGHT_BORDER, size = 6) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size, color, space: 1 } },
  });
}

function eyebrow(text) {
  return new Paragraph({
    spacing: { before: 0, after: 60 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 16, // 8pt
        color: ORANGE,
        characterSpacing: 24,
      }),
    ],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 80, after: 200 },
    children: [new TextRun({ text, bold: true, size: 44, color: NEAR_BLACK })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, color: NEAR_BLACK })],
  });
}

function body(text, opts = {}) {
  const runs = Array.isArray(text)
    ? text
    : [new TextRun({ text, size: 22, color: "111827", ...opts })];
  return new Paragraph({
    spacing: { before: 0, after: 120, line: 300 },
    children: runs,
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 0, after: 80, line: 280 },
    children: [new TextRun({ text, size: 22, color: "111827" })],
  });
}

function bulletRich(runs) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 0, after: 80, line: 280 },
    children: runs,
  });
}

function muted(text) {
  return new Paragraph({
    spacing: { before: 0, after: 80, line: 280 },
    children: [new TextRun({ text, size: 18, color: MUTED, italics: true })],
  });
}

function flagBox(text) {
  // Single-cell table styled as a callout
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 8, color: FLAG_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: FLAG_BORDER },
      left:   { style: BorderStyle.SINGLE, size: 8, color: FLAG_BORDER },
      right:  { style: BorderStyle.SINGLE, size: 8, color: FLAG_BORDER },
      insideHorizontal: NO_BORDER,
      insideVertical: NO_BORDER,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            shading: { fill: FLAG_BG, type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 160, bottom: 160, left: 200, right: 200 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({
                    text: "[VERIFY] ",
                    bold: true,
                    size: 20,
                    color: "92400E",
                  }),
                  new TextRun({ text, size: 20, color: "78350F" }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function specRow(label, value, isLast = false) {
  const border = isLast
    ? NO_BORDER
    : { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" };
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 3200, type: WidthType.DXA },
        borders: { top: border, bottom: border, left: NO_BORDER, right: NO_BORDER },
        margins: { top: 120, bottom: 120, left: 0, right: 120 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, bold: true, size: 20, color: "374151" })],
          }),
        ],
      }),
      new TableCell({
        width: { size: CONTENT_WIDTH - 3200, type: WidthType.DXA },
        borders: { top: border, bottom: border, left: NO_BORDER, right: NO_BORDER },
        margins: { top: 120, bottom: 120, left: 120, right: 0 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: value, size: 22, color: "111827" })],
          }),
        ],
      }),
    ],
  });
}

function specTable(rows) {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [3200, CONTENT_WIDTH - 3200],
    borders: {
      top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows: rows.map(([label, value], idx) => specRow(label, value, idx === rows.length - 1)),
  });
}

function docRow(title, type, filename, isLast) {
  const border = isLast
    ? NO_BORDER
    : { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" };
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 4800, type: WidthType.DXA },
        borders: { top: border, bottom: border, left: NO_BORDER, right: NO_BORDER },
        margins: { top: 100, bottom: 100, left: 0, right: 120 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 21, color: "111827" })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 2000, type: WidthType.DXA },
        borders: { top: border, bottom: border, left: NO_BORDER, right: NO_BORDER },
        margins: { top: 100, bottom: 100, left: 0, right: 120 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: type, size: 18, color: ORANGE, bold: true })],
          }),
        ],
      }),
      new TableCell({
        width: { size: CONTENT_WIDTH - 4800 - 2000, type: WidthType.DXA },
        borders: { top: border, bottom: border, left: NO_BORDER, right: NO_BORDER },
        margins: { top: 100, bottom: 100, left: 0, right: 0 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: filename || "", size: 16, color: MUTED, italics: true })],
          }),
        ],
      }),
    ],
  });
}

function docTable(docs) {
  // Header row
  const header = new TableRow({
    tableHeader: true,
    children: [
      ["Document title", 4800],
      ["Type", 2000],
      ["File", CONTENT_WIDTH - 4800 - 2000],
    ].map(([text, w]) => new TableCell({
      width: { size: w, type: WidthType.DXA },
      shading: { fill: "F9FAFB", type: ShadingType.CLEAR, color: "auto" },
      borders: {
        top: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
        bottom: { style: BorderStyle.SINGLE, size: 8, color: "9CA3AF" },
      },
      margins: { top: 100, bottom: 100, left: 0, right: 120 },
      children: [new Paragraph({
        children: [new TextRun({ text, bold: true, size: 18, color: "374151", characterSpacing: 12 })],
      })],
    })),
  }); // eslint-disable-line

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [4800, 2000, CONTENT_WIDTH - 4800 - 2000],
    borders: {
      top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows: [
      header,
      ...docs.map((d, idx) => docRow(d.title, d.type, d.filename || "", idx === docs.length - 1)),
    ],
  });
}

// ── Per-product document ──────────────────────────────────────────────────────
function buildProductDoc(product) {
  const children = [];

  // Cover block
  children.push(eyebrow(product.eyebrow || "HUBSS Product"));
  children.push(h1(product.name));

  if (product.manufacturer) {
    children.push(new Paragraph({
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({ text: "Manufacturer: ", bold: true, size: 22, color: "374151" }),
        new TextRun({ text: product.manufacturer, size: 22, color: "111827" }),
      ],
    }));
  }

  children.push(rule(ORANGE, 12));
  children.push(new Paragraph({ spacing: { before: 80, after: 0 } }));

  // Doc purpose
  children.push(eyebrow("Purpose of this document"));
  children.push(body(
    "Source-of-truth reference for HUBSS website product copy. Replaces existing website descriptions that have been flagged as inaccurate or embellished. Doug Bain to review, correct, and sign off — every claim on the website must be supported by a fact listed in this document.",
  ));
  children.push(new Paragraph({ spacing: { before: 100, after: 0 } }));
  children.push(rule());

  // What it is
  children.push(h2("What it is"));
  (product.whatItIs || []).forEach(p => children.push(body(p)));

  // Key features
  if (product.keyFeatures && product.keyFeatures.length) {
    children.push(h2("Key features"));
    product.keyFeatures.forEach(f => children.push(bullet(f)));
  }

  // Tech specs
  if (product.specs && product.specs.length) {
    children.push(h2("Technical specifications"));
    children.push(specTable(product.specs));
  }

  // Colours
  if (product.colours) {
    children.push(h2("Colours / palette"));
    if (typeof product.colours === "string") {
      children.push(body(product.colours));
    } else {
      product.colours.forEach(c => children.push(bullet(c)));
    }
  }

  // Applications
  if (product.applications && product.applications.length) {
    children.push(h2("Applications & ideal use-cases"));
    product.applications.forEach(a => children.push(bullet(a)));
  }

  // Document library
  if (product.documents && product.documents.length) {
    children.push(h2("Document library"));
    children.push(body("Current document set for this product. Proposed clean titles below — fixes duplicate / generic naming on the current site."));
    children.push(new Paragraph({ spacing: { before: 80, after: 0 } }));
    children.push(docTable(product.documents));
  }

  // Source notes & verify
  children.push(h2("Source notes & [VERIFY] flags"));
  if (product.sources && product.sources.length) {
    children.push(eyebrow("Sources used"));
    product.sources.forEach(s => children.push(bullet(s)));
  }
  if (product.verifyFlags && product.verifyFlags.length) {
    children.push(new Paragraph({ spacing: { before: 120, after: 0 } }));
    children.push(eyebrow("Items requiring Doug's confirmation"));
    product.verifyFlags.forEach(v => {
      children.push(flagBox(v));
      children.push(new Paragraph({ spacing: { before: 60, after: 0 } }));
    });
  }
  if (product.discrepancies && product.discrepancies.length) {
    children.push(new Paragraph({ spacing: { before: 120, after: 0 } }));
    children.push(eyebrow("Current site copy flagged as inaccurate / embellished"));
    product.discrepancies.forEach(d => {
      children.push(flagBox(d));
      children.push(new Paragraph({ spacing: { before: 60, after: 0 } }));
    });
  }

  // Footer signoff
  children.push(new Paragraph({ spacing: { before: 320, after: 80 } }));
  children.push(rule());
  children.push(new Paragraph({
    spacing: { before: 200, after: 0 },
    children: [
      new TextRun({ text: "Approved for website use by: ", size: 20, color: "374151", bold: true }),
      new TextRun({ text: "______________________________   Date: ______________", size: 20, color: "374151" }),
    ],
  }));

  return makeDoc(children);
}

function makeDoc(children) {
  return new Document({
    creator: "Based Agency for HUB Surface Systems",
    title: "HUBSS Product Source of Truth",
    description: "Draft source-of-truth product reference for client sign-off.",
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 } },
      },
      paragraphStyles: [
        {
          id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 44, bold: true, font: "Calibri", color: NEAR_BLACK },
          paragraph: { spacing: { before: 80, after: 200 }, outlineLevel: 0 },
        },
        {
          id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Calibri", color: NEAR_BLACK },
          paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 1 },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [{
            level: 0, format: LevelFormat.BULLET, text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 480, hanging: 240 } } },
          }],
        },
      ],
    },
    sections: [{
      properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "HUBSS — Product Source of Truth (DRAFT) · ", size: 16, color: MUTED }),
              new TextRun({ text: "Page ", size: 16, color: MUTED }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED }),
              new TextRun({ text: " of ", size: 16, color: MUTED }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: MUTED }),
            ],
          })],
        }),
      },
      children,
    }],
  });
}

// ── Index document ────────────────────────────────────────────────────────────
function buildIndexDoc(products) {
  const children = [];

  children.push(eyebrow("DRAFT FOR CLIENT REVIEW"));
  children.push(h1("HUBSS — Product Source of Truth"));
  children.push(body([
    new TextRun({ text: "Prepared by Based Agency for Doug Bain (HUB Surface Systems East).", size: 22, color: "111827" }),
  ]));
  children.push(rule(ORANGE, 12));
  children.push(new Paragraph({ spacing: { before: 200, after: 0 } }));

  children.push(h2("What this is"));
  children.push(body("Per-product reference documents drafted from manufacturer PDFs (PPG / Ennis-Flint, GAF, and HUB-branded technical data sheets in /public/docs/) and manufacturer websites. The intent is to give Doug a clean, fact-checked sheet for each product that he can edit, correct, and approve. Once approved, these sheets become the authoritative source for product copy on hubss.com — replacing the current website language that was flagged as inaccurate or embellished."));

  children.push(h2("How to use these documents"));
  children.push(bullet("Read each product file. Make corrections in tracked changes or comments."));
  children.push(bullet("Pay particular attention to anything inside an amber [VERIFY] callout — those are facts the agency could not verify against a primary source."));
  children.push(bullet("Look at the \"Current site copy flagged as inaccurate / embellished\" section at the bottom of each file — agree, disagree, or rewrite."));
  children.push(bullet("Sign each document at the bottom. Once approved, Based Agency will update the website and lib/products.ts with the approved copy."));

  children.push(h2("Document set"));
  // Table of products
  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        ["#", 600],
        ["Product", 3600],
        ["File", 4200],
        ["Category", CONTENT_WIDTH - 600 - 3600 - 4200],
      ].map(([t, w]) => new TableCell({
        width: { size: w, type: WidthType.DXA },
        shading: { fill: "F9FAFB", type: ShadingType.CLEAR, color: "auto" },
        borders: {
          top: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
          bottom: { style: BorderStyle.SINGLE, size: 8, color: "9CA3AF" },
        },
        margins: { top: 100, bottom: 100, left: 0, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 18, color: "374151" })] })],
      })),
    }),
    ...products.map((p, idx) => {
      const isLast = idx === products.length - 1;
      const border = isLast ? NO_BORDER : { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" };
      const cells = [
        { text: String(idx + 1), w: 600 },
        { text: p.name, w: 3600, bold: true },
        { text: p.filename, w: 4200, mono: true },
        { text: p.eyebrow || "—", w: CONTENT_WIDTH - 600 - 3600 - 4200 },
      ].map(c => new TableCell({
        width: { size: c.w, type: WidthType.DXA },
        borders: { top: border, bottom: border, left: NO_BORDER, right: NO_BORDER },
        margins: { top: 100, bottom: 100, left: 0, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({
            text: c.text, size: 20, color: "111827", bold: !!c.bold,
            font: c.mono ? "Consolas" : undefined,
          })],
        })],
      }));
      return new TableRow({ children: cells });
    }),
  ];
  children.push(new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [600, 3600, 4200, CONTENT_WIDTH - 600 - 3600 - 4200],
    borders: {
      top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER,
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows,
  }));

  // Open questions across the line
  children.push(h2("Major [VERIFY] flags across the line"));
  children.push(body("Listed here are the cross-product questions Doug should answer first, since they affect multiple products at once:"));
  children.push(bullet("Manufacturer attribution: confirm current ownership of the StreetBond / Ennis-Flint product line (PPG vs. GAF) and whether HUBSS should attribute on the website."));
  children.push(bullet("Service life numbers: PDFs avoid stating multi-year life in absolute terms. Should the website cite specific years (e.g., \"7-year service life\"), or stay with relative claims (e.g., \"outlasts traffic paint\")?"));
  children.push(bullet("PPG/Ennis-Flint trademark display: should product names carry the ® mark on the website (e.g., StreetBond®, TrafficPatterns®)?"));
  children.push(bullet("ChipFill / AggreFill / Fast Patch DPR: no PDFs exist in /public/docs/ — confirm true manufacturer/source and whether HUBSS distributes them under its own brand or a partner brand."));
  children.push(bullet("Document library: current site has multiple files labeled simply \"Specification\" with no differentiator. Clean titles proposed in each document — confirm the proposed naming."));

  // Sign-off
  children.push(new Paragraph({ spacing: { before: 400, after: 80 } }));
  children.push(rule());
  children.push(new Paragraph({
    spacing: { before: 200, after: 0 },
    children: [
      new TextRun({ text: "Reviewed and approved by: ", size: 20, color: "374151", bold: true }),
      new TextRun({ text: "______________________________   Date: ______________", size: 20, color: "374151" }),
    ],
  }));

  return makeDoc(children);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const outDir = path.resolve(__dirname, "..", "..", "product-source-of-truth");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Output dir: ${outDir}`);

  for (const p of products) {
    const doc = buildProductDoc(p);
    const buf = await Packer.toBuffer(doc);
    const file = path.join(outDir, p.filename);
    fs.writeFileSync(file, buf);
    console.log(`  wrote ${p.filename}`);
  }

  const indexDoc = buildIndexDoc(products);
  const indexBuf = await Packer.toBuffer(indexDoc);
  const indexFile = path.join(outDir, "00-INDEX-HUBSS-Product-Source-of-Truth.docx");
  fs.writeFileSync(indexFile, indexBuf);
  console.log(`  wrote 00-INDEX-HUBSS-Product-Source-of-Truth.docx`);

  console.log(`\nDone. ${products.length} product docs + 1 index.`);
}

main().catch(err => { console.error(err); process.exit(1); });
