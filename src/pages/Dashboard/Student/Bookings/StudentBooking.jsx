import { useEffect, useMemo, useState } from "react";
import { FiExternalLink, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./StudentBookings.css";

export default function StudentBookings(){
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("student:bookings")) || []; } catch { return []; }
  });
  useEffect(() => {
    const onStorage = () => {
      try { setBookings(JSON.parse(localStorage.getItem("student:bookings")) || []); } catch (e){console.error(e);}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const today = new Date();
  const parse = (v) => v ? new Date(v + "T00:00:00") : null;
  const enriched = useMemo(() => bookings.map(b => {
    const ci = parse(b?.dates?.checkIn); const co = parse(b?.dates?.checkOut);
    let status = "Upcoming";
    if (ci && co) { if (today < ci) status = "Upcoming"; else if (today >= ci && today <= co) status = "Active"; else status = "Past"; }
    return { ...b, status };
  }), [bookings]);

  return (
    <section className="sdb-panel card">
      <header className="sdb-head"><h2>Bookings</h2></header>

      {enriched.length === 0 ? (
        <div className="sdb-empty">
          <p>No bookings yet. Book from the listings page and they’ll show up here.</p>
        </div>
      ) : (
        <ul className="sdb-list">
          {enriched.map(b => (
            <li key={b.id} className="sdb-item">
              <div className="sdb-row">
                <div className="sdb-chip" data-status={b.status}>{b.status}</div>
                <div className="sdb-id">#{b.id}</div>
              </div>
              <div className="sdb-grid">
                <div><span>Listing</span><b>{b.listingId}</b></div>
                <div><span>Check-in</span><b>{b.dates?.checkIn || "—"}</b></div>
                <div><span>Check-out</span><b>{b.dates?.checkOut || "—"}</b></div>
              </div>
              <div className="sdb-actions">
                <button className="sdb-link" onClick={() => navigate(`/dashboard/student/bookings/${b.id}`)}>
                  <FiExternalLink /> View details
               </button>
                <span className="sdb-dot" />
                <button className="sdb-link alt"><FiAlertCircle /> Support</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}