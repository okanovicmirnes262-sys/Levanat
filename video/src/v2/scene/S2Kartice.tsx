import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Natpis } from '../komponente/Natpis';
import { rng } from '../lib/3d';
import { kamera, lerp, napredak, odlazak, opruga } from '../lib/anim';
import { TEKST } from '../tekstovi';
import { BOJE, W } from '../tokens';

// 4–9 s: staklene 3D kartice doletavaju iz dubine i na udarce se slažu u apstraktnu
// kompoziciju web stranice (traka, veliki blok, tri pločice). Bez stvarnog sučelja i teksta.

export const S2_CENTAR = { x: 540, y: 1060 };

/** Raspored kartica u odnosu na središte kompozicije (koriste ga i čestice u S3). */
export const RASPORED = [
  { x: -390, y: -330, w: 780, h: 84, u: 266 },
  { x: -390, y: -222, w: 780, h: 400, u: 296 },
  { x: -390, y: 202, w: 246, h: 200, u: 326 },
  { x: -123, y: 202, w: 246, h: 200, u: 342 },
  { x: 144, y: 202, w: 246, h: 200, u: 358 },
];

const r = rng(21);
const POLAZ = RASPORED.map(() => ({ x: (r() - 0.5) * 900, y: (r() - 0.5) * 700, rx: (r() - 0.5) * 80, ry: (r() - 0.5) * 90, rz: (r() - 0.5) * 40 }));

const staklo: React.CSSProperties = {
  position: 'absolute',
  borderRadius: 26,
  background: 'linear-gradient(140deg, rgba(244, 238, 255, 0.16) 0%, rgba(244, 238, 255, 0.04) 55%, rgba(155, 140, 255, 0.06) 100%)',
  border: `1.5px solid ${BOJE.rub}`,
  boxShadow: '0 50px 90px -40px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
  overflow: 'hidden',
};

const Crtica: React.FC<{ w: number; h?: number; o?: number; style?: React.CSSProperties }> = ({ w, h = 14, o = 0.35, style }) => (
  <div style={{ width: w, height: h, borderRadius: h, background: `rgba(244, 238, 255, ${o})`, ...style }} />
);

const Sadrzaj: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0)
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 34px', gap: 18 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, border: `3px solid rgba(244,238,255,0.7)` }} />
        <div style={{ flex: 1 }} />
        <Crtica w={70} h={10} o={0.28} />
        <Crtica w={70} h={10} o={0.28} />
        <Crtica w={110} h={34} o={0.85} />
      </div>
    );
  if (i === 1)
    return (
      <>
        <div
          style={{
            position: 'absolute',
            right: -60,
            top: -40,
            width: 440,
            height: 440,
            borderRadius: '50%',
            background: `radial-gradient(circle at 40% 40%, rgba(111, 211, 255, 0.75), rgba(155, 140, 255, 0.55) 40%, transparent 70%)`,
            filter: 'blur(6px)',
          }}
        />
        <div style={{ position: 'absolute', left: 44, top: 96, display: 'grid', gap: 18 }}>
          <Crtica w={330} h={40} o={0.9} />
          <Crtica w={250} h={40} o={0.9} />
          <Crtica w={290} h={12} o={0.3} style={{ marginTop: 18 }} />
          <Crtica w={220} h={12} o={0.3} />
          <Crtica w={150} h={46} o={0.95} style={{ marginTop: 26, background: `linear-gradient(90deg, ${BOJE.svjetlo}, #c9bfff)` }} />
        </div>
      </>
    );
  return (
    <div style={{ padding: 30, display: 'grid', gap: 18 }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: i === 3 ? 'rgba(111,211,255,0.35)' : 'rgba(155,140,255,0.35)' }} />
      <Crtica w={150} h={12} o={0.5} />
      <Crtica w={110} h={12} o={0.25} />
    </div>
  );
};

export const S2Kartice: React.FC = () => {
  const f = useCurrentFrame();
  const nagibX = lerp(26, 10, napredak(f, 250, 520, kamera));
  const nagibY = lerp(-16, 10, napredak(f, 250, 540, kamera)) + Math.sin(f / 70) * 1.5;
  const ulaz = napredak(f, 240, 262);
  const van = napredak(f, 538, 566, odlazak);
  const sjaj = napredak(f, 418, 478, kamera);
  const brzina = napredak(f, 398, 470);

  return (
    <AbsoluteFill style={{ opacity: ulaz * (1 - van) }}>
      {/* svjetlosne crte brzine */}
      {brzina > 0 && brzina < 1 ? (
        <svg width={W} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 14 }, (_, i) => {
            const y = 640 + i * 62 + (i % 3) * 11;
            const x = lerp(-600, W + 300, (brzina * 1.3 + i * 0.07) % 1.3);
            return <rect key={i} x={x} y={y} width={260 + (i % 4) * 90} height={2} rx={1} fill={i % 2 ? BOJE.plava : BOJE.svjetlo} opacity={0.5 * Math.sin(brzina * Math.PI)} />;
          })}
        </svg>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: S2_CENTAR.x,
          top: S2_CENTAR.y,
          perspective: 2200,
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={{ transformStyle: 'preserve-3d', transform: `rotateX(${nagibX}deg) rotateY(${nagibY}deg) scale(${1 + van * 0.1})` }}>
          {RASPORED.map((k, i) => {
            const p = opruga(f, k.u, 46, 1.1);
            const s = POLAZ[i];
            return (
              <div
                key={i}
                style={{
                  ...staklo,
                  left: k.x,
                  top: k.y,
                  width: k.w,
                  height: k.h,
                  opacity: Math.min(1, p * 1.5),
                  transform: `translate3d(${(1 - p) * s.x}px, ${(1 - p) * s.y}px, ${(1 - p) * -2600 + Math.sin(f / 50 + i) * 8}px) rotateX(${(1 - p) * s.rx}deg) rotateY(${(1 - p) * s.ry}deg) rotateZ(${(1 - p) * s.rz}deg)`,
                }}
              >
                <Sadrzaj i={i} />
                {/* odsjaj koji prelazi preko svih kartica */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(115deg, transparent ${sjaj * 160 - 60}%, rgba(255,255,255,0.22) ${sjaj * 160 - 45}%, transparent ${sjaj * 160 - 30}%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Natpis redovi={[TEKST.s2a]} ulaz={262} izlaz={392} y={380} velicina={112} />
      <Natpis redovi={[TEKST.s2b]} ulaz={400} izlaz={530} y={380} velicina={112} />
    </AbsoluteFill>
  );
};
