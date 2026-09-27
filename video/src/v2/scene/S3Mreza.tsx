import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Natpis } from '../komponente/Natpis';
import { projiciraj, rng, rotX, rotY, type V3 } from '../lib/3d';
import { izlazak, kamera, napredak, odlazak } from '../lib/anim';
import { TEKST } from '../tekstovi';
import { BOJE, W } from '../tokens';
import { RASPORED, S2_CENTAR } from './S2Kartice';

// 9–15 s: kartice se raspadnu u čestice koje se skupe u čvorove 3D neuronske mreže.
// Mreža se polako okreće, a po vezama putuju signali (AI chatbotovi i agenti).

const CX = 540;
const CY = 1080;
const r = rng(5);

// čvorovi u slojevima (odozgo prema dolje), svaki sloj je prsten u dubini
const SLOJEVI = [8, 14, 18, 14, 8];
const CVOROVI: { p: V3; sloj: number }[] = [];
SLOJEVI.forEach((n, s) => {
  const y = -380 + s * 190;
  const rad = [150, 290, 360, 290, 150][s];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + s * 0.4 + r() * 0.2;
    const rr = rad * (0.75 + r() * 0.35);
    CVOROVI.push({ p: [Math.cos(a) * rr, y + (r() - 0.5) * 50, Math.sin(a) * rr], sloj: s });
  }
});

// veze: svaki čvor s 2–3 najbliža u sljedećem sloju
const VEZE: [number, number][] = [];
CVOROVI.forEach((c, i) => {
  const dalje = CVOROVI.map((d, j) => ({ d, j })).filter(({ d }) => d.sloj === c.sloj + 1);
  dalje
    .sort((a, b) => Math.hypot(a.d.p[0] - c.p[0], a.d.p[2] - c.p[2]) - Math.hypot(b.d.p[0] - c.p[0], b.d.p[2] - c.p[2]))
    .slice(0, 2 + (i % 2))
    .forEach(({ j }) => VEZE.push([i, j]));
});

// čestice: kreću s mjesta kartica iz S2 i sliježu se u čvorove
const CESTICE = Array.from({ length: 380 }, (_, i) => {
  const k = RASPORED[Math.floor(r() * RASPORED.length)];
  return {
    x0: S2_CENTAR.x + k.x + r() * k.w,
    y0: S2_CENTAR.y + k.y * 0.9 + r() * k.h * 0.9,
    cilj: i % CVOROVI.length,
    kasni: r() * 30,
    jx: (r() - 0.5) * 18,
    jy: (r() - 0.5) * 18,
    boja: r() < 0.3 ? BOJE.plava : r() < 0.5 ? BOJE.ljubicasta : BOJE.svjetlo,
  };
});

// signali: kratki impulsi koji putuju po vezama
const SIGNALI = Array.from({ length: 90 }, () => ({ veza: Math.floor(r() * VEZE.length), start: 690 + r() * 190 }));

export const S3Mreza: React.FC = () => {
  const f = useCurrentFrame();
  const kut = f * 0.0055 + 0.4;
  const nagib = 0.32;
  const zum = 0.86 + 0.14 * napredak(f, 560, 880, kamera);
  const van = napredak(f, 878, 912, odlazak);
  const pojavaCvorova = napredak(f, 600, 660, izlazak);

  const P = CVOROVI.map((c) => {
    const q = rotX(rotY(c.p, kut), nagib);
    return projiciraj([q[0] * zum, q[1] * zum, q[2] * zum], CX, CY);
  });

  const cestice = napredak(f, 540, 548) * (1 - napredak(f, 650, 690));

  return (
    <AbsoluteFill style={{ opacity: 1 - van, transform: `scale(${1 - van * 0.15})` }}>
      <svg width={W} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="cvor-sjaj">
            <stop offset="0" stopColor={BOJE.svjetlo} stopOpacity={0.9} />
            <stop offset="0.35" stopColor={BOJE.ljubicasta} stopOpacity={0.35} />
            <stop offset="1" stopColor={BOJE.ljubicasta} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* veze */}
        {VEZE.map(([a, b], i) => {
          const p = napredak(f, 620 + (i % 40) * 2, 680 + (i % 40) * 2, izlazak);
          if (p <= 0) return null;
          const A = P[a];
          const B = P[b];
          const dub = Math.min(1, 1.35 - (A.z + B.z) / 2 / 2200);
          return (
            <line
              key={i}
              x1={A.x}
              y1={A.y}
              x2={A.x + (B.x - A.x) * p}
              y2={A.y + (B.y - A.y) * p}
              stroke={i % 5 === 0 ? BOJE.plava : BOJE.svjetlo}
              strokeWidth={1.1}
              opacity={0.26 * dub}
            />
          );
        })}

        {/* signali */}
        {SIGNALI.map((s, i) => {
          const t = (f - s.start) / 26;
          if (t < 0 || t > 1) return null;
          const [a, b] = VEZE[s.veza];
          const A = P[a];
          const B = P[b];
          return (
            <circle
              key={i}
              cx={A.x + (B.x - A.x) * t}
              cy={A.y + (B.y - A.y) * t}
              r={4.5}
              fill="#fff"
              opacity={Math.sin(t * Math.PI)}
              style={{ filter: 'drop-shadow(0 0 8px rgba(111, 211, 255, 0.95))' }}
            />
          );
        })}

        {/* čvorovi (dalji su manji i tamniji) */}
        {P.map((p, i) => {
          const dub = Math.min(1, 1.4 - p.z / 2000);
          // čvor zasvijetli kad do njega stigne signal
          const pogodak = SIGNALI.some((s) => VEZE[s.veza][1] === i && f - s.start > 24 && f - s.start < 40);
          const vel = (5 + 5 * p.s) * pojavaCvorova * (pogodak ? 1.6 : 1);
          return (
            <g key={i} opacity={dub}>
              <circle cx={p.x} cy={p.y} r={vel * 4.5} fill="url(#cvor-sjaj)" opacity={pogodak ? 0.9 : 0.45} />
              <circle cx={p.x} cy={p.y} r={vel * 0.6} fill={BOJE.svjetlo} />
            </g>
          );
        })}

        {/* čestice iz kartica */}
        {cestice > 0 &&
          CESTICE.map((c, i) => {
            const t = napredak(f, 546 + c.kasni, 630 + c.kasni, kamera);
            const cilj = P[c.cilj];
            // lagani luk putanje
            const luk = Math.sin(t * Math.PI) * 120 * (i % 2 ? 1 : -1);
            const x = c.x0 + (cilj.x + c.jx * (1 - t) - c.x0) * t + luk * 0.4;
            const y = c.y0 + (cilj.y + c.jy * (1 - t) - c.y0) * t - Math.abs(luk) * 0.3;
            return <circle key={i} cx={x} cy={y} r={2.2} fill={c.boja} opacity={cestice * (0.5 + 0.5 * (1 - t))} />;
          })}
      </svg>

      <Natpis redovi={TEKST.s3} ulaz={582} izlaz={888} y={330} velicina={100} />
    </AbsoluteFill>
  );
};
