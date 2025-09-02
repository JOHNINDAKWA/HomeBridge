import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiMail, FiMapPin } from "react-icons/fi";
import useMediaQuery from "../../hooks/useMediaQuery";
import MobileSidebar from "./MobileSidebar";
import MegaMenu from "./MegaMenu";
import "./Header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1100px)");

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/listings", label: "Listings" },
    { to: "/support", label: "Support" },
    { to: "/contact", label: "Contact" },
  ];

  // lock scroll when overlay open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  // close overlay on breakpoint change
  useEffect(() => { setOpen(false); }, [isDesktop]);

  // shrink/elevate on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Utility strip (desktop only) */}
      <div className="hb-util" aria-hidden>
        <div className="container hb-util__inner">
          <div className="hb-util__left">
            <FiMapPin />
            <span>Serving U.S. study cities: NJ • NY • PA</span>
          </div>
          <div className="hb-util__right">
            <FiMail />
            <a href="mailto:info@homebridge.com">info@homebridge.com</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`hb-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container hb-header__inner">
          {/* Left: burger on mobile, brand always */}
          <div className="hb-left">
            <button
              className="hb-burger"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <FiMenu />
            </button>

            <Link to="/" className="hb-brand" aria-label="Home">
              <span className="hb-logo">HB</span>
              <span className="hb-word">
                HOME<span>BRIDGE</span>
              </span>
            </Link>
          </div>

          {/* Center: nav (desktop) */}
          <nav className="hb-nav" aria-label="Primary">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end
                className={({ isActive }) =>
                  "hb-nav__link" + (isActive ? " is-active" : "")
                }
              >
                {n.label}
              </NavLink>
            ))}
            <span className="hb-underline" />
          </nav>

          {/* Right: actions */}
          <div className="hb-right">
            <Link to="/login" className="btn btn--ghost">Log in</Link>
            <Link to="/register" className="btn btn--primary btn-right">Sign up</Link>
          </div>
        </div>
      </header>

      {/* Overlays */}
      <MegaMenu open={open && isDesktop} onClose={() => setOpen(false)} />
      <MobileSidebar
        open={open && !isDesktop}
        onClose={() => setOpen(false)}
        navItems={navItems}
      />
    </>
  );
}
