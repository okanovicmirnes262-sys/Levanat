"""Glazba i efekti za reklamu v2 (apstraktni smjer), 30 s, 120 BPM, D-mol.

Sve je izvorno sintetizirano (oscilatori, šum, filtri), bez uzoraka i tuđe glazbe, pa je
izrađeno djelo slobodno za komercijalnu uporabu. Za objavu se može zamijeniti licenciranom
glazbom (verzija „bez glazbe” sadrži samo efekte).

Struktura (frameovi pri 60 fps, 1 udarac = 30 frameova):
  0–240     tama: udarac pri paljenju svjetla, dubok pad, puls na udarce, zrake (whoosh)
  240–540   ritam ulazi: kick, clap, hi-hat, bas uz sidechain; klikovi kartica, brzina
  540–900   raspad u čestice (šuštanje), arpeggio, signali u mreži (blipovi)
  900–1260  tri akcenta za tri strukture, puni ritam
  1260–1330 ritam stane, riser → udarac na bljesku (1330)
  1330–1800 logo i poziv: pad, svjetlucanje, mirni kraj
Pokretanje: python alati/zvuk2.py  → public/audio/v2-glazba.wav, v2-efekti.wav
"""
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from zvuk import (  # noqa: E402
    N, SR, UDARAC, bas, blip, dodaj, filt, hat, impact, kick, klik, normaliziraj, nota, pad, pluck, riser,
    spremi, svjetlucanje, t, whoosh, zvonce,
)

rng = np.random.default_rng(23)


def fr(frame):
    return frame / 60


def clap():
    x = t(0.25)
    s = filt(rng.standard_normal(len(x)), "bandpass", [900, 3200], 2)
    env = np.zeros_like(x)
    for k, d in enumerate((0, 0.011, 0.022)):  # tri brza udara pa rep
        i = int(d * SR)
        env[i:] += np.exp(-(x[: len(x) - i]) * (140 if k < 2 else 16)) * (0.7 if k < 2 else 1)
    return s * env * 0.35


def sub(freq, trajanje):
    x = t(trajanje)
    return np.sin(2 * np.pi * freq * x) * np.minimum(1, x / 0.02) * np.minimum(1, (trajanje - x) / 0.05) * 0.5


def obrnuti_val(trajanje):
    """Obrnuti „swell”: pad koji raste prema udarcu."""
    s = pad([nota("D4"), nota("A4"), nota("F5")], trajanje)
    s = s[::-1] * np.linspace(0, 1, len(s)) ** 2
    return s * 1.6


def sustanje(trajanje):
    """Čestice: gusti sitni klikovi s filtrom koji se zatvara."""
    x = t(trajanje)
    s = np.zeros_like(x)
    for _ in range(int(trajanje * 260)):
        i = rng.integers(0, len(x) - 200)
        s[i : i + 60] += rng.standard_normal(60) * np.exp(-np.arange(60) / 8) * rng.uniform(0.2, 1)
    s = filt(s, "highpass", 2500)
    return s * np.linspace(1, 0.2, len(s)) * 0.18


def akcent(freq):
    n = int(SR * 1.6)
    out = np.zeros(n)
    for z, g in ((impact(), 0.45), (zvonce(), 0.8), (pluck(freq * 2), 2.0)):
        out[: min(n, len(z))] += z[:n] * g
    return out


def glazba():
    buf = np.zeros((N, 2))
    # D-mol: Dm – Bb – F – C (po 2 takta)
    akordi = [
        ("D2", ["D4", "F4", "A4"]),
        ("A#1", ["D4", "F4", "A#4"]),
        ("F2", ["C4", "F4", "A4"]),
        ("C2", ["C4", "E4", "G4"]),
    ]
    ritam_od, ritam_do = fr(240), fr(1262)
    sidechain = np.ones(N)

    # uvodni udarac i dubok ton pri paljenju svjetla
    dodaj(buf, impact(), fr(6), gain=1.0)
    dodaj(buf, sub(nota("D1") * 2, 3.8), fr(6), gain=0.7)

    for takt in range(15):
        pocetak = takt * 4 * UDARAC
        korijen, akord = akordi[(takt // 2) % 4]
        if takt % 2 == 0:
            g = 0.6 if pocetak < ritam_od else 0.85
            if pocetak >= fr(1330):
                g = 1.9
            dodaj(buf, pad([nota(n) for n in akord], 8 * UDARAC), pocetak, gain=g)
        for u in range(4):
            kad = pocetak + u * UDARAC
            if kad < ritam_od and kad > 0.4:
                # uvod: tihi puls na udarce (srce točke svjetla)
                dodaj(buf, sub(nota("D2"), 0.18) * np.exp(-t(0.18) * 14), kad, gain=0.6)
            if ritam_od <= kad < ritam_do:
                dodaj(buf, kick(), kad, gain=0.9)
                i = int(kad * SR)
                dio = sidechain[i : i + int(0.35 * SR)]
                dio *= 1 - 0.55 * np.exp(-t(0.35)[: len(dio)] / 0.09)
                if u in (1, 3):
                    dodaj(buf, clap(), kad, pan=0.05, gain=0.9)
                dodaj(buf, hat(), kad + UDARAC / 2, pan=0.25, gain=0.75)
                if kad >= fr(540):
                    dodaj(buf, hat(), kad + UDARAC / 4, pan=-0.25, gain=0.35)
                    dodaj(buf, hat(), kad + UDARAC * 3 / 4, pan=-0.25, gain=0.35)
                for o in range(2):
                    dodaj(buf, bas(nota(korijen), UDARAC / 2 * 0.9), kad + o * UDARAC / 2, gain=0.75)
            # arpeggio od mreže do spajanja (9–21 s)
            if fr(540) <= kad < ritam_do:
                for s16 in range(4):
                    n = akord[(u * 4 + s16) % 3]
                    dodaj(buf, pluck(nota(n) * 2), kad + s16 * UDARAC / 4, pan=0.45 if s16 % 2 else -0.45, gain=0.7)
            # mirni kraj: rijetki pluck na udarce
            if kad >= fr(1440) and u % 2 == 0:
                dodaj(buf, pluck(nota(akord[u % 3]) * 2), kad, pan=0.3 if u else -0.3, gain=0.5)

    buf *= sidechain[:, None]
    dodaj(buf, obrnuti_val(1.2), fr(240) - 1.2, gain=0.6)
    dodaj(buf, riser(1.2), fr(1262), gain=0.9)
    dodaj(buf, obrnuti_val(1.1), fr(1330) - 1.1, gain=0.7)
    dodaj(buf, impact(), fr(1330), gain=1.0)
    dodaj(buf, sub(nota("D1") * 2, 3.0), fr(1330), gain=0.6)

    fade = np.ones(N)
    fade[-int(1.2 * SR):] = np.linspace(1, 0, int(1.2 * SR)) ** 1.6
    buf *= fade[:, None]
    d = int(0.375 * SR)
    jeka = np.zeros_like(buf)
    jeka[d:] = buf[:-d] * 0.2
    jeka = np.stack([filt(jeka[:, 0], "lowpass", 3500), filt(jeka[:, 1], "lowpass", 3500)], axis=1)
    return normaliziraj(buf + jeka[:, ::-1])


def efekti():
    buf = np.zeros((N, 2))
    dodaj(buf, svjetlucanje(1.6), fr(8), gain=1.2)  # točka se upali
    dodaj(buf, whoosh(0.8), fr(96) - 0.2, gain=0.8)  # zrake
    dodaj(buf, svjetlucanje(1.2), fr(120), gain=0.8)  # mreža
    dodaj(buf, whoosh(), fr(238) - 0.25, gain=0.7)
    for i, frame in enumerate((266, 296, 326, 342, 358)):  # kartice se slažu
        dodaj(buf, whoosh(0.3), fr(frame) - 0.18, gain=0.35, pan=-0.4 + i * 0.2)
        dodaj(buf, klik(), fr(frame) + 0.12, pan=-0.3 + i * 0.15, gain=1.1)
    dodaj(buf, whoosh(0.5), fr(398), gain=0.8)  # brza izvedba
    dodaj(buf, svjetlucanje(1.0), fr(418), gain=0.7)
    dodaj(buf, sustanje(1.5), fr(540), gain=1.0)  # raspad u čestice
    for k in range(18):  # signali u mreži
        frame = 690 + k * 11 + (k % 3) * 3
        dodaj(buf, blip(900 + (k % 5) * 160, 1300 + (k % 5) * 160), fr(frame), pan=((k * 37) % 20) / 10 - 1, gain=0.5)
    for i, frame in enumerate((904, 1004, 1104)):  # tri strukture
        dodaj(buf, whoosh(0.4), fr(frame) - 0.3, gain=0.5)
        dodaj(buf, akcent(nota(["D5", "F5", "A5"][i])), fr(frame) + 0.05, gain=0.7)
    dodaj(buf, whoosh(0.6), fr(1196), gain=0.6)  # red
    dodaj(buf, whoosh(0.9), fr(1262), gain=0.8)  # spirala
    dodaj(buf, svjetlucanje(2.2), fr(1334), gain=1.3)  # iscrtavanje logotipa
    dodaj(buf, whoosh(0.4), fr(1432) - 0.2, gain=0.5)  # natpis
    dodaj(buf, klik(), fr(1612), gain=1.2)  # poziv
    dodaj(buf, svjetlucanje(1.0), fr(1664), gain=0.6)
    return normaliziraj(buf, 0.8)


if __name__ == "__main__":
    spremi("v2-glazba.wav", glazba())
    spremi("v2-efekti.wav", efekti())
