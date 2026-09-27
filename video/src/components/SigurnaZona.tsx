import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SIGURNO } from '../tokens';

/** Samo za kontrolne kadrove: prikazuje sigurnu zonu za ključni tekst (Reels/TikTok). */
export const SigurnaZona: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div
      style={{
        position: 'absolute',
        left: SIGURNO.lijevo,
        top: SIGURNO.gore,
        width: SIGURNO.desno - SIGURNO.lijevo,
        height: SIGURNO.dolje - SIGURNO.gore,
        outline: '3px dashed rgba(255, 80, 80, 0.8)',
      }}
    />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1420, bottom: 0, background: 'rgba(255, 60, 60, 0.12)' }} />
    <div style={{ position: 'absolute', right: 0, width: 120, top: 900, bottom: 0, background: 'rgba(255, 60, 60, 0.12)' }} />
  </AbsoluteFill>
);
