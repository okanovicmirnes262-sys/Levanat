import React from 'react';
import { IKONA, NATPIS } from '../logoPutanje';
import { BOJE } from '../tokens';

// Levanatov logotip (vektoriziran iz poslane slike: public/logo/ikona.svg i natpis.svg).
// Ikona se „iscrtava” svjetlom: maska od debelih poteza (okvir, L, valovi) otkriva pravi logo,
// a tanka svjetla olovka vodi vrh poteza. Kad je sve iscrtano, logo se prikazuje bez maske.

const IW = IKONA.w;
const IH = IKONA.h;

// središnje linije oblika u koordinatama ikona.svg
const POTEZI = [
  { d: 'M 306 569 L 449 569 A 140 140 0 0 0 589 429 L 589 163 A 140 140 0 0 0 449 23 L 164 23 A 140 140 0 0 0 24 163 L 24 429 A 140 140 0 0 0 164 569 Z', w: 46 },
  { d: 'M 180 150 L 180 380 Q 180 441 241 441 L 378 441', w: 70 },
  { d: 'M 258 272 C 285 240 330 238 362 262 S 432 292 478 258', w: 78 },
  { d: 'M 256 352 C 283 324 322 324 354 344 S 402 366 428 350', w: 70 },
];

/** `crtanje` je niz napretka 0–1 za svaki potez (okvir, L, gornji val, donji val). */
export const IkonaLogo: React.FC<{ sirina: number; crtanje: number[]; olovka?: number }> = ({ sirina, crtanje, olovka = 1 }) => {
  const gotovo = crtanje.every((p) => p >= 1);
  return (
    <svg width={sirina} height={(sirina * IH) / IW} viewBox={`0 0 ${IW} ${IH}`} style={{ overflow: 'visible' }}>
      <defs>
        <mask id="logo-crtanje" maskUnits="userSpaceOnUse" x={-50} y={-50} width={IW + 100} height={IH + 100}>
          {POTEZI.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke="#fff"
              strokeWidth={p.w}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - crtanje[i]}
            />
          ))}
        </mask>
      </defs>
      <g mask={gotovo ? undefined : 'url(#logo-crtanje)'}>
        {IKONA.dijelovi.map((p, i) => (
          <path key={i} d={p.d} fill={p.boja} fillRule="evenodd" />
        ))}
      </g>
      {/* svjetla olovka na vrhu poteza */}
      {olovka > 0 &&
        POTEZI.map((p, i) =>
          crtanje[i] > 0 && crtanje[i] < 1 ? (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke="#fff"
              strokeWidth={6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.05 1"
              strokeDashoffset={0.05 - crtanje[i]}
              opacity={olovka}
              style={{ filter: `drop-shadow(0 0 10px ${BOJE.plava}) drop-shadow(0 0 22px ${BOJE.ljubicasta})` }}
            />
          ) : null,
        )}
    </svg>
  );
};

export const NatpisLogo: React.FC<{ sirina: number }> = ({ sirina }) => (
  <svg width={sirina} height={(sirina * NATPIS.h) / NATPIS.w} viewBox={`0 0 ${NATPIS.w} ${NATPIS.h}`} style={{ display: 'block' }}>
    {NATPIS.dijelovi.map((p, i) => (
      <path key={i} d={p.d} fill={p.boja} fillRule="evenodd" />
    ))}
  </svg>
);
