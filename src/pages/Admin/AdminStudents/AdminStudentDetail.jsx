import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft, FiMail, FiPhone, FiCheckCircle, FiXCircle, FiRotateCcw,
  FiCalendar, FiFileText, FiDownload, FiSave, FiAlertCircle, FiShield
} from "react-icons/fi";
import "./AdminStudentDetail.css";

const KEY_STUDENTS = "admin:students";
const KEY_BOOKINGS = "student:bookings";
const KEY_VAULT = "auth:documents"; // student vault (from StudentDocuments)

function loadStudents(){ try{return JSON.parse(localStorage.getItem(KEY_STUDENTS))||[];}catch{return[];} }
function saveStudents(v){ localStorage.setItem(KEY_STUDENTS, JSON.stringify(v)); }
function loadBookings(){ try{return JSON.parse(localStorage.getItem(KEY_BOOKINGS))||[];}catch{return[];} }
function saveBookings(v){ localStorage.setItem(KEY_BOOKINGS, JSON.stringify(v)); }
function loadVault(){ try{return JSON.parse(localStorage.getItem(KEY_VAULT))||[];}catch{return[];} }

const DEFAULT_STU_DOCS = [
  { id: "doc_passport", name: "Passport", type: "passport", status: "Pending", uploadedAt: "2025-08-20T10:00:00Z" },
  { id: "doc_i20", name: "I-20 / CAS", type: "i20", status: "Pending", uploadedAt: "2025-08-20T10:05:00Z" },
  { id: "doc_admit", name: "Admission Letter", type: "admission", status: "Pending", uploadedAt: "2025-08-20T10:10:00Z" },
  { id: "doc_fin", name: "Financial Statement", type: "financial", status: "Pending", uploadedAt: "2025-08-20T10:12:00Z" },
];

const rel = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs/24)}d ago`;
};

export default function AdminStudentDetail(){
  const { studentId } = useParams();
  const nav = useNavigate();

  const [students, setStudents] = useState(loadStudents());
  const [student, setStudent] = useState(() => students.find(s => String(s.id) === String(studentId)) || null);
  const [bookings, setBookings] = useState(loadBookings());
  const [vault] = useState(loadVault());
  const [notes, setNotes] = useState(student?.notes || "");

  // seed docs if empty
  useEffect(() => {
    if (!student) return;
    if (!Array.isArray(student.docs) || student.docs.length === 0) {
      const next = students.map(s => s.id === student.id ? { ...s, docs: DEFAULT_STU_DOCS } : s);
      saveStudents(next);
      setStudents(next);
      setStudent(next.find(s => s.id === student.id));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => { if (student) setNotes(student.notes || ""); }, [student]);

  if (!student) {
    return (
      <section className="asd-wrap">
        <header className="asd-head card">
          <button className="btn btn--light" onClick={()=>nav(-1)}><FiArrowLeft/> Back</button>
          <h2>Student not found</h2>
        </header>
      </section>
    );
  }

  const docsVerified = useMemo(() => (student.docs||[]).filter(d=>d.status==="Verified").length, [student]);
  const docsRequired = student.docsRequired || 4;
  const docsCount = student.docsCount ?? Math.min(docsVerified, docsRequired);
  const docsPct = docsRequired ? Math.min(100, Math.round((docsCount/docsRequired)*100)) : 0;

  const myBookings = useMemo(() => bookings.filter(b => b.studentId === student.id), [bookings, student]);

  // merge with vault (so we can get url/mime/size if present)
  const docList = (student.docs || []).map(d => {
    const meta = vault.find(v => v.id === d.id);
    return { ...d, size: meta?.size||0, mime: meta?.type||"file", url: meta?.url || null };
  });

  const updateStudent = (patch) => {
    const next = students.map(s => s.id === student.id ? { ...s, ...patch } : s);
    saveStudents(next); setStudents(next); setStudent(next.find(s => s.id===student.id));
  };
  const updateDocStatus = (docId, status) => {
    const next = students.map(s => {
      if (s.id !== student.id) return s;
      const docs = (s.docs||[]).map(d => d.id===docId ? ({...d, status}) : d);
      const verifiedCount = docs.filter(d => d.status==="Verified").length;
      return { ...s, docs, docsCount: Math.min(verifiedCount, s.docsRequired || 4) };
    });
    saveStudents(next); setStudents(next); setStudent(next.find(s => s.id===student.id));
  };

  const verifyKyc = () => updateStudent({ kycStatus:"Passed", status:"Active", docsCount: Math.max(docsCount, docsRequired) });
  const failKyc = () => updateStudent({ kycStatus:"Failed" });
  const suspend = () => updateStudent({ status:"Suspended" });
  const reinstate = () => updateStudent({ status:"Active" });
  const saveNotes = () => updateStudent({ notes });

  const linkSampleBookings = () => {
    const next = bookings.slice(); let linked = 0;
    for (let i=0;i<next.length && linked<2;i++){
      if (!next[i].studentId) { next[i] = { ...next[i], studentId: student.id }; linked++; }
    }
    saveBookings(next); setBookings(next);
  };

  const statusChip = (s) => <span className={`asd-chip asd-status ${String(s).toLowerCase()}`}>{s}</span>;
  const kycChip = (s) => <span className={`asd-chip asd-kyc ${String(s).toLowerCase()}`}>{s}</span>;

const sanitizeName = (s="document") =>
    s.replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").slice(0, 80);

  const mimeToExt = (mime="") => {
    if (mime.includes("pdf")) return ".pdf";
    if (mime.includes("jpeg")) return ".jpg";
    if (mime.includes("png")) return ".png";
    if (mime.includes("gif")) return ".gif";
    if (mime.includes("webp")) return ".webp";
    if (mime.includes("svg")) return ".svg";
    return "";
  };

  const downloadDoc = async (doc) => {
    if (!doc?.url) {
      alert("No downloadable URL for this document (demo). Upload again from the student side.");
      return;
    }
    try {
      // fetch handles both data: and https: URLs
      const res = await fetch(doc.url);
      const blob = await res.blob();

      const hasExt = /\.[a-z0-9]{2,5}$/i.test(doc.name || "");
      const filename = sanitizeName(
        hasExt ? doc.name : (doc.name || "document") + mimeToExt(blob.type)
      );

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error(e);
      alert("Failed to download this file in the demo environment.");
    }
  };

  const payMethods = Array.isArray(student.paymentMethods) ? student.paymentMethods : [];

  return (
    <section className="asd-wrap">
      <header className="asd-head card">
        <div className="asd-left">
          <button className="btn btn--light" onClick={()=>nav(-1)}><FiArrowLeft/> Back</button>
          <div className="asd-title">
            <img className="asd-ava" src={student.avatar} alt="" />
            <div className="asd-meta">
              <h2>{student.name}</h2>
              <div className="asd-minor"><span>#{student.id}</span><span className="asd-dot">•</span><span>{student.region || "—"}</span></div>
              <div className="asd-contact">
                <a className="asd-link" href={`mailto:${student.email}`}><FiMail/> {student.email}</a>
                <span className="asd-dot">•</span>
                <a className="asd-link" href={`tel:${student.phone}`}><FiPhone/> {student.phone}</a>
              </div>
            </div>
          </div>
        </div>
        <div className="asd-right">
          {statusChip(student.status)} {kycChip(student.kycStatus)}
          {student.kycStatus !== "Passed" && <button className="btn btn--light asd-approve" onClick={verifyKyc}><FiCheckCircle/> Verify KYC</button>}
          {student.kycStatus === "Pending" && <button className="btn btn--light asd-fail" onClick={failKyc}><FiXCircle/> Fail KYC</button>}
          {student.status !== "Suspended"
            ? <button className="btn btn--light asd-suspend" onClick={suspend}><FiXCircle/> Suspend</button>
            : <button className="btn btn--light asd-reinstate" onClick={reinstate}><FiRotateCcw/> Reinstate</button>}
        </div>
      </header>

      <div className="asd-grid">
        <section className="card asd-card">
          <h3>Profile</h3>
          <div className="asd-kv">
            <div><span>University</span><b>{student.school || "—"}</b></div>
            <div><span>Program</span><b>{student.program || "—"}</b></div>
            <div><span>Intake</span><b>{student.intake || "—"}</b></div>
            <div><span>Region</span><b>{student.region || "—"}</b></div>
            <div><span>Created</span><b>{student.createdAt ? new Date(student.createdAt).toLocaleString() : "—"}</b></div>
            <div><span>Last Active</span><b title={student.lastActiveAt || ""}>{rel(student.lastActiveAt)}</b></div>
            <div><span>Total Bookings</span><b>{myBookings.length}</b></div>
            <div><span>Address</span><b>{student.addressLine1 ? `${student.addressLine1}, ${student.addressCity || ""}` : "—"}</b></div>
            <div><span>Emergency</span><b>{student.emergencyName ? `${student.emergencyName} (${student.emergencyRelation||"—"})` : "—"}</b></div>
          </div>
        </section>

   {/* Documents & KYC */}
      <section className="card asd-card">
        <h3>Documents & KYC</h3>
        <div className="asd-docsHead">
          <div className="asd-docsProgress">
            <div className="asd-bar"><span style={{ width: `${docsPct}%` }} /></div>
            <small>{docsCount}/{docsRequired} verified</small>
          </div>
          <div className="asd-docsHint">
            <FiAlertCircle/> Click <b>Download</b> to save the file locally, then Verify or Reject.
          </div>
        </div>

        <div className="asd-docsList">
          {docList.map(doc => (
            <div key={doc.id} className="asd-docRow">
              <div className="asd-docMeta">
                <div className="asd-docIcon"><FiFileText/></div>
                <div>
                  <b>{doc.name}</b>
                  <div className="asd-sub">
                    {doc.type} • {doc.mime || "file"} • {Math.round((doc.size||0)/1024)} KB • Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}
                  </div>
                </div>
              </div>
              <div className="asd-docActions">
                <span className={`asd-chip asd-docchip ${doc.status.toLowerCase()}`}>{doc.status}</span>
                <button className="btn btn--light" onClick={() => downloadDoc(doc)}>
                  <FiDownload/> Download
                </button>
                <button className="btn btn--light" onClick={() => updateDocStatus(doc.id, "Verified")}><FiCheckCircle/> Verify</button>
                <button className="btn btn--light" onClick={() => updateDocStatus(doc.id, "Rejected")}><FiXCircle/> Reject</button>
              </div>
            </div>
          ))}
        </div>

        <div className="asd-kycRow">
          <button className="btn asd-approve" onClick={verifyKyc}><FiCheckCircle/> Approve KYC</button>
          <button className="btn btn--light asd-fail" onClick={failKyc}><FiXCircle/> Fail KYC</button>
        </div>
      </section>

        <section className="card asd-card">
          <h3>Bookings</h3>
          {myBookings.length === 0 ? (
            <div className="asd-empty">
              <p>No linked bookings for this student yet.</p>
              <button className="btn btn--light" onClick={linkSampleBookings}>Link sample bookings (demo)</button>
            </div>
          ) : (
            <ul className="asd-bookings">
              {myBookings.map(b => (
                <li key={b.id} className="asd-booking">
                  <div className="asd-bTop">
                    <span className="asd-badge">#{b.id}</span>
                    <span className={`asd-chip asd-bstatus ${String(b.status||"—").toLowerCase().replace(/\s+/g,"-")}`}>{b.status || "—"}</span>
                  </div>
                  <div className="asd-bGrid">
                    <div><span>Listing</span><b>{b.listingId}</b></div>
                    <div><span>Dates</span><b>{b?.dates?.checkIn || "—"} → {b?.dates?.checkOut || "—"}</b></div>
                    <div><span>Docs</span><b>{Array.isArray(b.docIds) ? b.docIds.length : 0}</b></div>
                    <div><span>Created</span><b>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}</b></div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card asd-card">
          <h3>Payment Methods</h3>
          {payMethods.length === 0 ? (
            <p className="asd-muted">No saved methods.</p>
          ) : (
            <ul className="asd-pmlist">
              {payMethods.map(pm => (
                <li key={pm.id}>
                  <span className="brand">{pm.brand || "Card"}</span>
                  <span className="num">•••• {pm.last4}</span>
                  <span className="exp">exp {pm.exp}</span>
                </li>
              ))}
            </ul>
          )}
          <small className="asd-help"><FiShield/> Read-only in Admin. Students manage cards in their profile.</small>
        </section>

        <section className="card asd-card">
          <h3>Internal Notes</h3>
          <textarea className="textarea" rows={5} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Screening notes, escalations, manual verifications…" />
          <div className="asd-noteRow">
            <button className="btn btn--light" onClick={()=>setNotes(student.notes || "")}>Reset</button>
            <button className="btn" onClick={saveNotes}><FiSave/> Save Notes</button>
          </div>
        </section>
      </div>
    </section>
  );
}
