import { initHeader } from './header';
import { initDetails } from './details';
import { initWind } from './wind';

declare global {
  interface Window {
    __levanatMotion?: boolean;
  }
}

const motion = document.documentElement.classList.contains('motion');

initDetails();
initWind();
initHeader();

const whenIdle = (fn: () => void) => {
  const go = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200));
  document.readyState === 'complete' ? go() : window.addEventListener('load', go, { once: true });
};

if (motion) {
  // GSAP i Lenis učitavamo samo kad posjetitelj nije isključio animacije,
  // i to tek kad je preglednik slobodan, da ne usporavaju prvi prikaz.
  whenIdle(() =>
  import('./motion')
    .then((m) => {
      // Ako je rezervni mehanizam već prikazao sadržaj, ne skrivamo ga ponovno.
      if (!document.documentElement.classList.contains('motion')) return;
      m.initMotion();
      window.__levanatMotion = true;
    })
    .catch(() => document.documentElement.classList.remove('motion')),
  );
}
