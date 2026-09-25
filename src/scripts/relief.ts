import { isSoftwareGL, frameGuard } from './gpu';

// Svjetlo po reljefu: WebGL crta kamene glave preko njihovih <img> elemenata
// i osvjetljava ih prema karti reljefa (normal map). Svjetlo prati kursor;
// na dodirnim ekranima polako luta samo i prati dodir.
// Uvod: snop svjetla prijeđe preko glava. Scroll: izlazi sunce (raste ambijent).

const VS = `
attribute vec2 aPos;
uniform vec4 uRect;      // x, y, w, h u pikselima platna
uniform vec2 uRes;
uniform float uLift;     // pomak (paralaksa) u pikselima
varying vec2 vUv;
varying vec2 vPx;
void main() {
  vUv = aPos;
  vec2 px = uRect.xy + aPos * uRect.zw + vec2(0.0, uLift);
  vPx = px;
  vec2 clip = (px / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

const FS = `
precision mediump float;
uniform sampler2D uColor;
uniform sampler2D uNormal;
uniform vec2 uLight;     // položaj svjetla u pikselima
uniform float uHeight;   // visina svjetla iznad kamena
uniform float uPower;
uniform float uAmb;
uniform float uSun;
uniform float uRadius;
varying vec2 vUv;
varying vec2 vPx;
void main() {
  vec4 c = texture2D(uColor, vUv);
  if (c.a < 0.004) discard;
  vec3 n = normalize(texture2D(uNormal, vUv).rgb * 2.0 - 1.0);
  vec2 d = uLight - vPx;
  vec3 L = normalize(vec3(d.x, -d.y, uHeight));
  float diff = max(dot(n, L), 0.0);
  float att = 1.0 / (1.0 + pow(length(d) / uRadius, 2.0));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, H), 0.0), 18.0) * 0.1;
  vec3 warm = vec3(1.0, 0.94, 0.84);
  vec3 sunDir = normalize(vec3(-0.45, 0.55, 0.7));
  float sd = max(dot(n, sunDir), 0.0);
  vec3 lit = c.rgb * (uAmb + warm * diff * att * uPower + vec3(1.0, 0.95, 0.86) * sd * uSun)
           + warm * spec * att * uPower * c.a;
  gl_FragColor = vec4(lit, c.a);
}`;

type Item = { img: HTMLImageElement; color: WebGLTexture; normal: WebGLTexture };

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}

function texture(gl: WebGLRenderingContext, source: TexImageSource) {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.decoding = 'async';
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });

const ready = (img: HTMLImageElement) =>
  img.complete && img.naturalWidth ? Promise.resolve(img) : new Promise<HTMLImageElement>((r) => img.addEventListener('load', () => r(img), { once: true }));

export async function initRelief(stage: HTMLElement, opts: { intro: boolean; still: boolean }) {
  const canvas = stage.querySelector('canvas')!;
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return;
  // Bez grafičke kartice: jedna sličica, a svjetlo se pomiče samo uz miš
  let onDemand = isSoftwareGL(gl);

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const U = {
    rect: u('uRect'), res: u('uRes'), lift: u('uLift'), color: u('uColor'), normal: u('uNormal'),
    light: u('uLight'), height: u('uHeight'), power: u('uPower'), amb: u('uAmb'), sun: u('uSun'), radius: u('uRadius'),
  };
  gl.uniform1i(U.color, 0);
  gl.uniform1i(U.normal, 1);

  // Učitaj teksture (boja iz već prikazane slike, reljef iz data-normal)
  const imgs = [...stage.querySelectorAll<HTMLImageElement>('img[data-relief]')].filter((i) => i.offsetParent !== null);
  const items: Item[] = [];
  try {
    for (const img of imgs) {
      await ready(img);
      const nImg = await loadImage(img.dataset.normal!);
      items.push({ img, color: texture(gl, img), normal: texture(gl, nImg) });
    }
  } catch {
    return;
  }
  if (!items.length) return;

  let W = 0, H = 0, dpr = 1;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
    W = Math.round(r.width * dpr);
    H = Math.round(r.height * dpr);
    canvas.width = W;
    canvas.height = H;
    gl.viewport(0, 0, W, H);
  };
  resize();

  // Svjetlo: cilj (kursor/lutanje) i trenutni položaj s inercijom
  const coarse = matchMedia('(pointer: coarse)').matches;
  const r0i = items[0].img.getBoundingClientRect();
  const cri = canvas.getBoundingClientRect();
  const lx0 = (r0i.left - cri.left + r0i.width * 0.42) * dpr;
  const ly0 = (r0i.top - cri.top + r0i.height * 0.38) * dpr;
  const light = { x: lx0, y: ly0, tx: lx0, ty: ly0 };
  let pointerAt = 0;
  let pending = false;
  let scrollP = 0;
  const t0 = performance.now();
  const INTRO = opts.intro ? 1300 : 0;

  window.addEventListener(
    'pointermove',
    (e) => {
      const r = canvas.getBoundingClientRect();
      light.tx = (e.clientX - r.left) * dpr;
      light.ty = (e.clientY - r.top) * dpr;
      pointerAt = performance.now();
      if (onDemand && !pending && r.bottom > 0 && r.top < innerHeight) {
        pending = true;
        setTimeout(() => {
          pending = false;
          light.x = light.tx;
          light.y = light.ty;
          draw(t0 + INTRO + 1, true);
        }, 60);
      }
    },
    { passive: true },
  );
  const onScroll = () => {
    const r = stage.getBoundingClientRect();
    scrollP = Math.min(Math.max(-r.top / Math.max(r.height, 1), 0), 1);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  let raf = 0;
  let running = false;
  let lastDraw = 0;

  const draw = (now: number, fixed = false) => {
    const t = now - t0;
    // Uvod: snop svjetla klizi slijeva nadesno preko glava
    let introK = 0;
    if (t < INTRO) {
      const p = t / INTRO;
      const e = 1 - Math.pow(1 - p, 3);
      const r0 = items[0].img.getBoundingClientRect();
      const cr0 = canvas.getBoundingClientRect();
      const endX = (r0.left - cr0.left + r0.width * 0.42) * dpr;
      const endY = (r0.top - cr0.top + r0.height * 0.38) * dpr;
      light.x = light.tx = -0.1 * W + e * (endX + 0.1 * W);
      light.y = light.ty = endY - Math.sin(p * Math.PI) * H * 0.15;
      introK = 1 - p;
    } else if (!fixed && (coarse || now - pointerAt > 4000)) {
      // Bez kursora svjetlo polako kruži oko glavne glave (kao sunce kroz oblake)
      const cr0 = canvas.getBoundingClientRect();
      const r0 = items[0].img.getBoundingClientRect();
      const cx = (r0.left - cr0.left + r0.width * 0.42) * dpr;
      const cy = (r0.top - cr0.top + r0.height * 0.38) * dpr;
      const s = t * 0.00022;
      light.tx = cx + Math.cos(s * 1.3) * r0.width * 0.32 * dpr;
      light.ty = cy + Math.sin(s * 1.9) * r0.height * 0.22 * dpr;
    }
    const k = t < INTRO || fixed ? 1 : 0.075;
    light.x += (light.tx - light.x) * k;
    light.y += (light.ty - light.y) * k;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U.res, W, H);
    gl.uniform2f(U.light, light.x, light.y);
    gl.uniform1f(U.height, 260 * dpr);
    gl.uniform1f(U.radius, Math.max(W, H) * 0.5);
    gl.uniform1f(U.power, 1.25 + introK * 0.5);
    gl.uniform1f(U.amb, 0.55 + scrollP * 0.3);
    gl.uniform1f(U.sun, scrollP * 0.75);

    const cr = canvas.getBoundingClientRect();
    for (const it of items) {
      const r = it.img.getBoundingClientRect();
      gl.uniform4f(U.rect, (r.left - cr.left) * dpr, (r.top - cr.top) * dpr, r.width * dpr, r.height * dpr);
      gl.uniform1f(U.lift, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, it.color);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, it.normal);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  };

  const guard = frameGuard(() => {
    onDemand = true;
    stop();
  });
  const loop = (now: number) => {
    if (!running) return;
    guard(now);
    // Na slabijim uređajima dovoljno je ~30 fps
    if (!coarse || now - lastDraw > 32) {
      draw(now);
      lastDraw = now;
    }
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || opts.still || onDemand) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  new ResizeObserver(() => {
    resize();
    if (!running) draw(performance.now());
  }).observe(canvas);
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(stage);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  if (opts.still || onDemand) {
    // Mirna verzija: jedno svjetlo odozgo slijeva na glavnu glavu, bez petlje
    light.x = light.tx = lx0 - r0i.width * 0.12 * dpr;
    light.y = light.ty = ly0 - r0i.height * 0.08 * dpr;
    draw(t0 + INTRO + 1, true);
    stage.classList.add('gl-on');
  } else {
    draw(performance.now());
    stage.classList.add('gl-on');
    start();
  }
}

/** Rezerva bez WebGL-a: CSS sloj svjetla prati kursor. */
export function initReliefFallback(stage: HTMLElement) {
  window.addEventListener(
    'pointermove',
    (e) => {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty('--lx', `${((e.clientX - r.left) / r.width) * 100}%`);
      stage.style.setProperty('--ly', `${((e.clientY - r.top) / r.height) * 100}%`);
    },
    { passive: true },
  );
}
