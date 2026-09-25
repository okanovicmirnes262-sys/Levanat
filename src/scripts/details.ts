// Skriveni detalji: pozdrav pri ponovnom posjetu i poruka u konzoli.

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
  if (!store('session')?.getItem('levanat.konzola')) {
    consoleNote();
    try {
      store('session')?.setItem('levanat.konzola', '1');
    } catch {
      /* nije bitno */
    }
  }
}
