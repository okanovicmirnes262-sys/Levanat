// Brončani prsten koji prati kursor (samo za miš) i magnetni gumbi.

export function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const ring = document.querySelector<HTMLElement>('[data-kursor]');
  if (!ring) return;
  let x = -100, y = -100, cx = -100, cy = -100, raf = 0;

  const tick = () => {
    cx += (x - cx) * 0.22;
    cy += (y - cy) * 0.22;
    ring.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0;
  };
  window.addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      ring.classList.add('is-on');
      const t = e.target as Element;
      ring.classList.toggle('is-link', !!t.closest('a, button, summary, select, label'));
      ring.classList.toggle('is-svjetlo', !!t.closest('[data-svjetlo]') && !t.closest('a, button'));
      if (!raf) raf = requestAnimationFrame(tick);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => ring.classList.remove('is-on'));

  // Magnetni gumbi: lagano se privuku prema kursoru
  document.querySelectorAll<HTMLElement>('.btn, [data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transform = '';
      setTimeout(() => (el.style.transition = ''), 600);
    });
  });
}
