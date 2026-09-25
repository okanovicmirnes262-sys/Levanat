// Razgovor s asistentom: isti kod za plutajući prozor na svim stranicama
// i za pokazni primjer na stranici o AI chatbotu.
import { baza, pozdrav, nadji, type Znanje } from '../data/chatDemo';

export function mountChat(root: HTMLElement, opts: { status?: string } = {}) {
  if (root.dataset.ready) return;
  root.dataset.ready = '1';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.innerHTML = `
    <div class="chat__glava">
      <span class="chat__avatar" aria-hidden="true">L</span>
      <div><p class="chat__ime">Asistent</p><p class="chat__status mono">${opts.status ?? 'Odgovara odmah'}</p></div>
    </div>
    <div class="chat__poruke" role="log" aria-live="polite" aria-label="Razgovor s asistentom"></div>
    <div class="chat__ponuda" aria-label="Predložena pitanja"></div>
    <form class="chat__unos">
      <label class="sr-only" for="${root.id || 'chat'}-unos">Vaše pitanje</label>
      <input id="${root.id || 'chat'}-unos" type="text" placeholder="Napišite pitanje…" autocomplete="off" maxlength="200" />
      <button type="submit" class="chat__posalji" aria-label="Pošalji">→</button>
    </form>`;

  const log = root.querySelector<HTMLElement>('.chat__poruke')!;
  const chips = root.querySelector<HTMLElement>('.chat__ponuda')!;
  const form = root.querySelector<HTMLFormElement>('form')!;
  const input = form.querySelector('input')!;
  const asked = new Set<string>();
  let busy = false;

  const add = (cls: string, text = '') => {
    const p = document.createElement('p');
    p.className = `chat__msg ${cls}`;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  };

  const renderChips = () => {
    chips.innerHTML = '';
    baza
      .filter((z) => !asked.has(z.pitanje))
      .forEach((z) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chat__chip';
        b.textContent = z.pitanje;
        b.addEventListener('click', () => reply(z.pitanje, z));
        chips.appendChild(b);
      });
    chips.scrollLeft = 0;
  };

  const reply = async (pitanje: string, z: Znanje) => {
    if (busy) return;
    busy = true;
    if (z.pitanje) asked.add(z.pitanje);
    add('chat__msg--ja', pitanje);
    const t = add('chat__msg--bot chat__tipka');
    t.innerHTML = '<span></span><span></span><span></span>';
    await new Promise((r) => setTimeout(r, still ? 150 : 700));
    t.classList.remove('chat__tipka');
    t.textContent = '';
    if (still) t.textContent = z.odgovor;
    else {
      const words = z.odgovor.split(' ');
      for (let i = 0; i < words.length; i++) {
        t.textContent += (i ? ' ' : '') + words[i];
        log.scrollTop = log.scrollHeight;
        await new Promise((r) => setTimeout(r, 22));
      }
    }
    if (z.veza) {
      const a = document.createElement('a');
      a.href = z.veza.href;
      a.className = 'chat__veza';
      a.textContent = z.veza.tekst;
      t.appendChild(document.createElement('br'));
      t.appendChild(a);
    }
    log.scrollTop = log.scrollHeight;
    renderChips();
    busy = false;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    reply(q, nadji(q));
  });

  add('chat__msg--bot', pozdrav);
  renderChips();
  return { focus: () => input.focus() };
}

// Plutajući asistent: poziva ga asistent-gumb.ts kad se prozor prvi put otvori
export function mountFloating(panel: HTMLElement) {
  return mountChat(panel.querySelector<HTMLElement>('.chat')!);
}
