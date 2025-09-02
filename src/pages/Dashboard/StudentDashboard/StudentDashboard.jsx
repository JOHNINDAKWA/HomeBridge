import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiCalendar, FiFileText, FiUser, FiPlus, FiTrash2, FiExternalLink,
  FiCheckCircle, FiAlertCircle, FiArrowRight, FiUpload, FiBookOpen
} from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "./StudentDashboard.css";

export default function StudentDashboard(){
  const navigate = useNavigate();
  const { profile, setProfile, documents, setDocuments } = useAuth?.() ?? {};
  const [sp, setSp] = useSearchParams();
  const tab = sp.get("tab") || "bookings";

  // Load bookings from localStorage and keep them fresh if the storage changes
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("student:bookings")) || []; } catch { return []; }
  });
  useEffect(() => {
    const update = () => {
      try { setBookings(JSON.parse(localStorage.getItem("student:bookings")) || []); } catch {}
    };
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  const setTab = (key) => {
    const next = new URLSearchParams(sp);
    next.set("tab", key);
    setSp(next, { replace: true });
  };

  // Stats
  const today = new Date();
  const parse = (v) => v ? new Date(v + "T00:00:00") : null;

  const enrichedBookings = useMemo(() => bookings.map(b => {
    const ci = parse(b.dates?.checkIn);
    const co = parse(b.dates?.checkOut);
    let status = "Upcoming";
    if (ci && co) {
      if (today < ci) status = "Upcoming";
      else if (today >= ci && today <= co) status = "Active";
      else if (today > co) status = "Past";
    }
    return { ...b, status };
  }), [bookings]);

  const upcomingCount = enrichedBookings.filter(b => b.status === "Upcoming").length;

  const profilePercent = useMemo(() => {
    const keys = ["fullName", "phone", "school", "program"];
    const filled = keys.filter(k => profile?.[k] && String(profile[k]).trim().length > 0).length;
    return Math.round((filled / keys.length) * 100);
  }, [profile]);

  // Document handlers
  const fileRef = useRef(null);
  const uploadDocs = (files) => {
    if (!setDocuments) return;
    const newDocs = Array.from(files).map((f, i) => ({
      id: `${Date.now()}_${i}`,
      name: f.name,
      type: f.type || "file",
      size: f.size || 0,
    }));
    setDocuments([...(documents || []), ...newDocs]);
  };
  const removeDoc = (id) => {
    if (!setDocuments) return;
    setDocuments((documents || []).filter(d => d.id !== id));
  };

  const Empty = ({ icon: Icon, title, note, cta, onClick }) => (
    <div className="sd-empty">
      <div className="sd-empty__icon"><Icon /></div>
      <h3>{title}</h3>
      {note && <p className="sd-muted">{note}</p>}
      {cta && <button className="btn" onClick={onClick}>{cta} <FiArrowRight /></button>}
    </div>
  );

  return (
    <section className="container2 sd-wrap">
      {/* HERO */}
      <header className="sd-hero card">
        <div className="sd-hero__main">
          <h1>Welcome{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""} 👋</h1>
          <p className="sd-muted">
            Manage bookings, documents, and your profile—all in one place.
          </p>
        </div>
        <div className="sd-hero__cta">
          <button className="btn btn--light" onClick={() => navigate("/listings")}>
            <FiBookOpen /> Browse Listings
          </button>
        </div>
      </header>

      {/* STATS */}
      <section className="sd-stats">
        <div className="sd-stat card">
          <div className="sd-stat__icon"><FiCalendar /></div>
          <div className="sd-stat__meta">
            <strong>{upcomingCount}</strong>
            <span>Upcoming bookings</span>
          </div>
        </div>
        <div className="sd-stat card">
          <div className="sd-stat__icon"><FiFileText /></div>
          <div className="sd-stat__meta">
            <strong>{documents?.length || 0}</strong>
            <span>Documents saved</span>
          </div>
        </div>
        <div className="sd-stat card">
          <div className="sd-stat__icon"><FiUser /></div>
          <div className="sd-stat__meta">
            <strong>{profilePercent}%</strong>
            <span>Profile complete</span>
          </div>
          <div className="sd-progress"><span style={{ width: `${profilePercent}%` }} /></div>
        </div>
      </section>

      <div className="sd-grid">
        {/* LEFT: Tabs */}
        <aside className="sd-side card">
          <nav className="sd-tabs" role="tablist" aria-label="Student sections">
            {[
              ["bookings","Bookings", FiCalendar],
              ["documents","Documents", FiFileText],
              ["profile","Profile", FiUser],
            ].map(([key,label,Icon]) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab===key}
                className={`sd-tab ${tab===key ? "is-active" : ""}`}
                onClick={() => setTab(key)}
              >
                <Icon /> {label}
              </button>
            ))}
          </nav>
          <div className="sd-side__hint">
            Changes save automatically.
          </div>
        </aside>

        {/* RIGHT: Content */}
        <main className="sd-main">

          {/* BOOKINGS */}
          {tab === "bookings" && (
            <section className="sd-panel card">
              <header className="sd-panel__head">
                <h2>Bookings</h2>
                <button className="btn btn--light" onClick={() => navigate("/listings")}>
                  <FiPlus /> New Booking
                </button>
              </header>

              {enrichedBookings.length === 0 ? (
                <Empty
                  icon={FiCalendar}
                  title="No bookings yet"
                  note="When you book a room, it will appear here."
                  cta="Find a place"
                  onClick={() => navigate("/listings")}
                />
              ) : (
                <ul className="sd-bookings">
                  {enrichedBookings.map(b => (
                    <li key={b.id} className="sd-booking">
                      <div className="sd-booking__row">
                        <div className="sd-chip sd-chip--status" data-status={b.status}>
                          {b.status}
                        </div>
                        <div className="sd-booking__id">#{b.id}</div>
                      </div>
                      <div className="sd-booking__grid">
                        <div>
                          <span className="sd-label">Listing</span>
                          <b className="sd-strong">{b.listingId}</b>
                        </div>
                        <div>
                          <span className="sd-label">Check-in</span>
                          <b>{b.dates?.checkIn || "—"}</b>
                        </div>
                        <div>
                          <span className="sd-label">Check-out</span>
                          <b>{b.dates?.checkOut || "—"}</b>
                        </div>
                      </div>
                      <div className="sd-booking__actions">
                        <button className="sd-link"><FiExternalLink /> View details</button>
                        <span className="sd-dot" />
                        <button className="sd-link sd-link--muted"><FiAlertCircle /> Support</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* DOCUMENTS */}
          {tab === "documents" && (
            <section className="sd-panel card">
              <header className="sd-panel__head">
                <h2>Your Documents</h2>
                <div className="sd-docbar">
                  <button className="btn" onClick={() => fileRef.current?.click()}>
                    <FiUpload /> Upload
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    hidden
                    onChange={e => uploadDocs(e.target.files)}
                  />
                </div>
              </header>

              {(documents?.length || 0) === 0 ? (
                <Empty
                  icon={FiFileText}
                  title="No documents yet"
                  note="Upload your passport, I-20, admission letter, or financial docs once—reuse for every booking."
                  cta="Upload documents"
                  onClick={() => fileRef.current?.click()}
                />
              ) : (
                <ul className="sd-docs">
                  {documents.map(doc => (
                    <li key={doc.id} className="sd-doc">
                      <div className="sd-doc__meta">
                        <div className="sd-doc__icon"><FiFileText /></div>
                        <div>
                          <div className="sd-doc__name">{doc.name}</div>
                          <div className="sd-doc__sub">{Math.round((doc.size||0)/1024)} KB</div>
                        </div>
                      </div>
                      <button className="sd-iconbtn" onClick={() => removeDoc(doc.id)} title="Remove">
                        <FiTrash2 />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <section className="sd-panel card">
              <header className="sd-panel__head">
                <h2>Your Profile</h2>
                <div className="sd-mini-progress">
                  <span>Completed</span>
                  <div className="sd-progress sd-progress--mini">
                    <span style={{ width: `${profilePercent}%` }} />
                  </div>
                  <b>{profilePercent}%</b>
                </div>
              </header>

              <div className="sd-formgrid">
                <label className="sd-field">
                  <span>Full name</span>
                  <input
                    value={profile?.fullName || ""}
                    onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="e.g. Jane Student"
                  />
                </label>
                <label className="sd-field">
                  <span>Phone</span>
                  <input
                    value={profile?.phone || ""}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+254..."
                  />
                </label>
                <label className="sd-field">
                  <span>Institution</span>
                  <input
                    value={profile?.school || ""}
                    onChange={e => setProfile(p => ({ ...p, school: e.target.value }))}
                    placeholder="University / College"
                  />
                </label>
                <label className="sd-field">
                  <span>Program</span>
                  <input
                    value={profile?.program || ""}
                    onChange={e => setProfile(p => ({ ...p, program: e.target.value }))}
                    placeholder="Course / Program"
                  />
                </label>
              </div>

              <div className="sd-savehint">
                <FiCheckCircle /> Saved automatically
              </div>
            </section>
          )}
        </main>
      </div>
    </section>
  );
}
