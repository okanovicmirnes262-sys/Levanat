// [PORTFOLIO_LINKOVI]
// Svaki projekt je jedna stavka. Snimke zaslona spremite u /public/radovi/
// (preporuka: WebP, 1600 × 1000 px) i upišite putanju u polje `slika`.
// Dok je `slika` prazna, prikazuje se elegantan okvir umjesto snimke.
// `uIzradi: true` prikazuje oznaku „U izradi” (projekti koji su još na Vercel domenama).

export type Rad = {
  naziv: string;
  opis: string;
  vrsta: string;
  slika: string;
  link: string;
  uIzradi: boolean;
};

export const radovi: Rad[] = [
  {
    naziv: '[NAZIV_PROJEKTA_1]',
    opis: '[Kratki opis projekta: za koga je stranica, što je bio cilj i što je posebno u njoj.]',
    vrsta: 'Web stranica',
    slika: '',
    link: '[LINK_PROJEKTA_1]',
    uIzradi: true,
  },
  {
    naziv: '[NAZIV_PROJEKTA_2]',
    opis: '[Kratki opis projekta: za koga je stranica, što je bio cilj i što je posebno u njoj.]',
    vrsta: 'Web stranica',
    slika: '',
    link: '[LINK_PROJEKTA_2]',
    uIzradi: true,
  },
  {
    naziv: '[NAZIV_PROJEKTA_3]',
    opis: '[Kratki opis projekta: za koga je stranica, što je bio cilj i što je posebno u njoj.]',
    vrsta: 'Web stranica',
    slika: '',
    link: '[LINK_PROJEKTA_3]',
    uIzradi: true,
  },
];
