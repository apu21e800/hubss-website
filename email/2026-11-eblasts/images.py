"""Turn the Figma exports into the e-blast photos under public/email/.
Rows/features keep the sharpest size their source supports (2x or 3x of the
layout size); heroes 2x (1.6x where the source is smaller)."""
import os, sys
from PIL import Image, ImageChops, ImageStat
EX = sys.argv[1]; PUB = sys.argv[2]
BG_ROW, BG_SPLIT = (250, 249, 246), (243, 241, 235)

def flat(png, bg):
    im = Image.open(png).convert('RGBA')
    base = Image.new('RGBA', im.size, bg + (255,)); base.alpha_composite(im)
    return base.convert('RGB')

def save_jpg(im, path, q=82):
    im.save(path, 'JPEG', quality=q, optimize=True, progressive=True, subsampling='4:2:0')

def fit(im, w, h):
    return im if im.size == (w, h) else im.resize((w, h), Image.LANCZOS)

# (export id, folder, file, out w, out h, background)
E1 = [('192-6','hero-volume-5.jpg',1200,750,BG_ROW),('192-104','woodbridge-plow.jpg',400,300,BG_ROW),
      ('192-111','kitchener-lest-we-forget.jpg',400,300,BG_ROW),('192-118','kleinburg-first-snow.jpg',400,300,BG_ROW),
      ('192-125','mont-megantic-observatory.jpg',400,300,BG_ROW),('282-8','trafficpatternsxd.jpg',400,300,BG_ROW),
      ('494-879','trafficpatterns.jpg',600,438,BG_ROW),('501-111','streetbond-joyce-collingwood.jpg',600,438,BG_ROW),
      ('282-22','streetbondsr-canada-post-lot.jpg',600,450,BG_ROW),('292-3','printed-copy.jpg',480,640,BG_SPLIT)]
SETS = {
 2: [('497-890','hero-maple-ridge.jpg',1200,760,BG_ROW),('284-3','bc-childrens-labyrinth.jpg',480,640,BG_SPLIT),
     ('284-15','kitchener-kings-queens.jpg',600,450,BG_ROW),('284-22','toronto-geary-works.jpg',600,450,BG_ROW),
     ('284-29','bowen-island-snug-cove.jpg',400,300,BG_ROW),('284-47','streetbond.jpg',400,300,BG_ROW),
     ('284-55','streetbondsr-canada-post-lot.jpg',600,450,BG_ROW),('284-63','decomark.jpg',400,300,BG_ROW)],
 3: [('394-397','hero-toronto-premium-outlets.jpg',960,600,BG_ROW),('285-3','new-westminster-oxford-townhomes.jpg',720,960,BG_SPLIT),
     ('285-15','vancouver-granville-island.jpg',400,300,BG_ROW),('285-22','vaughan-audi-dealership.jpg',400,300,BG_ROW),
     ('285-29','oakville-fortinos.jpg',400,300,BG_ROW),('285-47','trafficpatternsxd.jpg',400,300,BG_ROW),
     ('285-55','streetprint.jpg',400,300,BG_ROW),('472-274','trafficpatterns.jpg',600,474,BG_ROW),
     ('501-119','streetbond-parking.jpg',600,450,BG_ROW)],
 4: [('223-6','hero-toronto-ttc-bus-lane.jpg',1200,750,BG_ROW),('285-72','woodbridge-avenue-crosswalk.jpg',480,640,BG_SPLIT),
     ('285-84','toronto-emery-village.jpg',600,450,BG_ROW),('285-91','verdun-flush-medians.jpg',400,300,BG_ROW),
     ('496-885','georgina-every-child-matters.jpg',600,450,BG_ROW),('285-116','mmax.jpg',400,300,BG_ROW),
     ('285-124','trafficpatternsxd.jpg',400,300,BG_ROW),('498-895','trafficpatterns-langley.jpg',600,450,BG_ROW)],
 5: [('224-6','hero-london-east-link.jpg',1200,750,BG_ROW),('285-141','richmond-brighouse-station.jpg',480,640,BG_SPLIT),
     ('285-153','waterloo-ion-crosswalk.jpg',600,450,BG_ROW),('285-160','york-region-highway-7.jpg',600,450,BG_ROW),
     ('285-167','kelowna-crosswalk.jpg',400,300,BG_ROW),('465-248','trafficpatternsxd.jpg',600,450,BG_ROW),
     ('285-193','mmax.jpg',400,300,BG_ROW),('498-899','trafficpatterns.jpg',600,450,BG_ROW)],
 6: [('225-6','hero-white-rock-seaside-stroll.jpg',1200,750,BG_ROW),('473-278','kitchener-veterans-crosswalk.jpg',384,392,BG_SPLIT),
     ('285-222','brantford-look-listen-live.jpg',600,450,BG_ROW),('285-229','vancouver-little-italy.jpg',400,300,BG_ROW),
     ('285-236','sechelt-pictograph-crosswalk.jpg',400,300,BG_ROW),('285-254','trafficpatterns.jpg',400,300,BG_ROW),
     ('285-262','duratherm.jpg',400,300,BG_ROW),('285-270','decomark.jpg',400,300,BG_ROW)],
}
def diff(a, b):
    A = a.convert('RGB'); B = b.convert('RGB').resize(A.size, Image.LANCZOS)
    return sum(ImageStat.Stat(ImageChops.difference(A, B)).mean) / 3

# E-blast 1: same files, same crops, sharper. Refuse any that doesn't match the live file.
d1 = os.path.join(PUB, '2026-11-eblast-1'); bad = []
for src, name, w, h, bg in E1:
    new = fit(flat(os.path.join(EX, src + '.png'), bg), w, h)
    old = Image.open(os.path.join(d1, name))
    dv = diff(old, new)
    if dv > 9: bad.append((name, round(dv, 1))); continue
    save_jpg(new, os.path.join(d1, name))
    print(f'e1 {name:36s} {old.size} -> {new.size}  diff {dv:.1f}')
for src, name, size in [('192-55', 'moose.png', (222, 222)), ('453-214', 'flag-canada.png', (57, 39))]:
    new = Image.open(os.path.join(EX, src + '.png')).convert('RGBA').resize(size, Image.LANCZOS)
    old = Image.open(os.path.join(d1, name)).convert('RGBA')
    dv = diff(old, new); print(f'e1 {name:36s} {old.size} -> {new.size}  diff {dv:.1f}')
    if dv > 12: bad.append((name, round(dv, 1))); continue
    new.save(os.path.join(d1, name), optimize=True)
logo = Image.open(os.path.join(EX, '192-4.png')).convert('RGBA')
canvas = Image.new('RGBA', (450, 111), (0, 0, 0, 0)); canvas.alpha_composite(logo, (0, (111 - logo.size[1]) // 2))
old = Image.open(os.path.join(d1, 'hub-logo-white.png')).convert('RGBA')
dl = diff(Image.alpha_composite(Image.new('RGBA', old.size, (16,16,16,255)), old), Image.alpha_composite(Image.new('RGBA', canvas.size, (16,16,16,255)), canvas))
print(f'e1 hub-logo-white.png {old.size} -> {canvas.size} diff {dl:.1f}')
if dl <= 12: canvas.save(os.path.join(d1, 'hub-logo-white.png'), optimize=True)
else: bad.append(('hub-logo-white.png', round(dl, 1)))
if bad: print('NOT REPLACED (no match):', bad)

for n, items in SETS.items():
    d = os.path.join(PUB, f'2026-11-eblast-{n}'); os.makedirs(d, exist_ok=True)
    for src, name, w, h, bg in items:
        im = fit(flat(os.path.join(EX, src + '.png'), bg), w, h)
        save_jpg(im, os.path.join(d, name), q=80 if w >= 960 else 82)
    tot = sum(os.path.getsize(os.path.join(d, f)) for f in os.listdir(d))
    print(f'e{n}: {len(items)} files, {tot // 1024} KB')
