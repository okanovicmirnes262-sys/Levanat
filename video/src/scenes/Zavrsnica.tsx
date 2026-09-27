import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Logo } from '../components/Logo';
import { SvjetlosnaLinija } from '../components/SvjetlosnaLinija';
import { clamp, izlazak, kamera, lerp, napredak, odlazak, opruga } from '../lib/anim';
import { TEKST } from '../tekstovi';
import { BOJE, FONT } from '../tokens';

// S6 prednosti → S7 spajanje u liniju i reveal logotipa → S8 poziv na akciju.
// Lokalni frame 0 = globalni 1200.

const LINIJA_Y = 900;

const Kartica: React.FC<{ i: number; tekst: string; u: number; spoji: number }> = ({ i, tekst, u, spoji }) => {
  const f = useCurrentFrame();
  const p = opruga(f, u, 44);
  const maska = napredak(f, u, u + 34);
  const rijeci = tekst.split(' ');
  const y0 = 560 + i * 250;
  // spajanje: kartica se spljošti u liniju na sredini
  const y = lerp(y0, LINIJA_Y - 1, spoji);
  const h = lerp(200, 2, spoji);
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        width: 900,
        top: y - h / 2,
        height: h,
        perspective: 1800,
        opacity: clamp(p * 1.4) * (1 - napredak(spoji, 0.8, 1)),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: lerp(26, 1, spoji),
          background: `linear-gradient(120deg, rgba(24, 64, 88, 0.85), rgba(8, 30, 44, 0.92))`,
          border: `1px solid ${BOJE.rubJaci}`,
          boxShadow: '0 40px 80px -40px rgba(0, 0, 0, 0.8)',
          clipPath: `inset(0 ${(1 - maska) * 100}% 0 0 round 26px)`,
          transform: `rotateX(${(1 - p) * 14}deg)`,
          overflow: 'hidden',
        }}
      >
        {/* brončani rub svjetla koji prati otkrivanje */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${maska * 100}%`,
            width: 3,
            marginLeft: -3,
            background: BOJE.broncaSv,
            boxShadow: `0 0 30px ${BOJE.broncaSv}`,
            opacity: maska < 1 ? 1 : 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 48,
            right: 48,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 34,
            opacity: 1 - spoji * 2,
          }}
        >
          <div style={{ fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, color: BOJE.broncaSv, letterSpacing: '0.12em' }}>
            0{i + 1}
          </div>
          <div
            style={{
              fontFamily: FONT.serif,
              fontSize: 66,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: BOJE.kamen,
              fontVariationSettings: '"opsz" 72',
            }}
          >
            {rijeci.map((w, k) => {
              const q = opruga(f, u + 8 + k * 5, 40);
              return (
                <span key={k} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em', marginRight: '0.24em' }}>
                  <span style={{ display: 'inline-block', transform: `translateY(${(1 - q) * 110}%)` }}>{w}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Zavrsnica: React.FC<{ kontakt?: string }> = ({ kontakt }) => {
  const f = useCurrentFrame();

  // S6: oznaka i kartice
  const oznaka = opruga(f, 8, 40);
  const oznakaVan = napredak(f, 214, 236, odlazak);
  const spoji = napredak(f, 226, 262, kamera);

  // S7: linija i logo
  const linijaDuljina = napredak(f, 246, 270, izlazak);
  const linijaJacina = 1 - napredak(f, 318, 360);
  const logoIzron = napredak(f, 262, 312, izlazak);
  const crta = napredak(f, 300, 336, izlazak);
  const sjaj = napredak(f, 270, 320) * (1 - napredak(f, 360, 440) * 0.6);
  const moto = f >= 318 ? f : -1;
  const motoVan = napredak(f, 404, 420, odlazak);

  // S8: logo se lagano podigne, pojave se usluge, poziv i kontakt; zadnjih ~1,5 s kadar miruje
  const gore = napredak(f, 420, 468, kamera);
  const logoY = lerp(LINIJA_Y - 100, 700, gore);
  const usluge = opruga(f, 444, 40);
  const poziv = opruga(f, 468, 44);
  const kontaktP = opruga(f, 492, 40);

  return (
    <AbsoluteFill>
      {/* S6 */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 400,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: BOJE.broncaSv,
          opacity: oznaka * (1 - oznakaVan),
          transform: `translateY(${(1 - oznaka) * 20}px)`,
        }}
      >
        {TEKST.prednostiNaslov}
      </div>
      {f < 272
        ? TEKST.prednosti.map((t, i) => <Kartica key={i} i={i} tekst={t} u={30 + i * 54} spoji={spoji} />)
        : null}

      {/* S7: svjetlosna linija iz koje izranja logo */}
      <SvjetlosnaLinija y={LINIJA_Y} duljina={linijaDuljina} jacina={linijaJacina * (f > 240 ? 1 : 0)} sirina={960} />

      {f >= 258 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: logoY - 90,
            height: 190,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Logo velicina={172} otkriveno={logoIzron} crta={crta} sjaj={sjaj} />
        </div>
      ) : null}

      {/* S7: moto ispod logotipa */}
      {moto > 0 && motoVan < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 90,
            right: 90,
            top: LINIJA_Y + 90,
            textAlign: 'center',
            fontFamily: FONT.serif,
            fontStyle: 'italic',
            fontWeight: 320,
            fontSize: 58,
            color: BOJE.kamen,
            opacity: opruga(f, 318, 40) * (1 - motoVan),
            transform: `translateY(${(1 - opruga(f, 318, 40)) * 24 - motoVan * 20}px)`,
          }}
        >
          {TEKST.reveal}
        </div>
      ) : null}

      {/* S8: usluge, poziv, kontakt */}
      {f >= 440 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 90,
              right: 90,
              top: 850,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 31,
              color: BOJE.kamen2,
              letterSpacing: '0.01em',
              opacity: usluge,
              transform: `translateY(${(1 - usluge) * 18}px)`,
            }}
          >
            {TEKST.usluge}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 990,
              display: 'flex',
              justifyContent: 'center',
              opacity: poziv,
              transform: `translateY(${(1 - poziv) * 28}px) scale(${0.96 + 0.04 * poziv})`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 18,
                padding: '34px 56px',
                borderRadius: 999,
                background: `linear-gradient(180deg, ${BOJE.broncaSv}, ${BOJE.bronca})`,
                color: '#03101a',
                fontFamily: FONT.sans,
                fontSize: 44,
                fontWeight: 650,
                letterSpacing: '-0.01em',
                boxShadow: '0 30px 80px -30px rgba(216, 185, 138, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              }}
            >
              {TEKST.poziv} <span style={{ fontWeight: 400 }}>→</span>
            </div>
          </div>
          {kontakt ? (
            <div
              style={{
                position: 'absolute',
                left: 90,
                right: 90,
                top: 1170,
                textAlign: 'center',
                fontFamily: FONT.sans,
                fontSize: 40,
                fontWeight: 500,
                color: BOJE.kamen,
                opacity: kontaktP,
              }}
            >
              {kontakt}
            </div>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
