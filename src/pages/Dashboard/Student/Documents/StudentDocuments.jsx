import { useRef } from "react";
import { FiUpload, FiTrash2, FiFileText } from "react-icons/fi";
import { useAuth } from "../../../../Context/AuthContext.jsx";
import "./StudentDocuments.css";


export default function StudentDocuments(){
const { documents, setDocuments } = useAuth();
const fileRef = useRef(null);


const uploadDocs = (files) => {
const newDocs = Array.from(files).map((f, i) => ({ id: `${Date.now()}_${i}`, name: f.name, type: f.type || "file", size: f.size||0 }));
setDocuments([...(documents||[]), ...newDocs]);
};
const removeDoc = (id) => setDocuments((documents||[]).filter(d => d.id !== id));


return (
<section className="sdd-panel card">
<header className="sdd-head">
<h2>Your Documents</h2>
<div className="sdd-actions">
<button className="btn" onClick={() => fileRef.current?.click()}><FiUpload /> Upload</button>
<input ref={fileRef} type="file" multiple hidden onChange={e => uploadDocs(e.target.files)} />
</div>
</header>


{(documents?.length||0) === 0 ? (
<div className="sdd-empty">
<div className="sdd-ico"><FiFileText /></div>
<p>Upload your passport, I-20, admission letter, or financial docs once—reuse for every booking.</p>
<button className="btn" onClick={() => fileRef.current?.click()}><FiUpload /> Upload documents</button>
</div>
) : (
<ul className="sdd-list">
{documents.map(doc => (
<li key={doc.id} className="sdd-item">
<div className="sdd-meta">
<div className="sdd-fileico"><FiFileText /></div>
<div>
<div className="sdd-name">{doc.name}</div>
<div className="sdd-sub">{Math.round((doc.size||0)/1024)} KB</div>
</div>
</div>
<button className="sdd-iconbtn" onClick={() => removeDoc(doc.id)} title="Remove"><FiTrash2 /></button>
</li>
))}
</ul>
)}
</section>
);
}