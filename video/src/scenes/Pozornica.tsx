import { CameraMotionBlur } from '@remotion/motion-blur';
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Chat } from '../components/Chat';
import { Natpis } from '../components/Natpis';
import { SvjetlosnaLinija } from '../components/SvjetlosnaLinija';
import { WebDesktop, WebMobitel } from '../components/WebStranica';
import { clamp, izlazak, kamera, lerp, napredak, odlazak, opruga } from '../lib/anim';
import { TEKST } from '../tekstovi';
import { BOJE, FONT, SCENA } from '../tokens';

// Scene 1–4 u jednom neprekinutom kadru (0–960):
// kartica → prazno platno → web stranica → mobitel → chatbot.

const CX = 540;
const CY = 1090; // središte objekta (ispod natpisa gore)

/** Kadar s motion blurom samo u kratkim, brzim prijelazima (štedi vrijeme rendera). */
const Zamuci: React.FC<{ prozori: [number, number][]; children: React.ReactNode }> = ({ prozori, children }) => {
  const f = useCurrentFrame();
  const u = prozori.some(([a, b]) => f >= a && f < b);
  if (!u) return <>{children}</>;
  return (
    <CameraMotionBlur samples={6} shutterAngle={200}>
      {children}
    </CameraMotionBlur>
  );
};

const Objekt: React.FC = () => {
  const f = useCurrentFrame();

  // --- S1: svjetlosna linija otkriva karticu, kamera se približava ---
  const linija = napredak(f, 4, 46);
  const otkrij = napredak(f, 30, 92); // kartica raste iz linije
  const priblizi = napredak(f, 118, 188, kamera);

  // --- S3: desktop → mobitel ---
  const morph = napredak(f, SCENA.dizajn[0] + 8, SCENA.dizajn[0] + 84, kamera);
  const mobitelSadrzaj = napredak(f, SCENA.dizajn[0] + 30, SCENA.dizajn[0] + 70);
  const okvirMobitela = napredak(f, SCENA.dizajn[0] + 50, SCENA.dizajn[0] + 96);
  const skrol = lerp(0, 600, napredak(f, SCENA.dizajn[0] + 110, SCENA.dizajn[0] + 226, kamera));
  // „brzo učitavanje”: tanka traka pri vrhu i slike koje se odmah izoštre
  const ucitaj = napredak(f, 556, 586, izlazak);
  const ostrina = f < 552 ? 1 : napredak(f, 552, 578);

  // --- S4: mobitel se okrene u prostoru i makne ulijevo ---
  const okret = napredak(f, SCENA.chat[0], SCENA.chat[0] + 64, kamera);

  // --- izlazak cijelog objekta prema S5 ---
  const van = napredak(f, 934, 962, odlazak);

  // Dimenzije: kartica (S1) → preglednik (S2) → mobitel (S3/S4)
  const kartica = { w: 600, h: 740 };
  const preglednik = { w: 860, h: 1060 };
  const mobitel = { w: 500, h: 1010 };
  const w = lerp(lerp(kartica.w, preglednik.w, priblizi), mobitel.w, morph);
  const h = lerp(lerp(kartica.h, preglednik.h, priblizi), mobitel.h, morph);
  const radijus = lerp(lerp(34, 22, priblizi), 72, morph);

  // 3D poza: kartica nagnuta, preglednik ravno, mobitel se u S4 okrene
  const rotX = lerp(16, 0, priblizi) + Math.sin(f / 50) * (1 - priblizi) * 1.2;
  const rotY = lerp(-18, 0, priblizi) + okret * 26;
  const pomakX = okret * -170;
  const pomakY = okret * 40;
  const skala = (1 - okret * 0.14) * lerp(0.92, 1, otkrij) * (1 - van * 0.08);

  const platno = napredak(f, 170, 206); // kartica postaje prazno platno preglednika
  const sadrzajDesktop = 1 - mobitelSadrzaj;

  return (
    <AbsoluteFill style={{ perspective: 2400, opacity: 1 - van }}>
      {/* svjetlosna linija u S1: prelazi ekran pa se povuče u rub kartice */}
      <SvjetlosnaLinija
        y={CY}
        duljina={linija}
        jacina={1 - napredak(f, 70, 110)}
        sirina={1000}
      />

      <div
        style={{
          position: 'absolute',
          left: CX - w / 2,
          top: CY - h / 2,
          width: w,
          height: h,
          transform: `translate(${pomakX}px, ${pomakY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${skala})`,
          transformStyle: 'preserve-3d',
          clipPath: `inset(${(1 - otkrij) * 50}% 0 ${(1 - otkrij) * 50}% 0 round ${radijus}px)`,
        }}
      >
        {/* tijelo kartice / preglednika / mobitela */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radijus,
            overflow: 'hidden',
            background: `linear-gradient(160deg, rgba(24, 64, 88, ${0.9 - platno * 0.2}) 0%, rgba(8, 30, 44, 0.96) 60%)`,
            border: `1px solid ${BOJE.rubJaci}`,
            boxShadow: `0 80px 160px -50px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
          }}
        >
          {/* odsjaj na kartici (prelazi preko pri približavanju) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(115deg, transparent ${20 + priblizi * 60}%, rgba(255, 244, 226, 0.12) ${30 + priblizi * 60}%, transparent ${42 + priblizi * 60}%)`,
              opacity: 1 - platno,
            }}
          />
          {/* brončani rub kartice u S1 */}
          <div
            style={{
              position: 'absolute',
              left: 44,
              right: 44,
              bottom: 56,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${BOJE.bronca}, transparent)`,
              opacity: (1 - platno) * otkrij,
            }}
          />

          {/* traka preglednika */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 52,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 22px',
              borderBottom: `1px solid ${BOJE.rub}`,
              opacity: platno * (1 - morph),
            }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: BOJE.rubJaci }} />
            ))}
            <div
              style={{
                marginLeft: 120,
                flex: 1,
                maxWidth: 420,
                height: 28,
                borderRadius: 14,
                background: BOJE.staklo,
                display: 'grid',
                placeItems: 'center',
                fontFamily: FONT.sans,
                fontSize: 15,
                color: BOJE.kamen2,
              }}
            >
              vasobrt.hr
            </div>
          </div>
          {/* traka učitavanja (performanse) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: 4,
              width: `${ucitaj * 100}%`,
              background: `linear-gradient(90deg, ${BOJE.tirkiz}, ${BOJE.broncaSv})`,
              opacity: f >= 556 && f < 600 ? 1 - napredak(f, 588, 600) : 0,
              zIndex: 5,
            }}
          />

          {/* desktop sadržaj: slaže se na udarce u S2 */}
          {f >= SCENA.stvaranje[0] && sadrzajDesktop > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 52,
                width: preglednik.w,
                height: preglednik.h - 52,
                opacity: sadrzajDesktop,
                transformOrigin: 'top left',
                transform: `scale(${w / preglednik.w})`,
              }}
            >
              <WebDesktop u={{ nav: 214, naslov: 246, slika: 276, tekst: 306, gumb: 336, kartice: 366 }} />
            </div>
          ) : null}

          {/* mobilni sadržaj */}
          {mobitelSadrzaj > 0 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: mobitelSadrzaj,
                transform: `scale(${lerp(1.06, 1, mobitelSadrzaj)})`,
                transformOrigin: 'top center',
              }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, width: mobitel.w }}>
                <WebMobitel skrol={skrol} ostrina={ostrina} />
              </div>
            </div>
          ) : null}
        </div>

        {/* okvir mobitela */}
        {okvirMobitela > 0 ? (
          <>
            <div
              style={{
                position: 'absolute',
                inset: -14,
                borderRadius: radijus + 14,
                border: '14px solid #0a0f12',
                boxShadow: `0 0 0 1.5px rgba(237, 230, 218, 0.22), 0 90px 160px -50px rgba(0, 0, 0, 0.9)`,
                opacity: okvirMobitela,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: '50%',
                width: 150,
                height: 40,
                marginLeft: -75,
                borderRadius: 20,
                background: '#050809',
                opacity: okvirMobitela,
              }}
            />
          </>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const Pozornica: React.FC = () => {
  const f = useCurrentFrame();
  const chatUlaz = opruga(f, 696, 50);
  const chatVan = napredak(f, 934, 962, odlazak);
  const [c0] = SCENA.chat;

  return (
    <AbsoluteFill>
      <Zamuci prozori={[[140, 196], [c0, c0 + 50]]}>
        <Objekt />
      </Zamuci>

      {/* S4: chat ispred okrenutog mobitela */}
      {f >= 694 && f < 962 ? (
        <div
          style={{
            position: 'absolute',
            left: 216,
            top: 740,
            perspective: 2400,
            opacity: clamp(chatUlaz) * (1 - chatVan),
            transform: `translate(${(1 - chatUlaz) * 220}px, ${chatVan * -30}px) rotateY(${(1 - chatUlaz) * -14 - 3}deg) scale(${
              0.96 + 0.04 * chatUlaz
            })`,
          }}
        >
          <Chat poruke={[736, 790, 834, 884]} tipka={[[756, 790], [850, 884]]} cip={904} />
        </div>
      ) : null}

      {/* natpisi (gore, u sigurnoj zoni) */}
      <Natpis redovi={TEKST.hook} ulaz={22} izlaz={176} velicina={104} />
      <Natpis redovi={TEKST.stvaranje} ulaz={200} izlaz={418} velicina={84} />
      <Natpis redovi={TEKST.dizajn1} ulaz={436} izlaz={548} velicina={92} y={360} />
      <Natpis redovi={TEKST.dizajn2} ulaz={552} izlaz={658} velicina={88} />
      <Natpis redovi={TEKST.chat} ulaz={674} izlaz={958} velicina={88} y={310} />
    </AbsoluteFill>
  );
};
