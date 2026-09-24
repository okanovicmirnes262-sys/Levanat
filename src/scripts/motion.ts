// Scroll animacije (GSAP + ScrollTrigger) i glatki scroll (Lenis, samo za miš/touchpad).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { lenisRef } from './lenis-ref';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function initMotion() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (fine) {
    lenis = new Lenis({ lerp: 0.11, anchors: { offset: -88 } });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Naslovi: otkrivaju se zdesna nalijevo, kao da ih nanosi levanat.
  gsap.utils.toArray<HTMLElement>('[data-reveal="line"]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(-10% 0% -10% 100%)', x: 24 },
      {
        clipPath: 'inset(-10% 0% -10% 0%)',
        x: 0,
        duration: 1.35,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });

  // Tekst: tiho se pojavi uz blagi pomak ulijevo, u skupinama.
  const fades = gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]');
  gsap.set(fades, { x: 14 });
  ScrollTrigger.batch(fades, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', stagger: 0.09, overwrite: true }),
  });

  // Tanke crte: iscrtavaju se od desnog ruba.
  gsap.utils.toArray<HTMLElement>('[data-reveal="rule"]').forEach((el) => {
    gsap.to(el, {
      scaleX: 1,
      duration: 1.6,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 95%', once: true },
    });
  });

  // Rezultat pretraživanja: Facebook → vlastita stranica, vezano uz scroll.
  const serp = document.querySelector<HTMLElement>('[data-serp]');
  if (serp) {
    const before = serp.querySelector('.serp__layer--before');
    const after = serp.querySelector('.serp__layer--after');
    const edge = serp.querySelector<HTMLElement>('.serp__edge');
    const swap = serp.querySelector<HTMLElement>('.serp__swap');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: serp, start: 'top 62%', end: 'bottom 38%', scrub: 0.8 },
    });
    tl.fromTo(after, { clipPath: 'inset(-4% 0% -4% 100%)' }, { clipPath: 'inset(-4% 0% -4% 0%)', ease: 'none' }, 0)
      .fromTo(before, { clipPath: 'inset(-4% 0% -4% 0%)' }, { clipPath: 'inset(-4% 100% -4% 0%)', ease: 'none' }, 0);
    if (edge && swap) {
      const place = () => {
        const fr = serp.querySelector<HTMLElement>('.serp__frame')!.getBoundingClientRect();
        const sr = swap.getBoundingClientRect();
        gsap.set(edge, { top: sr.top - fr.top - 6, height: sr.height + 12, bottom: 'auto' });
        return { from: sr.right - fr.left, to: sr.left - fr.left };
      };
      let pos = place();
      ScrollTrigger.addEventListener('refreshInit', () => (pos = place()));
      tl.fromTo(edge, { x: () => pos.from }, { x: () => pos.to, ease: 'none' }, 0)
        .to(edge, { opacity: 1, duration: 0.08, ease: 'none' }, 0)
        .to(edge, { opacity: 0, duration: 0.08, ease: 'none' }, 0.92);
    }
  }

  // Proces: linija napreduje sa scrollom i pali točke koraka.
  const proc = document.querySelector<HTMLElement>('[data-process]');
  if (proc) {
    const steps = proc.querySelectorAll<HTMLElement>('.process__step');
    const n = steps.length;
    const set = (p: number) => {
      proc.style.setProperty('--p', p.toFixed(4));
      steps.forEach((s, i) => s.classList.toggle('is-lit', p >= i / n + 0.01 || p > 0.995));
    };
    set(0);
    ScrollTrigger.create({
      trigger: proc,
      start: 'top 75%',
      end: 'bottom 55%',
      scrub: true,
      onUpdate: (self) => set(self.progress),
    });
  }

  // Radovi: vrlo blagi paralaks snimki zaslona, samo na većim ekranima.
  if (fine) {
    gsap.utils.toArray<HTMLElement>('.work__media img').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -8 },
        { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true } },
      );
    });
  }

  // Fontovi i slike mogu promijeniti visine; osvježi okidače kad je sve učitano.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
