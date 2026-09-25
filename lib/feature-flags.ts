/**
 * Feature flags — single source of truth for gated surfaces.
 *
 * Defaults are tuned so a missing env var means "hidden on production"
 * for in-progress work, but auto-on for Vercel preview deployments so
 * reviewers see the work-in-progress without an env edit each time.
 *
 * To turn ON in production: set `NEXT_PUBLIC_SHOW_CATALOGUE=true` in
 * Vercel → Project → Settings → Environment Variables (Production),
 * then redeploy. To turn OFF again: set to `false` (or remove the var)
 * and redeploy.
 */

const TRUE_VALUES = new Set(["1", "true", "on", "yes"]);
const FALSE_VALUES = new Set(["0", "false", "off", "no"]);

function parseFlag(raw: string | undefined): boolean | null {
  if (raw === undefined || raw === "") return null;
  const v = raw.toLowerCase();
  if (TRUE_VALUES.has(v)) return true;
  if (FALSE_VALUES.has(v)) return false;
  return null;
}

/**
 * Idea Book surfaces (the /idea-book reader, the Resources row, the homepage
 * band, the /products link) gated behind a single flag. The flag keeps its
 * old name: it is an env var, and renaming it would silently re-enable
 * nothing and disable everything.
 *
 *   - Explicit NEXT_PUBLIC_SHOW_CATALOGUE wins, in every environment.
 *   - Otherwise: VISIBLE.
 *
 * It was hidden-by-default-everywhere for most of 2026, because the catalogue
 * on the site was an unfinished viewer of the wrong edition and the v2 preview
 * gets shown to people on a second screen. The 2026-27 reader replaces it, so
 * the default flips: merging this to main is meant to put the catalogue live,
 * and a flag that defaults to off would make the merge look like it did
 * nothing.
 *
 * The override survives on purpose. If Doug wants it pulled, it is one env var
 * (NEXT_PUBLIC_SHOW_CATALOGUE=false) plus a redeploy - no revert, no code
 * change, and every surface goes at once.
 *
 * `NEXT_PUBLIC_*` is required because some consumers are client components
 * (the Nav mega menu); Next.js inlines NEXT_PUBLIC_* at build time so the
 * value reaches the browser bundle.
 */
export function showCatalogue(): boolean {
  // Read with the name written out in full, never as process.env[name].
  // Next inlines NEXT_PUBLIC_* into client bundles only for a literal
  // process.env.NEXT_PUBLIC_X; process.env[name] is undefined in the browser,
  // so the Nav (a client component) always saw "visible" and the kill switch
  // left its catalogue links pointing at a 404.
  const explicit = parseFlag(process.env.NEXT_PUBLIC_SHOW_CATALOGUE);
  if (explicit !== null) return explicit;
  return true;
}
