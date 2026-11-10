/**
 * The pattern library's hero art (10 Nov 2026; Vern: "do something creative
 * with the pattern gallery hero space ... make a stencil to match one of the
 * drawings"). The Standard Herringbone template, drawn from its own sheet
 * (lib/stencil-herringbone.ts has the numbers): toward the text, the template
 * as it lies on the asphalt, steel with its shadow, three of the sheet's
 * dimensions marked in the accent; toward the corner, the surface it leaves,
 * the bricks in StreetBond Terra Cotta (lib/colours.ts, the EMA 2026 card),
 * each pressed in, the joints left as asphalt. The line between them follows
 * the bricks.
 *
 * On load the template draws itself in and the colour comes in from the
 * corner as the template lifts: once, under two seconds, CSS only. Reduced
 * motion shows the finished picture. A server component: the SVG is in the
 * HTML, no script, no request. The art is decorative (aria-hidden); its
 * caption says what it is and links to the drawing further down the page.
 *
 * The SVG covers its box (slice), centred: a narrow box loses a little of
 * both ends, a wide one a little of the top and bottom. Under xl
 * it is a band under the hero's text, dimensions off (at phone scale their
 * figures would be 6px); from xl it fills the hero's right half (the CSS).
 */
import type { CSSProperties } from "react";
import { herringbone, grain, BRICK_L, BRICK_W, STRIP, type Brick } from "@/lib/stencil-herringbone";

/** The view, in inches: about ten bricks across. */
const VW = 92;
const VH = 62;
/**
 * Coloured where x + TILT * y passes FRONT (inches), with a ragged band of
 * BAND either side where it is a brick-by-brick toss: the coating's edge, a
 * diagonal that leans the way the herringbone's staircases climb.
 */
const TILT = 0.35;
const FRONT = 60;
const BAND = 6;
/** StreetBond Terra Cotta, EMA 2026 card (lib/colours.ts). */
const TERRA_COTTA = [0xa0, 0x4a, 0x3a] as const;

const r2 = (n: number) => Math.round(n * 100) / 100;
const reach = (b: Brick) => b.x + b.w / 2 + TILT * (b.y + b.h / 2);

/** Terra Cotta, a touch lighter or darker brick to brick, as a coated surface reads. */
function tone(b: Brick): string {
  const t = (grain(b.key, 7) - 0.5) * 0.14;
  const c = TERRA_COTTA.map((v) => Math.round(t >= 0 ? v + (255 - v) * t : v * (1 + t)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function coloured(b: Brick): boolean {
  const r = reach(b);
  if (r > FRONT + BAND) return true;
  if (r < FRONT - BAND) return false;
  return grain(b.key, 3) < (r - (FRONT - BAND)) / (2 * BAND);
}

/** The brick nearest a point that the test accepts, for the dimensions. */
function nearest(bricks: Brick[], x: number, y: number, ok: (b: Brick) => boolean): Brick | undefined {
  let best: Brick | undefined;
  let d = Infinity;
  for (const b of bricks) {
    if (!ok(b)) continue;
    const dd = Math.hypot(b.x + b.w / 2 - x, b.y + b.h / 2 - y);
    if (dd < d) { d = dd; best = b; }
  }
  return best;
}

const CSS = `
.st-fig { position: relative; margin: 40px 0 0; }
.st-art { position: relative; height: 260px; pointer-events: none;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%), linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(90deg, transparent, #000 12%), linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent);
  mask-composite: intersect; }
.st-art svg { display: block; width: 100%; height: 100%; }
.st-cap { margin: 12px 16px 0; font-size: 12.5px; line-height: 1.5; color: var(--text-muted); }
.st-cap a { display: inline-flex; align-items: center; color: var(--text-secondary); text-decoration: underline; text-underline-offset: 2px; }
@media (pointer: coarse) { .st-cap a { min-height: 44px; } }
@media (min-width: 640px) { .st-art { height: 300px; } .st-cap { margin-inline: 24px; } }
@media (min-width: 1024px) { .st-art { height: 360px; } .st-cap { margin-inline: 32px; } }
/* From xl the art fills the hero's right half, from under the bar to the
   hero's foot, fading in from the middle so the text column stays clear. */
@media (min-width: 1280px) {
  .st-fig { position: absolute; top: var(--nav-h, 64px); bottom: 0; right: 0; left: calc(50% + 1.5rem); margin: 0; }
  .st-art { position: absolute; inset: 0; height: auto;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 26%), linear-gradient(180deg, transparent, #000 10%);
    mask-image: linear-gradient(90deg, transparent, #000 26%), linear-gradient(180deg, transparent, #000 10%); }
  .st-fig::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 110px; background: linear-gradient(rgba(16,16,16,0), rgba(16,16,16,0.9)); pointer-events: none; }
  .st-cap { position: absolute; z-index: 1; right: 28px; bottom: 18px; margin: 0; max-width: calc(100% - 56px); text-align: right; color: var(--text-secondary); text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
}
.st-steel { filter: drop-shadow(.22px .34px .18px rgba(0,0,0,.75)); }
.st-strip { fill: none; stroke: url(#st-steel); stroke-width: ${STRIP}; stroke-linejoin: round; stroke-dasharray: 1; animation: st-draw .7s var(--ease-out) var(--d) both; }
.st-strip.is-lifted { animation: st-draw .7s var(--ease-out) var(--d) both, st-lift .35s ease var(--c) forwards; }
.st-face { transform-box: fill-box; transform-origin: center; animation: st-coat .5s var(--ease-out) var(--c) both; }
.st-dim { animation: st-fade .6s ease 1.25s both; }
.st-dim line, .st-dim path { stroke: #F97316; stroke-width: .11; fill: none; }
.st-dim .st-arrow { fill: #F97316; stroke: none; }
.st-dim text { fill: #FB923C; font: 700 1.95px var(--font-inter), system-ui, sans-serif; letter-spacing: .03em; font-variant-numeric: tabular-nums; paint-order: stroke; stroke: #141312; stroke-width: .7px; stroke-linejoin: round; }
@keyframes st-draw { from { stroke-dashoffset: 1; opacity: 0; } 15% { opacity: 1; } to { stroke-dashoffset: 0; opacity: 1; } }
@keyframes st-lift { to { opacity: 0; } }
@keyframes st-coat { from { opacity: 0; transform: scale(.86); } to { opacity: 1; transform: none; } }
@keyframes st-fade { from { opacity: 0; } to { opacity: 1; } }
@media (max-width: 1279px) { .st-dim { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .st-strip, .st-face, .st-dim { animation: none; }
  .st-strip.is-lifted { display: none; }
}
`;

/** An arrowhead with its tip at (x, y), pointing along (dx, dy), as the sheet draws them. */
function arrow(x: number, y: number, dx: number, dy: number) {
  const len = 0.95, half = 0.34;
  const bx = x - dx * len, by = y - dy * len;
  const px = -dy * half, py = dx * half;
  return <path className="st-arrow" d={`M${r2(x)} ${r2(y)}L${r2(bx + px)} ${r2(by + py)}L${r2(bx - px)} ${r2(by - py)}Z`} />;
}

function Dimensions({ bricks }: { bricks: Brick[] }) {
  // Well inside the template side and clear of the box's edges.
  const ok = (b: Brick) => !coloured(b) && reach(b) < FRONT - BAND - 5 && b.x > 26 && b.y > 15 && b.y + b.h < VH - 14;
  const lying = nearest(bricks, 36, 22, (b) => !b.upright && ok(b));
  const upright = nearest(bricks, 31, 37, (b) => b.upright && ok(b) && (!lying || b.y > lying.y + 8));
  if (!lying || !upright) return null;

  const ly = lying.y - 2.4;
  const uy = upright.y + upright.h + 2.4;
  // The strip at the lying brick's right end: its middle, a leader up and right.
  const sx = lying.x + lying.w + STRIP / 2, sy = lying.y + lying.h * 0.7;
  return (
    <g className="st-dim">
      {/* 9.374: the lying brick's length, over it */}
      <line x1={r2(lying.x)} y1={r2(lying.y - 0.55)} x2={r2(lying.x)} y2={r2(ly - 0.75)} />
      <line x1={r2(lying.x + lying.w)} y1={r2(lying.y - 0.55)} x2={r2(lying.x + lying.w)} y2={r2(ly - 0.75)} />
      <line x1={r2(lying.x + 0.95)} y1={r2(ly)} x2={r2(lying.x + lying.w - 0.95)} y2={r2(ly)} />
      {arrow(lying.x, ly, -1, 0)}
      {arrow(lying.x + lying.w, ly, 1, 0)}
      <text x={r2(lying.x + lying.w / 2)} y={r2(ly - 1)} textAnchor="middle">{BRICK_L.toFixed(3)}</text>

      {/* 4.499: the upright brick's width, under it */}
      <line x1={r2(upright.x)} y1={r2(upright.y + upright.h + 0.55)} x2={r2(upright.x)} y2={r2(uy + 0.75)} />
      <line x1={r2(upright.x + upright.w)} y1={r2(upright.y + upright.h + 0.55)} x2={r2(upright.x + upright.w)} y2={r2(uy + 0.75)} />
      <line x1={r2(upright.x + 0.95)} y1={r2(uy)} x2={r2(upright.x + upright.w - 0.95)} y2={r2(uy)} />
      {arrow(upright.x, uy, -1, 0)}
      {arrow(upright.x + upright.w, uy, 1, 0)}
      <text x={r2(upright.x + upright.w / 2)} y={r2(uy + 2.6)} textAnchor="middle">{BRICK_W.toFixed(3)}</text>

      {/* .376: the strip itself, with a leader */}
      <path d={`M${r2(sx + 0.75)} ${r2(sy - 0.75)}L${r2(sx + 3.6)} ${r2(lying.y - 2.9)}H${r2(sx + 5.4)}`} />
      {arrow(sx, sy, -0.707, 0.707)}
      <text x={r2(sx + 5.8)} y={r2(lying.y - 2.25)}>{STRIP.toFixed(3).replace(/^0/, "")}</text>
    </g>
  );
}

export default function StencilHero({ className, style }: { className?: string; style?: CSSProperties }) {
  const bricks = herringbone(VW, VH, 0, { x: -1.6, y: -2.4 });
  const wet = bricks.filter(coloured);
  const dry = bricks.filter((b) => !coloured(b));
  const far = Math.max(...bricks.map(reach));
  // The template draws itself from the text's side; the colour comes from the far corner.
  const delay = (b: Brick) => 0.02 + (reach(b) / far) * 0.45 + grain(b.key, 1) * 0.06;
  const coat = (b: Brick) => 0.75 + ((far - reach(b)) / (far - FRONT + BAND)) * 0.6 + grain(b.key, 2) * 0.1;

  return (
    <figure className={`st-fig ${className ?? ""}`} style={style}>
      <style>{CSS}</style>
      <div className="st-art" aria-hidden="true">
      <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          {/* Light from the top left across the steel. */}
          <linearGradient id="st-steel" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VW} y2={VH}>
            <stop offset="0" stopColor="#eef1f4" />
            <stop offset=".45" stopColor="#b9c1ca" />
            <stop offset="1" stopColor="#7d8791" />
          </linearGradient>
          {/* Each brick pressed in: a lit top edge, a shadowed foot. */}
          <linearGradient id="st-press" x1="0" y1="0" x2=".35" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".12" />
            <stop offset=".3" stopColor="#fff" stopOpacity="0" />
            <stop offset=".75" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".22" />
          </linearGradient>
          <radialGradient id="st-light" cx=".72" cy=".3" r=".85">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".55" />
          </radialGradient>
        </defs>

        {/* Asphalt: the joints, and the faces under the template a shade lighter. */}
        <rect width={VW} height={VH} fill="#141312" />
        <g fill="#1b1a19">
          {dry.map((b) => <rect key={b.key} x={r2(b.x)} y={r2(b.y)} width={r2(b.w)} height={r2(b.h)} />)}
        </g>

        {/* The coloured surface: Terra Cotta faces, each pressed in. */}
        <g>
          {wet.map((b) => (
            <g key={b.key} className="st-face" style={{ "--c": `${coat(b).toFixed(2)}s` } as CSSProperties}>
              <rect x={r2(b.x)} y={r2(b.y)} width={r2(b.w)} height={r2(b.h)} rx={0.2} fill={tone(b)} />
              <rect x={r2(b.x)} y={r2(b.y)} width={r2(b.w)} height={r2(b.h)} rx={0.2} fill="url(#st-press)" />
            </g>
          ))}
        </g>

        {/* The template: one strip round every brick, centred on its joint, so
            neighbours share one strip, .376 wide, as on the sheet. */}
        <g className="st-steel">
          {bricks.map((b) => {
            const lifted = coloured(b);
            const vars: Record<string, string> = { "--d": `${delay(b).toFixed(2)}s` };
            if (lifted) vars["--c"] = `${coat(b).toFixed(2)}s`;
            return (
              <rect
                key={b.key}
                className={lifted ? "st-strip is-lifted" : "st-strip"}
                x={r2(b.x - STRIP / 2)} y={r2(b.y - STRIP / 2)} width={r2(b.w + STRIP)} height={r2(b.h + STRIP)} rx={0.32}
                pathLength={1}
                style={vars as CSSProperties}
              />
            );
          })}
        </g>

        {/* The light falls off toward the edges. */}
        <rect width={VW} height={VH} fill="url(#st-light)" />
        <Dimensions bricks={bricks} />
      </svg>
      </div>
      <figcaption className="st-cap">
        The Standard Herringbone template, finished in StreetBond Terra Cotta.{" "}
        <a href="#herringbone">See the drawing</a>
      </figcaption>
    </figure>
  );
}
