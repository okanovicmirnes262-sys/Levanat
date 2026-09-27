import fs from 'node:fs';
import { Config } from '@remotion/cli/config';

// U ovom okruženju koristi se Playwrightov chrome-headless-shell. Ako ga nema (npr. na Vašem
// računalu), Remotion sam preuzme svoj preglednik. Put se može zadati i s REMOTION_CHROME.
const chrome = process.env.REMOTION_CHROME ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(chrome)) Config.setBrowserExecutable(chrome);

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setAudioBitrate('320k');
Config.setConcurrency(4);
Config.setOverwriteOutput(true);
