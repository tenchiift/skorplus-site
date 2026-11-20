import { useEffect, useRef } from "react";

/**
 * InteractivePhone — applies BerylCap-style spring physics, autonomous float,
 * pointer-following 3D tilt & drift, hover sink, click press, and a cursor-tracking
 * specular sheen directly to the hero phone image/video.
 */
export default function InteractivePhone({ children, className = "" }) {
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

    // Pointer state (normalized -1..1 relative to phone center)
    let targetPx = 0;
    let targetPy = 0;
    let curPx = 0;
    let curPy = 0;
    let isHovered = false;
    let isDown = false;
    let pointerActive = false;

    // Spring state for press/jiggle
    let pressPos = 0;
    let pressVel = 0;
    let nextAutoPress = performance.now() + 3200;

    const onPointerMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      // React within a generous radius around the phone
      const nx = (e.clientX - cx) / (rect.width * 1.4);
      const ny = (e.clientY - cy) / (rect.height * 1.1);
      const dist = Math.hypot(nx, ny);

      if (dist < 1.6) {
        const falloff = Math.max(0, 1 - dist / 1.6);
        targetPx = Math.max(-1, Math.min(1, nx)) * (0.45 + 0.55 * falloff);
        targetPy = Math.max(-1, Math.min(1, ny)) * (0.45 + 0.55 * falloff);
        pointerActive = true;
      } else {
        targetPx = 0;
        targetPy = 0;
        pointerActive = false;
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
    };

    const onPointerLeave = () => {
      isHovered = false;
      isDown = false;
    };

    const onPointerDown = (e) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      isDown = true;
      // Impulse kick for tactile jiggle
      pressVel += 2.2;
    };

    const onPointerUp = () => {
      if (isDown) {
        isDown = false;
        pressVel -= 1.4;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    wrap.addEventListener("pointerenter", onPointerEnter);
    wrap.addEventListener("pointerleave", onPointerLeave);
    wrap.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    const tick = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Periodic subtle self-press every ~6s when idle
      if (now >= nextAutoPress) {
        if (!isDown) {
          pressVel += 3.2;
        }
        nextAutoPress = now + 5800;
      }

      // Smooth pointer follow
      const followRate = 1 - Math.exp(-8.5 * dt);
      curPx += (targetPx - curPx) * followRate;
      curPy += (targetPy - curPy) * followRate;

      // Spring physics for press/sink (underdamped for subtle jiggle)
      const pressTarget = isDown ? 1 : isHovered ? 0.36 : 0;
      const stiffness = 240;
      const damping = 16;
      const accel = (pressTarget - pressPos) * stiffness - pressVel * damping;
      pressVel += accel * dt;
      pressPos += pressVel * dt;

      // Autonomous BerylCap-style drift & bob
      const t = now / 1000;
      const driftTiltY = Math.sin(t * ((2 * Math.PI) / 8.0)) * 5.5;
      const driftTiltX = Math.cos(t * ((2 * Math.PI) / 6.5)) * 3.2;
      const driftRoll = Math.sin(t * ((2 * Math.PI) / 9.5)) * 1.6;
      const bobY = Math.sin(t * ((2 * Math.PI) / 4.2)) * 7;

      // Combine autonomous drift + pointer turn + press sink
      const rotY = driftTiltY + curPx * 13;
      const rotX = driftTiltX - curPy * 10 - pressPos * 4.5;
      const rotZ = driftRoll + curPx * 1.8;
      const shiftX = curPx * 12;
      const shiftY = bobY + curPy * 9 + pressPos * 10;
      const scale = 1 - pressPos * 0.055;

      body.style.transform = `perspective(1050px) translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

      if (sheen) {
        sheen.style.opacity = isHovered || pointerActive ? "1" : "0.35";
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerenter", onPointerEnter);
      wrap.removeEventListener("pointerleave", onPointerLeave);
      wrap.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`hero-w-phone-interactive ${className}`.trim()}>
      <div ref={bodyRef} className="hero-w-phone-body">
        {children}
        <div ref={sheenRef} className="hero-w-phone-sheen" aria-hidden="true" />
      </div>
    </div>
  );
}
