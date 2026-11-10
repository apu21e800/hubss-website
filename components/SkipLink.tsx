"use client";

/**
 * "Skip to content", the first thing the keyboard reaches on every page
 * (WCAG 2.4.1; the technical review of 17 Oct 2026 counted eight Tab stops
 * through the bar before the hero's button and fifty-one to the home page's
 * form).
 *
 * Until 10 Nov 2026 it moved the focus to the page's <main>, and the bar is
 * inside every page's <main> (it is sticky there), so the next Tab landed on
 * the logo: the link skipped nothing. Its address, #main, named an element no
 * page has, which is also why the accessibility checker flagged the link on
 * all 127 pages.
 *
 * Now it goes to the page's heading: the h1, which every page has and which
 * always comes after the bar. A screen reader reads the heading, and the next
 * Tab is the first control of the content. The address is #content, a mark
 * the bar leaves just after itself (components/sections/Nav.tsx), so the
 * link still jumps past the bar before the page's script has loaded, or on a
 * page whose heading can't be found.
 */
export default function SkipLink() {
  return (
    <a
      href="#content"
      className="skip-link"
      onClick={(e) => {
        const target =
          document.querySelector<HTMLElement>("main h1") ??
          document.querySelector<HTMLElement>("h1") ??
          document.getElementById("content");
        if (!target) return;
        e.preventDefault();
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        // It takes the focus to be read from, not to be used: no ring.
        target.style.outline = "none";
        // focus() brings it into view when it isn't (clear of the bar: html's
        // scroll-padding-top), and leaves the page alone when it is.
        target.focus();
      }}
    >
      Skip to content
    </a>
  );
}
