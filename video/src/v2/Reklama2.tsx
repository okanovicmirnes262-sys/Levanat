import { CameraMotionBlur } from '@remotion/motion-blur';
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { SigurnaZona } from '../components/SigurnaZona';
import { Pozadina } from './komponente/Pozadina';
import { napredak } from './lib/anim';
import { Finale } from './scene/Finale';
import { S1Svjetlo } from './scene/S1Svjetlo';
import { S2Kartice } from './scene/S2Kartice';
import { S3Mreza } from './scene/S3Mreza';

export type Reklama2Props = {
  glazba: boolean;
  efekti: boolean;
  /** Web adresa ili telefon za zadnji kadar. Prazno = ne prikazuje se ništa. */
  kontakt: string;
  sigurnaZona: boolean;
};

/** Motion blur samo u kratkim, brzim prijelazima (štedi vrijeme rendera). */
const PROZORI_BLURA: [number, number][] = [
  [262, 330], // prve kartice dolijeću
  [540, 610], // raspad u čestice
  [1262, 1336], // spajanje struktura
];

const Scene: React.FC<{ kontakt: string }> = ({ kontakt }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {f < 266 ? <S1Svjetlo /> : null}
      {f >= 236 && f < 570 ? <S2Kartice /> : null}
      {f >= 538 && f < 915 ? <S3Mreza /> : null}
      {f >= 896 ? <Finale kontakt={kontakt || undefined} /> : null}
    </AbsoluteFill>
  );
};

export const Reklama2: React.FC<Reklama2Props> = ({ glazba, efekti, kontakt, sigurnaZona }) => {
  const f = useCurrentFrame();
  const blur = PROZORI_BLURA.some(([a, b]) => f >= a && f < b);
  return (
    <AbsoluteFill>
      <Pozadina jacina={0.6 + 0.4 * napredak(f, 0, 120)} prasina={napredak(f, 20, 120)} />
      {blur ? (
        <CameraMotionBlur samples={6} shutterAngle={180}>
          <Scene kontakt={kontakt} />
        </CameraMotionBlur>
      ) : (
        <Scene kontakt={kontakt} />
      )}
      {glazba ? <Audio src={staticFile('audio/v2-glazba.wav')} volume={0.9} /> : null}
      {efekti ? <Audio src={staticFile('audio/v2-efekti.wav')} volume={0.85} /> : null}
      {sigurnaZona ? <SigurnaZona /> : null}
    </AbsoluteFill>
  );
};
