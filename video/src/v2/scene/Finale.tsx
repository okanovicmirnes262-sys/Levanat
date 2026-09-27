import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { IkonaLogo, NatpisLogo } from '../komponente/Logo';
import { GRADIJENT_TEKSTA, Natpis } from '../komponente/Natpis';
import { Ikosaedar, PrstenCestica, StruktureDefs, ValVeza } from '../komponente/Strukture';
import { izlazak, kamera, lerp, napredak, opruga } from '../lib/anim';
import { TEKST } from '../tekstovi';
import { BOJE, FONT, W } from '../tokens';

// 15–21 s: tri svjetlosne strukture, svaka u fokusu, pa u redu.
// 21–26 s: spajaju se u svjetlo iz kojeg se iscrtava logotip, izroni „Levanat” i moto.
// 26–30 s: čist završni kadar s pozivom na akciju. (Globalni frameovi.)

const FOKUS = [904, 1004, 1104]; // početak fokusa svake strukture
const FOKUS_KRAJ = [1004, 1104, 1196];
const SREDISTE = { x: 540, y: 1040, R: 300 };
const RED_DOLJE = [
  { x: 250, y: 1560 },
  { x: 540, y: 1560 },
  { x: 830, y: 1560 },
];
const RED_SREDINA = [
  { x: 240, y: 1010 },
  { x: 540, y: 1010 },
  { x: 840, y: 1010 },
];
const LOGO_Y = 800; // središte ikone
const IKONA_SIRINA = 430;

const Struktura: React.FC<{ i: number; f: number; x: number; y: number; R: number; o: number; brzina: number }> = ({ i, x, y, ...p }) =>
  i === 0 ? <Ikosaedar cx={x} cy={y} {...p} /> : i === 1 ? <PrstenCestica cx={x} cy={y} {...p} /> : <ValVeza cx={x} cy={y} {...p} />;

export const Finale: React.FC<{ kontakt?: string }> = ({ kontakt }) => {
  const f = useCurrentFrame();

  // --- S4: pozicije struktura ---
  const uRed = napredak(f, 1196, 1244, kamera); // cijeli red se podigne u sredinu
  const spoji = napredak(f, 1262, 1330, kamera); // S5: sve se spoji u središte
  const poze = [0, 1, 2].map((i) => {
    const ulaz = opruga(f, FOKUS[i], 50);
    const uRedDolje = opruga(f, FOKUS_KRAJ[i], 48);
    let x = lerp(SREDISTE.x, RED_DOLJE[i].x, uRedDolje);
    let y = lerp(SREDISTE.y, RED_DOLJE[i].y, uRedDolje);
    let R = lerp(SREDISTE.R * ulaz, 92, uRedDolje);
    x = lerp(x, RED_SREDINA[i].x, uRed);
    y = lerp(y, RED_SREDINA[i].y, uRed);
    R = lerp(R, 118, uRed);
    // spajanje: spirala prema središtu logotipa
    const kut = spoji * Math.PI * 1.2;
    const dx = x - 540;
    const dy = y - LOGO_Y;
    x = 540 + (dx * Math.cos(kut) - dy * Math.sin(kut)) * (1 - spoji);
    y = LOGO_Y + (dx * Math.sin(kut) + dy * Math.cos(kut)) * (1 - spoji);
    R = R * (1 - spoji * 0.92);
    const o = (f < FOKUS[i] ? 0 : Math.min(1, ulaz * 1.4)) * lerp(1, 0.6, uRedDolje * (1 - uRed)) * (1 - napredak(f, 1310, 1336));
    return { x, y, R, o, brzina: 1 + spoji * 4 };
  });

  // --- S5: bljesak i logo ---
  const bljesak = napredak(f, 1306, 1336, izlazak) * (1 - napredak(f, 1340, 1410));
  const crtanje = [napredak(f, 1332, 1392, kamera), napredak(f, 1366, 1410, kamera), napredak(f, 1392, 1428, kamera), napredak(f, 1404, 1440, kamera)];
  const olovka = 1 - napredak(f, 1436, 1456);
  const ikona = napredak(f, 1330, 1420, izlazak);
  const natpis = opruga(f, 1432, 48);
  const sjajLoga = napredak(f, 1420, 1480) * (1 - napredak(f, 1500, 1600) * 0.5);

  // --- S6: poziv ---
  const usluge = opruga(f, 1590, 44);
  const poziv = opruga(f, 1612, 48);
  const odsjaj = napredak(f, 1664, 1716, kamera);
  const kontaktP = opruga(f, 1640, 44);

  // natpisi struktura (fokus)
  const naslovi = TEKST.strukture.map((t, i) => (
    <React.Fragment key={i}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 318,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: '0.2em',
          color: BOJE.siva2,
          opacity: napredak(f, FOKUS[i] + 4, FOKUS[i] + 20) * (1 - napredak(f, FOKUS_KRAJ[i] - 16, FOKUS_KRAJ[i])),
        }}
      >
        0{i + 1} / 03
      </div>
      <Natpis redovi={[`*${t}*`]} ulaz={FOKUS[i] + 6} izlaz={FOKUS_KRAJ[i]} y={378} velicina={t.length > 18 ? 92 : 104} />
    </React.Fragment>
  ));

  // mali natpisi ispod struktura u redu
  const oznakeReda = napredak(f, 1236, 1252) * (1 - napredak(f, 1262, 1274));

  return (
    <AbsoluteFill>
      {f < 1345 ? (
        <svg width={W} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <StruktureDefs />
          {poze.map((p, i) => (
            <Struktura key={i} i={i} f={f} x={p.x} y={p.y} R={p.R} o={p.o} brzina={p.brzina} />
          ))}
        </svg>
      ) : null}

      {f < 1260 ? naslovi : null}
      {oznakeReda > 0
        ? TEKST.strukture.map((t, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: RED_SREDINA[i].x - 135,
                width: 270,
                top: 1170,
                textAlign: 'center',
                fontFamily: FONT,
                fontSize: 28,
                fontWeight: 500,
                lineHeight: 1.25,
                color: BOJE.svjetlo,
                opacity: oznakeReda,
                transform: `translateY(${(1 - oznakeReda) * 12}px)`,
              }}
            >
              {t}
            </div>
          ))
        : null}

      {/* bljesak spajanja */}
      {bljesak > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - 700,
            top: LOGO_Y - 700,
            width: 1400,
            height: 1400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(201,191,255,0.55) 12%, rgba(111,211,255,0.15) 32%, transparent 60%)',
            opacity: bljesak,
            transform: `scale(${0.3 + bljesak * 0.9})`,
          }}
        />
      ) : null}

      {/* logotip */}
      {f >= 1328 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 540 - 400,
              top: LOGO_Y - 400,
              width: 800,
              height: 800,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(155,140,255,0.28), rgba(111,211,255,0.06) 45%, transparent 70%)',
              opacity: sjajLoga,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 540 - IKONA_SIRINA / 2,
              top: LOGO_Y - (IKONA_SIRINA * 595) / 615 / 2,
              perspective: 1800,
            }}
          >
            <div style={{ transform: `rotateX(${(1 - ikona) * 22}deg) scale(${0.9 + 0.1 * ikona})` }}>
              <IkonaLogo sirina={IKONA_SIRINA} crtanje={crtanje} olovka={olovka} />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 540 - 260,
              top: 1052,
              overflow: 'hidden',
              padding: '4px 0',
            }}
          >
            <div style={{ transform: `translateY(${(1 - natpis) * 110}%)`, filter: natpis < 0.98 ? `blur(${(1 - natpis) * 10}px)` : undefined }}>
              <NatpisLogo sirina={520} />
            </div>
          </div>
        </>
      ) : null}

      <Natpis redovi={TEKST.s5} ulaz={1452} izlaz={1584} y={1236} velicina={66} tezina={500} razmak={4} />

      {/* S6: usluge, poziv, kontakt */}
      {f >= 1586 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 90,
              right: 90,
              top: 1222,
              textAlign: 'center',
              fontFamily: FONT,
              fontSize: 34,
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: BOJE.siva,
              opacity: usluge,
              transform: `translateY(${(1 - usluge) * 20}px)`,
            }}
          >
            {TEKST.usluge}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 1300,
              display: 'flex',
              justifyContent: 'center',
              opacity: poziv,
              transform: `translateY(${(1 - poziv) * 30}px) scale(${0.95 + 0.05 * poziv})`,
            }}
          >
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 18,
                padding: '32px 58px',
                borderRadius: 999,
                background: `linear-gradient(180deg, #ffffff, ${BOJE.svjetlo} 60%, #ddd3ff)`,
                color: '#0c0a14',
                fontFamily: FONT,
                fontSize: 44,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.4), 0 30px 90px -20px rgba(155,140,255,0.6)',
              }}
            >
              {TEKST.poziv} <span style={{ fontWeight: 400 }}>→</span>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(110deg, transparent ${odsjaj * 170 - 60}%, rgba(155,140,255,0.35) ${odsjaj * 170 - 45}%, transparent ${odsjaj * 170 - 30}%)`,
                }}
              />
            </div>
          </div>
          {kontakt ? (
            <div
              style={{
                position: 'absolute',
                left: 90,
                right: 90,
                top: 1440,
                textAlign: 'center',
                fontFamily: FONT,
                fontSize: 40,
                fontWeight: 500,
                backgroundImage: GRADIJENT_TEKSTA,
                WebkitBackgroundClip: 'text',
                color: 'transparent',
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
