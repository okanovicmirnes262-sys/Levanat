// Papirnati avion: na početnoj sjedi na gumbu „Zatražite besplatnu ponudu” i nakon
// nekoliko sekundi polako padne kao list na vjetru i ostane u donjem lijevom kutu.
// Klik na avion ili na bilo koji gumb „Zatražite besplatnu ponudu” otvara kontakt
// formu u prozoru; sama forma (avion.ts) učitava se tek tada.
import { lenisRef } from './lenis-ref';

type Stanje = 'skriven' | 'sjedi' | 'pada' | 'sletio';

export function initAvionLet() {
  const plane = document.querySelector<HTMLButtonElement>('[data-avion-leti]');
  const dlg = document.querySelector<HTMLDialogElement>('[data-avion-prozor]');
  if (!plane || !dlg || typeof dlg.showModal !== 'function') return;

  let poslan = false;
  try {
    poslan = sessionStorage.getItem('levanat.avion') === '1';
  } catch {
    /* bez sessionStoragea avion se samo ponovno pojavi */
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seat = document.querySelector<HTMLElement>('[data-avion-sjedalo]');
  let stanje: Stanje = 'skriven';
  let let_: Animation | null = null;
  let nagni: Animation | null = null;

  // --- Prozor s formom ---
  let spreman = false;
  const otvori = async () => {
    if (!spreman) {
      spreman = true;
      const m = await import('./avion');
      m.initAvion(dlg);
    }
    if (dlg.open) return;
    dlg.querySelector('[data-avion]')?.dispatchEvent(new Event('avion:novi'));
    dlg.showModal();
    lenisRef.current?.stop();
    dlg.querySelector<HTMLInputElement>('#ime')?.focus();
  };
  plane.addEventListener('pointerenter', () => import('./avion'), { once: true });
  plane.addEventListener('click', otvori);
  dlg.addEventListener('close', () => lenisRef.current?.start());
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.querySelectorAll('[data-avion-zatvori]').forEach((b) => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('avion:poslan', () => {
    try {
      sessionStorage.setItem('levanat.avion', '1');
    } catch {
      /* nije bitno */
    }
    plane.classList.add('is-otisao');
    setTimeout(() => plane.remove(), 600);
  });

  // --- Sjedenje na gumbu (samo početna) ---
  const sjedni = () => {
    if (stanje !== 'sjedi' || !seat) return;
    plane.style.left = `${seat.offsetLeft + seat.offsetWidth - 30}px`;
    plane.style.top = `${seat.offsetTop - plane.offsetHeight + 4}px`;
  };

  // --- Pad: ljuljanje lijevo-desno uz polagano spuštanje prema donjem lijevom kutu ---
  const padni = (x0: number, y0: number, ms: number) => {
    stanje = 'pada';
    removeEventListener('scroll', naScroll);
    plane.hidden = false;
    document.body.append(plane);
    plane.style.left = plane.style.top = '';
    plane.classList.remove('is-sletio');
    plane.classList.add('is-pada');
    const h = plane.offsetHeight;
    const ex = 16;
    const ey = innerHeight - h - 16;
    const frames: Keyframe[] = [];
    const nagib: Keyframe[] = [];
    const n = 24;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const sway = Math.sin(t * Math.PI * 3.5);
      const x = x0 + (ex - x0) * t + sway * 46 * (1 - t);
      const y = y0 + (ey - y0) * (t * t * (3 - 2 * t));
      frames.push({ transform: `translate(${x}px, ${y}px)` });
      // Naginje se samo avion, natpis ostaje vodoravan
      nagib.push({ transform: `rotate(${-6 + sway * 16 * (1 - t * 0.7)}deg)` });
    }
    let_?.cancel();
    nagni?.cancel();
    const a = plane.animate(frames, { duration: ms, easing: 'linear', fill: 'forwards' });
    const svg = plane.querySelector('svg');
    const b = svg?.animate(nagib, { duration: ms, easing: 'linear', fill: 'forwards' }) ?? null;
    let_ = a;
    nagni = b;
    a.finished
      .then(() => {
        plane.classList.remove('is-pada');
        plane.classList.add('is-sletio');
        a.cancel();
        b?.cancel();
        stanje = 'sletio';
      })
      .catch(() => {});
  };

  /** Avion se pojavi na gumbu i s njega padne */
  const spustiS = (btn: HTMLElement, ms: number) => {
    if (stanje === 'pada') return;
    const r = btn.getBoundingClientRect();
    const x0 = r.right - 34;
    const y0 = r.top - 30;
    if (stanje === 'sjedi') {
      const p = plane.getBoundingClientRect();
      padni(p.left, p.top, ms);
      return;
    }
    padni(x0, y0, ms);
    plane.classList.add('is-pozvan');
  };

  const naScroll = () => {
    if (scrollY > 60 && stanje === 'sjedi') spustiS(seat!, 4600);
  };

  if (seat && !poslan) {
    stanje = 'sjedi';
    plane.hidden = false;
    // Mjesto iznad gumba, da avion ne dira tekst iznad njega
    seat.parentElement?.classList.add('ima-avion');
    seat.parentElement?.append(plane);
    sjedni();
    addEventListener('resize', sjedni, { passive: true });
    if (!reduce) {
      const uvod = document.documentElement.classList.contains('uvod');
      setTimeout(() => stanje === 'sjedi' && spustiS(seat, 4600), uvod ? 4200 : 2600);
      addEventListener('scroll', naScroll, { passive: true });
    }
  }

  // Klik na „Zatražite besplatnu ponudu”: umjesto odlaska na /kontakt odmah se otvori forma
  const gumbi = [...document.querySelectorAll<HTMLAnchorElement>('a.btn[href="/kontakt"]')].filter(
    (a) => !a.closest('.mobile-menu'),
  );
  const naKlik = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    otvori();
  };
  gumbi.forEach((a) => {
    a.addEventListener('click', naKlik);
    a.addEventListener('pointerenter', () => import('./avion'), { once: true });
    a.setAttribute('aria-haspopup', 'dialog');
  });
}
