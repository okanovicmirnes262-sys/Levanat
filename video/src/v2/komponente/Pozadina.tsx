import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { rng } from '../lib/3d';
import { BOJE, H, W } from '../tokens';

// Gotovo crna pozadina s dva vrlo meka svjetla (ljubičasto gore, plavo dolje) koja polako
// putuju, lebdeća prašina u tri dubine (parallax), filmsko zrno i vinjeta.

const r = rng(11);
const PRASINA = Array.from({ length: 70 }, () => ({
  x: r() * W,
  y: r() * H,
  dub: 0.3 + r() * 0.7, // bliže = veće, brže, svjetlije
  faza: r() * Math.PI * 2,
}));

export const Pozadina: React.FC<{ jacina?: number; prasina?: number }> = ({ jacina = 1, prasina = 1 }) => {
  const f = useCurrentFrame();
  const t = f / 1800;
  const seed = Math.floor(f / 2) % 12;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${BOJE.noc} 0%, ${BOJE.noc2} 55%, ${BOJE.noc} 100%)` }}>
      <AbsoluteFill
        style={{
          opacity: jacina,
          background: `radial-gradient(ellipse 60% 34% at ${70 - t * 30}% ${18 + t * 10}%, rgba(155, 140, 255, 0.16), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: jacina,
          background: `radial-gradient(ellipse 70% 30% at ${25 + t * 40}% ${88 - t * 8}%, rgba(111, 211, 255, 0.1), transparent 70%)`,
        }}
      />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: prasina }}>
        {PRASINA.map((p, i) => {
          const y = (p.y - f * 0.35 * p.dub + H * 2) % H;
          const x = p.x + Math.sin(f / 90 + p.faza) * 14 * p.dub;
          const o = (0.12 + 0.35 * p.dub) * (0.6 + 0.4 * Math.sin(f / 40 + p.faza));
          return <circle key={i} cx={x} cy={y} r={0.8 + p.dub * 1.8} fill={BOJE.svjetlo} opacity={o} />;
        })}
      </svg>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: 0.06, mixBlendMode: 'overlay' }}>
        <filter id={`zr-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#zr-${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.65) 100%)' }} />
    </AbsoluteFill>
  );
};
