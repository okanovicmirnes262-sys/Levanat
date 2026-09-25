// [CIJENE_KALKULATOR] — Okvirne cijene za kalkulator (u eurima, [od, do]).
// Ovo su PRIJEDLOZI: prilagodite ih svojim stvarnim cijenama prije objave.
// Jedina cijena iz briefa je „od 200 €” za izradu stranice.

export type Opcija = { oznaka: string; opis?: string; raspon: [number, number] };

export const velicine: Opcija[] = [
  { oznaka: 'Jednostavna stranica', opis: '1–3 podstranice, npr. obrt ili apartman', raspon: [200, 350] },
  { oznaka: 'Poslovna stranica', opis: '4–7 podstranica, usluge, galerija, kontakt', raspon: [350, 600] },
  { oznaka: 'Veća stranica', opis: '8 i više podstranica', raspon: [600, 1000] },
];

export const jezici: Opcija[] = [
  { oznaka: 'Samo hrvatski', raspon: [0, 0] },
  { oznaka: 'Dva jezika', raspon: [80, 150] },
  { oznaka: 'Tri jezika', raspon: [150, 250] },
];

export const dodaci: Opcija[] = [
  { oznaka: 'AI chatbot', opis: 'odgovara posjetiteljima na pitanja', raspon: [150, 300] },
  { oznaka: 'Obrazac za upite ili rezervacije', raspon: [50, 100] },
  { oznaka: 'Prošireni lokalni SEO', opis: 'stranice za mjesta i usluge', raspon: [100, 200] },
];
