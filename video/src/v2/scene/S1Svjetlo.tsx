import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Natpis } from '../komponente/Natpis';
import { rng } from '../lib/3d';
import { izlazak, kamera, lerp, napredak, odlazak } from '../lib/anim';
import { TEKST } from '../tekstovi';
import { BOJE, W } from '../tokens';

// 0–4 s: iz tame se upali točka svjetla, pulsira na udarce, izbaci zrake i razvije se
// u perspektivnu digitalnu mrežu (pod od linija s čvorovima). Kamera se polako diže.

const CX = 540;
const TOCKA_Y = 1020;

const r = rng(3);
const ZRAKE = Array.from({ length: 28 }, (_, i) => ({
  kut: (i / 28) * Math.PI * 2 + r() * 0.12,
  duljina: 0.55 + r() * 0.45,
  kasni: r() * 10,
}));

/** Perspektivni pod: okomite linije konvergiraju u točku nestajanja, vodoravne klize prema gledatelju. */
const Pod: React.FC<{ horizont: number; pojava: number; f: number }> = ({ horizont, pojava, f }) => {
  const visina = 260; // visina kamere nad podom
  const fok = 900;
  const linije: React.ReactNode[] = [];
  // okomite (konstantan X u svijetu)
  for (let i = -14; i <= 14; i++) {
    const X = i * 150;
    const zBlizu = 120;
    const x2 = CX + (X * fok) / zBlizu;
    const y2 = horizont + (visina * fok) / zBlizu;
    const o = (1 - Math.abs(i) / 15) * 0.55 * pojava;
    linije.push(<line key={`v${i}`} x1={CX} y1={horizont} x2={x2} y2={y2} stroke="url(#pod-v)" strokeWidth={1.2} opacity={o} />);
  }
  // vodoravne: jednoliko u dubini, polako prema gledatelju
  const korak = 220;
  const pomak = (f * 3.2) % korak;
  for (let k = 0; k < 26; k++) {
    const z = 140 + k * korak - pomak;
    if (z < 120) continue;
    const y = horizont + (visina * fok) / z;
    const o = Math.min(1, 1.6 - z / 3200) * 0.5 * pojava;
    if (o <= 0) continue;
    linije.push(<line key={`h${k}`} x1={0} y1={y} x2={W} y2={y} stroke={BOJE.svjetlo} strokeWidth={1} opacity={o * 0.6} />);
  }
  // čvorovi na sjecištima bliže gledatelju
  const cvorovi: React.ReactNode[] = [];
  for (let k = 0; k < 7; k++) {
    const z = 140 + k * korak - pomak;
    if (z < 120) continue;
    const y = horizont + (visina * fok) / z;
    for (let i = -6; i <= 6; i += 2) {
      const x = CX + (i * 150 * fok) / z;
      if (x < -20 || x > W + 20) continue;
      const puls = 0.5 + 0.5 * Math.sin(f / 12 + i + k);
      cvorovi.push(<circle key={`c${k}${i}`} cx={x} cy={y} r={2 + (fok / z) * 0.8} fill={BOJE.svjetlo} opacity={pojava * (0.3 + 0.5 * puls) * Math.min(1, 1.4 - z / 1600)} />);
    }
  }
  return (
    <svg width={W} height={1920} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="pod-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BOJE.ljubicasta} stopOpacity={0} />
          <stop offset="0.25" stopColor={BOJE.ljubicasta} stopOpacity={0.9} />
          <stop offset="1" stopColor={BOJE.plava} stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id="pod-maska" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.52" stopColor="#fff" stopOpacity={1} />
          <stop offset="1" stopColor="#fff" stopOpacity={0.15} />
        </linearGradient>
        <mask id="pod-m">
          <rect width={W} height={1920} fill="url(#pod-maska)" />
        </mask>
      </defs>
      <g mask="url(#pod-m)">
        {linije}
        {cvorovi}
      </g>
    </svg>
  );
};

export const S1Svjetlo: React.FC = () => {
  const f = useCurrentFrame();
  const pal = napredak(f, 2, 14, izlazak); // točka se upali
  const puls = 1 + 0.18 * Math.max(0, Math.cos(((f % 30) / 30) * Math.PI * 2)) * (f < 110 ? 1 : 0);
  const zrake = napredak(f, 96, 150, izlazak);
  const zrakeVan = napredak(f, 150, 196);
  const mreza = napredak(f, 118, 200, kamera);
  const dizanje = napredak(f, 120, 250, kamera); // kamera se diže → horizont se spušta
  const horizont = lerp(TOCKA_Y, TOCKA_Y + 120, dizanje);
  const van = napredak(f, 226, 262, odlazak);
  const tockaY = horizont;

  return (
    <AbsoluteFill style={{ opacity: 1 - van * 0.85 }}>
      <Pod horizont={horizont} pojava={mreza * (1 - van)} f={f} />

      {/* zrake koje izlete iz točke */}
      <svg width={W} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="zraka" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity={0.9} />
            <stop offset="1" stopColor={BOJE.ljubicasta} stopOpacity={0} />
          </linearGradient>
        </defs>
        {zrake > 0 &&
          ZRAKE.map((z, i) => {
            const p = napredak(f, 96 + z.kasni, 150 + z.kasni, izlazak);
            const d = p * 900 * z.duljina;
            const pocetak = zrakeVan * d * 0.9;
            return (
              <line
                key={i}
                x1={CX + Math.cos(z.kut) * pocetak}
                y1={tockaY + Math.sin(z.kut) * pocetak}
                x2={CX + Math.cos(z.kut) * d}
                y2={tockaY + Math.sin(z.kut) * d}
                stroke={i % 3 === 0 ? BOJE.plava : BOJE.svjetlo}
                strokeWidth={1.4}
                opacity={(1 - zrakeVan) * 0.7}
              />
            );
          })}
      </svg>

      {/* točka svjetla s mekim sjajem */}
      <div
        style={{
          position: 'absolute',
          left: CX - 300,
          top: tockaY - 300,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(155, 140, 255, ${0.45 * pal}) 0%, rgba(111, 211, 255, ${0.12 * pal}) 30%, transparent 62%)`,
          transform: `scale(${pal * puls * (1 + zrake * 0.4)})`,
          opacity: 1 - van,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: CX - 10,
          top: tockaY - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: `0 0 30px 8px rgba(244, 238, 255, 0.9), 0 0 90px 20px rgba(155, 140, 255, 0.55)`,
          transform: `scale(${pal * puls})`,
          opacity: 1 - van,
        }}
      />

      <Natpis redovi={[TEKST.s1a]} ulaz={48} izlaz={232} y={380} velicina={118} />
      <Natpis redovi={[TEKST.s1b]} ulaz={112} izlaz={232} y={515} velicina={118} />
    </AbsoluteFill>
  );
};
