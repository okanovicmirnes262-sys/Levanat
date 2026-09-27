// Kontakt forma kao papirnati avion: provjera na klijentu, slanje bez ponovnog
// učitavanja, a papir se presavije i odleti zdesna nalijevo (smjer levanta).
// Bez JS-a radi kao obična forma.

type Field = HTMLInputElement | HTMLTextAreaElement;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s()/.-]{5,24}$/;

const rules: Record<string, (v: string) => string> = {
  ime: (v) => (v.trim().length < 2 ? 'Upišite svoje ime.' : ''),
  poruka: (v) => (v.trim().length < 5 ? 'Napišite barem nekoliko riječi o svom poslu.' : ''),
  kontakt: (v) =>
    EMAIL_RE.test(v.trim()) || PHONE_RE.test(v.trim()) ? '' : 'Upišite e-mail adresu ili broj telefona.',
};

// Obris papira u 6 točaka: list → „kućica” (preklopljeni vrhovi) → strelica → avion odozgo
const OBLICI = [
  [0, 0, 100, 0, 200, 0, 200, 260, 100, 260, 0, 260],
  [0, 92, 100, 0, 200, 92, 200, 260, 100, 260, 0, 260],
  [52, 170, 100, 0, 148, 170, 142, 260, 100, 260, 58, 260],
  [8, 232, 100, 0, 192, 232, 112, 206, 100, 256, 88, 206],
];
// Preklopljeni dijelovi papira (tamniji ton), za svaki korak: lijevi i desni preklop (po 3 točke).
// Prvi preklop je pravi odraz vrha preko pregiba, pa se vidi kako se kut papira prebacuje.
const PREKLOPI = [
  [[100, 0, 0, 0, 0, 92], [100, 0, 200, 0, 200, 92]],
  [[100, 0, 100, 92, 0, 92], [100, 0, 100, 92, 200, 92]],
  [[100, 0, 100, 170, 52, 170], [100, 0, 100, 170, 148, 170]],
  [[100, 0, 100, 256, 88, 206], [100, 0, 112, 206, 192, 232]],
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const tocke = (from: number[], to: number[], k: number) => {
  const pts: string[] = [];
  for (let i = 0; i < from.length; i += 2) pts.push(`${from[i] + (to[i] - from[i]) * k},${from[i + 1] + (to[i + 1] - from[i + 1]) * k}`);
  return pts.join(' ');
};

/** Jedan preklop: obris i oba preklopa se pomiču zajedno (SVG atributi, bez layouta). */
function preklopi(poly: SVGPolygonElement, flaps: SVGPolygonElement[], korak: number, ms: number) {
  return new Promise<void>((done) => {
    const t0 = performance.now();
    const step = (now: number) => {
      const k = ease(Math.min((now - t0) / ms, 1));
      poly.setAttribute('points', tocke(OBLICI[korak - 1], OBLICI[korak], k));
      flaps.forEach((f, j) => {
        f.setAttribute('points', tocke(PREKLOPI[korak - 1][j], PREKLOPI[korak][j], k));
        // prvi preklop: tamni ton se pojavi dok se kut podiže s papira
        if (korak === 1) f.style.opacity = String(Math.min(1, k * 1.6));
      });
      if (k < 1) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  });
}

/**
 * Papir se skupi, presavije u avion (tri pregiba, dva tona papira), okrene nosom ulijevo,
 * nagne se i odleti na levantu uz nekoliko linija vjetra. Animira se samo transform/opacity
 * i SVG (obris, stroke). Vraća se kad je avion izvan ekrana.
 */
async function letaj(papir: HTMLElement) {
  const r = papir.getBoundingClientRect();
  const w = 170;
  const h = (w * 260) / 200;
  const cx = r.left + r.width / 2;
  const cy = Math.min(Math.max(r.top + r.height / 2, h), innerHeight - h / 2);
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;

  const layer = document.createElement('div');
  layer.className = 'avion__let';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = `<div class="avion__tijelo"><svg viewBox="-10 -10 220 280" preserveAspectRatio="none">
      <polygon class="avion__list" points="${OBLICI[0].join(' ')}" vector-effect="non-scaling-stroke"/>
      <polygon class="avion__preklop" points="${PREKLOPI[0][0].join(' ')}" vector-effect="non-scaling-stroke"/>
      <polygon class="avion__preklop avion__preklop--sjena" points="${PREKLOPI[0][1].join(' ')}" vector-effect="non-scaling-stroke"/>
      <path class="avion__pregib" d="M100 0V260" vector-effect="non-scaling-stroke"/>
    </svg></div>`;
  // Sloj stoji na konačnom mjestu papira za avion; skupljanje je samo transform (bez layouta)
  Object.assign(layer.style, { left: `${x0}px`, top: `${y0}px`, width: `${w}px`, height: `${h}px` });
  // U otvorenom <dialog> avion mora letjeti unutar njega (gornji sloj preglednika)
  const host = papir.closest('dialog') ?? document.body;
  host.append(layer);
  const tijelo = layer.querySelector<HTMLElement>('.avion__tijelo')!;
  const poly = layer.querySelector<SVGPolygonElement>('.avion__list')!;
  const flaps = [...layer.querySelectorAll<SVGPolygonElement>('.avion__preklop')];
  const pregib = layer.querySelector<SVGPathElement>('.avion__pregib')!;
  flaps.forEach((f) => (f.style.opacity = '0'));

  // 1. Sadržaj izblijedi, list se skupi na veličinu avionskog papira
  papir.classList.add('is-leti');
  await layer.animate(
    [
      { transform: `translate(${r.left - x0}px, ${r.top - y0}px) scale(${r.width / w}, ${r.height / h})` },
      { transform: 'none' },
    ],
    { duration: 560, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' },
  ).finished;

  // 2. Tri preklopa; papir se pri svakom lagano „podigne” (3D) i spusti
  pregib.style.opacity = '1';
  for (let i = 1; i < OBLICI.length; i++) {
    tijelo.animate(
      [{ transform: 'none' }, { transform: `perspective(700px) rotateX(${i === 3 ? 26 : 14}deg) scale(.97)` }, { transform: 'none' }],
      { duration: 420, easing: 'cubic-bezier(.45,0,.2,1)' },
    );
    await preklopi(poly, flaps, i, 400);
    await sleep(i === OBLICI.length - 1 ? 140 : 70);
  }
  pregib.style.opacity = '0';

  // 3. Linije vjetra zdesna i trag leta
  const dx = -(cx + w * 1.5);
  const dy = -Math.min(cy, 220);
  const svgNS = 'http://www.w3.org/2000/svg';
  const trag = document.createElementNS(svgNS, 'svg');
  trag.setAttribute('class', 'avion__trag');
  trag.setAttribute('aria-hidden', 'true');
  const crta = (d: string, cls = '') => {
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('pathLength', '1');
    p.setAttribute('stroke-dasharray', '1');
    p.setAttribute('stroke-dashoffset', '1');
    if (cls) p.setAttribute('class', cls);
    trag.append(p);
    return p;
  };
  const put = crta(`M${cx} ${cy - 12} Q${cx + dx * 0.45} ${cy - 40} ${cx + dx} ${cy + dy}`);
  const vjetar = [-46, 8, 58].map((o, i) =>
    crta(`M${Math.min(innerWidth, cx + 260 + i * 30)} ${cy + o} q-${120 + i * 20} ${-8 - i * 3} -${260 + i * 40} ${-2 + i * 4}`, 'avion__vjetar'),
  );
  host.append(trag);
  vjetar.forEach((v, i) =>
    v.animate(
      [
        { strokeDashoffset: -1, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.8, offset: 0.45 },
        { strokeDashoffset: 1, opacity: 0 },
      ],
      { duration: 900, delay: i * 110, easing: 'cubic-bezier(.3,0,.1,1)', fill: 'forwards' },
    ),
  );

  // 4. Nos ulijevo, nagib (valjanje oko tijela) i let po krivulji
  const let_ = layer.animate(
    [
      { transform: 'translate(0,0) rotate(0deg) scale(1)' },
      { transform: 'translate(10px,-10px) rotate(-90deg) scale(.82)', offset: 0.2, easing: 'cubic-bezier(.4,0,.6,1)' },
      { transform: `translate(${dx * 0.45}px,-70px) rotate(-98deg) scale(.6)`, offset: 0.6 },
      { transform: `translate(${dx}px,${dy}px) rotate(-110deg) scale(.36)` },
    ],
    { duration: 1400, delay: 120, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' },
  );
  tijelo.animate(
    [
      { transform: 'perspective(600px) rotateY(0deg)' },
      { transform: 'perspective(600px) rotateY(0deg)', offset: 0.18 },
      { transform: 'perspective(600px) rotateY(28deg)', offset: 0.5 },
      { transform: 'perspective(600px) rotateY(12deg)' },
    ],
    { duration: 1400, delay: 120, easing: 'ease-in-out', fill: 'forwards' },
  );
  put.animate(
    [
      { strokeDashoffset: 1, opacity: 0.9 },
      { strokeDashoffset: 0, opacity: 0.5, offset: 0.75 },
      { strokeDashoffset: 0, opacity: 0 },
    ],
    { duration: 1800, delay: 160, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' },
  );
  await let_.finished;
  layer.remove();
  setTimeout(() => trag.remove(), 400);
}

export function initAvion(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('[data-avion]').forEach(init);
}

function init(root: HTMLElement) {
  if (root.dataset.avionSpreman) return;
  root.dataset.avionSpreman = '1';
  const form = root.querySelector<HTMLFormElement>('[data-avion-papir]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const time = form.querySelector<HTMLInputElement>('[data-form-time]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const stigao = root.querySelector<HTMLElement>('[data-avion-stigao]')!;
  const imeOut = root.querySelector<HTMLElement>('[data-avion-ime]')!;
  const opet = root.querySelector<HTMLButtonElement>('[data-avion-opet]');
  const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  time.value = String(Date.now());

  const field = (name: string) => form.elements.namedItem(name) as Field;
  const setError = (name: string, msg: string) => {
    const out = form.querySelector<HTMLElement>(`#${name}-greska`);
    if (out) out.textContent = msg;
    field(name)?.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };
  const check = (name: string) => {
    const msg = rules[name](field(name).value);
    setError(name, msg);
    return msg;
  };

  // Odgovori iz kalkulatora cijene
  const params = new URLSearchParams(location.search);
  const u = params.get('usluga');
  if (u) form.querySelector<HTMLInputElement>('[data-avion-usluga]')!.value = u;
  const pr = params.get('poruka');
  if (pr) field('poruka').value = pr;
  if (params.get('greska')) {
    status.dataset.state = 'error';
    status.textContent = 'Poruka nije poslana. Pokušajte ponovno ili mi pišite izravno na e-mail.';
  }

  // E-mail ili telefon: prilagodi tipkovnicu na mobitelu čim je jasno što se upisuje
  const kontakt = field('kontakt') as HTMLInputElement;
  kontakt.addEventListener('input', () => {
    kontakt.inputMode = /^[+\d]/.test(kontakt.value) ? 'tel' : 'email';
  });

  Object.keys(rules).forEach((name) =>
    field(name).addEventListener('input', () => {
      if (field(name).getAttribute('aria-invalid') === 'true') check(name);
    }),
  );

  const vrati = () => {
    form.classList.remove('is-leti', 'is-poslano');
    form.hidden = false;
    stigao.hidden = true;
  };
  // Ponovno otvaranje prozora nakon poslanog upita počinje s praznim papirom
  root.addEventListener('avion:novi', () => {
    if (stigao.hidden) return;
    vrati();
    time.value = String(Date.now());
  });
  opet?.addEventListener('click', () => {
    vrati();
    time.value = String(Date.now());
    field('ime').focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = Object.keys(rules).filter((n) => check(n));
    if (invalid.length) {
      field(invalid[0]).focus();
      status.dataset.state = 'error';
      status.textContent = 'Provjerite označena polja.';
      return;
    }

    button.disabled = true;
    label.textContent = 'Šaljem…';
    status.dataset.state = '';
    status.textContent = '';

    const slanje = fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { accept: 'application/json' },
    })
      .then(async (res) => ({ res, body: await res.json().catch(() => ({})) }))
      .catch(() => ({ res: null, body: {} as Record<string, unknown> }));

    // Avion leti dok zahtjev putuje; odgovor čekamo tek kad sleti
    if (motion) await letaj(form);
    const { res, body } = await slanje;

    if (res?.ok && body.ok) {
      const ime = field('ime').value.trim().split(/\s+/)[0];
      imeOut.textContent = ime ? `, ${ime}` : '';
      form.reset();
      form.hidden = true;
      stigao.hidden = false;
      stigao.focus({ preventScroll: true });
      const r = stigao.getBoundingClientRect();
      if (r.top < 80 || r.bottom > innerHeight)
        stigao.scrollIntoView({ block: 'center', behavior: motion ? 'smooth' : 'auto' });
      label.textContent = 'Pošaljite avion';
      root.dispatchEvent(new CustomEvent('avion:poslan', { bubbles: true }));
    } else {
      // Avion se nije vratio prazan: papir je opet tu, s upisanim tekstom
      vrati();
      if (body.errors) Object.entries(body.errors as Record<string, string>).forEach(([k, v]) => setError(k, v));
      status.dataset.state = 'error';
      status.textContent =
        (body.message as string) || 'Poruka nije poslana. Pokušajte ponovno ili mi pišite izravno na e-mail.';
      label.textContent = 'Pošaljite avion';
    }
    button.disabled = false;
  });
}
