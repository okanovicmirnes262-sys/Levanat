# Portreti poznatih Šibenčana: isti kameni ton, zrno i lučni okvir kao glave s katedrale.
import numpy as np
from PIL import Image
src = open('/tmp/claude-0/img/process2.py').read()
exec(open('/tmp/claude-0/img/process.py').read().split("heads={")[0])
exec(src[src.index('def arch_alpha'):src.index('heads = {')])
OUT = '/home/user/Levanat/src/assets/sibenik/'
items = {
    'drazen-petrovic': ('petrovic.jpg', (470, 70, 1430, 1270)),
    'juraj-dalmatinac': ('juraj_c_x2.png', None),
    'ante-supuk': ('supuk_c_x2.png', None),
    'faust-vrancic': ('vrancic.jpg', (0, 0, 390, 488)),
}
for name, (f, box) in items.items():
    im = Image.open(f).convert('RGB')
    if box: im = im.crop(box)
    w, h = im.size
    tw = round(h * 0.8)
    if tw < w: im = im.crop(((w - tw) // 2, 0, (w - tw) // 2 + tw, h))
    else: th = round(w * 1.25); im = im.crop((0, 0, w, min(h, th)))
    if im.width > 900: im = im.resize((900, round(900 * im.height / im.width)), Image.LANCZOS)
    c = np.asarray(im).astype(np.float32) / 255
    h, w = c.shape[:2]
    t = grain(tone(c, 0.9), 0.02) * inner_shade(h, w)[..., None] * (0.84 if name == 'faust-vrancic' else 1.0)
    a = arch_alpha(h, w, aa=2.5)
    out = Image.fromarray((np.dstack([np.clip(t, 0, 1), a]) * 255).astype(np.uint8), 'RGBA')
    out.save(OUT + name + '.webp', quality=92, method=6)
    print(name, out.size)
