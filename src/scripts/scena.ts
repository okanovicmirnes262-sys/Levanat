// Hero scena: tvrđava sv. Nikole najprije izbliza, a kamera se sa scrollom
// postupno udaljava dok se ne vidi cijela. Tekst ostaje ispred, na velu.

export function initScena(scena: HTMLElement) {
  const tvrdava = scena.querySelector<HTMLElement>('[data-scena-tvrdava]');
  const potpis = scena.querySelector<HTMLElement>('[data-scena-potpis]');
  if (!tvrdava) return;

  const smanjeno = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const POCETAK = smanjeno ? 1.08 : 2.8; // koliko je kamera blizu na početku

  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
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
    const d = easeOut(clamp(p / 0.92));
    tvrdava.style.transform = `scale(${1 + (POCETAK - 1) * (1 - d)})`;
    if (potpis) potpis.style.opacity = String(clamp((p - 0.75) / 0.15));
  };

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
