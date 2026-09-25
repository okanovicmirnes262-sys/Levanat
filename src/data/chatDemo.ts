// Pokazni chatbot: unaprijed pripremljeni odgovori (bez vanjskog servisa i troškova).
import { homeFaq } from './faq';

export type DemoOdgovor = { pitanje: string; kljucne: string[]; odgovor: string };

export const demoOdgovori: DemoOdgovor[] = [
  {
    pitanje: 'Koliko košta izrada web stranice?',
    kljucne: ['košt', 'cijen', 'plat', 'eura', '€', 'skupo'],
    odgovor: homeFaq[0].a,
  },
  {
    pitanje: 'Trebam li već imati domenu i hosting?',
    kljucne: ['domen', 'hosting', 'poslužitelj', 'adresa'],
    odgovor: homeFaq[1].a,
  },
  {
    pitanje: 'Radite li samo u Šibeniku?',
    kljucne: ['šibenik', 'sibenik', 'grad', 'zagreb', 'split', 'hrvatsk', 'dolazite', 'uživo'],
    odgovor:
      'Radim s klijentima iz cijele Hrvatske. Gotovo sve se može dogovoriti na daljinu, telefonom, e-mailom ili videopozivom, a s klijentima iz Šibenika i Šibensko-kninske županije rado se nađem i uživo, uz kavu.',
  },
  {
    pitanje: 'Odakle ti znaš ove odgovore?',
    kljucne: ['znaš', 'znas', 'chatbot', 'bot', 'radiš', 'radis', 'odakle', 'kako radi'],
    odgovor:
      'Ja sam pokazni primjer. Moji odgovori pripremljeni su iz čestih pitanja s ove stranice. Pravi chatbot na Vašoj stranici odgovara na slobodno postavljena pitanja, na temelju baze znanja složene iz Vaših materijala: cjenika, radnog vremena, opisa usluga.',
  },
  {
    pitanje: 'Mogu li razgovarati s Mirnesom?',
    kljucne: ['mirnes', 'razgovar', 'nazvat', 'kontakt', 'ponud', 'upit', 'čovjek'],
    odgovor:
      'Naravno. Pošaljite upit preko kontakt forme i Mirnes će Vam se javiti osobno, s pitanjima i besplatnom ponudom. Upravo tako bi i pravi chatbot na Vašoj stranici uputio posjetitelja k Vama kad pitanje prelazi ono što zna.',
  },
];

export const demoNeznam =
  'To je dobro pitanje, ali u ovom pokaznom primjeru znam odgovoriti samo na ponuđena pitanja. Pravi chatbot odgovara na temelju Vaše baze znanja, a kad nešto ne zna, uputi posjetitelja da Vas kontaktira.';
