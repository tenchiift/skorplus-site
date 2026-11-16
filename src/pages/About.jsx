import { ARTWORK, PILLARS, STACK, STATEMENT } from "../content";
import CtaRow from "../components/CtaRow";
import ImgLoad from "../components/ImgLoad";
import Reveal from "../components/Reveal";

export default function About() {
  return (
    <section className="section" style={{ paddingTop: "clamp(7rem, 14vw, 11rem)", paddingBottom: "clamp(4rem, 10vw, 8rem)" }}>
      <h1 className="sr-only">About SkorPlus</h1>

      <h2 className="text-big grey-02 lowercase">skorplus</h2>
      <div className="grid" style={{ marginTop: "clamp(1.5rem, 4vw, 2.5rem)" }}>
        <p className="text-big indent" style={{ gridColumn: "1 / -1" }}>
          {STATEMENT}
        </p>
      </div>

      <div style={{ marginTop: "clamp(4rem, 10vw, 7rem)" }}>
        <div className="sec-head">
          <h2 className="lowercase">Approach</h2>
        </div>
        {PILLARS.map((p, i) => (
          <Reveal as="div" className="feature-item" key={p.name}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
              <span className="feature-tag">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="lowercase">{p.name}</h3>
            </div>
            <p>{p.detail}</p>
          </Reveal>
        ))}
      </div>

      <div style={{ marginTop: "clamp(4rem, 10vw, 7rem)" }}>
        <div className="sec-head">
          <h2 className="lowercase">Illustration</h2>
          <span className="grey-02 lowercase">Drawn for the app</span>
        </div>
        <div className="tile-grid cols-4">
          {ARTWORK.map((s) => (
            <Reveal as="figure" className="tile" key={s.src} style={{ margin: 0 }}>
              <div className="tile-media square art">
                <ImgLoad src={s.src} alt={`${s.label} illustration from SkorPlus`} />
              </div>
              <figcaption className="tile-sub">{s.label}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "clamp(4rem, 10vw, 7rem)" }}>
        <div className="sec-head">
          <h2 className="lowercase">Built with</h2>
        </div>
        <dl className="stack-list" style={{ maxWidth: "60rem" }}>
          {STACK.map(([dt, dd]) => (
            <div className="stack-row" key={dt}>
              <dt className="lowercase">{dt}</dt>
              <dd style={{ margin: 0 }}>{dd}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div style={{ marginTop: "clamp(3rem, 8vw, 6rem)" }}>
        <CtaRow href="https://github.com/tenchiift/ProjectSkorPlus-web">View the source</CtaRow>
      </div>
    </section>
  );
}
