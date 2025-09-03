import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiDollarSign, FiCheckCircle, FiClock, FiPaperclip, FiSend,
  FiCreditCard, FiSmartphone, FiArrowLeft
} from "react-icons/fi";
import "./BookingDetail.css";

function loadBookings() {
  try { return JSON.parse(localStorage.getItem("student:bookings")) || []; } catch { return []; }
}
function saveBookings(list) {
  localStorage.setItem("student:bookings", JSON.stringify(list));
}

export default function BookingDetail(){
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(loadBookings);
  const [method, setMethod] = useState("card"); // "card" | "mpesa"
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });

  const booking = useMemo(() => bookings.find(b => b.id === bookingId), [bookings, bookingId]);

  // basic migration/defaults
  useEffect(() => {
    if (!booking) return;
    let changed = false;
    const next = bookings.map(b => {
      if (b.id !== booking.id) return b;
      const patch = { ...b };
      if (patch.applicationFeeCents == null) { patch.applicationFeeCents = 2500; changed = true; }
      if (!patch.createdAt) { patch.createdAt = new Date().toISOString(); changed = true; }
      if (!patch.status) { patch.status = patch.feePaidAt ? "Ready to Submit" : "Pending Payment"; changed = true; }
      return patch;
    });
    if (changed) { setBookings(next); saveBookings(next); }
  }, [booking]); // eslint-disable-line

  if (!booking) {
    return (
      <section className="bd-wrap container2">
        <div className="card bd-empty">
          <p>Booking not found.</p>
          <button className="btn btn--light" onClick={() => navigate("/dashboard/student")}>
            <FiArrowLeft /> Back to dashboard
          </button>
        </div>
      </section>
    );
  }

  const fee = (booking.applicationFeeCents ?? 2500) / 100;
  const docsCount = Array.isArray(booking.docIds) ? booking.docIds.length : 0;
  const canSubmit = Boolean(booking.feePaidAt) && docsCount > 0;

  function updateBooking(patch) {
    const next = bookings.map(b => (b.id === booking.id ? { ...b, ...patch } : b));
    setBookings(next);
    saveBookings(next);
  }

  function simulatePayment() {
    // very light client-side validation
    if (method === "card") {
      if (!card.number || !card.name || !card.exp || !card.cvc) {
        alert("Please fill card details (mock).");
        return;
      }
    }
    updateBooking({
      feePaidAt: new Date().toISOString(),
      status: docsCount > 0 ? "Ready to Submit" : "Payment Complete",
      paymentMethod: method
    });
  }

  function submitToPartner() {
    if (!canSubmit) return;
    updateBooking({
      submittedAt: new Date().toISOString(),
      status: "Under Review"
    });
  }

  // Timeline
  const steps = [
    { key: "createdAt", label: "Request Created", done: Boolean(booking.createdAt), at: booking.createdAt },
    { key: "feePaidAt", label: "Application Fee Paid", done: Boolean(booking.feePaidAt), at: booking.feePaidAt },
    { key: "docs", label: "Documents Attached", done: docsCount > 0, at: docsCount > 0 ? booking.docsUpdatedAt || booking.createdAt : null },
    { key: "submittedAt", label: "Submitted to Partner", done: Boolean(booking.submittedAt), at: booking.submittedAt },
  ];

  return (
    <section className="bd-wrap container2">
      {/* Header */}
      <header className="bd-head card">
        <div className="bd-head__left">
          <button className="bd-back" onClick={() => navigate("/dashboard/student/bookings")}>
            <FiArrowLeft /> Back
          </button>
          <h1>Booking #{booking.id}</h1>
          <div className={`bd-chip ${booking.status?.replaceAll(" ","-").toLowerCase() || ""}`}>
            {booking.status || "Pending"}
          </div>
        </div>
        <div className="bd-head__right">
          <div className="bd-mini">
            <span>Listing</span>
            <b>{booking.listingId}</b>
          </div>
          <div className="bd-mini">
            <span>Dates</span>
            <b>{booking?.dates?.checkIn || "—"} → {booking?.dates?.checkOut || "—"}</b>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="bd-grid">
        {/* LEFT: Actions */}
        <main className="bd-main">
          {/* 1) Payment */}
          <section className="card bd-card">
            <header className="bd-card__head">
              <h2><FiDollarSign /> Application Fee</h2>
              <div className="bd-amt">${fee.toFixed(2)}</div>
            </header>
            <p className="bd-muted">
              Pay a one-time application fee to submit your booking to the partner.
              This helps us verify requests, prevent spam, and run secure workflows.
            </p>

            {booking.feePaidAt ? (
              <div className="bd-paid">
                <FiCheckCircle /> Fee paid on {new Date(booking.feePaidAt).toLocaleString()}
              </div>
            ) : (
              <>
                <div className="bd-paymethods">
                  <label className={`bd-radio ${method==="card" ? "is-active" : ""}`}>
                    <input type="radio" name="pm" checked={method==="card"} onChange={()=>setMethod("card")} />
                    <FiCreditCard /> Card
                  </label>
                  <label className={`bd-radio ${method==="mpesa" ? "is-active" : ""}`}>
                    <input type="radio" name="pm" checked={method==="mpesa"} onChange={()=>setMethod("mpesa")} />
                    <FiSmartphone /> M-Pesa
                  </label>
                </div>

                {method === "card" && (
                  <div className="bd-grid2">
                    <label className="bd-field">
                      <span>Card number</span>
                      <input placeholder="4242 4242 4242 4242" value={card.number} onChange={e=>setCard({...card, number:e.target.value})}/>
                    </label>
                    <label className="bd-field">
                      <span>Name on card</span>
                      <input placeholder="Jane Student" value={card.name} onChange={e=>setCard({...card, name:e.target.value})}/>
                    </label>
                    <label className="bd-field">
                      <span>Expiry</span>
                      <input placeholder="MM/YY" value={card.exp} onChange={e=>setCard({...card, exp:e.target.value})}/>
                    </label>
                    <label className="bd-field">
                      <span>CVC</span>
                      <input placeholder="123" value={card.cvc} onChange={e=>setCard({...card, cvc:e.target.value})}/>
                    </label>
                  </div>
                )}

                {method === "mpesa" && (
                  <div className="bd-grid2">
                    <label className="bd-field">
                      <span>M-Pesa phone</span>
                      <input placeholder="+2547..." />
                    </label>
                    <div className="bd-hint">
                      You’ll receive a STK push prompt on your phone (mock). Confirm to complete payment.
                    </div>
                  </div>
                )}

                <div className="bd-actions">
                  <button className="btn" onClick={simulatePayment}>Pay & Continue</button>
                </div>
              </>
            )}
          </section>

          {/* 2) Documents */}
          <section className="card bd-card">
            <header className="bd-card__head">
              <h2><FiPaperclip /> Documents</h2>
              <div className="bd-doccount">{docsCount} attached</div>
            </header>
            <p className="bd-muted">
              Attach your passport, admission/offer, I-20 (if applicable), and financial docs from your vault.
            </p>
            <div className="bd-actions">
              <button className="btn btn--light" onClick={() => navigate("/dashboard/student/documents")}>
                Manage Documents
              </button>
            </div>
          </section>

          {/* 3) Submit */}
          <section className="card bd-card">
            <header className="bd-card__head">
              <h2><FiSend /> Submit to Partner</h2>
            </header>
            <p className="bd-muted">
              Your request will be sent to the housing partner for review. You’ll receive updates here.
            </p>

            {!booking.feePaidAt && (
              <div className="bd-blocker">
                <FiClock /> Please pay the application fee to enable submission.
              </div>
            )}
            {booking.feePaidAt && docsCount === 0 && (
              <div className="bd-blocker">
                <FiPaperclip /> Attach at least one document to enable submission.
              </div>
            )}

            {booking.submittedAt ? (
              <div className="bd-paid">
                <FiCheckCircle /> Submitted on {new Date(booking.submittedAt).toLocaleString()}
              </div>
            ) : (
              <div className="bd-actions">
                <button className="btn" disabled={!canSubmit} onClick={submitToPartner}>
                  Submit Request
                </button>
              </div>
            )}
          </section>
        </main>

        {/* RIGHT: Recap + Timeline */}
        <aside className="bd-side">
          <div className="card bd-recap">
            <h3>Summary</h3>
            <ul>
              <li><span>Listing</span><b>{booking.listingId}</b></li>
              <li><span>Check-in</span><b>{booking?.dates?.checkIn || "—"}</b></li>
              <li><span>Check-out</span><b>{booking?.dates?.checkOut || "—"}</b></li>
              <li><span>Fee</span><b>${fee.toFixed(2)}</b></li>
              <li><span>Payment</span><b>{booking.feePaidAt ? "Paid" : "Unpaid"}</b></li>
              <li><span>Docs</span><b>{docsCount}</b></li>
              <li><span>Status</span><b>{booking.status || "—"}</b></li>
            </ul>
          </div>

          <div className="card bd-timeline">
            <h3>Timeline</h3>
            <ol>
              {steps.map(s => (
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
