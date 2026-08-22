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

function readEnvFlag(name: string): boolean | null {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return null;
  const v = raw.toLowerCase();
  if (TRUE_VALUES.has(v)) return true;
  if (FALSE_VALUES.has(v)) return false;
  return null;
}

/**
 * Catalogue surfaces (the /catalogue flipbook route, Resources feature
 * card, Products mega-menu entry) gated behind a single flag.
 *
 *   - Explicit NEXT_PUBLIC_SHOW_CATALOGUE wins, in every environment.
 *   - Otherwise: HIDDEN, everywhere — production AND previews.
 *
 * Previews used to auto-show the catalogue so reviewers could see it without
 * an env edit. That backfired: the v2 preview is watched on a second screen
 * and gets shown to people, and Vernon's instruction is that the catalogue
 * must not appear anywhere until it launches ("we will add that soon").
 * Hidden-by-default-everywhere means no surface can leak it; flipping it on
 * is one env var (NEXT_PUBLIC_SHOW_CATALOGUE=true) plus a redeploy, per
 * environment, when launch day comes.
 *
 * `NEXT_PUBLIC_*` is required because some consumers are client components
 * (the Nav mega menu); Next.js inlines NEXT_PUBLIC_* at build time so the
 * value reaches the browser bundle.
 */
export function showCatalogue(): boolean {
  const explicit = readEnvFlag("NEXT_PUBLIC_SHOW_CATALOGUE");
  if (explicit !== null) return explicit;
  return false;
}
