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

## Struktura

```
public/            fontovi (lokalno, podskupljeni), favicon, OG slika, tekstura kamena
site.config.mjs    [DOMENA]
src/config.ts      podaci o brendu, navigacija, usluge
src/data/          FAQ, radovi, opcije forme
src/layouts/       Base.astro — <head>, SEO, Open Graph, JSON-LD (ProfessionalService, Person, WebSite)
src/components/    Header, Footer, Wind (canvas), Faq, Cta, PageHero, WorkItem
src/pages/         stranice + api/kontakt.ts (serverless, Resend) + robots.txt.ts
src/scripts/       wind.ts, motion.ts (GSAP + Lenis), header.ts, details.ts, sun.ts, form.ts
src/styles/        global.css — tokeni (boje, tipografija), raspored, komponente
```

## Fontovi

- **Fraunces** (naslovi), **Schibsted Grotesk** (tekst), **Fragment Mono** (oznake). Sva tri su pod licencom SIL Open Font License.
- Podskup: latinica + latinica proširena A, s provjerenim znakovima č ć đ š ž Č Ć Đ Š Ž te „ “ – … € ′.
- Ako kasnije želite **Zodiak** (Fontshare) umjesto Fraunces: preuzmite ga s fontshare.com, stavite `woff2` datoteke u `public/fonts/`, promijenite `src` u prva dva `@font-face` bloka u `src/styles/global.css` i ime obitelji u `--f-display`. Na kraju uklonite blok „Optička veličina” na dnu datoteke.
