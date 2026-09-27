import React from 'react';
import { BOJE, FONT } from '../tokens';

/**
 * Levanatov wordmark kakav je na stranici: „Levanat” u Fraunces fontu i brončana crta
 * (levanat, vjetar s istoka). Za pravi vektorski logo zamijenite sadržaj ove komponente
 * s <Img src={staticFile('logo.svg')} />.
 *
 * `crta` (0–1) iscrtava brončanu crtu zdesna nalijevo, `otkriveno` (0–1) otkriva slova
 * maskom odozdo prema gore.
 */
export const Logo: React.FC<{ velicina?: number; crta?: number; otkriveno?: number; sjaj?: number }> = ({
  velicina = 150,
  crta = 1,
  otkriveno = 1,
  sjaj = 0,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: velicina * 0.16 }}>
      <div style={{ overflow: 'hidden', paddingBottom: velicina * 0.12, marginBottom: -velicina * 0.12 }}>
        <div
          style={{
            fontFamily: FONT.serif,
            fontSize: velicina,
            fontWeight: 400,
            fontVariationSettings: '"opsz" 72',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: BOJE.kamen,
            transform: `translateY(${(1 - otkriveno) * 105}%)`,
            textShadow: sjaj > 0 ? `0 0 ${40 * sjaj}px rgba(255, 228, 190, ${0.35 * sjaj})` : undefined,
          }}
        >
          Levanat
        </div>
      </div>
      <div
        style={{
          width: velicina * 0.42,
          height: Math.max(3, velicina * 0.03),
          background: BOJE.bronca,
          transformOrigin: 'right center',
          transform: `scaleX(${crta})`,
          boxShadow: sjaj > 0 ? `0 0 ${18 * sjaj}px rgba(216, 185, 138, ${0.6 * sjaj})` : undefined,
          alignSelf: 'center',
          marginTop: velicina * 0.2,
        }}
      />
    </div>
  );
};
