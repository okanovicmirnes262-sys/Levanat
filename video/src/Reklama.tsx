import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Pozadina } from './components/Pozadina';
import { SigurnaZona } from './components/SigurnaZona';
import { napredak } from './lib/anim';
import { Agenti } from './scenes/Agenti';
import { Pozornica } from './scenes/Pozornica';
import { Zavrsnica } from './scenes/Zavrsnica';

export type ReklamaProps = {
  /** Izvorna podloga (public/audio/glazba.wav). */
  glazba: boolean;
  /** Zvučni efekti (public/audio/efekti.wav). */
  efekti: boolean;
  /** Web adresa ili telefon za zadnji kadar. Prazno = ne prikazuje se ništa. */
  kontakt: string;
  /** Samo za kontrolu: iscrtava sigurnu zonu. */
  sigurnaZona: boolean;
};

export const Reklama: React.FC<ReklamaProps> = ({ glazba, efekti, kontakt, sigurnaZona }) => {
  const f = useCurrentFrame();
  // pozadina se lagano razsvijetli za reveal logotipa i poziv na akciju
  const svjetlo = napredak(f, 1440, 1540);
  return (
    <AbsoluteFill>
      <Pozadina svjetlo={svjetlo} />
      <Sequence durationInFrames={965} name="S1–S4 kartica, web, mobitel, chatbot">
        <Pozornica />
      </Sequence>
      <Sequence from={945} durationInFrames={260} name="S5 AI agenti">
        <Agenti />
      </Sequence>
      <Sequence from={1200} durationInFrames={600} name="S6–S8 prednosti, logo, poziv">
        <Zavrsnica kontakt={kontakt || undefined} />
      </Sequence>
      {glazba ? <Audio src={staticFile('audio/glazba.wav')} volume={0.9} /> : null}
      {efekti ? <Audio src={staticFile('audio/efekti.wav')} volume={0.8} /> : null}
      {sigurnaZona ? <SigurnaZona /> : null}
    </AbsoluteFill>
  );
};
