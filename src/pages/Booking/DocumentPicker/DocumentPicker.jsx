import { useMemo, useRef, useState } from "react";
import {
  FiUpload, FiCheckCircle, FiFileText, FiSearch, FiFilter, FiX, FiPaperclip
} from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "./DocumentPicker.css";

/** Optional categories to guide the student */
const CATEGORY_OPTIONS = [
  "Passport/ID",
  "Admission Letter",
  "I-20/SEVIS",
  "Financial/Bank",
  "Visa/Permit",
  "Other",
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

export default function DocumentPicker({ selected = [], onChange, min = 1, max = 10 }) {
  const { documents = [], setDocuments } = useAuth();
  const [q, setQ] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const fileRef = useRef(null);

  // Backfill category/status for old docs
  const normalizedDocs = useMemo(() => {
    return documents.map((d) => ({
      status: "none",
      category: guessCategory(d.name),
      ...d,
    }));
  }, [documents]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return normalizedDocs.filter((d) => {
      const matchQ = !qq || d.name.toLowerCase().includes(qq);
      const matchC = !filterCat || d.category === filterCat;
      return matchQ && matchC;
    });
  }, [normalizedDocs, q, filterCat]);

  const isSelected = (id) => selected.some((s) => s.id === id);

  const toggle = (doc) => {
    if (!isSelected(doc.id)) {
      if (selected.length >= max) return;
      onChange([...selected, doc]);
    } else {
      onChange(selected.filter((s) => s.id !== doc.id));
    }
  };

  const selectAllVisible = () => {
    const addable = filtered.filter((d) => !isSelected(d.id)).slice(0, Math.max(0, max - selected.length));
    if (addable.length) onChange([...selected, ...addable]);
  };
  const clearSelection = () => onChange([]);

  const uploadDocs = (files) => {
    const newDocs = Array.from(files).map((f, i) => ({
      id: `${Date.now()}_${i}`,
      name: f.name,
      type: f.type || "file",
      size: f.size || 0,
      category: guessCategory(f.name),
      status: "none",
    }));
    setDocuments([...(documents || []), ...newDocs]);
    // auto-select the freshly uploaded, within max
    const pick = [];
    for (const d of newDocs) {
      if (pick.length + selected.length < max) pick.push(d);
    }
    if (pick.length) onChange([...selected, ...pick]);
  };

  return (
    <div className="dp card">
      {/* Controls */}
      <div className="dp-controls">
        <div className="dp-search">
          <FiSearch />
          <input
            placeholder="Search documents (e.g., passport, I-20)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="dp-filters">
          <div className="dp-filter-icon"><FiFilter /></div>
          <div className="dp-cats">
            <button
              className={`dp-chip ${!filterCat ? "is-active" : ""}`}
              onClick={() => setFilterCat("")}
            >
              All
            </button>
            {CATEGORY_OPTIONS.map((c) => (
              <button
                key={c}
                className={`dp-chip ${filterCat === c ? "is-active" : ""}`}
                onClick={() => setFilterCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="dp-actions">
          <button className="btn btn--light" onClick={selectAllVisible}>Select visible</button>
          <button className="btn btn--ghost" onClick={clearSelection}>Clear</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            <FiUpload /> Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={(e) => uploadDocs(e.target.files)}
          />
        </div>
      </div>

      {/* Empty state */}
      {normalizedDocs.length === 0 && (
        <div className="dp-empty">
          <div className="dp-empty__ico"><FiFileText /></div>
          <p>No documents yet. Upload your passport, admission letter, I-20, or bank statement.</p>
          <button className="btn" onClick={() => fileRef.current?.click()}><FiUpload /> Upload documents</button>
        </div>
      )}

      {/* List */}
      {normalizedDocs.length > 0 && (
        <ul className="dp-list">
          {filtered.map((doc) => (
            <li
              key={doc.id}
              className={`dp-item ${isSelected(doc.id) ? "is-selected" : ""}`}
              onClick={() => toggle(doc)}
            >
              <label className="dp-check">
                <input
                  type="checkbox"
                  checked={isSelected(doc.id)}
                  onChange={() => toggle(doc)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="dp-box" />
              </label>

              <div className="dp-fileico"><FiFileText /></div>

              <div className="dp-meta">
                <div className="dp-name">{doc.name}</div>
                <div className="dp-sub">
                  <span>{prettySize(doc.size)}</span>
                  <span className="dp-dot" />
                  <span className="dp-cat">{doc.category}</span>
                </div>
              </div>

              {isSelected(doc.id) && (
                <div className="dp-tick" title="Selected">
                  <FiCheckCircle />
                </div>
              )}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="dp-empty-row">
              <FiX /> No documents match your search/filter.
            </li>
          )}
        </ul>
      )}

      {/* Sticky mini-footer for context */}
      <div className="dp-footer">
        <div className="dp-selected">
          <FiPaperclip />
          <b>{selected.length}</b> selected
          <span className="dp-minreq">• Minimum required: {min}</span>
        </div>
        <div className="dp-hint">
          {selected.length < min ? "Select at least one document to continue." : "Great! You can proceed to the next step."}
        </div>
      </div>
    </div>
  );
}
