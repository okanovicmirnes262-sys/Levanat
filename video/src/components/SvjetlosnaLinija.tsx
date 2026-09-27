import React from 'react';
import { BOJE } from '../tokens';

/**
 * Tanka vodoravna linija svjetlosti. `duljina` (0–1) određuje koliko je iscrtana od sredine,
 * `jacina` (0–1) sjaj. Boja je topla (bronca prema bijeloj u sredini).
 */
export const SvjetlosnaLinija: React.FC<{
  y: number;
  duljina: number;
  jacina?: number;
  sirina?: number;
  x?: number;
}> = ({ y, duljina, jacina = 1, sirina = 900, x = 540 }) => {
  const w = sirina * duljina;
  if (w < 1) return null;
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y - 1, width: w, height: 2, opacity: jacina }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${BOJE.bronca} 22%, #fff4e2 50%, ${BOJE.bronca} 78%, transparent 100%)`,
        }}
      />
      {/* sjaj */}
      <div
        style={{
          position: 'absolute',
          left: '15%',
          right: '15%',
          top: -18,
          height: 38,
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255, 228, 190, 0.35), transparent 70%)',
          filter: 'blur(6px)',
        }}
      />
    </div>
  );
};
