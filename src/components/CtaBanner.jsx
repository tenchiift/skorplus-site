import { CTA, APP_URL } from "../content";
import Reveal from "./Reveal";

export default function CtaBanner() {
  const external = /^https?:/.test(APP_URL);

  return (
    <section className="section">
      <div className="cta-banner">
        <div className="cta-banner-bg" aria-hidden="true" />
        <Reveal as="div" className="cta-banner-inner">
          <span className="surface-badge">SkorPlus · Open Source</span>
          <h2 className="text-big lowercase">{CTA.title}</h2>
          <p className="grey-02">{CTA.body}</p>
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
        </Reveal>
      </div>
    </section>
  );
}
