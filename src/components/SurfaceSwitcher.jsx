import { useState } from "react";
import { APP_URL } from "../content";
import Reveal from "./Reveal";

const SURFACES = [
  {
    id: "buddy",
    tag: "AI Study Buddy",
    title: "Guided explanations on demand",
    badge: "AI Chat · /ai-chat",
    shot: null,
    placeholderLabel: "Add AI Chat phone screenshot",
    stack: ["OpenRouter", "Vercel Serverless", "Supabase Auth & DB"],
    summary:
      "Built as a dedicated study chat that keeps full conversation context per student without exposing any API keys in the browser.",
    build: [
      "Every prompt goes through a Vercel serverless proxy to OpenRouter, keeping credentials strictly on the server.",
      "Chat threads, follow-up questions, and course context persist per student account in Supabase.",
      "Formatted for mobile and desktop so students can revise step-by-step from anywhere.",
    ],
  },
  {
    id: "scan",
    tag: "Scan & Solve",
    title: "Photo to worked solution",
    badge: "Vision Proxy",
    shot: null,
    placeholderLabel: "Add Scan & Solve phone screenshot",
    stack: ["OpenRouter Vision", "Vercel Serverless", "React 19"],
    summary:
      "Lets students snap or upload a handwritten math question and receive structured step-by-step working.",
    build: [
      "Handles camera capture and image uploads directly inside the React 19 dashboard.",
      "Sends the image payload through a server-side vision proxy to parse equations and generate worked steps.",
      "Breaks down final answers into readable intermediate steps instead of a single raw number.",
    ],
  },
  {
    id: "papers",
    tag: "Past Papers",
    title: "Real exam sets, updated live",
    badge: "Live Sync",
    shot: "/screenshots/mobile-2.png",
    stack: ["Supabase DB", "Supabase Storage", "Lecturer Portal"],
    summary:
      "Organizes past-year exam papers by topic so students can jump straight into real practice questions.",
    build: [
      "Lecturers upload PDFs and manage subtopic folders (Vector, Differentiation, and more) from their portal.",
      "Stored in Supabase Storage with instant database sync so new papers appear for students right away.",
      "Clean mobile-first card layout showing paper counts per topic at a glance.",
    ],
  },
  {
    id: "pulse",
    tag: "Semester Pulse",
    title: "Week 1 to Exam Week in one bar",
    badge: "Progress Engine",
    shot: "/screenshots/mobile-1.png",
    stack: ["React 19", "Supabase", "Dashboard"],
    summary:
      "Tracks where you stand in the semester automatically—from Week 1 through mid-sem break to final exams.",
    build: [
      "Set your semester start date once; the dashboard computes the active week and days left to finals.",
      "Supports mid-sem break toggles and exam countdown cards synced to your Supabase profile.",
      "Pairs live progress tracking with one-tap shortcuts to Scan Solve, AI Study Buddy, and Zep Quiz.",
    ],
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
        {/* Column 1: Surface Name / Tabs */}
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

        {/* Column 2: What we actually built */}
        <div className="surface-detail" role="tabpanel">
          <div className="surface-stack-pills">
            {current.stack.map((tech) => (
              <span key={tech} className="surface-tech-pill">
                {tech}
              </span>
            ))}
          </div>
          <h3 className="surface-detail-title">{current.tag}</h3>
          <p className="surface-detail-summary grey-02">{current.summary}</p>
          <ul className="surface-build-list">
            {current.build.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        {/* Column 3: Phone-sized screenshot */}
        <div className="surface-phone-col">
          <div className="surface-phone-frame">
            {current.shot ? (
              <img src={current.shot} alt={`${current.tag} mobile preview`} loading="lazy" />
            ) : (
              <div className="surface-phone-placeholder">
                <span className="surface-badge">{current.badge}</span>
                <p className="grey-02">{current.placeholderLabel}</p>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
