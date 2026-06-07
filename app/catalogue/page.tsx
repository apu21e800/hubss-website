// Catalogue 2026 flipbook (featured on Resources).
// Server component auto-discovers the newest v{NN}/ page manifest, so the
// viewer always serves whatever the catalog build last produced. Vernon
// re-renders via scripts/render-catalogue-pages.py — that script also
// auto-detects the latest vNN PDF, so the pair stays self-syncing.
import { promises as fs } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Flipbook from "./Flipbook";
import { showCatalogue } from "@/lib/feature-flags";

// Evaluate the feature flag at request time, not build time, so flipping the
// flag in Vercel env vars doesn't require a rebuild. The page itself is
// light (manifest read + Flipbook), so dynamic rendering costs nothing.
// Note: the primary gate is middleware.ts (returns HTTP 307 → /resources);
// this page-level notFound() is defense-in-depth in case middleware misses.
export const dynamic = "force-dynamic";

const VERSION_RE = /^v(\d+)$/;
const PAGE_RE    = /^page-\d{3}\.webp$/;

async function getPageManifest(): Promise<{ pages: string[]; version: string | null; alt: string[] }> {
  const root = path.join(process.cwd(), "public", "catalogue");
  try {
    const dirs = await fs.readdir(root, { withFileTypes: true });
    const versions = dirs
      .filter((d) => d.isDirectory() && VERSION_RE.test(d.name))
      .map((d) => ({ name: d.name, n: parseInt(d.name.slice(1), 10) }))
      .sort((a, b) => b.n - a.n);
    for (const v of versions) {
      const versionDir = path.join(root, v.name);
      const files = (await fs.readdir(versionDir)).filter((f) => PAGE_RE.test(f)).sort();
      if (files.length > 0) {
        // Per-page descriptive alt text (accessibility + SEO). Generated from
        // the rendered PDF text layer alongside the page images. Optional —
        // falls back to a generic label per page if alt.json is absent.
        let alt: string[] = [];
        try {
          const raw = await fs.readFile(path.join(versionDir, "alt.json"), "utf8");
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) alt = parsed.map((s) => String(s));
        } catch {
          /* no alt.json for this version */
        }
        return { pages: files.map((f) => `/catalogue/${v.name}/${f}`), version: v.name, alt };
      }
    }
  } catch {
    /* fall through */
  }
  return { pages: [], version: null, alt: [] };
}

// Check that the web-sized download PDF actually exists before exposing the
// Download button — produced by scripts/build-catalogue-download-pdf.py.
async function downloadPdfHref(): Promise<string | undefined> {
  const rel = "/catalogue/HUBSS-Catalogue-2026.pdf";
  const abs = path.join(process.cwd(), "public", rel);
  try {
    await fs.access(abs);
    return rel;
  } catch {
    return undefined;
  }
}

export default async function CataloguePage() {
  // Defense-in-depth: middleware should have already redirected when the
  // flag is off. If it somehow didn't, render the 404 body so visitors
  // never see the catalogue.
  if (!showCatalogue()) notFound();

  const { pages, alt } = await getPageManifest();
  const downloadHref = await downloadPdfHref();

  if (pages.length === 0) {
    return (
      <main className="grid min-h-dvh place-items-center px-6 text-center text-white/80">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-orange-400">Catalogue</p>
          <p className="mt-3 text-lg">No catalogue pages have been rendered yet.</p>
          <p className="mt-2 text-sm text-white/50">
            Run <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs">python scripts/render-catalogue-pages.py</code>
          </p>
        </div>
      </main>
    );
  }

  return <Flipbook pages={pages} alt={alt} downloadHref={downloadHref} />;
}
