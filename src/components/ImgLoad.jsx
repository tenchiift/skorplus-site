import { useEffect, useRef, useState } from "react";

/* Image that scales down and fades in once it has loaded and is in view. */
export default function ImgLoad({ src, alt, className = "", aspect }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    if (img.complete && img.naturalWidth) setLoaded(true);
  }, []);

  return (
    <div
      className={`img-load ${loaded ? "is-loaded" : ""} ${className}`.trim()}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <img ref={ref} src={src} alt={alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} />
    </div>
  );
}
