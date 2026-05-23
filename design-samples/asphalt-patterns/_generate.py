"""Generate the full set of 8 stamped-asphalt patterns x 4 colour variants.
Variant styles:
  orange  - brand-loud, bg-style:   stroke 0.8  / opacity 0.55 / color #f97316
  white   - neutral,    bg-style:   stroke 0.8  / opacity 0.55 / color #ffffff
  bronze  - muted,      bg-style:   stroke 0.8  / opacity 0.55 / color #b06d2a
  line    - elegant,    crisp:      stroke 0.55 / opacity 0.95 / color #e8edf4  (single-line drawing)
"""
import math
import os

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(OUT_DIR)

VARIANTS = [
    ('',         '#f97316', 0.8,  0.55),
    ('.white',   '#ffffff', 0.8,  0.55),
    ('.bronze',  '#b06d2a', 0.8,  0.55),
    ('.line',    '#e8edf4', 0.55, 0.95),
]


def line_rect(x, y, w, h, color, sw, op):
    return (f'<rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" '
            f'fill="none" stroke="{color}" stroke-width="{sw}" stroke-opacity="{op}"/>')


def emit(stem, tile_w, tile_h, body_fn, viewbox=None):
    if viewbox is None:
        viewbox = f'0 0 {tile_w} {tile_h}'
    for suffix, color, sw, op in VARIANTS:
        body = body_fn(color, sw, op)
        out = f'{stem}{suffix}.svg'
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{tile_w}" height="{tile_h}" '
               f'viewBox="{viewbox}">\n{body}\n</svg>')
        open(out, 'w').write(svg)
    print(f'wrote {stem} (x4 variants)  tile={tile_w}x{tile_h}')


# Base unit
SHORT, LONG, JOINT = 40, 84, 4
STEP = SHORT + JOINT
TILE = STEP * 4


# 1. STANDARD HERRINGBONE
def standard_herringbone(c, sw, op):
    parts = []
    for i in range(-2, 7):
        for j in range(-2, 3):
            x_v = i * STEP
            y_v = i * STEP + 4 * j * STEP
            parts.append(line_rect(x_v, y_v, SHORT, LONG, c, sw, op))
            x_h = i * STEP
            y_h = i * STEP + 4 * j * STEP + 3 * STEP
            parts.append(line_rect(x_h, y_h, LONG, SHORT, c, sw, op))
    return '\n'.join(parts)


emit('standard-herringbone', TILE, TILE, standard_herringbone)


# 2. DIAGONAL HERRINGBONE
TILE_D = TILE * math.sqrt(2)
COS, SIN = math.cos(math.radians(45)), math.sin(math.radians(45))


def rotated_rect(cx, cy, w, h, color, sw, op):
    x = cx - w / 2
    y = cy - h / 2
    return (f'<rect x="{x:.3f}" y="{y:.3f}" width="{w}" height="{h}" '
            f'fill="none" stroke="{color}" stroke-width="{sw}" stroke-opacity="{op}" '
            f'transform="rotate(45 {cx:.3f} {cy:.3f})"/>')


def diagonal_herringbone(c, sw, op):
    parts = []
    for i in range(-4, 10):
        for j in range(-4, 5):
            x_v_c = i * STEP + SHORT / 2
            y_v_c = i * STEP + 4 * j * STEP + LONG / 2
            x_h_c = i * STEP + LONG / 2
            y_h_c = i * STEP + 4 * j * STEP + 3 * STEP + SHORT / 2
            cxv = x_v_c * COS - y_v_c * SIN
            cyv = x_v_c * SIN + y_v_c * COS
            cxh = x_h_c * COS - y_h_c * SIN
            cyh = x_h_c * SIN + y_h_c * COS
            parts.append(rotated_rect(cxv, cyv, SHORT, LONG, c, sw, op))
            parts.append(rotated_rect(cxh, cyh, LONG, SHORT, c, sw, op))
    return '\n'.join(parts)


emit('diagonal-herringbone', f'{TILE_D:.2f}', f'{TILE_D:.2f}', diagonal_herringbone,
     viewbox=f'0 0 {TILE_D:.3f} {TILE_D:.3f}')


# 3. BRITISH COBBLE (basket weave layout)
BW_TILE = 2 * (LONG + JOINT)
S_BW = LONG + JOINT


def british_cobble(c, sw, op):
    out = []

    def st(x0, y0, vertical):
        if vertical:
            out.append(line_rect(x0, y0, SHORT, LONG, c, sw, op))
            out.append(line_rect(x0 + SHORT + JOINT, y0, SHORT, LONG, c, sw, op))
        else:
            out.append(line_rect(x0, y0, LONG, SHORT, c, sw, op))
            out.append(line_rect(x0, y0 + SHORT + JOINT, LONG, SHORT, c, sw, op))

    for i, j in [(0, 0), (1, 0), (0, 1), (1, 1)]:
        st(i * S_BW, j * S_BW, vertical=((i + j) % 2 == 0))
    return '\n'.join(out)


emit('british-cobble', BW_TILE, BW_TILE, british_cobble)


# 4. OFFSET BRICK
RB_W, RB_H = 44, 64
RB_TW = RB_W + JOINT
RB_TH = 2 * (RB_H + JOINT)
HALF = (RB_W + JOINT) // 2


def offset_brick(c, sw, op):
    return '\n'.join([
        line_rect(0, 0, RB_W, RB_H, c, sw, op),
        line_rect(-HALF, RB_H + JOINT, RB_W, RB_H, c, sw, op),
        line_rect(RB_TW - HALF, RB_H + JOINT, RB_W, RB_H, c, sw, op),
    ])


emit('offset-brick', RB_TW, RB_TH, offset_brick)


# 5. SIX-INCH TILES (square grid)
SQ_6 = 60
T6 = SQ_6 + JOINT


def six_in_tiles(c, sw, op):
    return line_rect(0, 0, SQ_6, SQ_6, c, sw, op)


emit('six-in-tiles', T6, T6, six_in_tiles)


# 6. EIGHT-INCH OFFSET TILE
SQ_8 = 80
OT_TW = SQ_8 + JOINT
OT_TH = 2 * (SQ_8 + JOINT)
OT_HALF = (SQ_8 + JOINT) // 2


def eight_in_offset_tile(c, sw, op):
    return '\n'.join([
        line_rect(0, 0, SQ_8, SQ_8, c, sw, op),
        line_rect(-OT_HALF, SQ_8 + JOINT, SQ_8, SQ_8, c, sw, op),
        line_rect(OT_TW - OT_HALF, SQ_8 + JOINT, SQ_8, SQ_8, c, sw, op),
    ])


emit('eight-in-offset-tile', OT_TW, OT_TH, eight_in_offset_tile)


# 7. TEXAS COBBLE - small stamped cobble grid (double outline)
TC_SQ = 40
TC_INSET = 3
TC_TILE = TC_SQ + JOINT


def texas_cobble(c, sw, op):
    outer = line_rect(0, 0, TC_SQ, TC_SQ, c, sw, op)
    inner = line_rect(TC_INSET, TC_INSET, TC_SQ - 2 * TC_INSET, TC_SQ - 2 * TC_INSET, c, sw * 0.7, op * 0.7)
    return outer + '\n' + inner


emit('texas-cobble', TC_TILE, TC_TILE, texas_cobble)


# 8. ASHLAR SLATE - random ashlar (hand-designed tileable arrangement)
AS_W, AS_H = 200, 120


def ashlar_slate(c, sw, op):
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
    return '\n'.join(line_rect(x, y, w, h, c, sw, op) for x, y, w, h in stones)


emit('ashlar-slate', AS_W, AS_H, ashlar_slate)

print('done - 8 patterns x 4 variants = 32 pattern files.')
