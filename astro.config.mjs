import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './site.config.mjs';
import { readdirSync, readFileSync } from 'node:fs';

// Datumi članaka za sitemap (azurirano ili objavljeno iz frontmattera)
const blogDatumi = Object.fromEntries(
  readdirSync('./src/content/blog')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const fm = readFileSync(`./src/content/blog/${f}`, 'utf8').split('---')[1] ?? '';
      const d = fm.match(/^azurirano:\s*(\S+)/m)?.[1] ?? fm.match(/^objavljeno:\s*(\S+)/m)?.[1];
      return [f.replace(/\.md$/, ''), d ? new Date(d) : undefined];
    }),
);

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  // Stara adresa SEO usluge (301 na Vercelu)
  redirects: {
    '/usluge/seo-optimizacija': { status: 301, destination: '/usluge/lokalni-seo' },
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/kontakt/hvala'),
      changefreq: 'monthly',
      // Datum zadnje izmjene: za članke iz frontmattera (azurirano ili objavljeno), za ostalo datum builda
      serialize(item) {
        const m = item.url.match(/\/blog\/([^/]+)$/);
        const datum = m && blogDatumi[m[1]];
        return { ...item, lastmod: (datum ?? new Date()).toISOString() };
      },
    }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
});
