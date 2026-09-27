import React from 'react';
import { ikosaedar, projiciraj, rng, rotX, rotY, rotZ, type V3 } from '../lib/3d';
import { BOJE } from '../tokens';

// Tri svjetlosne strukture: moderan dizajn (ikosaedar), AI automatizacija (prsten čestica u
// orbiti oko jezgre) i direktna komunikacija (dva čvora povezana valovima iz logotipa).
// Sve se crtaju u SVG-u; `f` je frame, (cx, cy, R) položaj i veličina, `o` prozirnost.

type Props = { f: number; cx: number; cy: number; R: number; o?: number; brzina?: number };

const ICO = ikosaedar();

export const Ikosaedar: React.FC<Props> = ({ f, cx, cy, R, o = 1, brzina = 1 }) => {
  if (R < 1 || o <= 0) return null;
  const a = f * 0.012 * brzina;
  const tocke = (skala: number, smjer: number) =>
    ICO.v.map((v) => {
      const q = rotX(rotY(rotZ(v, 0.3), a * smjer), 0.5 + a * 0.4 * smjer);
      return projiciraj([q[0] * R * skala, q[1] * R * skala, q[2] * R * skala], cx, cy, 1400, 1400);
    });
  const vanjske = tocke(1, 1);
  const unutarnje = tocke(0.48, -1.4);
  return (
    <g opacity={o}>
      <circle cx={cx} cy={cy} r={R * 1.35} fill="url(#sjaj-str)" opacity={0.55} />
      {ICO.e.map(([i, j], k) => (
        <line key={`u${k}`} x1={unutarnje[i].x} y1={unutarnje[i].y} x2={unutarnje[j].x} y2={unutarnje[j].y} stroke={BOJE.plava} strokeWidth={1.2} opacity={0.45} />
      ))}
      {ICO.e.map(([i, j], k) => {
        const dub = 0.35 + 0.65 * Math.min(1, Math.max(0, 1.5 - (vanjske[i].z + vanjske[j].z) / 2 / 1400));
        return <line key={`v${k}`} x1={vanjske[i].x} y1={vanjske[i].y} x2={vanjske[j].x} y2={vanjske[j].y} stroke={BOJE.svjetlo} strokeWidth={1.8} opacity={dub} />;
      })}
      {vanjske.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={Math.max(2, R * 0.022)} fill="#fff" style={{ filter: 'drop-shadow(0 0 6px rgba(155,140,255,0.9))' }} />
      ))}
    </g>
  );
};

const rr = rng(8);
const PRSTEN = Array.from({ length: 150 }, () => ({ a: rr() * Math.PI * 2, b: rr() * Math.PI * 2, v: 0.8 + rr() * 0.4 }));

export const PrstenCestica: React.FC<Props> = ({ f, cx, cy, R, o = 1, brzina = 1 }) => {
  if (R < 1 || o <= 0) return null;
  const pts = PRSTEN.map((c) => {
    const a = c.a + f * 0.02 * c.v * brzina;
    const mala = R * 0.14;
    const p: V3 = [Math.cos(a) * (R + Math.cos(c.b) * mala), Math.sin(c.b) * mala, Math.sin(a) * (R + Math.cos(c.b) * mala)];
    const q = rotZ(rotX(p, 1.12), -0.35);
    return projiciraj(q, cx, cy, 1400, 1400);
  }).sort((x, y) => y.z - x.z);
  const puls = 1 + 0.08 * Math.sin(f / 8);
  return (
    <g opacity={o}>
      <circle cx={cx} cy={cy} r={R * 1.3} fill="url(#sjaj-str)" opacity={0.5} />
      <circle cx={cx} cy={cy} r={R * 0.2 * puls} fill="url(#jezgra)" />
      <circle cx={cx} cy={cy} r={R * 0.075 * puls} fill="#fff" />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={Math.max(1, R * 0.012 * p.s + 1)}
          fill={i % 4 === 0 ? BOJE.plava : BOJE.svjetlo}
          opacity={Math.min(1, Math.max(0.15, 1.6 - p.z / 1400))}
        />
      ))}
    </g>
  );
};

export const ValVeza: React.FC<Props> = ({ f, cx, cy, R, o = 1, brzina = 1 }) => {
  if (R < 1 || o <= 0) return null;
  const x1 = cx - R * 0.95;
  const x2 = cx + R * 0.95;
  const val = (pomakY: number, amp: number, faza: number) => {
    const n = 48;
    const tocke: string[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = x1 + (x2 - x1) * t;
      const omot = Math.sin(t * Math.PI); // valovi se smire uz čvorove
      const y = cy + pomakY + Math.sin(t * Math.PI * 3 - f * 0.09 * brzina + faza) * amp * omot;
      tocke.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return tocke.join(' ');
  };
  // impulsi putuju u oba smjera (upit i odgovor)
  const t1 = ((f * 0.012 * brzina) % 1 + 1) % 1;
  const t2 = 1 - (((f * 0.012 * brzina + 0.5) % 1) + 1) % 1;
  const imp = (t: number, pomakY: number, amp: number, faza: number) => {
    const x = x1 + (x2 - x1) * t;
    const y = cy + pomakY + Math.sin(t * Math.PI * 3 - f * 0.09 * brzina + faza) * amp * Math.sin(t * Math.PI);
    return <circle cx={x} cy={y} r={R * 0.035} fill="#fff" style={{ filter: 'drop-shadow(0 0 10px rgba(111,211,255,1))' }} />;
  };
  const cvor = (x: number) => (
    <>
      <circle cx={x} cy={cy} r={R * 0.32} fill="url(#sjaj-str)" opacity={0.8} />
      <circle cx={x} cy={cy} r={R * 0.14} fill="none" stroke={BOJE.svjetlo} strokeWidth={Math.max(1.5, R * 0.018)} />
      <circle cx={x} cy={cy} r={R * 0.06} fill="#fff" />
    </>
  );
  return (
    <g opacity={o}>
      <polyline points={val(-R * 0.06, R * 0.14, 0)} fill="none" stroke={BOJE.svjetlo} strokeWidth={Math.max(1.5, R * 0.03)} strokeLinecap="round" />
      <polyline points={val(R * 0.16, R * 0.1, 0.9)} fill="none" stroke={BOJE.siva} strokeWidth={Math.max(1.2, R * 0.022)} strokeLinecap="round" opacity={0.7} />
      {imp(t1, -R * 0.06, R * 0.14, 0)}
      {imp(t2, R * 0.16, R * 0.1, 0.9)}
      {cvor(x1)}
      {cvor(x2)}
    </g>
  );
};

/** Zajednički gradijenti za strukture (umetnuti jednom u svaki SVG sa strukturama). */
export const StruktureDefs: React.FC = () => (
  <defs>
    <radialGradient id="sjaj-str">
      <stop offset="0" stopColor={BOJE.ljubicasta} stopOpacity={0.4} />
      <stop offset="0.5" stopColor={BOJE.plava} stopOpacity={0.08} />
      <stop offset="1" stopColor={BOJE.plava} stopOpacity={0} />
    </radialGradient>
    <radialGradient id="jezgra">
      <stop offset="0" stopColor="#fff" stopOpacity={1} />
      <stop offset="0.4" stopColor={BOJE.ljubicasta} stopOpacity={0.7} />
      <stop offset="1" stopColor={BOJE.ljubicasta} stopOpacity={0} />
    </radialGradient>
  </defs>
);
