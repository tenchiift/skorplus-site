import { useState } from "react";
import { APP_URL } from "../content";
import ImgLoad from "./ImgLoad";
import Reveal from "./Reveal";

const SURFACES = [
  {
    id: "buddy",
    tag: "AI Study Buddy",
    title: "Guided explanations on demand",
    body: "Ask follow-up questions on calculus, discrete math, or past-paper steps with history saved per account.",
    shot: "/shots/onboarding-1.png",
    badge: "Serverless OpenRouter proxy",
  },
  {
    id: "scan",
    tag: "Scan & Solve",
    title: "Photo to worked solution",
    body: "Upload or snap a handwritten problem and get step-by-step reasoning without exposing API keys in the browser.",
    shot: "/shots/onboarding-2.png",
    badge: "Image-to-steps",
  },
  {
    id: "papers",
    tag: "Past Papers",
    title: "Real exam sets, updated live",
    body: "Browse past-year papers and practice sets managed directly by lecturers through Supabase.",
    shot: "/shots/login.png",
    badge: "Instant sync",
  },
  {
    id: "pulse",
    tag: "Semester Pulse",
    title: "Week 1 to Exam Week in one bar",
    body: "Set your semester start date once and track every week through Study Week and finals.",
    shot: "/shots/get-started.png",
    badge: "Progress tracker",
  },
];

export default function SurfaceSwitcher() {
  const [activeId, setActiveId] = useState(SURFACES[0].id);
  const current = SURFACES.find((s) => s.id === activeId) || SURFACES[0];

  return (
    <section className="section section-tight">
      <div className="sec-head">
        <h2 className="lowercase">Core surfaces</h2>
        <a className="cta-secondary grey-02 lowercase" href={APP_URL} target="_blank" rel="noreferrer">
          Open app
          <span className="cta-arrow" aria-hidden="true">
            <span>→</span>
            <span>→</span>
          </span>
        </a>
      </div>

      <Reveal as="div" className="surface-switcher">
        <div className="surface-tabs" role="tablist" aria-label="SkorPlus surfaces">
          {SURFACES.map((s, idx) => {
            const selected = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`surface-tab ${selected ? "is-active" : ""}`.trim()}
                onClick={() => setActiveId(s.id)}
              >
                <span className="tool-num">{String(idx + 1).padStart(2, "0")}</span>
                <div>
                  <span className="surface-tab-title">{s.tag}</span>
                  <span className="surface-tab-sub">{s.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="surface-stage" role="tabpanel">
          <div className="surface-stage-media">
            <ImgLoad key={current.shot} src={current.shot} alt={`${current.tag} preview`} />
          </div>
          <div className="surface-stage-body">
            <span className="surface-badge">{current.badge}</span>
            <h3 className="tool-name">{current.title}</h3>
            <p className="grey-02">{current.body}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
