// Izračun izlaska sunca (NOAA aproksimacija, točnost oko minute).

const RAD = Math.PI / 180;
const TZ = 'Europe/Zagreb';

/** Datum (godina, mjesec, dan) kakav je trenutno u Hrvatskoj. */
function zagrebDate(now: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(now)
    .split('-')
    .map(Number);
  return { y: parts[0], m: parts[1], d: parts[2] };
}

export function sunrise(now: Date, lat: number, lon: number): Date | null {
  const { y, m, d } = zagrebDate(now);
  const midnightUtc = Date.UTC(y, m - 1, d);
  const dayOfYear = Math.round((midnightUtc - Date.UTC(y, 0, 0)) / 86400000);
  const g = ((2 * Math.PI) / 365) * (dayOfYear - 1 + (6 - 12) / 24);

  const eqTime =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g);

  const cosHa = Math.cos(90.833 * RAD) / (Math.cos(lat * RAD) * Math.cos(decl)) - Math.tan(lat * RAD) * Math.tan(decl);
  if (cosHa < -1 || cosHa > 1) return null;
  const ha = Math.acos(cosHa) / RAD;
  const minutesUtc = 720 - 4 * (lon + ha) - eqTime;
  return new Date(midnightUtc + minutesUtc * 60000);
}

export const formatTime = (date: Date) =>
  new Intl.DateTimeFormat('hr-HR', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
