import { APP_URL, CATEGORIES, FEATURES } from "../content";

const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export default function FeatureBentoPanel({ categoryId = "all" }) {
  if (categoryId !== "all") {
    const shown = FEATURES.filter((f) => f.category === categoryId);
    return (
      <div className="bento-grid bento-grid-compact">
        {shown.map((f, idx) => (
          <article
            key={f.name}
            className={`bento-card bento-compact ${idx === 0 ? "bento-hero" : ""}`.trim()}
          >
            <div className="bento-body">
              <div className="bento-top">
                <span className="tool-num">{String(FEATURES.indexOf(f) + 1).padStart(2, "0")}</span>
                <span className="tool-cat">{catLabel(f.category)}</span>
              </div>
              <h3 className="tool-name">{f.name}</h3>
              <p className={idx === 0 ? "bento-hero-desc" : "grey-02"}>{f.detail}</p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="bento-grid bento-grid-compact bento-reference">
      {/* Row 1 Left (span 2): Hero Hub */}
      <article className="bento-card bento-wide bento-hero bento-ref-hero">
        <div className="bento-ref-hero-top">
          <span className="bento-pill-glass">IUIC 2026</span>
          <h3 className="bento-ref-title-lg">SKOR+ Learning Hub</h3>
          <p className="bento-hero-desc">
            AI study buddy, step-by-step math guidance, and gamified mastery in one place.
          </p>
        </div>

        <div className="bento-ref-stage">
          <span className="bento-float-tag is-green">MAT1113</span>
          <span className="bento-float-tag is-rose">XP +250</span>
          <span className="bento-float-tag is-cyan">Streak</span>
          <span className="bento-float-tag is-white">Step-by-Step!</span>

          <div className="bento-mini-pair">
            <div className="bento-mini-card is-left">
              <span className="bento-mini-dot" />
              <strong>AI Study Buddy</strong>
              <small>Guided proofs &amp; limits</small>
            </div>
            <div className="bento-mini-card is-right">
              <span className="bento-mini-dot is-amber" />
              <strong>CalcQuest RPG</strong>
              <small>2D pixel boss battles</small>
            </div>
          </div>

          <div className="bento-center-orb" aria-hidden="true">
            S+
          </div>
        </div>
      </article>

      {/* Row 1 Right (span 1): Past Papers & Modules */}
      <article className="bento-card bento-compact bento-ref-card">
        <div className="bento-ref-head">
          <h3>Past Papers &amp; Modules</h3>
          <p className="grey-02">Curated exam sets with worked steps</p>
        </div>
        <div className="bento-book-wrap" aria-hidden="true">
          <div className="bento-book-back is-rose" />
          <div className="bento-book-back is-violet" />
          <div className="bento-book-front">
            <div>
              <span className="bento-line is-short is-purple" />
              <span className="bento-line" />
              <span className="bento-line is-mid" />
            </div>
            <div>
              <span className="bento-line is-short is-green" />
              <span className="bento-line" />
              <span className="bento-line is-mid" />
            </div>
          </div>
        </div>
        <div className="bento-ref-foot">
          <a className="bento-3d-btn" href={APP_URL} target="_blank" rel="noreferrer">
            Explore Papers
          </a>
        </div>
      </article>

      {/* Row 2 Left: Scan & Solve */}
      <article className="bento-card bento-compact bento-ref-card">
        <div className="bento-ref-head">
          <h3>Scan &amp; Solve</h3>
          <p className="grey-02">Snap equations for instant worked steps</p>
        </div>
        <div className="bento-chat-mock" aria-hidden="true">
          <span className="bento-status-pill is-left">Scanning</span>
          <div className="bento-chat-bubble">Walk through ∫ x² cos(x) dx?</div>
          <span className="bento-status-pill is-right">Solved ✓</span>
        </div>
        <div className="bento-input-mock" aria-hidden="true">
          <span>Solve ∫ x² dx...</span>
          <span className="bento-send-dot">✦</span>
        </div>
      </article>

      {/* Row 2 Center: Core Math & Tasks */}
      <article className="bento-card bento-compact bento-ref-card">
        <div className="bento-pills-mock" aria-hidden="true">
          <div className="bento-pills-row is-tilt-l">
            <span className="bento-chip is-solid">AI</span>
            <span className="bento-chip">MAT1113</span>
          </div>
          <span className="bento-chip is-tilt-r">Calculus &amp; Discrete</span>
          <span className="bento-chip is-tilt-l">Tasks &amp; Priorities</span>
        </div>
        <div className="bento-ref-head is-bottom">
          <h3>Modules &amp; Tasks</h3>
          <p className="grey-02">Structured syllabus tracks &amp; study checklist</p>
        </div>
      </article>

      {/* Row 2 Right: Friends & Send Work */}
      <article className="bento-card bento-compact bento-ref-card">
        <div className="bento-ref-head">
          <h3>Friends &amp; Send Work</h3>
          <p className="grey-02">Submit work and follow cohort progress</p>
        </div>
        <div className="bento-overlap-mock" aria-hidden="true">
          <div className="bento-overlap-top">
            <strong>Lab 04 · Calculus</strong>
            <span className="bento-mini-pill">Reviewed</span>
          </div>
          <div className="bento-overlap-bottom">
            Lecturer inbox &amp; peer progress synced in real time.
          </div>
        </div>
      </article>

      {/* Row 3 Full (span 3): Semester Pulse */}
      <article className="bento-card bento-full bento-ref-banner">
        <div className="bento-ref-banner-head">
          <h3>Semester Pulse</h3>
          <p className="grey-02">
            Count Week 1 through Study Week to Exam Week in one animated bar.
          </p>
        </div>
        <div className="bento-ref-banner-row">
          <span className="bento-3d-btn">Week 1 → Finals</span>
          <div className="bento-banner-cta">
            <span>Ready to level up your semester?</span>
            <a className="bento-3d-btn" href={APP_URL} target="_blank" rel="noreferrer">
              Open SkorPlus →
            </a>
          </div>
          <div className="bento-banner-list" aria-hidden="true">
            <span>✦ AI Study Buddy</span>
            <span>✦ Past Papers</span>
            <span>✦ Semester Pulse</span>
          </div>
        </div>
      </article>
    </div>
  );
}
