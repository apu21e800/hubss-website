'use client';

import { useState, useEffect } from 'react';

const PHRASES = [
  "The Street Is Your Canvas.",
  "Safety Starts at Street Level.",
  "Every Surface Tells a Story.",
  "Canada's Standard for Pavement That Performs.",
  "Built for Canadian Winters. Built to Last Decades.",
];

interface TypewriterHeadingProps {
  className?: string;
}

export function TypewriterHeading({ className = '' }: TypewriterHeadingProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIndex];

    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2800);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (displayed.length === 0) {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        return;
      }
      const timeout = setTimeout(() => {
        setDisplayed((d) => d.slice(0, -1));
      }, 28);
      return () => clearTimeout(timeout);
    }

    if (displayed.length < current.length) {
      const timeout = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length + 1));
      }, 52);
      return () => clearTimeout(timeout);
    }

    // Fully typed — pause before deleting
    setIsPaused(true);
  }, [displayed, isDeleting, isPaused, phraseIndex]);

  return (
    <span className={className}>
      {displayed}
      <span
        className="inline-block w-[3px] h-[0.85em] bg-orange-500 ml-1 align-middle animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
}
