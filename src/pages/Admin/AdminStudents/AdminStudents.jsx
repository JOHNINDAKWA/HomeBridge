import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiRotateCcw,
  FiExternalLink,
} from "react-icons/fi";
import "./AdminStudents.css";

/* ---------- Local storage (frontend mock) ---------- */
const KEY = "admin:students";

function loadStudents() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function saveStudents(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
function ensureSeed() {
  const existing = loadStudents();
  if (existing.length) return existing;

  const seed = [
    {
      id: "st_5001",
      name: "Amina Njoroge",
      email: "amina.njoroge@example.com",
      phone: "+254 712 123 456",
      school: "Rutgers University – Newark",
      program: "MSc Data Science",
      intake: "2025–26",
      region: "US-Northeast",
      docsCount: 3,
      docsRequired: 4,
      kycStatus: "Pending", // Pending | Passed | Failed
      status: "Active",      // Active | Suspended
      bookings: 2,
      createdAt: "2025-07-10T11:00:00Z",
      lastActiveAt: "2025-09-03T08:10:00Z",
      avatar: "https://i.pravatar.cc/80?img=57",
    },
    {
      id: "st_5002",
      name: "Erick Muli",
      email: "erick.muli@example.com",
      phone: "+254 733 555 011",
      school: "Columbia University",
      program: "BA Economics",
      intake: "2025–26",
      region: "US-Northeast",
      docsCount: 4,
      docsRequired: 4,
      kycStatus: "Passed",
      status: "Active",
      bookings: 1,
      createdAt: "2025-08-01T09:20:00Z",
      lastActiveAt: "2025-09-02T14:32:00Z",
      avatar: "https://i.pravatar.cc/80?img=22",
    },
    {
      id: "st_5003",
      name: "Maria Gomez",
      email: "maria.gomez@example.com",
      phone: "+1 917 555 0182",
      school: "NYU – Washington Square",
      program: "MA International Relations",
      intake: "2024–25",
      region: "US-Northeast",
      docsCount: 2,
      docsRequired: 4,
      kycStatus: "Failed",
      status: "Suspended",
      bookings: 0,
      createdAt: "2025-06-19T15:05:00Z",
      lastActiveAt: "2025-07-04T13:01:00Z",
      avatar: "https://i.pravatar.cc/80?img=30",
    },
    {
      id: "st_5004",
      name: "Haruto Tanaka",
      email: "haruto.tanaka@example.com",
      phone: "+81 90 1111 2222",
      school: "Drexel University",
      program: "BEng Mechanical",
      intake: "2025–26",
      region: "US-Mid-Atlantic",
      docsCount: 4,
      docsRequired: 4,
      kycStatus: "Passed",
      status: "Active",
      bookings: 3,
      createdAt: "2025-08-21T12:00:00Z",
      lastActiveAt: "2025-09-03T10:45:00Z",
      avatar: "https://i.pravatar.cc/80?img=5",
    },
  ];
  saveStudents(seed);
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

/* ---------- Component ---------- */
export default function AdminStudents() {
  const nav = useNavigate();
  const [rows, setRows] = useState(() => ensureSeed());
  const [q, setQ] = useState("");
  const [kyc, setKyc] = useState("");       // "", Passed, Pending, Failed
  const [status, setStatus] = useState(""); // "", Active, Suspended
  const [intake, setIntake] = useState(""); // "", 2025–26, 2024–25...
  const [sort, setSort] = useState("newest"); // newest | oldest | bookings | docs

  useEffect(() => {
    const onStorage = () => setRows(loadStudents());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const allIntakes = useMemo(() => {
    const s = new Set(rows.map((r) => r.intake).filter(Boolean));
    return Array.from(s).sort().reverse();
  }, [rows]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    let out = rows.filter((r) => {
      const hitQ =
        !k ||
        r.name.toLowerCase().includes(k) ||
        r.email.toLowerCase().includes(k) ||
        r.school.toLowerCase().includes(k) ||
        r.id.toLowerCase().includes(k);
      const hitKyc = !kyc || r.kycStatus === kyc;
      const hitStatus = !status || r.status === status;
      const hitIntake = !intake || r.intake === intake;
      return hitQ && hitKyc && hitStatus && hitIntake;
    });

    if (sort === "newest") out = out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest") out = out.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === "bookings") out = out.sort((a, b) => (b.bookings || 0) - (a.bookings || 0));
    if (sort === "docs") {
      const score = (r) => (r.docsRequired ? r.docsCount / r.docsRequired : 0);
      out = out.sort((a, b) => score(b) - score(a));
    }
    return out;
  }, [rows, q, kyc, status, intake, sort]);

  const stats = useMemo(() => {
    const total = rows.length;
    const passed = rows.filter((r) => r.kycStatus === "Passed").length;
    const pending = rows.filter((r) => r.kycStatus === "Pending").length;
    const failed = rows.filter((r) => r.kycStatus === "Failed").length;
    const active = rows.filter((r) => r.status === "Active").length;
    const suspended = rows.filter((r) => r.status === "Suspended").length;
    return { total, passed, pending, failed, active, suspended };
  }, [rows]);

  /* Actions */
  const update = (id, patch) => {
    const next = rows.map((r) => (r.id === id ? { ...r, ...patch } : r));
    setRows(next);
    saveStudents(next);
  };
  const verifyKyc = (id) => update(id, { kycStatus: "Passed", status: "Active", docsCount: Math.max(1, rows.find(r => r.id === id)?.docsRequired || 4) });
  const failKyc = (id) => update(id, { kycStatus: "Failed" });
  const suspend = (id) => update(id, { status: "Suspended" });
  const reinstate = (id) => update(id, { status: "Active" });

  const resetFilters = () => { setQ(""); setKyc(""); setStatus(""); setIntake(""); setSort("newest"); };

  const chipKyc = (s) => <span className={`asx-chip asx-kyc ${String(s).toLowerCase()}`}>{s}</span>;
  const chipStatus = (s) => <span className={`asx-chip asx-status ${String(s).toLowerCase()}`}>{s}</span>;

  const docsBar = (c, r) => {
    const pct = r ? Math.min(100, Math.round((c / r) * 100)) : 0;
    return (
      <div className="asx-docs">
        <div className="asx-docs__bar"><span style={{ width: `${pct}%` }} /></div>
        <div className="asx-docs__num">{c}/{r}</div>
      </div>
    );
  };

  return (
    <section className="asx-wrap">
      {/* KPI Row */}
      <div className="asx-kpis">
        <div className="asx-kpi card">
          <span>Total Students</span>
          <b>{stats.total}</b>
        </div>
        <div className="asx-kpi card">
          <span>KYC Passed</span>
          <b>{stats.passed}</b>
        </div>
        <div className="asx-kpi card">
          <span>KYC Pending</span>
          <b>{stats.pending}</b>
        </div>
        <div className="asx-kpi card">
          <span>KYC Failed</span>
          <b>{stats.failed}</b>
        </div>
        <div className="asx-kpi card">
          <span>Active</span>
          <b>{stats.active}</b>
        </div>
        <div className="asx-kpi card">
          <span>Suspended</span>
          <b>{stats.suspended}</b>
        </div>
      </div>

      {/* Toolbar */}
      <header className="asx-toolbars card">
        <div className="asx-search2">
          <FiSearch />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, school, or #ID…"
          />
        </div>

        <div className="asx-filterRow2">
          <div className="asx-select2">
            <FiFilter />
            <select value={kyc} onChange={(e) => setKyc(e.target.value)}>
              <option value="">KYC: All</option>
              <option>Passed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>

          <div className="asx-select2">
            <span className="asx-select__label2">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>

          <div className="asx-select2">
            <span className="asx-select__label2">Intake</span>
            <select value={intake} onChange={(e) => setIntake(e.target.value)}>
              <option value="">All</option>
              {allIntakes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="asx-select2">
            <span className="asx-select__label2">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="bookings">Bookings</option>
              <option value="docs">Docs completeness</option>
            </select>
          </div>

          <button className="btn btn--light asx-reset2" onClick={resetFilters}>
            <FiRefreshCw /> Reset
          </button>
        </div>
      </header>

      {/* Table */}
      <div className="asx-tableWrap card">
        <table className="asx-table">
          <colgroup>
            <col style={{ width: "360px" }} /> {/* Student */}
            <col style={{ width: "300px" }} /> {/* University/Program */}
            <col style={{ width: "130px" }} /> {/* Intake */}
            <col style={{ width: "160px" }} /> {/* Docs */}
            <col style={{ width: "130px" }} /> {/* KYC */}
            <col style={{ width: "130px" }} /> {/* Status */}
            <col style={{ width: "120px" }} /> {/* Bookings */}
            <col style={{ width: "170px" }} /> {/* Last Active */}
            <col style={{ width: "300px" }} /> {/* Actions */}
          </colgroup>

          <thead>
            <tr>
              <th>Student</th>
              <th>University / Program</th>
              <th>Intake</th>
              <th>Docs</th>
              <th>KYC</th>
              <th>Status</th>
              <th>Bookings</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="asx-stu">
                  <img className="asx-ava" src={r.avatar} alt="" />
                  <div className="asx-stuMeta">
                    <div className="asx-nameRow">
                      <button
                        className="asx-link"
                        onClick={() => nav(`/admin/students/${r.id}`)} // detail page later
                        title="Open student profile"
                      >
                        <FiExternalLink /> {r.name}
                      </button>
                      <span className="asx-id">#{r.id}</span>
                    </div>
                    <div className="asx-contact">
                      <a className="asx-mini" href={`mailto:${r.email}`}><FiMail /> {r.email}</a>
                      <span className="asx-dot">•</span>
                      <a className="asx-mini" href={`tel:${r.phone}`}><FiPhone /> {r.phone}</a>
                    </div>
                    <div className="asx-region">{r.region || "—"}</div>
                  </div>
                </td>

                <td>
                  <div className="asx-uni"><b>{r.school}</b></div>
                  <div className="asx-prog">{r.program}</div>
                </td>

                <td>{r.intake || "—"}</td>

                <td>{docsBar(r.docsCount || 0, r.docsRequired || 0)}</td>

                <td>{chipKyc(r.kycStatus)}</td>
                <td>{chipStatus(r.status)}</td>

                <td><b>{r.bookings || 0}</b></td>

                <td title={r.lastActiveAt || ""}>{rel(r.lastActiveAt)}</td>

                <td className="asx-actions">
                  {r.kycStatus !== "Passed" && (
                    <button className="btn btn--light asx-verify" onClick={() => verifyKyc(r.id)}>
                      <FiCheckCircle /> Verify KYC
                    </button>
                  )}
                  {r.kycStatus !== "Failed" && r.kycStatus !== "Passed" && (
                    <button className="btn btn--light asx-fail" onClick={() => failKyc(r.id)}>
                      <FiXCircle /> Fail KYC
                    </button>
                  )}
                  {r.status !== "Suspended" ? (
                    <button className="btn btn--light asx-suspend" onClick={() => suspend(r.id)}>
                      <FiXCircle /> Suspend
                    </button>
                  ) : (
                    <button className="btn btn--light asx-reinstate" onClick={() => reinstate(r.id)}>
                      <FiRotateCcw /> Reinstate
                    </button>
                  )}
                  <button className="btn btn--light" onClick={() => nav(`/admin/students/${r.id}`)}>
                    <FiExternalLink /> View
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr className="asx-emptyRow">
                <td colSpan={9}>No students match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
