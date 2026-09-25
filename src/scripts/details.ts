// Skriveni detalji: poruka u konzoli.

function store(kind: 'local' | 'session') {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
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
  if (!store('session')?.getItem('levanat.konzola')) {
    consoleNote();
    try {
      store('session')?.setItem('levanat.konzola', '1');
    } catch {
      /* nije bitno */
    }
  }
}
