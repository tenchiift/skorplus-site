import { useEffect, useRef } from "react";
import InteractivePhone from "./InteractivePhone";

const CHAPTERS = [
  {
    id: "study-smarter",
    word1: "STUDY",
    word2: "SMARTER",
    eyebrow: "Study smarter",
    heading: "AI Workspace",
    theme: "mint",
    beats: [
      {
        id: "buddy",
        title: "Guided explanations on demand.",
        body: "Chat with your AI Study Buddy with full semester context. Every prompt routes through a secure server proxy.",
        video: "/video/ai-study-buddy.webm",
        shot: null,
        badge: "AI Chat · /ai-chat",
      },
      {
        id: "scan",
        title: "Snap a question. Get the steps.",
        body: "Upload a handwritten math problem and receive clear, intermediate working instead of a single raw answer.",
        video: null,
        shot: null,
        badge: "Vision Proxy",
        placeholderLabel: "Add Scan & Solve recording",
      },
    ],
  },
  {
    id: "practise-everywhere",
    word1: "PRACTISE",
    word2: "EVERYWHERE",
    eyebrow: "Practise everywhere",
    heading: "Exam Prep",
    theme: "lavender",
    beats: [
      {
        id: "papers",
        title: "Real exam sets, updated live.",
        body: "Lecturers upload past-year PDFs by topic so you can jump straight into real practice questions anytime.",
        video: "/video/past-papers.mov",
        shot: "/screenshots/mobile-2.png",
        badge: "Live Sync",
      },
      {
        id: "pulse",
        title: "Week 1 to finals in one bar.",
        body: "Track your active semester week, mid-sem breaks, and days left to finals automatically.",
        video: null,
        shot: "/screenshots/mobile-1.png",
        badge: "Progress Engine",
      },
    ],
  },
];

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function ScrollFeatures() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const intro = root.querySelector("[data-tara-intro]");
    const chapters = Array.from(root.querySelectorAll("[data-tara-chapter]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      if (intro) {
        intro.style.setProperty("--c-prog", "1");
        intro.style.setProperty("--c-op", "1");
        intro.style.setProperty("--l1", "118%");
        intro.style.setProperty("--l2", "118%");
        intro.style.setProperty("--l3", "118%");
      }
      for (const ch of chapters) {
        ch.style.setProperty("--k-pos", "0");
        ch.style.setProperty("--kinetic-op", "1");
        ch.style.setProperty("--dot-x", "0vw");
        ch.style.setProperty("--dot-scale", "52");
        ch.style.setProperty("--dot-radius", "0%");
        ch.style.setProperty("--content-op", "1");
        ch.style.setProperty("--enter", "1");
        ch.style.setProperty("--s", "0");
      }
      return;
    }

    let raf = 0;
    let settleTimer = 0;
    let isSnapping = false;
    let snapUnlockTimer = 0;
    let lastTime = performance.now();

    const introState = intro
      ? {
          cur: { cProg: 0, cOp: 0, l1: 0, l2: 0, l3: 0 },
          target: { cProg: 0, cOp: 0, l1: 0, l2: 0, l3: 0 },
        }
      : null;

    const chapterStates = chapters.map(() => ({
      cur: { kPos: -1, kineticOp: 0, dotX: 55, dotScale: 1, dotRadius: 50, contentOp: 0, enter: 0, s: 0 },
      target: { kPos: -1, kineticOp: 0, dotX: 55, dotScale: 1, dotRadius: 50, contentOp: 0, enter: 0, s: 0 },
    }));

    const scrollToTarget = (targetY) => {
      if (Math.abs(window.scrollY - targetY) < 4) return;
      isSnapping = true;
      clearTimeout(snapUnlockTimer);
      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, { duration: 0.48 });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
      snapUnlockTimer = setTimeout(() => {
        isSnapping = false;
      }, 540);
    };

    const settleToCompleteState = () => {
      if (isSnapping) return;
      const vh = window.innerHeight || 900;
      const docY = window.scrollY || window.pageYOffset || 0;

      for (const ch of chapters) {
        const rect = ch.getBoundingClientRect();
        const scrollable = Math.max(1, ch.offsetHeight - vh);
        const chapterTopDoc = docY + rect.top;

        // If user stopped inside the dot-zoom entry before Beat 0 is complete
        if (rect.top > 0 && rect.top < vh * 0.45) {
          scrollToTarget(chapterTopDoc + scrollable * 0.28);
          return;
        }

        // If chapter is actively pinned (rect.top <= 0 and rect.bottom >= vh)
        if (rect.top <= 0 && rect.bottom >= vh) {
          const p = clamp01(-rect.top / scrollable);

          // In the middle transition zone (between Beat 0 complete and Beat 1 complete)
          if (p < 0.18 || (p > 0.34 && p < 0.50)) {
            scrollToTarget(chapterTopDoc + scrollable * 0.28);
            return;
          }
          if (p >= 0.50 && p < 0.62) {
            scrollToTarget(chapterTopDoc + scrollable * 0.78);
            return;
          }
          if (p > 0.88 && p < 0.94) {
            scrollToTarget(chapterTopDoc + scrollable * 0.78);
            return;
          }
        }
      }
    };

    const computeTargets = () => {
      const vh = window.innerHeight || 900;

      if (intro && introState) {
        const rect = intro.getBoundingClientRect();
        const scrollable = Math.max(1, intro.offsetHeight - vh);
        const pre = clamp01((vh * 0.92 - rect.top) / (vh * 0.92));
        const ip = clamp01(-rect.top / scrollable);

        introState.target.cOp = easeInOut(clamp01(pre * 1.15 + ip * 2.5));
        introState.target.cProg = easeInOut(clamp01(pre * 0.72 + ip * 1.6));
        introState.target.l1 = clamp01((ip - 0.12) / 0.20) * 118;
        introState.target.l2 = clamp01((ip - 0.30) / 0.20) * 118;
        introState.target.l3 = clamp01((ip - 0.48) / 0.20) * 118;
      }

      chapters.forEach((ch, idx) => {
        const rect = ch.getBoundingClientRect();
        const scrollable = Math.max(1, ch.offsetHeight - vh);

        // Pre-lock entry (rect.top: 1.05*vh -> 0): words & dot slide in earlier from both sides
        const entry = easeInOut(clamp01((vh * 1.05 - rect.top) / (vh * 1.05)));
        const kineticOp = clamp01((vh * 1.05 - rect.top) / (vh * 0.25));

        // Sticky scroll progress (0 -> 1 while pinned)
        const p = clamp01(-rect.top / scrollable);

        // Once pinned (p: 0 -> 0.28): words keep sliding vice-versa (-exit) while dot zooms 1x -> 52x
        const exit = easeInOut(clamp01(p / 0.28));
        const kPos = entry - 1 + exit;

        const dotX = (1 - entry) * 55;
        const d = easeInOut(clamp01(p / 0.12));
        const dotScale = 1 + Math.pow(d, 1.8) * 52;
        const dotRadius = 50 - Math.pow(d, 2.4) * 50;

        // 0.08 -> 0.18: content enters right as the circle fills the screen
        const enterRaw = clamp01((p - 0.08) / 0.10);
        const enter = 1 - Math.pow(1 - enterRaw, 3);
        const contentOp = easeInOut(clamp01((p - 0.08) / 0.06));

        // 0.42 -> 0.58: phone switches from left (0) to right (1) in-place
        const s = easeInOut(clamp01((p - 0.42) / 0.16));

        const t = chapterStates[idx].target;
        t.kPos = kPos;
        t.kineticOp = kineticOp;
        t.dotX = dotX;
        t.dotScale = dotScale;
        t.dotRadius = dotRadius;
        t.contentOp = contentOp;
        t.enter = enter;
        t.s = s;
      });
    };

    const applyValues = () => {
      if (intro && introState) {
        const c = introState.cur;
        intro.style.setProperty("--c-prog", c.cProg.toFixed(4));
        intro.style.setProperty("--c-op", c.cOp.toFixed(4));
        intro.style.setProperty("--l1", `${c.l1.toFixed(2)}%`);
        intro.style.setProperty("--l2", `${c.l2.toFixed(2)}%`);
        intro.style.setProperty("--l3", `${c.l3.toFixed(2)}%`);
      }

      chapters.forEach((ch, idx) => {
        const c = chapterStates[idx].cur;
        ch.style.setProperty("--k-pos", c.kPos.toFixed(4));
        ch.style.setProperty("--kinetic-op", c.kineticOp.toFixed(4));
        ch.style.setProperty("--dot-x", `${c.dotX.toFixed(3)}vw`);
        ch.style.setProperty("--dot-scale", c.dotScale.toFixed(3));
        ch.style.setProperty("--dot-radius", `${c.dotRadius.toFixed(2)}%`);
        ch.style.setProperty("--content-op", c.contentOp.toFixed(4));
        ch.style.setProperty("--enter", c.enter.toFixed(4));
        ch.style.setProperty("--s", c.s.toFixed(4));
      });
    };

    const step = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const alpha = 1 - Math.exp(-8.5 * dt);
      let moving = false;

      if (introState) {
        for (const key of Object.keys(introState.cur)) {
          const diff = introState.target[key] - introState.cur[key];
          if (Math.abs(diff) > 0.0008) {
            introState.cur[key] += diff * alpha;
            moving = true;
          } else {
            introState.cur[key] = introState.target[key];
          }
        }
      }

      for (const st of chapterStates) {
        for (const key of Object.keys(st.cur)) {
          const diff = st.target[key] - st.cur[key];
          if (Math.abs(diff) > 0.0008) {
            st.cur[key] += diff * alpha;
            moving = true;
          } else {
            st.cur[key] = st.target[key];
          }
        }
      }

      applyValues();

      if (moving) {
        raf = requestAnimationFrame(step);
      } else {
        raf = 0;
      }
    };

    const kickLoop = () => {
      computeTargets();
      if (!raf) {
        lastTime = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    // Snap initial state on mount without lag
    computeTargets();
    if (introState) Object.assign(introState.cur, introState.target);
    chapterStates.forEach((st) => Object.assign(st.cur, st.target));
    applyValues();

    const onScroll = () => {
      kickLoop();
      if (!isSnapping) {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settleToCompleteState, 160);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", kickLoop);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleTimer);
      clearTimeout(snapUnlockTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", kickLoop);
    };
  }, []);

  return (
    <div ref={rootRef} className="tara-flow">
      {/* Intro Dual-Circle Statement */}
      <section data-tara-intro="" className="tara-intro">
        <div className="tara-intro-sticky">
          <div className="tara-circles" aria-hidden="true">
            <span className="tara-circle is-mint">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
              </svg>
            </span>
            <span className="tara-circle is-lavender">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <path d="M8 9h8M8 13h5" />
              </svg>
            </span>
          </div>

          <p className="tara-intro-lead">
            <span className="tara-intro-line is-1">SkorPlus gives you everything in one app:</span>
            <span className="tara-intro-line is-2">AI guidance when you&apos;re stuck, past papers when you&apos;re ready.</span>
            <span className="tara-intro-line is-3">You choose what to practise next.</span>
          </p>
        </div>
      </section>

      {/* Sticky Full-Screen Chapters */}
      {CHAPTERS.map((chapter) => (
        <section
          key={chapter.id}
          data-tara-chapter=""
          className={`tara-chapter-track tara-theme-${chapter.theme}`}
          aria-label={chapter.heading}
        >
          <div className="tara-chapter-sticky">
            {/* Layer 1 & 2: Kinetic Headline + Circle Dot that zooms in to fill the screen */}
            <div className="tara-kinetic-layer">
              <div className="tara-kinetic-line is-top">
                <span className="tara-word is-top">{chapter.word1}</span>
                <span className={`tara-dot tara-dot-${chapter.theme}`} aria-hidden="true" />
              </div>
              <div className="tara-kinetic-line is-bottom">
                <span className="tara-word is-bottom">{chapter.word2}</span>
              </div>
            </div>

            {/* Layer 3: Content revealed after circle fills viewport; beats switch in place */}
            <div className="tara-stage-layer">
              <header className="tara-chapter-head">
                <span className="tara-chapter-eyebrow">{chapter.eyebrow}</span>
                <h2 className="tara-chapter-title">{chapter.heading}</h2>
              </header>

              <div className="tara-stage-area">
                {/* Single Phone Frame that switches Left -> Right in place */}
                <div className="tara-stage-phone">
                  <InteractivePhone>
                    {chapter.beats.map((beat, idx) => (
                      <div
                        key={beat.id}
                        className={`tara-phone-media ${idx === 0 ? "is-beat-0" : "is-beat-1"}`}
                      >
                        {beat.video ? (
                          <video
                            src={beat.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            aria-label={`${beat.title} preview`}
                          />
                        ) : beat.shot ? (
                          <img src={beat.shot} alt={`${beat.title} preview`} loading="lazy" />
                        ) : (
                          <div className="tara-device-ph">
                            <span className="surface-badge">{beat.badge}</span>
                            <p className="grey-02">{beat.placeholderLabel}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </InteractivePhone>
                </div>

                {/* Copy 0 (Right side when Phone is Left) */}
                <div className="tara-stage-copy is-beat-0">
                  <h3>{chapter.beats[0].title}</h3>
                  <p>{chapter.beats[0].body}</p>
                </div>

                {/* Copy 1 (Left side when Phone switches Right) */}
                <div className="tara-stage-copy is-beat-1">
                  <h3>{chapter.beats[1].title}</h3>
                  <p>{chapter.beats[1].body}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
