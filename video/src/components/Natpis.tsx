import React from 'react';
import { useCurrentFrame } from 'remotion';
import { napredak, odlazak, opruga } from '../lib/anim';
import { BOJE, FONT, SIGURNO } from '../tokens';

type Rijec = { tekst: string; kurziv: boolean };

const razlozi = (red: string): Rijec[] => {
  const out: Rijec[] = [];
  red.split(/(\*[^*]+\*)/).forEach((dio) => {
    if (!dio) return;
    const kurziv = dio.startsWith('*');
    dio
      .replace(/\*/g, '')
      .split(' ')
      .filter(Boolean)
      .forEach((w) => out.push({ tekst: w, kurziv }));
  });
  return out;
};

/**
 * Kinetički natpis: riječi izranjaju ispod maske jedna za drugom (opruga), a pri izlasku
 * se cijeli natpis podigne i izblijedi. Riječi u *zvjezdicama* su kurziv u bronci.
 */
export const Natpis: React.FC<{
  redovi: readonly string[];
  ulaz: number;
  izlaz: number;
  y?: number;
  velicina?: number;
  poravnanje?: 'center' | 'left';
  razmak?: number;
}> = ({ redovi, ulaz, izlaz, y = 330, velicina = 92, poravnanje = 'center', razmak = 4 }) => {
  const f = useCurrentFrame();
  const van = napredak(f, izlaz - 16, izlaz, odlazak);
  if (f < ulaz - 1 || f > izlaz + 1) return null;
  let i = 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: SIGURNO.lijevo,
        right: 1080 - SIGURNO.desno,
        top: y,
        textAlign: poravnanje,
        fontFamily: FONT.serif,
        fontSize: velicina,
        lineHeight: 1.08,
        letterSpacing: '-0.025em',
        color: BOJE.kamen,
        fontWeight: 360,
        fontVariationSettings: '"opsz" 72',
        opacity: 1 - van,
        transform: `translateY(${-van * 36}px)`,
        filter: van > 0 ? `blur(${van * 8}px)` : undefined,
      }}
    >
      {redovi.map((red, r) => (
        <div key={r} style={{ whiteSpace: 'nowrap' }}>
          {razlozi(red).map((w, k) => {
            const p = opruga(f, ulaz + i++ * razmak, 40);
            return (
              <span
                key={k}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'top',
                  paddingBottom: '0.14em',
                  marginBottom: '-0.14em',
                  marginRight: '0.24em',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${(1 - p) * 112}%)`,
                    fontStyle: w.kurziv ? 'italic' : 'normal',
                    fontWeight: w.kurziv ? 320 : 360,
                    color: w.kurziv ? BOJE.broncaSv : BOJE.kamen,
                  }}
                >
                  {w.tekst}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
