const PLACEHOLDER_TILES = [
  {
    name: "Student 01",
    role: "MAT1113 · KPM",
    tag: "AI Study Buddy",
    quote: "Student review slot — add verified feedback from your cohort in content.js.",
    placeholder: true,
  },
  {
    name: "Student 02",
    role: "Pre-U Calculus",
    tag: "Scan & Solve",
    quote: "Student review slot — real student quotes will appear here once shared.",
    placeholder: true,
  },
  {
    name: "Student 03",
    role: "Diploma · UTHM",
    tag: "Past Papers",
    quote: "Student review slot — add verified feedback from your cohort in content.js.",
    placeholder: true,
  },
  {
    name: "Student 04",
    role: "Semester Pulse",
    tag: "Planning",
    quote: "Student review slot — real student quotes will appear here once shared.",
    placeholder: true,
  },
  {
    name: "Student 05",
    role: "CalcQuest RPG",
    tag: "Practice",
    quote: "Student review slot — add verified feedback from your cohort in content.js.",
    placeholder: true,
  },
];

export default function TestimonialMarquee({ reviews = [] }) {
  const source = reviews.length ? reviews : PLACEHOLDER_TILES;
  const items = [...source, ...source];

  return (
    <div className="testimonial-marquee" aria-label="Student reviews">
      <div className="testimonial-track">
        {items.map((item, idx) => (
          <article
            key={`${item.name}-${idx}`}
            className={`testimonial-tile ${item.placeholder ? "is-placeholder" : ""}`.trim()}
            aria-hidden={idx >= source.length}
          >
            <div className="testimonial-head">
              <span className="surface-badge">{item.tag || "Student"}</span>
              <span className="tool-num">{String((idx % source.length) + 1).padStart(2, "0")}</span>
            </div>
            <p className="testimonial-quote">“{item.quote}”</p>
            <footer className="testimonial-foot">
              <span className="testimonial-name">{item.name}</span>
              {item.role ? <span className="testimonial-role grey-02">{item.role}</span> : null}
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
