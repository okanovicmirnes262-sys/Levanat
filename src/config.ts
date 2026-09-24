// Središnje mjesto za podatke o brendu. Placeholderi su u uglatim zagradama.

export const brand = {
  name: 'Levanat',
  owner: 'Mirnes Okanović',
  role: 'Web dizajner',
  city: 'Šibenik',
  region: 'Šibensko-kninska županija',
  country: 'Hrvatska',
  email: '[EMAIL_PLACEHOLDER]',
  // [PODACI_O_OBRTU] — naziv obrta, adresa sjedišta, OIB, MBO/registarski broj.
  // Dok registracija nije gotova, footer i pravila privatnosti prikazuju ovaj tekst.
  businessDetails: '[PODACI_O_OBRTU]',
  // Koordinate Šibenika (katedrala sv. Jakova), koriste se za izračun izlaska sunca i u schemi.
  geo: { lat: 43.7350, lon: 15.8897 },
  primaryCta: 'Zatražite besplatnu ponudu',
} as const;

export const nav = [
  { href: '/usluge', label: 'Usluge' },
  { href: '/radovi', label: 'Radovi' },
  { href: '/o-meni', label: 'O meni' },
  { href: '/kontakt', label: 'Kontakt' },
] as const;

export const services = [
  {
    n: '01',
    href: '/usluge/izrada-web-stranica',
    title: 'Izrada web stranica',
    short:
      'Brza, pregledna stranica s Vašim imenom i domenom. Složena za mobitel, jer Vas tako većina ljudi i traži.',
    meta: 'Okvirno od 200 €',
  },
  {
    n: '02',
    href: '/usluge/seo-optimizacija',
    title: 'SEO optimizacija',
    short:
      'Lokalni SEO: kako biste se pojavili kad netko u Šibeniku ili okolici na Googleu upiše ono čime se bavite.',
    meta: 'Lokalna vidljivost',
  },
  {
    n: '03',
    href: '/usluge/ai-chatbot',
    title: 'AI chatbot',
    short:
      'Asistent na Vašoj stranici koji posjetiteljima odgovara na osnovna pitanja, i usred noći i nedjeljom.',
    meta: 'Iz Vaših materijala',
  },
  {
    n: '04',
    href: '/usluge#odrzavanje',
    title: 'Održavanje',
    short:
      'Mjesečno održavanje s izmjenama uključenima ili jednokratna predaja cijelog projekta u Vaše ruke.',
    meta: 'Po Vašem izboru',
  },
] as const;
