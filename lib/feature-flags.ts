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
 *   - On Vercel preview/development (VERCEL_ENV !== 'production'), default ON.
 *   - On Vercel production (or wherever VERCEL_ENV='production'), default OFF.
 *
 * `NEXT_PUBLIC_*` is required because some consumers are client components
 * (the Nav mega menu); Next.js inlines NEXT_PUBLIC_* at build time so the
 * value reaches the browser bundle.
 */
export function showCatalogue(): boolean {
  const explicit = readEnvFlag("NEXT_PUBLIC_SHOW_CATALOGUE");
  if (explicit !== null) return explicit;
  // Vercel sets VERCEL_ENV to 'production' | 'preview' | 'development'.
  // Anything other than 'production' is treated as a reviewer environment.
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV;
  return vercelEnv !== "production";
}
