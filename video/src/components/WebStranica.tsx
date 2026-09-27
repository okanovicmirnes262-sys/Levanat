import React from 'react';
import { BOJE, FONT } from '../tokens';
import { Ulaz } from './Ulaz';

// Realističan prikaz web stranice izmišljenog obrta („Vaš obrt”), složen u Levanatovom stilu.
// `u` je objekt s frameovima ulaska pojedinih dijelova (za scenu slaganja); bez njega sve stoji.

export type UlasciDesktop = Partial<Record<'nav' | 'naslov' | 'slika' | 'tekst' | 'gumb' | 'kartice', number>>;

const Luk: React.FC<{ w: number; h: number; ostro?: number }> = ({ w, h, ostro = 1 }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: `${w / 2}px ${w / 2}px 10px 10px`,
      overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(180deg, #d9cfbf 0%, #c9bda9 46%, #1f7a80 47%, #0e4b5c 80%, #0b2a3c 100%)',
      filter: ostro < 1 ? `blur(${(1 - ostro) * 14}px)` : undefined,
    }}
  >
    {/* sunce i odsjaj na moru */}
    <div
      style={{
        position: 'absolute',
        left: '58%',
        top: '28%',
        width: w * 0.16,
        height: w * 0.16,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fff6e4 0%, #f0dcb8 55%, transparent 72%)',
      }}
    />
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${46 + i * 3}%`,
          top: `${52 + i * 7}%`,
          width: `${22 - i * 4}%`,
          height: 3,
          borderRadius: 2,
          background: 'rgba(255, 240, 215, 0.55)',
        }}
      />
    ))}
    {/* kamena obala */}
    <div
      style={{
        position: 'absolute',
        left: '-10%',
        bottom: '-6%',
        width: '70%',
        height: '26%',
        borderRadius: '50% 60% 0 0',
        background: 'linear-gradient(180deg, #8c7f6c, #3a3a34)',
      }}
    />
  </div>
);

const Gumb: React.FC<{ tekst: string; velicina?: number; puni?: boolean }> = ({ tekst, velicina = 17, puni }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: `${velicina * 0.85}px ${velicina * 1.4}px`,
      background: BOJE.bronca,
      color: '#03101a',
      fontFamily: FONT.sans,
      fontWeight: 600,
      fontSize: velicina,
      borderRadius: 4,
      width: puni ? '100%' : undefined,
    }}
  >
    {tekst} <span style={{ fontWeight: 400 }}>→</span>
  </div>
);

const Oznaka: React.FC<{ children: React.ReactNode; velicina?: number }> = ({ children, velicina = 12 }) => (
  <div
    style={{
      fontFamily: FONT.sans,
      fontSize: velicina,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: BOJE.broncaSv,
    }}
  >
    {children}
  </div>
);

const Info: React.FC<{ naslov: string; tekst: string; velicina?: number }> = ({ naslov, tekst, velicina = 17 }) => (
  <div
    style={{
      flex: 1,
      padding: `${velicina * 0.9}px ${velicina}px`,
      border: `1px solid ${BOJE.rub}`,
      borderRadius: 8,
      background: 'rgba(237, 230, 218, 0.03)',
    }}
  >
    <Oznaka velicina={velicina * 0.62}>{naslov}</Oznaka>
    <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: velicina, color: BOJE.kamen }}>{tekst}</div>
  </div>
);

/** Desktop prikaz, sadržaj 860 × ~1000 px. */
export const WebDesktop: React.FC<{ u?: UlasciDesktop }> = ({ u = {} }) => (
  <div style={{ padding: '34px 40px', height: '100%', display: 'flex', flexDirection: 'column', gap: 44 }}>
    <Ulaz u={u.nav} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontFamily: FONT.serif, fontSize: 28, color: BOJE.kamen, fontVariationSettings: '"opsz" 48' }}>
        Vaš obrt
      </div>
      <div style={{ display: 'flex', gap: 30, alignItems: 'center', fontFamily: FONT.sans, fontSize: 16, color: BOJE.kamen2 }}>
        <span>Usluge</span>
        <span>Radovi</span>
        <span>O nama</span>
        <div style={{ padding: '10px 18px', border: `1px solid ${BOJE.bronca}`, color: BOJE.broncaSv, borderRadius: 4 }}>
          Kontakt
        </div>
      </div>
    </Ulaz>

    <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Ulaz u={u.naslov}>
          <Oznaka>Obrt · Dalmacija</Oznaka>
          <div
            style={{
              marginTop: 16,
              fontFamily: FONT.serif,
              fontSize: 60,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: BOJE.kamen,
              fontVariationSettings: '"opsz" 72',
            }}
          >
            Kvaliteta koja
            <br />
            se <i style={{ color: BOJE.broncaSv, fontWeight: 300 }}>vidi.</i>
          </div>
        </Ulaz>
        <Ulaz u={u.tekst} style={{ fontFamily: FONT.sans, fontSize: 19, lineHeight: 1.55, color: BOJE.kamen2 }}>
          Usluge, radno vrijeme i kontakt
          <br />
          jasno, na jednom mjestu.
        </Ulaz>
        <Ulaz u={u.gumb} style={{ display: 'flex', gap: 22, alignItems: 'center', marginTop: 6 }}>
          <Gumb tekst="Zatražite ponudu" />
          <span style={{ fontFamily: FONT.sans, fontSize: 17, color: BOJE.kamen, borderBottom: `1px solid ${BOJE.rubJaci}` }}>
            Naši radovi
          </span>
        </Ulaz>
      </div>
      <Ulaz u={u.slika} pomak={40}>
        <Luk w={330} h={430} />
      </Ulaz>
    </div>

    <Ulaz u={u.kartice} style={{ display: 'flex', gap: 16 }}>
      <Info naslov="Usluge" tekst="Sve na jednom mjestu" />
      <Info naslov="Radno vrijeme" tekst="Pon – sub" />
      <Info naslov="Kontakt" tekst="Jedan dodir do poziva" />
    </Ulaz>
  </div>
);

/** Mobilni prikaz, širina ~470 px; `skrol` pomiče sadržaj, `ostrina` izoštrava slike. */
export const WebMobitel: React.FC<{ skrol?: number; ostrina?: number }> = ({ skrol = 0, ostrina = 1 }) => (
  <div style={{ transform: `translateY(${-skrol}px)`, padding: '64px 26px 40px', display: 'flex', flexDirection: 'column', gap: 26 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontFamily: FONT.serif, fontSize: 26, color: BOJE.kamen }}>Vaš obrt</div>
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ width: 26, height: 2, background: BOJE.kamen }} />
        <div style={{ width: 26, height: 2, background: BOJE.kamen }} />
      </div>
    </div>
    <Luk w={418} h={330} ostro={ostrina} />
    <div>
      <Oznaka velicina={12}>Obrt · Dalmacija</Oznaka>
      <div
        style={{
          marginTop: 12,
          fontFamily: FONT.serif,
          fontSize: 46,
          lineHeight: 1.04,
          letterSpacing: '-0.02em',
          color: BOJE.kamen,
          fontVariationSettings: '"opsz" 72',
        }}
      >
        Kvaliteta koja se <i style={{ color: BOJE.broncaSv, fontWeight: 300 }}>vidi.</i>
      </div>
    </div>
    <div style={{ fontFamily: FONT.sans, fontSize: 18, lineHeight: 1.5, color: BOJE.kamen2 }}>
      Usluge, radno vrijeme i kontakt jasno, na jednom mjestu.
    </div>
    <Gumb tekst="Zatražite ponudu" puni velicina={18} />
    <div style={{ display: 'grid', gap: 12 }}>
      <Info naslov="Usluge" tekst="Sve na jednom mjestu" />
      <Info naslov="Radno vrijeme" tekst="Pon – sub" />
      <Info naslov="Kontakt" tekst="Jedan dodir do poziva" />
    </div>
    <Oznaka velicina={12}>Naši radovi</Oznaka>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {['#c9bda9', '#1f7a80', '#12384f', '#8c7f6c'].map((c, i) => (
        <div
          key={i}
          style={{
            height: 160,
            borderRadius: 8,
            background: `linear-gradient(${140 + i * 30}deg, ${c}, #0b2a3c)`,
            filter: ostrina < 1 ? `blur(${(1 - ostrina) * 12}px)` : undefined,
          }}
        />
      ))}
    </div>
    <Gumb tekst="Pozovite nas" puni velicina={18} />
  </div>
);
