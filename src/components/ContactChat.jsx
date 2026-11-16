import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHAT } from "../content";

/* Anonymous, scripted assistant. No fabricated person, email, or claim. */
export default function ContactChat({ open, onClose }) {
  const [path, setPath] = useState(["start"]);
  const [choices, setChoices] = useState([]);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setPath(["start"]);
      setChoices([]);
      closeRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [path, choices, open]);

  if (!open) return null;

  const current = CHAT[path[path.length - 1]] ?? CHAT.start;

  const choose = (opt) => {
    if (opt.href) {
      window.open(opt.href, "_blank", "noreferrer");
      return;
    }
    if (opt.to && opt.to.startsWith("/")) {
      onClose();
      navigate(opt.to);
      return;
    }
    setChoices((c) => [...c, opt.label]);
    setPath((p) => [...p, opt.to]);
  };

  const items = [];
  path.forEach((id, i) => {
    (CHAT[id]?.messages ?? []).forEach((text, j) => {
      items.push({ key: `${id}-${i}-${j}`, who: "host", text });
    });
    if (i < choices.length) items.push({ key: `me-${i}`, who: "me", text: choices[i] });
  });

  return (
    <div className="chat-veil" onClick={onClose}>
      <section
        className="chat"
        role="dialog"
        aria-modal="true"
        aria-label="SkorPlus assistant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chat-head">
          <p className="lowercase">skorplus assistant</p>
          <button ref={closeRef} className="chat-close" type="button" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path
                d="M10.025 0 10.85.825 6.275 5.425l4.575 4.6-.825.825L5.425 6.275.85 10.85 0 10.025 4.575 5.425 0 .85.85 0l4.575 4.6L10.025 0Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className="chat-scroll" ref={scrollRef}>
          {items.map((it) => (
            <div key={it.key} className={`bubble ${it.who === "host" ? "bubble-host" : "bubble-me"}`}>
              {it.text}
            </div>
          ))}
        </div>

        <div className="chat-options">
          {current.options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              className={`chat-opt ${opt.href ? "a" : ""}`.trim()}
              onClick={() => choose(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
