// Hero scena u tri koraka, jedan za drugim (bez preklapanja):
// 1) hero tekst na punoj širini, 2) na scroll tekst ode prema gore,
// 3) na sredinu uđe kostur web stranice, iscrta se linijama i popuni sadržajem.

export function initScena(scena: HTMLElement) {
  const tekst = scena.querySelector<HTMLElement>('[data-scena-tekst]');
  const veo = scena.querySelector<HTMLElement>('[data-scena-veo]');
  const okvir = scena.querySelector<HTMLElement>('.scena__kostur');
  const kostur = scena.querySelector<SVGSVGElement>('[data-kostur]');
  if (!tekst || !okvir || !kostur || !kostur.getClientRects().length) return;
  const zice = [...kostur.querySelectorAll<SVGGeometryElement>('[data-zica]')];
  const puni = [...kostur.querySelectorAll<SVGElement>('[data-puni]')];

  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const glatko = (t: number) => t * t * (3 - 2 * t);
  const faza = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

  let cilj = 0;
  let trenutno = 0;
  let radi = false;

  const izmjeri = () => {
    const r = scena.getBoundingClientRect();
    const duljina = Math.max(scena.offsetHeight - innerHeight, 1);
    cilj = clamp(-r.top / duljina);
  };

  const crtaj = (p: number) => {
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
    const d = faza(p, 0.26, 0.68);
    const n = zice.length;
    zice.forEach((z, i) => {
      const start = (i / n) * 0.75;
      z.style.strokeDashoffset = String(1 - glatko(clamp((d - start) / 0.25)));
    });

    // 4) Stranica se popuni sadržajem (66–92 %), linije se povuku u pozadinu
    const f = faza(p, 0.66, 0.92);
    kostur.style.setProperty('--zica', String(1 - 0.8 * glatko(f)));
    puni.forEach((el, i) => {
      const s = (i / puni.length) * 0.6;
      el.style.opacity = String(glatko(clamp((f - s) / 0.4)));
    });
  };

  const lerp = document.documentElement.classList.contains('lenis') ? 0.4 : 0.16;
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
