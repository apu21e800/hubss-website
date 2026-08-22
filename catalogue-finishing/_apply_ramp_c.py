"""Type-pass bulk snap C: spec pages, cards, colour/process, small tiers."""
import re
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "catalog-print-build" / "src" / "final_catalog.py"
s = p.read_text(encoding="utf-8")
applied = []


def sub(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, f"expected {n}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)
    applied.append(f"lit:{old[:40]}")


def rsub(pat, repl, n):
    global s
    s, c = re.subn(pat, repl, s)
    assert c == n, f"regex expected {n}, replaced {c}: {pat[:60]!r}"
    applied.append(f"re:{pat[:40]}")


# ---- spec pages ----
sub('tracked_caps(c, eyebrow, fx=28, fy=18, size=5.5,\n                 color=HUBSS_ORANGE, max_w_figma=394)',
    'tracked_caps(c, eyebrow, fx=28, fy=18, size=7.5,\n                 color=HUBSS_ORANGE, max_w_figma=394)')
sub('tracked_caps(c, label, fx=x, fy=yy, size=6.0,\n                         color=CMYK_TEXT_FAINT, max_w_figma=190)',
    'tracked_caps(c, label, fx=x, fy=yy, size=6.5,\n                         color=CMYK_TEXT_FAINT, max_w_figma=190)')
sub('draw_text_block(c, value, fx=x, fy=yy + 11,\n                            font_size_figma=8.5, weight=600,\n                            color=CMYK_TEXT_DARK, max_w_figma=185,\n                            leading_figma=11)',
    'draw_text_block(c, value, fx=x, fy=yy + 11,\n                            font_size_figma=8.6, weight=600,\n                            color=CMYK_TEXT_DARK, max_w_figma=185,\n                            leading_figma=11.2)')
sub('    if n < 8:   return 56\n    if n < 14:  return 44\n    if n < 25:  return 34\n    if n < 40:  return 26\n    return 22',
    '    if n < 8:   return 52\n    if n < 14:  return 42\n    if n < 25:  return 37\n    if n < 40:  return 26\n    return 21')

# ---- product hero tagline ----
sub('    tagline_size = 22\n', '    tagline_size = 21\n')
sub('while tagline_size > 14 and', 'while tagline_size > 14.5 and')
sub('    tagline_leading = tagline_size + 4\n',
    '    tagline_leading = round(tagline_size * 1.10, 1)\n')

# ---- card shell ----
sub('tracking=-0.8, max_w_figma=384, leading_figma=head_size + 4)',
    'tracking=-0.5, max_w_figma=384, leading_figma=head_size + 2)')
sub('font_size_figma=10.5, color=CMYK_TEXT_MID,\n                    max_w_figma=372, leading_figma=16)',
    'font_size_figma=10, color=CMYK_TEXT_MID,\n                    max_w_figma=364, leading_figma=14)')
sub('tracked_caps(c, "hubss.com", fx=30, fy=420, size=6.0,\n                 color=HUBSS_ORANGE, max_w_figma=200)',
    'tracked_caps(c, "hubss.com", fx=30, fy=420, size=6.5,\n                 color=HUBSS_ORANGE, max_w_figma=200)')
sub('tracked_caps(c, foot_right, fx=232, fy=420, size=6.0,',
    'tracked_caps(c, foot_right, fx=232, fy=420, size=6.5,')
sub('head_size=27, meta=app.get("location") or None,',
    'head_size=26, meta=app.get("location") or None,')
sub('proj.get("story") or "", head_size=29,',
    'proj.get("story") or "", head_size=26,')

# ---- standfirsts (colour A, colour B, process) 9.5/14 -> 10/14 ----
rsub(r'font_size_figma=9\.5, color=CMYK_TEXT_MID,\n        max_w_figma=394, leading_figma=14\)',
     'font_size_figma=10, color=CMYK_TEXT_MID,\n        max_w_figma=394, leading_figma=14)', 3)

# ---- colour spread details ----
sub('font_size_figma=6.2, weight=500,\n                            color=CMYK_TEXT_MID, max_w_figma=CELL_W - 4)',
    'font_size_figma=7.8, weight=500,\n                            color=CMYK_TEXT_MID, max_w_figma=CELL_W - 4)')
sub('fx=28, fy=419, font_size_figma=7.0, weight=500,\n        color=CMYK_TEXT_MID, max_w_figma=394)',
    'fx=28, fy=419, font_size_figma=7.8, weight=400,\n        color=CMYK_TEXT_MID, max_w_figma=394)')
sub('font_size_figma=6.8, weight=600,\n                        color=CMYK_TEXT_DARK, max_w_figma=CELL_W - 6)',
    'font_size_figma=7.8, weight=500,\n                        color=CMYK_TEXT_DARK, max_w_figma=CELL_W - 6)')
sub('font_size_figma=6.8, weight=600,\n                        color=CMYK_TEXT_DARK, max_w_figma=CELL2 - 14)',
    'font_size_figma=7.8, weight=500,\n                        color=CMYK_TEXT_DARK, max_w_figma=CELL2 - 14)')
sub('font_size_figma=5.8, weight=500,\n                        color=CMYK_TEXT_MID, max_w_figma=CELL_W - 6)',
    'font_size_figma=6.5, weight=400,\n                        color=CMYK_TEXT_MID, max_w_figma=CELL_W - 6)')
sub('fx=28, fy=y, font_size_figma=6.5, weight=500,\n        color=CMYK_TEXT_FAINT, max_w_figma=394)',
    'fx=28, fy=y, font_size_figma=7.8, weight=400,\n        color=CMYK_TEXT_FAINT, max_w_figma=394)')
sub('fx=28, fy=y, font_size_figma=8.5, color=CMYK_TEXT_MID,\n        max_w_figma=394, leading_figma=12)',
    'fx=28, fy=y, font_size_figma=8.6, color=CMYK_TEXT_MID,\n        max_w_figma=394, leading_figma=11.2)')

# ---- process strip ----
sub('tracked_caps(c, num, fx=192, fy=y + 2, size=7.0,\n                     color=HUBSS_ORANGE, max_w_figma=40)',
    'tracked_caps(c, num, fx=192, fy=y + 2, size=6.5,\n                     color=HUBSS_ORANGE, max_w_figma=40)')
sub('fx=192, fy=y + 34,\n                        font_size_figma=8.5, color=CMYK_TEXT_MID,\n                        max_w_figma=230, leading_figma=12.5)',
    'fx=192, fy=y + 34,\n                        font_size_figma=8.6, color=CMYK_TEXT_MID,\n                        max_w_figma=230, leading_figma=11.2)')
sub('fx=32, fy=418, size=7.0, color=HUBSS_WHITE, max_w_figma=390)',
    'fx=32, fy=418, size=7.5, color=HUBSS_WHITE, max_w_figma=390)')

# ---- installer ----
rsub(r'(inst\["body"\], 3\), fx=30, fy=325,\n.*?font_size_figma=)9\.5(,[\s\S]{0,140}?leading_figma=)14\.5\)',
     r'\g<1>10\g<2>14)', 1)
sub('tracked_caps(c, "Phone", fx=30, fy=395, size=6.0,',
    'tracked_caps(c, "Phone", fx=30, fy=395, size=6.5,')
sub('tracked_caps(c, "Online", fx=220, fy=395, size=6.0,',
    'tracked_caps(c, "Online", fx=220, fy=395, size=6.5,')

# ---- TOC rows ----
sub('weight=600, color=CMYK_TEXT_DARK, tracking=0.3)',
    'weight=600, color=CMYK_TEXT_DARK, tracking=0)')

# ---- reference table desc ----
sub('draw_text_block(c, desc, fx=270, fy=y, font_size_figma=8.5,\n                        color=CMYK_TEXT_MID, max_w_figma=160)',
    'draw_text_block(c, desc, fx=270, fy=y, font_size_figma=8.6,\n                        color=CMYK_TEXT_MID, max_w_figma=160)')

# ---- cities ----
sub('font_size_figma=9, color=CMYK_TEXT_DARK,\n                    max_w_figma=280, leading_figma=13)',
    'font_size_figma=10, color=CMYK_TEXT_DARK,\n                    max_w_figma=280, leading_figma=14)')
sub('font_size_figma=9, color=CMYK_TEXT_MID,\n                    max_w_figma=280, leading_figma=13)',
    'font_size_figma=10, color=CMYK_TEXT_MID,\n                    max_w_figma=280, leading_figma=14)')
sub('draw_text_block(c, "A partial list", fx=30, fy=158, font_size_figma=7,',
    'draw_text_block(c, "A partial list", fx=30, fy=158, font_size_figma=7.8,')
sub('draw_text_block(c, cities[i], fx=30, fy=y, font_size_figma=8,\n                        color=CMYK_TEXT_DARK, max_w_figma=185)',
    'draw_text_block(c, cities[i], fx=30, fy=y, font_size_figma=8.6,\n                        color=CMYK_TEXT_DARK, max_w_figma=185)')
sub('font_size_figma=8, color=CMYK_TEXT_DARK,\n                            max_w_figma=175)',
    'font_size_figma=8.6, color=CMYK_TEXT_DARK,\n                            max_w_figma=175)')

# ---- Lunch & Learn ----
sub('fx=LX, fy=214, font_size_figma=11, color=CMYK_ON_DARK_BODY,\n        max_w_figma=300, leading_figma=17)',
    'fx=LX, fy=214, font_size_figma=12.5, color=CMYK_ON_DARK_BODY,\n        max_w_figma=300, leading_figma=15.6)')
sub('draw_text_block(c, it, fx=LX + 12, fy=vy, font_size_figma=9.5,\n                        weight=600, color=HUBSS_WHITE, max_w_figma=300,\n                        leading_figma=13)',
    'draw_text_block(c, it, fx=LX + 12, fy=vy, font_size_figma=10,\n                        weight=600, color=HUBSS_WHITE, max_w_figma=300,\n                        leading_figma=14)')
sub('fy=cta_y + cta_h / 2 - 4.5, font_size_figma=8.5,\n                    weight=800, color=HUBSS_WHITE, tracking=1.2,',
    'fy=cta_y + cta_h / 2 - 4.5, font_size_figma=8.6,\n                    weight=800, color=HUBSS_WHITE, tracking=1.2,')
rsub(r'(tracked_caps\(c, "Cleve Stordy 604\.309\.8212[^"]*",\n\s+fx=LX, fy=418, size=)6\.0', r'\g<1>6.5', 1)
sub('tracked_caps(c, "Scan to book", fx=QF_X - PAD, fy=QF_Y + QS + PAD + 5,\n                     size=6.0,',
    'tracked_caps(c, "Scan to book", fx=QF_X - PAD, fy=QF_Y + QS + PAD + 5,\n                     size=6.5,')

# ---- closing manifesto body ----
sub('fx=40, fy=252, font_size_figma=11, weight=500,\n        color=CMYK_TEXT_DARK, max_w_figma=370, leading_figma=18,',
    'fx=40, fy=252, font_size_figma=12.5,\n        color=CMYK_TEXT_DARK, max_w_figma=370, leading_figma=15.6,')

# ---- statement body ----
sub('fx=30, fy=275, font_size_figma=11, color=CMYK_TEXT_MID,\n         max_w_figma=350, leading_figma=18)',
    'fx=30, fy=275, font_size_figma=10, color=CMYK_TEXT_MID,\n         max_w_figma=350, leading_figma=14)')

# ---- contact details ----
rsub(r'font_size_figma=8\.5, color=CMYK_TEXT_MID,\n                    max_w_figma=188\)', 'font_size_figma=8.6, color=CMYK_TEXT_MID,\n                    max_w_figma=188)', 1)
rsub(r'font_size_figma=8\.5, color=CMYK_TEXT_DARK,\n                    max_w_figma=188\)', 'font_size_figma=8.6, color=CMYK_TEXT_DARK,\n                    max_w_figma=188)', 1)
rsub(r'font_size_figma=8\.5, color=CMYK_TEXT_MID,\n                    max_w_figma=178\)', 'font_size_figma=8.6, color=CMYK_TEXT_MID,\n                    max_w_figma=178)', 1)
rsub(r'font_size_figma=8\.5, color=CMYK_TEXT_DARK,\n                    max_w_figma=178\)', 'font_size_figma=8.6, color=CMYK_TEXT_DARK,\n                    max_w_figma=178)', 1)
sub('draw_text_block(c, "Ladysmith, British Columbia", fx=30, fy=230,\n                    font_size_figma=7,',
    'draw_text_block(c, "Ladysmith, British Columbia", fx=30, fy=230,\n                    font_size_figma=7.8,')
sub('draw_text_block(c, "Milton, Ontario", fx=242, fy=230, font_size_figma=7,',
    'draw_text_block(c, "Milton, Ontario", fx=242, fy=230, font_size_figma=7.8,')

p.write_text(s, encoding="utf-8")
print(f"applied {len(applied)} substitutions OK")
