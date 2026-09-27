// Ulasci elemenata pri skrolu (IntersectionObserver): element dobije klasu .is-in, a CSS
// odradi animaciju (samo transform, opacity i otkrivanje maskom zdesna). Elementi koji uđu
// zajedno dobiju redni broj --i za stagger. Skrivena početna stanja postoje samo pod
// html.motion, pa je bez JavaScripta sav sadržaj vidljiv.

const SELEKTOR = '[data-reveal], [data-ulaz]';

export function initUlaz(korijen: ParentNode = document) {
  const el = [...korijen.querySelectorAll<HTMLElement>(SELEKTOR)];
  if (!el.length) return;
  if (typeof IntersectionObserver === 'undefined') {
    el.forEach((e) => e.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (es) => {
      const ulaze = es.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      // DOM redoslijed = redoslijed ulaska
      ulaze.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      ulaze.forEach((t, i) => {
        if (!t.style.getPropertyValue('--i')) t.style.setProperty('--i', String(i));
        t.classList.add('is-in');
        io.unobserve(t);
      });
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  el.forEach((e) => io.observe(e));
}
