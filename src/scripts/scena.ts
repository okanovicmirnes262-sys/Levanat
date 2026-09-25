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
  const MAX_ZOOM = smanjeno ? 1.1 : 6; // koliko duboko kamera ulazi u hodnik

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
    // Tekst i tamni veo ostaju cijelo vrijeme; scena je samo pozadina.

    // 1) Kretanje kroz hodnik (mirnije nego prije)
    const h = faza(p, 0, 0.55);
    const zoom = Math.pow(MAX_ZOOM, h);
    const korak = smanjeno ? 0 : Math.sin(h * Math.PI * 5) * 0.2 * (1 - h);
    hodnik.style.transform = `translate3d(0, ${korak}%, 0) scale(${zoom})`;
    vinjeta.style.opacity = String(1 - faza(p, 0.3, 0.55));

    // 2) Blago svjetlo na kraju hodnika (bez jakog bljeska)
    const svjetlo = glatko(faza(p, 0.4, 0.56));
    const izlaz = glatko(faza(p, 0.56, 0.7));
    bljesak.style.opacity = String(0.28 * svjetlo * (1 - izlaz));

    // 3) Izlaz: tvrđava je blizu pa se postupno udaljava
    const prijelaz = glatko(faza(p, 0.5, 0.62));
    tvrdava.style.opacity = String(prijelaz);
    hodnik.style.opacity = String(1 - prijelaz);
    const daljina = easeOut(faza(p, 0.52, 1));
    const tz = 1 + (smanjeno ? 0.05 : 1.6) * (1 - daljina);
    tvrdava.style.transform = `scale(${tz})`;
    if (potpis) potpis.style.opacity = String(faza(p, 0.85, 0.95));
    veo.style.opacity = '1';
    tekst.style.opacity = '1';
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
