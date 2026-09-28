import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './site.config.mjs';

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
    }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
});
