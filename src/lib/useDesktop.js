import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 64rem)";

/* True on wide screens. Shader backgrounds mount only here; phones get the gradient. */
export default function useDesktop() {
  const [desktop, setDesktop] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(DESKTOP_QUERY).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return desktop;
}
