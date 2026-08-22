"""Phase 3G — replace page_lunch_learn with the V3 'An Invitation' navy layout."""
import re
from pathlib import Path

FC = Path(__file__).resolve().parent.parent / "catalog-print-build" / "src" / "final_catalog.py"
src = FC.read_text(encoding="utf-8")

NEW = '''def page_lunch_learn(c):
    """v55 Phase 3G — 'An Invitation' navy treatment (Vernon: build V3 canonical).
    Premium/formal, brand-cohesive with the closing navy panels. Drops the mascot;
    orange CTA + QR on a white plate; bullets use dynamic spacing (no overlap)."""
    fill_bleed(c, HUBSS_NAVY_RICH)
    LX = 30
    thin_rule(c, fx=LX, fy=56, w_figma=32, color=HUBSS_ORANGE, weight_pt=2.5)
    tracked_caps(c, "An Invitation", fx=LX, fy=66, size=7.0,
                 color=HUBSS_ORANGE, max_w_figma=300)
    draw_text_block(c, "Lunch is on us.", fx=LX, fy=92, font_size_figma=42,
                    weight=800, color=HUBSS_WHITE, tracking=-1.2,
                    max_w_figma=390, leading_figma=46)
    draw_text_block(c, "Your spec is free.", fx=LX, fy=142, font_size_figma=42,
                    weight=800, color=HUBSS_ORANGE, tracking=-1.2,
                    max_w_figma=390, leading_figma=46)
    draw_text_block(c,
        "Forty-five minutes of technical depth, real project walkthroughs, "
        "and CE-credit education \\u2014 brought to your office over lunch.",
        fx=LX, fy=214, font_size_figma=11, color=CMYK_ON_DARK_BODY,
        max_w_figma=300, leading_figma=17)
    items = [
        "Tailored to your live and upcoming projects",
        "CE-credit continuing education for your team",
        "In person across Canada, or virtual \\u2014 your call",
    ]
    vy = 272
    for it in items:
        orange_dot(c, fx=LX + 1, fy=vy + 4, r_figma=1.5)
        draw_text_block(c, it, fx=LX + 12, fy=vy, font_size_figma=9.5,
                        weight=600, color=HUBSS_WHITE, max_w_figma=300,
                        leading_figma=13)
        vy += 22 + (8 if len(it) > 36 else 0)
    qr_path = ROOT / "assets" / "hubss-lunch-learn-qr.png"
    if qr_path.exists():
        QS, PAD, QF_X, QF_Y = 92, 8, 318, 262
        plate_x, plate_y = figma_to_pdf(QF_X - PAD, QF_Y - PAD)
        c.setFillColorRGB(1, 1, 1)
        c.rect(plate_x, plate_y - (QS + 2 * PAD) * SCALE,
               (QS + 2 * PAD) * SCALE, (QS + 2 * PAD) * SCALE, stroke=0, fill=1)
        qpx = BLEED + QF_X * SCALE
        qpy = BLEED + TRIM_H - (QF_Y + QS) * SCALE
        draw_image_box(c, str(qr_path), qpx, qpy, QS * SCALE, QS * SCALE,
                       cover=False, convert_to_cmyk=False)
        tracked_caps(c, "Scan to book", fx=QF_X - PAD, fy=QF_Y + QS + PAD + 5,
                     size=6.0, color=CMYK_ON_DARK_BODY,
                     max_w_figma=QS + 2 * PAD, align="center")
    cta_w, cta_h, cta_x, cta_y = 200, 24, LX, 376
    cx, cy = figma_to_pdf(cta_x, cta_y + cta_h)
    c.setFillColor(HUBSS_ORANGE)
    c.roundRect(cx, cy, cta_w * SCALE, cta_h * SCALE, 4 * SCALE, stroke=0, fill=1)
    draw_text_block(c, "BOOK NOW   \\u00b7   hubss.com/lnl", fx=cta_x,
                    fy=cta_y + cta_h / 2 - 4.5, font_size_figma=8.5,
                    weight=800, color=HUBSS_WHITE, tracking=1.2,
                    max_w_figma=cta_w, align="center")
    tracked_caps(c, "Cleve Stordy 604.309.8212    \\u00b7    Doug Bain 416.540.9287",
                 fx=LX, fy=418, size=6.0, color=CMYK_ON_DARK_BODY, max_w_figma=390)


'''.replace("\\u2014", "—").replace("\\u00b7", "·")

# Replace the whole function (def page_lunch_learn ... up to the next 'def page_contact')
pat = re.compile(r"def page_lunch_learn\(c\):.*?\n\ndef page_contact\(c\):", re.DOTALL)
assert pat.search(src), "page_lunch_learn block not found"
src2 = pat.sub(NEW + "def page_contact(c):", src, count=1)
assert src2 != src and src2.count("def page_lunch_learn") == 1
FC.write_text(src2, encoding="utf-8")
print("Replaced page_lunch_learn with V3 navy invitation.")
