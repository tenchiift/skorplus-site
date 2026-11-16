import { REPO_URL } from "../content";

export default function Contact({ onOpenContact }) {
  return (
    <section className="section" style={{ paddingTop: "clamp(7rem, 14vw, 11rem)", paddingBottom: "clamp(4rem, 10vw, 8rem)" }}>
      <h1 className="text-big lowercase" style={{ maxWidth: "16ch" }}>
        Get in touch.
      </h1>
      <p className="grey-02" style={{ maxWidth: "48ch", marginTop: "clamp(1.5rem, 4vw, 2.5rem)" }}>
        SkorPlus is an open project. Ask the assistant for a quick tour, or read the full source and setup guide on
        GitHub. There is no contact form and no support inbox.
      </p>

      <div style={{ marginTop: "clamp(3rem, 8vw, 5rem)", maxWidth: "48rem" }}>
        <button type="button" className="cta lowercase" onClick={onOpenContact} style={{ width: "100%" }}>
          <span className="cta-top" aria-hidden="true">
            <i />
          </span>
          <span>Ask the assistant</span>
          <span className="cta-arrow" aria-hidden="true">
            <span>→</span>
            <span>→</span>
          </span>
        </button>

        <a className="cta lowercase" href={REPO_URL} target="_blank" rel="noreferrer">
          <span className="cta-top" aria-hidden="true">
            <i />
          </span>
          <span>Open GitHub</span>
          <span className="cta-arrow" aria-hidden="true">
            <span>→</span>
            <span>→</span>
          </span>
        </a>
      </div>
    </section>
  );
}
