import { OFFICE_GUIDE, labelRuns, type OfficeGuideContent } from "../lib/office-guide";

/**
 * Doug's one-page guide (lib/office-guide.ts), set for a phone: one column,
 * each step numbered, its screenshot, what you do, what happens next. The
 * same component is the Studio's first item ("Start here",
 * sanity/structure.ts) and the page at /studio/guide, so it carries its own
 * inline styles and plain elements: it renders the same inside the Studio
 * and on the site, whose stylesheet is dark by default and gives headings
 * their family and weight. Ported from Square One's Studio (23 Oct 2026).
 * Relative imports only: sanity.config.ts reaches it through the structure.
 */

const INK = "#1F1F1F";
const MUTED = "#5B5B5B";
const RULE = "#E4E4E4";
/** The orange for text on white (--accent-text on light ground, app/globals.css). */
const ACCENT = "#B83E0B";

function Line({ text }: { text: string }) {
  return (
    <>
      {labelRuns(text).map((r, i) =>
        r.bold ? (
          <strong key={i} style={{ fontWeight: 700, color: INK }}>
            {r.text}
          </strong>
        ) : (
          <span key={i}>{r.text}</span>
        ),
      )}
    </>
  );
}

export default function OfficeGuide({ compact = false, guide = OFFICE_GUIDE }: { compact?: boolean; guide?: OfficeGuideContent }) {
  const g = guide;
  return (
    <article style={{ maxWidth: 680, margin: "0 auto", padding: compact ? "20px 20px 48px" : "40px 16px 72px", color: INK, fontSize: 17, lineHeight: 1.55 }}>
      <h1 style={{ fontSize: compact ? 24 : 32, lineHeight: 1.2, margin: "0 0 12px", fontWeight: 700, letterSpacing: "-0.01em", color: INK }}>{g.title}</h1>
      <p style={{ margin: "0 0 28px", color: MUTED }}>{g.lead}</p>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {g.steps.map((s, i) => (
          <li key={s.id} id={s.id} style={{ borderTop: `1px solid ${RULE}`, padding: "28px 0 8px" }}>
            <h2 style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: compact ? 20 : 24, lineHeight: 1.25, margin: "0 0 6px", fontWeight: 700, letterSpacing: "-0.01em", color: INK }}>
              <span aria-hidden="true" style={{ color: ACCENT, fontVariantNumeric: "tabular-nums" }}>
                {i + 1}
              </span>
              <span>{s.title}</span>
            </h2>
            <p style={{ margin: "0 0 16px", color: MUTED }}>{s.when}</p>
            {s.shot ? (
              // eslint-disable-next-line @next/next/no-img-element -- the same markup inside the Studio, where next/image has no loader
              <img
                src={s.shot.src}
                alt={s.shot.alt}
                width={s.shot.width}
                height={s.shot.height}
                loading="lazy"
                style={{ display: "block", width: "100%", maxWidth: 360, height: "auto", margin: "0 0 20px", border: `1px solid ${RULE}`, borderRadius: 10 }}
              />
            ) : null}
            <ol style={{ listStyle: "decimal", margin: "0 0 16px", paddingLeft: 22 }}>
              {s.steps.map((t, j) => (
                <li key={j} style={{ margin: "0 0 8px", paddingLeft: 4 }}>
                  <Line text={t} />
                </li>
              ))}
            </ol>
            <p style={{ margin: "0 0 6px", fontWeight: 700 }}>What happens next</p>
            <ul style={{ listStyle: "disc", margin: "0 0 16px", paddingLeft: 22 }}>
              {s.next.map((t, j) => (
                <li key={j} style={{ margin: "0 0 8px", paddingLeft: 4 }}>
                  <Line text={t} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p style={{ borderTop: `1px solid ${RULE}`, paddingTop: 20, margin: "12px 0 0", color: MUTED }}>{g.foot}</p>
    </article>
  );
}
