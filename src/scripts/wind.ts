// Levanat na canvasu: tanke strujnice koje plove zdesna nalijevo (vjetar s istoka).
// Reagiraju na pokret miša i brzinu scrolla. Pauziraju se kad nisu vidljive.

type Streak = {
  x: number;
  y: number;
  len: number;
  speed: number;
  amp: number;
  freq: number;
  phase: number;
  alpha: number;
  width: number;
};

const TONES = {
  ink: '15, 42, 51',
  light: '242, 238, 230',
} as const;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

class Wind {
  private ctx: CanvasRenderingContext2D;
  private streaks: Streak[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;
  private t = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private visible = false;
  private boost = 0;
  private mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
  private color: string;
  private coarse: boolean;

  constructor(
    private canvas: HTMLCanvasElement,
    private still: boolean,
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.color = TONES[(canvas.dataset.wind as keyof typeof TONES) || 'ink'] ?? TONES.ink;
    this.coarse = window.matchMedia('(pointer: coarse)').matches;
    this.resize();

    new ResizeObserver(() => this.resize()).observe(canvas);

    new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        this.visible ? this.start() : this.stop();
      },
      { rootMargin: '80px' },
    ).observe(canvas);

    document.addEventListener('visibilitychange', () => (document.hidden ? this.stop() : this.visible && this.start()));

    if (!this.coarse && !still) {
      window.addEventListener(
        'pointermove',
        (e) => {
          const r = this.canvas.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          this.mouse.active = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
          this.mouse.tx = x;
          this.mouse.ty = y;
        },
        { passive: true },
      );
    }

    if (!still) {
      let lastY = window.scrollY;
      window.addEventListener(
        'scroll',
        () => {
          const dy = Math.abs(window.scrollY - lastY);
          lastY = window.scrollY;
          this.boost = Math.min(this.boost + dy * 0.02, 3.2);
        },
        { passive: true },
      );
    }
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.seed();
    if (this.still || !this.running) this.draw();
  }

  private seed() {
    const area = this.w * this.h;
    const count = Math.round(Math.min(Math.max(area / (this.coarse ? 26000 : 19000), 14), this.coarse ? 26 : 54));
    const scale = Math.min(Math.max(this.w / 1400, 0.5), 1.3);
    this.streaks = Array.from({ length: count }, () => this.make(true, scale));
  }

  private make(initial: boolean, scale = Math.min(Math.max(this.w / 1400, 0.5), 1.3)): Streak {
    const len = rand(90, 380) * scale;
    // Većina strujnica u gornje dvije trećine, gdje je više zraka.
    const y = Math.pow(Math.random(), 1.15) * this.h;
    return {
      x: initial ? rand(-len, this.w) : this.w + rand(0, 160),
      y,
      len,
      speed: rand(0.18, 0.7) * (0.6 + len / (380 * scale)),
      amp: rand(1.5, 8),
      freq: rand(0.0035, 0.011),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.05, 0.2),
      width: Math.random() < 0.3 ? 0.6 : 1,
    };
  }

  private start() {
    if (this.still || this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(now - this.last, 50);
      this.last = now;
      this.step(dt);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private step(dt: number) {
    const f = dt / 16.67;
    this.t += dt;
    this.boost *= Math.pow(0.94, f);
    const m = this.mouse;
    const k = 1 - Math.pow(0.88, f);
    if (m.active) {
      if (m.x < -999) {
        m.x = m.tx;
        m.y = m.ty;
      }
      m.x += (m.tx - m.x) * k;
      m.y += (m.ty - m.y) * k;
    } else {
      m.x = -9999;
      m.y = -9999;
    }
    for (let i = 0; i < this.streaks.length; i++) {
      const s = this.streaks[i];
      s.x -= s.speed * (1 + this.boost) * f;
      if (s.x + s.len < -20) this.streaks[i] = this.make(false);
    }
  }

  private draw() {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    const segs = 18;
    const R = 140;
    const R2 = R * R;
    const mx = this.mouse.x;
    const my = this.mouse.y;
    const time = this.t * 0.0011;

    for (const s of this.streaks) {
      // Ublaži rubove platna da linije ne „izlaze” naglo.
      const cx = s.x + s.len / 2;
      const edge = Math.min(1, Math.max(0, Math.min(cx, w - cx) / (w * 0.15)));
      const a = s.alpha * (0.3 + 0.7 * edge);
      if (a < 0.01) continue;

      ctx.beginPath();
      for (let k = 0; k <= segs; k++) {
        const px = s.x + (s.len * k) / segs;
        let py = s.y + Math.sin(px * s.freq + time + s.phase) * s.amp;
        const dx = px - mx;
        const dy = py - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2);
          const push = Math.pow(1 - d / R, 2) * 26;
          py += (dy >= 0 ? 1 : -1) * push;
        }
        k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(${this.color}, ${a.toFixed(3)})`;
      ctx.lineWidth = s.width;
      ctx.stroke();
    }
  }
}

export function initWind() {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-wind]').forEach((c) => new Wind(c, still));
}
