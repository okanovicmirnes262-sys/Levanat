// Reklama v2: apstraktni smjer. Paleta je izvedena iz novog logotipa (lavandasto bijela na
// gotovo crnoj), a ljubičasta i ledeno plava koriste se samo u svjetlu i česticama.

export const FPS = 60;
export const W = 1080;
export const H = 1920;
export const TRAJANJE = 1800;
export const UDARAC = 30; // 120 BPM

export const BOJE = {
  noc: '#07060c',
  noc2: '#110f18',
  svjetlo: '#f4eeff',
  siva: '#bfbdd1',
  siva2: '#8a869a',
  ljubicasta: '#9b8cff',
  plava: '#6fd3ff',
  rub: 'rgba(244, 238, 255, 0.22)',
  rubSlab: 'rgba(244, 238, 255, 0.1)',
} as const;

export const FONT = '"Inter", system-ui, sans-serif';

export const SCENA = {
  svjetlo: [0, 240],
  kartice: [240, 540],
  mreza: [540, 900],
  strukture: [900, 1260],
  logo: [1260, 1560],
  poziv: [1560, 1800],
} as const;

/** Sigurna zona za ključni tekst (Reels/TikTok/Meta). */
export const SIGURNO = { lijevo: 90, desno: 960, gore: 280, dolje: 1420 } as const;
