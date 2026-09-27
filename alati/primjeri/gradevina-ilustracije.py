"""Ilustracije za demo primjer „građevina” (Veluna gradnja): arhitektura u sumrak, tamnoplavo + topla svjetla.

Izvorni rad (nije fotografija ni tuđa slika) — pročelja se crtaju ravno pa perspektivno izobliče.
Pokretanje: python3 alati/primjeri/gradevina-ilustracije.py  → public/primjeri/gradevina/*.webp
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

IZLAZ = Path(__file__).resolve().parents[2] / "public" / "primjeri" / "gradevina"
TOPLO = (246, 196, 128)
TOPLO_JAKO = (255, 214, 150)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def nebo(w, h, gore=(96, 124, 168), dolje=(30, 44, 78), sjaj=None):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        d.line([(0, y), (w, y)], fill=lerp(gore, dolje, y / h))
    if sjaj:  # meki sjaj na horizontu
        sloj = Image.new("RGB", (w, h), sjaj)
        maska = Image.new("L", (w, h), 0)
        ImageDraw.Draw(maska).ellipse([-w * 0.2, h * 0.55, w * 1.2, h * 1.6], fill=90)
        img = Image.composite(sloj, img, maska.filter(ImageFilter.GaussianBlur(h // 6)))
    return img


def perspektiva(tekstura, cilj, velicina):
    """Izobliči pravokutnu teksturu u četverokut `cilj` (4 točke: gore-lijevo, gore-desno, dolje-desno, dolje-lijevo)."""
    w, h = tekstura.size
    izvor = [(0, 0), (w, 0), (w, h), (0, h)]
    # koeficijenti za Image.transform(PERSPECTIVE): preslikavanje odredišta u izvor
    a = []
    b = []
    for (x, y), (u, v) in zip(cilj, izvor):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        b += [u, v]
    koef = rijesi(a, b)
    rgba = tekstura.convert("RGBA")
    return rgba.transform(velicina, Image.PERSPECTIVE, koef, Image.BICUBIC)


def rijesi(a, b):
    n = len(b)
    m = [row[:] + [b[i]] for i, row in enumerate(a)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(m[r][c]))
        m[c], m[p] = m[p], m[c]
        for r in range(n):
            if r != c:
                f = m[r][c] / m[c][c]
                m[r] = [x - f * y for x, y in zip(m[r], m[c])]
    return [m[i][n] / m[i][i] for i in range(n)]


def procelje(w, h, stupci, redovi, boja=(28, 36, 58), okvir=(16, 20, 34), upaljeno=0.35, rng=None, cigla=False,
             balkoni=False, staklo=False):
    rng = rng or random.Random(1)
    img = Image.new("RGB", (w, h), boja)
    d = ImageDraw.Draw(img)
    if cigla:
        for y in range(0, h, 6):
            pomak = 0 if (y // 6) % 2 else 9
            for x in range(-pomak, w, 18):
                t = rng.uniform(-6, 6)
                d.rectangle([x, y, x + 16, y + 4], fill=tuple(max(0, int(c + t)) for c in boja))
    cw, rh = w / stupci, h / redovi
    for r in range(redovi):
        for c in range(stupci):
            x0, y0 = c * cw + cw * 0.14, r * rh + rh * 0.16
            x1, y1 = (c + 1) * cw - cw * 0.14, (r + 1) * rh - rh * 0.12
            if staklo:
                x0, x1, y0, y1 = c * cw + 2, (c + 1) * cw - 2, r * rh + 3, (r + 1) * rh - 3
            svijetli = rng.random() < upaljeno
            visina = max(1, int(y1 - y0))
            if svijetli:
                # topla prostorija: svjetlije gore (lampa), tamnije dolje (namještaj)
                gore = lerp(TOPLO_JAKO, TOPLO, rng.random())
                dolje = lerp(gore, (96, 64, 44), 0.55)
                for k in range(visina):
                    d.line([(x0, y0 + k), (x1, y0 + k)], fill=lerp(gore, dolje, (k / visina) ** 1.4))
                if rng.random() < 0.5:  # zavjesa ili silueta
                    xz = x0 + (x1 - x0) * rng.uniform(0.55, 0.8)
                    d.rectangle([xz, y0, x1, y1], fill=lerp(dolje, (60, 44, 36), 0.4))
            else:
                t = rng.random() * (0.9 if staklo else 0.5)
                gore = lerp((52, 72, 110), (86, 110, 150), t)
                dolje = lerp(gore, (20, 28, 46), 0.6)
                for k in range(visina):
                    d.line([(x0, y0 + k), (x1, y0 + k)], fill=lerp(gore, dolje, k / visina))
            d.rectangle([x0, y0, x1, y1], outline=okvir, width=3)
            if balkoni:
                d.rectangle([x0 - cw * 0.1, y1 - 2, x1 + cw * 0.1, y1 + rh * 0.08], fill=(12, 16, 28))
                for k in range(int(x0 - cw * 0.1), int(x1 + cw * 0.1), 7):
                    d.line([(k, y1 - rh * 0.22), (k, y1)], fill=(18, 24, 40), width=2)
    return img


def sjaj_prozora(img, jacina=0.55):
    """Topli „bloom” oko upaljenih prozora."""
    svijetlo = img.convert("L").point(lambda p: 255 if p > 150 else 0)
    bloom = Image.new("RGB", img.size, TOPLO)
    maska = svijetlo.filter(ImageFilter.GaussianBlur(18)).point(lambda p: int(p * jacina))
    return Image.composite(bloom, img, maska)


def zrno_i_vinjeta(img, jacina=10, seed=3):
    rng = random.Random(seed)
    w, h = img.size
    sum_ = Image.effect_noise((w, h), jacina).convert("RGB")
    img = Image.blend(img, sum_, 0.04)
    vinjeta = Image.new("L", (w, h), 0)
    ImageDraw.Draw(vinjeta).ellipse([-w * 0.25, -h * 0.3, w * 1.25, h * 1.3], fill=255)
    vinjeta = vinjeta.filter(ImageFilter.GaussianBlur(min(w, h) // 5))
    tamno = Image.new("RGB", (w, h), (8, 12, 24))
    _ = rng
    return Image.composite(img, tamno, vinjeta)


def spremi(img, ime, kvaliteta=80):
    IZLAZ.mkdir(parents=True, exist_ok=True)
    img.save(IZLAZ / ime, "WEBP", quality=kvaliteta, method=6)
    print("✔", ime, img.size)


# --- 1) Naslovna: moderna kuća s prepuštenom pločom, pogled odozdo -----------------------------------------
def naslovna(w=1920, h=1200):
    rng = random.Random(7)
    img = nebo(w, h, (118, 146, 190), (44, 62, 102), sjaj=(150, 170, 205))
    # staklena stijena (perspektiva prema gore desno)
    tex = procelje(1200, 700, 7, 2, boja=(26, 34, 56), upaljeno=0.3, rng=rng, staklo=True)
    tex = sjaj_prozora(tex, 0.35)
    stijena = perspektiva(tex, [(260, 560), (1920, 330), (1920, 1200), (260, 1200)], (w, h))
    img.paste(stijena, (0, 0), stijena)
    d = ImageDraw.Draw(img)
    # prepuštena krovna ploča
    d.polygon([(180, 470), (1920, 150), (1920, 330), (240, 560)], fill=(22, 28, 44))
    d.polygon([(240, 560), (1920, 330), (1920, 360), (250, 590)], fill=(52, 64, 92))
    # vertikalne lamele ograde
    for i in range(0, 60):  # ograda terase samo u donjem dijelu
        x = 300 + i * 28
        y_gore = 960 - i * 3.2
        d.line([(x, y_gore), (x + 4, 1200)], fill=(24, 32, 54), width=4)
    d.polygon([(260, 950), (1920, 760), (1920, 778), (260, 970)], fill=(70, 86, 118))
    # tanke linije „mreže” (kao u dizajnu) dodaju se u CSS-u
    return zrno_i_vinjeta(img.filter(ImageFilter.GaussianBlur(0.6)), seed=1)


# --- 2) Stambena zgrada od tamne opeke s balkonima (sekcija „Zašto mi”) --------------------------------------
def zgrada_opeka(w=1920, h=900, seed=11):
    rng = random.Random(seed)
    img = nebo(w, h, (40, 58, 96), (20, 28, 50))
    tex = procelje(1400, 1000, 8, 6, boja=(34, 38, 52), upaljeno=0.28, rng=rng, cigla=True, balkoni=True)
    tex = sjaj_prozora(tex)
    lice = perspektiva(tex, [(620, 40), (1920, -160), (1920, 900), (620, 900)], (w, h))
    img.paste(lice, (0, 0), lice)
    tex2 = procelje(700, 1000, 3, 6, boja=(26, 30, 42), upaljeno=0.3, rng=rng, cigla=True)
    bok = perspektiva(sjaj_prozora(tex2, 0.4), [(260, 200), (620, 40), (620, 900), (260, 900)], (w, h))
    img.paste(bok, (0, 0), bok)
    return zrno_i_vinjeta(img, seed=seed)


# --- 3) Staklena poslovna zgrada ----------------------------------------------------------------------------
def staklena(w=1200, h=900, seed=21):
    rng = random.Random(seed)
    img = nebo(w, h, (140, 164, 200), (70, 90, 128), sjaj=(190, 200, 220))
    tex = procelje(900, 1200, 6, 10, boja=(40, 56, 84), upaljeno=0.12, rng=rng, staklo=True)
    lice = perspektiva(sjaj_prozora(tex, 0.3), [(180, 120), (820, 20), (820, 900), (180, 900)], (w, h))
    img.paste(lice, (0, 0), lice)
    tex2 = procelje(400, 1200, 2, 10, boja=(24, 32, 50), upaljeno=0.08, rng=rng, staklo=True)
    bok = perspektiva(tex2, [(820, 20), (1060, 110), (1060, 900), (820, 900)], (w, h))
    img.paste(bok, (0, 0), bok)
    d = ImageDraw.Draw(img)
    for i in range(0, 12):  # vertikalne lamele
        x = 1080 + i * 14
        d.line([(x, 60 + i * 6), (x, 900)], fill=(170, 180, 196), width=4)
    return zrno_i_vinjeta(img, seed=seed)


# --- 4) Gradilište s kranom -----------------------------------------------------------------------------------
def gradiliste(w=1200, h=900, seed=31):
    rng = random.Random(seed)
    img = nebo(w, h, (58, 96, 160), (18, 30, 60), sjaj=(90, 130, 190))
    d = ImageDraw.Draw(img)
    # skelet zgrade: ploče i stupovi
    for kat in range(7):
        y = 860 - kat * 95
        d.rectangle([180, y - 10, 760, y], fill=(20, 28, 46))
        for x in range(200, 760, 110):
            d.rectangle([x, y - 95, x + 14, y - 10], fill=(24, 32, 52))
        if kat < 5 and rng.random() < 0.8:
            x = rng.randrange(220, 680)
            d.rectangle([x, y - 60, x + 50, y - 22], fill=TOPLO)
    # kran
    d.rectangle([880, 120, 900, 900], fill=(14, 20, 34))
    for y in range(140, 900, 40):
        d.line([(880, y), (900, y + 40)], fill=(40, 52, 80), width=2)
    d.polygon([(520, 130), (1180, 110), (1180, 124), (520, 142)], fill=(14, 20, 34))
    d.line([(890, 60), (560, 132)], fill=(14, 20, 34), width=3)
    d.line([(890, 60), (1150, 116)], fill=(14, 20, 34), width=3)
    d.rectangle([882, 50, 898, 124], fill=(14, 20, 34))
    d.line([(640, 140), (640, 420)], fill=(14, 20, 34), width=2)
    d.rectangle([610, 420, 670, 450], fill=(14, 20, 34))
    d.ellipse([884, 46, 896, 58], fill=(255, 70, 60))
    img = sjaj_prozora(img, 0.5)
    return zrno_i_vinjeta(img, seed=seed)


# --- 5) Visoka zgrada s vertikalnim lamelama (sličica) -------------------------------------------------------
def lamele(w=900, h=900, seed=41):
    img = nebo(w, h, (60, 100, 170), (20, 40, 80), sjaj=(120, 160, 210))
    d = ImageDraw.Draw(img)
    for i in range(40):
        x0 = 150 + i * 16
        vrh = 40 + int(30 * math.sin(i / 6))
        d.polygon([(x0, vrh), (x0 + 10, vrh + 4), (x0 + 10 + i * 0.5, h), (x0 + i * 0.5, h)],
                  fill=lerp((210, 220, 235), (90, 110, 150), i / 40))
    return zrno_i_vinjeta(img, seed=seed)


# --- 6) Obiteljska kuća s ravnim krovom i bazenom -------------------------------------------------------------
def kuca(w=1200, h=900, seed=51):
    rng = random.Random(seed)
    img = nebo(w, h, (92, 118, 164), (34, 48, 84), sjaj=(170, 176, 200))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 700, w, h], fill=(22, 30, 46))  # teren
    # prizemlje (staklo) i kat (bijela kutija)
    tex = procelje(900, 260, 6, 1, boja=(30, 40, 60), upaljeno=0.7, rng=rng, staklo=True)
    img.paste(sjaj_prozora(tex, 0.45), (150, 460))
    d.rectangle([110, 250, 880, 460], fill=(214, 218, 226))
    d.rectangle([110, 440, 880, 460], fill=(160, 166, 180))
    tex2 = procelje(300, 150, 3, 1, boja=(214, 218, 226), okvir=(60, 70, 90), upaljeno=0.6, rng=rng)
    img.paste(sjaj_prozora(tex2, 0.4), (520, 280))
    d.rectangle([60, 236, 940, 252], fill=(40, 48, 64))  # krovna ploča
    # bazen s odrazom
    d.rectangle([200, 740, 1000, 800], fill=(40, 110, 150))
    for y in range(742, 800, 6):
        d.line([(210, y), (990, y)], fill=(70, 150, 190), width=1)
    return zrno_i_vinjeta(img.filter(ImageFilter.GaussianBlur(0.5)), seed=seed)


if __name__ == "__main__":
    spremi(naslovna(), "naslovna.webp", 78)
    spremi(zgrada_opeka(), "zasto-mi.webp", 78)
    spremi(zgrada_opeka(1920, 900, seed=12).crop((700, 0, 1500, 900)), "obrazac.webp", 78)
    spremi(staklena(), "projekt-poslovni.webp")
    spremi(kuca(), "projekt-kuca.webp")
    spremi(zgrada_opeka(seed=13).crop((480, 0, 1680, 900)), "projekt-stambena.webp")
    # sličice: crtaju se u punoj veličini pa smanje
    spremi(staklena(seed=22).resize((600, 450), Image.LANCZOS), "mala-staklena.webp", 76)
    spremi(gradiliste().resize((600, 450), Image.LANCZOS), "mala-gradiliste.webp", 76)
    spremi(lamele().crop((0, 225, 900, 900)).resize((600, 450), Image.LANCZOS), "mala-lamele.webp", 76)
