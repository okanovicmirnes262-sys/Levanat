import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { BOJE, H, W } from '../tokens';

/**
 * Tamna pozadina: gotovo crna s dubokim morskim sjajem koji polako putuje (parallax),
 * blagom brončanom toplinom pri dnu, filmskim zrnom i vinjetom.
 * `svjetlo` (0–1) pojačava sjaj za mirnije, svečanije kadrove (reveal, poziv).
 */
export const Pozadina: React.FC<{ svjetlo?: number }> = ({ svjetlo = 0 }) => {
  const f = useCurrentFrame();
  // spori pomak sjaja: jedan puni ciklus traje cijelu reklamu
  const t = f / 1800;
  const x1 = 50 + Math.sin(t * Math.PI * 2) * 14;
  const y1 = 34 + Math.cos(t * Math.PI * 2) * 6;
  const x2 = 60 - Math.sin(t * Math.PI * 2) * 18;
  const seed = Math.floor(f / 2) % 12;

  return (
    <AbsoluteFill style={{ backgroundColor: BOJE.noc, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 42% at ${x1}% ${y1}%, rgba(18, 56, 79, ${0.85 + svjetlo * 0.15}) 0%, rgba(11, 42, 60, 0.35) 45%, transparent 75%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 30% at ${x2}% 92%, rgba(176, 141, 87, ${0.1 + svjetlo * 0.1}) 0%, transparent 70%)`,
        }}
      />
      {/* filmsko zrno */}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay' }}>
        <filter id={`zrno-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#zrno-${seed})`} />
      </svg>
      <AbsoluteFill
        style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55) 100%)' }}
      />
    </AbsoluteFill>
  );
};
