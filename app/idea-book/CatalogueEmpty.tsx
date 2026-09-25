import Link from "next/link";

/**
 * What /catalogue shows when no pages have been rendered. Only reachable on a
 * checkout that has the code but not the images - the generator skips silently
 * when the master PDF is absent rather than failing the build.
 */
export default function CatalogueEmpty() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center" data-surface="dark">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: "#fb923c" }}>
          Idea Book
        </p>
        <p className="mt-3 text-lg" style={{ color: "rgba(255,255,255,0.9)" }}>
          The Idea Book&apos;s pages have not been rendered in this deployment.
        </p>
        <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          Run <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs">npm run gen:catalogue</code> on a
          machine holding the print master.
        </p>
        <Link href="/resources" className="mt-8 inline-block text-sm underline" style={{ color: "#fb923c" }}>
          Back to Resources
        </Link>
      </div>
    </main>
  );
}
