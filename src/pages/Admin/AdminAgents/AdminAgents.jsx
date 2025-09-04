import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiRotateCcw,
  FiExternalLink,
  FiMail,
  FiPhone,
  FiStar,
} from "react-icons/fi";
import "./AdminAgents.css";

/* ---------- Storage helpers (frontend mock) ---------- */
const KEY = "admin:agents";

function loadAgents() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function saveAgents(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
function ensureSeed() {
  const existing = loadAgents();
  if (existing.length) return existing;

  const seed = [
    {
      id: "ag_1001",
      company: "Bridge Housing Partners",
      contactName: "Lydia Wanjiru",
      email: "lydia@bridgehousing.com",
      phone: "+1 212 555 0198",
      status: "Verified",         // "Verified" | "Pending" | "Suspended"
      kycStatus: "Passed",        // "Passed" | "Pending" | "Failed"
      listings: 24,
      applications: 132,
      rating: 4.6,
      createdAt: "2025-07-15T10:01:00Z",
      lastActiveAt: "2025-09-02T13:25:00Z",
      avatar: "https://i.pravatar.cc/80?img=65",
      region: "US-Northeast",
    },
    {
      id: "ag_1002",
      company: "MetroLets",
      contactName: "Ernest Kim",
      email: "ernest@metrolets.co",
      phone: "+44 20 7946 0321",
      status: "Pending",
      kycStatus: "Pending",
      listings: 8,
      applications: 27,
      rating: 4.2,
      createdAt: "2025-08-04T09:20:00Z",
      lastActiveAt: "2025-08-30T18:40:00Z",
      avatar: "https://i.pravatar.cc/80?img=12",
      region: "UK-London",
    },
    {
      id: "ag_1003",
      company: "Harbor Rooms",
      contactName: "Maria Alvarez",
      email: "maria@harborrooms.io",
      phone: "+1 617 555 0144",
      status: "Suspended",
      kycStatus: "Failed",
      listings: 5,
      applications: 11,
      rating: 3.9,
      createdAt: "2025-06-21T16:05:00Z",
      lastActiveAt: "2025-07-01T11:00:00Z",
      avatar: "https://i.pravatar.cc/80?img=39",
      region: "US-New England",
    },
    {
      id: "ag_1004",
      company: "CampusStay Ltd.",
      contactName: "Amelia Hart",
      email: "amelia@campusstay.uk",
      phone: "+44 161 555 0182",
      status: "Verified",
      kycStatus: "Passed",
      listings: 31,
      applications: 220,
      rating: 4.8,
      createdAt: "2025-08-19T12:40:00Z",
      lastActiveAt: "2025-09-03T08:15:00Z",
      avatar: "https://i.pravatar.cc/80?img=24",
      region: "UK-North",
    },
  ];
  saveAgents(seed);
  return seed;
}

/* ---------- Utils ---------- */
const rel = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};
const clamp1 = (n) => Math.round(n * 10) / 10;

/* ---------- Component ---------- */
export default function AdminAgents() {
  const nav = useNavigate();
  const [rows, setRows] = useState(() => ensureSeed());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");      // All | Verified | Pending | Suspended
  const [kyc, setKyc] = useState("");            // All | Passed | Pending | Failed
  const [sort, setSort] = useState("newest");    // newest | oldest | rating | listings

  useEffect(() => {
    const onStorage = () => setRows(loadAgents());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    let out = rows.filter((r) => {
      const hitQ =
        !k ||
        r.company.toLowerCase().includes(k) ||
        r.contactName.toLowerCase().includes(k) ||
        r.email.toLowerCase().includes(k) ||
        r.id.toLowerCase().includes(k);
      const hitStatus = !status || r.status === status;
      const hitKyc = !kyc || r.kycStatus === kyc;
      return hitQ && hitStatus && hitKyc;
    });

    if (sort === "newest") out = out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest") out = out.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === "rating") out = out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "listings") out = out.sort((a, b) => (b.listings || 0) - (a.listings || 0));

    return out;
  }, [rows, q, status, kyc, sort]);

  const update = (id, patch) => {
    const next = rows.map((r) => (r.id === id ? { ...r, ...patch } : r));
    setRows(next);
    saveAgents(next);
  };

  const verify = (id) =>
    update(id, { status: "Verified", kycStatus: "Passed" });
  const suspend = (id) =>
    update(id, { status: "Suspended" });
  const reinstate = (id) =>
    update(id, { status: "Pending" });

  const statusChip = (s) => (
    <span className={`agx-chip agx-status ${String(s).toLowerCase()}`}>{s}</span>
  );
  const kycChip = (s) => (
    <span className={`agx-chip agx-kyc ${String(s).toLowerCase()}`}>{s}</span>
  );

  const resetFilters = () => {
    setQ(""); setStatus(""); setKyc(""); setSort("newest");
  };

  return (
    <section className="agx-wrap card">
      {/* Toolbar */}
      <header className="agx-toolbar">
        <div className="agx-title">
          <h2>Agents</h2>
          <span className="agx-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="agx-filters">
          <div className="agx-search">
            <FiSearch />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search company, contact, email, or #ID…"
            />
          </div>

          <div className="agx-select">
            <FiFilter />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>

          <div className="agx-select">
            <span className="agx-select__label"><FiShield /> KYC</span>
            <select value={kyc} onChange={(e) => setKyc(e.target.value)}>
              <option value="">All</option>
              <option>Passed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>

          <div className="agx-select">
            <span className="agx-select__label">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="rating">Rating</option>
              <option value="listings">Listings</option>
            </select>
          </div>

          <button className="btn btn--light agx-reset" onClick={resetFilters}>
            <FiRefreshCw /> Reset
          </button>
        </div>
      </header>

      {/* Table */}
      <div className="agx-tableWrap">
        <table className="agx-table">
          <colgroup>
            <col style={{ width: "360px" }} /> {/* Agent */}
            <col style={{ width: "140px" }} /> {/* Status */}
            <col style={{ width: "130px" }} /> {/* KYC */}
            <col style={{ width: "110px" }} /> {/* Listings */}
            <col style={{ width: "140px" }} /> {/* Applications */}
            <col style={{ width: "130px" }} /> {/* Rating */}
            <col style={{ width: "190px" }} /> {/* Last Active */}
            <col style={{ width: "280px" }} /> {/* Actions */}
          </colgroup>

          <thead>
            <tr>
              <th>Agent</th>
              <th>Status</th>
              <th>KYC</th>
              <th>Listings</th>
              <th>Applications</th>
              <th>Rating</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="agx-agent">
                  <img className="agx-avatar" src={r.avatar} alt="" />
                  <div className="agx-agent__meta">
                    <div className="agx-company">
                      <button
                        className="agx-link"
                        onClick={() => nav(`/admin/agents/${r.id}`)} // make sure to add this route when ready
                        title="Open agent profile"
                      >
                        <FiExternalLink /> {r.company}
                      </button>
                    </div>
                    <div className="agx-contact">
                      <span className="agx-name">{r.contactName}</span>
                      <span className="agx-dot">•</span>
                      <a className="agx-mini" href={`mailto:${r.email}`}><FiMail /> Email</a>
                      <span className="agx-dot">•</span>
                      <a className="agx-mini" href={`tel:${r.phone}`}><FiPhone /> Call</a>
                    </div>
                    <div className="agx-region">{r.region || "—"}</div>
                    <div className="agx-id">#{r.id}</div>
                  </div>
                </td>

                <td>{statusChip(r.status)}</td>
                <td>{kycChip(r.kycStatus)}</td>
                <td><b>{r.listings || 0}</b></td>
                <td><b>{r.applications || 0}</b></td>
                <td className="agx-rating">
                  <FiStar className="agx-star" /> {clamp1(r.rating || 0)}
                </td>
                <td title={r.lastActiveAt || ""}>{rel(r.lastActiveAt)}</td>

                <td className="agx-actions">
                  {r.status !== "Verified" && (
                    <button className="btn btn--light agx-verify" onClick={() => verify(r.id)}>
                      <FiCheckCircle /> Verify
                    </button>
                  )}
                  {r.status !== "Suspended" ? (
                    <button className="btn btn--light agx-suspend" onClick={() => suspend(r.id)}>
                      <FiXCircle /> Suspend
                    </button>
                  ) : (
                    <button className="btn btn--light agx-reinstate" onClick={() => reinstate(r.id)}>
                      <FiRotateCcw /> Reinstate
                    </button>
                  )}
                  <button
                    className="btn btn--light"
                    onClick={() => nav(`/admin/agents/${r.id}`)}
                    title="Open agent profile"
                  >
                    <FiExternalLink /> View
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr className="agx-emptyRow">
                <td colSpan={8}>No agents match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
