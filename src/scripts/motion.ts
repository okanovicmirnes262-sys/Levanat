// Scroll animacije (GSAP + ScrollTrigger) i glatki scroll (Lenis, samo za miš/touchpad).
// Ritam: kamen je težak (sporiji ulazak, kratko zadržavanje), voda je lagana (meko ubrzanje).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { lenisRef } from './lenis-ref';

gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mm = gsap.matchMedia();

  if (fine) {
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -88 } });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Naslovi se „isklesavaju” slijeva nadesno, s težinom kamena
  gsap.utils.toArray<HTMLElement>('[data-reveal="line"]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(-10% 100% -20% 0%)', y: 18 },
      {
        clipPath: 'inset(-10% -5% -20% 0%)',
        y: 0,
        duration: 1.4,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });

  // Tekst izranja kao iz vode: meko, bez naglog skoka
  const fades = gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]');
  gsap.set(fades, { y: 22 });
  ScrollTrigger.batch(fades, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  // Hero podstranica: sadržaj na scroll lagano tone
  const hero = document.querySelector<HTMLElement>('.hero, .page-hero');
  if (hero) {
    const content = hero.querySelector('.hero__content, .page-hero__grid');
    if (content)
      gsap.to(content, {
        y: 80,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
  }

  // Rezultat pretraživanja: najprije „samo Facebook”, zatim zdesna uklizne Vaša stranica
  const serp = document.querySelector<HTMLElement>('[data-serp]');
  if (serp) {
    const prije = serp.querySelector('.serp__stanje--prije');
    const poslije = serp.querySelector('.serp__stanje--poslije');
    gsap.set(poslije, { opacity: 0, x: 60 });
    gsap
      .timeline({ scrollTrigger: { trigger: serp, start: 'top 70%', once: true } })
      .to(poslije, { opacity: 1, x: 0, duration: 1.1, ease: 'expo.out', delay: 0.5 })
      .to(prije, { opacity: 0.55, duration: 0.8, ease: 'power2.out' }, '<0.2');
  }

  // Friz glava: na većim ekranima sekcija se prikuje i traka klizi vodoravno
  const friz = document.querySelector<HTMLElement>('[data-friz]');
  if (friz) {
    const traka = friz.querySelector<HTMLElement>('.friz__traka')!;
    const glave = [...friz.querySelectorAll<HTMLElement>('.friz__glava')];
    const bar = friz.querySelector<HTMLElement>('.friz__napredak');
    const light = () => {
      const c = innerWidth / 2;
      glave.forEach((g) => {
        const r = g.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - c) / (innerWidth * 0.55);
        g.style.setProperty('--lit', Math.max(0, 1 - d * d).toFixed(3));
      });
    };
    mm.add('(min-width: 900px) and (min-height: 560px)', () => {
      friz.classList.add('friz--pinned');
      const dist = () => Math.max(traka.scrollWidth - innerWidth, 0);
      const tw = gsap.to(traka, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: friz,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            bar?.style.setProperty('--p', s.progress.toFixed(4));
            light();
          },
        },
      });
      light();
      return () => {
        friz.classList.remove('friz--pinned');
        tw.kill();
      };
    });
    // Mobitel: sekcija se također prikuje, pa scroll prema dolje pomiče traku udesno.
    // Traka ostaje nativno pomična, pa i swipe radi; oba smjera se međusobno usklađuju.
    mm.add('(max-width: 899px) and (min-height: 560px)', () => {
      friz.classList.add('friz--mob');
      const max = () => Math.max(traka.scrollWidth - traka.clientWidth, 0);
      let postavljeno = -1;
      const st = ScrollTrigger.create({
        trigger: friz,
        start: 'top top',
        end: () => `+=${Math.round(max() * 1.15)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (s) => {
          postavljeno = Math.round(s.progress * max());
          traka.scrollLeft = postavljeno;
        },
      });
      const onS = () => {
        light();
        const m = max();
        const p = traka.scrollLeft / Math.max(m, 1);
        bar?.style.setProperty('--p', p.toFixed(4));
        // Swipe korisnika: pomakni stranicu na odgovarajuće mjesto unutar prikovanog dijela
        if (Math.abs(traka.scrollLeft - postavljeno) > 2 && st.isActive) {
          postavljeno = traka.scrollLeft;
          window.scrollTo(0, st.start + p * (st.end - st.start));
        }
      };
      traka.addEventListener('scroll', onS, { passive: true });
      onS();
      return () => {
        traka.removeEventListener('scroll', onS);
        friz.classList.remove('friz--mob');
        st.kill();
      };
    });
    mm.add('(max-height: 559px)', () => {
      const onS = () => {
        light();
        bar?.style.setProperty('--p', (traka.scrollLeft / Math.max(traka.scrollWidth - traka.clientWidth, 1)).toFixed(4));
      };
      traka.addEventListener('scroll', onS, { passive: true });
      onS();
      return () => traka.removeEventListener('scroll', onS);
    });
  }

  // Proces: val plime se puni sa scrollom i pali korake
  const proc = document.querySelector<HTMLElement>('[data-process]');
  if (proc) {
    const steps = proc.querySelectorAll<HTMLElement>('.process__step');
    const n = steps.length;
    const set = (p: number) => {
      proc.style.setProperty('--p', p.toFixed(4));
      steps.forEach((s, i) => s.classList.toggle('is-lit', p >= i / n + 0.02 || p > 0.995));
    };
    set(0);
    ScrollTrigger.create({ trigger: proc, start: 'top 75%', end: 'bottom 55%', scrub: true, onUpdate: (s) => set(s.progress) });
  }

  // Sv. Mihovil izranja iznad riječi „Detalji”, sporije od teksta
  const mih = document.querySelector<HTMLElement>('.mihovil');
  if (mih) {
    const kip = mih.querySelector('.mihovil__kip');
    const rijec = mih.querySelector('.mihovil__rijec');
    if (kip) gsap.fromTo(kip, { yPercent: 14 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: mih, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (rijec) gsap.fromTo(rijec, { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: mih, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // Katedrala: lagano izranja iz mora
  const kat = document.querySelector<HTMLElement>('.obala__katedrala');
  if (kat) gsap.fromTo(kat, { y: 60 }, { y: 0, ease: 'none', scrollTrigger: { trigger: kat, start: 'top bottom', end: 'bottom 70%', scrub: true } });

  // Radovi: vrlo blagi paralaks snimki zaslona
  if (fine) {
    gsap.utils.toArray<HTMLElement>('.work__okvir img:not(.work__cijela)').forEach((img) => {
      gsap.fromTo(img, { yPercent: 0 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true } });
    });
  }

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
