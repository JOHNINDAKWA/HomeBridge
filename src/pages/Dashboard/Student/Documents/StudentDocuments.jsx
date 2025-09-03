import { useEffect, useMemo, useRef, useState } from "react";
import { FiUpload, FiTrash2, FiFileText, FiEdit3, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../../../Context/AuthContext.jsx";
import "./StudentDocuments.css";

const CATEGORY_OPTIONS = [
  "Passport/ID",
  "Admission Letter",
  "I-20/SEVIS",
  "Financial/Bank",
  "Visa/Permit",
  "Other",
];

const STATUS_OPTIONS = [
  ["none", "Not started"],
  ["submitted", "Submitted"],
  ["verified", "Verified"],
];

const guessCategory = (name = "") => {
  const n = name.toLowerCase();
  if (/(passport|id|identity|national)/.test(n)) return "Passport/ID";
  if (/(admission|offer|acceptance)/.test(n)) return "Admission Letter";
  if (/(i-20|sevis)/.test(n)) return "I-20/SEVIS";
  if (/(bank|statement|sponsor|financial)/.test(n)) return "Financial/Bank";
  if (/(visa|permit)/.test(n)) return "Visa/Permit";
  return "Other";
};

const prettySize = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function StudentDocuments() {
  const { documents = [], setDocuments } = useAuth();
  const fileRef = useRef(null);
  const dropRef = useRef(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  // Normalize legacy docs with defaults (do not mutate original array)
  const normalized = useMemo(
    () =>
      (documents || []).map((d) => ({
        status: "none",
        category: guessCategory(d.name),
        ...d,
      })),
    [documents]
  );

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return normalized.filter((d) => {
      const matchQ = !k || d.name.toLowerCase().includes(k);
      const matchC = !cat || d.category === cat;
      return matchQ && matchC;
    });
  }, [normalized, q, cat]);

  // Upload handlers
  const handleFiles = (files) => {
    const newDocs = Array.from(files).map((f, i) => ({
      id: `${Date.now()}_${i}`,
      name: f.name,
      type: f.type || "file",
      size: f.size || 0,
      category: guessCategory(f.name),
      status: "none",
    }));
    setDocuments([...(documents || []), ...newDocs]);
  };

  // Drag & drop UX
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const on = (ev) => { ev.preventDefault(); ev.stopPropagation(); el.classList.add("is-drag"); };
    const off = (ev) => { ev.preventDefault(); ev.stopPropagation(); el.classList.remove("is-drag"); };
    const drop = (ev) => {
      ev.preventDefault(); ev.stopPropagation(); el.classList.remove("is-drag");
      if (ev.dataTransfer?.files?.length) handleFiles(ev.dataTransfer.files);
    };

    el.addEventListener("dragenter", on);
    el.addEventListener("dragover", on);
    el.addEventListener("dragleave", off);
    el.addEventListener("drop", drop);
    return () => {
      el.removeEventListener("dragenter", on);
      el.removeEventListener("dragover", on);
      el.removeEventListener("dragleave", off);
      el.removeEventListener("drop", drop);
    };
  }, []);

  // Mutations
  const removeDoc = (id) => setDocuments((docs) => (docs || []).filter((d) => d.id !== id));
  const renameDoc = (id, name) =>
    setDocuments((docs) => (docs || []).map((d) => (d.id === id ? { ...d, name, category: guessCategory(name) } : d)));
  const changeCategory = (id, category) =>
    setDocuments((docs) => (docs || []).map((d) => (d.id === id ? { ...d, category } : d)));
  const changeStatus = (id, status) =>
    setDocuments((docs) => (docs || []).map((d) => (d.id === id ? { ...d, status } : d)));

  return (
    <section className="sdd-wrap card">
      <header className="sdd-head">
        <div className="sdd-title">
          <h2>Your Documents</h2>
          <p className="sdd-sub">Upload once—reuse in every booking. Categorize and track verification.</p>
        </div>

        <div className="sdd-tools">
          <div className="sdd-search">
            <input
              placeholder="Search by name (e.g., Passport, I-20)…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className="sdd-select" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button className="btn" onClick={() => fileRef.current?.click()}><FiUpload /> Upload</button>
          <input ref={fileRef} type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
        </div>
      </header>

      {/* Dropzone */}
      <div ref={dropRef} className="sdd-drop card">
        <div className="sdd-drop__ico"><FiUpload /></div>
        <div className="sdd-drop__text">
          <b>Drag & drop</b> your files here, or <button className="sdd-link" onClick={() => fileRef.current?.click()}>browse</button>
        </div>
        <div className="sdd-drop__hint">PDF, JPG, PNG • Max ~10MB each (mock)</div>
      </div>

      {/* Empty */}
      {(normalized?.length || 0) === 0 ? (
        <div className="sdd-empty">
          <div className="sdd-ico"><FiFileText /></div>
          <p>No documents yet. Start by uploading your <b>Passport/ID</b> and <b>Admission Letter</b>.</p>
          <button className="btn" onClick={() => fileRef.current?.click()}><FiUpload /> Upload documents</button>
        </div>
      ) : (
        <ul className="sdd-list">
          {filtered.map((doc) => (
            <li key={doc.id} className="sdd-item">
              <div className="sdd-meta">
                <div className="sdd-fileico"><FiFileText /></div>
                <div className="sdd-mcol">
                  <input
                    className="sdd-name"
                    value={doc.name}
                    onChange={(e) => renameDoc(doc.id, e.target.value)}
                  />
                  <div className="sdd-sub">
                    <span>{prettySize(doc.size)}</span>
                    <span className="sdd-dot" />
                    <span className="sdd-badge">{doc.category}</span>
                  </div>
                </div>
              </div>

              <div className="sdd-controls">
                <select
                  className="sdd-select"
                  value={doc.category}
                  onChange={(e) => changeCategory(doc.id, e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  className={`sdd-select sdd-status s-${doc.status}`}
                  value={doc.status}
                  onChange={(e) => changeStatus(doc.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(([k, label]) => (
                    <option key={k} value={k}>{label}</option>
                  ))}
                </select>

                <button className="sdd-iconbtn" title="Remove" onClick={() => removeDoc(doc.id)}>
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="sdd-emptyrow">
              No documents match the filter.
            </li>
          )}
        </ul>
      )}

      {/* Footer tip */}
      <footer className="sdd-foot">
        <div className="sdd-note">
          <FiCheckCircle /> Changes save automatically.
        </div>
      </footer>
    </section>
  );
}
