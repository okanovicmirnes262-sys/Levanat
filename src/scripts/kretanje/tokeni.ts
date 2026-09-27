// Zajednički tokeni kretanja za JS i Web Animations API.
// Iste vrijednosti su u global.css (:root). Levanat puše zdesna nalijevo.

export const TRAJANJE = { brzo: 180, srednje: 420, sporo: 900, scena: 1400 } as const;

export const EASE = {
  kamen: 'cubic-bezier(0.7, 0, 0.2, 1)',
  voda: 'cubic-bezier(0.22, 1, 0.36, 1)',
  vjetar: 'cubic-bezier(0.3, 0, 0.1, 1)',
  odlazak: 'cubic-bezier(0.5, 0, 0.9, 0.4)',
} as const;

export const STAGGER = 70;

/** Smanjeno kretanje: animacije se preskaču ili svode na kratki fade. */
export const mirno = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Easing funkcije za scroll-vezane animacije (JS). */
export const krivulje = {
  linearno: (t: number) => t,
  voda: (t: number) => 1 - Math.pow(1 - t, 3),
  kamen: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
