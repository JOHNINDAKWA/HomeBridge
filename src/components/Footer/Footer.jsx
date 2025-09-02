import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="hb-footer" role="contentinfo">
      {/* top border accent */}
      <span className="hb-footer__rule" aria-hidden />

      <div className="container hb-footer__grid">
        {/* Brand */}
        <div className="hb-footer__brand">
          <div className="hb-footer__logo" aria-hidden>
            HB
          </div>
          <div className="hb-footer__brandcopy">
            <h3 className="hb-footer__title">HomeBridge</h3>
            <p className="hb-footer__tag">
              Secure student housing before you land
            </p>
          </div>
        </div>

        {/* Explore */}
        <nav className="hb-footer__nav" aria-label="Explore">
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/listings">Listings</Link>
            </li>
            <li>
              <Link to="/documents">Documents</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        {/* Account + Legal */}
        <nav className="hb-footer__nav" aria-label="Account and legal">
          <h4>Account</h4>
          <ul>
            <li>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <Link to="/register">Sign up</Link>
            </li>
          </ul>

          <h4 className="hb-footer__sub">Legal</h4>
          <ul>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Use</Link>
            </li>
            <li>
              <Link to="/disclaimer">Disclaimer</Link>
            </li>
          </ul>
        </nav>

        {/* Contact */}
        <address className="hb-footer__contact" aria-label="Contact">
          <h4>Contact</h4>
          <p className="hb-footer__line">
            <FiMapPin /> Nairobi, Kenya
          </p>
          <p className="hb-footer__line">
            <FiPhone /> +254 700 123 456
          </p>
          <p className="hb-footer__line">
            <FiMail /> info@homebridge.com
          </p>

          <div className="hb-footer__social" aria-label="Social links">
            <a href="#" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="#" aria-label="Twitter / X">
              <FiTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#" aria-label="YouTube">
              <FiYoutube />
            </a>
          </div>
        </address>

        {/* Optional: lightweight newsletter (front-end only) */}
        <div className="hb-footer__news" aria-label="Newsletter">
          <h4>Stay in the loop</h4>
          <p>Tips for pre-arrival housing and city rollouts.</p>
          <form
            className="hb-news__form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We’ll keep you posted.");
              e.currentTarget.reset();
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email"
              aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* bottom bar */}
      <div className="hb-footer__bar">
        <div className="container hb-footer__barin">
          <p>© {new Date().getFullYear()} HomeBridge. All rights reserved.</p>
          <div className="hb-footer__links">
            <Link to="/privacy">Privacy</Link>
            <span>•</span>
            <Link to="/terms">Terms</Link>
            <span>•</span>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
