// src/pages/Admin/Bookings/AdminBookings.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiExternalLink,
  FiSearch,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import "./AdminBookings.css";

function load() {
  try { return JSON.parse(localStorage.getItem("student:bookings")) || []; } catch { return []; }
}
function save(list) { localStorage.setItem("student:bookings", JSON.stringify(list)); }

const STATUS_LIST = [
  "Pending Payment",
  "Payment Complete",
  "Ready to Submit",
  "Under Review",
  "Approved",
  "Rejected",
];

// ---------- DEMO SEEDING ----------
const SAMPLE_LISTINGS = ["hb-001","hb-002","hb-003","hb-004","hb-005","hb-006","hb-007","hb-008","hb-009","hb-010"];
const STATUS_CYCLE = ["Pending Payment","Payment Complete","Ready to Submit","Under Review","Approved","Rejected"];

const pad = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

function makeBooking(i, baseTs){
  const id = `b_${baseTs}_${i}`;
  const createdAt = new Date(baseTs - i * 86400000).toISOString(); // stagger by days
  const checkIn = new Date(baseTs + (10 + i) * 86400000);
  const checkOut = new Date(baseTs + (300 + i*5) * 86400000);
  const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
  const docCount = 2 + (i % 4); // 2..5
  const docIds = Array.from({length: docCount}, (_,k)=>`d_${id}_${k}`);

  const row = {
    id,
    listingId: SAMPLE_LISTINGS[i % SAMPLE_LISTINGS.length],
    dates: { checkIn: isoDate(checkIn), checkOut: isoDate(checkOut) },
    docIds,
    status,
    createdAt
  };

  if (status === "Payment Complete") row.feePaidAt = createdAt;
  if (status === "Ready to Submit") row.feePaidAt = createdAt, row.submittedAt = createdAt;
  if (status === "Approved") row.adminDecision = "approved", row.decisionAt = createdAt;
  if (status === "Rejected") row.adminDecision = "rejected", row.decisionAt = createdAt;

  return row;
}

function ensureAtLeastFive(){
  const current = load();
  if (current.length >= 5) return current;

  const needed = 5 - current.length;
  const baseTs = Date.now();
  const fresh = Array.from({length: needed}, (_,i)=> makeBooking(i, baseTs));

  const merged = [...fresh, ...current]; // put fresh first so they show at top (newest)
  save(merged);
  return merged;
}
// ----------------------------------

export default function AdminBookings() {
  const nav = useNavigate();
  const [rows, setRows] = useState(() => ensureAtLeastFive());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [timeframe, setTimeframe] = useState("all"); // all | 7 | 30
  const [sort, setSort] = useState("newest"); // newest | oldest | status

  useEffect(() => {
    const onStorage = () => setRows(load());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    const now = Date.now();
    const within = (iso) => {
      if (timeframe === "all" || !iso) return true;
      const days = Number(timeframe);
      const then = new Date(iso).getTime();
      return now - then <= days * 24 * 60 * 60 * 1000;
    };

    let out = rows.filter((r) => {
      const mQ =
        !k ||
        String(r.id).toLowerCase().includes(k) ||
        String(r.listingId).toLowerCase().includes(k);
      const mS = !status || (r.status || "").toLowerCase() === status.toLowerCase();
      const mT = within(r.createdAt);
      return mQ && mS && mT;
    });

    if (sort === "newest") out = out.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (sort === "oldest") out = out.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    else if (sort === "status") out = out.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    return out;
  }, [rows, q, status, timeframe, sort]);

  const decide = (id, decision) => {
    const next = rows.map((r) =>
      r.id === id
        ? {
            ...r,
            adminDecision: decision,
            decisionAt: new Date().toISOString(),
            status: decision === "approved" ? "Approved" : "Rejected",
          }
        : r
    );
    setRows(next); save(next);
  };

  const statusChip = (s) => {
    const key = (s || "").toLowerCase().replace(/\s+/g, "-");
    return <span className={`adb-chip ${key || "pending"}`}>{s || "—"}</span>;
  };

  const resetFilters = () => { setQ(""); setStatus(""); setTimeframe("all"); setSort("newest"); };

  return (
    <section className="adb-wrap card">
      {/* Toolbar / Filters */}
      <header className="adb-toolbar">
        <div className="adb-title">
          <h2>Bookings</h2>
          <span className="adb-count">{filtered.length} results</span>
        </div>

        <div className="adb-filters">
          <label className="adb-search">
            <FiSearch />
            <input
              placeholder="Search by #ID or listing…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <label className="adb-select">
            <FiFilter />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="adb-select">
            <span className="adb-select__label">Time</span>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option value="all">All time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </label>

          <label className="adb-select">
            <span className="adb-select__label">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="status">Status</option>
            </select>
          </label>

          <button className="btn btn--light adb-reset" onClick={resetFilters}>
            <FiRefreshCw /> Reset
          </button>
        </div>
      </header>

      {/* Table */}
      <div className="adb-tableWrap">
        <table className="adb-table">
          <thead>
            <tr>
              <th className="adb-col-id">#</th>
              <th className="adb-col-listing">Listing</th>
              <th className="adb-col-dates">Dates</th>
              <th className="adb-col-docs">Docs</th>
              <th className="adb-col-status">Status</th>
              <th className="adb-col-decision">Decision</th>
              <th className="adb-col-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="adb-id">
                  <button
                    className="adb-link"
                    onClick={() => nav(`/admin/bookings/${r.id}`)}
                    title="Open details"
                  >
                    <FiExternalLink /> {r.id}
                  </button>
                </td>

                <td className="adb-cell-strong">{r.listingId}</td>

                <td className="adb-dates">
                  {r?.dates?.checkIn || "—"} <span className="adb-arrow">→</span> {r?.dates?.checkOut || "—"}
                </td>

                <td className="adb-docs">{Array.isArray(r.docIds) ? r.docIds.length : 0}</td>

                <td className="adb-status">{statusChip(r.status)}</td>

                <td className="adb-decision">
                  {r.adminDecision ? (
                    <span className="adb-note">
                      {r.adminDecision} on <b>{new Date(r.decisionAt).toLocaleString()}</b>
                    </span>
                  ) : (
                    <span className="adb-note">—</span>
                  )}
                </td>

                <td className="adb-actions">
                  <button className="btn btn--light" onClick={() => nav(`/admin/bookings/${r.id}`)}>
                    <FiExternalLink /> View
                  </button>
                  <button className="btn btn--light adb-approve" onClick={() => decide(r.id, "approved")}>
                    <FiCheckCircle /> Approve
                  </button>
                  <button className="btn btn--light adb-reject" onClick={() => decide(r.id, "rejected")}>
                    <FiXCircle /> Reject
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr className="adb-emptyRow">
                <td colSpan={7}>No bookings match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
