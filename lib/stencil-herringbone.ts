/**
 * The Standard Herringbone template as geometry, for the pattern library's
 * hero (components/patterns/StencilHero.tsx). No imports: it runs on the
 * server and in a test.
 *
 * Every number is the drawing's own (public/images/patterns/herringbone.png,
 * "Standard Herringbone", drawn 10/30/2024, dimensions in inches): a brick is
 * 9.374 by 4.499, the template's strip between two bricks is .376, so a brick
 * plus its strip is 9.750 by 4.875 and the long side is two short sides and a
 * strip (9.374 = 2 x 4.499 + .376), which is what lets a herringbone close.
 * The sheet's overall 117.376 by 58.876 is 24 by 12 of those 4.875 steps,
 * plus the outer strip.
 */

export const BRICK_L = 9.374;
export const BRICK_W = 4.499;
export const STRIP = 0.376;
/** One step of the herringbone: a brick's short side and its strip. */
export const STEP = BRICK_W + STRIP;

export interface Brick {
  /** Stable key: the unit's lattice indices and v (upright) or h (lying). */
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  upright: boolean;
}

/**
 * Every brick that touches the box [0, width] x [0, height], with `margin`
 * inches of overhang so a cropped view never shows a hole at its edge.
 *
 * The pattern is a lattice of L-shaped units: an upright brick at the unit's
 * corner and a lying brick one step to its right, along the top. The units
 * repeat one step down and right (the staircase in the drawing) and two steps
 * right and two up (the next staircase). That is the drawing's top-left
 * corner: upright at 0, lying from 4.875, the next upright 4.875 down.
 */
export function herringbone(width: number, height: number, margin = BRICK_L, shift = { x: 0, y: 0 }): Brick[] {
  const out: Brick[] = [];
  const n = Math.ceil((width + height) / STEP) + 6;
  for (let a = -n; a <= n; a++) {
    for (let b = -n; b <= n; b++) {
      const ox = STEP * (a + 2 * b) + shift.x;
      const oy = STEP * (a - 2 * b) + shift.y;
      const units: Brick[] = [
        { key: `${a}.${b}v`, x: ox, y: oy, w: BRICK_W, h: BRICK_L, upright: true },
        { key: `${a}.${b}h`, x: ox + STEP, y: oy, w: BRICK_L, h: BRICK_W, upright: false },
      ];
      for (const r of units) {
        if (r.x + r.w < -margin || r.x > width + margin) continue;
        if (r.y + r.h < -margin || r.y > height + margin) continue;
        out.push(r);
      }
    }
  }
  return out;
}

/** A repeatable number in [0, 1) for a brick: its tone and where the colour line falls. */
export function grain(key: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10007) / 10007;
}

/** True if two bricks overlap, which correct geometry never does (checked 10 Nov 2026: none, and no gaps, over 200 x 120 inches). */
export function overlaps(a: Brick, b: Brick): boolean {
  const e = 1e-6;
  return a.x < b.x + b.w - e && b.x < a.x + a.w - e && a.y < b.y + b.h - e && b.y < a.y + a.h - e;
}
