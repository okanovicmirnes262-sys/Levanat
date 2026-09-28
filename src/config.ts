// Središnje mjesto za podatke o brendu. Placeholderi su u uglatim zagradama.
import { primjeri } from './data/primjeri';

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
  // Kontakt podaci (NAP): dok su u uglatim zagradama, ne prikazuju se na stranici ni u schemi.
  // [TELEFON_PLACEHOLDER] — u međunarodnom obliku, npr. +385 91 234 5678
  phone: '[TELEFON_PLACEHOLDER]',
  // [ADRESA_PLACEHOLDER] — ulica i kućni broj sjedišta (grad je ispod, u `city`)
  address: '[ADRESA_PLACEHOLDER]',
  postalCode: '22000',
  // [RADNO_VRIJEME_PLACEHOLDER] — za prikaz, npr. „Pon–pet 8–16 h”
  hours: '[RADNO_VRIJEME_PLACEHOLDER]',
  // Radno vrijeme za schemu (format schema.org), npr. ['Mo-Fr 08:00-16:00']; prazno = ne ulazi u schemu
  hoursSchema: [] as string[],
  // [OIB_PLACEHOLDER]
  oib: '[OIB_PLACEHOLDER]',
  // Profili na društvenim mrežama, npr. { label: 'Instagram', href: 'https://instagram.com/…' }
  social: [] as { label: string; href: string }[],
  // Koordinate Šibenika (katedrala sv. Jakova), koriste se za izračun izlaska sunca i u schemi.
  geo: { lat: 43.7350, lon: 15.8897 },
  primaryCta: 'Zatražite besplatnu ponudu',
} as const;

// „Primjeri” se u izborniku pojavljuju tek kad postoji barem jedan demo primjer (src/data/primjeri.ts).
export const nav = [
  { href: '/usluge', label: 'Usluge' },
  { href: '/radovi', label: 'Radovi' },
  ...(primjeri.length > 0 ? [{ href: '/primjeri', label: 'Primjeri' }] : []),
  { href: '/blog', label: 'Blog' },
  { href: '/o-meni', label: 'O meni' },
  { href: '/kontakt', label: 'Kontakt' },
] as const;

// Lokacijske stranice (lokalni SEO)
export const lokacije = [
  { href: '/izrada-web-stranica-sibenik', label: 'Izrada web stranica Šibenik' },
  { href: '/izrada-web-stranica-vodice', label: 'Izrada web stranica Vodice' },
] as const;

export const services = [
  {
    n: '01',
    href: '/usluge/izrada-web-stranica',
    title: 'Izrada web stranica',
    short:
      'Stranica na Vašoj domeni, složena najprije za mobitel, s jasnim popisom usluga i kontaktom.',
    meta: 'Okvirno od 200 €',
  },
  {
    n: '02',
    href: '/usluge/lokalni-seo',
    title: 'Lokalni SEO',
    short:
      'Tehnička osnova, sadržaj za usluge i mjesta te strukturirani podaci, da Vas pronađu ljudi iz Vašeg kraja.',
    meta: 'Lokalna vidljivost',
  },
  {
    n: '03',
    href: '/usluge/ai-chatbot',
    title: 'AI chatbot',
    short:
      'Odgovara posjetiteljima na česta pitanja o Vašem poslu, i kad Vi ne stignete.',
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
