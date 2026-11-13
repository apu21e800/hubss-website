"use client";

/**
 * The Blue / Grey switch (13 Nov 2026).
 *
 * Vernon: "let's be able to toggle between a blue and grey theme." The two
 * looks are in app/globals.css (The two looks). This control only sets
 * data-tone on <html> and remembers the choice in localStorage; the bootstrap
 * in app/layout.tsx applies it before first paint on the next page, and
 * ?tone=blue or ?tone=grey in any address does the same and sticks.
 *
 * It is a review control, like the Dark, Mixed, Light switch before it
 * (lib/site-flags.ts: that one shipped to the public by mistake on 21 Sep).
 * app/layout.tsx mounts this one on the keyed preview only, never on
 * hubss.com. When one look is chosen: make it the default in the bootstrap
 * and on <html>, and take the switch out.
 *
 * Its own colours are fixed, not the site's tokens: it has to read the same
 * in both looks and over any section, and it is not part of the site, so it
 * is not orange. Bottom left: the chat sits bottom right and Vercel's
 * toolbar in the middle.
 */
import { useEffect, useState } from "react";

export type Tone = "blue" | "grey";
export const TONE_KEY = "hubss-tone";

/** The phone browser's own chrome takes the bar's colour. */
const BAR_COLOUR: Record<Tone, string> = { blue: "#070b12", grey: "#20201f" };
const LOOKS: { id: Tone; label: string; title: string }[] = [
  { id: "blue", label: "Blue", title: "Blue: the bar, the menus and the photo heroes in blue-black" },
  { id: "grey", label: "Grey", title: "Grey: HUB's charcoal throughout" },
];

function paintBrowserChrome(tone: Tone) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BAR_COLOUR[tone]);
}

export function applyTone(tone: Tone) {
  document.documentElement.setAttribute("data-tone", tone);
  try { localStorage.setItem(TONE_KEY, tone); } catch { /* private mode */ }
  paintBrowserChrome(tone);
}

export default function ToneSwitch() {
  const [tone, setTone] = useState<Tone>("blue");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-tone");
    if (current === "blue" || current === "grey") {
      setTone(current);
      paintBrowserChrome(current);
    }
  }, []);

  const choose = (t: Tone) => { setTone(t); applyTone(t); };

  return (
    <div
      role="group"
      aria-label="Colour look, for review"
      data-tone-switch
      className="fixed bottom-3 left-3 z-[45] flex items-center gap-1 rounded-full p-1 print:hidden"
      style={{
        background: "rgba(18,18,17,0.92)",
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <span
        className="pl-3 pr-1 text-[11px] font-semibold uppercase"
        style={{ color: "rgba(255,255,255,0.62)", letterSpacing: "0.14em" }}
      >
        Look
      </span>
      {LOOKS.map((l) => {
        const active = l.id === tone;
        return (
          <button
            key={l.id}
            type="button"
            aria-pressed={active}
            title={l.title}
            onClick={() => choose(l.id)}
            className="rounded-full px-4 text-[13px] font-semibold"
            style={{
              // 44px: the site's own floor for anything a finger presses.
              minHeight: 44,
              minWidth: 60,
              background: active ? "#F5F0EB" : "transparent",
              color: active ? "#1B1B1A" : "rgba(255,255,255,0.86)",
              transition: "background-color 160ms, color 160ms",
            }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
