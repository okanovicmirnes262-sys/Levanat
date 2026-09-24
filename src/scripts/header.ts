// Zaglavlje: pozadina nakon scrolla, skrivanje pri scrollu prema dolje, mobilni izbornik.

import { lenisRef } from './lenis-ref';

export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const label = document.querySelector<HTMLElement>('[data-menu-label]');
  if (!header) return;

  let lastY = window.scrollY;
  let open = false;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    if (!open) {
      const delta = y - lastY;
      if (y > 420 && delta > 6) header.classList.add('is-hidden');
      else if (delta < -6 || y < 420) header.classList.remove('is-hidden');
    }
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  // Otkrij zaglavlje kad dobije fokus tipkovnicom.
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  if (!toggle || !menu) return;

  const others = () => [document.querySelector('main'), document.querySelector('footer')].filter(Boolean) as HTMLElement[];

  const setOpen = (next: boolean) => {
    open = next;
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Zatvori' : 'Izbornik';
    others().forEach((el) => (open ? el.setAttribute('inert', '') : el.removeAttribute('inert')));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    open ? lenisRef.current?.stop() : lenisRef.current?.start();
    if (open) {
      header.classList.remove('is-hidden');
      setTimeout(() => menu.querySelector<HTMLElement>('a')?.focus(), 350);
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
    if (e.matches && open) setOpen(false);
  });
}
