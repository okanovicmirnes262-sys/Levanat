// Demo primjeri web stranica po djelatnosti (izmišljene firme) — šalju se klijentima uz prvi mail.
// Svaki primjer je samostalna stranica u public/primjeri/<kod>/index.html (vlastiti dizajn, s odricanjem).
// Kod mora biti isti kao kod djelatnosti u CRM-u (frizeri, apartmani, gradevina…), a adresa
// https://<domena>/primjeri/<kod> upisuje se u CRM → Postavke → Djelatnosti → „Demo primjer”.
// Postupak i predložak odricanja: alati/primjeri/README.md.

export type Primjer = {
  /** kod djelatnosti iz CRM-a = mapa u public/primjeri/ */
  kod: string;
  /** naziv djelatnosti za prikaz, npr. „Frizerski salon” */
  djelatnost: string;
  /** izmišljeni naziv firme na primjeru */
  firma: string;
  opis: string;
  /** snimka zaslona primjera (1600 × 1000, WebP) u public/primjeri/<kod>/ */
  slika: string;
};

export const primjeri: Primjer[] = [];

export const poveznicaPrimjera = (p: Primjer) => `/primjeri/${p.kod}`;
