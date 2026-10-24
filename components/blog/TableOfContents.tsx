"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

/**
 * `collapsible`: the phone's copy (23 Oct 2026, phone QA: below 1024px an
 * article had no contents at all, only the laptop sidebar did). It folds
 * under "On this page" above the body, closed until tapped.
 */
export default function TableOfContents({ collapsible = false }: { collapsible?: boolean } = {}) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    requestAnimationFrame(() => {
      const container = document.querySelector("[data-blog-content]");
      if (!container) return;

      const h2s = container.querySelectorAll("h2");
      const items: TocItem[] = [];

      h2s.forEach((h2, i) => {
        if (!h2.id) {
          h2.id =
            h2.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `section-${i}`;
        }
        items.push({ id: h2.id, text: h2.textContent || "" });
      });

      setHeadings(items);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: "-80px 0px -60% 0px" }
      );

      h2s.forEach((h2) => observer.observe(h2));

      return () => observer.disconnect();
    });
  }, []);

  if (headings.length < 2) return null;

  const list = (
      <ul className="space-y-2 border-l border-[var(--ink-10)]">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(h.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`block pl-4 py-1 transition-all duration-200 border-l-2 -ml-px ${
                activeId === h.id
                  ? "border-orange-400 text-[var(--accent-text)] font-medium"
                  : "border-transparent text-[var(--text-body)] hover:text-[var(--text-primary)] hover:border-gray-500"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
  );

  if (collapsible) {
    return (
      <details className="faq rounded-xl" style={{ border: "1px solid var(--border-color)" }}>
        <summary
          className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-body)] [&::-webkit-details-marker]:hidden"
        >
          On this page
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </summary>
        <nav aria-label="Table of contents" className="px-4 pb-4 text-sm">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-body)] mb-4">
        On this page
      </p>
      {list}
    </nav>
  );
}
