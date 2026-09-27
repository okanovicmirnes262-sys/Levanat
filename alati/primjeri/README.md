# Demo primjeri po djelatnosti

Primjer stranice izmišljene firme za svaku djelatnost. CRM ga automatski šalje u prvom mailu svakom klijentu te
djelatnosti (umjesto reference) i koristi ga za `{web}` u WhatsApp porukama.

## Novi primjer
1. Dizajn koji se sviđa (poveznica ili snimka zaslona) složi se **u tom stilu** (raspored, boje, dojam), bez kopiranja
   tuđeg koda, tekstova i slika.
2. Kopirati `predlozak.html` u `public/primjeri/<kod>/index.html` (`<kod>` = kod djelatnosti u CRM-u: `frizeri`,
   `apartmani`, `gradevina`, `kozmetika`, `autoservisi`, `ugostiteljstvo`, `fitness`, `stolari`, `digitalni_sadrzaj`).
3. Tekstovi na hrvatskom, prirodni, obraćanje s „Vi”. Naziv firme izmišljen i provjeren pretragom da ne postoji;
   kontakti očito izmišljeni (npr. `+385 00 000 0000`, `info@primjer-firme.demo`). Traka i odricanje ostaju.
4. Slike: samo besplatne licence (Unsplash, Pexels), WebP u istoj mapi, autor i izvor upisani u komentar na vrhu.
5. Snimka zaslona `public/primjeri/<kod>/snimka.webp` (1600 × 1000) i stavka u `src/data/primjeri.ts` —
   tada se primjer pojavi na `/primjeri` i u izborniku.
6. `npm run check && npm run build`, objava, pa u CRM-u: Postavke → Djelatnosti → „Demo primjer” =
   `https://<domena>/primjeri/<kod>`.
