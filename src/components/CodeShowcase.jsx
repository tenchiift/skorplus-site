import { useEffect, useState } from "react";
import { APP_URL, REPO_URL } from "../content";
import Reveal from "./Reveal";

const CODE_TABS = {
  study: `// SkorPlus · AI Study Buddy
import { useStudyBuddy } from "./hooks/useStudyBuddy";

export function StudySession() {
  const { ask, messages, loading } = useStudyBuddy("MAT1113");

  return (
    <Workspace
      topic="Integration by Parts"
      onSolve={(q) => ask(q)}
      loading={loading}
      history={messages}
    />
  );
}`,
  pulse: `// SkorPlus · Semester Pulse
export function getSemesterWeek(startDate) {
  const days = Math.floor((Date.now() - startDate) / 86400000);
  const week = Math.min(14, Math.max(1, Math.ceil(days / 7)));
  return week > 12 ? "Exam Week" : \`Week \${week} of 12\`;
}`,
};

export default function CodeShowcase() {
  const [tab, setTab] = useState("study");
  const [typedCount, setTypedCount] = useState(0);

  const fullText = CODE_TABS[tab];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedCount(fullText.length);
      return;
    }

    setTypedCount(0);
    const id = setInterval(() => {
      setTypedCount((c) => {
        if (c >= fullText.length) {
          clearInterval(id);
          return c;
        }
        return c + 3;
      });
    }, 20);

    return () => clearInterval(id);
  }, [tab, fullText]);

  return (
    <section className="section section-tight">
      <Reveal as="div" className="terminal-showcase">
        <div className="terminal-copy">
          <span className="surface-badge">Open Source · MIT</span>
          <h2 className="why-lead lowercase">Clean React architecture, ready to extend.</h2>
          <p className="grey-02">
            Built with React 19, Vite 6, and Supabase—inspect the components, swap models, or adapt it for your own campus.
          </p>
          <div className="hero-actions">
            <a className="cta-button lowercase" href={REPO_URL} target="_blank" rel="noreferrer">
              <span>View on GitHub</span>
              <span className="cta-arrow" aria-hidden="true">
                <span>→</span>
                <span>→</span>
              </span>
            </a>
            <a className="cta-secondary grey-02 lowercase" href={APP_URL} target="_blank" rel="noreferrer">
              Open live app
              <span className="cta-arrow" aria-hidden="true">
                <span>→</span>
                <span>→</span>
              </span>
            </a>
          </div>
        </div>

        <div className="terminal-window" aria-label="Interactive code editor preview">
          <div className="terminal-bar">
            <div className="terminal-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="terminal-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "study"}
                className={tab === "study" ? "is-active" : ""}
                onClick={() => setTab("study")}
              >
                StudySession.jsx
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "pulse"}
                className={tab === "pulse" ? "is-active" : ""}
                onClick={() => setTab("pulse")}
              >
                semesterPulse.js
              </button>
            </div>
          </div>

          <pre className="terminal-body">
            <code>
              {fullText.slice(0, typedCount)}
              <span className="terminal-cursor" aria-hidden="true">
                ▊
              </span>
            </code>
          </pre>
        </div>
      </Reveal>
    </section>
  );
}
