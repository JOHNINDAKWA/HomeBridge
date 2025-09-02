import { Link } from "react-router-dom";
import {
  FiCheckCircle, FiInfo, FiPlus, FiList, FiInbox, FiMessageSquare,
  FiClock, FiTrendingUp, FiEye, FiPercent, FiMail, FiDollarSign
} from "react-icons/fi";
import "./Overview.css";

export default function Overview() {
  // Demo stats — swap with real data later
  const kpis = [
    { label: "Live listings", value: 8, icon: <FiList /> },
    { label: "Views (7d)", value: "1,284", icon: <FiEye /> },
    { label: "Inquiries (7d)", value: 96, icon: <FiInbox /> },
    { label: "Conversion", value: "12.4%", icon: <FiPercent /> },
    { label: "Avg response", value: "1h 12m", icon: <FiClock /> },
    { label: "Payouts (30d)", value: "$3,420", icon: <FiDollarSign /> },
  ];

  const pipeline = [
    { stage: "New", count: 12 },
    { stage: "Reviewing", count: 7 },
    { stage: "Offer Sent", count: 5 },
    { stage: "E-signed", count: 3 },
    { stage: "Move-in", count: 2 },
  ];

  const recentApps = [
    { id: "APP-2193", student: "Amina N.", listing: "Rutgers-Ready Studio", moveIn: "2025-08-24", stage: "Reviewing" },
    { id: "APP-2188", student: "Brian K.", listing: "Drexel 1BR with Balcony", moveIn: "2025-09-02", stage: "Offer Sent" },
    { id: "APP-2183", student: "Sujata P.", listing: "Columbia Shared Room (F)", moveIn: "2025-08-18", stage: "New" },
    { id: "APP-2177", student: "Leo M.", listing: "NJIT 1BR Loft", moveIn: "2025-08-29", stage: "E-signed" },
  ];

  const payouts = [
    { id: "PO-1015", amount: "$850", status: "Scheduled", date: "Aug 28" },
    { id: "PO-1012", amount: "$1,200", status: "Paid", date: "Aug 18" },
    { id: "PO-1009", amount: "$1,370", status: "Paid", date: "Aug 09" },
  ];

  return (
    <div className="ag-ov">
      {/* Header / Greeting */}
      <header className="ag-ov__head">
        <div>
          <h2 className="ag-ov__title">Welcome back</h2>
          <p className="ag-ov__sub">Here’s what’s happening across your listings and applications.</p>
        </div>
        <div className="ag-ov__cta">
          <Link className="btn" to="../listings/new"><FiPlus /> New listing</Link>
          <Link className="btn btn--light" to="../applications"><FiInbox /> View applications</Link>
        </div>
      </header>

      {/* Verification notice (hide when verified=false etc.) */}
      <aside className="ag-ov__verify card">
        <div className="ag-ov__verify__left">
          <span className="badge badge--ok"><FiCheckCircle /> Verified Partner</span>
          <h4>Compliance up-to-date</h4>
          <p>Your KYB/KYC and Fair-Housing acknowledgements are current. Keep responding fast to improve conversion.</p>
        </div>
        <div className="ag-ov__verify__right">
          <div className="mini-tip"><FiInfo /> Tip: listings that reply &lt; 2h see +19% more bookings.</div>
        </div>
      </aside>

      {/* KPI cards */}
      <section className="ag-ov__kpis">
        {kpis.map((k) => (
          <article key={k.label} className="ag-kpi card">
            <div className="ag-kpi__icon">{k.icon}</div>
            <div className="ag-kpi__meta">
              <div className="ag-kpi__value">{k.value}</div>
              <div className="ag-kpi__label">{k.label}</div>
            </div>
            {/* tiny inline sparkline (svg) */}
            <svg className="ag-kpi__spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden>
              <polyline points="0,22 12,18 24,20 36,14 48,16 60,10 72,13 84,7 96,12"
                        fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
            </svg>
          </article>
        ))}
      </section>

      {/* Grid: Pipeline + Recent applications */}
      <section className="ag-ov__grid">
        {/* Pipeline */}
        <article className="ag-box card">
          <header className="ag-box__head">
            <h3><FiTrendingUp /> Application pipeline</h3>
            <Link to="../applications" className="link">Manage</Link>
          </header>
          <div className="ag-pipe">
            {pipeline.map((p) => (
              <div className="ag-pipe__item" key={p.stage}>
                <div className="ag-pipe__count">{p.count}</div>
                <div className="ag-pipe__label">{p.stage}</div>
              </div>
            ))}
          </div>
          <div className="ag-pipe__note mini">
            Nudge “New” &amp; “Reviewing” quickly to lift conversion.
          </div>
        </article>

        {/* Recent applications */}
        <article className="ag-box card">
          <header className="ag-box__head">
            <h3><FiInbox /> Recent applications</h3>
            <Link to="../applications" className="link">View all</Link>
          </header>

          <div className="ag-table">
            <div className="ag-tr ag-tr--head">
              <div>ID</div><div>Student</div><div>Listing</div><div>Move-in</div><div>Stage</div>
            </div>
            {recentApps.map((a) => (
              <div className="ag-tr" key={a.id}>
                <div>{a.id}</div>
                <div className="ag-td-student"><FiMail /> {a.student}</div>
                <div className="ag-td-clip">{a.listing}</div>
                <div>{a.moveIn}</div>
                <div><span className={`chip chip--${slug(a.stage)}`}>{a.stage}</span></div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Payouts + Quick actions */}
      <section className="ag-ov__grid ag-ov__grid--two">
        {/* Payouts */}
        <article className="ag-box card">
          <header className="ag-box__head">
            <h3><FiDollarSign /> Payouts</h3>
            <Link to="../payouts" className="link">View all</Link>
          </header>
          <ul className="ag-list">
            {payouts.map((p) => (
              <li key={p.id} className="ag-list__item">
                <div>
                  <strong>{p.amount}</strong>
                  <div className="mini muted">{p.id}</div>
                </div>
                <div className="muted">{p.date}</div>
                <span className={`chip chip--${slug(p.status)}`}>{p.status}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Quick actions */}
        <article className="ag-box card">
          <header className="ag-box__head">
            <h3><FiMessageSquare /> Quick actions</h3>
          </header>
          <div className="ag-actions">
            <Link className="btn btn--light" to="../listings/new"><FiPlus /> Create listing</Link>
            <Link className="btn btn--light" to="../messages"><FiMessageSquare /> Go to messages</Link>
            <Link className="btn btn--light" to="../settings"><FiCheckCircle /> Update profile</Link>
          </div>
          <p className="mini muted">Tip: keep response times &lt; 2 hours for best ranking.</p>
        </article>
      </section>
    </div>
  );
}

/* small util */
function slug(s) {
  return String(s).toLowerCase().replace(/\s+/g, "-");
}
