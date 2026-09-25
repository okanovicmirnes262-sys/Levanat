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

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function preklopi(poly: SVGPolygonElement, from: number[], to: number[], ms: number) {
  return new Promise<void>((done) => {
    const t0 = performance.now();
    const step = (now: number) => {
      const k = ease(Math.min((now - t0) / ms, 1));
      const pts: string[] = [];
      for (let i = 0; i < from.length; i += 2)
        pts.push(`${from[i] + (to[i] - from[i]) * k},${from[i + 1] + (to[i + 1] - from[i + 1]) * k}`);
      poly.setAttribute('points', pts.join(' '));
      if (k < 1) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  });
}

/** Papir se skupi, presavije u avion i odleti. Vraća se kad je avion izvan ekrana. */
async function letaj(papir: HTMLElement) {
  const r = papir.getBoundingClientRect();
  const w = 170;
  const h = (w * 260) / 200;
  const cx = r.left + r.width / 2;
  const cy = Math.min(Math.max(r.top + r.height / 2, h), innerHeight - h / 2);

  const layer = document.createElement('div');
  layer.className = 'avion__let';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = `<svg viewBox="-10 -10 220 280" preserveAspectRatio="none">
      <polygon class="avion__list" points="${OBLICI[0].join(' ')}" vector-effect="non-scaling-stroke"/>
      <path class="avion__pregib" d="M100 0V260" vector-effect="non-scaling-stroke"/>
    </svg>`;
  Object.assign(layer.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  // U otvorenom <dialog> avion mora letjeti unutar njega (gornji sloj preglednika)
  const host = papir.closest('dialog') ?? document.body;
  host.append(layer);
  const poly = layer.querySelector('polygon')!;
  const pregib = layer.querySelector<SVGPathElement>('.avion__pregib')!;

  // 1. Sadržaj izblijedi, list se skupi na veličinu avionskog papira
  papir.classList.add('is-leti');
  await layer.animate(
    [
      { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` },
      { left: `${cx - w / 2}px`, top: `${cy - h / 2}px`, width: `${w}px`, height: `${h}px` },
    ],
    { duration: 520, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' },
  ).finished;

  // 2. Tri preklopa
  pregib.style.opacity = '1';
  for (let i = 1; i < OBLICI.length; i++) {
    await preklopi(poly, OBLICI[i - 1], OBLICI[i], 380);
    await sleep(60);
  }

  // 3. Avion se okrene nosom ulijevo i odleti na levantu, uz tanki trag vjetra
  const dx = -(cx + w * 1.5);
  const dy = -Math.min(cy, 220);
  const svgNS = 'http://www.w3.org/2000/svg';
  const trag = document.createElementNS(svgNS, 'svg');
  trag.setAttribute('class', 'avion__trag');
  trag.setAttribute('aria-hidden', 'true');
  const put = document.createElementNS(svgNS, 'path');
  put.setAttribute('d', `M${cx} ${cy - 12} Q${cx + dx * 0.45} ${cy - 40} ${cx + dx} ${cy + dy}`);
  put.setAttribute('pathLength', '1');
  put.setAttribute('stroke-dasharray', '1');
  trag.append(put);
  host.append(trag);
  const let_ = layer.animate(
    [
      { transform: 'translate(0,0) rotate(0deg) scale(1)' },
      { transform: 'translate(0,-12px) rotate(-90deg) scale(.8)', offset: 0.22 },
      { transform: `translate(${dx * 0.45}px,-70px) rotate(-100deg) scale(.6)`, offset: 0.6 },
      { transform: `translate(${dx}px,${dy}px) rotate(-108deg) scale(.4)` },
    ],
    { duration: 1300, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' },
  );
  put.animate(
    [
      { strokeDashoffset: 1, opacity: 0.9 },
      { strokeDashoffset: 0, opacity: 0.5, offset: 0.75 },
      { strokeDashoffset: 0, opacity: 0 },
    ],
    { duration: 1700, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' },
  );
  await let_.finished;
  layer.remove();
  trag.remove();
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
