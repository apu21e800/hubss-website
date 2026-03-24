"use client";
import { useEffect } from "react";

export default function CrispChat() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Guard against invalid Crisp ID — prevents red "Invalid website" badge
    const id = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!id || id === 'your_crisp_id_here' || id.trim() === '') return;

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = id;
    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);
  return null;
}
