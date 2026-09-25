// Hero scena: kostur web stranice iscrtava se tankim linijama dok posjetitelj
// skrola, a na kraju se popuni sadržajem (tekst, gumbi, slika).

export function initScena(scena: HTMLElement) {
  const kostur = scena.querySelector<SVGSVGElement>('[data-kostur]');
  if (!kostur) return;
  const zice = [...kostur.querySelectorAll<SVGGeometryElement>('[data-zica]')];
  const puni = [...kostur.querySelectorAll<SVGElement>('[data-puni]')];
  const smanjeno = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const glatko = (t: number) => t * t * (3 - 2 * t);

  let cilj = 0;
  let trenutno = 0;
  let radi = false;

  const izmjeri = () => {
    const r = scena.getBoundingClientRect();
    const duljina = Math.max(scena.offsetHeight - innerHeight, 1);
    cilj = clamp(-r.top / duljina);
  };

  // Linije: svaka se crta u svom odsječku (s preklapanjem), ukupno do 60 % scrolla.
  // Početnih 15 % iscrta se samo od sebe, da scena ne počne prazna.
  const crtaj = (p: number) => {
    const d = smanjeno ? 1 : 0.15 + (p / 0.6) * 0.85;
    const n = zice.length;
    zice.forEach((z, i) => {
      const start = (i / n) * 0.75;
      const t = glatko(clamp((d - start) / 0.25));
      z.style.strokeDashoffset = String(1 - t);
    });
    // Sadržaj: od 55 % do 90 % scrolla, redom
    const f = smanjeno ? 1 : clamp((p - 0.55) / 0.35);
    // Kad se sadržaj pojavi, linije kostura se povuku u pozadinu
    kostur.style.setProperty('--zica', String(1 - 0.8 * glatko(f)));
    puni.forEach((el, i) => {
      const s = (i / puni.length) * 0.6;
      el.style.opacity = String(glatko(clamp((f - s) / 0.4)));
    });
  };

  const lerp = smanjeno ? 1 : document.documentElement.classList.contains('lenis') ? 0.4 : 0.16;
  const petlja = () => {
    trenutno += (cilj - trenutno) * lerp;
    if (Math.abs(cilj - trenutno) < 0.0004) trenutno = cilj;
    crtaj(trenutno);
    if (trenutno !== cilj) requestAnimationFrame(petlja);
    else radi = false;
  };
  const naScroll = () => {
    izmjeri();
    if (!radi) {
      radi = true;
      requestAnimationFrame(petlja);
    }
  };

  addEventListener('scroll', naScroll, { passive: true });
  addEventListener('resize', naScroll);
  izmjeri();
  trenutno = cilj;
  crtaj(trenutno);

  // Uvod: prve linije se nacrtaju same pri otvaranju stranice
  if (!smanjeno && trenutno === 0) {
    const t0 = performance.now();
    const uvod = (now: number) => {
      const k = clamp((now - t0) / 1400);
      if (trenutno === 0) crtaj(-0.15 + k * 0.15);
      if (k < 1) requestAnimationFrame(uvod);
      else crtaj(trenutno);
    };
    requestAnimationFrame(uvod);
  }
}
