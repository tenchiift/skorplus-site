/* Infinite marquee. Decorative duplication, so it is hidden from assistive tech. */
export default function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={`${t}-${i}`}>
            {t}
            <i>.</i>
          </span>
        ))}
      </div>
    </div>
  );
}
