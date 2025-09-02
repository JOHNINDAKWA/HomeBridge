import { useState } from "react";
import {
  FiUser, FiBriefcase, FiUpload, FiGlobe, FiMapPin, FiPhone, FiMail,
  FiCheckCircle, FiAlertTriangle, FiShield, FiKey, FiLock,
  FiBell, FiLink, FiSave, FiTrash2, FiCreditCard
} from "react-icons/fi";
import "./Settings.css";

export default function Settings() {
  // Demo state — swap with API data later
  const [profile, setProfile] = useState({
    first: "Samuel",
    last: "Njoroge",
    email: "samuel@harborhomes.co",
    phone: "+254 700 123 456",
    city: "Nairobi, Kenya",
  });

  const [org, setOrg] = useState({
    name: "Harbor Homes Ltd.",
    website: "https://harborhomes.example",
    support: "support@harborhomes.co",
  });

  const [payout, setPayout] = useState({
    method: "bank", // bank | mpesa
    bankName: "Equity Bank",
    accountName: "Harbor Homes Ltd.",
    accountNumber: "011234567890",
    branch: "Upper Hill",
    mpesaPhone: "+254700123456",
  });

  const [prefs, setPrefs] = useState({
    timezone: "America/New_York",
    currency: "USD",
    unit: "imperial", // imperial | metric
  });

  const [notify, setNotify] = useState({
    newInquiry: true,
    docUploaded: true,
    offerEmailed: true,
    payoutPaid: true,
    weeklyDigest: false,
  });

  const [dev, setDev] = useState({ webhook: "" });

  // Helpers
  const update = (setter) => (k, v) => setter((s) => ({ ...s, [k]: v }));

  const saveAll = (e) => {
    e.preventDefault();
    // TODO: send to API
    alert("Saved! (demo)");
  };

  return (
    <form className="set" onSubmit={saveAll}>
      <header className="set-head">
        <div>
          <h2 className="set-title">Settings</h2>
          <p className="set-sub">
            Manage your partner profile, verification, payouts, notifications, and security.
          </p>
        </div>
        <button className="btn"><FiSave /> Save changes</button>
      </header>

      {/* ===== Grid ===== */}
      <div className="set-grid">
        {/* Profile */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiUser /> Profile</h3>
          </header>
          <div className="set-row">
            <label>First name
              <input className="input" value={profile.first}
                     onChange={(e)=>update(setProfile)("first", e.target.value)} />
            </label>
            <label>Last name
              <input className="input" value={profile.last}
                     onChange={(e)=>update(setProfile)("last", e.target.value)} />
            </label>
          </div>
          <div className="set-row">
            <label><FiMail /> Email
              <input className="input" type="email" value={profile.email}
                     onChange={(e)=>update(setProfile)("email", e.target.value)} />
            </label>
            <label><FiPhone /> Phone
              <input className="input" value={profile.phone}
                     onChange={(e)=>update(setProfile)("phone", e.target.value)} />
            </label>
          </div>
          <label><FiMapPin /> City
            <input className="input" value={profile.city}
                   onChange={(e)=>update(setProfile)("city", e.target.value)} />
          </label>
        </section>

        {/* Organization */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiBriefcase /> Organization</h3>
          </header>
          <label>Legal/Trading name
            <input className="input" value={org.name}
                   onChange={(e)=>update(setOrg)("name", e.target.value)} />
          </label>
          <div className="set-row">
            <label><FiGlobe /> Website
              <input className="input" value={org.website}
                     onChange={(e)=>update(setOrg)("website", e.target.value)} />
            </label>
            <label><FiMail /> Support email
              <input className="input" value={org.support}
                     onChange={(e)=>update(setOrg)("support", e.target.value)} />
            </label>
          </div>
        </section>

        {/* Verification (KYC/KYB) */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiShield /> Verification</h3>
            <span className="badge badge--ok"><FiCheckCircle /> KYC partially verified</span>
          </header>
          <p className="mini muted">
            Upload a government ID (front + back) and one proof of business (certificate,
            tax number, or utility bill). We review within 24–48 hours.
          </p>
          <div className="set-upload">
            <button type="button" className="btn btn--light"><FiUpload /> Upload ID (front)</button>
            <button type="button" className="btn btn--light"><FiUpload /> Upload ID (back)</button>
            <button type="button" className="btn btn--light"><FiUpload /> Upload business doc</button>
          </div>
          <div className="set-hint mini">
            <FiAlertTriangle /> Only encrypted, watermarked previews are visible to students.
          </div>
        </section>

        {/* Payouts */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiCreditCard /> Payouts</h3>
          </header>

          <div className="set-payout__tabs">
            <label className={`chip ${payout.method === "bank" ? "chip--active" : ""}`}>
              <input type="radio" name="paym" checked={payout.method==="bank"}
                     onChange={()=>update(setPayout)("method","bank")} /> Bank account
            </label>
            <label className={`chip ${payout.method === "mpesa" ? "chip--active" : ""}`}>
              <input type="radio" name="paym" checked={payout.method==="mpesa"}
                     onChange={()=>update(setPayout)("method","mpesa")} /> M-Pesa
            </label>
          </div>

          {payout.method === "bank" ? (
            <>
              <div className="set-row">
                <label>Bank name
                  <input className="input" value={payout.bankName}
                         onChange={(e)=>update(setPayout)("bankName", e.target.value)} />
                </label>
                <label>Account name
                  <input className="input" value={payout.accountName}
                         onChange={(e)=>update(setPayout)("accountName", e.target.value)} />
                </label>
              </div>
              <div className="set-row">
                <label>Account number
                  <input className="input" value={payout.accountNumber}
                         onChange={(e)=>update(setPayout)("accountNumber", e.target.value)} />
                </label>
                <label>Branch
                  <input className="input" value={payout.branch}
                         onChange={(e)=>update(setPayout)("branch", e.target.value)} />
                </label>
              </div>
              <p className="mini muted">Payouts settle T+2 after move-in confirmation.</p>
            </>
          ) : (
            <>
              <label>M-Pesa phone number
                <input className="input" value={payout.mpesaPhone}
                       onChange={(e)=>update(setPayout)("mpesaPhone", e.target.value)} />
              </label>
              <p className="mini muted">Ensure this number is registered for M-Pesa Business.</p>
            </>
          )}
        </section>

        {/* Notifications */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiBell /> Notifications</h3>
          </header>
          <div className="set-toggle">
            <Toggle
              label="New inquiry"
              checked={notify.newInquiry}
              onChange={(v)=>update(setNotify)("newInquiry", v)}
            />
            <Toggle
              label="Document uploaded"
              checked={notify.docUploaded}
              onChange={(v)=>update(setNotify)("docUploaded", v)}
            />
            <Toggle
              label="Offer emailed / E-sign events"
              checked={notify.offerEmailed}
              onChange={(v)=>update(setNotify)("offerEmailed", v)}
            />
            <Toggle
              label="Payout sent"
              checked={notify.payoutPaid}
              onChange={(v)=>update(setNotify)("payoutPaid", v)}
            />
            <Toggle
              label="Weekly digest"
              checked={notify.weeklyDigest}
              onChange={(v)=>update(setNotify)("weeklyDigest", v)}
            />
          </div>
        </section>

        {/* Security */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiLock /> Security</h3>
          </header>
          <div className="set-row">
            <label>Current password
              <input className="input" type="password" placeholder="••••••••" />
            </label>
            <label>New password
              <input className="input" type="password" placeholder="At least 8 characters" />
            </label>
          </div>
          <div className="set-row">
            <label>Confirm new password
              <input className="input" type="password" placeholder="Repeat new password" />
            </label>
            <div className="set-inline">
              <Toggle
                label="Enable 2-factor auth (TOTP)"
                checked={true}
                onChange={()=>{}}
                icon={<FiKey />}
              />
              <button type="button" className="btn btn--light"><FiShield /> Manage devices</button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiGlobe /> Preferences</h3>
          </header>
          <div className="set-row">
            <label>Timezone
              <select className="select" value={prefs.timezone}
                      onChange={(e)=>update(setPrefs)("timezone", e.target.value)}>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Africa/Nairobi">Africa/Nairobi</option>
              </select>
            </label>
            <label>Currency
              <select className="select" value={prefs.currency}
                      onChange={(e)=>update(setPrefs)("currency", e.target.value)}>
                <option value="USD">USD</option>
                <option value="KES">KES</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
          </div>
          <div className="set-row">
            <label>Measurement units
              <div className="set-payout__tabs">
                <label className={`chip ${prefs.unit === "imperial" ? "chip--active" : ""}`}>
                  <input type="radio" name="units" checked={prefs.unit==="imperial"}
                         onChange={()=>update(setPrefs)("unit","imperial")} /> Imperial
                </label>
                <label className={`chip ${prefs.unit === "metric" ? "chip--active" : ""}`}>
                  <input type="radio" name="units" checked={prefs.unit==="metric"}
                         onChange={()=>update(setPrefs)("unit","metric")} /> Metric
                </label>
              </div>
            </label>
          </div>
        </section>

        {/* Developer webhooks */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiLink /> Developer</h3>
          </header>
          <label>Webhook URL (application events)
            <input className="input" placeholder="https://example.com/webhooks/homebridge"
                   value={dev.webhook}
                   onChange={(e)=>update(setDev)("webhook", e.target.value)} />
          </label>
          <p className="mini muted">
            We’ll POST JSON when applications change stage (New → Reviewing, Offer Sent, E-signed).
          </p>
        </section>

        {/* Danger zone */}
        <section className="card set-box set-danger">
          <header className="set-box__head">
            <h3><FiAlertTriangle /> Danger zone</h3>
          </header>
          <p className="muted">
            Deactivate your partner account. Listings will be hidden and future payouts halted.
          </p>
          <button type="button" className="btn btn--danger">
            <FiTrash2 /> Deactivate account
          </button>
        </section>
      </div>

      {/* Sticky bottom save for mobile */}
      <div className="set-sticky">
        <button className="btn"><FiSave /> Save changes</button>
      </div>
    </form>
  );
}

/* ---------- tiny Toggle component ---------- */
function Toggle({ label, checked, onChange, icon }) {
  return (
    <label className="set-toggle__item">
      <span className="set-toggle__label">
        {icon ? <span className="ico">{icon}</span> : null}
        {label}
      </span>
      <span className={`switch ${checked ? "on" : ""}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e)=>onChange(e.target.checked)}
        />
        <i />
      </span>
    </label>
  );
}
