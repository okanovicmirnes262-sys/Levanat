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
  const email = isPlaceholder(brand.email) ? undefined : brand.email;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': abs('/') + '#posao',
        name: brand.name,
        url: abs('/'),
        description:
          'Izrada web stranica, lokalni SEO i AI chatbotovi za male poduzetnike, obrtnike i firme iz Šibenika i cijele Hrvatske.',
        image: abs('/og.png'),
        logo: abs('/apple-touch-icon.png'),
        ...(email ? { email } : {}),
        priceRange: 'od 200 €',
        currenciesAccepted: 'EUR',
        knowsLanguage: 'hr',
        address: {
          '@type': 'PostalAddress',
          addressLocality: brand.city,
          addressRegion: brand.region,
          addressCountry: 'HR',
        },
        geo: { '@type': 'GeoCoordinates', latitude: brand.geo.lat, longitude: brand.geo.lon },
        areaServed: [
          { '@type': 'City', name: 'Šibenik' },
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
