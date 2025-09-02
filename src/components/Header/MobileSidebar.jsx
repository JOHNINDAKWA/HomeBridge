import { NavLink, Link } from "react-router-dom";
import { FiX, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import "./MobileSidebar.css";

export default function MobileSidebar({ open, onClose, navItems = [] }) {
  return (
    <div className={`hb-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      {/* Backdrop */}
      <button
        className="hb-drawer__backdrop"
        aria-label="Close menu"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className="hb-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        {/* Header row */}
        <div className="hb-drawer__top">
          <Link to="/" className="hb-drawer__brand" onClick={onClose}>
            <span className="hb-drawer__logo">HB</span>
            <span className="hb-drawer__word">
              HOME<span>BRIDGE</span>
            </span>
          </Link>

          <button className="hb-drawer__close" aria-label="Close menu" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Divider */}
        <span className="hb-drawer__rule" aria-hidden />

        {/* Nav */}
        <nav className="hb-drawer__nav" aria-label="Mobile">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end
              className={({ isActive }) =>
                "hb-drawer__link" + (isActive ? " is-active" : "")
              }
              onClick={onClose}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth */}
        <div className="hb-drawer__auth">
          <Link to="/login" className="btn btn--ghost" onClick={onClose}>
            Log in
          </Link>
          <Link to="/register" className="btn btn--primary" onClick={onClose}>
            Sign up
          </Link>
        </div>

        {/* Contact */}
        <div className="hb-drawer__contact" aria-label="Contact">
          <p className="line">
            <FiMapPin /> 1250 West 6th Ave, New York, NY 10036
          </p>
          <p className="line">
            <FiPhone /> +1 212 555 6688
          </p>
          <p className="line">
            <FiMail /> hello@homebridge.com
          </p>
        </div>
      </aside>
    </div>
  );
}
