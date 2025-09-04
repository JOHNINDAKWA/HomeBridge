
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiDollarSign,
  FiDownload,
  FiCalendar,
  FiChevronDown,
  FiExternalLink,
  FiInfo,
  FiRefreshCw,
  FiAlertCircle,
  FiLink,
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";
import "./Payouts.css";

/** ---- Demo data ---- */
const DEMO = [
  {
    id: "PO-1039",
    date: "2025-08-18",
    amount: 3421.75,
    currency: "USD",
    status: "Paid",
    method: "Bank •••• 4821",
    period: "Aug 10 – Aug 16",
    fees: 78.25,
    net: 3343.5,
    txCount: 12,
  },
  {
    id: "PO-1038",
    date: "2025-08-11",
    amount: 1984.0,
    currency: "USD",
    status: "Paid",
    method: "Bank •••• 4821",
    period: "Aug 03 – Aug 09",
    fees: 41.0,
    net: 1943.0,
    txCount: 7,
  },
  {
    id: "PO-1040",
    date: "2025-08-25",
    amount: 2760.5,
    currency: "USD",
    status: "Scheduled",
    method: "Bank •••• 4821",
    period: "Aug 17 – Aug 23",
    fees: 62.5,
    net: 2698.0,
    txCount: 9,
  },
  {
    id: "PO-1041",
    date: "2025-08-28",
    amount: 650.0,
    currency: "USD",
    status: "On hold",
    method: "Bank •••• 4821",
    period: "Aug 24 – Aug 26",
    fees: 12.0,
    net: 638.0,
    txCount: 3,
  },
];

const STATUSES = ["All", "Paid", "Scheduled", "Pending", "On hold"];

/** Utility */
const fmt = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);

export default function Payouts() {
  const nav = useNavigate();

  /** Connection state (pretend we use Stripe/Flutterwave etc.) */
  const [connected] = useState(true); // flip to false to see the connect banner

  /** Filters */
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /** Derived rows */
  const rows = useMemo(() => {
    return DEMO.filter((r) => {
      const okQ =
        !q ||
        [r.id, r.period, r.method].join(" ").toLowerCase().includes(q.toLowerCase());
      const okS = status === "All" ? true : r.status === status;
      const okFrom = from ? new Date(r.date) >= new Date(from) : true;
      const okTo = to ? new Date(r.date) <= new Date(to) : true;
      return okQ && okS && okFrom && okTo;
    }).sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [q, status, from, to]);

  /** Summary */
  const summary = useMemo(() => {
    const paid = DEMO.filter((d) => d.status === "Paid");
    const last30 = paid
      .filter(
        (d) =>
          (Date.now() - new Date(d.date).getTime()) / (1000 * 60 * 60 * 24) <= 30
      )
      .reduce((s, r) => s + r.net, 0);

    const next = DEMO.find((d) => d.status === "Scheduled");
    const onHold = DEMO.filter((d) => d.status === "On hold").reduce(
      (s, r) => s + r.net,
      0
    );
    return {
      available: 1243.17, // demo wallet
      upcoming: next ? next.net : 0,
      last30,
      holds: onHold,
    };
  }, []);

  /** Export CSV (client-side) */
  function exportCSV() {
    const header = [
      "ID",
      "Date",
      "Status",
      "Period",
      "Gross",
      "Fees",
      "Net",
      "Method",
      "Transactions",
    ].join(",");
    const lines = rows.map((r) =>
      [
        r.id,
        r.date,
        r.status,
        `"${r.period}"`,
        r.amount,
        r.fees,
        r.net,
        `"${r.method}"`,
        r.txCount,
      ].join(",")
    );
    const blob = new Blob([header + "\n" + lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payouts.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // navigate to full detail page
  const goDetail = (id) => nav(`/dashboard/agent/payouts/${id}`);

  return (
    <div className="po">
      {/* Head */}
      <header className="po-head">
        <div>
          <h2 className="po-title">Payouts</h2>
          <p className="po-sub">
            Track transfers, view fees & net amounts, and export statements.
          </p>
        </div>

        <div className="po-actions">
          <button className="btn btn--light" onClick={exportCSV}>
            <FiDownload /> Export CSV
          </button>
          <button className="btn">
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </header>

      {/* Connect banner (if not connected) */}
      {!connected && (
        <div className="po-connect card">
          <div className="po-connect__main">
            <div className="po-connect__icon">
              <FiLink />
            </div>
            <div>
              <h4>Connect your payouts account</h4>
              <p className="muted">
                Link your bank or mobile wallet to receive earnings automatically.
              </p>
            </div>
          </div>
          <div className="po-connect__cta">
            <button className="btn">
              <FiLink /> Connect now
            </button>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <section className="po-cards">
        <article className="po-card card">
          <div className="po-card__meta">
            <span>Available balance</span>
            <b>{fmt(summary.available)}</b>
          </div>
        </article>

        <article className="po-card card">
          <div className="po-card__meta">
            <span>Upcoming payout</span>
            <b>{fmt(summary.upcoming)}</b>
          </div>
        </article>

        <article className="po-card card">
          <div className="po-card__meta">
            <span>Paid last 30 days</span>
            <b>{fmt(summary.last30)}</b>
          </div>
        </article>

        <article className="po-card card">
          <div className="po-card__meta">
            <span>On hold</span>
            <b>{fmt(summary.holds)}</b>
          </div>
        </article>
      </section>

      {/* Account box */}
      <section className="po-account card">
        <div>
          <h4>Payout method</h4>
          <p className="muted">Bank ending •••• 4821 • HomeBridge Partners LLC</p>
        </div>
        <div className="po-account__actions">
          <button className="btn btn--light">Manage</button>
          <button className="btn btn--ghost">
            Statement center <FiExternalLink />
          </button>
        </div>
      </section>

      {/* Filters */}
      <div className="po-filters card">
        <div className="po-search">
          <FiSearch />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by ID, period, or method"
          />
        </div>

        <div className="po-select">
          <FiInfo className="po-select__ico" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <FiChevronDown className="po-select__chev" />
        </div>

        <div className="po-dates">
          <label>
            <span>From</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            <span>To</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
        </div>
      </div>

      {/* Table */}
      <section className="po-table card">
        <div className="po-tr po-tr--head">
          <div>ID</div>
          <div>Date</div>
          <div>Status</div>
          <div>Period</div>
          <div>Gross</div>
          <div>Fees</div>
          <div>Net</div>
          <div className="hide-sm">Method</div>
          <div className="hide-sm">Tx</div>
          <div></div>
        </div>

        {rows.map((r) => (
          <div key={r.id} className="po-tr">
            <div className="mono">{r.id}</div>
            <div>{r.date}</div>
            <div>
              <span className={`chip chip--${r.status.replace(/\s+/g, "-").toLowerCase()}`}>
                {r.status}
              </span>
            </div>
            <div className="po-clip">{r.period}</div>
            <div>{fmt(r.amount, r.currency)}</div>
            <div className="muted">{fmt(r.fees, r.currency)}</div>
            <div>
              <b>{fmt(r.net, r.currency)}</b>
            </div>
            <div className="hide-sm po-clip">{r.method}</div>
            <div className="hide-sm">{r.txCount}</div>
            <div className="po-actions">
              <button className="btn btn--light" onClick={() => goDetail(r.id)}>
                View
              </button>
            </div>
          </div>
        ))}

        {!rows.length && (
          <div className="po-empty">
            <FiAlertCircle />
            <p>No payouts match your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
