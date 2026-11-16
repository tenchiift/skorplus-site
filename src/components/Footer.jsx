import { Link } from "react-router-dom";
import { REPO_URL, SITE } from "../content";
import Marquee from "./Marquee";
import UnderlineLink from "./UnderlineLink";

export default function Footer({ onOpenContact }) {
  return (
    <footer className="foot">
      <Marquee items={[SITE.wordmark, "study companion", "open source"]} />

      <div className="foot-grid" style={{ marginTop: "clamp(3rem, 8vw, 6rem)" }}>
        <div className="foot-col">
          <p>Ask</p>
          <button type="button" className="link-underline lowercase" onClick={onOpenContact}>
            Ask the assistant
            <span className="link-underline-line" aria-hidden="true" />
          </button>
        </div>

        <div className="foot-col">
          <p>Project</p>
          <UnderlineLink to="/features" className="lowercase">
            Features
          </UnderlineLink>
          <UnderlineLink to="/about" className="lowercase">
            About
          </UnderlineLink>
        </div>

        <div className="foot-col">
          <p>Built with</p>
          <span className="grey-02">React 19 and Vite 6</span>
          <span className="grey-02">Supabase</span>
          <span className="grey-02">Vercel and OpenRouter</span>
        </div>

        <div className="foot-col">
          <p>Source</p>
          <a className="link-underline lowercase" href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
            <span className="link-underline-line" aria-hidden="true" />
          </a>
          <a className="link-underline lowercase" href={REPO_URL} target="_blank" rel="noreferrer">
            MIT license
            <span className="link-underline-line" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="foot-base">
        <span className="lowercase">{SITE.wordmark}, {SITE.tagline.toLowerCase()}.</span>
        <Link to="/contact" className="link-underline lowercase">
          Contact
          <span className="link-underline-line" aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}
