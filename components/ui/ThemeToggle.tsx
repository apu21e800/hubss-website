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
      aria-label="Toggle light theme"
      title="Toggle light theme"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 50,
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        color: "var(--text-faint)",
        fontSize: "0.875rem",
        cursor: "pointer",
        transition: "color 0.15s ease, border-color 0.15s ease",
        opacity: 0.5,
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
    >
      ☀
    </button>
  );
}
