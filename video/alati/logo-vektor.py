"""Vektorizacija Levanatovog logotipa iz slike (public/logo/izvor.png) u čisti SVG.

Slika se poveća 4×, razdvoji na svijetle oblike (okvir, „L”, gornji val, natpis) i sivi donji val,
a obrisi (s rupama) zapišu se kao SVG putanje s fill-rule evenodd.
Pokretanje (OpenCV): python alati/logo-vektor.py  → public/logo/ikona.svg, public/logo/natpis.svg
"""
from pathlib import Path

import cv2
import numpy as np

KORIJEN = Path(__file__).resolve().parents[1] / "public" / "logo"
SVIJETLA = "#f4eeff"
SIVA = "#bfbdd1"
S = 4  # povećanje radi glatkih obrisa

img = cv2.imread(str(KORIJEN / "izvor.png"))
sivo = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
veliko = cv2.resize(sivo, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC)
maska = (veliko > 110).astype(np.uint8) * 255


def putanje(kutija):
    """Obrisi unutar kutije (x0, y0, x1, y1 u originalnim px) → [(boja, d)] u koordinatama kutije."""
    x0, y0, x1, y1 = kutija
    m = np.zeros_like(maska)
    m[y0 * S : y1 * S, x0 * S : x1 * S] = maska[y0 * S : y1 * S, x0 * S : x1 * S]
    obrisi, hijer = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    hijer = hijer[0]
    out = []
    for i, c in enumerate(obrisi):
        if hijer[i][3] != -1 or cv2.contourArea(c) < 40 * S * S:
            continue  # rupe se dodaju uz roditelja; sitnice se preskaču
        dijelovi = [c]
        j = hijer[i][2]
        while j != -1:
            if cv2.contourArea(obrisi[j]) > 20 * S * S:
                dijelovi.append(obrisi[j])
            j = hijer[j][0]
        # boja: prosječna svjetlina unutar oblika (bez rubova)
        ispuna = np.zeros_like(m)
        cv2.drawContours(ispuna, dijelovi, -1, 255, -1, hierarchy=None)
        ispuna = cv2.erode(ispuna, np.ones((9, 9), np.uint8))
        prosjek = veliko[ispuna > 0].mean() if (ispuna > 0).any() else 255
        boja = SVIJETLA if prosjek > 222 else SIVA
        d = []
        for dio in dijelovi:
            aprox = cv2.approxPolyDP(dio, 1.2, True)[:, 0, :].astype(np.float64) / S
            aprox -= (x0, y0)
            d.append("M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in aprox) + " Z")
        out.append((boja, " ".join(d)))
    return out


MODUL = {}


def spremi(ime, kutija):
    x0, y0, x1, y1 = kutija
    w, h = x1 - x0, y1 - y0
    dijelovi = putanje(kutija)
    MODUL[ime.split(".")[0]] = (w, h, dijelovi)
    tijela = "".join(f'<path fill="{b}" fill-rule="evenodd" d="{d}"/>' for b, d in dijelovi)
    (KORIJEN / ime).write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{tijela}</svg>\n'
    )
    print(ime, w, "×", h, len(tijela) // 1024, "KB")


# kutije oko ikone i natpisa (originalne koordinate slike 1254 × 1254)
spremi("ikona.svg", (320, 195, 935, 790))
spremi("natpis.svg", (225, 820, 1030, 995))

# isti oblici kao TypeScript modul, da se logo u videu crta izravno (bez učitavanja datoteka)
ts = ["// Generirano: alati/logo-vektor.py (ne uređivati ručno).", ""]
for ime, (w, h, dijelovi) in MODUL.items():
    ts.append(f"export const {ime.upper()} = {{ w: {w}, h: {h}, dijelovi: [")
    ts += [f"  {{ boja: '{b}', d: '{d}' }}," for b, d in dijelovi]
    ts.append("] };")
    ts.append("")
(Path(__file__).resolve().parents[1] / "src" / "v2" / "logoPutanje.ts").write_text("\n".join(ts))
print("src/v2/logoPutanje.ts")
