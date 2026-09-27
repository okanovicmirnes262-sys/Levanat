// Svi tekstovi reklame na jednom mjestu. Riječi u *zvjezdicama* ispisuju se kurzivom u bronci.

export const TEKST = {
  hook: ['Vaš posao', 'zaslužuje *više.*'],
  stvaranje: ['Web stranice koje', 'ostavljaju *dojam.*'],
  dizajn1: ['Moderan *dizajn.*'],
  dizajn2: ['Optimizirane', '*performanse.*'],
  chat: ['Vaš digitalni', '*asistent.*'],
  agenti: ['Pametniji poslovni', '*procesi.*'],
  prednosti: ['Brža izrada', 'Direktna komunikacija', 'Tehnologija prilagođena vama'],
  prednostiNaslov: 'Zašto Levanat',
  reveal: 'Vaša ideja. Naša realizacija.',
  poziv: 'Zatražite besplatnu ponudu',
  usluge: 'Web stranice · AI chatbotovi · AI agenti',
} as const;

/** Ilustrativni razgovor u chatbotu (izmišljen, označen kao primjer). */
export const RAZGOVOR = [
  { tko: 'kupac', tekst: 'Radite li subotom?' },
  { tko: 'bot', tekst: 'Da, subotom radimo od 8 do 14 sati.' },
  { tko: 'kupac', tekst: 'Kako mogu dobiti ponudu?' },
  { tko: 'bot', tekst: 'Ostavite ime i broj telefona, vlasnik Vam se javlja s ponudom.' },
] as const;

/** Koraci automatizacije (generički, bez naziva stvarnih servisa). */
export const TIJEK = [
  { naslov: 'Upit klijenta', opis: 'Poruka s web stranice' },
  { naslov: 'AI obrada', opis: 'Prepoznaje što klijent treba' },
  { naslov: 'Pripremljen odgovor', opis: 'Nacrt odgovora ili zadatak' },
  { naslov: 'Obavijest vlasniku', opis: 'Vi odlučujete i šaljete' },
] as const;
