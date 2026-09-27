import React from 'react';
import { Composition, Freeze, Still } from 'remotion';
import { ucitajFontove } from './fontovi';
import { Reklama, type ReklamaProps } from './Reklama';
import { FPS, H, TRAJANJE, W } from './tokens';
import { Reklama2, type Reklama2Props } from './v2/Reklama2';

ucitajFontove();

// Kontakt za zadnji kadar upišite ovdje (npr. 'levanat.hr' ili telefon) i ponovno renderirajte.
const KONTAKT = '';

const v2: Reklama2Props = { glazba: true, efekti: true, kontakt: KONTAKT, sigurnaZona: false };
const v1: ReklamaProps = { glazba: true, efekti: true, kontakt: KONTAKT, sigurnaZona: false };
const zajedno = { durationInFrames: TRAJANJE, fps: FPS, width: W, height: H };

const Naslovnica: React.FC = () => (
  <Freeze frame={TRAJANJE - 10}>
    <Reklama2 {...v2} glazba={false} efekti={false} />
  </Freeze>
);

export const Root: React.FC = () => (
  <>
    {/* Reklama v2: apstraktni smjer s novim logotipom */}
    <Composition id="Reklama" component={Reklama2} {...zajedno} defaultProps={v2} />
    <Composition id="ReklamaBezGlazbe" component={Reklama2} {...zajedno} defaultProps={{ ...v2, glazba: false }} />
    <Composition id="Kontrola" component={Reklama2} {...zajedno} defaultProps={{ ...v2, sigurnaZona: true }} />
    <Still id="Naslovnica" component={Naslovnica} width={W} height={H} />
    {/* Prva verzija (web stranica, mobitel, chatbot), sačuvana za usporedbu */}
    <Composition id="ReklamaV1" component={Reklama} {...zajedno} defaultProps={v1} />
  </>
);
