// Mali 3D sloj: točke, rotacije i perspektivna projekcija za SVG crtanje (bez WebGL-a).

export type V3 = [number, number, number];

export const rotX = ([x, y, z]: V3, a: number): V3 => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
export const rotY = ([x, y, z]: V3, a: number): V3 => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
export const rotZ = ([x, y, z]: V3, a: number): V3 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];

export type Tocka2 = { x: number; y: number; s: number; z: number };

/** Perspektivna projekcija: `f` žarišna duljina, `z0` udaljenost kamere. */
export const projiciraj = (p: V3, cx: number, cy: number, f = 1400, z0 = 1400): Tocka2 => {
  const z = p[2] + z0;
  const s = f / Math.max(z, 1);
  return { x: cx + p[0] * s, y: cy + p[1] * s, s, z };
};

/** Deterministički pseudoslučajni generator (mulberry32). */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Vrhovi i bridovi ikosaedra (polumjer 1). */
export const ikosaedar = () => {
  const t = (1 + Math.sqrt(5)) / 2;
  const v: V3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(([x, y, z]) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l] as V3;
  });
  const e: [number, number][] = [];
  for (let i = 0; i < v.length; i++)
    for (let j = i + 1; j < v.length; j++) {
      const d = Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2]);
      if (d < 1.1) e.push([i, j]);
    }
  return { v, e };
};
