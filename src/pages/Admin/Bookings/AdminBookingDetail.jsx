import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft, FiCheckCircle, FiXCircle, FiDollarSign, FiClock,
  FiPaperclip, FiSend, FiEdit3, FiUser, FiAlertTriangle
} from "react-icons/fi";
import "./AdminBookingDetail.css";

/* ------- storage helpers ------- */
function loadBookings() {
  try { return JSON.parse(localStorage.getItem("student:bookings")) || []; } catch { return []; }
}
function saveBookings(list) {
  localStorage.setItem("student:bookings", JSON.stringify(list));
}
function loadVaultDocs() {
  // Frontend mock: looks up the *current* device’s document vault for names/sizes.
  try { return JSON.parse(localStorage.getItem("auth:documents")) || []; } catch { return []; }
}
/* -------------------------------- */

export default function AdminBookingDetail() {
  const { bookingId } = useParams();
  const nav = useNavigate();
  const [bookings, setBookings] = useState(loadBookings);
  const allDocs = useMemo(loadVaultDocs, []);

  const data = useMemo(
    () => bookings.find((b) => String(b.id) === String(bookingId)),
    [bookings, bookingId]
  );

  if (!data) {
    return (
      <section className="abd-wrap card">
        <header className="abd-head">
          <button className="btn btn--light" onClick={() => nav(-1)}>
            <FiArrowLeft /> Back
          </button>
          <h2>Booking not found</h2>
        </header>
      </section>
    );
  }

  // derived
  const fee = (data.applicationFeeCents ?? 2500) / 100;
  const docsCount = Array.isArray(data.docIds) ? data.docIds.length : 0;
  const docList = (data.docIds || []).map((id) => {
    const found = allDocs.find((d) => d.id === id);
    return found || { id, name: `Document ${id}`, size: 0, type: "file" };
  });

  const steps = [
    { key: "createdAt",     label: "Request Created",       done: !!data.createdAt,     at: data.createdAt },
    { key: "feePaidAt",     label: "Application Fee Paid",  done: !!data.feePaidAt,     at: data.feePaidAt },
    { key: "docsAttached",  label: "Documents Attached",    done: docsCount > 0,        at: data.docsUpdatedAt || data.createdAt },
    { key: "submittedAt",   label: "Submitted to Partner",  done: !!data.submittedAt,   at: data.submittedAt },
    { key: "decisionAt",    label: "Decision Recorded",     done: !!data.decisionAt,    at: data.decisionAt },
  ];

  /* ------- mutators ------- */
  const patch = (changes) => {
    const next = bookings.map((b) => (b.id === data.id ? { ...b, ...changes } : b));
    setBookings(next);
    saveBookings(next);
  };

  const markFeePaidToggle = () => {
    if (data.feePaidAt) {
      // unmark
      patch({ feePaidAt: null, status: "Pending Payment" });
      return;
    }
    const now = new Date().toISOString();
    const nextStatus = docsCount > 0
      ? (data.submittedAt ? "Under Review" : "Ready to Submit")
      : "Payment Complete";
    patch({ feePaidAt: now, status: nextStatus, paymentMethod: data.paymentMethod || "card" });
  };

  const markSubmitted = () => {
    if (!data.feePaidAt) return;
    const now = new Date().toISOString();
    patch({ submittedAt: now, status: "Under Review" });
  };

  const setDecision = (decision) => {
    const now = new Date().toISOString();
    patch({
      adminDecision: decision,
      decisionAt: now,
      status: decision === "approved" ? "Approved" : "Rejected",
    });
  };

  const revertToReview = () => {
    patch({ adminDecision: null, decisionAt: null, status: "Under Review" });
  };

  /* ------- UI helpers ------- */
  const chip = (s) => (
    <span className={`abd-chip ${(s || "").toLowerCase().replace(/\s+/g, "-")}`}>{s || "—"}</span>
  );

  return (
    <section className="abd-wrap container2">
      {/* page head */}
      <header className="abd-head card">
        <div className="abd-left">
          <button className="btn btn--light" onClick={() => nav("/admin/bookings")}>
            <FiArrowLeft /> Back
          </button>
          <div className="abd-titleblock">
            <h1>Booking <span className="abd-id">#{data.id}</span></h1>
            {chip(data.status)}
          </div>
        </div>

        <div className="abd-right">
          <div className="abd-mini">
            <span>Listing</span>
            <b>{data.listingId}</b>
          </div>
          <div className="abd-mini">
            <span>Dates</span>
            <b>{data?.dates?.checkIn || "—"} → {data?.dates?.checkOut || "—"}</b>
          </div>
        </div>
      </header>

      {/* content grid */}
      <div className="abd-grid">
        {/* LEFT column — actions & details */}
        <main className="abd-main">
          {/* Quick actions */}
          <section className="card abd-card abd-quick">
            <h2>Quick Actions</h2>
            <div className="abd-actions">
              {data.status !== "Approved" && (
                <button className="btn" onClick={() => setDecision("approved")}>
                  <FiCheckCircle /> Approve
                </button>
              )}
              {data.status !== "Rejected" && (
                <button className="btn btn--light abd-danger" onClick={() => setDecision("rejected")}>
                  <FiXCircle /> Reject
                </button>
              )}
              {data.status === "Approved" || data.status === "Rejected" ? (
                <button className="btn btn--light" onClick={revertToReview}>
                  <FiEdit3 /> Revert to Review
                </button>
              ) : null}
            </div>
            {(data.status === "Pending Payment" || data.feePaidAt) && (
              <div className="abd-inline">
                <button className="btn btn--light" onClick={markFeePaidToggle}>
                  <FiDollarSign /> {data.feePaidAt ? "Mark as Unpaid" : "Mark Fee Paid"}
                </button>
                <small className="abd-note">
                  Fee: <b>${fee.toFixed(2)}</b> {data.feePaidAt && <>• paid {new Date(data.feePaidAt).toLocaleString()}</>}
                </small>
              </div>
            )}
            {!data.submittedAt && data.feePaidAt && (
              <div className="abd-inline">
                <button className="btn btn--light" onClick={markSubmitted}>
                  <FiSend /> Mark Submitted to Partner
                </button>
                <small className="abd-note">Requires fee paid.</small>
              </div>
            )}
          </section>

          {/* Summary */}
          <section className="card abd-card">
            <h2>Summary</h2>
            <div className="abd-kv">
              <div><span>Listing</span><b>{data.listingId}</b></div>
              <div><span>Check-in</span><b>{data?.dates?.checkIn || "—"}</b></div>
              <div><span>Check-out</span><b>{data?.dates?.checkOut || "—"}</b></div>
              <div><span>Documents</span><b>{docsCount}</b></div>
              <div><span>Created</span><b>{data.createdAt ? new Date(data.createdAt).toLocaleString() : "—"}</b></div>
              <div><span>Decision</span>
                <b>{data.adminDecision ? `${data.adminDecision} (${new Date(data.decisionAt).toLocaleString()})` : "—"}</b>
              </div>
            </div>
          </section>

          {/* Documents */}
          <section className="card abd-card">
            <header className="abd-card__head">
              <h2><FiPaperclip /> Documents</h2>
              <div className="abd-doccount">{docsCount} attached</div>
            </header>

            {docsCount === 0 ? (
              <div className="abd-empty">
                <FiAlertTriangle />
                <p>No documents attached to this booking.</p>
              </div>
            ) : (
              <ul className="abd-docs">
                {docList.map((d) => (
                  <li key={d.id}>
                    <div className="file">
                      <div className="ico"><FiPaperclip /></div>
                      <div className="meta">
                        <b>{d.name}</b>
                        <span>{Math.round((d.size || 0) / 1024)} KB</span>
                      </div>
                    </div>
                    <span className="type">{(d.type || "file").replace(/^\w/, c => c.toUpperCase())}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes (student note + admin notes) */}
          <section className="card abd-card">
            <h2>Notes</h2>
            <div className="abd-notes">
              <div className="abd-noteBox">
                <span className="label"><FiUser /> Student note</span>
                <p className="text">{data.note || "—"}</p>
              </div>

              <div className="abd-noteBox">
                <span className="label"><FiEdit3 /> Admin notes</span>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="Internal notes visible only to admins…"
                  value={data.adminNotes || ""}
                  onChange={(e) => patch({ adminNotes: e.target.value })}
                />
              </div>
            </div>
          </section>
        </main>

        {/* RIGHT column — recap & timeline */}
        <aside className="abd-side">
          <div className="card abd-recap">
            <h3>Recap</h3>
            <ul>
              <li><span>Status</span><b>{data.status || "—"}</b></li>
              <li><span>Fee</span><b>${fee.toFixed(2)}</b></li>
              <li><span>Payment</span><b>{data.feePaidAt ? "Paid" : "Unpaid"}</b></li>
              <li><span>Docs</span><b>{docsCount}</b></li>
              <li><span>Submitted</span><b>{data.submittedAt ? new Date(data.submittedAt).toLocaleString() : "—"}</b></li>
            </ul>
          </div>

          <div className="card abd-timeline">
            <h3>Timeline</h3>
            <ol>
              {steps.map((s) => (
                <li key={s.key} className={s.done ? "done" : ""}>
                  <div className="dot">{s.done ? <FiCheckCircle /> : <FiClock />}</div>
                  <div className="meta">
                    <b>{s.label}</b>
                    <span>{s.at ? new Date(s.at).toLocaleString() : "Pending"}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
