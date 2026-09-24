// Skriveni detalji: pozdrav pri ponovnom posjetu, sat, izlazak sunca, poruka u konzoli.
import { sunrise, formatTime } from './sun';

const LAT = 43.735;
const LON = 15.8897;

function store(kind: 'local' | 'session') {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function greeting() {
  const el = document.querySelector<HTMLElement>('[data-greeting]');
  const ls = store('local');
  const ss = store('session');
  if (!ls || !ss) return;
  try {
    let state = ss.getItem('levanat.sesija');
    if (!state) {
      const visits = Number(ls.getItem('levanat.posjeti') || '0');
      state = visits > 0 ? 'povratak' : 'prvi';
      ls.setItem('levanat.posjeti', String(visits + 1));
      ss.setItem('levanat.sesija', state);
    }
    if (el && state === 'povratak') el.textContent = 'Opet ste tu. Levanat Vas je vratio.';
  } catch {
    /* privatni način rada: ostaje zadani pozdrav */
  }
}

function clockAndSun() {
  const clock = document.querySelector<HTMLElement>('[data-clock]');
  const sunEl = document.querySelector<HTMLElement>('[data-sunrise]');
  const line = document.querySelector<HTMLElement>('[data-sun-line]');

  const update = () => {
    const now = new Date();
    if (clock) {
      clock.textContent = formatTime(now);
      clock.setAttribute('datetime', now.toISOString());
    }
    const rise = sunrise(now, LAT, LON);
    if (!rise) return;
    const t = formatTime(rise);
    if (sunEl) sunEl.textContent = t;
    if (line) {
      line.textContent =
        now < rise ? `Danas sunce nad Šibenikom izlazi u ${t}.` : `Danas je sunce nad Šibenikom izašlo u ${t}.`;
    }
  };
  update();
  if (clock) {
    // Osvježi na početku sljedeće minute, zatim svake minute.
    const toNextMinute = 60000 - (Date.now() % 60000);
    setTimeout(() => {
      update();
      setInterval(update, 60000);
    }, toNextMinute);
  }
}

function consoleNote() {
  const style = 'font: 14px Georgia, serif; color: #0f2a33; line-height: 1.6;';
  const accent = 'font: 14px Georgia, serif; color: #a9471f;';
  console.log(
    '%cZavirili ste ispod haube. To je dobar znak.\n%cOvu stranicu složio je Mirnes, redak po redak, bez predloška. Ako i Vi volite ovakve detalje, javite se: /kontakt',
    style,
    accent,
  );
}

export function initDetails() {
  greeting();
  clockAndSun();
  if (!store('session')?.getItem('levanat.konzola')) {
    consoleNote();
    try {
      store('session')?.setItem('levanat.konzola', '1');
    } catch {
      /* nije bitno */
    }
  }
}
