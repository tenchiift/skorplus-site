import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, SITE } from "../content";

export default function MobileMenu({ open, onClose, onOpenContact }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <nav
      ref={ref}
      tabIndex={-1}
      className={`sheet ${open ? "open" : ""}`.trim()}
      aria-hidden={!open}
      aria-label="Menu"
    >
      <ul className="sheet-nav">
        <li>
          <a
            href="/features"
            className="lowercase"
            onClick={(e) => {
              e.preventDefault();
              go("/features");
            }}
          >
            Features
          </a>
        </li>
        <li>
          <ul className="sheet-sub">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <a
                  href={`/features#${c.id}`}
                  className="lowercase"
                  onClick={(e) => {
                    e.preventDefault();
                    go(`/features#${c.id}`);
                  }}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <a
            href="/about"
            className="lowercase"
            onClick={(e) => {
              e.preventDefault();
              go("/about");
            }}
          >
            About
          </a>
        </li>
      </ul>

      <ul className="sheet-sub" style={{ marginTop: "auto" }}>
        <li>
          <button
            type="button"
            className="link-underline lowercase"
            style={{ color: "var(--white)" }}
            onClick={() => {
              onClose();
              onOpenContact();
            }}
          >
            Contact
            <span className="link-underline-line" aria-hidden="true" />
          </button>
        </li>
        <li>
          <span className="lowercase">{SITE.subtitle}</span>
        </li>
      </ul>
    </nav>
  );
}
