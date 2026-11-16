import { useEffect } from "react";
import Lenis from "lenis";

/* Lenis smooth scroll, disabled when a lock (menu or panel) is active. */
export default function useSmoothScroll(locked) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let id;
    const raf = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    window.__lenis = lenis;
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    const lenis = window.__lenis;
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [locked]);
}
