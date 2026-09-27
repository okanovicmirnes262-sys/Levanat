// „Odbrojavanje” brojeva do točne vrijednosti (koordinate u heroju, 71 lice kod Jurja).
// HTML već sadrži točne brojeve (bez JS-a i za tražilice); ovdje se samo kratko animiraju.
// Znamenke su tabularne i jednakog broja, pa se širina ne mijenja (bez pomaka rasporeda).

import { TRAJANJE, clamp, krivulje, mirno } from './tokeni';

export function odbroji(grupa: Element, kasnjenje = 0, trajanje = TRAJANJE.sporo) {
  const brojevi = [...grupa.querySelectorAll<HTMLElement>('[data-odbroj]')];
  if (!brojevi.length || mirno()) return;
  const ciljevi = brojevi.map((b) => ({ el: b, cilj: Number(b.dataset.odbroj), znam: b.dataset.odbroj!.length }));
  const pisi = (t: number) =>
    ciljevi.forEach(({ el, cilj, znam }) => {
      el.textContent = String(Math.round(cilj * krivulje.voda(t))).padStart(znam, '0');
    });
  pisi(0);
  const start = performance.now() + kasnjenje;
  const korak = (sad: number) => {
    const t = clamp((sad - start) / trajanje);
    pisi(t);
    if (t < 1) requestAnimationFrame(korak);
  };
  requestAnimationFrame(korak);
}

/** Pokreni odbrojavanje kad grupa uđe na ekran (jednom). */
export function odbrojiPriUlazu(grupa: Element, kasnjenje = 0) {
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    odbroji(grupa, kasnjenje);
  });
  io.observe(grupa);
}
