import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { serviceOptions } from '../../data/kontakt';

export const prerender = false;

const MIN_FILL_MS = 2500;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

type Fields = { ime: string; kontakt: string; usluga: string; poruka: string; web: string; t: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s()/.-]{5,24}$/;

function validate(f: Fields): Record<string, string> {
  const e: Record<string, string> = {};
  if (f.ime.length < 2 || f.ime.length > 100) e.ime = 'Upišite svoje ime.';
  if (f.kontakt.length > 200 || !(EMAIL_RE.test(f.kontakt) || PHONE_RE.test(f.kontakt)))
    e.kontakt = 'Upišite e-mail adresu ili broj telefona.';
  if (f.usluga && !(serviceOptions as readonly string[]).includes(f.usluga)) e.usluga = 'Nepoznata vrsta usluge.';
  if (f.poruka.length < 5) e.poruka = 'Napišite barem nekoliko riječi o svom poslu.';
  if (f.poruka.length > 5000) e.poruka = 'Poruka je predugačka (najviše 5000 znakova).';
  return e;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > RATE_MAX;
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const reply = (status: number, body: Record<string, unknown>) => {
    if (wantsJson) {
      return new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      });
    }
    return redirect(status < 300 ? '/kontakt/hvala' : '/kontakt?greska=1#obrazac', 303);
  };

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return reply(400, { ok: false, message: 'Neispravan zahtjev.' });
  }

  const get = (k: string) => String(data.get(k) ?? '').trim();
  const f: Fields = {
    ime: get('ime'),
    kontakt: get('kontakt'),
    usluga: get('usluga'),
    poruka: get('poruka'),
    web: get('web'),
    t: get('t'),
  };

  // Zaštita od spama: honeypot polje i prebrzo ispunjena forma. Botu glumimo uspjeh.
  const elapsed = Date.now() - Number(f.t || 0);
  if (f.web || !f.t || Number.isNaN(elapsed) || elapsed < MIN_FILL_MS) {
    return reply(200, { ok: true });
  }

  let ip = 'nepoznato';
  try {
    ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || clientAddress || ip;
  } catch {
    /* clientAddress nije dostupan u svim okruženjima */
  }
  if (rateLimited(ip)) {
    return reply(429, { ok: false, message: 'Poslali ste previše poruka. Pokušajte ponovno za nekoliko minuta.' });
  }

  const errors = validate(f);
  if (Object.keys(errors).length) {
    return reply(422, { ok: false, errors, message: 'Provjerite označena polja.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || 'Levanat <onboarding@resend.dev>';
  if (!apiKey || !to) {
    console.error('Kontakt forma: nedostaju RESEND_API_KEY ili CONTACT_TO_EMAIL.');
    return reply(500, { ok: false, message: 'Slanje trenutno nije moguće. Pišite mi izravno na e-mail.' });
  }

  const isEmail = EMAIL_RE.test(f.kontakt);
  const rows: [string, string][] = [
    ['Ime', f.ime],
    [isEmail ? 'E-mail' : 'Telefon', f.kontakt],
  ];
  if (f.usluga) rows.push(['Usluga', f.usluga]);
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nPoruka:\n${f.poruka}`;
  const html = `<div style="font-family:Georgia,serif;color:#0f2a33;line-height:1.6">
<h2 style="font-weight:400">Novi upit s levanat stranice</h2>
<table style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#4d6168">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`,
    )
    .join('')}</table>
<p style="margin-top:24px;white-space:pre-wrap">${esc(f.poruka)}</p></div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: to.split(',').map((s) => s.trim()),
      ...(isEmail ? { replyTo: f.kontakt } : {}),
      subject: `Novi avion s Levanata: ${f.ime}`,
      text,
      html,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error('Kontakt forma: slanje nije uspjelo', err);
    return reply(502, { ok: false, message: 'Poruka nije poslana. Pokušajte ponovno ili mi pišite izravno na e-mail.' });
  }

  return reply(200, { ok: true });
};

export const ALL: APIRoute = () => new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
