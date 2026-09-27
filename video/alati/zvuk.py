"""Izvorna glazbena podloga i zvučni efekti za Levanat reklamu (30 s, 120 BPM).

Sve je sintetizirano ovdje (oscilatori, šum, filtri), bez tuđih uzoraka ili snimki, pa je
slobodno za komercijalnu uporabu. Ovo je PRIVREMENA podloga: za objavu preporučujemo licenciranu
glazbu ili producenta (upute u README.md).

Pokretanje (numpy + scipy):
    python alati/zvuk.py   → public/audio/glazba.wav, public/audio/efekti.wav
"""
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
TRAJANJE = 30.0
BPM = 120
UDARAC = 60 / BPM  # 0,5 s
N = int(SR * TRAJANJE)
FPS = 60
rng = np.random.default_rng(7)
IZLAZ = Path(__file__).resolve().parents[1] / "public" / "audio"


def t(sec):
    return np.arange(int(SR * sec)) / SR


def filt(x, vrsta, f, red=2):
    sos = butter(red, f, btype=vrsta, fs=SR, output="sos")
    return sosfilt(sos, x)


def dodaj(buf, zvuk, kad, pan=0.0, gain=1.0):
    """Stereo: pan -1 (lijevo) … 1 (desno)."""
    i = int(kad * SR)
    if i >= N:
        return
    z = zvuk[: N - i] * gain
    l = np.cos((pan + 1) * np.pi / 4)
    d = np.sin((pan + 1) * np.pi / 4)
    buf[i : i + len(z), 0] += z * l
    buf[i : i + len(z), 1] += z * d


def nota(ime):
    imena = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}
    return 440.0 * 2 ** ((imena[ime[:-1]] + 12 * (int(ime[-1]) - 4)) / 12)


# ---------- instrumenti ----------

def kick():
    x = t(0.42)
    f = 46 + 110 * np.exp(-x * 38)
    faza = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(faza) * np.exp(-x * 9) * 0.95 + filt(rng.standard_normal(len(x)), "highpass", 3000) * np.exp(-x * 160) * 0.08


def hat(otvoren=False):
    x = t(0.2 if otvoren else 0.06)
    s = filt(rng.standard_normal(len(x)), "highpass", 7500)
    return s * np.exp(-x * (18 if otvoren else 70)) * 0.22


def pila(freq, trajanje, detune=0.0):
    x = t(trajanje)
    out = np.zeros_like(x)
    for k in range(1, 14):
        out += np.sin(2 * np.pi * freq * (1 + detune) * k * x) / k
    return out * 0.5


def bas(freq, trajanje):
    x = t(trajanje)
    s = filt(pila(freq, trajanje), "lowpass", 380) * 0.55 + np.sin(2 * np.pi * freq * x) * 0.45
    env = np.minimum(1, x / 0.01) * np.exp(-x * 2.2)
    return s * env


def pad(freqs, trajanje):
    x = t(trajanje)
    s = sum(pila(f, trajanje, d) for f in freqs for d in (-0.004, 0.004)) / (len(freqs) * 2)
    s = filt(s, "lowpass", 1400)
    env = np.minimum(1, x / 0.6) * np.minimum(1, (trajanje - x) / 0.8)
    return s * env * 0.5


def pluck(freq):
    x = t(0.5)
    s = np.sin(2 * np.pi * freq * x) + 0.35 * np.sin(2 * np.pi * freq * 2 * x) + 0.12 * np.sin(2 * np.pi * freq * 3 * x)
    return s * np.exp(-x * 9) * 0.18


def impact():
    x = t(2.4)
    sub = np.sin(2 * np.pi * (38 + 30 * np.exp(-x * 5)) * x) * np.exp(-x * 1.6)
    sum_ = filt(rng.standard_normal(len(x)), "lowpass", 900) * np.exp(-x * 5) * 0.5
    return (sub + sum_) * 0.9


def riser(trajanje):
    x = t(trajanje)
    s = rng.standard_normal(len(x))
    out = np.zeros_like(s)
    # filtar koji se otvara: niz kratkih segmenata s rastućom granicom
    seg = SR // 20
    for i in range(0, len(s), seg):
        fc = 300 + (i / len(s)) ** 2 * 9000
        out[i : i + seg] = filt(s[i : i + seg], "bandpass", [fc * 0.7, fc * 1.3], 1)
    return out * (x / trajanje) ** 2 * 0.35


# ---------- efekti ----------

def whoosh(trajanje=0.55):
    x = t(trajanje)
    s = rng.standard_normal(len(x))
    out = np.zeros_like(s)
    seg = SR // 50
    for i in range(0, len(s), seg):
        u = i / len(s)
        fc = 400 + np.sin(u * np.pi) * 3200
        out[i : i + seg] = filt(s[i : i + seg], "bandpass", [fc * 0.6, fc * 1.4], 1)
    env = np.sin(np.clip(x / trajanje, 0, 1) * np.pi) ** 2
    return out * env * 0.55


def klik():
    x = t(0.03)
    return (np.sin(2 * np.pi * 2400 * x) * np.exp(-x * 300) * 0.35 + filt(rng.standard_normal(len(x)), "highpass", 5000) * np.exp(-x * 500) * 0.2)


def blip(f0=880, f1=1320):
    x = t(0.09)
    f = f0 + (f1 - f0) * (x / 0.09)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 30) * 0.22


def zvonce():
    x = t(1.6)
    s = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, a, d in [(1318.5, 0.5, 3), (1975.5, 0.3, 4), (2637, 0.15, 6)])
    return s * 0.3


def svjetlucanje(trajanje=1.2):
    x = t(trajanje)
    s = sum(np.sin(2 * np.pi * f * x + rng.uniform(0, 6)) for f in (2093, 2637, 3136, 3951))
    return s * np.exp(-x * 2.5) * np.minimum(1, x / 0.05) * 0.06


def normaliziraj(buf, vrh=0.89):
    m = np.max(np.abs(buf))
    return buf / m * vrh if m > 0 else buf


def spremi(ime, buf):
    import wave

    IZLAZ.mkdir(parents=True, exist_ok=True)
    pcm = (np.clip(buf, -1, 1) * 32767).astype("<i2")
    with wave.open(str(IZLAZ / ime), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(ime, f"{len(buf) / SR:.3f} s")


def fr(frame):
    """Frame (60 fps) → sekunde."""
    return frame / FPS


def glazba():
    buf = np.zeros((N, 2))
    # akordi po 2 takta (4 s): Am – F – C – G (A-mol), tonalitet prati mirni, topli dojam
    akordi = [
        ("A2", ["A3", "C4", "E4"]),
        ("F2", ["F3", "A3", "C4"]),
        ("C3", ["G3", "C4", "E4"]),
        ("G2", ["G3", "B3", "D4"]),
    ]
    dodaj(buf, impact(), 0.0, gain=0.9)
    for takt in range(15):
        pocetak = takt * 4 * UDARAC
        korijen, akord = akordi[(takt // 2) % 4]
        # pad cijelo vrijeme (tiši u uvodu)
        if takt % 2 == 0:
            g = 0.55 if pocetak < 3 else 0.8
            if pocetak >= 24:
                g = 1.0
            dodaj(buf, pad([nota(n) for n in akord], 4 * UDARAC * 2), pocetak, gain=g)
        for u in range(4):
            kad = pocetak + u * UDARAC
            # ritam od 3. sekunde do reveala (24 s)
            if 3.0 <= kad < 23.9:
                dodaj(buf, kick(), kad, gain=0.85)
                dodaj(buf, hat(), kad + UDARAC / 2, pan=0.25, gain=0.8)
                if u == 3:
                    dodaj(buf, hat(True), kad + UDARAC * 0.75, pan=-0.2, gain=0.6)
                # bas na osmine
                for o in range(2):
                    dodaj(buf, bas(nota(korijen), UDARAC / 2 * 0.95), kad + o * UDARAC / 2, gain=0.7)
            elif kad < 3.0 and kad >= 1.0:
                dodaj(buf, hat(), kad + UDARAC / 2, pan=0.3, gain=0.35)
            # arpeggio u dijelu s AI agentima i prednostima (16–24 s)
            if 16.0 <= kad < 23.9:
                for s16 in range(4):
                    n = akord[(u * 4 + s16) % 3]
                    f = nota(n) * 2
                    dodaj(buf, pluck(f), kad + s16 * UDARAC / 4, pan=0.4 if s16 % 2 else -0.4, gain=0.8)
    # podizanje prema revealu i udarac na 24 s
    dodaj(buf, riser(2.2), 21.8, gain=0.8)
    dodaj(buf, impact(), fr(1446), gain=0.8)
    # kraj: mirni akord i blago stišavanje zadnje sekunde
    fade = np.ones(N)
    fade[-SR:] = np.linspace(1, 0, SR) ** 1.5
    buf *= fade[:, None]
    # jednostavna jeka za prostor
    d = int(0.375 * SR)
    jeka = np.zeros_like(buf)
    jeka[d:] = buf[:-d] * 0.18
    jeka = np.stack([filt(jeka[:, 0], "lowpass", 3000), filt(jeka[:, 1], "lowpass", 3000)], axis=1)
    return normaliziraj(buf + jeka[:, ::-1])


def efekti():
    buf = np.zeros((N, 2))
    dodaj(buf, svjetlucanje(1.4), fr(6))  # linija svjetla
    for frame in (178, 424, 656, 948, 1196):  # prijelazi scena
        dodaj(buf, whoosh(), fr(frame) - 0.25, pan=0.0, gain=0.8)
    for frame in (214, 246, 276, 306, 336, 366):  # slaganje web stranice
        dodaj(buf, klik(), fr(frame), pan=0.2)
    dodaj(buf, blip(1200, 1800), fr(556))  # brzo učitavanje
    for i, frame in enumerate((736, 790, 834, 884)):  # poruke u chatu
        dodaj(buf, blip(760, 1140) if i % 2 == 0 else blip(1140, 1520), fr(frame), pan=0.3 if i % 2 == 0 else -0.3)
    dodaj(buf, klik(), fr(904))
    for i in range(4):  # čvorovi tijeka
        dodaj(buf, blip(660 + i * 110, 880 + i * 110), fr(945 + 30 + i * 30), pan=-0.2)
    dodaj(buf, zvonce(), fr(945 + 172))  # obavijest vlasniku
    for i in range(3):  # kartice prednosti
        dodaj(buf, whoosh(0.35), fr(1200 + 30 + i * 54) - 0.1, gain=0.45, pan=-0.3 + i * 0.3)
    dodaj(buf, whoosh(0.7), fr(1426), gain=0.7)  # spajanje u liniju
    dodaj(buf, svjetlucanje(1.8), fr(1500))  # logo i brončana crta
    dodaj(buf, klik(), fr(1668), gain=1.2)  # poziv na akciju
    return normaliziraj(buf, 0.8)


if __name__ == "__main__":
    spremi("glazba.wav", glazba())
    spremi("efekti.wav", efekti())
