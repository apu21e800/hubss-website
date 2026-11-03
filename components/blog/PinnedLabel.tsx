/**
 * The small "Pinned" label on the post Studio's "Pin to top" puts first
 * (3 Nov 2026): the lead story on /blog and the homepage blog section's
 * featured card. A label, not a control: no box, the accent ink, a pin mark.
 */
export default function PinnedLabel({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.16em] ${className}`}
      style={{ color: "var(--accent-text-lg)" }}
    >
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
        <path d="M14.6 2.6a1 1 0 0 1 1.4 0l5.4 5.4a1 1 0 0 1 0 1.4l-1.2 1.2a1 1 0 0 1-1 .25l-1.3-.36-3 3 .55 3.3a1 1 0 0 1-.28.87l-1 1a1 1 0 0 1-1.4 0L9 15.4l-4.3 4.3a1 1 0 1 1-1.4-1.4L7.6 14 4.3 10.7a1 1 0 0 1 0-1.4l1-1a1 1 0 0 1 .87-.28l3.3.55 3-3-.36-1.3a1 1 0 0 1 .25-1z" />
      </svg>
      Pinned
    </span>
  );
}
