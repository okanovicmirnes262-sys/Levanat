// Baza znanja asistenta na stranici (20 pitanja). Odgovori su pripremljeni,
// bez vanjskog servisa i troškova. Ključne riječi pišite bez dijakritika i malim slovima.

export type Veza = { href: string; tekst: string };
export type Znanje = { pitanje: string; kljucne: string[]; odgovor: string; veza?: Veza };

const PONUDA: Veza = { href: '/kontakt', tekst: 'Zatražite besplatnu ponudu →' };

export const baza: Znanje[] = [
  {
    pitanje: 'Koliko košta izrada web stranice?',
    kljucne: ['kosta', 'cijen', 'plat', 'eura', '€', 'skup', 'jeftin', 'novac', 'budzet'],
    odgovor:
      'Izrada kreće okvirno od 200 €. Točna cijena ovisi o broju podstranica, jezicima i dodacima poput AI chatbota. Ponuda je besplatna i u njoj je svaka stavka jasno navedena, bez iznenađenja na kraju.',
    veza: { href: '/usluge/izrada-web-stranica#cijena', tekst: 'Izračunajte okvirnu cijenu →' },
  },
  {
    pitanje: 'Koliko traje izrada stranice?',
    kljucne: ['traje', 'trajanje', 'rok', 'koliko brzo', 'kada ce', 'dugo', 'gotov'],
    odgovor:
      'Ovisi o opsegu stranice i o tome koliko brzo stignu tekstovi i fotografije. Okvirni rok dobivate u ponudi, prije nego što se na bilo što obvežete.',
  },
  {
    pitanje: 'Trebam li već imati domenu i hosting?',
    kljucne: ['domen', 'hosting', 'posluzitelj', 'server', '.hr'],
    odgovor:
      'Ne trebate. Pomoć oko kupnje domene i postavljanja hostinga uključena je u svaku izradu. Domenu i hosting kupujete na svoje ime, pa stranica u svakom trenutku ostaje Vaša.',
  },
  {
    pitanje: 'Hoće li stranica biti moja?',
    kljucne: ['moja', 'vlasnis', 'vlasnik', 'pripada', 'pristup', 'lozink'],
    odgovor:
      'Hoće. Domena i hosting glase na Vas. Ako odaberete jednokratnu predaju, dobivate cijeli projekt i sve pristupe, pa ste potpuno neovisni.',
  },
  {
    pitanje: 'Što ako poslije želim nešto promijeniti?',
    kljucne: ['promijen', 'izmjen', 'azurir', 'dodati', 'poslije', 'kasnije'],
    odgovor:
      'Uz mjesečno održavanje izmjene su uključene: pošaljete što treba promijeniti i to se sredi. Ako odaberete jednokratnu predaju, za kasnije izmjene uvijek se možete dogovoriti posebno.',
  },
  {
    pitanje: 'Kako funkcionira održavanje?',
    kljucne: ['odrzavan', 'mjesecn', 'pretplat', 'predaj', 'sigurnosn', 'kopij'],
    odgovor:
      'Birate sami. Mjesečno održavanje uključuje ažuriranja, sigurnosne kopije i izmjene koje Vam zatrebaju. Druga mogućnost je jednokratna predaja cijelog projekta u Vaše ruke, bez mjesečnih obveza.',
    veza: { href: '/usluge#odrzavanje', tekst: 'Više o održavanju →' },
  },
  {
    pitanje: 'Što je Google Business profil?',
    kljucne: ['business', 'google profil', 'karte', 'maps', 'kartama', 'recenzij'],
    odgovor:
      'To je besplatni profil Vašeg poslovanja na Google tražilici i Google kartama: adresa, radno vrijeme, telefon, fotografije i recenzije. Kad netko traži uslugu u blizini, Google često prvo pokaže upravo te profile. Izrada profila uključena je u svaku izradu stranice.',
  },
  {
    pitanje: 'Što je lokalni SEO?',
    kljucne: ['seo', 'lokaln', 'trazilic', 'pronadu', 'vidljiv', 'optimizac'],
    odgovor:
      'Lokalni SEO je skup postupaka kojima Googleu pokazujemo da ste upravo Vi dobar odgovor kad netko u Šibeniku ili okolici traži ono čime se bavite. Uključuje brzinu i strukturu stranice, sadržaj za usluge i mjesta, Google Business profil i strukturirane podatke.',
    veza: { href: '/usluge/seo-optimizacija', tekst: 'Više o SEO optimizaciji →' },
  },
  {
    pitanje: 'Možete li garantirati prvo mjesto na Googleu?',
    kljucne: ['prvo mjesto', 'garant', 'jamc', 'prvi na', 'vrh'],
    odgovor:
      'Ne, i ne može nitko tko je iskren, jer poredak određuje Google. Ono što se može obećati: stranica i Google Business profil bit će složeni onako kako Google preporučuje, uz objašnjenje što je napravljeno i zašto.',
  },
  {
    pitanje: 'Koliko brzo se vide rezultati SEO-a?',
    kljucne: ['rezultat', 'koliko brzo seo', 'kada cu', 'tjedan'],
    odgovor:
      'Prve promjene obično se vide nakon nekoliko tjedana, a ozbiljniji pomaci traju duže. Ovisi o konkurenciji u Vašoj djelatnosti i o tome koliko je stranica nova.',
  },
  {
    pitanje: 'Kako radi AI chatbot?',
    kljucne: ['chatbot', 'chat bot', 'asistent', 'bot', 'umjetn', 'ai ', 'odakle zna'],
    odgovor:
      'Chatbot odgovara na temelju baze znanja složene iz Vaših materijala (cjenik, radno vrijeme, česta pitanja, opis usluga) ili iz sadržaja Vaše postojeće stranice. Kad odgovor ne zna, ne nagađa, nego posjetitelja uputi da Vas kontaktira.',
    veza: { href: '/usluge/ai-chatbot', tekst: 'Više o AI chatbotu →' },
  },
  {
    pitanje: 'Može li se chatbot dodati na postojeću stranicu?',
    kljucne: ['postojec', 'vec imam stranic', 'staru stranic', 'dodati chatbot'],
    odgovor:
      'U većini slučajeva može. Chatbot se ugrađuje kao zaseban dodatak, pa ne morate mijenjati cijelu stranicu.',
  },
  {
    pitanje: 'Na kojim jezicima chatbot odgovara?',
    kljucne: ['jezik', 'engleski', 'njemack', 'talijansk', 'strani', 'gosti'],
    odgovor:
      'Na hrvatskom, a po dogovoru i na drugim jezicima. To je korisno ako Vam se javljaju strani gosti ili kupci. Višejezične mogu biti i same stranice: primjerice, stranica Pandora Turist radi na hrvatskom, engleskom i njemačkom.',
  },
  {
    pitanje: 'Radite li samo u Šibeniku?',
    kljucne: ['sibenik', 'grad', 'zagreb', 'split', 'zadar', 'hrvatsk', 'dolazite', 'uzivo', 'daljin', 'gdje ste'],
    odgovor:
      'Mirnes radi s klijentima iz cijele Hrvatske, ne samo iz Šibenika. Gotovo sve se može dogovoriti telefonom, e-mailom ili videopozivom. S klijentima iz Šibenika i Šibensko-kninske županije rado se nađe i uživo, uz kavu.',
  },
  {
    pitanje: 'Moram li sam pripremiti tekstove i fotografije?',
    kljucne: ['tekst', 'fotograf', 'slike', 'sadrzaj', 'pisati', 'logo'],
    odgovor:
      'Pomaže ako imate osnovne informacije i nekoliko dobrih fotografija. Tekstove možete složiti zajedno: ispričate čime se bavite, a dobijete pomoć da to pretočite u jasan tekst za stranicu.',
  },
  {
    pitanje: 'Hoće li stranica dobro raditi na mobitelu?',
    kljucne: ['mobitel', 'mobil', 'telefonu', 'responziv', 'brzin', 'brza', 'sporo'],
    odgovor:
      'Hoće. Stranica se slaže najprije za mobitel, jer vas većina ljudi tako traži, a zatim za veće ekrane. Učitava se brzo i na slabijem signalu, što primijete i posjetitelji i Google.',
  },
  {
    pitanje: 'Mogu li vidjeti primjere radova?',
    kljucne: ['primjer', 'radov', 'portfolio', 'projekt', 'referenc', 'klijent'],
    odgovor:
      'Naravno. Među projektima su Pandora Turist (vile, izleti brodom i restoran u Srimi kraj Vodica) i MAR-KOP (strojni iskopi, Drniš). Oba su trenutno označena kao „U izradi”.',
    veza: { href: '/radovi', tekst: 'Pogledajte radove →' },
  },
  {
    pitanje: 'Kako izgleda suradnja?',
    kljucne: ['suradnj', 'proces', 'korak', 'kako pocinje', 'kako ide', 'postupak'],
    odgovor:
      'U četiri koraka: besplatan razgovor i ponuda, dizajn i izrada uz međuverzije, pomoć oko domene, hostinga i Google Business profila, te na kraju predaja projekta ili mjesečno održavanje, po Vašem izboru.',
  },
  {
    pitanje: 'Tko stoji iza Levanta?',
    kljucne: ['tko', 'mirnes', 'o vama', 'o tebi', 'levanat', 'dizajner', 'iskustv'],
    odgovor:
      'Levanat je Mirnes Okanović, web dizajner iz Šibenika. Radi s malim poduzetnicima, obrtnicima i firmama, s posebnom pažnjom na detalje koje većina ne primijeti na prvi pogled, ali ih osjeti.',
    veza: { href: '/o-meni', tekst: 'Više o Mirnesu →' },
  },
  {
    pitanje: 'Kako mogu zatražiti ponudu?',
    kljucne: ['ponud', 'kontakt', 'javiti', 'nazvat', 'mail', 'poruk', 'upit', 'razgovar', 'dogovor'],
    odgovor:
      'Najlakše preko kontakt forme: napišite nekoliko rečenica o svom poslu i Mirnes će Vam se javiti osobno, s pitanjima i besplatnom ponudom, bez ikakve obveze.',
    veza: PONUDA,
  },
];

export const pozdrav =
  'Dobar dan! Ja sam asistent stranice Levanat. Pitajte me o cijenama, izradi stranica, SEO-u ili AI chatbotu, ili odaberite pitanje ispod.';

export const neznam: Znanje = {
  pitanje: '',
  kljucne: [],
  odgovor:
    'Nisam siguran da znam odgovor na to. Najbolje je pitati Mirnesa izravno: preko kontakt forme javit će Vam se osobno.',
  veza: PONUDA,
};

/** Pronađi najbolji odgovor po ključnim riječima (bez obzira na dijakritike). */
export function nadji(upit: string): Znanje {
  const q = ' ' + upit.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd') + ' ';
  let best: Znanje | null = null;
  let score = 0;
  for (const z of baza) {
    const s = z.kljucne.reduce((n, k) => n + (q.includes(k) ? k.length : 0), 0);
    if (s > score) {
      score = s;
      best = z;
    }
  }
  return best ?? neznam;
}
