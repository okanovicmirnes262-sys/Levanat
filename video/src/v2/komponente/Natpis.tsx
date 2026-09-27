import React from 'react';
import { useCurrentFrame } from 'remotion';
import { napredak, odlazak, opruga } from '../lib/anim';
import { BOJE, FONT, SIGURNO } from '../tokens';

type Rijec = { tekst: string; svjetlo: boolean };

const razlozi = (red: string): Rijec[] => {
  const out: Rijec[] = [];
  red.split(/(\*[^*]+\*)/).forEach((dio) => {
    if (!dio) return;
    const svjetlo = dio.startsWith('*');
    dio
      .replace(/\*/g, '')
      .split(' ')
      .filter(Boolean)
      .forEach((w) => out.push({ tekst: w, svjetlo }));
  });
  return out;
};

/** Gradijent „svjetla” za naglašene riječi (lavanda → ljubičasta → ledeno plava). */
export const GRADIJENT_TEKSTA = `linear-gradient(100deg, ${BOJE.svjetlo} 0%, #c9bfff 45%, ${BOJE.plava} 100%)`;

/**
 * Kinetički natpis: svaka riječ izroni ispod maske i izoštri se (opruga), a pri izlasku se
 * cijeli natpis podigne, izblijedi i zamuti. Riječi u *zvjezdicama* dobiju svjetlosni gradijent.
 */
export const Natpis: React.FC<{
  redovi: readonly string[];
  ulaz: number;
  izlaz: number;
  y?: number;
  velicina?: number;
  tezina?: number;
  razmak?: number;
}> = ({ redovi, ulaz, izlaz, y = 340, velicina = 104, tezina = 600, razmak = 5 }) => {
  const f = useCurrentFrame();
  if (f < ulaz - 1 || f > izlaz + 1) return null;
  const van = napredak(f, izlaz - 18, izlaz, odlazak);
  let i = 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: SIGURNO.lijevo,
        right: 1080 - SIGURNO.desno,
        top: y,
        textAlign: 'center',
        fontFamily: FONT,
        fontSize: velicina,
        fontWeight: tezina,
        lineHeight: 1.06,
        letterSpacing: '-0.035em',
        color: BOJE.svjetlo,
        opacity: 1 - van,
        transform: `translateY(${-van * 40}px)`,
        filter: van > 0 ? `blur(${van * 10}px)` : undefined,
      }}
    >
      {redovi.map((red, r) => (
        <div key={r} style={{ whiteSpace: 'nowrap' }}>
          {razlozi(red).map((w, k) => {
            const p = opruga(f, ulaz + i++ * razmak, 42);
            return (
              <span
                key={k}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'top',
                  padding: '0 0.04em 0.26em',
                  margin: '0 0.2em -0.26em 0',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${(1 - p) * 105}%)`,
                    filter: p < 0.98 ? `blur(${(1 - p) * 12}px)` : undefined,
                    ...(w.svjetlo
                      ? { backgroundImage: GRADIJENT_TEKSTA, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
                      : {}),
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
