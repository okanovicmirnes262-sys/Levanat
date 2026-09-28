// [DOMENA] — upišite punu adresu stranice kad domena bude kupljena, npr. 'https://levanat.hr'
// (bez kose crte na kraju). Može se postaviti i kao varijabla okruženja SITE_URL na Vercelu.
// Dok je prazno, koristi se privremena adresa samo da bi se projekt mogao izgraditi.
const DOMENA = '';

// Ako ni jedno nije postavljeno, na Vercelu se koristi produkcijska adresa projekta (npr. levanatsibenik.vercel.app),
// da canonical, sitemap i OG poveznice nikad ne pokazuju na example.com.
const VERCEL = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '';

export const SITE_URL = (process.env.SITE_URL || DOMENA || VERCEL || 'https://example.com').replace(/\/$/, '');
