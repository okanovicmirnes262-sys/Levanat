# Levanat: 30-sekundna reklama

Remotion projekt (React + TypeScript) za vertikalnu reklamu:
- **format:** 1080 × 1920, 60 fps, točno 1800 frameova (30,000 s);
- **video i zvuk:** H.264 (yuv420p), AAC 320 kb/s;
- **namjena:** Instagram Reels, TikTok, Instagram i Facebook oglasi.

## Pokretanje

```bash
cd video
npm install
npm run studio              # pregled i uređivanje u pregledniku (Remotion Studio)
npm run render              # out/levanat-reklama-30s.mp4 (glazba + efekti)
npm run render:bez-glazbe   # out/levanat-reklama-30s-bez-glazbe.mp4 (samo efekti, za Vašu glazbu)
npm run naslovnica          # out/naslovnica.png (zadnji kadar, za naslovnu sliku objave)
node alati/kadrovi.mjs 0 300 900 1790        # kontrolni kadrovi u out/kadrovi/
node alati/kadrovi.mjs zona 0 300 900 1790   # isto, s ucrtanom sigurnom zonom
```

`remotion.config.ts` koristi preglednik iz okruženja u kojem je video izrađen. Na Vašem računalu Remotion sam preuzme svoj preglednik.

**Licenca Remotiona:** besplatan je za pojedince i tvrtke do 3 zaposlenika. Za veći tim treba licenca s [remotion.pro](https://www.remotion.pro).

## Što se gdje mijenja

| Što | Gdje |
|---|---|
| **Kontakt** (web adresa ili telefon u zadnjem kadru) | `src/Root.tsx` → konstanta `KONTAKT`. Prazno znači da se ništa ne prikazuje. Pojavljuje se ispod gumba „Zatražite besplatnu ponudu”. |
| **Tekstovi** | `src/tekstovi.ts`. Riječ u `*zvjezdicama*` ispisuje se kurzivom u bronci. Tu su i razgovor u chatbotu i koraci automatizacije. |
| **Logo** | `src/components/Logo.tsx`. Sada je to wordmark „Levanat” u Fraunces fontu s brončanom crtom, kao na stranici. Za vektorski logo stavite `public/logo.svg` i u komponenti vratite `<Img src={staticFile('logo.svg')} />`. |
| **Boje, fontovi, sigurna zona, raspored scena** | `src/tokens.ts` |
| **Glazba** | Zamijenite `public/audio/glazba.wav` svojom licenciranom glazbom od 30 s, idealno 120 BPM. Glasnoća je u `src/Reklama.tsx` (`volume`). Bez glazbe: `npm run render:bez-glazbe`. |
| **Zvučni efekti** | `public/audio/efekti.wav`, generira ih `alati/zvuk.py`. Vremena su u frameovima, u funkciji `efekti()`. |

## Scene

| Vrijeme | Frameovi | Scena | Datoteka |
|---|---|---|---|
| 0–3 s | 0–180 | Hook: svjetlosna linija, 3D kartica, „Vaš posao zaslužuje više.” | `scenes/Pozornica.tsx` |
| 3–7 s | 180–420 | Slaganje web stranice | `scenes/Pozornica.tsx`, `components/WebStranica.tsx` |
| 7–11 s | 420–660 | Desktop u mobitel, skrol, „Moderan dizajn.” i „Optimizirane performanse.” | `scenes/Pozornica.tsx` |
| 11–16 s | 660–960 | Chatbot (primjer razgovora) | `components/Chat.tsx` |
| 16–20 s | 960–1200 | AI agenti: tijek od upita do obavijesti | `scenes/Agenti.tsx` |
| 20–24 s | 1200–1440 | Tri prednosti | `scenes/Zavrsnica.tsx` |
| 24–27 s | 1440–1620 | Spajanje u liniju, logo, „Vaša ideja. Naša realizacija.” | `scenes/Zavrsnica.tsx` |
| 27–30 s | 1620–1800 | Poziv: „Zatražite besplatnu ponudu” (zadnjih ~1,5 s kadar miruje) | `scenes/Zavrsnica.tsx` |

Sve animacije su vezane uz frame (`interpolate`, `spring`), bez CSS animacija. Motion blur (`@remotion/motion-blur`) uključen je samo u brzim prijelazima (približavanje kartici, okret mobitela), jer višestruko produljuje render.

## Sigurna zona

Ključni tekst stoji unutar x 90–960 i y 280–1420. Donjih ~500 px i desni rub pokrivaju opis i ikone Reelsa i TikToka. Provjera: `node alati/kadrovi.mjs zona …`.

## Ograničenja

- **Glazba je privremena.** `glazba.wav` je izvorna sintetizirana podloga iz `alati/zvuk.py` (bez tuđih uzoraka, slobodna za uporabu), ali nije producentska glazba. Za oglase preporučujemo licenciranu glazbu (npr. Artlist, Epidemic Sound) ili producenta.
- **Web stranica u videu** je izmišljeni primjer („Vaš obrt”), a **razgovor u chatbotu** je ilustrativan i označen kao „Primjer razgovora”.
- Nema izmišljenih brojki, rezultata, recenzija ni integracija.
