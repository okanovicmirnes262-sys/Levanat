// Sadržaj lokacijskih stranica (lokalni SEO). Svaka stranica ima vlastiti, jedinstven tekst:
// kopirani tekst s promijenjenim imenom mjesta Googleu ne pomaže. Tekstovi smiju sadržavati HTML poveznice.
import type { Faq } from './faq';

export type Odlomak = { naslov: string; oznaka: string; tekst: string[]; stavke?: [string, string][] };

export type Lokacija = {
  slug: string;
  mjesto: string;
  /** u lokativu: „u Šibeniku”, „u Vodicama” */
  uMjestu: string;
  title: string;
  description: string;
  h1: string;
  h1Em: string;
  uvod: string;
  odlomci: Odlomak[];
  /** naziv projekta iz radovi.ts koji se prikazuje kao primjer iz okolice */
  primjer?: string;
  faq: Faq[];
  ctaNaslov: string;
};

export const lokacije: Lokacija[] = [
  {
    slug: 'izrada-web-stranica-sibenik',
    mjesto: 'Šibenik',
    uMjestu: 'u Šibeniku',
    title: 'Web dizajn Šibenik — stranice za lokalne obrte | Levanat',
    description:
      'Web dizajn i izrada web stranica u Šibeniku: lokalni web dizajner, sastanak uživo, stranica za obrt ili malu firmu od 200 €. Zatražite besplatnu ponudu!',
    h1: 'Web dizajn i izrada web stranica',
    h1Em: 'u Šibeniku',
    uvod:
      'Radim iz Šibenika, za šibenske obrte, salone, ugostitelje i male firme. Stranicu dogovaramo uživo, uz kavu, a ne preko obrasca i automatskih poruka.',
    odlomci: [
      {
        oznaka: 'Lokalno',
        naslov: 'Zašto web dizajner iz Šibenika?',
        tekst: [
          'Kad netko u Šibeniku treba vodoinstalatera, frizera, računovođu ili stol za večeru, najčešće uzme mobitel i upiše „… Šibenik”. Tko se u tom trenutku pojavi s jasnom stranicom, dobiva poziv. Stranica koju pravim zato je složena oko jednog pitanja: može li čovjek na mobitelu u nekoliko sekundi vidjeti čime se bavite, gdje ste i kako Vas dobiti.',
          'Prednost lokalnog web dizajnera je jednostavna: poznajem grad i ljude kojima se obraćate. Znam razliku između posla koji živi od stalnih mušterija iz Varoša i Mandaline i posla koji ljeti ovisi o gostima iz cijele Europe. Tekst, fotografije i raspored na stranici prilagođavam upravo tome.',
        ],
      },
      {
        oznaka: 'Što dobivate',
        naslov: 'Web stranica za šibenski obrt ili malu firmu',
        tekst: [
          'Svaka stranica radi se po mjeri, ne iz gotovog predloška. U osnovnu izradu uključeno je sve što mali posao treba da bi ga ljudi pronašli i kontaktirali:',
        ],
        stavke: [
          ['Dizajn po mjeri', 'Izgled koji odgovara Vašem poslu, s Vašim fotografijama i tekstom koji zvuči kao Vi.'],
          ['Prvo za mobitel', 'Većina pretraga u Šibeniku ide s mobitela, pa stranicu slažem najprije za mali ekran.'],
          ['Brzo učitavanje', 'I na slabijem signalu u starom gradu ili na otoku stranica se otvara brzo.'],
          ['Lokalni SEO', 'Naslovi, opisi i strukturirani podaci koji Googleu jasno kažu da radite u Šibeniku. <a class="link" href="/usluge/lokalni-seo">Kako radi lokalni SEO</a>'],
          ['Kontakt na jedan dodir', 'Telefon, WhatsApp ili e-mail tamo gdje ih posjetitelj očekuje.'],
        ],
      },
      {
        oznaka: 'Suradnja',
        naslov: 'Kako izgleda suradnja u Šibeniku',
        tekst: [
          'Prvi razgovor je besplatan i ne obvezuje Vas ni na što. S klijentima iz Šibenika najradije se nađem uživo, kod Vas u radnji, uredu ili na kavi, jer tako u pola sata saznam više nego iz deset e-mailova. Nakon toga dobivate pisanu ponudu u kojoj piše što je uključeno i koliko košta.',
          'Tijekom izrade šaljem Vam međuverzije, pa na vrijeme vidite kako stranica nastaje. Na kraju birate: cijeli projekt predajem u Vaše ruke ili se i dalje brinem o stranici uz <a class="link" href="/usluge#odrzavanje">mjesečno održavanje</a>.',
        ],
      },
      {
        oznaka: 'Cijena',
        naslov: 'Koliko košta web stranica u Šibeniku?',
        tekst: [
          'Izrada jednostavne stranice okvirno kreće od 200 €. Konačna cijena ovisi o broju podstranica, jezicima i dodacima poput obrasca za upite ili AI chatbota. Detaljnije objašnjenje što utječe na cijenu pročitajte u članku <a class="link" href="/blog/koliko-kosta-izrada-web-stranice">koliko košta izrada web stranice</a>, a okvirni iznos izračunajte sami u kalkulatoru na stranici <a class="link" href="/usluge/izrada-web-stranica#cijena">izrada web stranica za obrte i male firme</a>.',
        ],
      },
    ],
    primjer: 'MAR-KOP — strojni iskopi',
    faq: [
      {
        q: 'Možemo li se naći uživo u Šibeniku?',
        a: 'Možemo. S klijentima iz Šibenika i okolice rado se nađem uživo, kod Vas ili na kavi. Ako Vam je draže, sve se može dogovoriti i telefonom ili videopozivom.',
      },
      {
        q: 'Radite li i za obrte izvan grada, npr. u Brodarici, Zatonu ili Primoštenu?',
        a: 'Radim. Šibenik i cijela Šibensko-kninska županija su mi pri ruci, a za dalje krajeve sve se odradi na daljinu jednako dobro.',
      },
      {
        q: 'Treba li mi stranica ako me ljudi u Šibeniku ionako znaju?',
        a: 'Preporuke i danas rade, ali ljudi ih provjere na Googleu prije nego što nazovu. Ako tamo pronađu samo stari Facebook profil ili konkurenciju, poziv ode drugome. Stranica je mjesto na koje možete uputiti svakoga.',
      },
      {
        q: 'Koliko traje izrada web stranice?',
        a: 'Jednostavna stranica obično je gotova u nekoliko tjedana, ovisno o tome koliko brzo stignu tekstovi i fotografije. Okvirni rok dobivate u ponudi.',
      },
    ],
    ctaNaslov: 'Imate posao u Šibeniku kojem treba stranica?',
  },
  {
    slug: 'izrada-web-stranica-vodice',
    mjesto: 'Vodice',
    uMjestu: 'u Vodicama',
    title: 'Izrada web stranica Vodice — za turizam i obrte | Levanat',
    description:
      'Izrada web stranica u Vodicama za apartmane, restorane, charter i obrte: višejezično, brzo na mobitelu, s rezervacijama. Zatražite besplatnu ponudu!',
    h1: 'Izrada web stranica',
    h1Em: 'u Vodicama',
    uvod:
      'Stranice za iznajmljivače, restorane, izlete, charter i obrte iz Vodica, Srime, Tribunja i Prvić Luke. Složene za goste koji Vas traže s mobitela, često na stranom jeziku.',
    odlomci: [
      {
        oznaka: 'Turizam',
        naslov: 'Vodice žive od sezone. Vaša stranica mora raditi i u siječnju.',
        tekst: [
          'Većina gostiju odluku o smještaju, izletu ili restoranu donosi mjesecima prije dolaska, s kauča u Beču, Münchenu ili Varšavi. Tada Vas pronalaze preko Googlea, a stranica im mora odmah reći gdje ste, što nudite i kako rezervirati. Na booking platformama ste jedan od stotinu; na vlastitoj stranici ste jedini.',
          'Zato stranice za Vodice slažem drukčije nego za posao koji radi samo s domaćim kupcima: više jezika, fotografije koje prodaju, jasne cijene ili raspon cijena i jednostavan obrazac za upit ili rezervaciju.',
        ],
      },
      {
        oznaka: 'Što dobivate',
        naslov: 'Web stranica za apartmane, restorane i izlete u Vodicama',
        tekst: ['Uz osnovnu izradu, za turistički posao u Vodicama najčešće ima smisla:'],
        stavke: [
          ['Više jezika', 'Hrvatski, engleski i njemački, a po potrebi i drugi jezici Vaših gostiju.'],
          ['Upit ili rezervacija', 'Obrazac koji gostu traži samo ono što Vam treba: datume, broj osoba i kontakt.'],
          ['Izravni upiti bez provizije', 'Svaki gost koji rezervira preko Vaše stranice, a ne platforme, znači manju proviziju.'],
          ['Brzo na mobitelnoj mreži', 'Stranica se brzo otvara i gostima u roamingu i na slabom signalu na plaži.'],
          ['AI chatbot', 'Odgovara gostima na česta pitanja (parking, ljubimci, udaljenost od plaže) i noću. <a class="link" href="/usluge/ai-chatbot">Više o AI chatbotu</a>'],
        ],
      },
      {
        oznaka: 'Obrti',
        naslov: 'Ne samo turizam: stranice za obrte iz Vodica',
        tekst: [
          'Vodice nisu samo apartmani. Majstori, servisi klima i bazena, frizeri, kozmetičari i trgovine rade cijelu godinu, a sezonom posla ima više nego vremena. Za njih radim jednostavnu, brzu stranicu s popisom usluga, područjem rada (Vodice, Tribunj, Srima, Pirovac) i telefonom na jedan dodir, da poziv dođe od pravih ljudi.',
        ],
      },
      {
        oznaka: 'Suradnja',
        naslov: 'Kako radimo',
        tekst: [
          'Vodice su dvadesetak minuta od Šibenika, pa se rado nađemo uživo, izvan sezone ili kad Vam odgovara. Nakon besplatnog razgovora dobivate ponudu, a stranicu je najbolje pripremiti do proljeća, prije nego što gosti počnu tražiti smještaj za ljeto. Kako Google uopće odlučuje koga će prikazati, objašnjeno je na stranici <a class="link" href="/usluge/lokalni-seo">lokalni SEO</a>.',
        ],
      },
    ],
    primjer: 'Pandora Turist — Villa Roza',
    faq: [
      {
        q: 'Na koliko jezika treba biti stranica za apartmane u Vodicama?',
        a: 'Najčešće su dovoljni hrvatski, engleski i njemački. Ako Vam dolazi puno gostiju iz Poljske, Češke ili Slovenije, ima smisla dodati i njihov jezik. Prijevod dogovaramo prema tome tko su Vaši gosti.',
      },
      {
        q: 'Mogu li primati rezervacije preko vlastite stranice?',
        a: 'Možete. Najjednostavnije je obrazac za upit s datumima i brojem osoba, a po potrebi stranicu povežemo i s kalendarom zauzetosti koji već koristite.',
      },
      {
        q: 'Kada je najbolje napraviti stranicu za sezonu?',
        a: 'Zimi ili početkom proljeća. Gosti rezerviraju ljeto već od siječnja, a i Googleu treba nekoliko tjedana da novu stranicu dobro upozna.',
      },
      {
        q: 'Radite li i za Tribunj, Srimu i Prvić?',
        a: 'Radim. Cijelo područje oko Vodica i Šibenika mi je blizu, a za sve ostalo dovoljni su telefon i e-mail.',
      },
    ],
    ctaNaslov: 'Pripremimo Vašu stranicu za sljedeću sezonu.',
  },
];
