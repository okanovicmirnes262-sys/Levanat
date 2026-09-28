import { SITE_URL } from '../site.config.mjs';
import { brand, services } from './config';

export const siteUrl = SITE_URL;

/** Apsolutni URL bez kose crte na kraju (osim za početnu). */
export function abs(path = '/'): string {
  const clean = path === '/' ? '/' : path.replace(/\/$/, '');
  return new URL(clean, SITE_URL).toString();
}

/** Je li vrijednost još placeholder (npr. „[EMAIL_PLACEHOLDER]”). */
export const isPlaceholder = (v: string) => /^\[.*\]$/.test(v.trim());

/** Vrijednost ako je stvarna, inače undefined (za prikaz i schemu). */
export const stvarno = (v: string) => (v && !isPlaceholder(v) ? v : undefined);

/** Broj telefona za poveznicu tel: (samo znamenke i +). */
export const telHref = (v: string) => `tel:${v.replace(/[^\d+]/g, '')}`;

/** Rastavlja tekst na riječi u <span class="w"> za uvodnu animaciju naslova. */
export function splitWords(text: string, start = 0): { html: string; next: number } {
  let i = start;
  const html = text
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) || part === '' ? part : `<span class="w" style="--wi:${i++}">${part}</span>`))
    .join('');
  return { html, next: i };
}

/** Riječ „Levanat” rastavljena na slova za detalj s vjetrom. */
export function windLetters(word: string): string {
  const n = word.length;
  return [...word].map((c, i) => `<span style="--i:${i};--n:${n}">${c}</span>`).join('');
}

export function businessSchema() {
  const email = stvarno(brand.email);
  const telephone = stvarno(brand.phone);
  const street = stvarno(brand.address);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': abs('/') + '#posao',
        name: brand.name,
        url: abs('/'),
        description:
          'Izrada web stranica, web dizajn, lokalni SEO i AI chatbotovi za male poduzetnike, obrtnike i firme iz Šibenika, Vodica i cijele Hrvatske.',
        image: abs('/og.png'),
        logo: abs('/apple-touch-icon.png'),
        ...(email ? { email } : {}),
        ...(telephone ? { telephone } : {}),
        ...(brand.hoursSchema.length ? { openingHours: brand.hoursSchema } : {}),
        ...(brand.social.length ? { sameAs: brand.social.map((m) => m.href) } : {}),
        priceRange: 'od 200 €',
        currenciesAccepted: 'EUR',
        knowsLanguage: 'hr',
        address: {
          '@type': 'PostalAddress',
          ...(street ? { streetAddress: street, postalCode: brand.postalCode } : {}),
          addressLocality: brand.city,
          addressRegion: brand.region,
          addressCountry: 'HR',
        },
        geo: { '@type': 'GeoCoordinates', latitude: brand.geo.lat, longitude: brand.geo.lon },
        areaServed: [
          { '@type': 'City', name: 'Šibenik' },
          { '@type': 'City', name: 'Vodice' },
          { '@type': 'AdministrativeArea', name: 'Šibensko-kninska županija' },
          { '@type': 'Country', name: 'Hrvatska' },
        ],
        founder: { '@id': abs('/o-meni') + '#mirnes' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Usluge',
          itemListElement: services
            .filter((s) => !s.href.includes('#'))
            .map((s) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: s.title, url: abs(s.href) },
            })),
        },
      },
      {
        '@type': 'Person',
        '@id': abs('/o-meni') + '#mirnes',
        name: brand.owner,
        jobTitle: brand.role,
        url: abs('/o-meni'),
        worksFor: { '@id': abs('/') + '#posao' },
        address: { '@type': 'PostalAddress', addressLocality: brand.city, addressCountry: 'HR' },
        knowsLanguage: 'hr',
      },
      {
        '@type': 'WebSite',
        '@id': abs('/') + '#web',
        name: brand.name,
        url: abs('/'),
        inLanguage: 'hr-HR',
        publisher: { '@id': abs('/') + '#posao' },
      },
    ],
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export type Crumb = { name: string; href: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.href),
    })),
  };
}

/** Usluga na određenom području (lokacijske stranice i stranice usluga). */
export function serviceSchema(o: { name: string; url: string; description: string; mjesta?: string[]; odCijene?: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: o.name,
    serviceType: o.name,
    url: abs(o.url),
    description: o.description,
    provider: { '@id': abs('/') + '#posao' },
    areaServed: (o.mjesta ?? ['Šibenik']).map((name) => ({ '@type': 'City', name })),
    ...(o.odCijene
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            priceSpecification: { '@type': 'PriceSpecification', minPrice: o.odCijene, priceCurrency: 'EUR' },
          },
        }
      : {}),
  };
}

/** Članak na blogu. */
export function articleSchema(o: { title: string; description: string; url: string; objavljeno: Date; azurirano?: Date }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: o.title,
    description: o.description,
    url: abs(o.url),
    mainEntityOfPage: abs(o.url),
    datePublished: o.objavljeno.toISOString().slice(0, 10),
    dateModified: (o.azurirano ?? o.objavljeno).toISOString().slice(0, 10),
    inLanguage: 'hr-HR',
    image: abs('/og.png'),
    author: { '@id': abs('/o-meni') + '#mirnes' },
    publisher: { '@id': abs('/') + '#posao' },
  };
}
