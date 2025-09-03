import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCalendar, FiUser, FiFileText, FiCheckCircle, FiArrowLeft, FiArrowRight, FiClipboard } from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext.jsx";
import DocumentPicker from "../DocumentPicker/DocumentPicker.jsx";
import "./BookingFlow.css";

export default function BookingFlow() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { profile, setProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [notes, setNotes] = useState("");

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(dates.checkIn && dates.checkOut);
    if (step === 2) return selectedDocs.length > 0;
    return true;
  }, [step, dates, selectedDocs]);

  // Smooth scroll to top on step change (nice UX)
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const submitBooking = () => {
    // Build & persist booking
    const existing = JSON.parse(localStorage.getItem("student:bookings") || "[]");

    const nowIso = new Date().toISOString();
    const newBooking = {
      id: `b_${Date.now()}`,
      listingId,
      dates,
      note: notes,
      docIds: selectedDocs.map(d => d.id),
      docsUpdatedAt: selectedDocs.length ? nowIso : undefined,

      // Defaults to support the details/fee flow
      status: "Pending Payment",
      applicationFeeCents: 2500, // $25.00 mock fee
      createdAt: nowIso
    };

    localStorage.setItem("student:bookings", JSON.stringify([newBooking, ...existing]));

    // Go straight to the booking details funnel
    navigate(`/dashboard/student/bookings/${newBooking.id}`, { replace: true });
  };

  const StepPill = ({ n, label, icon: Icon }) => (
    <div className={`bk-step ${step === n ? "is-active" : step > n ? "is-done" : ""}`}>
      <div className="bk-step__dot">{step > n ? <FiCheckCircle /> : <Icon />}</div>
      <span className="bk-step__label">{label}</span>
    </div>
  );

  return (
    <section className="container2 bk-wrap">
      {/* Gradient header */}
      <header className="bk-hero card">
        <div className="bk-hero__title">
          <h1>Complete Your Booking</h1>
          <p className="bk-hero__sub">Listing <span className="bk-tag">{listingId}</span></p>
        </div>

        <div className="bk-steps">
          <StepPill n={1} label="Dates & Details" icon={FiCalendar} />
          <StepPill n={2} label="Documents" icon={FiFileText} />
          <StepPill n={3} label="Review & Submit" icon={FiClipboard} />
          <div className="bk-steps__bar">
            <span style={{ width: `${(step - 1) * 50}%` }} />
          </div>
        </div>
      </header>

      {/* Content grid */}
      <div className="bk-grid">
        {/* LEFT: form area */}
        <main className="bk-main card">
          {step === 1 && (
            <div className="bk-stepcard">
              <h2>Step 1 · Select Dates & Your Details</h2>
              <p className="bk-muted">Choose your preferred move-in and move-out dates, then confirm your contact info.</p>

              <div className="bk-grid2">
                <label className="bk-field">
                  <span>Check-in</span>
                  <input
                    type="date"
                    value={dates.checkIn}
                    onChange={e => setDates(d => ({ ...d, checkIn: e.target.value }))}
                  />
                </label>
                <label className="bk-field">
                  <span>Check-out</span>
                  <input
                    type="date"
                    value={dates.checkOut}
                    onChange={e => setDates(d => ({ ...d, checkOut: e.target.value }))}
                  />
                </label>
              </div>

              <h3 className="bk-subtitle"><FiUser /> Your Details</h3>
              <div className="bk-grid2">
                <label className="bk-field">
                  <span>Full name</span>
                  <input
                    value={profile.fullName || ""}
                    onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="e.g., Jane Student"
                  />
                </label>
                <label className="bk-field">
                  <span>Phone</span>
                  <input
                    value={profile.phone || ""}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+254..."
                  />
                </label>
                <label className="bk-field">
                  <span>Institution</span>
                  <input
                    value={profile.school || ""}
                    onChange={e => setProfile(p => ({ ...p, school: e.target.value }))}
                    placeholder="University / College"
                  />
                </label>
                <label className="bk-field">
                  <span>Program</span>
                  <input
                    value={profile.program || ""}
                    onChange={e => setProfile(p => ({ ...p, program: e.target.value }))}
                    placeholder="Course / Program"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bk-stepcard">
              <h2>Step 2 · Documents</h2>
              <p className="bk-muted">Choose from your saved documents or upload new ones. At least one is required.</p>
              <DocumentPicker selected={selectedDocs} onChange={setSelectedDocs} />
            </div>
          )}

          {step === 3 && (
            <div className="bk-stepcard">
              <h2>Step 3 · Review & Submit</h2>
              <ul className="bk-summary">
                <li><strong>Dates:</strong> {dates.checkIn || "—"} → {dates.checkOut || "—"}</li>
                <li><strong>Name:</strong> {profile.fullName || "—"}</li>
                <li><strong>Phone:</strong> {profile.phone || "—"}</li>
                <li><strong>Institution:</strong> {profile.school || "—"}</li>
                <li><strong>Program:</strong> {profile.program || "—"}</li>
                <li><strong>Documents:</strong> {selectedDocs.map(d => d.name).join(", ") || "None"}</li>
              </ul>
              <label className="bk-field">
                <span>Note to the agent (optional)</span>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any questions or requests?"
                />
              </label>
            </div>
          )}

          {/* Nav buttons */}
          <footer className="bk-nav">
            {step > 1 && (
              <button className="btn btn--light" onClick={() => setStep(s => s - 1)}>
                <FiArrowLeft /> Back
              </button>
            )}
            {step < 3 && (
              <button
                className="btn"
                disabled={!canNext}
                onClick={() => setStep(s => s + 1)}
              >
                Next <FiArrowRight />
              </button>
            )}
            {step === 3 && (
              <button className="btn" onClick={submitBooking}>
                Confirm Booking <FiCheckCircle />
              </button>
            )}
          </footer>
        </main>

        {/* RIGHT: sticky recap */}
        <aside className="bk-side">
          <div className="bk-recap card">
            <h3>Booking Recap</h3>
            <ul>
              <li><span>Listing</span><b>{listingId}</b></li>
              <li><span>Check-in</span><b>{dates.checkIn || "—"}</b></li>
              <li><span>Check-out</span><b>{dates.checkOut || "—"}</b></li>
              <li><span>Name</span><b>{profile.fullName || "—"}</b></li>
              <li><span>Phone</span><b>{profile.phone || "—"}</b></li>
              <li><span>Docs</span><b>{selectedDocs.length}</b></li>
            </ul>
            <div className="bk-hint">
              You can update these details anytime before confirming.
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
