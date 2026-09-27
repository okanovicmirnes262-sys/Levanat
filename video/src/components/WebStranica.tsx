import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FONT } from '../tokens';
import { Ulaz } from './Ulaz';

// Demo web stranica izmišljenog arhitektonskog studija „Aura Studio”, u kadru preglednika i mobitela.
// Tamna premium tema: mesh gradijent, apstraktni arhitektonski volumeni (SVG), staklena navigacija
// i kartice. Sve je vezano uz frame. Nema izmišljenih ocjena ni brojki; partneri su izmišljeni znakovi.
// `u` je objekt s frameovima ulaska pojedinih dijelova (za scenu slaganja); bez njega sve stoji.

export type UlasciDesktop = Partial<Record<'nav' | 'naslov' | 'slika' | 'tekst' | 'gumb' | 'povjerenje' | 'kartice', number>>;

// Paleta demo brenda (namjerno drukčija od Levanata: to je stranica klijenta)
const A = {
  pozadina: '#0a0b0f',
  povrsina: '#12141b',
  tekst: '#f5f2ec',
  tekst2: 'rgba(245, 242, 236, 0.64)',
  tekst3: 'rgba(245, 242, 236, 0.4)',
  rub: 'rgba(255, 255, 255, 0.1)',
  rubJaci: 'rgba(255, 255, 255, 0.18)',
  staklo: 'rgba(255, 255, 255, 0.06)',
  bakar: '#c98a5c',
  pijesak: '#ecd3ad',
  ponoc: '#1a1f3d',
  indigo: '#6c68f0',
  tirkiz: '#48b8b0',
} as const;

const GRADIJENT = `linear-gradient(100deg, ${A.pijesak} 0%, ${A.bakar} 55%, #b8724a 100%)`;

// ---------- Ikone u Lucide stilu (putanje prema Lucide, ISC licenca) ----------
const Ik: React.FC<{ d: string[]; v?: number; boja?: string; debljina?: number }> = ({ d, v = 22, boja = 'currentColor', debljina = 1.6 }) => (
  <svg viewBox="0 0 24 24" width={v} height={v} fill="none" stroke={boja} strokeWidth={debljina} strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);
const IK = {
  ravnalo: [
    'M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z',
    'm14.5 12.5 2-2',
    'm11.5 9.5 2-2',
    'm8.5 6.5 2-2',
    'm17.5 15.5 2-2',
  ],
  kocka: [
    'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
    'm3.3 7 8.7 5 8.7-5',
    'M12 22V12',
  ],
  sofa: [
    'M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3',
    'M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z',
    'M4 18v2',
    'M20 18v2',
  ],
  strelica: ['M7 7h10v10', 'M7 17 17 7'],
  poruka: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z'],
  izbornik: ['M4 7h16', 'M4 12h16', 'M4 17h10'],
  lokacija: ['M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6'],
  kalendar: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
};

// ---------- Vizuali ----------

/** Animirani mesh gradijent (mrlje se polako pomiču s frameom) s finom zrnatošću. */
const Mesh: React.FC<{ f: number; jacina?: number; style?: React.CSSProperties }> = ({ f, jacina = 1, style }) => {
  const t = f / 60;
  const m = (x: number, y: number, ax: number, ay: number, brzina: number, faza: number) =>
    `${(x + Math.sin(t * brzina + faza) * ax).toFixed(2)}% ${(y + Math.cos(t * brzina * 0.8 + faza) * ay).toFixed(2)}%`;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        maskImage: 'linear-gradient(180deg, black 55%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, black 55%, transparent 100%)',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          opacity: jacina,
          background: [
            `radial-gradient(38% 42% at ${m(78, 22, 6, 5, 0.35, 0)}, rgba(201, 138, 92, 0.55), transparent 70%)`,
            `radial-gradient(34% 40% at ${m(58, 8, 7, 4, 0.28, 2)}, rgba(236, 211, 173, 0.32), transparent 70%)`,
            `radial-gradient(44% 48% at ${m(96, 58, 5, 7, 0.22, 4)}, rgba(108, 104, 240, 0.42), transparent 72%)`,
            `radial-gradient(30% 34% at ${m(40, 40, 8, 6, 0.3, 1)}, rgba(72, 184, 176, 0.16), transparent 70%)`,
            `radial-gradient(60% 60% at ${m(20, 90, 4, 4, 0.2, 3)}, rgba(26, 31, 61, 0.9), transparent 75%)`,
          ].join(', '),
          filter: 'blur(24px) saturate(1.1)',
        }}
      />
      <Zrno />
    </div>
  );
};

const Zrno: React.FC<{ jacina?: number }> = ({ jacina = 0.07 }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: jacina, mixBlendMode: 'overlay' }}>
    <filter id="aura-zrno">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#aura-zrno)" />
  </svg>
);

/**
 * Apstraktni arhitektonski volumeni: visoki luk sa zalaskom svjetla, stepenaste ploče s osvijetljenim
 * gornjim plohama i tanki stupovi. `id` razdvaja SVG gradijente kad je vizual više puta u kadru.
 */
const Arhitektura: React.FC<{ id: string; f: number; w: number; h: number; varijanta?: number; ostro?: number }> = ({
  id,
  f,
  w,
  h,
  varijanta = 0,
  ostro = 1,
}) => {
  const svjetlo = 0.85 + Math.sin(f / 70 + varijanta) * 0.15;
  const nebo = [
    ['#2a2350', '#c98a5c', '#ecd3ad'],
    ['#10283a', '#48b8b0', '#d7efe9'],
    ['#221a2e', '#b86a58', '#f0c9a6'],
    ['#161a33', '#6c68f0', '#cfcdfb'],
  ][varijanta % 4];
  return (
    <svg
      viewBox="0 0 340 420"
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block', filter: ostro < 1 ? `blur(${(1 - ostro) * 14}px)` : undefined }}
    >
      <defs>
        <linearGradient id={`${id}-nebo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={nebo[0]} />
          <stop offset="0.62" stopColor={nebo[1]} />
          <stop offset="1" stopColor={nebo[2]} />
        </linearGradient>
        <radialGradient id={`${id}-sunce`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff7ea" stopOpacity={svjetlo} />
          <stop offset="0.4" stopColor={nebo[2]} stopOpacity={0.7 * svjetlo} />
          <stop offset="1" stopColor={nebo[2]} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-zid`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1c1e27" />
          <stop offset="1" stopColor="#0d0e13" />
        </linearGradient>
        <linearGradient id={`${id}-ploha`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={nebo[2]} stopOpacity="0.9" />
          <stop offset="1" stopColor={nebo[1]} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-lice`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2a33" />
          <stop offset="1" stopColor="#101117" />
        </linearGradient>
        <clipPath id={`${id}-luk`}>
          <path d="M92 400 V170 A78 78 0 0 1 248 170 V400 Z" />
        </clipPath>
      </defs>
      {/* zid i otvor luka */}
      <rect width="340" height="420" fill={`url(#${id}-zid)`} />
      <g clipPath={`url(#${id}-luk)`}>
        <rect width="340" height="420" fill={`url(#${id}-nebo)`} />
        <circle cx="170" cy={236 - varijanta * 6} r="92" fill={`url(#${id}-sunce)`} />
        <rect x="0" y="292" width="340" height="140" fill="#0c0d12" opacity="0.35" />
      </g>
      {/* dubina otvora */}
      <path d="M92 400 V170 A78 78 0 0 1 248 170 V400" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
      <path d="M104 400 V174 A66 66 0 0 1 236 174 V400" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* stepenaste ploče ispred luka */}
      {[0, 1, 2].map((i) => {
        const y = 322 + i * 30;
        const x0 = 40 - i * 22;
        const x1 = 300 + i * 22;
        return (
          <g key={i}>
            <path d={`M${x0 + 26} ${y} H${x1 - 10} L${x1} ${y + 12} H${x0 + 14} Z`} fill={`url(#${id}-ploha)`} opacity={0.75 - i * 0.18} />
            <rect x={x0 + 14} y={y + 12} width={x1 - x0 - 14} height="18" fill={`url(#${id}-lice)`} />
          </g>
        );
      })}
      {/* tanki stupovi i sjena */}
      {[64, 276].map((x) => (
        <g key={x}>
          <rect x={x} y="120" width="6" height="202" fill="#e9e3d8" opacity="0.14" />
          <rect x={x + 6} y="120" width="2" height="202" fill="#000" opacity="0.4" />
        </g>
      ))}
      {/* odsjaj svjetla na podu */}
      <ellipse cx="170" cy="336" rx="70" ry="6" fill={nebo[2]} opacity={0.35 * svjetlo} />
    </svg>
  );
};

// ---------- Dijelovi sučelja ----------

const LogoAura: React.FC<{ v?: number }> = ({ v = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 * v }}>
    <svg viewBox="0 0 28 28" width={28 * v} height={28 * v} fill="none">
      <defs>
        <linearGradient id="aura-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={A.pijesak} />
          <stop offset="1" stopColor={A.bakar} />
        </linearGradient>
      </defs>
      <path d="M4 25V13a10 10 0 0 1 20 0v12" stroke="url(#aura-logo)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 25v-9a4 4 0 0 1 8 0v9" stroke={A.tekst} strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <div style={{ fontFamily: FONT.serif, fontSize: 23 * v, color: A.tekst, letterSpacing: '-0.01em', lineHeight: 1 }}>
      Aura <span style={{ fontFamily: FONT.sans, fontSize: 12 * v, fontWeight: 500, letterSpacing: '0.28em', color: A.tekst2 }}>STUDIO</span>
    </div>
  </div>
);

const Staklo: React.CSSProperties = {
  background: A.staklo,
  border: `1px solid ${A.rub}`,
  backdropFilter: 'blur(14px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
};

const GumbPrimarni: React.FC<{ tekst: string; v?: number; puni?: boolean }> = ({ tekst, v = 16, puni }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: `${v * 0.95}px ${v * 1.5}px`,
      borderRadius: 999,
      background: GRADIJENT,
      color: '#1a1109',
      fontFamily: FONT.sans,
      fontWeight: 600,
      fontSize: v,
      letterSpacing: '-0.005em',
      whiteSpace: 'nowrap',
      width: puni ? '100%' : undefined,
      boxSizing: 'border-box',
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(90,50,20,0.35), 0 10px 30px -8px rgba(201,138,92,0.65), 0 0 0 1px rgba(236,211,173,0.35)`,
    }}
  >
    {tekst} <Ik d={IK.strelica} v={v * 1.05} debljina={2} />
  </div>
);

const GumbStaklo: React.FC<{ tekst: string; v?: number; puni?: boolean }> = ({ tekst, v = 16, puni }) => (
  <div
    style={{
      ...Staklo,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: `${v * 0.95}px ${v * 1.4}px`,
      borderRadius: 999,
      color: A.tekst,
      fontFamily: FONT.sans,
      fontWeight: 500,
      fontSize: v,
      whiteSpace: 'nowrap',
      width: puni ? '100%' : undefined,
      boxSizing: 'border-box',
    }}
  >
    {tekst}
  </div>
);

const Pilula: React.FC<{ v?: number }> = ({ v = 13 }) => (
  <div
    style={{
      ...Staklo,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: `${v * 0.55}px ${v}px ${v * 0.55}px ${v * 0.75}px`,
      borderRadius: 999,
      fontFamily: FONT.sans,
      fontSize: v,
      fontWeight: 500,
      color: A.tekst2,
      alignSelf: 'flex-start',
    }}
  >
    <span style={{ width: v * 0.5, height: v * 0.5, borderRadius: '50%', background: A.tirkiz, boxShadow: `0 0 10px ${A.tirkiz}` }} />
    Arhitektura · Interijeri · Split
  </div>
);

const Naslov: React.FC<{ v: number }> = ({ v }) => (
  <div
    style={{
      fontFamily: FONT.sans,
      fontSize: v,
      fontWeight: 300,
      lineHeight: 1.04,
      letterSpacing: '-0.045em',
      color: A.tekst,
    }}
  >
    Prostori koji pričaju{' '}
    <span
      style={{
        fontFamily: FONT.serif,
        fontStyle: 'italic',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        backgroundImage: GRADIJENT,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        paddingRight: '0.06em',
      }}
    >
      Vašu
    </span>{' '}
    priču.
  </div>
);

const PODNASLOV = 'Projektiramo kuće, apartmane i poslovne prostore od prve skice do ključa u ruke, s 3D prikazom prije gradnje.';

/** Izmišljeni znakovi partnera, svaki u svom tipografskom stilu (bez brojki i ocjena). */
const Partneri: React.FC<{ v?: number; stupci?: number }> = ({ v = 1, stupci }) => {
  const znakovi: [string, React.CSSProperties][] = [
    ['NORDA', { fontFamily: FONT.sans, fontWeight: 700, letterSpacing: '0.32em', fontSize: 14 * v }],
    ['Kamenolom', { fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 20 * v }],
    ['VELA GROUP', { fontFamily: FONT.sans, fontWeight: 300, letterSpacing: '0.22em', fontSize: 14 * v }],
    ['Atrij', { fontFamily: FONT.serif, fontWeight: 600, fontSize: 21 * v, letterSpacing: '-0.02em' }],
    ['obala&co', { fontFamily: FONT.sans, fontWeight: 800, fontSize: 17 * v, letterSpacing: '-0.04em' }],
  ];
  return (
    <div
      style={{
        display: stupci ? 'grid' : 'flex',
        gridTemplateColumns: stupci ? `repeat(${stupci}, auto)` : undefined,
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: stupci ? `${14 * v}px ${18 * v}px` : 0,
        color: A.tekst,
        opacity: 0.5,
      }}
    >
      {znakovi.map(([t, s]) => (
        <span key={t} style={{ ...s, lineHeight: 1, whiteSpace: 'nowrap' }}>
          {t}
        </span>
      ))}
    </div>
  );
};

const USLUGE = [
  { ikona: IK.ravnalo, naslov: 'Idejno rješenje', tekst: 'Tlocrti i koncept prilagođeni parceli i načinu života.', boja: A.pijesak },
  { ikona: IK.kocka, naslov: '3D vizualizacija', tekst: 'Prošećite prostorom prije nego što krene gradnja.', boja: A.indigo },
  { ikona: IK.sofa, naslov: 'Interijer ključ u ruke', tekst: 'Materijali, rasvjeta i namještaj na jednom mjestu.', boja: A.tirkiz },
];

const Kartica: React.FC<{ u: (typeof USLUGE)[number]; aktivna?: boolean; v?: number; red?: boolean }> = ({ u, aktivna, v = 1, red }) => (
  <div
    style={{
      position: 'relative',
      flex: 1,
      display: 'flex',
      flexDirection: red ? 'row' : 'column',
      alignItems: red ? 'center' : 'stretch',
      gap: 16 * v,
      padding: `${22 * v}px ${20 * v}px`,
      borderRadius: 20 * v,
      background: aktivna
        ? 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))'
        : 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))',
      border: `1px solid ${aktivna ? 'rgba(236,211,173,0.38)' : A.rub}`,
      boxShadow: aktivna
        ? '0 30px 60px -24px rgba(0,0,0,0.8), 0 0 40px -12px rgba(201,138,92,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'
        : '0 20px 40px -24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
      transform: aktivna ? `translateY(${-8 * v}px)` : undefined,
    }}
  >
    <div
      style={{
        flex: 'none',
        width: 46 * v,
        height: 46 * v,
        borderRadius: 13 * v,
        display: 'grid',
        placeItems: 'center',
        color: u.boja,
        background: `linear-gradient(145deg, ${u.boja}33, ${u.boja}0d)`,
        border: `1px solid ${u.boja}40`,
      }}
    >
      <Ik d={u.ikona} v={22 * v} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontFamily: FONT.sans, fontSize: 17 * v, fontWeight: 600, letterSpacing: '-0.01em', color: A.tekst }}>{u.naslov}</div>
        <span style={{ color: aktivna ? A.pijesak : A.tekst3, display: 'flex' }}>
          <Ik d={IK.strelica} v={17 * v} />
        </span>
      </div>
      <div style={{ marginTop: 6 * v, fontFamily: FONT.sans, fontSize: 14 * v, lineHeight: 1.45, color: A.tekst2 }}>{u.tekst}</div>
    </div>
  </div>
);

/** Plutajući gumb AI asistenta u kutu (iz njega se u S4 „otvara” chat). */
const GumbAsistent: React.FC<{ f: number; v?: number; style?: React.CSSProperties }> = ({ f, v = 1, style }) => {
  const puls = (Math.sin(f / 18) + 1) / 2;
  return (
    <div style={{ position: 'absolute', ...style }}>
      <div
        style={{
          position: 'absolute',
          inset: -6 * v,
          borderRadius: '50%',
          border: `1px solid rgba(236,211,173,${0.35 * (1 - puls)})`,
          transform: `scale(${1 + puls * 0.25})`,
        }}
      />
      <div
        style={{
          width: 58 * v,
          height: 58 * v,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: GRADIJENT,
          color: '#1a1109',
          boxShadow: '0 14px 30px -8px rgba(201,138,92,0.7), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        <Ik d={IK.poruka} v={24 * v} debljina={1.9} />
      </div>
    </div>
  );
};

// ---------- Desktop ----------

/** Desktop prikaz, sadržaj 860 × ~1008 px. */
export const WebDesktop: React.FC<{ u?: UlasciDesktop }> = ({ u = {} }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: A.pozadina }}>
      <Mesh f={f} style={{ bottom: '28%' }} />
      {/* fina mreža nacrta, izblijedi prema dolje */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(180deg, black 0%, transparent 62%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 62%)',
        }}
      />

      {/* plutajuća navigacija */}
      <Ulaz
        u={u.nav}
        style={{
          ...Staklo,
          position: 'absolute',
          left: 24,
          right: 24,
          top: 20,
          height: 60,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px 0 22px',
          zIndex: 3,
        }}
      >
        <LogoAura />
        <div style={{ display: 'flex', gap: 30, fontFamily: FONT.sans, fontSize: 15, color: A.tekst2 }}>
          <span style={{ color: A.tekst }}>Projekti</span>
          <span>Usluge</span>
          <span>Studio</span>
          <span>Kontakt</span>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 18px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            color: '#101117',
            fontFamily: FONT.sans,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <Ik d={IK.kalendar} v={16} debljina={1.9} /> Konzultacije
        </div>
      </Ulaz>

      <div style={{ position: 'relative', padding: '122px 40px 0', display: 'flex', flexDirection: 'column', gap: 38 }}>
        {/* hero */}
        <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Ulaz u={u.naslov} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Pilula />
              <Naslov v={58} />
            </Ulaz>
            <Ulaz u={u.tekst} style={{ fontFamily: FONT.sans, fontSize: 17, lineHeight: 1.6, color: A.tekst2, maxWidth: 400 }}>
              {PODNASLOV}
            </Ulaz>
            <Ulaz u={u.gumb} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
              <GumbPrimarni tekst="Zakažite konzultacije" v={15} />
              <GumbStaklo tekst="Projekti" v={15} />
            </Ulaz>
          </div>
          <Ulaz u={u.slika} pomak={40}>
            <div
              style={{
                position: 'relative',
                width: 310,
                height: 430,
                borderRadius: 28,
                overflow: 'hidden',
                border: `1px solid ${A.rubJaci}`,
                boxShadow: '0 50px 90px -30px rgba(0,0,0,0.9), 0 0 60px -20px rgba(201,138,92,0.35)',
              }}
            >
              <Arhitektura id="d-hero" f={f} w={310} h={430} />
              {/* staklena oznaka projekta na slici */}
              <div
                style={{
                  ...Staklo,
                  position: 'absolute',
                  left: 14,
                  right: 14,
                  bottom: 14,
                  borderRadius: 16,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(12,13,18,0.45)',
                }}
              >
                <div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 14, fontWeight: 600, color: A.tekst }}>Kuća Luk, Primošten</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3, fontFamily: FONT.sans, fontSize: 12, color: A.tekst2 }}>
                    <Ik d={IK.lokacija} v={13} /> Obiteljska kuća · u izvedbi
                  </div>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.12)', color: A.tekst }}>
                  <Ik d={IK.strelica} v={16} />
                </div>
              </div>
            </div>
          </Ulaz>
        </div>

        {/* povjerenje, bez brojki */}
        <Ulaz u={u.povjerenje ?? u.gumb} style={{ display: 'flex', alignItems: 'center', gap: 28, paddingTop: 4 }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: A.tekst3, whiteSpace: 'nowrap' }}>
            Surađujemo s
          </div>
          <div style={{ flex: 1 }}>
            <Partneri />
          </div>
        </Ulaz>

        {/* kartice usluga */}
        <Ulaz u={u.kartice} style={{ display: 'flex', gap: 14, alignItems: 'stretch', paddingTop: 6 }}>
          {USLUGE.map((x, i) => (
            <Kartica key={x.naslov} u={x} aktivna={i === 1} />
          ))}
        </Ulaz>

        <Ulaz u={u.kartice === undefined ? undefined : u.kartice + 20} style={{ display: 'grid', gap: 16, paddingTop: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 30, color: A.tekst, letterSpacing: '-0.01em' }}>Odabrani projekti</div>
            <div style={{ fontFamily: FONT.sans, fontSize: 14, color: A.tekst2, paddingRight: 90 }}>Svi projekti →</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {['Villa Mira', 'Atelier Krka', 'Kuća Kamen'].map((ime, i) => (
              <div key={ime} style={{ height: 200, borderRadius: 20, overflow: 'hidden', border: `1px solid ${A.rub}` }}>
                <Arhitektura id={`d-p${i}`} f={f} w={250} h={200} varijanta={i + 1} />
              </div>
            ))}
          </div>
        </Ulaz>
      </div>

      <GumbAsistent f={f} style={{ right: 24, bottom: 22 }} />
    </div>
  );
};

// ---------- Mobitel ----------

/**
 * Mobilni prikaz (500 × 1010, vertikalno). `skrol` pomiče sadržaj, `ostrina` izoštrava slike
 * (efekt brzog učitavanja). Donja traka i gumb asistenta stoje fiksno.
 */
export const WebMobitel: React.FC<{ skrol?: number; ostrina?: number; visina?: number }> = ({ skrol = 0, ostrina = 1, visina = 1010 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'relative', height: visina, overflow: 'hidden', background: A.pozadina }}>
      <div style={{ transform: `translateY(${-skrol}px)` }}>
        <Mesh f={f} style={{ height: 900 }} />
        <div style={{ position: 'relative', padding: '70px 22px 150px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* nav pill */}
          <div
            style={{
              ...Staklo,
              height: 58,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px 0 18px',
            }}
          >
            <LogoAura v={1} />
            <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.08)', color: A.tekst }}>
              <Ik d={IK.izbornik} v={20} />
            </div>
          </div>

          {/* hero kartica s vizualom */}
          <div
            style={{
              position: 'relative',
              height: 330,
              borderRadius: 28,
              overflow: 'hidden',
              border: `1px solid ${A.rubJaci}`,
              boxShadow: '0 40px 80px -30px rgba(0,0,0,0.9)',
            }}
          >
            <Arhitektura id="m-hero" f={f} w={456} h={330} ostro={ostrina} />
            <div style={{ position: 'absolute', left: 14, top: 14 }}>
              <Pilula v={12} />
            </div>
          </div>

          <Naslov v={46} />
          <div style={{ fontFamily: FONT.sans, fontSize: 17, lineHeight: 1.55, color: A.tekst2 }}>{PODNASLOV}</div>
          <div style={{ display: 'grid', gap: 10 }}>
            <GumbPrimarni tekst="Zakažite konzultacije" v={17} puni />
            <GumbStaklo tekst="Pogledajte projekte" v={17} puni />
          </div>

          <div style={{ display: 'grid', gap: 14, padding: '10px 0 4px' }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: A.tekst3 }}>
              Surađujemo s
            </div>
            <Partneri v={0.95} stupci={3} />
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {USLUGE.map((x, i) => (
              <Kartica key={x.naslov} u={x} aktivna={i === 1} red v={0.95} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 28, color: A.tekst, letterSpacing: '-0.01em' }}>Odabrani projekti</div>
            <div style={{ fontFamily: FONT.sans, fontSize: 14, color: A.tekst2 }}>Svi →</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {['Villa Mira', 'Atelier Krka', 'Kuća Kamen', 'Loft Varoš'].map((ime, i) => (
              <div key={ime} style={{ position: 'relative', height: 200, borderRadius: 20, overflow: 'hidden', border: `1px solid ${A.rub}` }}>
                <Arhitektura id={`m-p${i}`} f={f} w={222} h={200} varijanta={i + 1} ostro={ostrina} />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '26px 12px 10px',
                    background: 'linear-gradient(180deg, transparent, rgba(8,9,12,0.85))',
                    fontFamily: FONT.sans,
                    fontSize: 14,
                    fontWeight: 600,
                    color: A.tekst,
                  }}
                >
                  {ime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* fiksna donja traka i asistent */}
      <div
        style={{
          ...Staklo,
          position: 'absolute',
          left: 16,
          right: 92,
          bottom: 26,
          height: 60,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 0 20px',
          background: 'rgba(18,20,27,0.72)',
        }}
      >
        <div style={{ fontFamily: FONT.sans, fontSize: 15, color: A.tekst2 }}>Besplatne konzultacije</div>
        <div style={{ padding: '11px 16px', borderRadius: 999, background: GRADIJENT, fontFamily: FONT.sans, fontSize: 14, fontWeight: 600, color: '#1a1109' }}>
          Termin
        </div>
      </div>
      <GumbAsistent f={f} v={1.03} style={{ right: 18, bottom: 26 }} />
    </div>
  );
};
