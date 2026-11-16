import { Link } from "react-router-dom";

/* Hairline row with a sliding rule and an arrow that swaps on hover,
   the reference's CTA mechanic. */
export default function CtaRow({ to, href, children }) {
  const inner = (
    <>
      <span className="cta-top" aria-hidden="true">
        <i />
      </span>
      <span>{children}</span>
      <span className="cta-arrow" aria-hidden="true">
        <span>→</span>
        <span>→</span>
      </span>
    </>
  );
  const className = "cta lowercase";
  if (href) {
    return (
      <a className={className} href={href}>
        {inner}
      </a>
    );
  }
  return (
    <Link className={className} to={to}>
      {inner}
    </Link>
  );
}
