import { Link } from "react-router-dom";

/* Link with the reference's sliding 1px underline. */
export default function UnderlineLink({ to, href, children, className = "", ...rest }) {
  const inner = (
    <>
      {children}
      <span className="link-underline-line" aria-hidden="true" />
    </>
  );
  if (href) {
    return (
      <a className={`link-underline ${className}`.trim()} href={href} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link className={`link-underline ${className}`.trim()} to={to} {...rest}>
      {inner}
    </Link>
  );
}
