import { Link } from "react-router";
import styles from "./Button.module.css";

/**
 * One button look, three kinds of element:
 * - `to`   -> a router <Link> (page inside this app, no page reload)
 * - `href` -> a plain <a> (other sites, or files like the CV). Full URLs that
 *             start with http(s) open in a new tab.
 * - neither -> a <button>
 * @param {object} props
 * @param {"primary" | "ghost"} [props.variant] filled or outlined look
 * @param {string} [props.to] internal route, e.g. "/projects"
 * @param {string} [props.href] external URL or file path
 * @param {React.ReactNode} props.children
 * Any other prop (onClick, type, download, aria-*) is passed to the element.
 */
export default function Button({
  variant = "primary",
  to,
  href,
  children,
  ...rest
}) {
  const className = `${styles.button} ${styles[variant]}`;

  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    // rel="noopener noreferrer": the new tab can't access this page.
    const externalProps = isExternal
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <a href={href} className={className} {...externalProps} {...rest}>
        {children}
        {isExternal && (
          <span className="visually-hidden"> (opens in a new tab)</span>
        )}
      </a>
    );
  }

  // type="button" stops it submitting a form by accident. Pass type="submit"
  // to override it (the contact form will).
  return (
    <button type="button" className={className} {...rest}>
      {children}
    </button>
  );
}
