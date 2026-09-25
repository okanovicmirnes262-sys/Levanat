// Prepoznaje softversko WebGL renderiranje (bez grafičke kartice). Na takvim
// uređajima scene se crtaju jednom, ne u petlji, da stranica ostane brza.
export function isSoftwareGL(gl: WebGLRenderingContext): boolean {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    return /swiftshader|llvmpipe|software|basic render/i.test(r);
  } catch {
    return false;
  }
}

/** Prati trajanje sličica; ako su trajno spore, javlja da treba prijeći u mirni način. */
export function frameGuard(onSlow: () => void, limitMs = 34, samples = 40) {
  let last = 0, slow = 0, n = 0, done = false;
  return (now: number) => {
    if (done) return;
    if (last) {
      n++;
      if (now - last > limitMs) slow++;
      if (n >= samples) {
        if (slow / n > 0.6) {
          done = true;
          onSlow();
        }
        n = slow = 0;
      }
    }
    last = now;
  };
}
