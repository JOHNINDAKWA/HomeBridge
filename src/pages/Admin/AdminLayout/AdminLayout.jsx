import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  FiMenu, FiX, FiGrid, FiUsers, FiLayers, FiClipboard,
  FiSettings, FiSearch, FiBell, FiLogOut, FiShield
} from "react-icons/fi";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  const signOut = () => {
    localStorage.removeItem("auth:role");
    nav("/admin/login", { replace: true });
  };

  const breadcrumb = useMemo(() => {
    const map = {
      "/admin": "Overview",
      "/admin/bookings": "Bookings",
      "/admin/students": "Students",
      "/admin/agents": "Agents",
      "/admin/settings": "Settings",
      "/admin/profile": "Profile & Access",
    };
    // find the longest matching key
    const keys = Object.keys(map).sort((a,b)=>b.length-a.length);
    const hit = keys.find(k => loc.pathname.startsWith(k)) || "/admin";
    return map[hit];
  }, [loc.pathname]);

  return (
    <div className="hbax-shell">
      {/* Sidebar */}
      <aside className={`hbax-sidebar ${open ? "is-open" : ""}`} aria-label="Admin navigation">
        <div className="hbax-sideHead">
          <div className="hbax-brand">
            <span className="hbax-logo">HB</span>
            <div className="hbax-brandText">
              <b>HomeBridge</b>
              <small>Admin</small>
            </div>
          </div>
          <button className="hbax-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        <nav className="hbax-nav" onClick={() => setOpen(false)}>
          <div className="hbax-sectionLabel">Operations</div>
          <NavLink end to="/admin" className="hbax-link"><span className="hbax-rail" /><FiGrid/> Overview</NavLink>
          <NavLink to="/admin/bookings" className="hbax-link"><span className="hbax-rail" /><FiClipboard/> Bookings</NavLink>

          <div className="hbax-sectionLabel">Directory</div>
          <NavLink to="/admin/students" className="hbax-link"><span className="hbax-rail" /><FiUsers/> Students</NavLink>
          <NavLink to="/admin/agents" className="hbax-link"><span className="hbax-rail" /><FiLayers/> Agents</NavLink>

          <div className="hbax-sectionLabel">System</div>
          <NavLink to="/admin/settings" className="hbax-link"><span className="hbax-rail" /><FiSettings/> Settings</NavLink>
          <NavLink to="/admin/profile" className="hbax-link"><span className="hbax-rail" /><FiShield/> Profile</NavLink>
        </nav>

        <div className="hbax-sideFoot">
          <div className="hbax-userMini">
            <img src="https://i.pravatar.cc/64?img=65" alt="" />
            <div>
              <b>Admin {" "}</b>
              <small>admin@homebridge</small>
            </div>
          </div>
          <button className="hbax-signout" onClick={signOut}><FiLogOut/> Sign out</button>
        </div>
      </aside>

      {/* Topbar */}
      <header className="hbax-topbar">
        <button className="hbax-menuBtn" onClick={() => setOpen(true)} aria-label="Open menu"><FiMenu/></button>
        <div className="hbax-crumb">{breadcrumb}</div>

        <div className="hbax-search">
          <FiSearch />
          <input placeholder="Search bookings, students, agents…" />
        </div>

        <div className="hbax-spacer" />

        <button className="hbax-iconBtn" title="Notifications">
          <FiBell />
          <span className="hbax-dot" />
        </button>
        <div className="hbax-avatar">
          <img src="https://i.pravatar.cc/40?img=65" alt="" />
        </div>
      </header>

      {/* Main content */}
      <main className="hbax-main">
        <Outlet />
      </main>

      {/* Mobile backdrop */}
      <div className={`hbax-backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
    </div>
  );
}
