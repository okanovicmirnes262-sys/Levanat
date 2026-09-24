import type { APIRoute } from 'astro';
import { SITE_URL } from '../../site.config.mjs';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /kontakt/hvala\n\nSitemap: ${SITE_URL}/sitemap-index.xml\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
