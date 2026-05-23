"""TRUE single-line generator for the 8 stamped-asphalt patterns.

THE BUG IN v3's .line VARIANT
  Each brick was drawn as a stroked <rect>. With JOINT=4 between bricks, the
  right edge of brick A (x=40) and left edge of brick B (x=44) render as TWO
  parallel lines 4px apart at every joint -> "double line" look.

THE FIX
  Expand each brick body by JOINT/2 (=2) in all directions BEFORE extracting
  edges. Adjacent expanded bricks now share their joint-centerline edges
  exactly. Then dedupe coincident edges with a canonical-form set so each
  joint is emitted ONCE as a single <line>.

VARIANTS PRODUCED (per pattern)
  .single-line   crisp white-ish lines, no bg          - true single line, drop-in
  .blueprint     light-blue lines on deep navy bg      - light-on-dark architectural
  .draft         dark-navy lines on cream bg           - light-bg architectural
"""
import math
import os
import sys

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(OUT_DIR)


# ── Geometry helpers ───────────────────────────────────────────────────────
def axis_corners(x, y, w, h, expand=0):
    """4 corners (TL, TR, BR, BL) of an axis-aligned brick expanded by `expand`."""
    return [
        (x - expand,     y - expand),
        (x + w + expand, y - expand),
        (x + w + expand, y + h + expand),
        (x - expand,     y + h + expand),
    ]


def rotated_corners(cx, cy, w, h, angle_deg, expand=0):
    """4 corners of a brick whose CENTER is at (cx, cy), local axis-aligned, then
    rotated by angle_deg around that center. `expand` enlarges in local frame."""
    a = math.radians(angle_deg)
    cos_a, sin_a = math.cos(a), math.sin(a)
    hw = w / 2 + expand
    hh = h / 2 + expand
    local = [(-hw, -hh), (hw, -hh), (hw, hh), (-hw, hh)]
    return [(cx + lx * cos_a - ly * sin_a,
             cy + lx * sin_a + ly * cos_a) for lx, ly in local]


def edges_of(corners):
    """Polygon -> list of 4 edge segments (point pairs)."""
    n = len(corners)
    return [(corners[i], corners[(i + 1) % n]) for i in range(n)]


def canon(p1, p2, precision=3):
    """Canonical hashable form so dedup treats (A->B) and (B->A) as the same edge."""
    a = (round(p1[0], precision), round(p1[1], precision))
    b = (round(p2[0], precision), round(p2[1], precision))
    return (a, b) if a <= b else (b, a)


def merge_collinear(edges, precision=3, gap_tol=0.05):
    """Group edges onto their containing line, then merge any overlapping or
    abutting collinear sub-segments into one continuous segment.
    Handles axis-aligned and 45-degree diagonal segments (which is all that
    appears in these patterns). General-oblique edges pass through unchanged."""
    by_line = {}      # line_id -> list of (t_start, t_end) parameter intervals
    passthrough = []  # edges we can't categorize

    for (p1, p2) in edges:
        x1, y1 = p1
        x2, y2 = p2
        dx = x2 - x1
        dy = y2 - y1
        if abs(dx) < 1e-3 and abs(dy) < 1e-3:
            continue  # degenerate
        if abs(dx) < 1e-3:                  # vertical
            line_id = ('v', round(x1, precision))
            t1, t2 = y1, y2
        elif abs(dy) < 1e-3:                # horizontal
            line_id = ('h', round(y1, precision))
            t1, t2 = x1, x2
        elif abs(dx - dy) < 1e-3:           # slope +1 ( y = x + c )
            line_id = ('d+', round(y1 - x1, precision))
            t1, t2 = x1, x2
        elif abs(dx + dy) < 1e-3:           # slope -1 ( y = -x + c )
            line_id = ('d-', round(y1 + x1, precision))
            t1, t2 = x1, x2
        else:
            passthrough.append((p1, p2))
            continue
        if t1 > t2:
            t1, t2 = t2, t1
        by_line.setdefault(line_id, []).append((t1, t2))

    merged = list(passthrough)
    for line_id, segs in by_line.items():
        segs.sort()
        cur = list(segs[0])
        out = []
        for s, e in segs[1:]:
            if s <= cur[1] + gap_tol:
                cur[1] = max(cur[1], e)
            else:
                out.append(tuple(cur))
                cur = [s, e]
        out.append(tuple(cur))
        kind, k = line_id
        for s, e in out:
            if kind == 'h':
                merged.append(((s, k), (e, k)))
            elif kind == 'v':
                merged.append(((k, s), (k, e)))
            elif kind == 'd+':                  # y = x + k
                merged.append(((s, s + k), (e, e + k)))
            elif kind == 'd-':                  # y = -x + k
                merged.append(((s, -s + k), (e, -e + k)))
    return merged


# ── Pattern brick lists ────────────────────────────────────────────────────
# Each pattern function returns (bricks, tile_w, tile_h) where bricks is a list
# of axis-aligned brick rects (x, y, w, h). For diagonal-herringbone (rotated)
# we directly return polygons instead.

SHORT, LONG, JOINT = 40, 84, 4
STEP = SHORT + JOINT           # 44
TILE = STEP * 4                # 176


def standard_herringbone(expand):
    bricks = []
    for i in range(-2, 7):
        for j in range(-2, 3):
            x_v = i * STEP
            y_v = i * STEP + 4 * j * STEP
            bricks.append(axis_corners(x_v, y_v, SHORT, LONG, expand))
            x_h = i * STEP
            y_h = i * STEP + 4 * j * STEP + 3 * STEP
            bricks.append(axis_corners(x_h, y_h, LONG, SHORT, expand))
    return bricks, TILE, TILE


def diagonal_herringbone(expand):
    """Standard herringbone rotated 45 deg around origin."""
    TILE_D = TILE * math.sqrt(2)
    COS, SIN = math.cos(math.radians(45)), math.sin(math.radians(45))
    bricks = []
    for i in range(-4, 10):
        for j in range(-4, 5):
            # VERT center in std-h space, then rotate around origin
            x_v_c = i * STEP + SHORT / 2
            y_v_c = i * STEP + 4 * j * STEP + LONG / 2
            local = [(x_v_c - SHORT/2 - expand, y_v_c - LONG/2 - expand),
                     (x_v_c + SHORT/2 + expand, y_v_c - LONG/2 - expand),
                     (x_v_c + SHORT/2 + expand, y_v_c + LONG/2 + expand),
                     (x_v_c - SHORT/2 - expand, y_v_c + LONG/2 + expand)]
            bricks.append([(c[0]*COS - c[1]*SIN, c[0]*SIN + c[1]*COS) for c in local])
            # HORIZ center
            x_h_c = i * STEP + LONG / 2
            y_h_c = i * STEP + 4 * j * STEP + 3 * STEP + SHORT / 2
            local = [(x_h_c - LONG/2 - expand, y_h_c - SHORT/2 - expand),
                     (x_h_c + LONG/2 + expand, y_h_c - SHORT/2 - expand),
                     (x_h_c + LONG/2 + expand, y_h_c + SHORT/2 + expand),
                     (x_h_c - LONG/2 - expand, y_h_c + SHORT/2 + expand)]
            bricks.append([(c[0]*COS - c[1]*SIN, c[0]*SIN + c[1]*COS) for c in local])
    return bricks, TILE_D, TILE_D


def british_cobble(expand):
    """Basket weave from British Cobble PDF — pairs of bricks in alternating orientation."""
    BW_TILE = 2 * (LONG + JOINT)        # 176
    S_BW = LONG + JOINT                 # 88
    bricks = []
    for tx in range(-1, 3):
        for ty in range(-1, 3):
            base_x, base_y = tx * BW_TILE, ty * BW_TILE
            for i, j in [(0, 0), (1, 0), (0, 1), (1, 1)]:
                x0 = base_x + i * S_BW
                y0 = base_y + j * S_BW
                vertical = ((i + j) % 2 == 0)
                if vertical:
                    bricks.append(axis_corners(x0, y0, SHORT, LONG, expand))
                    bricks.append(axis_corners(x0 + SHORT + JOINT, y0, SHORT, LONG, expand))
                else:
                    bricks.append(axis_corners(x0, y0, LONG, SHORT, expand))
                    bricks.append(axis_corners(x0, y0 + SHORT + JOINT, LONG, SHORT, expand))
    return bricks, BW_TILE, BW_TILE


def offset_brick(expand):
    RB_W, RB_H = 44, 64
    RB_TW = RB_W + JOINT
    RB_TH = 2 * (RB_H + JOINT)
    HALF = (RB_W + JOINT) // 2
    bricks = []
    for tx in range(-1, 4):
        for ty in range(-1, 4):
            bx, by = tx * RB_TW, ty * RB_TH
            bricks.append(axis_corners(bx, by, RB_W, RB_H, expand))
            bricks.append(axis_corners(bx - HALF, by + RB_H + JOINT, RB_W, RB_H, expand))
            bricks.append(axis_corners(bx + RB_TW - HALF, by + RB_H + JOINT, RB_W, RB_H, expand))
    return bricks, RB_TW, RB_TH


def six_in_tiles(expand):
    SQ_6 = 60
    T6 = SQ_6 + JOINT
    bricks = []
    for tx in range(-1, 4):
        for ty in range(-1, 4):
            bricks.append(axis_corners(tx * T6, ty * T6, SQ_6, SQ_6, expand))
    return bricks, T6, T6


def eight_in_offset_tile(expand):
    SQ_8 = 80
    OT_TW = SQ_8 + JOINT
    OT_TH = 2 * (SQ_8 + JOINT)
    OT_HALF = (SQ_8 + JOINT) // 2
    bricks = []
    for tx in range(-1, 4):
        for ty in range(-1, 4):
            bx, by = tx * OT_TW, ty * OT_TH
            bricks.append(axis_corners(bx, by, SQ_8, SQ_8, expand))
            bricks.append(axis_corners(bx - OT_HALF, by + SQ_8 + JOINT, SQ_8, SQ_8, expand))
            bricks.append(axis_corners(bx + OT_TW - OT_HALF, by + SQ_8 + JOINT, SQ_8, SQ_8, expand))
    return bricks, OT_TW, OT_TH


def texas_cobble(expand):
    """Small stamped square cobbles. We DROP the inner inset (the stamp groove)
    in line variants - line drawings represent joints, not stamp decoration."""
    TC_SQ = 40
    TC_TILE = TC_SQ + JOINT
    bricks = []
    for tx in range(-1, 5):
        for ty in range(-1, 5):
            bricks.append(axis_corners(tx * TC_TILE, ty * TC_TILE, TC_SQ, TC_SQ, expand))
    return bricks, TC_TILE, TC_TILE


def ashlar_slate(expand):
    """Random ashlar — stones already butt-touch in the source data (JOINT=0)."""
    AS_W, AS_H = 200, 120
    stones = [
        (0,   0,   80, 44),
        (80,  0,   60, 28),
        (140, 0,   60, 28),
        (80,  28,  40, 44),
        (120, 28,  44, 20),
        (164, 28,  36, 44),
        (120, 48,  44, 24),
        (0,   44,  44, 32),
        (44,  44,  36, 32),
        (0,   76,  60, 44),
        (60,  72,  48, 48),
        (108, 72,  56, 24),
        (108, 96,  56, 24),
        (164, 72,  36, 48),
        (80,  72,  28, 20),
        (80,  92,  28, 28),
    ]
    bricks = []
    # Tile the stones across an extended range so seams continue
    for tx in range(-1, 3):
        for ty in range(-1, 3):
            for x, y, w, h in stones:
                bricks.append(axis_corners(x + tx * AS_W, y + ty * AS_H, w, h, 0))
    return bricks, AS_W, AS_H


# ── Dedupe-and-emit ────────────────────────────────────────────────────────
def bricks_to_edges(bricks):
    """Convert a list of brick polygons into a deduped, collinear-merged list of
    line segments. Each segment is emitted exactly once."""
    raw = set()
    for corners in bricks:
        for e in edges_of(corners):
            raw.add(canon(*e))
    merged = merge_collinear(raw)
    return merged


def emit_svg(filename, tile_w, tile_h, edges, stroke_color, stroke_width, bg_color=None):
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{tile_w}" height="{tile_h}" '
             f'viewBox="0 0 {tile_w} {tile_h}" shape-rendering="geometricPrecision">']
    if bg_color is not None:
        parts.append(f'<rect width="{tile_w}" height="{tile_h}" fill="{bg_color}"/>')
    # Sort edges for deterministic output. Mixed tuples are fine since we already
    # canonicalized each edge's endpoint ordering above.
    for (p1, p2) in sorted(edges, key=lambda e: (e[0][0], e[0][1], e[1][0], e[1][1])):
        parts.append(
            f'<line x1="{p1[0]:.3f}" y1="{p1[1]:.3f}" x2="{p2[0]:.3f}" y2="{p2[1]:.3f}" '
            f'stroke="{stroke_color}" stroke-width="{stroke_width}" stroke-linecap="square"/>'
        )
    parts.append('</svg>')
    with open(filename, 'w') as f:
        f.write('\n'.join(parts))


# ── Variants ───────────────────────────────────────────────────────────────
LINE_VARIANTS = [
    ('.single-line', '#e8edf4', 0.6,  None),      # crisp neutral lines, transparent bg
    ('.blueprint',   '#cfe1ff', 0.65, '#0d3163'), # light cyan on deep navy
    ('.draft',       '#1a2030', 0.55, '#f5f1e8'), # dark on cream paper
]

PATTERNS = [
    ('standard-herringbone',    standard_herringbone,    2),    # expand = JOINT/2
    ('diagonal-herringbone',    diagonal_herringbone,    2),
    ('british-cobble',          british_cobble,          2),
    ('offset-brick',            offset_brick,            2),
    ('six-in-tiles',            six_in_tiles,            2),
    ('eight-in-offset-tile',    eight_in_offset_tile,    2),
    ('texas-cobble',            texas_cobble,            2),
    ('ashlar-slate',            ashlar_slate,            0),    # already JOINT=0
]

if __name__ == '__main__':
    total = 0
    for stem, fn, expand in PATTERNS:
        bricks, tw, th = fn(expand)
        edges = bricks_to_edges(bricks)
        # Count raw edges for comparison
        raw_count = sum(4 for _ in bricks)
        print(f'{stem}:  {len(bricks)} bricks, {raw_count} raw edges, '
              f'{len(edges)} merged segments  (tile {tw:.1f}x{th:.1f})')
        for suffix, color, sw, bg in LINE_VARIANTS:
            emit_svg(f'{stem}{suffix}.svg', tw, th, edges, color, sw, bg)
            total += 1
    print(f'wrote {total} SVGs total ({len(PATTERNS)} patterns x {len(LINE_VARIANTS)} variants)')
