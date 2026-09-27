import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { IkonaAI, IkonaDokument, IkonaPoruka, IkonaZvono } from '../components/Ikone';
import { Natpis } from '../components/Natpis';
import { kamera, lerp, napredak, odlazak, opruga } from '../lib/anim';
import { TEKST, TIJEK } from '../tekstovi';
import { BOJE, FONT } from '../tokens';

// S5 — AI agenti i automatizacija: upit → AI obrada → pripremljen odgovor → obavijest vlasniku.
// Lokalni frame 0 = globalni 945 (blago preklapanje s izlaskom chata).

const Y0 = 640;
const RAZMAK = 200;
const LIJEVO = 150;
const IKONA_X = LIJEVO + 58; // središte kruga ikone

const ikone = [IkonaPoruka, IkonaAI, IkonaDokument, IkonaZvono];

export const Agenti: React.FC = () => {
  const f = useCurrentFrame();
  const van = napredak(f, 232, 255, odlazak);
  // puls svjetla putuje niz liniju od prvog do zadnjeg čvora
  const puls = napredak(f, 66, 172, kamera);
  const pulsY = lerp(Y0, Y0 + RAZMAK * 3, puls);
  const linija = napredak(f, 40, 160, kamera);

  return (
    <AbsoluteFill style={{ opacity: 1 - van, transform: `translateY(${-van * 30}px)` }}>
      <Natpis redovi={TEKST.agenti} ulaz={16} izlaz={250} velicina={86} y={310} />

      {/* linija toka */}
      <div
        style={{
          position: 'absolute',
          left: IKONA_X - 1,
          top: Y0,
          width: 2,
          height: RAZMAK * 3 * linija,
          background: `linear-gradient(180deg, ${BOJE.rubJaci}, ${BOJE.bronca})`,
        }}
      />
      {f > 66 && f < 180 ? (
        <div
          style={{
            position: 'absolute',
            left: IKONA_X - 60,
            top: pulsY - 60,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 236, 205, 0.55), transparent 65%)',
          }}
        />
      ) : null}

      {TIJEK.map((korak, i) => {
        const u = 30 + i * 30;
        const p = opruga(f, u, 38);
        const aktivan = napredak(f, 66 + i * 35, 80 + i * 35);
        const Ikona = ikone[i];
        const zadnji = i === TIJEK.length - 1;
        // zvono se kratko zanjiše kad stigne obavijest
        const njihanje = zadnji ? Math.sin((f - 172) / 3) * 10 * Math.max(0, 1 - (f - 172) / 40) * (f > 172 ? 1 : 0) : 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: LIJEVO,
              width: 780,
              top: Y0 + i * RAZMAK - 70,
              height: 140,
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              padding: '0 0 0 0',
              opacity: p,
              transform: `translateX(${(1 - p) * 60}px)`,
            }}
          >
            <div
              style={{
                width: 116,
                height: 116,
                flex: 'none',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: `radial-gradient(circle at 35% 30%, rgba(40, 90, 118, 0.95), rgba(8, 30, 44, 0.98))`,
                border: `1.5px solid ${aktivan > 0.5 ? BOJE.bronca : BOJE.rubJaci}`,
                boxShadow: aktivan > 0 ? `0 0 ${50 * aktivan}px rgba(216, 185, 138, ${0.35 * aktivan})` : undefined,
                transform: `rotate(${njihanje}deg)`,
              }}
            >
              <Ikona boja={aktivan > 0.5 ? BOJE.broncaSv : BOJE.kamen} />
            </div>
            <div
              style={{
                flex: 1,
                padding: '24px 30px',
                borderRadius: 22,
                background: `rgba(237, 230, 218, ${0.04 + aktivan * 0.03})`,
                border: `1px solid ${BOJE.rub}`,
              }}
            >
              <div style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 600, color: BOJE.kamen, letterSpacing: '-0.01em' }}>
                {korak.naslov}
              </div>
              <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: 26, color: BOJE.kamen2 }}>{korak.opis}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
