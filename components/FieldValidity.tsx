"use client";

import { useEffect } from "react";

/**
 * A screen reader hears what the eye sees on a form field.
 *
 * app/globals.css rings a field the visitor filled wrongly as soon as they
 * leave it (`:user-invalid`); nothing told assistive technology (the 24 Oct
 * 2026 review: `aria-invalid` was never set). This mirrors that CSS state
 * into `aria-invalid` for every form on the site, from the document: a field
 * that fails its checks on blur, or on a submit the browser refuses, is
 * marked; the mark comes off the moment it is valid again. Fields outside a
 * form (the search box, the map's selects) have no constraints, so they are
 * never marked.
 */
type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function fieldOf(target: EventTarget | null): Field | null {
  const el = target as HTMLElement | null;
  if (!el || !(el instanceof HTMLElement)) return null;
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) return null;
  return el.form ? el : null;
}

function mark(el: Field) {
  if (el.checkValidity()) el.removeAttribute("aria-invalid");
  else el.setAttribute("aria-invalid", "true");
}

export default function FieldValidity() {
  useEffect(() => {
    const onBlur = (e: FocusEvent) => {
      const el = fieldOf(e.target);
      if (el) mark(el);
    };
    const onInvalid = (e: Event) => {
      const el = fieldOf(e.target);
      if (el) el.setAttribute("aria-invalid", "true");
    };
    const onInput = (e: Event) => {
      const el = fieldOf(e.target);
      // Only a field already marked is re-read while typing, so the mark
      // never appears mid-word; it only clears.
      if (el && el.getAttribute("aria-invalid") === "true" && el.checkValidity()) el.removeAttribute("aria-invalid");
    };
    document.addEventListener("focusout", onBlur, true);
    document.addEventListener("invalid", onInvalid, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("change", onInput, true);
    return () => {
      document.removeEventListener("focusout", onBlur, true);
      document.removeEventListener("invalid", onInvalid, true);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("change", onInput, true);
    };
  }, []);
  return null;
}
