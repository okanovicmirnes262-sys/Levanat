// Kontakt forma: provjera na klijentu, slanje bez ponovnog učitavanja, poruke na hrvatskom.

const messages: Record<string, (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => string> = {
  ime: (el) => (el.value.trim().length < 2 ? 'Upišite svoje ime.' : ''),
  email: (el) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()) ? 'Upišite ispravnu e-mail adresu.' : ''),
  telefon: (el) =>
    el.value.trim() && !/^[+\d][\d\s()/.-]{5,24}$/.test(el.value.trim()) ? 'Broj telefona nije ispravan.' : '',
  usluga: (el) => (!el.value ? 'Odaberite vrstu usluge.' : ''),
  poruka: (el) => (el.value.trim().length < 10 ? 'Napišite barem kratku poruku (najmanje 10 znakova).' : ''),
};

export function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const time = form.querySelector<HTMLInputElement>('[data-form-time]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
  time.value = String(Date.now());

  if (new URLSearchParams(location.search).get('greska')) {
    status.dataset.state = 'error';
    status.textContent = 'Poruka nije poslana. Pokušajte ponovno ili mi pišite izravno na e-mail.';
  }

  const setError = (name: string, msg: string) => {
    const field = form.elements.namedItem(name) as HTMLInputElement | null;
    const out = form.querySelector<HTMLElement>(`#${name}-greska`);
    if (!field || !out) return;
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    out.textContent = msg;
  };

  const check = (name: string) => {
    const field = form.elements.namedItem(name) as HTMLInputElement | null;
    if (!field) return '';
    const msg = messages[name](field);
    setError(name, msg);
    return msg;
  };

  Object.keys(messages).forEach((name) => {
    const field = form.elements.namedItem(name) as HTMLElement | null;
    field?.addEventListener('blur', () => check(name));
    field?.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') check(name);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = Object.keys(messages).filter((n) => check(n));
    if (invalid.length) {
      (form.elements.namedItem(invalid[0]) as HTMLElement).focus();
      status.dataset.state = 'error';
      status.textContent = 'Provjerite označena polja.';
      return;
    }

    button.disabled = true;
    label.textContent = 'Šaljem…';
    status.dataset.state = '';
    status.textContent = '';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { accept: 'application/json' },
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        form.reset();
        time.value = String(Date.now());
        status.dataset.state = 'ok';
        status.textContent = 'Hvala! Poruka je stigla. Javit ću Vam se čim je pročitam.';
        label.textContent = 'Poslano';
        setTimeout(() => (label.textContent = 'Pošaljite upit'), 4000);
      } else {
        if (body.errors) Object.entries(body.errors as Record<string, string>).forEach(([k, v]) => setError(k, v));
        throw new Error(body.message);
      }
    } catch (err) {
      status.dataset.state = 'error';
      status.textContent =
        (err as Error).message || 'Poruka nije poslana. Pokušajte ponovno ili mi pišite izravno na e-mail.';
      label.textContent = 'Pošaljite upit';
    } finally {
      button.disabled = false;
    }
  });
}
