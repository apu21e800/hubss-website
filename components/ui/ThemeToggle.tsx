"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("hubss-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("hubss-theme", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle colour theme"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.375rem 0.875rem",
        borderRadius: "9999px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        color: "var(--text-secondary)",
        fontSize: "0.75rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "color 0.15s ease, background 0.15s ease, border-color 0.15s ease",
        letterSpacing: "0.02em",
      }}
    >
      {theme === "dark" ? "☀ Light" : "● Dark"}
    </button>
  );
}
