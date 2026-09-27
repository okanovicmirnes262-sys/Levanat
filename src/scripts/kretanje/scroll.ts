// Mali scroll modul (zamjena za GSAP ScrollTrigger): jedan pasivni listener i jedan rAF.
// Elementi se prate samo dok su blizu ekrana; napredak 0–1 predaje se callbacku.

import { clamp } from './tokeni';

type Rub = 'top' | 'center' | 'bottom';
/** [rub elementa, udio visine ekrana]: npr. ['top', 0.8] = vrh elementa na 80 % ekrana */
export type Tocka = [Rub, number];

type Pratitelj = {
  el: Element;
  od: Tocka;
  do: Tocka;
  fn: (p: number, r: DOMRect) => void;
  zadnji: number;
};

const svi: Pratitelj[] = [];
const aktivni = new Set<Pratitelj>();
let zakazano = false;

const udio: Record<Rub, number> = { top: 0, center: 0.5, bottom: 1 };

const izracunaj = (t: Pratitelj) => {
  const r = t.el.getBoundingClientRect();
  const vh = innerHeight;
  // položaj točke elementa u odnosu na ekran, za početak i kraj
  const a = r.top + r.height * udio[t.od[0]] - vh * t.od[1];
  const b = r.top + r.height * udio[t.do[0]] - vh * t.do[1];
  const p = a === b ? (a <= 0 ? 1 : 0) : clamp(a / (a - b));
  if (Math.abs(p - t.zadnji) > 0.0005 || p === 0 || p === 1) {
    t.zadnji = p;
    t.fn(p, r);
  }
};

const okvir = () => {
  zakazano = false;
  aktivni.forEach(izracunaj);
};
const zakazi = () => {
  if (zakazano) return;
  zakazano = true;
  requestAnimationFrame(okvir);
};

const io =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            svi.filter((t) => t.el === e.target).forEach((t) => {
              if (e.isIntersecting) aktivni.add(t);
              else {
                // izvan ekrana: postavi krajnje stanje (0 ili 1) i prestani računati
                izracunaj(t);
                aktivni.delete(t);
              }
            });
          }),
        { rootMargin: '25% 0px' },
      )
    : null;

let slusa = false;

/** Prati napredak elementa između dvije točke. Vraća funkciju za prekid praćenja. */
export function prati(el: Element, od: Tocka, do_: Tocka, fn: (p: number, r: DOMRect) => void) {
  const t: Pratitelj = { el, od, do: do_, fn, zadnji: -1 };
  svi.push(t);
  izracunaj(t);
  io?.observe(el);
  if (!slusa) {
    slusa = true;
    addEventListener('scroll', zakazi, { passive: true });
    addEventListener('resize', zakazi, { passive: true });
  }
  return () => {
    io?.unobserve(el);
    aktivni.delete(t);
    svi.splice(svi.indexOf(t), 1);
  };
}

/** Ponovno izračunaj sve (npr. nakon promjene rasporeda). */
export const osvjezi = () => svi.forEach(izracunaj);
