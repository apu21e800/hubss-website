"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

export default function TableOfContents() {
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

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-4">
        On this page
      </p>
      <ul className="space-y-2 border-l border-white/10">
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
                  ? "border-orange-400 text-orange-400 font-medium"
                  : "border-transparent text-gray-300 hover:text-white hover:border-gray-500"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
