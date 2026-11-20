/* eslint-disable */
// User Cursor — Originkit

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";

const useIsStaticRenderer = () => false;

/**
 * UserCursor — a custom cursor follower that replaces the OS cursor across
 * the surface. An arrow glyph tracks the pointer with spring physics; a
 * colored label pill trails behind on a laggier spring, rocking with motion
 * and scaling while pressed.
 */
function __OriginkitBase_UserCursor(props) {
  props = { ...COMPONENT_DEFAULTS, ...props };
  const {
    name,
    arrow,
    label,
    color,
    textColor,
    size,
    labelTiltStrength,
    showLabel,
    offsetX,
    offsetY,
    labelOffsetX,
    labelOffsetY,
    labelOffsetUseDefault,
    pressScale,
    classNames,
    offset: offsetOverride,
    labelOffset: labelOffsetOverride,
    fullScreen = true,
    style,
  } = props;

  const hideNativeCursor = true;
  const hideOnTouch = true;
  const zIndex = 9999;

  const isStatic = useIsStaticRenderer();

  // --- touch detection -----------------------------------------------------
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    if (!hideOnTouch) {
      setIsTouchDevice(false);
      return;
    }
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(pointer: coarse)");
    const sync = () => setIsTouchDevice(!!mql.matches);
    sync();
    if (mql.addEventListener) {
      mql.addEventListener("change", sync);
      return () => mql.removeEventListener("change", sync);
    }
    mql.addListener?.(sync);
    return () => mql.removeListener?.(sync);
  }, [hideOnTouch]);

  // --- global native cursor hiding ----------------------------------------
  useEffect(() => {
    if (!fullScreen || isStatic || isTouchDevice || !hideNativeCursor) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    return () => {
      root.classList.remove("has-custom-cursor");
    };
  }, [fullScreen, isStatic, isTouchDevice, hideNativeCursor]);

  // --- container refs ------------------------------------------------------
  const containerRef = useRef(null);

  // --- visible state (gated by trigger + presence) ------------------------
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const arrowSpring = useMemo(
    () => ({ stiffness: 380, damping: 32, mass: 0.6 }),
    []
  );
  const labelSpringCfg = useMemo(
    () => ({ stiffness: 220, damping: 26, mass: 0.7 }),
    []
  );

  const resolvedOffset = useMemo(
    () => ({
      x: offsetOverride?.x ?? offsetX,
      y: offsetOverride?.y ?? offsetY,
    }),
    [offsetOverride?.x, offsetOverride?.y, offsetX, offsetY]
  );

  const resolvedLabelOffset = useMemo(() => {
    if (labelOffsetOverride) {
      return {
        x: labelOffsetOverride.x ?? size * 0.9,
        y: labelOffsetOverride.y ?? size * 0.2 + 6,
      };
    }
    if (labelOffsetUseDefault) {
      return { x: size * 0.9, y: size * 0.2 + 6 };
    }
    return { x: labelOffsetX, y: labelOffsetY };
  }, [
    labelOffsetOverride,
    labelOffsetUseDefault,
    labelOffsetX,
    labelOffsetY,
    size,
  ]);

  // --- motion values -------------------------------------------------------
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  // Track the pointer 1:1 with zero spring lag so the cursor feels instant.
  const arrowX = mouseX;
  const arrowY = mouseY;
  const labelX = useSpring(mouseX, labelSpringCfg);
  const labelY = useSpring(mouseY, labelSpringCfg);

  const scaleMV = useMotionValue(1);
  useEffect(() => {
    const controls = animate(scaleMV, pressed ? pressScale : 1, {
      type: "spring",
      stiffness: 500,
      damping: 28,
      mass: 0.5,
    });
    return () => controls.stop();
  }, [pressed, pressScale, scaleMV]);

  const labelTiltTarget = useMotionValue(0);
  const labelRotation = useSpring(labelTiltTarget, {
    stiffness: 200,
    damping: 24,
    mass: 0.6,
  });

  // --- pointer listeners ---------------------------------------------------
  const lastSampleRef = useRef(null);

  useEffect(() => {
    if (isStatic || isTouchDevice) return;
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    if (!fullScreen && !container) return;

    const getLocal = (clientX, clientY) => {
      if (fullScreen) return { x: clientX, y: clientY };
      const rect = container.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onMove = (e) => {
      const { x, y } = getLocal(e.clientX, e.clientY);

      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const last = lastSampleRef.current;
      let vx = 0;
      let vy = 0;
      if (last) {
        const dt = Math.max(1, now - last.t);
        vx = ((x - last.x) / dt) * 1000;
        vy = ((y - last.y) / dt) * 1000;
      }
      lastSampleRef.current = { x, y, t: now };

      mouseX.set(x + resolvedOffset.x);
      mouseY.set(y + resolvedOffset.y);

      const speed = Math.hypot(vx, vy);
      const norm = Math.min(1, speed / 1500);
      const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1;
      labelTiltTarget.set(sign * norm * labelTiltStrength);

      if (fullScreen) setHovering(true);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const onEnter = () => setHovering(true);
    const onLeave = () => {
      setHovering(false);
      setPressed(false);
      lastSampleRef.current = null;
      labelTiltTarget.set(0);
    };

    if (fullScreen) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("blur", onLeave);
      document.documentElement.addEventListener("mouseleave", onLeave);
    } else {
      const el = container;
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
    }

    return () => {
      if (fullScreen) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("blur", onLeave);
        document.documentElement.removeEventListener("mouseleave", onLeave);
      } else {
        const el = container;
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mousedown", onDown);
        el.removeEventListener("mouseup", onUp);
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      }
      setPressed(false);
    };
  }, [
    isStatic,
    isTouchDevice,
    fullScreen,
    labelTiltStrength,
    resolvedOffset.x,
    resolvedOffset.y,
    mouseX,
    mouseY,
    labelTiltTarget,
  ]);

  const visible = useMemo(() => {
    if (isStatic) return true;
    if (isTouchDevice) return false;
    return hovering;
  }, [isStatic, isTouchDevice, hovering]);

  const labelTranslateX = useTransform(
    labelX,
    (v) => v + resolvedLabelOffset.x
  );
  const labelTranslateY = useTransform(
    labelY,
    (v) => v + resolvedLabelOffset.y
  );

  // --- arrow content -------------------------------------------------------
  const arrowContent = useMemo(() => {
    if (typeof arrow === "function") {
      try {
        return arrow(color);
      } catch {
        return null;
      }
    }
    if (arrow !== undefined && arrow !== null) return arrow;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          overflow: "visible",
          filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.18))",
        }}
      >
        <path
          d="M5 3 L23 14 L14 16 L11 24 Z"
          fill={color}
          stroke="rgba(0,0,0,0.22)"
          strokeWidth={0.75}
          strokeLinejoin="round"
        />
      </svg>
    );
  }, [arrow, color, size]);

  // --- label content -------------------------------------------------------
  const labelContent = useMemo(() => {
    if (label !== undefined && label !== null) return label;
    return (
      <div
        className={classNames?.labelText}
        style={{
          color: textColor,
          fontSize: Math.max(7, size * 0.43),
          lineHeight: 1.1,
          fontWeight: 600,
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          whiteSpace: "nowrap",
          letterSpacing: 0.1,
        }}
      >
        {name}
      </div>
    );
  }, [label, name, textColor, size, classNames?.labelText]);

  if (isTouchDevice) return null;

  const layerStyle = {
    position: fullScreen ? "fixed" : "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex,
  };

  if (fullScreen) {
    return (
      <CursorLayer
        layerStyle={layerStyle}
        visible={visible}
        arrowX={arrowX}
        arrowY={arrowY}
        labelX={labelTranslateX}
        labelY={labelTranslateY}
        labelRotation={labelRotation}
        scale={scaleMV}
        showLabel={showLabel}
        color={color}
        size={size}
        arrowContent={arrowContent}
        labelContent={labelContent}
        classNames={classNames}
      />
    );
  }

  const hostStyle = {
    position: "relative",
    width: 200,
    height: 200,
    overflow: "hidden",
    cursor: hideNativeCursor ? "none" : undefined,
    ...style,
  };

  return (
    <div ref={containerRef} className={classNames?.root} style={hostStyle}>
      <CursorLayer
        layerStyle={layerStyle}
        visible={visible}
        arrowX={arrowX}
        arrowY={arrowY}
        labelX={labelTranslateX}
        labelY={labelTranslateY}
        labelRotation={labelRotation}
        scale={scaleMV}
        showLabel={showLabel}
        color={color}
        size={size}
        arrowContent={arrowContent}
        labelContent={labelContent}
        classNames={classNames}
      />
    </div>
  );
}

function CursorLayer({
  layerStyle,
  visible,
  arrowX,
  arrowY,
  labelX,
  labelY,
  labelRotation,
  scale,
  showLabel,
  color,
  size,
  arrowContent,
  labelContent,
  classNames,
}) {
  return (
    <div style={layerStyle} aria-hidden="true">
      {showLabel && (
        <motion.div
          className={classNames?.label}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            x: labelX,
            y: labelY,
            rotate: labelRotation,
            scale,
            background: color,
            borderRadius: 999,
            padding: `${size * 0.18}px ${size * 0.36}px`,
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06)",
            opacity: visible ? 1 : 0,
            transformOrigin: "0% 50%",
            transition: "opacity 140ms ease",
            willChange: "transform, opacity",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {labelContent}
        </motion.div>
      )}

      <motion.div
        className={classNames?.cursor}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x: arrowX,
          y: arrowY,
          scale,
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          transformOrigin: "0% 0%",
          transition: "opacity 140ms ease",
          willChange: "transform, opacity",
          pointerEvents: "none",
        }}
      >
        <div
          className={classNames?.arrow}
          style={{ width: size, height: size }}
        >
          {arrowContent}
        </div>
      </motion.div>
    </div>
  );
}

const COMPONENT_DEFAULTS = {
  color: "#FFFFFF",
  size: 56,
  pressScale: 0.92,
  offsetX: 0,
  offsetY: 0,
  showLabel: false,
  name: "",
  textColor: "#000000",
  labelTiltStrength: 25,
  labelOffsetUseDefault: true,
  labelOffsetX: 25,
  labelOffsetY: 12,
};

const __originkitPresetProps = {
  size: 31,
};

export default function UserCursor(props) {
  return (
    <__OriginkitBase_UserCursor {...__originkitPresetProps} {...props} />
  );
}
