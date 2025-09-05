// src/pages/Dashboard/Student/Profile/StudentProfile.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheckCircle, FiUser, FiPhone, FiMail, FiMapPin, FiHome,
  FiShield, FiFileText, FiPlus, FiTrash2
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../Context/AuthContext.jsx";
import "./StudentProfile.css";

export default function StudentProfile() {
  const { api, profile, setProfile, documents = [], user } = useAuth();

  // ----- initial load -----
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setError("");
        const { profile: p } = await api("/api/students/me/profile");
        if (!live) return;
        // merge BE -> FE so we don’t lose any client-only keys
        setProfile(prev => ({ ...prev, ...p, email: p.email || user?.email || prev.email || "" }));
      } catch (e) {
        setError(e.message || "Failed to load profile");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- section saving helpers -----
  const [saving, setSaving] = useState({
    identity: false,
    study: false,
    contact: false,
    address: false,
    emergency: false,
    prefs: false,
    payments: false,
  });
  const [saved, setSaved]   = useState({
    identity: false,
    study: false,
    contact: false,
    address: false,
    emergency: false,
    prefs: false,
    payments: false,
  });
  const tickTimer = useRef({});

  async function saveSection(sectionKey, patch) {
    setError("");
    setSaving(s => ({ ...s, [sectionKey]: true }));
    try {
      const { profile: p } = await api("/api/students/me/profile", {
        method: "PUT",
        body: patch
      });
      // merge back what server returns (source of truth)
      setProfile(prev => ({ ...prev, ...p }));
      // show a quick ✓
      setSaved(s => ({ ...s, [sectionKey]: true }));
      clearTimeout(tickTimer.current[sectionKey]);
      tickTimer.current[sectionKey] = setTimeout(() => {
        setSaved(s => ({ ...s, [sectionKey]: false }));
      }, 1200);
    } catch (e) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(s => ({ ...s, [sectionKey]: false }));
    }
  }

  // short alias for updating local form fields
  const upd = (k, v) => setProfile(p => ({ ...p, [k]: v }));

  // ----- payments (mock, stays client-side unless saved) -----
  const [cardForm, setCardForm] = useState({ number: "", name: "", exp: "" });
  const pmList = profile?.paymentMethods || [];

  const detectBrand = (num = "") => {
    const n = num.replace(/\s|-/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^(5[1-5])/.test(n)) return "Mastercard";
    if (/^3[47]/.test(n)) return "Amex";
    if (/^6(?:011|5)/.test(n)) return "Discover";
    return "Card";
  };
  const addPaymentMethod = () => {
    const n = cardForm.number.replace(/\s|-/g, "");
    if (n.length < 12 || !cardForm.name || !cardForm.exp) {
      alert("Please fill a valid card (mock).");
      return;
    }
    const brand = detectBrand(n);
    const last4 = n.slice(-4);
    const newPm = { id: `pm_${Date.now()}`, brand, last4, exp: cardForm.exp };
    setProfile(p => ({ ...p, paymentMethods: [newPm, ...(p.paymentMethods || [])] }));
    setCardForm({ number: "", name: "", exp: "" });
  };
  const removePaymentMethod = (id) => {
    setProfile(p => ({ ...p, paymentMethods: (p.paymentMethods || []).filter(x => x.id !== id) }));
  };

  // ----- progress meter -----
  const requiredKeys = ["fullName", "phone", "school", "program"];
  const filled = useMemo(
    () => requiredKeys.filter(k => profile?.[k] && String(profile[k]).trim().length > 0).length,
    [profile]
  );
  const pct = Math.round((filled / requiredKeys.length) * 100);

  const docsCount = documents.length;
  const kycStatus = profile?.kycStatus || "NOT_STARTED";
  const kycLabel  = kycStatus === "VERIFIED" ? "Verified" : kycStatus === "SUBMITTED" ? "Submitted" : "Not started";
  const kycClass  = kycStatus === "VERIFIED" ? "ok" : kycStatus === "SUBMITTED" ? "warn" : "off";

  if (loading) {
    return (
      <div className="container2">
        <div className="card" style={{ padding: 16 }}>Loading profile…</div>
      </div>
    );
  }

  return (
    <section className="sdp-wrap">
      {/* Header */}
      <header className="card sdp-head">
        <div className="sdp-title">
          <h2>Your Profile</h2>
          <p className="sdp-sub">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}. Save each section when done.
          </p>
        </div>

        <div className="sdp-stats">
          <div className="sdp-pill">
            <span>Completed</span>
            <div className="sdp-progress"><span style={{ width: `${pct}%` }} /></div>
            <b>{pct}%</b>
          </div>
          <div className={`sdp-pill sdp-save ${Object.values(saved).some(Boolean) ? "flash" : ""}`}>
            <FiCheckCircle /> {Object.values(saved).some(Boolean) ? "Saved" : "Ready"}
          </div>
        </div>
      </header>

      {error && (
        <div className="card" style={{ padding: 12, borderColor: "#e11d48", color: "#b91c1c" }}>
          ⚠ {error}
        </div>
      )}

      {/* Grid */}
      <div className="sdp-grid-main">
        {/* LEFT */}
        <main className="sdp-col">
          {/* Identity */}
          <section className="card sdp-section">
            <h3>Identity</h3>

            <div className="sdp-idgrid">
              <div className="sdp-avatar">
                <div className="sdp-avatar__img">
                  {/* Avatar disabled for now */}
                  <span className="sdp-avatar__placeholder"><FiUser /></span>
                </div>
              </div>

              <div className="sdp-fields">
                <label className="sdp-field">
                  <span>Full name</span>
                  <input
                    value={profile?.fullName || ""}
                    onChange={e => upd("fullName", e.target.value)}
                    placeholder="e.g. Jane Student"
                  />
                </label>
                <div className="sdp-grid-2">
                  <label className="sdp-field">
                    <span>Date of birth</span>
                    <input
                      type="date"
                      value={profile?.dob || ""}
                      onChange={e => upd("dob", e.target.value)}
                    />
                  </label>
                  <label className="sdp-field">
                    <span>Nationality</span>
                    <input
                      value={profile?.nationality || ""}
                      onChange={e => upd("nationality", e.target.value)}
                      placeholder="e.g. Kenyan"
                    />
                  </label>
                </div>
                <label className="sdp-field">
                  <span>Passport No. (optional)</span>
                  <input
                    value={profile?.passportNo || ""}
                    onChange={e => upd("passportNo", e.target.value)}
                    placeholder="E12345678"
                  />
                </label>
              </div>
            </div>

            <div className="sdp-actions">
              <button
                className="sdp-btn"
                disabled={saving.identity}
                onClick={() => saveSection("identity", {
                  fullName:   profile?.fullName || "",
                  dob:        profile?.dob || "",
                  nationality:profile?.nationality || "",
                  passportNo: profile?.passportNo || "",
                })}
              >
                {saving.identity ? "Saving…" : saved.identity ? "Saved ✓" : "Save identity"}
              </button>
            </div>
          </section>

          {/* Study */}
          <section className="card sdp-section">
            <h3>Study Information</h3>
            <div className="sdp-grid-2">
              <label className="sdp-field">
                <span>Institution</span>
                <input
                  value={profile?.school || ""}
                  onChange={e => upd("school", e.target.value)}
                  placeholder="University / College"
                />
              </label>
              <label className="sdp-field">
                <span>Program</span>
                <input
                  value={profile?.program || ""}
                  onChange={e => upd("program", e.target.value)}
                  placeholder="Course / Program"
                />
              </label>
            </div>
            <div className="sdp-grid-2">
              <label className="sdp-field">
                <span>Intake / Year</span>
                <input
                  value={profile?.intake || ""}
                  onChange={e => upd("intake", e.target.value)}
                  placeholder="2025–26"
                />
              </label>
              <label className="sdp-field">
                <span>Target City (abroad)</span>
                <input
                  value={profile?.targetCity || ""}
                  onChange={e => upd("targetCity", e.target.value)}
                  placeholder="Newark, NJ"
                />
              </label>
            </div>

            <div className="sdp-actions">
              <button
                className="sdp-btn"
                disabled={saving.study}
                onClick={() => saveSection("study", {
                  school:     profile?.school || "",
                  program:    profile?.program || "",
                  intake:     profile?.intake || "",
                  targetCity: profile?.targetCity || "",
                })}
              >
                {saving.study ? "Saving…" : saved.study ? "Saved ✓" : "Save study info"}
              </button>
            </div>
          </section>

          {/* Contact */}
          <section className="card sdp-section">
            <h3>Contact</h3>
            <div className="sdp-grid-2">
              <label className="sdp-field">
                <span>Phone</span>
                <div className="sdp-input">
                  <FiPhone />
                  <input
                    value={profile?.phone || ""}
                    onChange={e => upd("phone", e.target.value)}
                    placeholder="+254..."
                  />
                </div>
              </label>
              <label className="sdp-field">
                <span>WhatsApp (optional)</span>
                <div className="sdp-input">
                  <FiPhone />
                  <input
                    value={profile?.whatsapp || ""}
                    onChange={e => upd("whatsapp", e.target.value)}
                    placeholder="+254..."
                  />
                </div>
              </label>
            </div>
            <label className="sdp-field">
              <span>Email (account)</span>
              <div className="sdp-input is-readonly">
                <FiMail />
                <input value={profile?.email || user?.email || ""} readOnly placeholder="you@gmail.com" />
              </div>
              <small className="sdp-help">Email changes are handled in Account settings (coming soon).</small>
            </label>

            <div className="sdp-actions">
              <button
                className="sdp-btn"
                disabled={saving.contact}
                onClick={() => saveSection("contact", {
                  phone:    profile?.phone || "",
                  whatsapp: profile?.whatsapp || "",
                  // email stays read-only here
                })}
              >
                {saving.contact ? "Saving…" : saved.contact ? "Saved ✓" : "Save contact"}
              </button>
            </div>
          </section>

          {/* Address */}
          <section className="card sdp-section">
            <h3>Home Address (optional)</h3>
            <label className="sdp-field">
              <span>Address line 1</span>
              <div className="sdp-input">
                <FiHome />
                <input
                  value={profile?.addressLine1 || ""}
                  onChange={e => upd("addressLine1", e.target.value)}
                  placeholder="Street, building, etc."
                />
              </div>
            </label>
            <label className="sdp-field">
              <span>Address line 2</span>
              <input
                value={profile?.addressLine2 || ""}
                onChange={e => upd("addressLine2", e.target.value)}
                placeholder="Apartment, suite, etc. (optional)"
              />
            </label>
            <div className="sdp-grid-3">
              <label className="sdp-field">
                <span>City</span>
                <div className="sdp-input">
                  <FiMapPin />
                  <input
                    value={profile?.addressCity || ""}
                    onChange={e => upd("addressCity", e.target.value)}
                    placeholder="City"
                  />
                </div>
              </label>
              <label className="sdp-field">
                <span>Country</span>
                <input
                  value={profile?.addressCountry || ""}
                  onChange={e => upd("addressCountry", e.target.value)}
                  placeholder="Country"
                />
              </label>
              <label className="sdp-field">
                <span>Postal code</span>
                <input
                  value={profile?.postal || ""}
                  onChange={e => upd("postal", e.target.value)}
                  placeholder="Code"
                />
              </label>
            </div>

            <div className="sdp-actions">
              <button
                className="sdp-btn"
                disabled={saving.address}
                onClick={() => saveSection("address", {
                  addressLine1:   profile?.addressLine1 || "",
                  addressLine2:   profile?.addressLine2 || "",
                  addressCity:    profile?.addressCity || "",
                  addressCountry: profile?.addressCountry || "",
                  postal:         profile?.postal || "",
                })}
              >
                {saving.address ? "Saving…" : saved.address ? "Saved ✓" : "Save address"}
              </button>
            </div>
          </section>

          {/* Emergency */}
          <section className="card sdp-section">
            <h3>Emergency Contact</h3>
            <div className="sdp-grid-3">
              <label className="sdp-field">
                <span>Name</span>
                <input
                  value={profile?.emergencyName || ""}
                  onChange={e => upd("emergencyName", e.target.value)}
                  placeholder="Parent/Guardian name"
                />
              </label>
              <label className="sdp-field">
                <span>Relationship</span>
                <input
                  value={profile?.emergencyRelation || ""}
                  onChange={e => upd("emergencyRelation", e.target.value)}
                  placeholder="Parent / Sibling / Friend"
                />
              </label>
              <label className="sdp-field">
                <span>Phone</span>
                <div className="sdp-input">
                  <FiPhone />
                  <input
                    value={profile?.emergencyPhone || ""}
                    onChange={e => upd("emergencyPhone", e.target.value)}
                    placeholder="+254..."
                  />
                </div>
              </label>
            </div>

            <div className="sdp-actions">
              <button
                className="sdp-btn"
                disabled={saving.emergency}
                onClick={() => saveSection("emergency", {
                  emergencyName:     profile?.emergencyName || "",
                  emergencyRelation: profile?.emergencyRelation || "",
                  emergencyPhone:    profile?.emergencyPhone || "",
                })}
              >
                {saving.emergency ? "Saving…" : saved.emergency ? "Saved ✓" : "Save emergency contact"}
              </button>
            </div>
          </section>

          {/* Preferences */}
          <section className="card sdp-section">
            <h3>Communication Preferences</h3>
            <div className="sdp-checks">
              <label className="sdp-check">
                <input
                  type="checkbox"
                  checked={!!profile?.commsEmail}
                  onChange={e => upd("commsEmail", e.target.checked)}
                />
                <span>Email updates</span>
              </label>
              <label className="sdp-check">
                <input
                  type="checkbox"
                  checked={!!profile?.commsSMS}
                  onChange={e => upd("commsSMS", e.target.checked)}
                />
                <span>SMS updates</span>
              </label>
              <label className="sdp-check">
                <input
                  type="checkbox"
                  checked={!!profile?.commsWhatsApp}
                  onChange={e => upd("commsWhatsApp", e.target.checked)}
                />
                <span>WhatsApp updates</span>
              </label>
            </div>

            <div className="sdp-actions">
              <button
                className="sdp-btn"
                disabled={saving.prefs}
                onClick={() => saveSection("prefs", {
                  commsEmail:    !!profile?.commsEmail,
                  commsSMS:      !!profile?.commsSMS,
                  commsWhatsApp: !!profile?.commsWhatsApp,
                })}
              >
                {saving.prefs ? "Saving…" : saved.prefs ? "Saved ✓" : "Save preferences"}
              </button>
            </div>
          </section>

          {/* Payment Methods (mock) */}
          <section className="card sdp-section">
            <h3>Payment Methods</h3>
            {pmList.length === 0 ? (
              <p className="sdp-muted">No saved methods yet.</p>
            ) : (
              <ul className="sdp-pmlist">
                {pmList.map(pm => (
                  <li key={pm.id} className="sdp-pm">
                    <div className="sdp-pm__meta">
                      <span className="sdp-pm__brand">{pm.brand}</span>
                      <span className="sdp-pm__num">•••• {pm.last4}</span>
                      <span className="sdp-pm__exp">exp {pm.exp}</span>
                    </div>
                    <button
                      className="sdp-iconbtn"
                      onClick={() => removePaymentMethod(pm.id)}
                      title="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="sdp-grid-3 sdp-pmform">
              <label className="sdp-field">
                <span>Card number</span>
                <input
                  placeholder="4242 4242 4242 4242"
                  value={cardForm.number}
                  onChange={e => setCardForm(f => ({ ...f, number: e.target.value }))}
                />
              </label>
              <label className="sdp-field">
                <span>Name on card</span>
                <input
                  placeholder="Jane Student"
                  value={cardForm.name}
                  onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="sdp-field">
                <span>Expiry (MM/YY)</span>
                <input
                  placeholder="08/27"
                  value={cardForm.exp}
                  onChange={e => setCardForm(f => ({ ...f, exp: e.target.value }))}
                />
              </label>
            </div>

            <div className="sdp-actions">
              <button className="sdp-btn" type="button" onClick={addPaymentMethod}>
                <FiPlus /> Add method
              </button>
              <button
                className="sdp-btn"
                disabled={saving.payments}
                onClick={() => saveSection("payments", {
                  paymentMethods: profile?.paymentMethods || [],
                })}
              >
                {saving.payments ? "Saving…" : saved.payments ? "Saved ✓" : "Save payment methods"}
              </button>
            </div>

            <p className="sdp-help">Mock only. Replace with your payment provider later.</p>
          </section>
        </main>

        {/* RIGHT */}
        <aside className="sdp-col sdp-col--side">
          <section className="card sdp-summary">
            <h3>Profile Summary</h3>
            <ul>
              <li><span>Documents</span><b>{docsCount}</b></li>
              <li><span>Institution</span><b>{profile?.school || "—"}</b></li>
              <li><span>Program</span><b>{profile?.program || "—"}</b></li>
              <li><span>Target City</span><b>{profile?.targetCity || "—"}</b></li>
              <li><span>Phone</span><b>{profile?.phone || "—"}</b></li>
            </ul>
            <Link to="/dashboard/student/documents" className="sdp-link">
              <FiFileText /> Manage Documents
            </Link>
          </section>

          <section className="card sdp-kyc">
            <div className="sdp-kyc__row">
              <h3>Verification</h3>
              <span className={`sdp-badge ${kycClass}`}>{kycLabel}</span>
            </div>
            {kycStatus === "NOT_STARTED" && (
              <p className="sdp-muted">Upload passport/ID and admission letter to start verification.</p>
            )}
            {kycStatus === "SUBMITTED" && (
              <p className="sdp-muted">Your verification is under review.</p>
            )}
            {kycStatus !== "VERIFIED" && (
              <Link to="/dashboard/student/documents" className="sdp-btn sdp-btn--light">
                <FiShield /> Go to Documents
              </Link>
            )}
            {kycStatus === "VERIFIED" && (
              <div className="sdp-okay"><FiCheckCircle /> Verified</div>
            )}
          </section>

          <section className="card sdp-tip">
            <h3>Next step</h3>
            <p className="sdp-muted">Once you reach 100%, browse listings and send a request.</p>
            <Link to="/listings" className="sdp-btn">Browse Listings</Link>
          </section>
        </aside>
      </div>
    </section>
  );
}
