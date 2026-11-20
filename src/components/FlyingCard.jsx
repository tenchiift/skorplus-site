import { useEffect, useRef } from "react";

/**
 * FlyingCard — non-clickable interactive 3D card that floats autonomously
 * in mid-air and banks/tilts smoothly in response to pointer movement.
 */
export default function FlyingCard({
  children,
  className = "",
  phase = 0,
  floatAmplitude = 7,
  tiltStrength = 14,
}) {
  const wrapRef = useRef(null);
  const bodyRef = useRef(null);
  const sheenRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const body = bodyRef.current;
    const sheen = sheenRef.current;
    if (!wrap || !body) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced) return;

    let rafId = 0;
    let lastTime = performance.now();

    let targetPx = 0;
    let targetPy = 0;
    let curPx = 0;
    let curPy = 0;
    let isHovered = false;
    let liftPos = 0;
    let liftVel = 0;

    const onPointerMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      const nx = (e.clientX - cx) / (rect.width * 0.9);
      const ny = (e.clientY - cy) / (rect.height * 0.9);
      const dist = Math.hypot(nx, ny);

      if (dist < 1.8) {
        const falloff = Math.max(0, 1 - dist / 1.8);
        targetPx = Math.max(-1, Math.min(1, nx)) * (0.35 + 0.65 * falloff);
        targetPy = Math.max(-1, Math.min(1, ny)) * (0.35 + 0.65 * falloff);
      } else {
        targetPx = 0;
        targetPy = 0;
      }

      if (sheen) {
        const sx = ((e.clientX - rect.left) / rect.width) * 100;
        const sy = ((e.clientY - rect.top) / rect.height) * 100;
        sheen.style.setProperty("--sheen-x", `${sx.toFixed(1)}%`);
        sheen.style.setProperty("--sheen-y", `${sy.toFixed(1)}%`);
      }
    };

    const onPointerEnter = () => {
      isHovered = true;
      liftVel += 1.6;
    };

    const onPointerLeave = () => {
      isHovered = false;
      targetPx = 0;
      targetPy = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    wrap.addEventListener("pointerenter", onPointerEnter);
    wrap.addEventListener("pointerleave", onPointerLeave);

    const tick = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const followRate = 1 - Math.exp(-9.5 * dt);
      curPx += (targetPx - curPx) * followRate;
      curPy += (targetPy - curPy) * followRate;

      // Spring physics for hover lift
      const liftTarget = isHovered ? 1 : 0;
      const stiffness = 210;
      const damping = 15;
      const accel = (liftTarget - liftPos) * stiffness - liftVel * damping;
      liftVel += accel * dt;
      liftPos += liftVel * dt;

      // Subtle autonomous floating motion
      const t = now / 1000 + phase;
      const bobY = Math.sin(t * 1.1) * floatAmplitude;
      const driftX = Math.cos(t * 0.85) * (floatAmplitude * 0.25);
      const autoTiltX = Math.cos(t * 0.95) * 1.2;
      const autoTiltY = Math.sin(t * 0.8) * 1.6;
      const autoRoll = Math.sin(t * 1.05) * 0.7;

      const rotX = autoTiltX - curPy * tiltStrength;
      const rotY = autoTiltY + curPx * tiltStrength;
      const rotZ = autoRoll + curPx * 2.4;
      const shiftX = driftX + curPx * 8;
      const shiftY = bobY + curPy * 6 - liftPos * 7;
      const scale = 1 + liftPos * 0.035;

      body.style.transform = `perspective(850px) translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

      if (sheen) {
        sheen.style.opacity = isHovered ? "1" : "0.25";
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerenter", onPointerEnter);
      wrap.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [phase, floatAmplitude, tiltStrength]);

  return (
    <div ref={wrapRef} className={`flying-card ${className}`.trim()}>
      <div ref={bodyRef} className="flying-card-body">
        {children}
        <div ref={sheenRef} className="flying-card-sheen" aria-hidden="true" />
      </div>
    </div>
  );
}
