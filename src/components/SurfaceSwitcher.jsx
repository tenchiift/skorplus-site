import { useMemo, useState } from "react";
import { APP_URL } from "../content";
import MorphingTabs from "./MorphingTabs";

const SURFACES = [
  {
    id: "buddy",
    tag: "AI Study Buddy",
    title: "Guided explanations on demand",
    badge: "AI Chat · /ai-chat",
    video: "/video/ai-study-buddy.webm",
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
    video: "/video/past-papers.mov",
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

  const surfaceTabs = useMemo(
    () =>
      SURFACES.map((surface) => ({
        id: surface.id,
        label: surface.tag,
        content: (
          <div className="surface-panel-grid">
            <div className="surface-detail">
              <div className="surface-stack-pills">
                {surface.stack.map((tech) => (
                  <span key={tech} className="surface-tech-pill">
                    {tech}
                  </span>
                ))}
              </div>
              <h3 className="surface-detail-title">{surface.tag}</h3>
              <p className="surface-detail-summary grey-02">{surface.summary}</p>
              <ul className="surface-build-list">
                {surface.build.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>

            <div className="surface-phone-col">
              <div className="surface-phone-frame">
                {surface.video ? (
                  <video
                    key={surface.video}
                    src={surface.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label={`${surface.tag} mobile preview`}
                  />
                ) : surface.shot ? (
                  <img src={surface.shot} alt={`${surface.tag} mobile preview`} loading="lazy" />
                ) : (
                  <div className="surface-phone-placeholder">
                    <span className="surface-badge">{surface.badge}</span>
                    <p className="grey-02">{surface.placeholderLabel}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ),
      })),
    [],
  );

  return (
    <section className="section section-tight">
      <div className="sec-head">
        <h2 className="lowercase">Core surfaces · drag any tab to reorder</h2>
        <a className="cta-secondary grey-02 lowercase" href={APP_URL} target="_blank" rel="noreferrer">
          Open app
          <span className="cta-arrow" aria-hidden="true">
            <span>→</span>
            <span>→</span>
          </span>
        </a>
      </div>

      <MorphingTabs
        items={surfaceTabs}
        value={activeId}
        onValueChange={setActiveId}
        ariaLabel="SkorPlus core surfaces"
      />
    </section>
  );
}
