import React from 'react';
import { Composition, Freeze, Still } from 'remotion';
import { ucitajFontove } from './fontovi';
import { Reklama, type ReklamaProps } from './Reklama';
import { FPS, H, TRAJANJE, W } from './tokens';

ucitajFontove();

// Kontakt za zadnji kadar upišite ovdje (npr. 'levanat.hr' ili telefon) i ponovno renderirajte.
const KONTAKT = '';

const osnovno: ReklamaProps = { glazba: true, efekti: true, kontakt: KONTAKT, sigurnaZona: false };

export const Root: React.FC = () => (
  <>
    <Composition id="Reklama" component={Reklama} durationInFrames={TRAJANJE} fps={FPS} width={W} height={H} defaultProps={osnovno} />
    <Composition
      id="ReklamaBezGlazbe"
      component={Reklama}
      durationInFrames={TRAJANJE}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{ ...osnovno, glazba: false }}
    />
    <Composition
      id="Kontrola"
      component={Reklama}
      durationInFrames={TRAJANJE}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{ ...osnovno, sigurnaZona: true }}
    />
    {/* Naslovna fotografija = zadnji, mirni kadar */}
    <Still id="Naslovnica" component={() => <ReklamaStill />} width={W} height={H} />
  </>
);

const ReklamaStill: React.FC = () => (
  <Freeze frame={TRAJANJE - 10}>
    <Reklama {...osnovno} glazba={false} efekti={false} />
  </Freeze>
);
