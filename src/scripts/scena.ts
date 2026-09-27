// Hero scena s kosturom web stranice koji se iscrta linijama i popuni sadržajem.
// Mobitel: u slijedu (tekst ode prema gore, zatim na sredinu uđe kostur).
// Veći ekrani (≥ 900 px): kostur stoji desno pokraj naslova, a tekst ostaje na mjestu.

export function initScena(scena: HTMLElement) {
  const tekst = scena.querySelector<HTMLElement>('[data-scena-tekst]');
  const veo = scena.querySelector<HTMLElement>('[data-scena-veo]');
  const okvir = scena.querySelector<HTMLElement>('.scena__kostur');
  const kostur = scena.querySelector<SVGSVGElement>('[data-kostur]');
  if (!tekst || !okvir || !kostur || !kostur.getClientRects().length) return;
  // Smanjeno kretanje: kostur (ako se vidi) ostaje gotov crtež
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const zice = [...kostur.querySelectorAll<SVGGeometryElement>('[data-zica]')];
  const puni = [...kostur.querySelectorAll<SVGElement>('[data-puni]')];

  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const glatko = (t: number) => t * t * (3 - 2 * t);
  const faza = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

  const bocno = matchMedia('(min-width: 900px)');

  let cilj = 0;
  let trenutno = 0;
  let radi = false;

  const izmjeri = () => {
    const r = scena.getBoundingClientRect();
    const duljina = Math.max(scena.offsetHeight - innerHeight, 1);
    cilj = clamp(-r.top / duljina);
  };

  const linije = (d: number) => {
    const n = zice.length;
    zice.forEach((z, i) => {
      const start = (i / n) * 0.75;
      z.style.strokeDashoffset = String(1 - glatko(clamp((d - start) / 0.25)));
    });
  };
  const popuni = (f: number) => {
    kostur.style.setProperty('--zica', String(1 - 0.8 * glatko(f)));
    puni.forEach((el, i) => {
      const s = (i / puni.length) * 0.6;
      el.style.opacity = String(glatko(clamp((f - s) / 0.4)));
    });
  };

  const crtaj = (p: number) => {
    if (bocno.matches) {
      // Okvir preglednika nacrtan je već na početku, ostalo se crta dok skrolate
      linije(0.28 + faza(p, 0, 0.55) * 0.72);
      popuni(faza(p, 0.5, 0.85));
      return;
    }
    // 1) Tekst odlazi prema gore (0–18 %)
    const t = glatko(faza(p, 0, 0.18));
    tekst.style.opacity = String(1 - t);
    tekst.style.transform = `translate3d(0, ${-t * 10}vh, 0)`;
    tekst.style.visibility = t >= 1 ? 'hidden' : '';
    if (veo) veo.style.opacity = String(1 - t);

    // 2) Kostur ulazi na sredinu (14–30 %)
    const u = glatko(faza(p, 0.14, 0.3));
    okvir.style.opacity = String(u);
    okvir.style.transform = `translate(-50%, ${-50 + (1 - u) * 8}%) scale(${0.96 + 0.04 * u})`;

    // 3) Linije se iscrtavaju redom (26–68 %)
    linije(faza(p, 0.26, 0.68));

    // 4) Stranica se popuni sadržajem (66–92 %), linije se povuku u pozadinu
    popuni(faza(p, 0.66, 0.92));
  };

  const lerp = 0.16;
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

  bocno.addEventListener('change', () => {
    // Promjena rasporeda: položaj i vidljivost opet daje CSS
    tekst.style.opacity = tekst.style.transform = tekst.style.visibility = '';
    okvir.style.opacity = okvir.style.transform = '';
    if (veo) veo.style.opacity = '';
    izmjeri();
    trenutno = cilj;
    crtaj(trenutno);
  });
  addEventListener('scroll', naScroll, { passive: true });
  addEventListener('resize', naScroll);
  izmjeri();
  trenutno = cilj;
  crtaj(trenutno);
}
