// Hero scena: šetnja kroz hodnik tvrđave sv. Nikole prema svjetlu,
// zatim izlaz na pogled na tvrđavu. Sve je vezano uz položaj scrolla.

export function initScena(scena: HTMLElement) {
  const hodnik = scena.querySelector<HTMLElement>('[data-scena-hodnik]');
  const tvrdava = scena.querySelector<HTMLElement>('[data-scena-tvrdava]');
  const bljesak = scena.querySelector<HTMLElement>('[data-scena-bljesak]');
  const vinjeta = scena.querySelector<HTMLElement>('[data-scena-vinjeta]');
  const veo = scena.querySelector<HTMLElement>('[data-scena-veo]');
  const tekst = scena.querySelector<HTMLElement>('[data-scena-tekst]');
  const potpis = scena.querySelector<HTMLElement>('[data-scena-potpis]');
  if (!hodnik || !tvrdava || !bljesak || !vinjeta || !veo || !tekst) return;

  const smanjeno = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX_ZOOM = smanjeno ? 1.15 : 9; // koliko duboko kamera ulazi u hodnik

  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const faza = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
  const glatko = (t: number) => t * t * (3 - 2 * t);
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  let cilj = 0;
  let trenutno = 0;
  let radi = false;

  const izmjeri = () => {
    const r = scena.getBoundingClientRect();
    const duljina = Math.max(scena.offsetHeight - innerHeight, 1);
    cilj = clamp(-r.top / duljina);
  };

  const crtaj = (p: number) => {
    // 0) Tekst i tamni veo odlaze čim šetnja krene
    const t = faza(p, 0, 0.14);
    tekst.style.opacity = String(1 - t);
    tekst.style.transform = `translate3d(0, ${-t * 6}vh, 0)`;
    tekst.style.visibility = t >= 1 ? 'hidden' : '';
    veo.style.opacity = String(1 - faza(p, 0, 0.18));

    // 1) Kretanje kroz hodnik
    const h = faza(p, 0, 0.62);
    const zoom = Math.pow(MAX_ZOOM, h);
    const korak = smanjeno ? 0 : Math.sin(h * Math.PI * 7) * 0.35 * (1 - h);
    hodnik.style.transform = `translate3d(0, ${korak}%, 0) scale(${zoom})`;
    vinjeta.style.opacity = String(1 - faza(p, 0.35, 0.6));

    // 2) Svjetlo na kraju hodnika, 3) izlaz na tvrđavu
    const svjetlo = glatko(faza(p, 0.42, 0.64));
    const izlaz = glatko(faza(p, 0.64, 0.85));
    bljesak.style.opacity = String(svjetlo * (1 - izlaz));

    tvrdava.style.opacity = String(faza(p, 0.6, 0.66));
    hodnik.style.opacity = String(1 - faza(p, 0.62, 0.66));
    const tz = 1 + (smanjeno ? 0.03 : 0.35) * (1 - easeOut(faza(p, 0.62, 1)));
    tvrdava.style.transform = `scale(${tz})`;
    if (potpis) potpis.style.opacity = String(faza(p, 0.8, 0.92));
  };

  // S glatkim scrollom (Lenis) dovoljno je malo dodatnog izglađivanja
  const lerp = smanjeno ? 1 : document.documentElement.classList.contains('lenis') ? 0.4 : 0.14;

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
}
