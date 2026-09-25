import { isSoftwareGL, frameGuard } from './gpu';

// More pod katedralom: valovi koje levanat gura zdesna nalijevo, odraz katedrale
// koji se lomi na valovima i brončani odsjaji sunca. Jedan pravokutnik, jedan shader.

const VS = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos; gl_Position = vec4(aPos * 2.0 - 1.0, 0.0, 1.0); }`;

const FS = `
precision mediump float;
uniform float uTime;
uniform vec2 uRes;
uniform sampler2D uKat;
uniform vec4 uKatRect;   // x, širina, visina (u UV prostoru platna), vidljivo
uniform vec2 uMouse;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
// Visina vala: slojevi koji putuju ulijevo (levanat puše s istoka)
float waves(vec2 p, float t) {
  float h = 0.0;
  h += sin(p.x * 6.0 + t * 0.9 + p.y * 2.0) * 0.5;
  h += sin(p.x * 13.0 + t * 1.6 - p.y * 5.0) * 0.25;
  h += (noise(p * vec2(9.0, 22.0) + vec2(t * 0.55, 0.0)) - 0.5) * 0.9;
  h += (noise(p * vec2(26.0, 60.0) + vec2(t * 1.2, t * 0.1)) - 0.5) * 0.35;
  return h;
}

void main() {
  vec2 uv = vUv;                    // (0,0) dolje lijevo, y=1 horizont
  float depth = 1.0 - uv.y;         // 0 na horizontu, 1 pri dnu
  float persp = mix(0.12, 1.0, depth);
  vec2 p = vec2(uv.x * uRes.x / uRes.y, depth * 1.6) / persp;
  float t = uTime;

  float h = waves(p * 0.6, t);
  float e = 0.01;
  float hx = waves(p * 0.6 + vec2(e, 0.0), t) - h;
  float hy = waves(p * 0.6 + vec2(0.0, e), t) - h;
  vec3 n = normalize(vec3(-hx * 6.0, -hy * 6.0, 1.0));

  // Boja dubine: tirkizni odsjaj pri horizontu, tamni petrolej prema dolje
  vec3 deep = vec3(0.027, 0.11, 0.157);
  vec3 mid = vec3(0.043, 0.165, 0.235);
  vec3 near = vec3(0.075, 0.23, 0.27);
  vec3 col = mix(near, mid, smoothstep(0.0, 0.35, depth));
  col = mix(col, deep, smoothstep(0.3, 1.0, depth));

  // Odraz katedrale: zrcaljeno oko horizonta, izvijeno valovima
  float kx = (uv.x - uKatRect.x) / uKatRect.y;
  float ky = 1.0 - (depth / uKatRect.z) * 1.15;
  vec2 kuv = vec2(kx + n.x * 0.035 * (0.4 + depth), ky + n.y * 0.02);
  if (uKatRect.w > 0.5 && kuv.x > 0.0 && kuv.x < 1.0 && kuv.y > 0.0 && kuv.y < 1.0) {
    vec4 k = texture2D(uKat, kuv);
    float fade = (1.0 - smoothstep(0.0, 0.8, depth)) * 0.5;
    col = mix(col, k.rgb * vec3(0.62, 0.66, 0.66), k.a * fade);
  }

  // Sunce (topla bronca) i odsjaji na vrhovima valova
  vec3 sun = normalize(vec3(-0.35, 0.25, 0.9));
  float glint = pow(max(dot(reflect(-sun, n), vec3(0.0, 0.0, 1.0)), 0.0), 140.0);
  float sparkle = step(0.988, noise(p * 40.0 + t * 0.8)) * glint * (1.0 - depth);
  col += vec3(0.92, 0.78, 0.55) * (glint * 0.22 + sparkle * 0.6) * (1.0 - depth * 0.7);

  // Svjetlo kursora na vodi
  float md = distance(uv, uMouse);
  col += vec3(0.85, 0.75, 0.6) * glint * 0.6 * smoothstep(0.25, 0.0, md);

  // Tanka svijetla crta horizonta
  col += vec3(0.7, 0.62, 0.5) * smoothstep(0.012, 0.0, abs(uv.y - 0.996)) * 0.25;

  gl_FragColor = vec4(col, 1.0);
}`;

export async function initSea(root: HTMLElement, still: boolean) {
  const canvas = root.querySelector('canvas')!;
  const kat = root.querySelector<HTMLImageElement>('.obala__katedrala img');
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return;
  let calm = still || isSoftwareGL(gl);

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || '');
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

  const U = {
    time: gl.getUniformLocation(prog, 'uTime'),
    res: gl.getUniformLocation(prog, 'uRes'),
    kat: gl.getUniformLocation(prog, 'uKat'),
    rect: gl.getUniformLocation(prog, 'uKatRect'),
    mouse: gl.getUniformLocation(prog, 'uMouse'),
  };

  let hasKat = 0;
  if (kat) {
    try {
      if (!kat.complete) await new Promise((r) => kat.addEventListener('load', r, { once: true }));
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, kat);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(U.kat, 0);
      hasKat = 1;
    } catch {
      hasKat = 0;
    }
  }

  const coarse = matchMedia('(pointer: coarse)').matches;
  const mouse = { x: 0.5, y: -1 };
  let W = 0, H = 0;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const scale = coarse ? 0.6 : Math.min(window.devicePixelRatio || 1, 1.5) * 0.85;
    W = Math.max(2, Math.round(r.width * scale));
    H = Math.max(2, Math.round(r.height * scale));
    canvas.width = W;
    canvas.height = H;
    gl.viewport(0, 0, W, H);
  };
  resize();

  window.addEventListener(
    'pointermove',
    (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;
    },
    { passive: true },
  );

  const t0 = performance.now();
  let raf = 0, running = false, last = 0;
  const draw = (now: number) => {
    gl.uniform1f(U.time, (now - t0) / 1000);
    gl.uniform2f(U.res, W, H);
    gl.uniform2f(U.mouse, mouse.x, mouse.y);
    if (kat && hasKat) {
      const cr = canvas.getBoundingClientRect();
      const kr = kat.getBoundingClientRect();
      gl.uniform4f(U.rect, (kr.left - cr.left) / cr.width, kr.width / cr.width, kr.height / cr.height, 1);
    } else gl.uniform4f(U.rect, 0, 1, 1, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  const guard = frameGuard(() => {
    calm = true;
    stop();
  });
  const loop = (now: number) => {
    if (!running) return;
    guard(now);
    if (now - last > (coarse ? 40 : 16)) {
      draw(now);
      last = now;
    }
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || calm) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  new ResizeObserver(() => {
    resize();
    draw(performance.now());
  }).observe(canvas);
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '100px' }).observe(root);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  draw(t0 + 4000);
  root.classList.add('gl-on');
  start();
}
