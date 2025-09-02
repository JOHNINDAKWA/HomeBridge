// src/pages/Agent/Applications/AppDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiUser, FiMail, FiPhone, FiFileText, FiClock,
  FiMapPin, FiHome, FiCheckCircle, FiXCircle, FiSend
} from "react-icons/fi";
import "./AppDetail.css";

// Demo dataset — in production you'd fetch from API
const DEMO = {
  "APP-2193": {
    id:"APP-2193",
    student:"Amina N.",
    email:"amina.n@example.com",
    phone:"+254 722 555 123",
    listing:"Rutgers-Ready Studio",
    university:"Rutgers University – Newark",
    city:"Newark, NJ",
    moveIn:"2025-08-24",
    stage:"Reviewing",
    docs:["Passport","I-20"],
    notes:"Prefers single unit close to campus. Parents requested escrow confirmation.",
    timeline:[
      { at:"2025-08-10", text:"Application submitted" },
      { at:"2025-08-12", text:"Docs uploaded: Passport, I-20" },
      { at:"2025-08-14", text:"Stage moved to Reviewing" }
    ]
  }
};

export default function AppDetail(){
  const { appId } = useParams();
  const nav = useNavigate();
  const app = DEMO[appId] ?? null;

  if (!app) {
    return (
      <section className="ad-wrap">
        <div className="container">
          <p>No application found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ad-wrap">
      <div className="container ad-shell card">
        <header className="ad-head">
          <button className="btn btn--light" onClick={()=>nav(-1)}>
            <FiArrowLeft /> Back
          </button>
          <h2>Application {app.id}</h2>
          <span className={`chip chip--${app.stage.toLowerCase()}`}>{app.stage}</span>
        </header>

        <div className="ad-grid">
          {/* Left: Applicant & Listing */}
          <main className="ad-main">
            <section className="ad-sec card">
              <h3><FiUser /> Applicant</h3>
              <div className="ad-kv"><span>Name</span><b>{app.student}</b></div>
              <div className="ad-kv"><span>Email</span><b>{app.email}</b></div>
              <div className="ad-kv"><span>Phone</span><b>{app.phone}</b></div>
            </section>

            <section className="ad-sec card">
              <h3><FiHome /> Listing</h3>
              <div className="ad-kv"><span>Listing</span><b>{app.listing}</b></div>
              <div className="ad-kv"><span>University</span><b>{app.university}</b></div>
              <div className="ad-kv"><span>City</span><b>{app.city}</b></div>
              <div className="ad-kv"><span>Move-in</span><b>{app.moveIn}</b></div>
            </section>

            <section className="ad-sec card">
              <h3><FiFileText /> Documents</h3>
              {app.docs.length ? (
                <ul className="ad-docs">
                  {app.docs.map((d,i)=><li key={i}><FiFileText /> {d}</li>)}
                </ul>
              ) : <p className="muted">No documents uploaded yet.</p>}
            </section>

            <section className="ad-sec card">
              <h3><FiClock /> Timeline</h3>
              <ul className="ad-timeline">
                {app.timeline.map((t,i)=>(
                  <li key={i}><time>{t.at}</time> {t.text}</li>
                ))}
              </ul>
            </section>
          </main>

          {/* Right: Actions & Notes */}
          <aside className="ad-side">
            <div className="card ad-actions">
              <h3>Actions</h3>
              <button className="btn btn--light"><FiCheckCircle /> Approve / Send Offer</button>
              <button className="btn btn--light"><FiSend /> Request Docs</button>
              <button className="btn btn--light"><FiXCircle /> Reject</button>
            </div>

            <div className="card ad-notes">
              <h3>Agent Notes</h3>
              <p>{app.notes}</p>
              <textarea className="textarea" placeholder="Add internal note…"></textarea>
              <button className="btn btn--light">Save note</button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
