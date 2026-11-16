import { useEffect, useRef } from "react";

const COLORS = ["#7d59da", "#8e6be2", "#a78bfa", "#c4b5fd"];

export default function RingParticles({ count = 140 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const particles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const band = (Math.random() - 0.5) * 0.32;
      return {
        angle,
        band,
        speed: (0.00045 + Math.random() * 0.00045) * (i % 2 === 0 ? 1 : -0.6),
        size: 1.6 + Math.random() * 2.6,
        alpha: 0.32 + Math.random() * 0.55,
        color: COLORS[i % COLORS.length],
        ox: 0,
        oy: 0,
      };
    });

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || window.innerWidth;
      height = rect?.height || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.5;
      const baseRadius = Math.min(width, height) * 0.34;

      for (const p of particles) {
        if (!reduced) p.angle += p.speed;
        const r = baseRadius * (1 + p.band);
        const tx = cx + Math.cos(p.angle) * r;
        const ty = cy + Math.sin(p.angle) * r * 0.86;

        if (pointer.active && !reduced) {
          const dx = tx - pointer.x;
          const dy = ty - pointer.y;
          const dist = Math.hypot(dx, dy);
          const influence = 130;
          if (dist < influence && dist > 0.1) {
            const force = ((influence - dist) / influence) * 34;
            p.ox += ((dx / dist) * force - p.ox) * 0.16;
            p.oy += ((dy / dist) * force - p.oy) * 0.16;
          } else {
            p.ox *= 0.9;
            p.oy *= 0.9;
          }
        } else {
          p.ox *= 0.9;
          p.oy *= 0.9;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(tx + p.ox, ty + p.oy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (!reduced) rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="ring-particles" aria-hidden="true" />;
}
