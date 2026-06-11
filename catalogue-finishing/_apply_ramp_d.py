"""Type-pass structural snap D: spec-page flow + remaining sites."""
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "catalog-print-build" / "src" / "final_catalog.py"
s = p.read_text(encoding="utf-8")
n0 = 0


def sub(old, new, n=1):
    global s, n0
    c = s.count(old)
    assert c == n, f"expected {n}, found {c}: {old[:60]!r}"
    s = s.replace(old, new)
    n0 += 1


# spec page: subhead 10.5/15 -> 12.5/15.6 + WRAP-SAFE body flow
sub('''    draw_text_block(c, no_orphan(prod["italic"], 3), fx=28, fy=y,
                    font_size_figma=10.5,
                    color=CMYK_TEXT_MID,
                    max_w_figma=394, leading_figma=15)
    y += 32''',
    '''    sub_bottom_pdf = draw_text_block(
        c, no_orphan(prod["italic"], 3), fx=28, fy=y,
        font_size_figma=12.5,
        color=CMYK_TEXT_MID,
        max_w_figma=394, leading_figma=15.6)
    # wrap-safe rhythm: body starts a fixed gap below the ACTUAL subhead
    # bottom (draw_text_block returns bottom y in PDF coords) — the old
    # fixed +32 collided when a subhead wrapped to two lines
    GAP_SUBHEAD_BODY = 12  # figma
    y = (BLEED + TRIM_H - sub_bottom_pdf) / SCALE + GAP_SUBHEAD_BODY''')

# spec body 9.5/14/394 -> 10/14/360 (45-75 cpl measure)
sub('''    draw_text_block(c, no_orphan(prod["body"], 3), fx=28, fy=y,
                    font_size_figma=9.5,
                    color=CMYK_TEXT_DARK, max_w_figma=394, leading_figma=14)''',
    '''    draw_text_block(c, no_orphan(prod["body"], 3), fx=28, fy=y,
                    font_size_figma=10,
                    color=CMYK_TEXT_DARK, max_w_figma=360, leading_figma=14)''')

# spec title tracking -0.9 -> -0.6 (dynamic display)
sub('font_size_figma=target_size,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.9,',
    'font_size_figma=target_size,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.6,')
# 26-tier heads tracking -0.9 -> -0.5 (colour A, colour B, process)
sub('draw_text_block(c, "The full palette.", fx=28, fy=34, font_size_figma=26,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.9,',
    'draw_text_block(c, "The full palette.", fx=28, fy=34, font_size_figma=26,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.5,')
sub('draw_text_block(c, "Cooler by design.", fx=28, fy=34, font_size_figma=26,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.9,',
    'draw_text_block(c, "Cooler by design.", fx=28, fy=34, font_size_figma=26,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.5,')
sub('font_size_figma=26, weight=800, color=CMYK_TEXT_DARK,\n                    tracking=-0.9, max_w_figma=394)',
    'font_size_figma=26, weight=800, color=CMYK_TEXT_DARK,\n                    tracking=-0.5, max_w_figma=394)')

# hub-numbers label 7.0->6.5, sub 7.5/11 -> 7.8/10.1
sub('tracked_caps(c, label, fx=gx, fy=gy + 64, size=7.0,\n                     color=HUBSS_WHITE, max_w_figma=cell_w)',
    'tracked_caps(c, label, fx=gx, fy=gy + 64, size=6.5,\n                     color=HUBSS_WHITE, max_w_figma=cell_w)')
sub('draw_text_block(c, sub, fx=gx, fy=gy + 82, font_size_figma=7.5,\n                        color=CMYK_ON_DARK_BODY, max_w_figma=cell_w - 8,\n                        leading_figma=11)',
    'draw_text_block(c, sub, fx=gx, fy=gy + 82, font_size_figma=7.8,\n                        color=CMYK_ON_DARK_BODY, max_w_figma=cell_w - 8,\n                        leading_figma=10.1)')

# back cover
sub('fx=25, fy=195, font_size_figma=8.5, color=HUBSS_WHITE,\n                    align="center", max_w_figma=400)',
    'fx=25, fy=195, font_size_figma=10, color=HUBSS_WHITE,\n                    align="center", max_w_figma=400)')
sub('draw_text_block(c, "hubss.com", fx=25, fy=228, font_size_figma=11,\n                    weight=600, color=HUBSS_WHITE, align="center",\n                    max_w_figma=400, tracking=1.4)',
    'draw_text_block(c, "hubss.com", fx=25, fy=228, font_size_figma=10,\n                    weight=600, color=HUBSS_WHITE, align="center",\n                    max_w_figma=400, tracking=1.4)')
sub('fx=25, fy=278, size=6.0,\n                 color=HUBSS_WHITE, align="center", max_w_figma=400)',
    'fx=25, fy=278, size=6.5,\n                 color=HUBSS_WHITE, align="center", max_w_figma=400)')
sub('draw_text_block(c, "West / Prairies   604.309.8212",\n                    fx=25, fy=400, font_size_figma=7.0,',
    'draw_text_block(c, "West / Prairies   604.309.8212",\n                    fx=25, fy=400, font_size_figma=7.8,')
sub('draw_text_block(c, "Central / Maritimes   416.540.9287",\n                    fx=25, fy=414, font_size_figma=7.0,',
    'draw_text_block(c, "Central / Maritimes   416.540.9287",\n                    fx=25, fy=414, font_size_figma=7.8,')

# contact intro leading; tagline
sub('fx=30, fy=96, font_size_figma=10, color=CMYK_TEXT_MID,\n                    max_w_figma=390, leading_figma=15)',
    'fx=30, fy=96, font_size_figma=10, color=CMYK_TEXT_MID,\n                    max_w_figma=390, leading_figma=14)')
sub('fx=30, fy=304, font_size_figma=8, color=CMYK_TEXT_MID,\n        max_w_figma=390, leading_figma=12)',
    'fx=30, fy=304, font_size_figma=8.6, color=CMYK_TEXT_MID,\n        max_w_figma=390, leading_figma=11.2)')

# dead paths (consistency only — not in the 140pp render)
sub('fx=28, fy=350, font_size_figma=18,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.4,\n                    max_w_figma=394, leading_figma=22)',
    'fx=28, fy=350, font_size_figma=17.5,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.35,\n                    max_w_figma=394, leading_figma=19.3)')
sub('draw_text_block(c, no_orphan(app["body"], 3), fx=28, fy=388,\n                    font_size_figma=8.5, color=CMYK_TEXT_MID,\n                    max_w_figma=394, leading_figma=12)',
    'draw_text_block(c, no_orphan(app["body"], 3), fx=28, fy=388,\n                    font_size_figma=10, color=CMYK_TEXT_MID,\n                    max_w_figma=394, leading_figma=14)')
sub('font_size_figma=20,\n                    color=CMYK_TEXT_DARK, tracking=-0.3,\n                    max_w_figma=394, leading_figma=24)',
    'font_size_figma=21,\n                    color=CMYK_TEXT_DARK, tracking=-0.4,\n                    max_w_figma=394, leading_figma=23)')
sub('font_size_figma=17, weight=800', 'font_size_figma=17.5, weight=800')
sub('tracked_caps(c, eyebrow_label, fx=34, fy=322, size=7.0,',
    'tracked_caps(c, eyebrow_label, fx=34, fy=322, size=7.5,')

p.write_text(s, encoding="utf-8")
print(f"applied {n0} substitutions OK")
