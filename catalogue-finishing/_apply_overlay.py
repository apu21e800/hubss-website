"""FINAL PASS: wire the one overlay_scrim into every photo-overlay archetype
+ promote the DPS caption role to 21 + fix the L&L CTA pill contrast."""
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "catalog-print-build" / "src" / "final_catalog.py"
s = p.read_text(encoding="utf-8")
n = 0


def sub(old, new, cnt=1):
    global s, n
    c = s.count(old)
    assert c == cnt, f"expected {cnt}, found {c}: {old[:60]!r}"
    s = s.replace(old, new)
    n += 1


# 1) COVER — lighten the full-frame vignette (still seats the top logo) and
#    add the standard bottom scrim for the masthead.
sub('''    c.saveState()
    c.setFillColorRGB(8 / 255, 13 / 255, 22 / 255)  # HUBSS navy
    c.setFillAlpha(0.50)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillAlpha(1.0)
    c.restoreState()
    # White-text HUBSS logo top-left (Vernon's call).''',
'''    # Light full-frame vignette seats the top-left white logo on the busy
    # Musqueam medallion; the bottom overlay scrim (below) carries the
    # masthead to >=4.5:1 as part of the book-wide legibility system.
    c.saveState()
    c.setFillColorRGB(8 / 255, 13 / 255, 22 / 255)  # HUBSS navy
    c.setFillAlpha(0.32)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillAlpha(1.0)
    c.restoreState()
    overlay_scrim(c, 358)
    # White-text HUBSS logo top-left (Vernon's call).''')

# 2) SECTION DIVIDER — replace the old mid-ramp wash with the constant-floor
#    scrim (text was sitting at the gradient's weak midpoint).
sub('''    scrim = _make_navy_wash_png(height_px=420, top_alpha=0, bottom_alpha=180)
    c.drawImage(str(scrim), 0, 0, width=PAGE_W, height=BLEED + 260 * SCALE,
                preserveAspectRatio=False, mask='auto')
    # §8 — the divider's dot + short rule carry the section accent,''',
'''    overlay_scrim(c, 296)   # covers eyebrow (302) + title (342) in the floor zone
    # §8 — the divider's dot + short rule carry the section accent,''')

# 3) NETWORK DIVIDER — same swap.
sub('''    scrim = _make_navy_wash_png(height_px=420, top_alpha=0, bottom_alpha=180)
    c.drawImage(str(scrim), 0, 0, width=PAGE_W, height=BLEED + 260 * SCALE,
                preserveAspectRatio=False, mask='auto')
    thin_rule(c, fx=28, fy=313, w_figma=28,''',
'''    overlay_scrim(c, 305)   # covers rule (313) + eyebrow (322) + title (350)
    thin_rule(c, fx=28, fy=313, w_figma=28,''')

# 4) DPS PHOTO CAPTION — scrim + promote caption 14.5 -> 21 (display, arm's
#    length across a 12" spread) + reflow label/caption into the floor zone.
sub('''    # v45 — Vernon's call: 'IN THE FIELD scrim looks like shit.' Drop
    # the bottom scrim. Type on photo. White label/caption read on the
    # photo's natural lower-edge tones; if a specific photo can't hold
    # them, swap the photo rather than reintroducing a gradient.
    tracked_caps(c, label, fx=28, fy=350, size=6.5,
                 color=HUBSS_ORANGE, max_w_figma=394)
    draw_text_block(c, caption, fx=28, fy=370, font_size_figma=14.5,
                    weight=800, color=HUBSS_WHITE, tracking=-0.3,
                    max_w_figma=394, leading_figma=16)''',
'''    # FINAL PASS (supersedes the v45 no-scrim note): legibility wins.
    # One book-wide overlay scrim + caption promoted to the 21 display tier
    # so spread captions read at arm's length.
    overlay_scrim(c, 320)
    tracked_caps(c, label, fx=28, fy=326, size=7.5,
                 color=HUBSS_ORANGE, max_w_figma=394)
    draw_text_block(c, caption, fx=28, fy=344, font_size_figma=21,
                    weight=800, color=HUBSS_WHITE, tracking=-0.4,
                    max_w_figma=394, leading_figma=23)''')

# 5) PROCESS-STRIP RECTO — replace its bespoke short wash with the system.
sub('''    # Short bottom wash (same family as the section-opener scrim) so the
    # white caption line clears AA contrast on the bright surface.
    scrim = _make_navy_wash_png(height_px=240, top_alpha=0, bottom_alpha=185)
    c.drawImage(str(scrim), 0, 0, width=PAGE_W, height=BLEED + 110 * SCALE,
                preserveAspectRatio=False, mask='auto')
    orange_dot(c, fx=24, fy=421, r_figma=1.3)
    tracked_caps(c, "The result — pattern and colour, fused into the surface",
                 fx=32, fy=418, size=7.5, color=HUBSS_WHITE, max_w_figma=390)''',
'''    overlay_scrim(c, 404)   # book-wide system (was a bespoke short wash)
    orange_dot(c, fx=24, fy=421, r_figma=1.3)
    tracked_caps(c, "The result — pattern and colour, fused into the surface",
                 fx=32, fy=418, size=7.5, color=HUBSS_WHITE, max_w_figma=390)''')

# 6) L&L CTA PILL — white-on-orange measured 2.71:1. Dark navy ink on the
#    orange pill is ~6.8:1 and a punchier button. (Brand orange unchanged.)
sub('''    draw_text_block(c, "BOOK NOW   ·   hubss.com/lnl", fx=cta_x,
                    fy=cta_y + cta_h / 2 - 4.5, font_size_figma=8.6,
                    weight=800, color=HUBSS_WHITE, tracking=1.2,
                    max_w_figma=cta_w, align="center")''',
'''    draw_text_block(c, "BOOK NOW   ·   hubss.com/lnl", fx=cta_x,
                    fy=cta_y + cta_h / 2 - 4.5, font_size_figma=8.6,
                    weight=800, color=HUBSS_NAVY_RICH, tracking=1.2,
                    max_w_figma=cta_w, align="center")''')

p.write_text(s, encoding="utf-8")
print(f"applied {n} overlay-wiring substitutions OK")
