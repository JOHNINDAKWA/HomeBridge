import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiClipboard,
  FiUsers,
  FiLayers,
  FiDollarSign,
  FiTrendingUp,
  FiChevronRight,
} from "react-icons/fi";
import "./AdminOverview.css";

/* ---------- Data helpers (frontend mock) ---------- */
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem("student:bookings")) || [];
  } catch {
    return [];
  }
}

const fmtUSD = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    (cents || 0) / 100
  );

function toDateKey(d) {
  // YYYY-MM-DD
  return new Date(d).toISOString().slice(0, 10);
}

function lastNDays(n) {
  const days = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(now.getDate() - i);
    days.push(d);
  }
  return days;
}

function relTime(iso) {
  if (!iso) return "—";
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function sparklinePath(values, w = 360, h = 70, pad = 6) {
  if (!values.length) return "";
  const max = Math.max(1, ...values);
  const dx = (w - pad * 2) / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = pad + i * dx;
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return points.join(" ");
}

/* ---------- Component ---------- */
export default function AdminOverview() {
  const raw = useMemo(getBookings, []);

  // Normalize a few fields so charts don’t break when missing
  const bookings = useMemo(
    () =>
      raw.map((b) => ({
        ...b,
        createdAt: b.createdAt || new Date().toISOString(),
        applicationFeeCents: typeof b.applicationFeeCents === "number" ? b.applicationFeeCents : 2500, // default $25
        status: b.status || "Pending Payment",
        docIds: Array.isArray(b.docIds) ? b.docIds : [],
      })),
    [raw]
  );

  /* KPIs */
  const totals = useMemo(() => {
    const count = bookings.length;
    const docsAttached = bookings.filter((b) => b.docIds.length > 0).length;
    const paidCount = bookings.filter((b) => b.feePaidAt).length;
    const paidSum = bookings.reduce(
      (acc, b) => acc + (b.feePaidAt ? b.applicationFeeCents || 0 : 0),
      0
    );
    const submitted = bookings.filter((b) => b.submittedAt).length;
    const approved = bookings.filter((b) => b.status === "Approved").length;
    return { count, docsAttached, paidCount, paidSum, submitted, approved };
  }, [bookings]);

  /* Conversion funnel (simple) */
  const funnel = useMemo(() => {
    const total = Math.max(1, totals.count);
    const steps = [
      { key: "step1", label: "Bookings started", value: totals.count },
      { key: "step2", label: "Application fee paid", value: totals.paidCount },
      {
        key: "step3",
        label: "Submitted / Under review",
        value: bookings.filter(
          (b) => b.submittedAt || b.status === "Under Review"
        ).length,
      },
      { key: "step4", label: "Approved", value: totals.approved },
    ];
    steps.forEach((s) => (s.pct = Math.round((s.value / total) * 100)));
    return steps;
  }, [bookings, totals]);

  /* Status breakdown for donuts */
  const statusCounts = useMemo(() => {
    const keys = [
      "Pending Payment",
      "Payment Complete",
      "Ready to Submit",
      "Under Review",
      "Approved",
      "Rejected",
    ];
    const map = Object.fromEntries(keys.map((k) => [k, 0]));
    bookings.forEach((b) => {
      map[b.status] = (map[b.status] || 0) + 1;
    });
    return map;
  }, [bookings]);

  /* Bookings over time (sparkline: last 14 days) */
  const series = useMemo(() => {
    const days = lastNDays(14);
    const buckets = Object.fromEntries(days.map((d) => [toDateKey(d), 0]));
    bookings.forEach((b) => {
      const key = toDateKey(b.createdAt);
      if (key in buckets) buckets[key] += 1;
    });
    const labels = days.map((d) =>
      d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    );
    const values = days.map((d) => buckets[toDateKey(d)]);
    return { labels, values };
  }, [bookings]);

  const sparkPath = useMemo(() => sparklinePath(series.values), [series.values]);

  /* Recent Activity */
  const recent = useMemo(
    () =>
      [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [bookings]
  );

  return (
    <section className="ov-wrap">
      {/* Top header */}
      <header className="ov-head card">
        <div className="ov-head__left">
          <h1>Admin Overview</h1>
          <p className="ov-sub">Snapshot of platform activity (frontend mock)</p>
        </div>
        <div className="ov-head__actions">
          <Link to="/admin/bookings" className="btn btn--light">
            Go to Bookings <FiChevronRight />
          </Link>
        </div>
      </header>

      {/* KPI row */}
      <div className="ov-kpis">
        <div className="ov-kpi card">
          <div className="ov-kpi__icon brand"><FiClipboard /></div>
          <div className="ov-kpi__meta">
            <span>Total bookings</span>
            <b>{totals.count}</b>
          </div>
        </div>
        <div className="ov-kpi card">
          <div className="ov-kpi__icon money"><FiDollarSign /></div>
          <div className="ov-kpi__meta">
            <span>Fees collected</span>
            <b>{fmtUSD(totals.paidSum)}</b>
            <small>{totals.paidCount} paid</small>
          </div>
        </div>
        <div className="ov-kpi card">
          <div className="ov-kpi__icon layer"><FiLayers /></div>
          <div className="ov-kpi__meta">
            <span>Submitted</span>
            <b>{totals.submitted}</b>
            <small>{Math.round((totals.submitted / Math.max(1, totals.count)) * 100)}% of total</small>
          </div>
        </div>
        <div className="ov-kpi card">
          <div className="ov-kpi__icon users"><FiUsers /></div>
          <div className="ov-kpi__meta">
            <span>With documents</span>
            <b>{totals.docsAttached}</b>
            <small>{Math.round((totals.docsAttached / Math.max(1, totals.count)) * 100)}% prepared</small>
          </div>
        </div>
      </div>

      {/* Split: chart + funnel */}
      <div className="ov-split">
        <section className="ov-card card">
          <header className="ov-card__head">
            <h3><FiTrendingUp /> Bookings (last 14 days)</h3>
          </header>

          <div className="ov-chart">
            <svg
              className="ov-spark"
              viewBox="0 0 360 70"
              preserveAspectRatio="none"
              aria-label="Bookings trend"
            >
              <path className="ov-spark__bg" d="M 0 70 L 360 70" />
              <path className="ov-spark__line" d={sparkPath} />
            </svg>
            <div className="ov-legend">
              {series.labels.map((lbl, i) => (
                <span key={i} title={lbl}>
                  {i % 3 === 0 ? lbl : "\u00A0"}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="ov-card card">
          <header className="ov-card__head">
            <h3>Conversion funnel</h3>
          </header>

          <ul className="ov-funnel">
            {funnel.map((s, i) => (
              <li key={s.key}>
                <div className="ov-funnel__row">
                  <span className="ov-funnel__label">{i + 1}. {s.label}</span>
                  <b className="ov-funnel__value">{s.value}</b>
                </div>
                <div className="ov-funnel__bar">
                  <span style={{ width: `${s.pct}%` }} />
                </div>
                <small className="ov-funnel__pct">{s.pct}%</small>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Status donuts + Recent activity */}
      <div className="ov-lower">
        <section className="ov-status card">
          <header className="ov-card__head">
            <h3>Status breakdown</h3>
          </header>
          <div className="ov-status__grid">
            {[
              ["Pending Payment", "pending"],
              ["Payment Complete", "paid"],
              ["Under Review", "review"],
              ["Approved", "ok"],
              ["Rejected", "bad"],
            ].map(([label, cls]) => {
              const total = Math.max(1, bookings.length);
              const val = statusCounts[label] || 3;
              const pct = Math.round((val / total) * 100);
              return (
                <div className="ov-donut" key={label}>
                  <div
                    className={`ov-donut__ring ${cls}`}
                    style={{ "--p": `${pct}%` }}
                  />
                  <div className="ov-donut__text">
                    <b>{val}</b>
                    <small>{label}</small>
                    <span>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="ov-activity card">
          <header className="ov-card__head">
            <h3>Recent activity</h3>
            <Link to="/admin/bookings" className="ov-link">View all</Link>
          </header>

          <ul className="ov-activity__list">
            {recent.length === 0 && (
              <li className="ov-empty">No recent bookings yet.</li>
            )}
            {recent.map((b) => (
              <li key={b.id} className="ov-activity__item">
                <div className="ov-activity__row">
                  <span className={`ov-chip ${b.status?.toLowerCase().replace(/\s+/g, "-") || ""}`}>
                    {b.status || "—"}
                  </span>
                  <span className="ov-id">#{b.id}</span>
                </div>
                <div className="ov-activity__grid">
                  <div><span>Listing</span><b>{b.listingId || "—"}</b></div>
                  <div><span>Docs</span><b>{b.docIds?.length || 0}</b></div>
                  <div><span>Created</span><b title={b.createdAt}>{relTime(b.createdAt)}</b></div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="ov-footnote">
        This dashboard reads from <code>localStorage</code>. When you wire a backend, swap the data
        helpers with API calls and keep the UI as-is.
      </p>
    </section>
  );
}
