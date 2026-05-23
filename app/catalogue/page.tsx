// Catalogue 2026 flipbook (preview-only, not in nav).
// Server component reads the v30 page manifest from disk so the viewer
// stays in sync with whatever the catalog build last produced.
import { promises as fs } from "node:fs";
import path from "node:path";
import Flipbook from "./Flipbook";

async function getPageManifest(): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "catalogue", "v30");
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => /^page-\d{3}\.webp$/.test(f))
      .sort()
      .map((f) => `/catalogue/v30/${f}`);
  } catch {
    return [];
  }
}

export default async function CataloguePage() {
  const pages = await getPageManifest();

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

  return <Flipbook pages={pages} />;
}
