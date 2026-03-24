"use client";

import { useState } from "react";
import { Linkedin, Facebook, Youtube, Link2, Check } from "lucide-react";

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ShareButtonsProps {
  url: string;
  title: string;
}

const btnClass =
  "flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-gray-300 hover:text-orange-400 hover:border-orange-400/30 transition-all duration-200";

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: <Linkedin size={18} />,
    },
    {
      label: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=HUB_SS`,
      icon: <XIcon />,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook size={18} />,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCcHUWv8BTes_fZ9BC_ohBpw",
      icon: <Youtube size={18} />,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className={btnClass}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className={btnClass}
      >
        {copied ? (
          <Check size={18} className="text-green-400" />
        ) : (
          <Link2 size={18} />
        )}
      </button>
    </div>
  );
}
