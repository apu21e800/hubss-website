"use client";

/**
 * Theme switch — Dark · Mixed · Light.
 *
 * The site is themed with CSS custom properties (app/globals.css). This
 * control only sets `data-theme` on <html> and remembers the choice in
 * localStorage; the no-flash bootstrap in app/layout.tsx applies it before
 * first paint on the next load. `?theme=light` in any URL does the same and
 * persists, so a review link can drop someone straight into a mode.
 *
 *   dark   — the site as shipped
 *   mixed  — dark shell, the reading sections (catalogue spread, spec, FAQ,
 *            documents, About story) on paper. Doug: "add some white sections."
 *   light  — paper site; photo heroes, the footer and the Lunch & Learn band
 *            stay dark.
 */
import { useEffect, useState } from "react";
import { SITE_FLAGS } from "@/lib/site-flags";

export type ThemeMode = "dark" | "mixed" | "light";
export const THEME_KEY = "hubss-theme";
const MODES: { id: ThemeMode; label: string; title: string }[] = [
  { id: "dark",  label: "Dark",  title: "Dark — the original site" },
  { id: "mixed", label: "Mixed", title: "Mixed — dark shell, reading sections on paper (default)" },
  { id: "light", label: "Light", title: "Light — paper site, dark photo bands" },
];

export function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", mode);
  try { localStorage.setItem(THEME_KEY, mode); } catch { /* private mode */ }
}

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>("mixed");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") as ThemeMode | null;
    if (current === "dark" || current === "mixed" || current === "light") setMode(current);
  }, []);

  const choose = (m: ThemeMode) => { setMode(m); applyTheme(m); };

  // Gated here rather than at the call site so every place that renders the
  // switch is covered by the one flag. After the hooks, never before — an
  // early return above them would change hook order between renders.
  if (!SITE_FLAGS.showThemeToggle) return null;

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="inline-flex items-center rounded-full p-0.5"
      style={{ background: "var(--fill-subtle)", border: "1px solid var(--border-color)" }}
    >
      {MODES.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={m.title}
            onClick={() => choose(m.id)}
            className="rounded-full font-semibold transition-colors"
            style={{
              padding: compact ? "5px 9px" : "6px 12px",
              fontSize: compact ? 11 : 12,
              lineHeight: 1,
              minHeight: 28,
              background: active ? "var(--accent)" : "transparent",
              color: active ? "var(--on-accent)" : "var(--text-secondary)",
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
