# Druga verzija obrade: cijele glave u lučnim okvirima (kao lukovi apside),
# bez tamnih ovala; katedrala bez odsječenog lijevog dijela.
import numpy as np, cv2
from PIL import Image
exec(open('obrada-slika.py').read().split("heads={")[0])  # tone, grain, normal_map, save_* ...

def arch_alpha(h, w, aa=1.5):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    r = w / 2
    # pravokutnik s polukružnim vrhom
    d_top = np.hypot(x - r, y - r) - r          # <0 unutar kruga
    inside_rect = y >= r
    d = np.where(inside_rect, np.maximum(np.abs(x - r) - r, -1e9), d_top)
    d = np.where(inside_rect, np.maximum(d, y - (h - 1)), d)
    return np.clip(0.5 - d / aa, 0, 1)

def inner_shade(h, w):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    v = np.hypot((x / w - 0.5) / 0.62, (y / h - 0.45) / 0.72)
    return np.clip(1.08 - 0.32 * v ** 2, 0.62, 1.0)

heads = {  # ime: (slika, okvir 4:5 u 1x koordinatama)
    'glava-1': ('4', (180, 75, 335, 269)),    # bradati starac
    'glava-2': ('4', (295, 162, 420, 318)),   # mlada žena u profilu
    'glava-3': ('4', (460, 178, 580, 328)),   # muškarac s brkovima
    'glava-4': ('3', (40, 0, 330, 362)),      # muškarac s kapom
    'glava-5': ('3', (385, 206, 585, 456)),   # muškarac s turbanom
}
for name, (n, b) in heads.items():
    rgb, _ = load(n)
    x0, y0, x1, y1 = [v * 4 for v in b]
    c = rgb[y0:y1, x0:x1]
    h, w = c.shape[:2]
    t = grain(tone(c, 0.8), 0.02) * inner_shade(h, w)[..., None]
    a = arch_alpha(h, w, aa=2.5)
    size = save_rgba(np.clip(t, 0, 1), a, name, 1100)
    save_rgb(normal_map(c), name + '-n', size)
    print(name, size)

# Katedrala: izrez od lijevog ruba zgrade (mala apsida je sada unutra)
rgb, m = load('2')
x0, y0, x1, y1 = [v * 4 for v in (82, 15, 430, 318)]
c = rgb[y0:y1, x0:x1]
a = np.clip((m[y0:y1, x0:x1] - 0.1) * 1.3, 0, 1)
h, w = a.shape
a = a * np.clip((h - np.arange(h)) / (h * 0.1), 0, 1)[:, None]
a = a * np.clip(np.arange(w) / (w * 0.012), 0, 1)[None, :]
print('katedrala', save_rgba(grain(tone(c, 0.7), 0.025), a, 'katedrala', 1300))
