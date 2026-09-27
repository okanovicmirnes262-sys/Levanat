"""Kontaktna ploča kontrolnih kadrova: python3 alati/ploca.py izlaz.png kadar1.png kadar2.png ..."""
import sys
from PIL import Image, ImageDraw
out, *kadrovi = sys.argv[1:]
w, h, stup = 360, 640, 4
red = (len(kadrovi) + stup - 1) // stup
ploca = Image.new('RGB', (stup * w, red * (h + 30)), (40, 40, 40))
d = ImageDraw.Draw(ploca)
for i, k in enumerate(kadrovi):
    im = Image.open(k).convert('RGB').resize((w, h))
    x, y = (i % stup) * w, (i // stup) * (h + 30)
    ploca.paste(im, (x, y + 30))
    d.text((x + 8, y + 8), k.split('/')[-1], fill=(255, 255, 255))
ploca.save(out)
