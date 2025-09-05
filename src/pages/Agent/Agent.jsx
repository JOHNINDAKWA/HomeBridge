import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiPlus, FiList, FiInbox, FiMessageSquare, FiDollarSign, FiSettings, FiBarChart2, FiMenu, FiX
} from "react-icons/fi";
import "./Agent.css";
import { useAuth } from "../../Context/AuthContext.jsx";

export default function Agent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Close drawer when route changes (best effort)
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  // Close on ESC
  useEffect(() => {
    function onKey(e){ if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="ag-wrap section">
      <div className="container2 ag-shell card">
        {/* Mobile top bar */}
        <div className="ag-mobilebar">
          <button
            className="btn btn--light ag-menubtn"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <FiMenu /> Menu
          </button>
          <button className="btn" type="button" onClick={() => navigate("listings/new")}>
            <FiPlus /> New listing
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`ag-nav ${open ? "is-open" : ""}`} aria-label="Agent navigation">
          <div className="ag-nav__head">
            <h2 className="ag-title">Partner Console</h2>
            <button
              className="ag-close"
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <FiX />
            </button>
          </div>

          <nav onClick={() => setOpen(false)}>
            <NavLink to="overview"><FiBarChart2 /> Overview</NavLink>
            <NavLink to="listings"><FiList /> Listings</NavLink>
            <NavLink to="applications"><FiInbox /> Applications</NavLink>
            <NavLink to="messages"><FiMessageSquare /> Messages</NavLink>
            <NavLink to="payouts"><FiDollarSign /> Payouts</NavLink>
            <NavLink to="settings"><FiSettings /> Settings</NavLink>
          </nav>

          <button
            className="btn ag-new"
            onClick={() => { setOpen(false); navigate("listings/new"); }}
          >
            <FiPlus /> New listing
          </button>

          <div className="ag-account" style={{marginTop: 12, paddingTop: 12, borderTop: "1px solid #e7ecf0"}}>
            <div className="ag-userMini" style={{display:"flex", gap:10, alignItems:"center", marginBottom:8}}>
              <img
                src={`https://i.pravatar.cc/64?u=${encodeURIComponent(user?.email || "agent")}`}
                alt=""
                style={{width:36, height:36, borderRadius:999}}
              />
              <div style={{lineHeight:1.1}}>
                <b>{user?.name || "Signed in"}</b>
                <div style={{fontSize:12, color:"#667085"}}>{user?.email || ""}</div>
              </div>
            </div>
            <button type="button" className="btn btn--light ag-logout" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </aside>

        {/* Backdrop for drawer */}
        <div
          className={`ag-dim ${open ? "show" : ""}`}
          aria-hidden={!open}
          onClick={() => setOpen(false)}
        />

        {/* Main */}
        <main className="ag-main">
          <Outlet />
        </main>
      </div>
    </section>
  );
}
