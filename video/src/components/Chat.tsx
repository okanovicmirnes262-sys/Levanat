import React from 'react';
import { useCurrentFrame } from 'remotion';
import { opruga } from '../lib/anim';
import { RAZGOVOR } from '../tekstovi';
import { BOJE, FONT } from '../tokens';

/** Tri točkice „tipka…”, vođene frameom (bez CSS animacija). */
const Tipka: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ display: 'flex', gap: 8, padding: '22px 26px' }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: 11,
          height: 11,
          borderRadius: '50%',
          background: BOJE.kamen2,
          opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f / 60) * Math.PI * 3 - i * 0.9)),
        }}
      />
    ))}
  </div>
);

/**
 * Chatbot izmišljenog obrta. `poruke` su frameovi pojavljivanja svake poruke iz RAZGOVOR,
 * a `tipka` intervali [od, do] u kojima asistent „piše”.
 */
export const Chat: React.FC<{ poruke: number[]; tipka: [number, number][]; cip: number }> = ({ poruke, tipka, cip }) => {
  const f = useCurrentFrame();
  const tipkaSad = tipka.find(([a, b]) => f >= a && f < b);
  const cipP = opruga(f, cip, 36);

  return (
    <div
      style={{
        width: 720,
        borderRadius: 34,
        background: 'linear-gradient(180deg, rgba(20, 52, 72, 0.92), rgba(8, 28, 40, 0.94))',
        border: `1px solid ${BOJE.rubJaci}`,
        boxShadow: '0 60px 120px -40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      {/* zaglavlje */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '26px 30px',
          borderBottom: `1px solid ${BOJE.rub}`,
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${BOJE.broncaSv}, ${BOJE.bronca})`,
            display: 'grid',
            placeItems: 'center',
            fontFamily: FONT.serif,
            fontSize: 26,
            color: '#03101a',
          }}
        >
          A
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 27, fontWeight: 600, color: BOJE.kamen }}>Asistent · Aura Studio</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 21, color: BOJE.kamen2 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: BOJE.tirkiz }} /> Odgovara odmah
          </div>
        </div>
        <div
          style={{
            padding: '8px 14px',
            border: `1px solid ${BOJE.rub}`,
            borderRadius: 999,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: BOJE.kamen2,
          }}
        >
          Primjer razgovora
        </div>
      </div>

      {/* poruke */}
      <div style={{ padding: '30px 30px 16px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: 560 }}>
        {RAZGOVOR.map((m, i) => {
          const p = opruga(f, poruke[i], 34);
          if (f < poruke[i]) return null;
          const kupac = m.tko === 'kupac';
          return (
            <div
              key={i}
              style={{
                alignSelf: kupac ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                padding: '20px 26px',
                borderRadius: kupac ? '26px 26px 8px 26px' : '26px 26px 26px 8px',
                background: kupac ? 'rgba(216, 185, 138, 0.18)' : 'rgba(237, 230, 218, 0.08)',
                border: `1px solid ${kupac ? 'rgba(216, 185, 138, 0.35)' : BOJE.rub}`,
                color: BOJE.kamen,
                fontSize: 29,
                lineHeight: 1.38,
                opacity: p,
                transform: `translateY(${(1 - p) * 22}px) scale(${0.96 + 0.04 * p})`,
                transformOrigin: kupac ? 'right bottom' : 'left bottom',
              }}
            >
              {m.tekst}
            </div>
          );
        })}
        {tipkaSad ? (
          <div
            style={{
              alignSelf: 'flex-start',
              borderRadius: '26px 26px 26px 8px',
              background: 'rgba(237, 230, 218, 0.08)',
              border: `1px solid ${BOJE.rub}`,
            }}
          >
            <Tipka f={f} />
          </div>
        ) : null}
        {f >= cip ? (
          <div
            style={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              gap: 10,
              padding: '16px 24px',
              borderRadius: 999,
              background: BOJE.bronca,
              color: '#03101a',
              fontSize: 26,
              fontWeight: 600,
              opacity: cipP,
              transform: `translateY(${(1 - cipP) * 16}px)`,
            }}
          >
            Ostavi kontakt <span style={{ fontWeight: 400 }}>→</span>
          </div>
        ) : null}
      </div>

      {/* polje za unos */}
      <div
        style={{
          margin: '0 24px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px',
          borderRadius: 999,
          border: `1px solid ${BOJE.rub}`,
          color: BOJE.kamen3,
          fontSize: 24,
        }}
      >
        Napišite poruku…
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: BOJE.stakloJace, display: 'grid', placeItems: 'center', color: BOJE.kamen }}>
          ↑
        </div>
      </div>
    </div>
  );
};
