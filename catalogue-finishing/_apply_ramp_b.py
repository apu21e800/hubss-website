"""Type-pass bulk snap B: displays, titles, eyebrows (assertive, one-shot)."""
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "catalog-print-build" / "src" / "final_catalog.py"
s = p.read_text(encoding="utf-8")
applied = []


def sub(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, f"expected {n}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)
    applied.append(old[:46].replace("\n", " "))


# ---- dividers / hero displays ----
sub("""draw_text_block(c, title, fx=28, fy=342, font_size_figma=50,
                    weight=800, color=HUBSS_WHITE,
                    tracking=-1.6, max_w_figma=394, leading_figma=54)""",
    """draw_text_block(c, title, fx=28, fy=342, font_size_figma=52,
                    weight=800, color=HUBSS_WHITE,
                    tracking=-1.0, max_w_figma=394, leading_figma=56)""")
sub("""draw_text_block(c, "Network.", fx=28, fy=350, font_size_figma=44,
                    weight=800, color=HUBSS_WHITE, tracking=-1.4,
                    max_w_figma=394, leading_figma=46)""",
    """draw_text_block(c, "Network.", fx=28, fy=350, font_size_figma=52,
                    weight=800, color=HUBSS_WHITE, tracking=-1.0,
                    max_w_figma=394, leading_figma=56)""")
sub('draw_text_block(c, "Built to", fx=28, fy=116, font_size_figma=52,\n                        weight=800, color=HUBSS_WHITE, tracking=-1.4,',
    'draw_text_block(c, "Built to", fx=28, fy=116, font_size_figma=52,\n                        weight=800, color=HUBSS_WHITE, tracking=-1.0,')
sub('draw_text_block(c, "outlast.", fx=28, fy=180, font_size_figma=52,\n                        weight=800, color=HUBSS_ORANGE, tracking=-1.4,',
    'draw_text_block(c, "outlast.", fx=28, fy=180, font_size_figma=52,\n                        weight=800, color=HUBSS_ORANGE, tracking=-1.0,')

# ---- L&L / closing 42-tier ----
sub('draw_text_block(c, "Lunch is on us.", fx=LX, fy=92, font_size_figma=42,\n                    weight=800, color=HUBSS_WHITE, tracking=-1.2,\n                    max_w_figma=390, leading_figma=46)',
    'draw_text_block(c, "Lunch is on us.", fx=LX, fy=92, font_size_figma=42,\n                    weight=800, color=HUBSS_WHITE, tracking=-0.8,\n                    max_w_figma=390, leading_figma=45)')
sub('"Your spec is free.", fx=LX, fy=142, font_size_figma=42,\n                    weight=800, color=HUBSS_ORANGE, tracking=-1.2,\n                    max_w_figma=390, leading_figma=46)',
    '"Your spec is free.", fx=LX, fy=142, font_size_figma=42,\n                    weight=800, color=HUBSS_ORANGE, tracking=-0.8,\n                    max_w_figma=390, leading_figma=45)')
sub('font_size_figma=42, weight=800, color=CMYK_TEXT_DARK,\n                    tracking=-1.2, max_w_figma=370)',
    'font_size_figma=42, weight=800, color=CMYK_TEXT_DARK,\n                    tracking=-0.8, max_w_figma=370)')
sub('font_size_figma=42, weight=800, color=HUBSS_ORANGE,\n                    tracking=-1.2, max_w_figma=370)',
    'font_size_figma=42, weight=800, color=HUBSS_ORANGE,\n                    tracking=-0.8, max_w_figma=370)')
sub('draw_text_block(c, num, fx=gx, fy=gy, font_size_figma=40,\n                        weight=800, color=HUBSS_ORANGE, tracking=-1.4,',
    'draw_text_block(c, num, fx=gx, fy=gy, font_size_figma=42,\n                        weight=800, color=HUBSS_ORANGE, tracking=-0.8,')

# ---- 31-tier (statement, TOC head, service triplet) ----
sub('font_size_figma=28, weight=800, color=CMYK_TEXT_DARK,\n                    tracking=-0.8, max_w_figma=390, leading_figma=34)',
    'font_size_figma=31, weight=800, color=CMYK_TEXT_DARK,\n                    tracking=-0.6, max_w_figma=390, leading_figma=33.5)')
sub('font_size_figma=28, weight=800, color=HUBSS_ORANGE,\n                    tracking=-0.8, max_w_figma=390, leading_figma=34)',
    'font_size_figma=31, weight=800, color=HUBSS_ORANGE,\n                    tracking=-0.6, max_w_figma=390, leading_figma=33.5)')
sub('draw_text_block(c, "Catalogue 2026.", fx=40, fy=88, font_size_figma=32,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)',
    'draw_text_block(c, "Catalogue 2026.", fx=40, fy=88, font_size_figma=31,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.6)')
sub('draw_text_block(c, "Specified.", fx=30, fy=80, font_size_figma=32,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)',
    'draw_text_block(c, "Specified.", fx=30, fy=80, font_size_figma=31,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.6)')
sub('draw_text_block(c, "Installed.", fx=30, fy=120, font_size_figma=32,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)',
    'draw_text_block(c, "Installed.", fx=30, fy=120, font_size_figma=31,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.6)')
sub('draw_text_block(c, "Backed.", fx=30, fy=160, font_size_figma=32,\n                    weight=800, color=HUBSS_ORANGE, tracking=-1.0)',
    'draw_text_block(c, "Backed.", fx=30, fy=160, font_size_figma=31,\n                    weight=800, color=HUBSS_ORANGE, tracking=-0.6)')
# closing-manifesto SPECIFIED/INSTALLED/BACKED caps trio 8.0 -> 8.5
sub('size=8.0,', 'size=8.5,', n=3)

# ---- 26-tier ----
sub('draw_text_block(c, "The systems.", fx=30, fy=68, font_size_figma=28,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)',
    'draw_text_block(c, "The systems.", fx=30, fy=68, font_size_figma=26,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.5)')
sub('font_size_figma=28,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.5,\n                    max_w_figma=380, leading_figma=32)',
    'font_size_figma=26,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.5,\n                    max_w_figma=380, leading_figma=28)')
sub('draw_text_block(c, "Project notes.", fx=30, fy=78, font_size_figma=24,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.6,',
    'draw_text_block(c, "Project notes.", fx=30, fy=78, font_size_figma=26,\n                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.5,')

# ---- 21-tier ----
sub('draw_text_block(c, "Speak with HUB.", fx=30, fy=44, font_size_figma=22,\n                    weight=800, color=HUBSS_WHITE, tracking=-0.6,',
    'draw_text_block(c, "Speak with HUB.", fx=30, fy=44, font_size_figma=21,\n                    weight=800, color=HUBSS_WHITE, tracking=-0.4,')
sub('draw_text_block(c, "Cleve Stordy", fx=30, fy=158, font_size_figma=20,',
    'draw_text_block(c, "Cleve Stordy", fx=30, fy=158, font_size_figma=21,')
sub('draw_text_block(c, "Doug Bain", fx=242, fy=158, font_size_figma=20,',
    'draw_text_block(c, "Doug Bain", fx=242, fy=158, font_size_figma=21,')
sub('draw_text_block(c, "hubss.com", fx=30, fy=272, font_size_figma=16,\n                    weight=800, color=HUBSS_ORANGE, tracking=-0.4,',
    'draw_text_block(c, "hubss.com", fx=30, fy=272, font_size_figma=17.5,\n                    weight=800, color=HUBSS_ORANGE, tracking=-0.35,')
sub('draw_text_block(c, prod["name"], fx=28, fy=32, font_size_figma=22,\n                    weight=800, color=HUBSS_WHITE, tracking=-1.0,',
    'draw_text_block(c, prod["name"], fx=28, fy=32, font_size_figma=21,\n                    weight=800, color=HUBSS_WHITE, tracking=-0.4,')

# ---- 14.5-tier ----
sub('draw_text_block(c, title, fx=192, fy=y + 14, font_size_figma=13,\n                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.3,',
    'draw_text_block(c, title, fx=192, fy=y + 14, font_size_figma=14.5,\n                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.3,')
sub('draw_text_block(c, caption, fx=28, fy=370, font_size_figma=14,\n                    weight=800, color=HUBSS_WHITE, tracking=-0.4,\n                    max_w_figma=394, leading_figma=18)',
    'draw_text_block(c, caption, fx=28, fy=370, font_size_figma=14.5,\n                    weight=800, color=HUBSS_WHITE, tracking=-0.3,\n                    max_w_figma=394, leading_figma=16)')
sub('draw_text_block(c, "Thank you.", fx=25, fy=350, font_size_figma=14,',
    'draw_text_block(c, "Thank you.", fx=25, fy=350, font_size_figma=14.5,')
sub('font_size_figma=15, weight=800,\n                    color=CMYK_TEXT_DARK, max_w_figma=180, tracking=-0.3)',
    'font_size_figma=14.5, weight=800,\n                    color=CMYK_TEXT_DARK, max_w_figma=180, tracking=-0.3)')
sub('font_size_figma=13, weight=800,\n                    color=HUBSS_ORANGE, max_w_figma=200, tracking=-0.2)',
    'font_size_figma=14.5, weight=800,\n                    color=HUBSS_ORANGE, max_w_figma=200, tracking=-0.3)')

# ---- why_proof + service rows ----
sub('draw_text_block(c, "If it goes on the street,",\n                    fx=40, fy=74, font_size_figma=19, weight=800,\n                    color=CMYK_TEXT_DARK, tracking=-0.6)',
    'draw_text_block(c, "If it goes on the street,",\n                    fx=40, fy=74, font_size_figma=21, weight=800,\n                    color=CMYK_TEXT_DARK, tracking=-0.4)')
sub('draw_text_block(c, "it stays on the street.",\n                    fx=40, fy=100, font_size_figma=19, weight=800,',
    'draw_text_block(c, "it stays on the street.",\n                    fx=40, fy=100, font_size_figma=21, weight=800,')
sub('draw_text_block(c, claim, fx=80, fy=y, font_size_figma=11,\n                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.3,\n                        max_w_figma=340)',
    'draw_text_block(c, claim, fx=80, fy=y, font_size_figma=14.5,\n                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.3,\n                        max_w_figma=340)')
sub('draw_text_block(c, detail, fx=80, fy=y + 16, font_size_figma=8.0,\n                        color=CMYK_TEXT_MID, max_w_figma=340, leading_figma=11)',
    'draw_text_block(c, detail, fx=80, fy=y + 16, font_size_figma=8.6,\n                        color=CMYK_TEXT_MID, max_w_figma=340, leading_figma=11.2)')
sub('tracked_caps(c, num, fx=40, fy=y, size=6.0, color=HUBSS_ORANGE,\n                     max_w_figma=30)',
    'tracked_caps(c, num, fx=40, fy=y, size=6.5, color=HUBSS_ORANGE,\n                     max_w_figma=30)')
sub('draw_text_block(c, claim, fx=70, fy=y, font_size_figma=11,\n                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.3, max_w_figma=350)',
    'draw_text_block(c, claim, fx=70, fy=y, font_size_figma=14.5,\n                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.3, max_w_figma=350)')
sub('draw_text_block(c, detail, fx=70, fy=y + 16, font_size_figma=8.5,\n                        color=CMYK_TEXT_MID, max_w_figma=350, leading_figma=12)',
    'draw_text_block(c, detail, fx=70, fy=y + 16, font_size_figma=8.6,\n                        color=CMYK_TEXT_MID, max_w_figma=350, leading_figma=11.2)')

# ---- eyebrow snaps to 7.5 ----
for old_eb, new_eb in [
    ('tracked_caps(c, "Four Reasons", fx=40, fy=50, size=6.5, color=HUBSS_ORANGE)',
     'tracked_caps(c, "Four Reasons", fx=40, fy=50, size=7.5, color=HUBSS_ORANGE)'),
    ('tracked_caps(c, "An Invitation", fx=LX, fy=66, size=7.0,',
     'tracked_caps(c, "An Invitation", fx=LX, fy=66, size=7.5,'),
    ('tracked_caps(c, "Position", fx=30, fy=70, size=6.5,',
     'tracked_caps(c, "Position", fx=30, fy=70, size=7.5,'),
    ('tracked_caps(c, "How We Work", fx=30, fy=50, size=7.0, color=HUBSS_ORANGE)',
     'tracked_caps(c, "How We Work", fx=30, fy=50, size=7.5, color=HUBSS_ORANGE)'),
    ('tracked_caps(c, "By the Numbers", fx=30, fy=40, size=6.5,',
     'tracked_caps(c, "By the Numbers", fx=30, fy=40, size=7.5,'),
    ('tracked_caps(c, "Product Reference", fx=30, fy=40, size=7.0, color=HUBSS_ORANGE)',
     'tracked_caps(c, "Product Reference", fx=30, fy=40, size=7.5, color=HUBSS_ORANGE)'),
    ('tracked_caps(c, "Field Notes", fx=30, fy=40, size=6.5,',
     'tracked_caps(c, "Field Notes", fx=30, fy=40, size=7.5,'),
    ('tracked_caps(c, "HUB Certified Installer", fx=30, fy=30, size=7.5,',
     'tracked_caps(c, "HUB Certified Installer", fx=30, fy=30, size=7.5,'),
    ('tracked_caps(c, "Two Offices. One Network.", fx=30, fy=14, size=5.5,',
     'tracked_caps(c, "Two Offices. One Network.", fx=30, fy=14, size=7.5,'),
]:
    if old_eb == new_eb:
        continue
    sub(old_eb, new_eb)

p.write_text(s, encoding="utf-8")
print(f"applied {len(applied)} substitutions OK")
