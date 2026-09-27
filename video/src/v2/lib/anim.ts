import { Easing, interpolate, spring } from 'remotion';
import { FPS } from '../tokens';

/** Brzo pa meko zaustavljanje (Linear/Apple osjećaj). */
export const izlazak = Easing.bezier(0.16, 1, 0.3, 1);
/** Ravnomjerno ubrzanje i usporavanje za pokrete kamere. */
export const kamera = Easing.bezier(0.65, 0, 0.35, 1);
/** Ulazak prema van (za izlaske elemenata). */
export const odlazak = Easing.bezier(0.7, 0, 0.84, 0);

const opts = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 0→1 između dva framea, s easingom. */
export const napredak = (f: number, od: number, do_: number, easing = izlazak) =>
  interpolate(f, [od, do_], [0, 1], { ...opts, easing });

/** Linearna interpolacija. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Opruga s preciznim, gotovo bez odskoka ponašanjem. */
export const opruga = (f: number, od: number, trajanje = 36, masa = 0.9) =>
  spring({ frame: f - od, fps: FPS, config: { damping: 22, stiffness: 140, mass: masa }, durationInFrames: trajanje });

/** Ulazak i izlazak: 0 prije, 1 između, 0 poslije (za prozirnost natpisa). */
export const prozor = (f: number, ulaz: number, izlaz: number, meko = 14) =>
  Math.min(napredak(f, ulaz, ulaz + meko), 1 - napredak(f, izlaz - meko, izlaz, odlazak));

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
