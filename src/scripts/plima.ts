// Plima: valovite granice sekcija lagano se njišu, a val putuje zdesna nalijevo.
export function initPlima(still: boolean) {
  const svgs = [...document.querySelectorAll<SVGSVGElement>('svg[data-plima]')];
  if (!svgs.length || still) return;
  const W = 1440, H = 100;
  const shape = (t: number, amp: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 24) {
      const y = 52 + Math.sin(x * 0.0052 + 0.8 + t * 0.6) * 18 * amp + Math.sin(x * 0.013 + 2.1 + t * 1.1) * 7;
      pts.push(`${x},${y.toFixed(1)}`);
    }
    return pts.join(' L');
  };
  const visible = new Set<SVGSVGElement>();
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visible.add(e.target as SVGSVGElement) : visible.delete(e.target as SVGSVGElement))));
  svgs.forEach((s) => io.observe(s));
  let lastY = scrollY, energy = 0;
  addEventListener('scroll', () => {
    energy = Math.min(energy + Math.abs(scrollY - lastY) * 0.004, 1);
    lastY = scrollY;
  }, { passive: true });
  const t0 = performance.now();
  let last = 0;
  const loop = (now: number) => {
    requestAnimationFrame(loop);
    if (!visible.size || now - last < 33) return;
    last = now;
    energy *= 0.95;
    const t = (now - t0) / 1000;
    const pts = shape(t, 1 + energy * 0.8);
    visible.forEach((svg) => {
      const [fill, line] = svg.querySelectorAll('path');
      fill?.setAttribute('d', `M0,${H} L${pts} L${W},${H} Z`);
      line?.setAttribute('d', `M${pts}`);
    });
  };
  requestAnimationFrame(loop);
}
