import { useEffect, useRef, useState } from "react";

export default function VideoShowcase() {
  const wrapRef = useRef(null);
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const pillRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [playingIntro, setPlayingIntro] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(1);
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      const raw = (vh - rect.top) / (vh * 0.72);
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const pill = pillRef.current;
      if (pill) {
        current.current.x += (target.current.x - current.current.x) * 0.18;
        current.current.y += (target.current.y - current.current.y) * 0.18;
        pill.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onOtherPlay = (e) => {
      const vid = videoRef.current;
      if (!vid || e.detail === vid) return;
      vid.pause();
      vid.muted = true;
      vid.controls = false;
      setPlayingIntro(false);
    };
    window.addEventListener("skorplus:media-play", onOtherPlay);
    return () => window.removeEventListener("skorplus:media-play", onOtherPlay);
  }, []);

  const handlePointerEnter = (e) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.current = { x, y };
    current.current = { x, y };
    setHovered(true);
  };

  const handlePointerMove = (e) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    target.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerLeave = () => {
    setHovered(false);
  };

  const handlePlayIntro = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!playingIntro) {
      window.dispatchEvent(new CustomEvent("skorplus:media-play", { detail: vid }));
      vid.currentTime = 0;
      vid.muted = false;
      vid.controls = true;
      vid.play().catch(() => {});
      setPlayingIntro(true);
    } else {
      vid.muted = true;
      vid.controls = false;
      setPlayingIntro(false);
    }
  };

  const scale = 0.86 + progress * 0.14;
  const radius = 34 - progress * 14;

  return (
    <section className="video-zoom-section" ref={wrapRef} aria-label="SkorPlus intro video">
      <div
        ref={frameRef}
        className={`video-zoom-frame ${hovered && !playingIntro ? "is-hovered" : ""}`.trim()}
        style={{
          transform: `scale(${scale.toFixed(4)})`,
          borderRadius: `${radius.toFixed(1)}px`,
        }}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={!playingIntro ? handlePlayIntro : undefined}
      >
        {!playingIntro && (
          <div
            ref={pillRef}
            className={`video-intro-btn ${hovered ? "is-visible" : ""}`.trim()}
            aria-hidden="true"
          >
            <span className="video-intro-icon">▶</span>
            <span>Play intro</span>
          </div>
        )}

        <video
          ref={videoRef}
          className="video-zoom-media"
          src="/video/imbolden.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={(e) => window.dispatchEvent(new CustomEvent("skorplus:media-play", { detail: e.currentTarget }))}
        />
      </div>
    </section>
  );
}
