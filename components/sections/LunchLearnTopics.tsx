"use client";

/**
 * The session topics on /lunch-learn: six photo tiles, one per kind of work,
 * each with a "Book this topic" that puts the topic into the booking form's
 * chip (setLunchLearnTopic in LunchLearnV2.tsx) and scrolls to the form.
 *
 * Ported 2 Oct 2026 from session B's Lunch & Learn page ("Session topics /
 * Pick the work you're planning"), into A's LunchLearnFunnel in place of the
 * 2x2 audience text block (the lead's merge decision). A client component on
 * its own, so the funnel around it stays server-rendered.
 *
 * The topic strings are the ones the application pages send
 * (lunchLearnHref(topic, "application") in app/applications/[slug]/page.tsx:
 * the name inside a sentence, and the hand-written "airfield re-marking" for
 * Airports), so the chip and the request email read the same whichever way
 * the visitor arrived. The photos are those applications' hero photos on
 * Sanity's CDN, through PhotoImage's Sanity loader: never /_next/image.
 */

import PhotoImage from "@/components/ui/PhotoImage";
import { setLunchLearnTopic } from "@/components/sections/LunchLearnV2";

export interface LunchLearnTopic {
  label: string;
  topic: string;
  src: string;
  /** Where the subject sits in the 4:3 tile. */
  position?: string;
}

export const LL_TOPICS: LunchLearnTopic[] = [
  {
    label: "Crosswalks",
    topic: "crosswalks",
    // TrafficPatternsXD crosswalk in alternating red and pale brick-pattern bands at a bus terminal
    src: "https://cdn.sanity.io/images/9dbro2m1/production/36497374754a6f6c1668e66b8f8c143c0411fd67-2400x1800.jpg",
  },
  {
    label: "Bus lanes",
    topic: "bus lanes",
    // Blue articulated rapid-transit bus on a red bus-only lane at an intersection
    src: "https://cdn.sanity.io/images/9dbro2m1/production/4fd7f6cd4287218afc39d6529b4a3de805e432eb-2400x1800.jpg",
  },
  {
    label: "Bike lanes",
    topic: "bike lanes",
    // Green bike box with a white bicycle symbol and turn arrows at an intersection
    src: "https://cdn.sanity.io/images/9dbro2m1/production/f8f17e6758e0bf6c3ad25a0ca3b42a6f058743b6-2400x1350.jpg",
    position: "50% 58%",
  },
  {
    label: "Parks & paths",
    topic: "parks & paths",
    // Waterside multi-use path with white direction arrows and a curving centre line
    src: "https://cdn.sanity.io/images/9dbro2m1/production/e6b1c9845699e4e453e1800a8748592281ce6346-2400x1350.jpg",
  },
  {
    label: "Public art",
    topic: "public art",
    // Pavement artwork of green roots and a blue water drop across a street-corner plaza
    src: "https://cdn.sanity.io/images/9dbro2m1/production/160c5daf2482b37a41234bde5efb39732cdfabd4-2400x1800.jpg",
    position: "50% 78%",
  },
  {
    label: "Airports",
    topic: "airfield re-marking",
    // Red octagon marking with white aircraft symbols on an airport apron
    src: "https://cdn.sanity.io/images/9dbro2m1/production/1facb1e93a16bf687b28a9744c3650d03a28ee28-2016x1512.jpg",
    position: "50% 62%",
  },
];

/** Scroll to the form and put the cursor in its first field, gently unless the visitor asked for no motion. */
function goToForm() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const book = document.getElementById("book");
  book?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => {
    book?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
  }, reduce ? 0 : 500);
}

export default function LunchLearnTopics({ topics = LL_TOPICS }: { topics?: LunchLearnTopic[] }) {
  const pick = (t: LunchLearnTopic) => {
    setLunchLearnTopic(t.topic);
    goToForm();
  };
  return (
    <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
      {topics.map((t) => (
        <li key={t.topic}>
          <button
            type="button"
            onClick={() => pick(t)}
            aria-label={`Book a session on ${t.topic}`}
            className="group relative block w-full overflow-hidden rounded-xl text-left focus-visible:outline-offset-4"
            style={{ aspectRatio: "4 / 3", background: "var(--bg-card-surface)" }}
          >
            <PhotoImage
              src={t.src}
              alt=""
              fill
              sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, 48vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ objectPosition: t.position ?? "50% 50%" }}
            />
            <span aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(12,12,12,0.86) 0%, rgba(12,12,12,0.34) 42%, rgba(12,12,12,0) 68%)" }} />
            <span className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-4 flex items-end justify-between gap-3">
              <span className="font-bold text-[15px] sm:text-[19px] leading-tight" style={{ color: "#FFFFFF" }}>{t.label}</span>
              <span className="hidden sm:inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors group-hover:bg-[#F97316]" style={{ color: "#FFFFFF", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)" }}>
                Book this topic
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
                </svg>
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
