
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiFilter, FiChevronDown, FiChevronRight, FiMail, FiFileText,
  FiCheckCircle, FiClock, FiXCircle, FiSend, FiEye, FiTrash2, FiAlertCircle
} from "react-icons/fi";
import "./Applications.css";

/* ---------- demo data ---------- */
const DEMO = [
  { id:"APP-2193", student:"Amina N.", email:"amina.n@example.com", listing:"Rutgers-Ready Studio",
    moveIn:"2025-08-24", stage:"Reviewing", docs:["Passport","I-20"], updated:"Aug 18 12:40" },
  { id:"APP-2188", student:"Brian K.", email:"brian.k@example.com", listing:"Drexel 1BR with Balcony",
    moveIn:"2025-09-02", stage:"Offer Sent", docs:["Passport","Admission"], updated:"Aug 17 10:05" },
  { id:"APP-2183", student:"Sujata P.", email:"sujata.p@example.com", listing:"Columbia Shared Room (F)",
    moveIn:"2025-08-18", stage:"New", docs:["Passport"], updated:"Aug 16 08:22" },
  { id:"APP-2177", student:"Leo M.", email:"leo.m@example.com", listing:"NJIT 1BR Loft",
    moveIn:"2025-08-29", stage:"E-signed", docs:["Passport","Lease"], updated:"Aug 14 16:03" },
  { id:"APP-2173", student:"Wanjiru K.", email:"w.kanji@example.com", listing:"UPenn Studio by Schuylkill",
    moveIn:"2025-09-10", stage:"New", docs:[], updated:"Aug 13 09:11" },
  { id:"APP-2172", student:"Ahmed S.", email:"ahmed.s@example.com", listing:"Temple Room w/ Ensuite",
    moveIn:"2025-08-20", stage:"Reviewing", docs:["Passport","Proof of funds"], updated:"Aug 12 17:45" },
];

const STAGES = ["All","New","Reviewing","Offer Sent","E-signed","Rejected","Move-in"];
const slug = (s) => String(s || "").toLowerCase().replace(/\s+/g,"-");

/* ---------- pretty select (styled native) ---------- */
function PrettySelect({ value, onChange, options, icon = <FiFilter />, ariaLabel }) {
  return (
    <label className="ap-select">
      <span className="ap-select__icon" aria-hidden>{icon}</span>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="ap-select__chev" aria-hidden><FiChevronDown /></span>
    </label>
  );
}

export default function Applications() {
  const nav = useNavigate();

  const [q, setQ] = useState("");
  const [stage, setStage] = useState("All");
  const [listingFilter, setListingFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(new Set());

  const listings = useMemo(
    () => ["All", ...Array.from(new Set(DEMO.map(d => d.listing)))],
    []
  );

  const rows = useMemo(() => {
    return DEMO.filter(r => {
      const okStage = stage === "All" ? true : r.stage === stage;
      const okListing = listingFilter === "All" ? true : r.listing === listingFilter;
      const okQuery = [r.id, r.student, r.email, r.listing].join(" ").toLowerCase().includes(q.toLowerCase());
      const okFrom = dateFrom ? new Date(r.moveIn) >= new Date(dateFrom) : true;
      const okTo = dateTo ? new Date(r.moveIn) <= new Date(dateTo) : true;
      return okStage && okListing && okQuery && okFrom && okTo;
    });
  }, [q, stage, listingFilter, dateFrom, dateTo]);

  const counts = useMemo(() => {
    const c = { All: DEMO.length };
    STAGES.slice(1).forEach(s => c[s] = DEMO.filter(d => d.stage === s).length);
    return c;
  }, []);

  function toggleAll(e){
    const on = e.target.checked;
    setSelected(on ? new Set(rows.map(r => r.id)) : new Set());
  }
  function toggleOne(id){
    setSelected(prev => {
      const c = new Set(prev);
      c.has(id) ? c.delete(id) : c.add(id);
      return c;
    });
  }

  function bulk(stage) {
    if (!selected.size) return;
    alert(`Would update ${selected.size} application(s) to "${stage}".`);
    setSelected(new Set());
  }
  function bulkDelete() {
    if (!selected.size) return;
    const ok = confirm(`Delete ${selected.size} application(s)?`);
    if (ok) { alert("Deleted (demo)."); setSelected(new Set()); }
  }

  // navigate to full detail page
  const goDetail = (id) => nav(`/dashboard/agent/applications/${id}`);

  return (
    <div className="ap">
      <header className="ap-head">
        <div>
          <h2 className="ap-title">Applications</h2>
          <p className="ap-sub">Manage inquiries through to e-signed move-ins. Use filters and bulk actions to move faster.</p>
        </div>
      </header>

      <div className="ap-tabs">
        {STAGES.map((s) => (
          <button
            key={s}
            className={`ap-tab ${stage === s ? "active" : ""}`}
            onClick={() => setStage(s)}
            type="button"
          >
            {s} <span className="pill">{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="ap-filters card">
        <label className="ap-search">
          <FiSearch aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by ID, student, email, or listing"
            aria-label="Search applications"
          />
        </label>

        <PrettySelect
          value={listingFilter}
          onChange={setListingFilter}
          options={listings}
          ariaLabel="Filter by listing"
        />

        <div className="ap-dates">
          <label className="ap-date">
            <span>Move-in from</span>
            <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
          </label>
          <label className="ap-date">
            <span>to</span>
            <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
          </label>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="ap-bulk card">
        <div className="ap-bulk__left">
          <label className="ap-check" onClick={(e)=>e.stopPropagation()}>
            <input
              type="checkbox"
              onChange={toggleAll}
              checked={rows.length > 0 && selected.size === rows.length}
              aria-checked={selected.size ? "mixed" : false}
            />
            <span>Select all</span>
          </label>
          <span className="muted">{selected.size} selected</span>
        </div>
        <div className="ap-bulk__right">
          <button className="btn btn--light" onClick={()=>bulk("Reviewing")}><FiClock /> Move to Reviewing</button>
          <button className="btn btn--light" onClick={()=>bulk("Offer Sent")}><FiSend /> Send Offer</button>
          <button className="btn btn--light" onClick={()=>bulk("Rejected")}><FiXCircle /> Reject</button>
          <button className="btn btn--danger" onClick={bulkDelete}><FiTrash2 /> Delete</button>
        </div>
      </div>

      {/* Table */}
      <div className="ap-table card">
        {/* unified column template ensures perfect alignment */}
        <div className="ap-table-head">
          <div className="ap-col--check">
            <input
              type="checkbox"
              onChange={toggleAll}
              checked={rows.length > 0 && selected.size === rows.length}
            />
          </div>
          <div>ID</div>
          <div>Student</div>
          <div className="hide-sm">Listing</div>
          <div>Move-in</div>
          <div className="hide-md">Docs</div>
          <div>Stage</div>
          <div className="hide-sm">Updated</div>
          <div></div>
        </div>
        <div className="ap-table-body">
          {rows.map(r => (
            <div
              className="ap-table-row"
              key={r.id}
              role="button"
              tabIndex={0}
              onClick={() => goDetail(r.id)}
              onKeyDown={(e)=> (e.key === "Enter" ? goDetail(r.id) : null)}
            >
              <div
                className="ap-col--check"
                onClick={(e)=>e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selected.has(r.id)}
                  onChange={() => toggleOne(r.id)}
                />
              </div>

              <div className="mono">{r.id}</div>

              <div className="ap-stu">
                <FiMail /> <div>
                  <strong>{r.student}</strong>
                  <div className="muted mini">{r.email}</div>
                </div>
              </div>

              <div className="hide-sm ap-clip">{r.listing}</div>
              <div>{r.moveIn}</div>

              <div className="hide-md">
                {r.docs.length ? (
                  <span className="chip chip--docs"><FiFileText /> {r.docs.length}</span>
                ) : <span className="chip chip--empty">None</span>}
              </div>

              <div><span className={`chip chip--${slug(r.stage)}`}>{r.stage}</span></div>
              <div className="hide-sm">{r.updated}</div>

              <div
                className="ap-actions"
                onClick={(e)=>e.stopPropagation()}
              >
                <button
                  className="btn btn--light"
                  onClick={()=>goDetail(r.id)}
                >
                  <FiEye /> View
                </button>
              </div>
            </div>
          ))}
        </div>

        {!rows.length && (
          <div className="ap-empty">
            <FiAlertCircle />
            <p>No applications match your filters.</p>
          </div>
        )}
      </div>

      {/* Pager (demo) */}
      <div className="ap-pager">
        <button className="btn btn--light" disabled>
          <FiChevronDown style={{transform:"rotate(90deg)"}}/> Prev
        </button>
        <span className="muted">Page 1 of 1</span>
        <button className="btn btn--light" disabled>
          Next <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
