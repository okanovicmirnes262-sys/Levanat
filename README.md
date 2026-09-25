# Levanat — web dizajn, Šibenik

Portfolio stranica za Levanat (Mirnes Okanović). Astro (statički) + jedna Vercel serverless funkcija za kontakt formu.

```
npm install
npm run dev       # razvoj na http://localhost:4321
npm run build     # produkcijska izgradnja
npm run check     # provjera tipova
```

## Placeholderi koje treba popuniti

| Placeholder | Gdje | Što upisati |
|---|---|---|
| `[DOMENA]` | `site.config.mjs` (konstanta `DOMENA`) ili varijabla okruženja `SITE_URL` na Vercelu | Puna adresa, npr. `https://levanat.hr`, bez kose crte na kraju. Koristi se za canonical URL-ove, sitemap, robots.txt, Open Graph i schemu. |
| `[EMAIL_PLACEHOLDER]` | `src/config.ts` → `brand.email` | Javna e-mail adresa. Prikazuje se u footeru, na kontaktu i u pravilima privatnosti i automatski ulazi u schemu. |
| `[PODACI_O_OBRTU]` | `src/config.ts` → `brand.businessDetails` | Naziv obrta, adresa sjedišta, OIB (kad registracija bude gotova). Prikazuje se u footeru i u pravilima privatnosti. |
| `[PORTFOLIO_LINKOVI]` | `src/data/radovi.ts` | Za svaki projekt: `naziv`, `opis`, `link` (puni `https://…` link), `slika` i `uIzradi`. |
| `[NAZIV_PROJEKTA_n]`, `[LINK_PROJEKTA_n]` | `src/data/radovi.ts` | Dio gornjeg popisa. |
| Snimke zaslona | `public/radovi/` | WebP, 1600 × 1000 px, putanja u polju `slika` (npr. `/radovi/projekt.webp`). |
| `[FOTO_MIRNES]` | `src/pages/index.astro` i `src/pages/o-meni.astro` | Fotografiju spremite kao `public/mirnes.webp` (1200 × 1500 px) i zamijenite placeholder `<div>` s `<img>` iz komentara odmah iznad njega. |
| `[DATUM_PRAVILA]` | `src/pages/pravila-privatnosti.astro` | Datum posljednje izmjene pravila privatnosti. |

## Varijable okruženja (Vercel → Project → Settings → Environment Variables)

| Varijabla | Obavezno | Opis |
|---|---|---|
| `RESEND_API_KEY` | da | API ključ s [resend.com](https://resend.com) |
| `CONTACT_TO_EMAIL` | da | Adresa na koju stižu upiti (može ih biti više, odvojenih zarezom) |
| `CONTACT_FROM_EMAIL` | preporučeno | Pošiljatelj na domeni potvrđenoj u Resendu, npr. `Levanat <upiti@levanat.hr>`. Bez toga se koristi Resendova testna adresa, koja šalje samo na e-mail vlasnika Resend računa. |
| `SITE_URL` | ne | Alternativa za `DOMENA` u `site.config.mjs` |

Predložak je u `.env.example`. Za lokalni razvoj kopirajte ga u `.env`.

## Deploy na Vercel

1. Pushajte repozitorij na GitHub.
2. Na [vercel.com](https://vercel.com) odaberite **Add New → Project** i uvezite repozitorij. Vercel sam prepozna Astro, a postavke ostavite zadane (build naredba `npm run build`).
3. Pod **Settings → Environment Variables** dodajte varijable iz tablice iznad.
4. Pod **Analytics** uključite **Web Analytics** (bez kolačića). Dok nije uključena, preglednik prijavljuje 404 za `/_vercel/insights/script.js`.
5. Pod **Settings → Domains** dodajte svoju domenu i kod registrara postavite DNS zapise koje Vercel navede.
6. Upišite domenu u `site.config.mjs` (ili `SITE_URL`) i ponovno deployajte.
7. U Resendu pod **Domains** potvrdite domenu (DNS zapisi SPF/DKIM) kako bi e-mailovi iz forme stizali s Vaše adrese.
8. U [Google Search Console](https://search.google.com/search-console) dodajte domenu i predajte `https://VAŠA-DOMENA/sitemap-index.xml`.

## Koncept „Kamen i more”

Kamen katedrale sv. Jakova, duboko Jadransko more i mediteransko svjetlo. Levanat je prisutan kao detalj: valovi i linije vjetra uvijek putuju zdesna nalijevo.

| Efekt | Gdje | Datoteka |
|---|---|---|
| Svjetlo po reljefu (WebGL, normal mape): kursor osvjetljava kamene glave, uvodni snop svjetla, „izlazak sunca” na scroll | hero početne i zaglavlja podstranica | `src/scripts/relief.ts` |
| More s odrazom katedrale, valovi koje gura levanat, odsjaji sunca | završni poziv | `src/scripts/sea.ts` |
| Friz glava: prikovana vodoravna šetnja (desktop), swipe (mobitel), mreža (smanjeno kretanje) | početna | `src/scripts/motion.ts` |
| Plima: valovite granice između kamena i mora | sve stranice | `src/components/Plima.astro`, `src/scripts/plima.ts` |
| Odsjaji vode (caustics) na kamenu i moru | pozadine | `public/odsjaj.webp` + CSS |
| Klesanje naslova, izranjanje teksta, linija plime u procesu, paralaksa | sve stranice | `src/scripts/motion.ts` |
| Brončani kursor, magnetni gumbi, kamen koji se odiže na hover | desktop | `src/scripts/cursor.ts`, CSS |
| Prijelazi između stranica | sve | CSS View Transitions |

**Performanse i pristupačnost:**
- WebGL se učitava tek kad je preglednik slobodan i kad je sekcija blizu ekrana.
- Na uređajima bez grafičke kartice (softversko renderiranje), sa Save-Data ili slabim hardverom crta se jedna sličica ili CSS verzija.
- Ako sličice trajno kasne, efekt se sam prebaci u mirni način.
- `prefers-reduced-motion` daje mirnu verziju: statično bočno svjetlo, friz kao mreža, bez uvoda.

## Fotografije

Izvorne fotografije su u `alati/izvori/`. Obrađene su skriptama u `alati/`:

1. `esrgan.py`: Real-ESRGAN 4× povećanje (model `RealESRGAN_x4plus.pth` s GitHuba projekta xinntao/Real-ESRGAN, PyTorch).
2. Uklanjanje pozadine pomoću `rembg` (model isnet-general-use), zatim `obrada-slika.py`: izrez glava, meke maske koje tonu u sjenu, jedinstveno toniranje u boji kamena, zrno i karte reljefa (normal map) za WebGL.

Rezultat je u `src/assets/kamen/`. Astro iz toga pri izgradnji generira AVIF i WebP u više veličina.

## Struktura

```
alati/             obrada fotografija (nije dio stranice)
public/            font, favicon, OG slika, teksture (kamen, odsjaji vode)
site.config.mjs    [DOMENA]
src/assets/kamen/  obrađene glave, Sv. Mihovil, katedrala + karte reljefa
src/config.ts      podaci o brendu, navigacija, usluge
src/data/          FAQ, radovi, slike (kamen.ts), opcije forme
src/layouts/       Base.astro — <head>, SEO, Open Graph, JSON-LD
src/components/    Header, Footer, Reljef, Plima, Cta (katedrala nad morem), Faq, PageHero, WorkItem, Wind
src/pages/         stranice + api/kontakt.ts (serverless, Resend) + robots.txt.ts
src/scripts/       relief.ts, sea.ts, gpu.ts, motion.ts, plima.ts, cursor.ts, wind.ts, header.ts, details.ts, sun.ts, form.ts
src/styles/        global.css — tokeni, tipografija, raspored, komponente
```

## Font

Cijela stranica koristi jednu obitelj: **Fraunces** (SIL Open Font License), s varijabilnim osima za težinu i optičku veličinu (9–72).
- **Tekst:** optička veličina 9–18.
- **Naslovi:** optička veličina do 72. Iznad toga slovo „e” postaje krhko, pa je 72 gornja granica.
- **Podskup:** latin + latin-ext, s provjerenim znakovima č ć đ š ž Č Ć Đ Š Ž te „ “ – … € ′.
