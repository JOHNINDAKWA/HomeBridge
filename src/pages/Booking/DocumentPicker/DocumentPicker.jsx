import { useRef, useState } from "react";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "../Booking.css"

export default function DocumentPicker({ selected, onChange }){
  const { documents, setDocuments } = useAuth();
  const [error, ] = useState("");
  const fileRef = useRef(null);

  const toggle = (doc) => {
    const exists = selected.find(d => d.id === doc.id);
    if (exists) onChange(selected.filter(d => d.id !== doc.id));
    else onChange([...selected, doc]);
  };

  const addFiles = (files) => {
    const newDocs = Array.from(files).map((f, i) => ({ id: `${Date.now()}_${i}`, name: f.name, type: f.type || "file", size: f.size }));
    const merged = [...documents, ...newDocs];
    setDocuments(merged);
  };

  return (
    <div className="doclib">
      <div className="doclib__bar">
        <button className="btn btn--light" type="button" onClick={() => fileRef.current?.click()}>Upload new</button>
        <input ref={fileRef} type="file" multiple hidden onChange={e => addFiles(e.target.files)} />
        {error && <p className="error">{error}</p>}
      </div>

      <ul className="doclib__grid">
        {documents.length === 0 && <li className="muted">No saved documents yet. Upload to add.</li>}
        {documents.map(doc => (
          <li key={doc.id}>
            <label className={`doc ${selected.some(d => d.id === doc.id) ? "is-selected" : ""}`}>
              <input type="checkbox" checked={selected.some(d => d.id === doc.id)} onChange={() => toggle(doc)} />
              <span className="doc__name">{doc.name}</span>
              <span className="doc__meta">{Math.round((doc.size || 0)/1024)} KB</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}