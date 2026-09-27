// Kontrolni kadrovi: jedan bundle, pa niz stillova. Upotreba:
//   node alati/kadrovi.mjs [zona] 0 90 300 ...
// „zona” = iscrtaj sigurnu zonu (crveno). Izlaz: out/kadrovi/fNNNN.png
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const args = process.argv.slice(2);
const zona = args[0] === 'zona';
const frameovi = (zona ? args.slice(1) : args).map(Number);
const chrome = process.env.REMOTION_CHROME ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const inputProps = { glazba: false, efekti: false, kontakt: process.env.KONTAKT ?? '', sigurnaZona: zona };
const composition = await selectComposition({ serveUrl, id: 'Reklama', inputProps, browserExecutable: chrome });
for (const frame of frameovi) {
  const out = `out/kadrovi/${zona ? 'zona-' : ''}f${String(frame).padStart(4, '0')}.png`;
  await renderStill({ composition, serveUrl, frame, output: out, inputProps, browserExecutable: chrome });
  console.log(out);
}
