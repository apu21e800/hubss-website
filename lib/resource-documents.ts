// lib/resource-documents.ts
// Flat list of all downloadable resources for the /resources page.
// Derived from the canonical ALL_DOCS registry in lib/documents.ts.

import { ALL_DOCS, docTypeLabel, type DocType } from "./documents";

export interface ResourceDocument {
  label: string;
  href: string;
  type: DocType;
  typeLabel: string;
  productSlug: string;
  productLabel: string;
  lang?: string;
}

// Human-readable product names keyed by slug
const PRODUCT_LABELS: Record<string, string> = {
  "traffic-patterns-xd": "TrafficPatterns XD",
  "traffic-patterns":    "TrafficPatterns",
  "premark":             "PreMark",
  "duratherm":           "DuraTherm",
  "decomark":            "DecoMark",
  "airmark":             "AirMark",
  "streetbond":          "StreetBond",
  "streetbondsr":        "StreetBondSR",
  "mmax":                "MMAX",
  "durashield":          "DuraShield",
  "streetprint":         "StreetPrint",
};

// Build the flat list in product order
export const resourceDocuments: ResourceDocument[] = Object.entries(ALL_DOCS).flatMap(
  ([slug, docs]) =>
    docs.map((doc) => ({
      ...doc,
      typeLabel:    docTypeLabel[doc.type],
      productSlug:  slug,
      productLabel: PRODUCT_LABELS[slug] ?? slug,
    }))
);
