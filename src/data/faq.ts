export type Faq = { q: string; a: string };

export const homeFaq: Faq[] = [
  {
    q: 'Koliko košta izrada web stranice?',
    a: 'Svaka je stranica drukčija, pa točnu cijenu dajem nakon kratkog razgovora o tome što Vam treba. Okvirno, izrada kreće od 200 €. Ponuda je besplatna i ne obvezuje Vas ni na što, a u njoj je jasno navedeno što je uključeno, tako da nema iznenađenja na kraju.',
  },
  {
    q: 'Trebam li već imati domenu i hosting?',
    a: 'Ne trebate. Pomoć oko kupnje domene i postavljanja hostinga uključena je u svaku izradu. Zajedno odaberemo ime, a domenu i hosting kupujete na svoje ime, tako da stranica u svakom trenutku ostaje Vaša.',
  },
  {
    q: 'Što ako poslije želim nešto promijeniti?',
    a: 'Birate jednu od dvije mogućnosti. Uz mjesečno održavanje izmjene su uključene: pošaljete mi što treba promijeniti i ja to sredim. Ako Vam je draže jednokratno rješenje, cijeli projekt predajem u Vaše ruke, a za kasnije izmjene uvijek se možemo dogovoriti posebno.',
  },
  {
    q: 'Što je Google Business profil i zašto mi treba?',
    a: 'To je besplatni profil Vašeg poslovanja koji se prikazuje u Google tražilici i na Google kartama: adresa, radno vrijeme, telefon, fotografije i recenzije. Kad netko traži uslugu u blizini, Google najčešće prvo pokaže upravo te profile. Izrada Google Business profila uključena je u svaku izradu web stranice.',
  },
  {
    q: 'Kako radi AI chatbot i odakle zna odgovore?',
    a: 'Chatbot odgovara na temelju baze znanja koju složimo iz materijala koje mi pošaljete (cjenik, radno vrijeme, česta pitanja, opis usluga) ili iz sadržaja Vaše postojeće stranice. Postavljen je tako da se drži tih podataka, a kad odgovor ne zna, posjetitelja uputi da Vas kontaktira izravno.',
  },
  {
    q: 'Radite li samo u Šibeniku?',
    a: 'Ne. Radim s klijentima iz cijele Hrvatske, a gotovo sve se može dogovoriti na daljinu, telefonom, e-mailom ili videopozivom. S klijentima iz Šibenika i Šibensko-kninske županije rado se nađem i uživo, uz kavu.',
  },
];

export const webFaq: Faq[] = [
  homeFaq[0],
  {
    q: 'Koliko traje izrada web stranice?',
    a: 'Ovisi o opsegu stranice i o tome koliko brzo stignu tekstovi i fotografije. Okvirni rok dobivate u ponudi, prije nego što se bilo na što obvežete.',
  },
  {
    q: 'Moram li sam pripremiti tekstove i fotografije?',
    a: 'Pomaže ako imate osnovne informacije i nekoliko dobrih fotografija. Tekstove možemo složiti zajedno: Vi mi ispričate čime se bavite, a ja Vam pomognem to pretočiti u jasan tekst za stranicu.',
  },
  {
    q: 'Hoće li stranica biti moja?',
    a: 'Hoće. Domenu i hosting kupujete na svoje ime, uz moju pomoć. Ako odaberete jednokratnu predaju, dobivate cijeli projekt i sve pristupe, pa ste potpuno neovisni.',
  },
  homeFaq[1],
];

export const seoFaq: Faq[] = [
  {
    q: 'Koliko brzo se vide rezultati SEO optimizacije?',
    a: 'Ovisi o konkurenciji u Vašoj djelatnosti i o tome koliko je stranica nova. Prve promjene obično se vide nakon nekoliko tjedana, a ozbiljniji pomaci traju duže. Zato SEO shvaćam kao temelj koji se gradi, a ne kao trik.',
  },
  {
    q: 'Možete li mi osigurati prvo mjesto na Googleu?',
    a: 'Ne mogu, i ne može nitko tko je iskren. Poredak određuje Google. Ono što mogu jest složiti stranicu i Google Business profil onako kako Google preporučuje i objasniti Vam što je napravljeno i zašto.',
  },
  {
    q: 'Može li SEO bez izrade nove stranice?',
    a: 'Može, ako je postojeća stranica dobra osnova. Ako nije, iskreno ću Vam reći da je isplativije složiti novu nego krpati staru.',
  },
  homeFaq[3],
];

export const chatbotFaq: Faq[] = [
  homeFaq[4],
  {
    q: 'Može li se chatbot dodati na moju postojeću stranicu?',
    a: 'U većini slučajeva može. Chatbot se ugrađuje kao zaseban dodatak, pa ne morate mijenjati cijelu stranicu. Ako Vam uz chatbot treba i nova stranica, složit ćemo oboje.',
  },
  {
    q: 'Na kojem jeziku chatbot odgovara?',
    a: 'Na hrvatskom. Po dogovoru može odgovarati i na drugim jezicima, što je korisno ako Vam se javljaju strani gosti ili kupci.',
  },
  {
    q: 'Što ako se nešto u mom poslovanju promijeni?',
    a: 'Bazu znanja osvježimo: promijenimo cijenu, radno vrijeme ili opis usluge i chatbot od tog trenutka odgovara prema novim podacima.',
  },
];
