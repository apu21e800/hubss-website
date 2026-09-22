/**
 * Every page of the catalogue, with the alt text lifted from its own text
 * layer. Imported only by the reader routes - see the note in lib/catalogue.ts
 * about why this is a separate module.
 */
import manifest from "./catalogue-manifest.json";

export interface CataloguePage {
  /** 1-based page number, as printed. */
  n: number;
  /** Alt text, from the page's text layer where it has one. */
  alt: string;
}

const raw = manifest as { pages?: unknown };

export const cataloguePages: CataloguePage[] = Array.isArray(raw.pages)
  ? (raw.pages as CataloguePage[])
  : [];
