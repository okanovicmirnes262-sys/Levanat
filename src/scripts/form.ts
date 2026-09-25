// Kontakt forma kao razgovor: jedno pitanje po koraku (s JS-om), provjera na
// klijentu, slanje bez ponovnog učitavanja. Bez JS-a radi kao obična forma.

type Field = HTMLInputElement | HTMLTextAreaElement;

const rules: Record<string, (v: string) => string> = {
  ime: (v) => (v.trim().length < 2 ? 'Upišite svoje ime.' : ''),
  usluga: (v) => (!v ? 'Odaberite što Vas zanima.' : ''),
  poruka: (v) => (v.trim().length < 10 ? 'Napišite barem kratku poruku (najmanje 10 znakova).' : ''),
  email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Upišite ispravnu e-mail adresu.' : ''),
  telefon: (v) => (v.trim() && !/^[+\d][\d\s()/.-]{5,24}$/.test(v.trim()) ? 'Broj telefona nije ispravan.' : ''),
};

export function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const time = form.querySelector<HTMLInputElement>('[data-form-time]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const steps = [...form.querySelectorAll<HTMLElement>('[data-korak]')];
  const nav = form.querySelector<HTMLElement>('[data-koraci-gumbi]')!;
  const back = form.querySelector<HTMLButtonElement>('[data-natrag]')!;
  const next = form.querySelector<HTMLButtonElement>('[data-dalje]')!;
  const foot = form.querySelector<HTMLElement>('[data-form-foot]')!;
  const progress = form.querySelector<HTMLElement>('[data-koraci-napredak]')!;
  const stepNo = form.querySelector<HTMLElement>('[data-korak-broj]')!;
  const pozdrav = form.querySelector<HTMLElement>('[data-ime-pozdrav]');
  time.value = String(Date.now());

  const value = (name: string) => {
    const el = form.elements.namedItem(name) as Field | RadioNodeList | null;
    return el ? String(el.value ?? '') : '';
  };

  const setError = (name: string, msg: string) => {
    const out = form.querySelector<HTMLElement>(`#${name}-greska`);
    if (out) out.textContent = msg;
    const el = form.elements.namedItem(name);
    if (el instanceof RadioNodeList) {
      (form.querySelector(`input[name="${name}"]`)?.closest('fieldset') as HTMLElement | null)?.setAttribute(
        'aria-invalid',
        msg ? 'true' : 'false',
      );
    } else (el as Field | null)?.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  const check = (name: string) => {
    const msg = rules[name]?.(value(name)) ?? '';
    setError(name, msg);
    return msg;
  };

  const namesIn = (el: Element) => [
    ...new Set(
      [...el.querySelectorAll<HTMLInputElement>('input[name], textarea[name]')]
        .map((i) => i.name)
        .filter((n) => n in rules),
    ),
  ];

  // Popuni iz adrese (npr. dolazak iz kalkulatora cijene)
  const params = new URLSearchParams(location.search);
  const u = params.get('usluga');
  if (u) {
    const r = form.querySelector<HTMLInputElement>(`input[name="usluga"][value="${CSS.escape(u)}"]`);
    if (r) r.checked = true;
  }
  const pr = params.get('poruka');
  if (pr) (form.elements.namedItem('poruka') as HTMLTextAreaElement).value = pr;
  if (params.get('greska')) {
    status.dataset.state = 'error';
    status.textContent = 'Poruka nije poslana. Pokušajte ponovno ili mi pišite izravno na e-mail.';
  }

  // Koraci (samo s JS-om)
  let current = 0;
  const show = (i: number, focus = true) => {
    current = i;
    steps.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      s.toggleAttribute('hidden', k !== i);
    });
    stepNo.textContent = `Korak ${i + 1} od ${steps.length}`;
    progress.style.setProperty('--p', String((i + 1) / steps.length));
    back.hidden = i === 0;
    const last = i === steps.length - 1;
    next.hidden = last;
    foot.hidden = !last;
    if (pozdrav) {
      const ime = value('ime').trim().split(/\s+/)[0];
      pozdrav.textContent = ime ? `, ${ime}` : '';
    }
    if (focus) steps[i].querySelector<HTMLElement>('input:not([type="radio"]), textarea, input[type="radio"]:checked, input[type="radio"]')?.focus({ preventScroll: true });
  };
  const goNext = () => {
    const bad = namesIn(steps[current]).filter((n) => check(n));
    if (bad.length) return;
    show(Math.min(current + 1, steps.length - 1));
  };

  form.classList.add('form--koraci');
  progress.hidden = false;
  nav.hidden = false;
  show(0, false);
  next.addEventListener('click', goNext);
  back.addEventListener('click', () => show(Math.max(current - 1, 0)));
  form.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (e.key === 'Enter' && t.tagName === 'INPUT' && current < steps.length - 1) {
      e.preventDefault();
      goNext();
    }
  });
  // Odabir usluge odmah vodi dalje
  form.querySelectorAll<HTMLInputElement>('input[name="usluga"]').forEach((r) =>
    r.addEventListener('change', () => {
      setError('usluga', '');
      setTimeout(goNext, 250);
    }),
  );
  Object.keys(rules).forEach((name) => {
    form.querySelectorAll<Field>(`[name="${name}"]`).forEach((el) => {
      el.addEventListener('input', () => {
        if (el.getAttribute('aria-invalid') === 'true') check(name);
      });
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = Object.keys(rules).filter((n) => check(n));
    if (invalid.length) {
      const step = steps.findIndex((s) => namesIn(s).includes(invalid[0]));
      if (step >= 0) show(step);
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
        setTimeout(() => {
          label.textContent = 'Pošaljite upit';
          show(0, false);
        }, 5000);
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
