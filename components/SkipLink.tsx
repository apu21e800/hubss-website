"use client";

/**
 * "Skip to content", the first thing the keyboard reaches on every page
 * (WCAG 2.4.1; the technical review of 17 Oct 2026 counted eight Tab stops
 * through the bar before the hero's button and fifty-one to the home page's
 * form). The pages render their own <main> without an id, so the link finds
 * the page's main itself and moves focus there.
 */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="skip-link"
      onClick={(e) => {
        const main = document.querySelector<HTMLElement>("main");
        if (!main) return;
        e.preventDefault();
        if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
        // Past the fixed bar, so the first content line is in view.
        const y = main.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
      }}
    >
      Skip to content
    </a>
  );
}
