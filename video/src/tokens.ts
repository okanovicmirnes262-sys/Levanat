// Zajednički dizajnerski tokeni reklame. Paleta je izvedena iz Levanatove stranice
// („Kamen i more”): duboko more, kamen, bronca i štedljivo tirkiz.

export const FPS = 60;
export const W = 1080;
export const H = 1920;
export const TRAJANJE = 1800; // točno 30 s pri 60 fps

/** Jedan udarac pri 120 BPM = 0,5 s = 30 frameova. Ključni ulasci padaju na ovu rešetku. */
export const UDARAC = 30;

export const BOJE = {
  noc: '#03101a',
  more: '#0b2a3c',
  more2: '#12384f',
  staklo: 'rgba(237, 230, 218, 0.06)',
  stakloJace: 'rgba(237, 230, 218, 0.1)',
  rub: 'rgba(237, 230, 218, 0.14)',
  rubJaci: 'rgba(237, 230, 218, 0.24)',
  kamen: '#ede6da',
  kamen2: '#b8b0a3',
  kamen3: '#7f8a90',
  bronca: '#b08d57',
  broncaSv: '#d8b98a',
  tirkiz: '#2a8f96',
} as const;

export const FONT = {
  serif: '"Fraunces", Georgia, serif',
  sans: '"Inter", system-ui, sans-serif',
} as const;

/** Raspored scena u frameovima [početak, kraj). */
export const SCENA = {
  hook: [0, 180],
  stvaranje: [180, 420],
  dizajn: [420, 660],
  chat: [660, 960],
  agenti: [960, 1200],
  prednosti: [1200, 1440],
  reveal: [1440, 1620],
  poziv: [1620, 1800],
} as const;

/**
 * Sigurna zona za Reels/TikTok/Meta: ključni tekst unutar ovog okvira.
 * Gore je korisničko ime i gumbi, dolje opis, a desno ikone (lajk, komentar, dijeljenje).
 */
export const SIGURNO = { lijevo: 90, desno: 960, gore: 280, dolje: 1420 } as const;
