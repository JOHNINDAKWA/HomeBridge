import "./Button.css";
export default function Button({ as: As = "button", children, className = "", ...rest }) {
  return <As className={`btn ${className}`} {...rest}>{children}</As>;
}
