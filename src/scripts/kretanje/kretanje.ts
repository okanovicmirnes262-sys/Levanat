// Scroll animacije stranice, bez biblioteka (zamjena za GSAP i Lenis).
// Koristi zajednički modul scroll.ts; sve piše u CSS varijable ili transform/opacity.

import { prati } from './scroll';
import { odbroji } from './odbroj';
import { clamp, krivulje } from './tokeni';

export function initKretanje() {
  // Zaglavlje podstranice: sadržaj pri skrolu lagano tone i blijedi
  const hero = document.querySelector<HTMLElement>('.page-hero');
  const sadrzaj = hero?.querySelector<HTMLElement>('.page-hero__grid');
  if (hero && sadrzaj)
    prati(hero, ['top', 0], ['bottom', 0], (p) => {
      sadrzaj.style.transform = `translate3d(0, ${(p * 80).toFixed(1)}px, 0)`;
      sadrzaj.style.opacity = String(1 - p * 0.8);
    });

  // Jedna adresa za sve: linije od izvora prema stranici crtaju se jedna za drugom
  const adr = document.querySelector<HTMLElement>('[data-adresa]');
  if (adr) {
    const grupe = [...adr.querySelectorAll<SVGGElement>('.adresa__linije g')];
    const izvori = [...adr.querySelectorAll<HTMLElement>('.adresa__izvor')];
    const n = grupe.length;
    prati(adr, ['top', 0.8], ['center', 0.55], (p) => {
      for (let i = 0; i < n; i++) {
        const t = clamp((p - (i / n) * 0.6) / 0.4).toFixed(3);
        grupe[i].style.setProperty('--t', t);
        izvori[i]?.style.setProperty('--t', t);
      }
      adr.classList.toggle('is-spojeno', p > 0.98);
    });
  }

  initFriz();

  // Proces: linija se puni redom čitanja i pali korake
  const proc = document.querySelector<HTMLElement>('[data-process]');
  if (proc) {
    const koraci = proc.querySelectorAll<HTMLElement>('.process__step');
    const n = koraci.length;
    prati(proc, ['top', 0.75], ['bottom', 0.55], (p) => {
      proc.style.setProperty('--p', p.toFixed(4));
      koraci.forEach((k, i) => k.classList.toggle('is-lit', p >= i / n + 0.02 || p > 0.995));
    });
  }

  // Sv. Mihovil izranja sporije od teksta, a riječ „Detalji” klizi nalijevo (vjetar)
  const mih = document.querySelector<HTMLElement>('.mihovil');
  if (mih) {
    const kip = mih.querySelector<HTMLElement>('.mihovil__kip');
    const rijec = mih.querySelector<HTMLElement>('.mihovil__rijec');
    prati(mih, ['top', 1], ['bottom', 0], (p) => {
      if (kip) kip.style.transform = `translate3d(0, ${(14 - p * 20).toFixed(2)}%, 0)`;
      if (rijec) rijec.style.transform = `translate3d(${(6 - p * 12).toFixed(2)}%, 0, 0)`;
      mih.classList.toggle('is-kip', p > 0.18);
    });
  }

  // Katedrala lagano izranja iz mora
  const kat = document.querySelector<HTMLElement>('.obala__katedrala');
  if (kat)
    prati(kat, ['top', 1], ['bottom', 0.7], (p) => {
      kat.style.transform = `translate3d(0, ${(60 * (1 - krivulje.voda(p))).toFixed(1)}px, 0)`;
    });

  // Radovi: vrlo blagi parallax snimki zaslona (samo miš)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll<HTMLImageElement>('.work__okvir img:not(.work__cijela)').forEach((img) => {
      prati(img.parentElement!, ['top', 1], ['bottom', 0], (p) => {
        img.style.transform = `translate3d(0, ${(-p * 8).toFixed(2)}%, 0)`;
      });
    });
  }
}

/** Upali/ugasi „svjetlo” na portretu prema udaljenosti od sredine ekrana. */
function svjetlo(glave: HTMLElement[]) {
  const c = innerWidth / 2;
  glave.forEach((g) => {
    const r = g.getBoundingClientRect();
    const d = Math.abs(r.left + r.width / 2 - c) / (innerWidth * 0.55);
    const lit = Math.max(0, 1 - d * d);
    g.style.setProperty('--lit', lit.toFixed(3));
  });
}

/**
 * Motivi Šibenčana: svaki se pokrene jednom, kad misao (ili Jurjev portret) uđe na ekran.
 * IO radi i s translateX trakom (desktop) i s vodoravnim scrollom trake (mobitel).
 */
function motivi(friz: HTMLElement) {
  const io = new IntersectionObserver(
    (unosi) =>
      unosi.forEach((u) => {
        if (!u.isIntersecting) return;
        const el = u.target as HTMLElement;
        io.unobserve(el);
        if (el.classList.contains('friz__glava')) {
          el.classList.add('is-kamen');
          return;
        }
        el.classList.add('is-motiv');
        if (el.dataset.motiv === 'juraj') odbroji(el, 150);
      }),
    { threshold: 0.55 },
  );
  friz.querySelectorAll('.friz__misao, .friz__glava[data-motiv="juraj"]').forEach((el) => io.observe(el));
}

/**
 * Friz Šibenčana: sekcija je visoka, a unutarnji dio je sticky (CSS), pa scroll prema dolje
 * pomiče traku ulijevo. Desktop: translateX. Mobitel: scrollLeft (swipe i dalje radi).
 */
function initFriz() {
  const friz = document.querySelector<HTMLElement>('[data-friz]');
  if (!friz) return;
  const traka = friz.querySelector<HTMLElement>('.friz__traka')!;
  const glave = [...friz.querySelectorAll<HTMLElement>('.friz__glava')];
  const traka2 = friz.querySelector<HTMLElement>('.friz__napredak');
  const desktop = matchMedia('(min-width: 900px) and (min-height: 560px)');
  const mobitel = matchMedia('(max-width: 899px) and (min-height: 560px)');
  const napredak = (p: number) => traka2?.style.setProperty('--p', p.toFixed(4));

  let dist = 0;
  const izmjeri = () => {
    dist = desktop.matches ? Math.max(traka.scrollWidth - innerWidth, 0) : Math.max(traka.scrollWidth - traka.clientWidth, 0);
  };
  izmjeri();
  addEventListener('resize', izmjeri, { passive: true });
  new ResizeObserver(izmjeri).observe(traka);

  let postavljeno = -1;
  let odScrolla = false;
  prati(friz, ['top', 0], ['bottom', 1], (p) => {
    if (desktop.matches) {
      traka.style.transform = `translate3d(${(-p * dist).toFixed(1)}px, 0, 0)`;
      napredak(p);
      svjetlo(glave);
    } else if (mobitel.matches) {
      traka.style.transform = '';
      postavljeno = Math.round(p * dist);
      odScrolla = true;
      traka.scrollLeft = postavljeno;
    } else {
      traka.style.transform = '';
    }
  });

  // Mobitel: swipe pomiče i stranicu na odgovarajuće mjesto unutar prikovanog dijela
  traka.addEventListener(
    'scroll',
    () => {
      const p = traka.scrollLeft / Math.max(dist, 1);
      napredak(p);
      svjetlo(glave);
      if (odScrolla) {
        odScrolla = false;
        return;
      }
      if (!mobitel.matches || Math.abs(traka.scrollLeft - postavljeno) <= 2) return;
      const r = friz.getBoundingClientRect();
      const duljina = r.height - innerHeight;
      if (r.top > 0 || r.bottom < innerHeight) return; // samo dok je prikovan
      postavljeno = traka.scrollLeft;
      scrollTo(0, scrollY + r.top + p * duljina);
    },
    { passive: true },
  );
  svjetlo(glave);
  motivi(friz);
}
