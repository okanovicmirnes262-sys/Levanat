import { initHeader } from './header';
import { initDetails } from './details';
import { initWind } from './wind';
import { initCursor } from './cursor';
import { initPlima } from './plima';

declare global {
  interface Window {
    __levanatMotion?: boolean;
  }
}

const root = document.documentElement;
const motion = root.classList.contains('motion');
const still = !motion;

// Slabiji uređaji: bez WebGL-a, samo CSS verzija
const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
const weak = (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory || 8) <= 2 || !!nav.connection?.saveData;

initHeader();
initDetails();
initWind();
initCursor();
initPlima(still);

const whenIdle = (fn: () => void) => {
  const go = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200));
  document.readyState === 'complete' ? go() : window.addEventListener('load', go, { once: true });
};


// Reljef (WebGL svjetlo po glavama): učitava se kad je pozornica blizu ekrana
document.querySelectorAll<HTMLElement>('[data-reljef]').forEach((stage) => {
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      whenIdle(() => import('./relief').then((m) => {
        if (weak) m.initReliefFallback(stage);
        else m.initRelief(stage, { intro: root.classList.contains('uvod'), still }).catch(() => m.initReliefFallback(stage));
      }));
    },
    { rootMargin: '200px' },
  );
  io.observe(stage);
});

// Šibenčani: slike učitaj unaprijed (prije nego traka uđe na ekran) i prikaži ih mekano
document.querySelectorAll<HTMLElement>('[data-friz]').forEach((friz) => {
  const imgs = [...friz.querySelectorAll<HTMLImageElement>('.friz__glava img')];
  const shown = (img: HTMLImageElement) => {
    const done = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  };
  imgs.forEach(shown);
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      imgs.forEach((img) => (img.loading = 'eager'));
    },
    { rootMargin: '1500px 0px' },
  );
  io.observe(friz);
});

// More pod katedralom
document.querySelectorAll<HTMLElement>('[data-obala]').forEach((el) => {
  if (weak) return;
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('./sea').then((m) => m.initSea(el, still).catch(() => {}));
    },
    { rootMargin: '400px' },
  );
  io.observe(el);
});

if (motion) {
  // GSAP i Lenis tek kad je preglednik slobodan
  whenIdle(() =>
    import('./motion')
      .then((m) => {
        if (!root.classList.contains('motion')) return;
        m.initMotion();
        window.__levanatMotion = true;
      })
      .catch(() => root.classList.remove('motion')),
  );
}
