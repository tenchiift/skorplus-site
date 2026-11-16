import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { APP_URL, CATEGORIES, CTA, INTRO, REPO_URL, REVIEWS, STACK, WHY } from "../content";
import CtaRow from "../components/CtaRow";
import FeatureBentoPanel from "../components/FeatureBentoPanel";
import MorphingTabs from "../components/MorphingTabs";
import Reveal from "../components/Reveal";
import RingParticles from "../components/RingParticles";
import SurfaceSwitcher from "../components/SurfaceSwitcher";
import TestimonialMarquee from "../components/TestimonialMarquee";
import VideoShowcase from "../components/VideoShowcase";
import logoProject from "../logo/logo project.png";
import useDesktop from "../lib/useDesktop";

export default function Overview() {
  const desktop = useDesktop();
  const [activeTab, setActiveTab] = useState("all");
  const external = /^https?:/.test(APP_URL);

  const featureTabs = useMemo(
    () =>
      [{ id: "all", label: "All" }, ...CATEGORIES].map((cat) => ({
        id: cat.id,
        label: cat.label,
        content: <FeatureBentoPanel categoryId={cat.id} />,
      })),
    [],
  );

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          {desktop && <RingParticles count={150} />}
        </div>
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-split">
          <div className="hero-copy">
            <div className="hero-brand">
              <img src={logoProject} alt="SkorPlus" className="hero-logo" />
              <span className="surface-badge">A study companion for the whole semester</span>
            </div>
            <h1 className="text-big lowercase">Learn smarter, score better.</h1>
            <p className="hero-sub grey-02">{CTA.body}</p>
            <div className="hero-actions">
              <a
                className="cta-button lowercase"
                href={APP_URL}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <span>{CTA.button}</span>
                <span className="cta-arrow" aria-hidden="true">
                  <span>→</span>
                  <span>→</span>
                </span>
              </a>
              <Link className="cta-secondary grey-02 lowercase" to="/features">
                Explore features
                <span className="cta-arrow" aria-hidden="true">
                  <span>→</span>
                  <span>→</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="hero-showcase">
            <div className="hero-shot-desktop">
              <img
                src="/screenshots/desktop.png"
                alt="SkorPlus web app on desktop"
                loading="eager"
              />
            </div>
            <div className="hero-shot-ipad">
              <img
                src="/screenshots/ipad.png"
                alt="SkorPlus web app on iPad Pro 11"
                loading="eager"
              />
            </div>
            <div className="hero-shot-mobiles">
              <div className="hero-shot-mobile is-back">
                <img
                  src="/screenshots/mobile-2.png"
                  alt="SkorPlus mobile view 2"
                  loading="eager"
                />
              </div>
              <div className="hero-shot-mobile is-front">
                <img
                  src="/screenshots/mobile-1.png"
                  alt="SkorPlus mobile view 1"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoShowcase />

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

      <SurfaceSwitcher />

      <section className="section section-tight" id="features">
        <div className="sec-head">
          <h2 className="lowercase">Features · drag any tab to reorder</h2>
          <Link className="cta-secondary grey-02 lowercase" to="/features">
            All features
            <span className="cta-arrow" aria-hidden="true">
              <span>→</span>
              <span>→</span>
            </span>
          </Link>
        </div>

        <MorphingTabs
          items={featureTabs}
          value={activeTab}
          onValueChange={setActiveTab}
          ariaLabel="SkorPlus features by category"
        />
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
