// Radovi (portfolio).
// Svaki projekt je jedna stavka. Snimke zaslona spremite u /public/radovi/
// (preporuka: WebP, 1600 × 1000 px) i upišite putanju u polje `slika`.
// Dok je `slika` prazna, prikazuje se elegantan okvir umjesto snimke.
// `uIzradi: true` prikazuje oznaku „U izradi” (projekti koji su još na Vercel domenama).

export type Rad = {
  naziv: string;
  opis: string;
  vrsta: string;
  slika: string;
  /** visoka snimka cijele stranice: na hover/ulazak u ekran polako klizi od vrha do dna */
  cijela?: string;
  /** snimka stare stranice (1600 × 1000, WebP) za klizač „prije i poslije” */
  prije?: string;
  link: string;
  uIzradi: boolean;
};

export const radovi: Rad[] = [
  {
    naziv: 'Pandora Turist — Villa Roza',
    opis:
      'Stranica obiteljske turističke tvrtke iz Srime kraj Vodica: vile s privatnim bazenima, izleti brodom po šibenskom arhipelagu i restoran Villa Roza. Na tri jezika (hrvatski, engleski, njemački), s AI chatbotom Nikom koji gostima odgovara na pitanja.',
    vrsta: 'Turizam · Srima, Vodice',
    slika: '/radovi/villa-roza.webp',
    cijela: '/radovi/villa-roza-cijela.webp',
    // [PRIJE_PANDORA] snimku stare stranice pandoraturist.hr spremite kao
    // public/radovi/pandora-prije.webp i odkomentirajte redak ispod:
    // prije: '/radovi/pandora-prije.webp',
    link: 'https://okanovicmirnes262-sys.github.io/Villa-roza/',
    uIzradi: true,
  },
  {
    naziv: 'MAR-KOP — strojni iskopi',
    opis:
      'Stranica za obrt iz Drniša koji radi strojne iskope, prijevoz materijala i rušenje u Šibensko-kninskoj županiji. Jasan poziv na telefon i WhatsApp, zasebne stranice za usluge i područje rada.',
    vrsta: 'Obrt · Drniš',
    slika: '/radovi/mar-kop.webp',
    cijela: '/radovi/mar-kop-cijela.webp',
    link: 'https://marko-op.vercel.app',
    uIzradi: true,
  },
];
