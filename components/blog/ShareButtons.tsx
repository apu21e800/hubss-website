"use client";

import { useState } from "react";
import { Linkedin, Facebook, Link2, Check } from "lucide-react";

function XIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ShareButtonsProps {
  url: string;
  title: string;
}

/**
 * The share row at the foot of an Insights post (28 Sep 2026).
 *
 * The sidebar used to carry a Share block (X, Facebook and a gradient "Copy
 * for Instagram" button) at the height where a reader decides whether to act.
 * Vern: "the social callout is not that great here." That slot is the Lunch &
 * Learn card now, and sharing moved here: after the last paragraph, quiet,
 * four icons. LinkedIn leads because that is where specifiers share; the
 * Instagram button went, since Instagram can't take a link and the button
 * only copied one. Each target is 44 px square.
 */
const btn =
  "inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors text-[var(--text-muted)] hover:text-[var(--accent-text)] hover:bg-[var(--ink-05)]";

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: <Linkedin size={17} aria-hidden="true" /> },
    { label: "X", href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, icon: <XIcon /> },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <Facebook size={17} aria-hidden="true" /> },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard (an insecure context, or permission refused): the
      // address bar still has the link.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
        Share this post
      </span>
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={handleCopy} aria-label={copied ? "Link copied" : "Copy link"} title={copied ? "Link copied" : "Copy link"} className={btn}>
          {copied ? <Check size={17} className="text-[var(--ok-text)]" aria-hidden="true" /> : <Link2 size={17} aria-hidden="true" />}
        </button>
        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.label}`}
            title={`Share on ${link.label}`}
            className={btn}
          >
            {link.icon}
          </a>
        ))}
        <span className="sr-only" aria-live="polite">{copied ? "Link copied" : ""}</span>
      </div>
    </div>
  );
}
