import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiRotateCcw,
  FiShield,
  FiStar,
  FiEdit3,
  FiSave,
} from "react-icons/fi";
import "./AdminAgentDetail.css";

/* ---------- Storage helpers (frontend mock) ---------- */
const KEY = "admin:agents";
function loadAgents() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function saveAgents(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

/* Seed KYC docs if missing (persist once) */
const DEFAULT_DOCS = [
  { id: "kyc_lic", name: "Business License", type: "license", status: "Pending", uploadedAt: "2025-08-20T10:00:00Z" },
  { id: "kyc_id",  name: "Director Government ID", type: "government-id", status: "Pending", uploadedAt: "2025-08-20T10:02:00Z" },
  { id: "kyc_addr", name: "Proof of Address", type: "address-proof", status: "Pending", uploadedAt: "2025-08-20T10:05:00Z" },
  { id: "kyc_bank", name: "Bank Letter", type: "bank-letter", status: "Pending", uploadedAt: "2025-08-20T10:07:00Z" },
];

function ensureDocs(agent, agents) {
  if (Array.isArray(agent.docs) && agent.docs.length) return agent;
  const next = agents.map(a => a.id === agent.id ? { ...a, docs: DEFAULT_DOCS } : a);
  saveAgents(next);
  return next.find(a => a.id === agent.id) || agent;
}

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
const clamp1 = (n) => Math.round((n || 0) * 10) / 10;

/* ---------- Component ---------- */
export default function AdminAgentDetail() {
  const { agentId } = useParams();
  const nav = useNavigate();

  const [agents, setAgents] = useState(loadAgents());
  const [agent, setAgent] = useState(() => agents.find(a => String(a.id) === String(agentId)));
  const [notes, setNotes] = useState(agent?.notes || "");
  const [editingCompany, setEditingCompany] = useState(false);
  const [companyDraft, setCompanyDraft] = useState(agent?.company || "");

  // Hydrate docs on first visit if missing
  useEffect(() => {
    if (!agent) return;
    const withDocs = ensureDocs(agent, agents);
    if (withDocs !== agent) {
      setAgents(loadAgents());
      setAgent(loadAgents().find(a => a.id === agentId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // sync notes UI if agent changes
    if (agent) setNotes(agent.notes || "");
  }, [agent]);

  const notFound = !agent;

  const updateAgent = (patch) => {
    const next = agents.map(a => a.id === agent.id ? { ...a, ...patch } : a);
    saveAgents(next);
    setAgents(next);
    setAgent(next.find(a => a.id === agent.id));
  };

  const updateDocStatus = (docId, status) => {
    const next = agents.map(a => {
      if (a.id !== agent.id) return a;
      const docs = (a.docs || []).map(d => d.id === docId ? { ...d, status } : d);
      return { ...a, docs };
    });
    saveAgents(next);
    const updated = next.find(a => a.id === agent.id);
    setAgents(next);
    setAgent(updated);
  };

  const approveKyc = () => updateAgent({ kycStatus: "Passed", status: agent.status === "Suspended" ? "Suspended" : "Verified" });
  const failKyc = () => updateAgent({ kycStatus: "Failed" });
  const verify = () => updateAgent({ status: "Verified", kycStatus: agent.kycStatus === "Pending" ? "Passed" : agent.kycStatus });
  const suspend = () => updateAgent({ status: "Suspended" });
  const reinstate = () => updateAgent({ status: "Pending" });

  const saveNotes = () => updateAgent({ notes });

  const statusChip = (s) => (
    <span className={`agd-chip agd-status ${String(s).toLowerCase()}`}>{s}</span>
  );
  const kycChip = (s) => (
    <span className={`agd-chip agd-kyc ${String(s).toLowerCase()}`}>
      <FiShield /> {s}
    </span>
  );

  const stars = (n) => {
    const v = clamp1(n);
    const filled = Math.round(v);
    return (
      <span className="agd-stars" title={`${v} / 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar key={i} className={`agd-star ${i < filled ? "is-on" : ""}`} />
        ))}
        <b>{v}</b>
      </span>
    );
  };

  if (notFound) {
    return (
      <section className="agd-wrap">
        <header className="agd-head card">
          <button className="btn btn--light" onClick={() => nav(-1)}><FiArrowLeft/> Back</button>
          <h2>Agent not found</h2>
        </header>
      </section>
    );
  }

  return (
    <section className="agd-wrap">
      {/* Header */}
      <header className="agd-head card">
        <div className="agd-left">
          <button className="btn btn--light" onClick={() => nav(-1)}><FiArrowLeft/> Back</button>
          <div className="agd-title">
            <img className="agd-avatar" src={agent.avatar} alt="" />
            <div className="agd-title__meta">
              <div className="agd-company">
                {editingCompany ? (
                  <div className="agd-editRow">
                    <input
                      className="input"
                      value={companyDraft}
                      onChange={(e) => setCompanyDraft(e.target.value)}
                    />
                    <button
                      className="btn btn--light"
                      onClick={() => { setEditingCompany(false); updateAgent({ company: companyDraft }); }}
                    >
                      <FiSave /> Save
                    </button>
                  </div>
                ) : (
                  <>
                    <h2>{agent.company}</h2>
                    <button className="agd-edit" onClick={() => setEditingCompany(true)} title="Edit company name">
                      <FiEdit3 />
                    </button>
                  </>
                )}
              </div>
              <div className="agd-minor">
                <span>#{agent.id}</span>
                <span className="agd-dot">•</span>
                <span>{agent.region || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="agd-right">
          {statusChip(agent.status)} {kycChip(agent.kycStatus)}
          {agent.status !== "Verified" && (
            <button className="btn btn--light agd-verify" onClick={verify}><FiCheckCircle/> Verify</button>
          )}
          {agent.status !== "Suspended" ? (
            <button className="btn btn--light agd-suspend" onClick={suspend}><FiXCircle/> Suspend</button>
          ) : (
            <button className="btn btn--light agd-reinstate" onClick={reinstate}><FiRotateCcw/> Reinstate</button>
          )}
        </div>
      </header>

      {/* Grid */}
      <div className="agd-grid">
        {/* LEFT column */}
        <section className="card agd-card">
          <h3>Profile</h3>
          <div className="agd-kv">
            <div><span>Company</span><b>{agent.company}</b></div>
            <div><span>Contact</span><b>{agent.contactName || "—"}</b></div>
            <div><span>Email</span><a className="agd-link" href={`mailto:${agent.email}`}><FiMail/> {agent.email}</a></div>
            <div><span>Phone</span><a className="agd-link" href={`tel:${agent.phone}`}><FiPhone/> {agent.phone}</a></div>
            <div><span>Region</span><b>{agent.region || "—"}</b></div>
            <div><span>Created</span><b>{agent.createdAt ? new Date(agent.createdAt).toLocaleString() : "—"}</b></div>
            <div><span>Last Active</span><b title={agent.lastActiveAt || ""}>{rel(agent.lastActiveAt)}</b></div>
            <div><span>Rating</span>{stars(agent.rating)}</div>
          </div>
        </section>

        <section className="card agd-card">
          <h3>Performance</h3>
          <div className="agd-metrics">
            <div className="agd-metric">
              <span>Listings</span>
              <b>{agent.listings || 0}</b>
              <div className="agd-bar"><span style={{ width: `${Math.min(100, (agent.listings || 0) * 3)}%` }} /></div>
            </div>
            <div className="agd-metric">
              <span>Applications</span>
              <b>{agent.applications || 0}</b>
              <div className="agd-bar"><span style={{ width: `${Math.min(100, (agent.applications || 0) / 3)}%` }} /></div>
            </div>
            <div className="agd-metric">
              <span>Conversion</span>
              <b>{Math.min(100, Math.round(((agent.applications || 0) / Math.max(1, (agent.listings || 0) * 20)) * 100))}%</b>
              <div className="agd-bar"><span style={{ width: `${Math.min(100, ((agent.applications || 0) / Math.max(1, (agent.listings || 0) * 20)) * 100)}%` }} /></div>
            </div>
          </div>
        </section>

        {/* RIGHT column */}
        <section className="card agd-card">
          <h3>Compliance / KYC</h3>
          <div className="agd-docs">
            {(agent.docs || []).map(doc => (
              <div key={doc.id} className="agd-doc">
                <div className="agd-doc__meta">
                  <b>{doc.name}</b>
                  <small className="agd-sub">
                    {doc.type} • Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}
                  </small>
                </div>
                <div className="agd-doc__ctrls">
                  <span className={`agd-chip agd-docchip ${doc.status.toLowerCase()}`}>{doc.status}</span>
                  <button className="btn btn--light" onClick={() => updateDocStatus(doc.id, "Verified")}><FiCheckCircle/> Verify</button>
                  <button className="btn btn--light" onClick={() => updateDocStatus(doc.id, "Rejected")}><FiXCircle/> Reject</button>
                </div>
              </div>
            ))}
          </div>

          <div className="agd-kycActions">
            <button className="btn agd-approve" onClick={approveKyc}><FiCheckCircle/> Approve KYC</button>
            <button className="btn btn--light agd-fail" onClick={failKyc}><FiXCircle/> Fail KYC</button>
          </div>
        </section>

        <section className="card agd-card">
          <h3>Internal Notes</h3>
          <textarea
            className="textarea"
            rows={5}
            placeholder="Add screening notes, escalations, or flags visible to ops only…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="agd-noteRow">
            <button className="btn btn--light" onClick={() => setNotes(agent.notes || "")}>Reset</button>
            <button className="btn" onClick={saveNotes}><FiSave/> Save Notes</button>
          </div>
        </section>
      </div>
    </section>
  );
}
