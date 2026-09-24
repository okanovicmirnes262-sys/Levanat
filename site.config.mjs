// [DOMENA] — upišite punu adresu stranice kad domena bude kupljena, npr. 'https://levanat.hr'
// (bez kose crte na kraju). Može se postaviti i kao varijabla okruženja SITE_URL na Vercelu.
// Dok je prazno, koristi se privremena adresa samo da bi se projekt mogao izgraditi.
const DOMENA = '';

export const SITE_URL = (process.env.SITE_URL || DOMENA || 'https://example.com').replace(/\/$/, '');
