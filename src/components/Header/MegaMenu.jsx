import { Link, NavLink } from "react-router-dom";
import {
  FiX,
  FiMapPin,
  FiPhone,
  FiMail,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiInstagram,
} from "react-icons/fi";
import "./MegaMenu.css";
import StudentsImage from "../../assets/images/students.jpg";

export default function MegaMenu({ open, onClose }) {
  return (
    <div
      className={`mega ${open ? "open" : ""}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
    >
      <div className="mega__inner">
        {/* Close */}
        <button
          className="mega__close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <FiX />
        </button>

        {/* Left: big nav */}
        <nav className="mega__nav">
          <NavLink to="/" onClick={onClose}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={onClose}>
            About Us
          </NavLink>
          <NavLink to="/listings" onClick={onClose}>
            Listings
          </NavLink>
          <NavLink to="/blog" onClick={onClose}>
            Blog
          </NavLink>
          <NavLink to="/support" onClick={onClose}>
            Support
          </NavLink>
          <NavLink to="/login" onClick={onClose}>
            Login
          </NavLink>

          <NavLink to="legal/privacy" onClick={onClose}>
            Privacy Policy
          </NavLink>
          <NavLink to="legal/terms" onClick={onClose}>
            Terms Of Use
          </NavLink>
          <NavLink to="legal/disclaimer" onClick={onClose}>
            Disclaimer
          </NavLink>
        </nav>

        {/* Middle: showcase */}
        <div className="mega__showcase">
          <img
            className="mega__img"
            src={StudentsImage}
            alt="International students housing preview"
          />
        </div>

        {/* Right: contact & social */}
        <aside className="mega__aside">
          <div className="mega__contact">
            <h4>Contact Info</h4>
            <p className="mega__line">
              <FiMapPin /> Delta Corner, Ring Rd Parklands — Nairobi, Kenya
            </p>
            <p className="mega__line">
              <FiPhone /> +254 711 555 888
            </p>
            <p className="mega__line">WhatsApp: +254 733 555 888</p>
            <p className="mega__line">
              <FiMail /> booking@homebridge.co.ke
            </p>
          </div>

          <div className="mega__social">
            <h4>Stay Connected</h4>
            <div className="mega__icons">
              <a href="#" aria-label="Facebook">
                <FiFacebook />
              </a>
              <a href="#" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="#" aria-label="YouTube">
                <FiYoutube />
              </a>
              <a href="#" aria-label="Instagram">
                <FiInstagram />
              </a>
            </div>
          </div>

          <p className="mega__copy">
            © {new Date().getFullYear()} HomeBridge • All rights reserved.
          </p>
        </aside>
      </div>
    </div>
  );
}
