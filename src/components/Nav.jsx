import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, SITE } from "../content";
import logoProject from "../logo/logo project.png";
import UnderlineLink from "./UnderlineLink";

export default function Nav({ menuOpen, onOpenContact, onOpenMenu }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 24);

      if (menuOpen || y < 48) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <header className={`nav ${hidden && !menuOpen ? "is-hidden" : ""} ${scrolled ? "is-scrolled" : ""}`.trim()}>
      <div className="nav-pill">
        <Link to="/" className="nav-wordmark" aria-label={SITE.wordmark}>
          <img src={logoProject} alt={SITE.wordmark} className="nav-logo" />
        </Link>

        <ul className="nav-pill-links">
          <li>
            <UnderlineLink to="/features" className="lowercase">
              Features
            </UnderlineLink>
            <ul className="nav-menu">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <UnderlineLink to={`/features#${c.id}`} className="lowercase">
                    {c.label}
                  </UnderlineLink>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <UnderlineLink to="/about" className="lowercase">
              About
            </UnderlineLink>
          </li>
        </ul>

        <button type="button" className="nav-contact link-underline lowercase" onClick={onOpenContact}>
          Contact
          <span className="link-underline-line" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={onOpenMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="8" viewBox="0 0 20 8" fill="none">
            <line y1="0.5" x2="20" y2="0.5" stroke="currentColor" />
            <line y1="7.5" x2="20" y2="7.5" stroke="currentColor" />
          </svg>
        </button>
      </div>
    </header>
  );
}
