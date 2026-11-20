import { Link } from "react-router-dom";
import { APP_URL, INTRO, REPO_URL, REVIEWS, STACK, WHY } from "../content";
import CtaRow from "../components/CtaRow";
import FeatureBentoPanel from "../components/FeatureBentoPanel";
import FlyingCard from "../components/FlyingCard";
import Reveal from "../components/Reveal";
import CodeShowcase from "../components/CodeShowcase";
import ScrollFeatures from "../components/ScrollFeatures";
import TestimonialMarquee from "../components/TestimonialMarquee";
import VideoShowcase from "../components/VideoShowcase";
import logoProject from "../logo/logo project.png";

export default function Overview() {
  return (
    <>
      <section className="hero-wellifize">
        <div className="hero-w-head">
          <img src={logoProject} alt="SkorPlus" className="hero-w-logo" />
          <h1 className="hero-w-title">
            Learn Smarter,
            <br />
            Score Better.
          </h1>
          <p className="hero-w-sub">
            Built for <strong>KPMIM &amp; MAT1113</strong> students <br></br>track your semester,
            practise real past papers, and get guided AI explanations in one place.
          </p>
        </div>

        <div className="hero-w-stage">
          {/* Left Floating Pills + Mini Card */}
          <div className="hero-w-col is-left">
            <FlyingCard phase={0.2} floatAmplitude={2.5}>
              <div className="hero-w-pill is-offset-1 is-non-clickable">
                <span className="hero-w-icon is-lavender" aria-hidden="true">✦</span>
                <span className="hero-w-pill-label">AI Study Buddy</span>
              </div>
            </FlyingCard>

            <FlyingCard phase={1.7} floatAmplitude={3} className="is-offset-2">
              <div className="hero-w-pill is-non-clickable">
                <span className="hero-w-icon is-blue" aria-hidden="true">⌘</span>
                <span className="hero-w-pill-label">Scan &amp; Solve</span>
              </div>
            </FlyingCard>

            <FlyingCard phase={3.1} floatAmplitude={3.5} tiltStrength={14}>
              <div className="hero-w-card is-non-clickable">
                <div className="hero-w-card-head">
                  <strong>AI Study Buddy</strong>
                  <span>Stuck on a calculus step?</span>
                </div>
                <span className="hero-w-card-btn is-non-clickable">
                  Open SkorPlus
                </span>
              </div>
            </FlyingCard>
          </div>

          {/* Center Upright iPhone */}
          <div className="hero-w-phone">
            <img
              src="/screenshots/mobile-1.png"
              alt="SkorPlus Semester Pulse dashboard"
              loading="eager"
            />
          </div>

          {/* Right Floating Pill + Live Stats Card */}
          <div className="hero-w-col is-right">
            <FlyingCard phase={0.9} floatAmplitude={2.8}>
              <div className="hero-w-pill is-non-clickable">
                <span className="hero-w-icon is-mint" aria-hidden="true">✓</span>
                <span className="hero-w-pill-label">Past Papers · Live Sync</span>
              </div>
            </FlyingCard>

            <FlyingCard phase={2.4} floatAmplitude={3.5} tiltStrength={14}>
              <div className="hero-w-card hero-w-stats is-non-clickable">
                <div className="hero-w-stats-top">
                  <span>Updated live · Semester Pulse</span>
                  <span aria-hidden="true">↻</span>
                </div>
                <ul className="hero-w-stats-list">
                  <li>
                    <span aria-hidden="true">◷</span>
                    <span>Week 7 · Day 5</span>
                  </li>
                  <li>
                    <span aria-hidden="true">⚡</span>
                    <span>59 days to finals</span>
                  </li>
                  <li>
                    <span aria-hidden="true">✦</span>
                    <span>Zep Quiz ready</span>
                  </li>
                </ul>
              </div>
            </FlyingCard>
          </div>
        </div>
      </section>

      <VideoShowcase />

      <ScrollFeatures />

      <section className="section section-tight">
        <div className="why-split">
          <Reveal as="div" className="why-copy">
            <span className="surface-badge">{WHY.heading}</span>
            <h2 className="why-lead lowercase">{WHY.lead}</h2>
            <p className="why-body grey-02">{WHY.body}</p>
            <p className="why-body grey-02">{INTRO}</p>
            <Link className="cta-secondary lowercase" to="/about">
              About &amp; approach
              <span className="cta-arrow" aria-hidden="true">
                <span>→</span>
                <span>→</span>
              </span>
            </Link>
          </Reveal>

          <Reveal as="div" delay={90} className="why-media">
            <video
              src="/video/animation-imbolden.mp4"
              loop
              playsInline
              controls
              preload="metadata"
              onPlay={(e) => {
                const el = e.currentTarget;
                window.dispatchEvent(new CustomEvent("skorplus:media-play", { detail: el }));
                if (!el._listening) {
                  el._listening = true;
                  window.addEventListener("skorplus:media-play", (ev) => {
                    if (ev.detail !== el) el.pause();
                  });
                }
              }}
            />
          </Reveal>
        </div>
      </section>

      <section className="section section-tight" id="features">
        <div className="sec-head">
          <h2 className="lowercase">Features</h2>
          <Link className="cta-secondary grey-02 lowercase" to="/features">
            All features
            <span className="cta-arrow" aria-hidden="true">
              <span>→</span>
              <span>→</span>
            </span>
          </Link>
        </div>

        <FeatureBentoPanel categoryId="all" />
      </section>

      <section className="section section-tight">
        <div className="sec-head">
          <h2 className="lowercase">Built for everyone in the room</h2>
        </div>
        <div className="dual-split">
          <Reveal as="article" className="dual-card dual-card-primary">
            <span className="surface-badge">Available at no charge</span>
            <h3 className="tool-name">For students</h3>
            <p>
              Track your semester week by week, practise real past papers, and get guided AI explanations without paywalls.
            </p>
            <a className="dual-link" href={APP_URL} target="_blank" rel="noreferrer">
              Open SkorPlus →
            </a>
          </Reveal>
          <Reveal as="article" delay={90} className="dual-card">
            <span className="surface-badge">Open source · MIT</span>
            <h3 className="tool-name">For lecturers &amp; teams</h3>
            <p className="grey-02">
              Upload past papers, manage module questions, and review student submissions from a single lecturer inbox.
            </p>
            <a className="dual-link" href={REPO_URL} target="_blank" rel="noreferrer">
              View source on GitHub →
            </a>
          </Reveal>
        </div>
      </section>

      <CodeShowcase />

      <section className="section section-tight">
        <div className="sec-head">
          <h2 className="lowercase">Reviews from students</h2>
        </div>
        <TestimonialMarquee reviews={REVIEWS} />
      </section>

      <section className="section section-tight">
        <div className="sec-head">
          <h2 className="lowercase">Behind the project</h2>
        </div>
        <dl className="stack-list" style={{ maxWidth: "60rem" }}>
          {STACK.map(([dt, dd]) => (
            <div className="stack-row" key={dt}>
              <dt className="lowercase">{dt}</dt>
              <dd style={{ margin: 0 }}>{dd}</dd>
            </div>
          ))}
        </dl>
        <div style={{ marginTop: "clamp(2rem, 5vw, 3rem)", maxWidth: "60rem" }}>
          <CtaRow to="/about">About &amp; approach</CtaRow>
        </div>
      </section>

      <div style={{ height: "clamp(3rem, 8vw, 6rem)" }} />
    </>
  );
}
