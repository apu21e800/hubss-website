"""Generate FINAL-PASS-AUDIT.md from the workflow audit JSON + contrast probe."""
import json
from pathlib import Path
from collections import Counter, defaultdict

TASK = Path(r"C:\Users\cleve\AppData\Local\Temp\claude\C--Users-cleve-Based-Agency-based-agncy-os-Web-Projects-hubss-website\fa4bca3f-d157-4ffb-9eae-6dd30e70bf8f\tasks\wd42k0br1.output")
OUT = Path(__file__).resolve().parent / "FINAL-PASS-AUDIT.md"

d = json.load(open(TASK, encoding="utf-8"))
r = d.get("result", d)
issues = r["issues"]
clean = sorted(set(r.get("clean", [])))
by_class = Counter(i["klass"] for i in issues)
by_sev = Counter(i["severity"] for i in issues)
SEV = {"critical": 0, "major": 1, "minor": 2}

L = []
w = L.append
w("# HUBSS Catalogue 2026 — FINAL-PASS AUDIT (DDB-grade)\n")
w("Per-page visual audit of the **current v53 build** (6×6, FOGRA-corrected). "
  "Method: 12 parallel review agents visually inspected all 116 trim renders, plus an "
  "objective WCAG-contrast probe on text-on-image pages, plus a viewer-CSS check. "
  "**No fixes applied — this is the Phase-1 inventory for Vernon's sign-off.**\n")
w(f"**{len(issues)} issues** — {by_sev['critical']} critical · {by_sev['major']} major · "
  f"{by_sev['minor']} minor · across {len(set(i['page'] for i in issues))} pages. "
  f"**{len(clean)} pages clean.**\n")
w(f"By type: " + " · ".join(f"{k} {v}" for k, v in by_class.most_common()) + "\n")

w("\n## Systematic themes (fix at the archetype, not per-page)\n")
THEMES = [
 ("A. Application archetype — headline overlaps body",
  "When a tagline wraps to 2 lines it collides with the body block. **p43, p45, p47, p48** "
  "(and audit-confirmed pattern). Body also crowds the bottom edge (p37, p40). "
  "FIX: increase H1→body leading / push body down a fixed amount, or cap tagline to 1 line."),
 ("B. Application + project SPREAD symmetry (Vernon's ask)",
  "Every application page is the same image-top/white-info-bottom structure, so facing pages read "
  "identical (p40–49). Vernon wants spreads to ALTERNATE: full-bleed image one side, white info card "
  "the other. Same for project spreads with near-duplicate photos (**p95/96, p97/98**). "
  "FIX: re-architect application/project into 2-page asymmetric spreads (he OK'd more pages / fewer apps)."),
 ("C. Section openers — no scrim, title too big / too low",
  "White title + caps sit on bare photo with NO scrim → fails contrast (p11 2.1:1, p36 2.8:1, p56 2.0:1, "
  "p106 1.6:1; p99/p105 eyebrows too). p36 'Applications.' is 64pt and descenders touch the trim. "
  "FIX: add a soft bottom vignette scrim, drop title ~10–14pt, raise the block off the edge."),
 ("D. Image↔copy mismatches (more than Stage A caught)",
  "CRITICAL: p80 White Rock Pier→residential street; p88 Sechelt→**Terry Fox map** (still!). "
  "MAJOR: p16 StreetBond→splash-pad rubber; p48 'premium'→dingy EV lot; p65 modal→grey plaza; "
  "p69 'W 1ST STREET'→US-looking seal; p72 Vancouver BIA→grey paver; p86 Every Child Matters→plain tan; "
  "p90 Simcoe Rainbow→grey unpainted. FIX: re-source from D:/STUDIO-01 + swap at source."),
 ("E. p84 Kitchener — void from the detail=None fix",
  "Setting Kitchener detail=None (to kill the duplicate) left the top ~70% blank with text jammed at "
  "the bottom. FIX: vertically centre the story block, or give p84 a dignified navy story panel."),
 ("F. Installer [LOGO] placeholders",
  "p100–103 still show grey '[LOGO]' boxes. FIX: drop in real installer logos or remove the slot."),
 ("G. Lunch & Learn (p109) — redesign",
  "Odd dog-in-hardhat photo, bullet text overlap ('team' collides with next bullet), unbalanced "
  "composition. FIX: redesign (3 options below) — Vernon picks direction."),
 ("H. Bottom-edge / overflow clipping",
  "p116 copyright clipped at edge; p102 body overflows onto the orange rule; p36 title at trim. "
  "FIX: enforce a bottom safe-margin guard across these renderers."),
 ("I. Flipbook VIEWER shadow (not print)",
  "The 'weird shadow at the bottom' (p44 etc.) is the viewer CSS gradient at Flipbook.tsx:346 "
  "(linear-gradient 0deg rgba(0,0,0,0.55)…), NOT a baked-in artifact — print/web PDFs are clean. "
  "FIX: reduce/remove that gradient in Flipbook.tsx."),
 ("J. Minor editorial",
  "p7 repeats p5's four stats; p9 bare captionless full-bleed; p11 opener reads US-corporate-park "
  "(provenance). FIX: vary p7 stats, caption/justify p9, confirm p11 provenance."),
]
for t, body in THEMES:
    w(f"\n### {t}\n{body}\n")

w("\n## Objective WCAG contrast probe (white text on image)\n")
w("Large display text needs ≥3:1. Section openers FAIL (no scrim); DPS captions mixed. "
  "(Product/project heroes excluded — verified they use DARK text on white, not white-on-image.)\n")
w("| Page | role | white-text contrast | verdict |\n|---|---|---|---|\n"
  "| p11 | Products opener | 2.11:1 | FAIL |\n| p36 | Applications opener | 2.76:1 | FAIL |\n"
  "| p56 | Projects opener | 1.96:1 | FAIL |\n| p99 | Network opener | 3.35:1 | pass |\n"
  "| p106 | Reference opener | 1.63:1 | FAIL |\n| p35 | In-the-Field DPS | 3.18:1 | borderline |\n"
  "| p78 | Every-Mark DPS | 1.93:1 | FAIL |\n| p101 | Built-to-Last DPS | 1.14:1 | FAIL |\n")

w("\n## Full per-page inventory (all issues)\n")
for sev in ["critical", "major", "minor"]:
    rows = sorted([i for i in issues if i["severity"] == sev], key=lambda x: x["page"])
    w(f"\n**{sev.upper()} ({len(rows)})**\n")
    for i in rows:
        w(f"- **p{i['page']}** `{i['klass']}` — {i['detail']}")
w(f"\n\n**Clean pages ({len(clean)}):** {', '.join('p'+str(p) for p in clean)}\n")

OUT.write_text("\n".join(L), encoding="utf-8")
print("wrote", OUT, "(", len(issues), "issues )")
