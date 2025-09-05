import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiCalendar, FiFileText, FiUser, FiBookOpen } from "react-icons/fi";
import { useAuth } from "../../../../Context/AuthContext.jsx";
import "./StudentLayout.css";

export default function StudentLayout(){
  const navigate = useNavigate();
  const { user, logout, profile, documents } = useAuth();

  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("student:bookings")) || []; } catch { return []; }
  });
  useEffect(() => {
    const onStorage = () => {
      try { setBookings(JSON.parse(localStorage.getItem("student:bookings")) || []); } catch (e){ console.error(e); }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const today = new Date();
  const parse = (v) => v ? new Date(v + "T00:00:00") : null;

  const upcomingCount = useMemo(() => {
    return bookings.filter(b => {
      const ci = parse(b?.dates?.checkIn);
      return ci && today < ci;
    }).length;
  }, [bookings]);

  const profilePercent = useMemo(() => {
    const keys = ["fullName", "phone", "school", "program"];
    const filled = keys.filter(k => profile?.[k] && String(profile[k]).trim().length > 0).length;
    return Math.round((filled / keys.length) * 100);
  }, [profile]);

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <section className="sdl-wrap container2">
      {/* Hero */}
      <header className="sdl-hero card">
        <div>
          <h1>
            Welcome
            { (profile?.fullName || user?.name)
              ? `, ${(profile?.fullName || user?.name).split(" ")[0]}`
              : "" } 👋
          </h1>
          <p className="sdl-muted">Manage bookings, documents, and your profile, all in one place.</p>
        </div>
        <div>
          <button className="btn btn--light" onClick={() => navigate("/listings")}>
            <FiBookOpen /> Browse Listings
          </button>
          <button className="btn btn--light" style={{ marginLeft: 8 }} onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="sdl-stats">
        <div className="sdl-stat card">
          <div className="sdl-stat__icon"><FiCalendar /></div>
          <div className="sdl-stat__meta"><strong>{upcomingCount}</strong><span>Upcoming bookings</span></div>
        </div>
        <div className="sdl-stat card">
          <div className="sdl-stat__icon"><FiFileText /></div>
          <div className="sdl-stat__meta"><strong>{documents?.length || 0}</strong><span>Documents saved</span></div>
        </div>
        <div className="sdl-stat card">
          <div className="sdl-stat__icon"><FiUser /></div>
          <div className="sdl-stat__meta"><strong>{profilePercent}%</strong><span>Profile complete</span></div>
          <div className="sdl-progress"><span style={{ width: `${profilePercent}%` }} /></div>
        </div>
      </section>

      {/* Shell grid */}
      <div className="sdl-grid">
        <aside className="sdl-side card">
          <nav className="sdl-tabs" role="tablist" aria-label="Student sections">
            <NavLink to="bookings" end className={({isActive}) => `sdl-tab ${isActive?"is-active":""}`}><FiCalendar /> Bookings</NavLink>
            <NavLink to="documents" className={({isActive}) => `sdl-tab ${isActive?"is-active":""}`}><FiFileText /> Documents</NavLink>
            <NavLink to="profile" className={({isActive}) => `sdl-tab ${isActive?"is-active":""}`}><FiUser /> Profile</NavLink>
          </nav>
          <div className="sdl-side__hint">Signed in as <b>{user?.email || "—"}</b>. Changes save automatically.</div>
        </aside>

        <main className="sdl-main">
          <Outlet />
        </main>
      </div>
    </section>
  );
}
