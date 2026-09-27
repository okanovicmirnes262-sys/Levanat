import { continueRender, delayRender, staticFile } from 'remotion';

// Fontovi se učitavaju lokalno (Fraunces za poruke i logo, Inter za sučelja u kadru).
// Render čeka dok svi ne budu spremni, da nijedan kadar ne ispadne sa zamjenskim fontom.
const fontovi: [string, string, FontFaceDescriptors][] = [
  ['Fraunces', 'fonts/fraunces.woff2', { weight: '300 600', style: 'normal' }],
  ['Fraunces', 'fonts/fraunces-italic.woff2', { weight: '300 600', style: 'italic' }],
  ['Inter', 'fonts/inter.woff2', { weight: '100 900', style: 'normal' }],
];

let ucitano = false;

export const ucitajFontove = () => {
  if (ucitano || typeof document === 'undefined') return;
  ucitano = true;
  const h = delayRender('Učitavanje fontova');
  Promise.all(
    fontovi.map(([ime, put, opis]) => new FontFace(ime, `url(${staticFile(put)}) format("woff2")`, opis).load()),
  )
    .then((f) => {
      f.forEach((x) => document.fonts.add(x));
      continueRender(h);
    })
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
};
