// Gumb plutajućeg asistenta. Sam razgovor (i baza znanja) učitava se tek pri prvom otvaranju.
export function initAsistent() {
  const btn = document.querySelector<HTMLButtonElement>('[data-asistent-gumb]');
  const panel = document.querySelector<HTMLElement>('[data-asistent]');
  if (!btn || !panel) return;
  let chat: { focus: () => void } | undefined;

  const set = async (open: boolean) => {
    if (open && !chat) {
      const m = await import('./asistent');
      chat = m.mountFloating(panel);
    }
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('asistent-open', open);
    if (open) setTimeout(() => chat?.focus(), 60);
  };
  // Pripremi modul čim korisnik pokaže namjeru
  btn.addEventListener('pointerenter', () => import('./asistent'), { once: true });
  btn.addEventListener('click', () => set(panel.hidden !== false));
  panel.querySelector('[data-asistent-zatvori]')?.addEventListener('click', () => {
    set(false);
    btn.focus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      set(false);
      btn.focus();
    }
  });
}
