# Levanat: 30-sekundna reklama

Remotion projekt (React, TypeScript, SVG) za vertikalnu reklamu:
- **format:** 1080 × 1920, 60 fps, točno 1800 frameova (30,000 s);
- **video i zvuk:** H.264 High (yuv420p, BT.709), AAC 320 kb/s;
- **namjena:** Instagram Reels, TikTok, Instagram i Facebook oglasi.

**Trenutna verzija (v2)** je apstraktni premium smjer s novim logotipom: svjetlo, 3D geometrija, čestice, neuronska mreža i kinetička tipografija. Nema web stranice ni sučelja. Prva verzija (v1, web stranica, mobitel i chatbot) sačuvana je kao kompozicija `ReklamaV1`.

## Pokretanje

```bash
cd video
npm install
npm run studio              # pregled i uređivanje u pregledniku (Remotion Studio)
npm run render              # out/levanat-reklama-v2-30s.mp4 (glazba + efekti)
npm run render:bez-glazbe   # out/levanat-reklama-v2-30s-bez-glazbe.mp4 (samo efekti)
npm run naslovnica          # out/naslovnica-v2.png (zadnji kadar)
node alati/kadrovi.mjs 0 300 900 1790        # kontrolni kadrovi u out/kadrovi/
node alati/kadrovi.mjs zona 0 300 900 1790   # isto, s ucrtanom sigurnom zonom
```

- **Završna obrada:** `render` skripte na kraju pokreću `alati/zavrsi.sh` (ffmpeg). On daje točno 30,000 s, standardni `yuv420p` i faststart. Ako ffmpeg nije u PATH-u, zadajte ga s `FFMPEG=/put/do/ffmpeg`.
- **Preglednik:** `remotion.config.ts` koristi preglednik iz okruženja u kojem je video izrađen, a na Vašem računalu Remotion sam preuzme svoj.
- **Licenca Remotiona:** besplatan je za pojedince i tvrtke do 3 zaposlenika. Za veći tim treba licenca s [remotion.pro](https://www.remotion.pro).

## Storyboard v2

| Vrijeme | Frameovi | Scena | Tekst | Datoteka |
|---|---|---|---|---|
| 0–4 s | 0–240 | Točka svjetla se upali, izbaci zrake i razvije u perspektivnu digitalnu mrežu | Vaš posao. / Nova dimenzija. | `src/v2/scene/S1Svjetlo.tsx` |
| 4–9 s | 240–540 | Staklene 3D kartice dolijeću i slažu se u apstraktnu kompoziciju stranice | Moderan dizajn. / Brza izvedba. | `S2Kartice.tsx` |
| 9–15 s | 540–900 | Kartice se raspadnu u čestice koje grade 3D neuronsku mrežu sa signalima | AI koji radi za vaše poslovanje. | `S3Mreza.tsx` |
| 15–21 s | 900–1260 | Tri strukture: ikosaedar (dizajn), prsten čestica (AI automatizacija), dva čvora s valovima (komunikacija) | Moderan dizajn · AI automatizacija · Direktna komunikacija | `Finale.tsx`, `komponente/Strukture.tsx` |
| 21–26 s | 1260–1560 | Spirala u središte, bljesak, logo se iscrtava svjetlom, izroni „Levanat” | Digitalna budućnost vašeg poslovanja. | `Finale.tsx`, `komponente/Logo.tsx` |
| 26–30 s | 1560–1800 | Logo, usluge i gumb, zadnjih ~1,5 s kadar miruje | Zatražite besplatnu ponudu | `Finale.tsx` |

Sve animacije su vezane uz frame (`interpolate`, `spring`), bez CSS animacija. 3D je vlastiti mali sloj (`src/v2/lib/3d.ts`: rotacije i perspektiva) iscrtan u SVG-u, pa je render oštar i ponovljiv. Motion blur je uključen samo na brzim prijelazima.

## Što se gdje mijenja

| Što | Gdje |
|---|---|
| **Kontakt** (web adresa ili telefon ispod gumba) | `src/Root.tsx` → konstanta `KONTAKT`. Prazno znači da se ništa ne prikazuje. |
| **Tekstovi** | `src/v2/tekstovi.ts`. Riječ u `*zvjezdicama*` dobiva svjetlosni gradijent. |
| **Logo** | Zamijenite `public/logo/izvor.png` novom slikom logotipa (svijetli logo na tamnoj podlozi) i pokrenite `npm run logo` (Python + OpenCV). Nastaju `public/logo/ikona.svg`, `natpis.svg` i `src/v2/logoPutanje.ts`. Putanje za animaciju iscrtavanja su u `src/v2/komponente/Logo.tsx` (`POTEZI`). |
| **Boje, font, raspored scena, sigurna zona** | `src/v2/tokens.ts` |
| **Glazba** | Zamijenite `public/audio/v2-glazba.wav` licenciranom glazbom od 30 s (idealno 120 BPM). Glasnoća je u `src/v2/Reklama2.tsx`. Ili koristite verziju bez glazbe. |
| **Zvučni efekti** | `public/audio/v2-efekti.wav`, generira ih `alati/zvuk2.py`. Vremena su u frameovima. |

## Sigurna zona

Ključni tekst stoji unutar x 90–960 i y 280–1420. Donjih ~500 px i desni rub pokrivaju opis i ikone Reelsa i TikToka.

## Ograničenja

- **Glazba je izvorna i sintetizirana** (`alati/zvuk2.py`: oscilatori, šum i filtri, bez uzoraka i tuđe glazbe), pa je slobodna za komercijalnu uporabu. Nije snimljena s producentom. U okruženju u kojem je video izrađen biblioteke licencirane glazbe nisu bile dostupne.
- **Logo** je vektoriziran iz poslane slike (1254 × 1254 px) i vjerno je prati. Ako postoji izvorni vektorski logo, bolje ga je koristiti.
- Nema izmišljenih brojki, rezultata, recenzija ni usporedbi s konkurencijom.
