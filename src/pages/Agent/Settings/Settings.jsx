import { useEffect, useState } from "react";
import {
  FiUser, FiBriefcase, FiUpload, FiGlobe, FiMapPin, FiPhone, FiMail,
  FiCheckCircle, FiAlertTriangle, FiShield, FiKey, FiLock,
  FiBell, FiLink, FiTrash2, FiCreditCard
} from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "./Settings.css";

/* --------- Small UI helpers --------- */
function Spinner({ size = 16 }) {
  return <span className="hb-spinner" style={{ width: size, height: size }} aria-hidden="true" />;
}

function SaveButton({ saving, saved, onClick, children }) {
  return (
    <button
      type="button"
      className="btn"
      onClick={onClick}
      disabled={saving}
      aria-busy={saving}
      style={{ minWidth: 120, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
    >
      {saving ? <Spinner /> : saved ? <FiCheckCircle /> : null}
      {saving ? "Saving…" : saved ? "Saved" : children}
    </button>
  );
}

function Toggle({ label, checked, onChange, icon }) {
  return (
    <label className="set-toggle__item">
      <span className="set-toggle__label">
        {icon ? <span className="ico">{icon}</span> : null}
        {label}
      </span>
      <span className={`switch ${checked ? "on" : ""}`}>
        <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} />
        <i />
      </span>
    </label>
  );
}

export default function Settings() {
  const { api, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form state
  const [profile, setProfile] = useState({ first: "", last: "", email: "", phone: "", city: "" });
  const [org, setOrg] = useState({ orgName: "", website: "", supportEmail: "" });
  const [payout, setPayout] = useState({
    payoutMethod: "BANK", bankName: "", accountName: "", accountNumber: "", branch: "", mpesaPhone: ""
  });
  const [prefs, setPrefs] = useState({ prefsTimezone: "Africa/Nairobi", prefsCurrency: "USD", prefsUnit: "IMPERIAL" });
  const [notify, setNotify] = useState({
    notifyNewInquiry: true, notifyDocUploaded: true, notifyOfferEmailed: true, notifyPayoutPaid: true, notifyWeeklyDigest: false
  });
  const [dev, setDev] = useState({ devWebhook: "" });

  // per-section save state
  const [saving, setSaving] = useState({ profile: false, org: false, payout: false, prefs: false, notify: false, dev: false });
  const [saved, setSaved]   = useState({ profile: false, org: false, payout: false, prefs: false, notify: false, dev: false });

  const update = (setter) => (k, v) => setter((s) => ({ ...s, [k]: v }));

  // preload
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setErr("");
        const { profile: p } = await api("/api/agents/me/profile");
        if (!live) return;

        setProfile(s => ({
          ...s,
          first: p.first || "",
          last: p.last || "",
          email: p.email || user?.email || "",
          phone: p.phone || "",
          city: p.city || "",
        }));

        setOrg(s => ({
          ...s,
          orgName: p.orgName || "",
          website: p.website || "",
          supportEmail: p.supportEmail || "",
        }));

        setPayout(s => ({
          ...s,
          payoutMethod: p.payoutMethod || "BANK",
          bankName: p.bankName || "",
          accountName: p.accountName || "",
          accountNumber: p.accountNumber || "",
          branch: p.branch || "",
          mpesaPhone: p.mpesaPhone || "",
        }));

        setPrefs(s => ({
          ...s,
          prefsTimezone: p.prefsTimezone || "Africa/Nairobi",
          prefsCurrency: p.prefsCurrency || "USD",
          prefsUnit: p.prefsUnit || "IMPERIAL",
        }));

        setNotify(s => ({
          ...s,
          notifyNewInquiry: p.notifyNewInquiry ?? true,
          notifyDocUploaded: p.notifyDocUploaded ?? true,
          notifyOfferEmailed: p.notifyOfferEmailed ?? true,
          notifyPayoutPaid: p.notifyPayoutPaid ?? true,
          notifyWeeklyDigest: p.notifyWeeklyDigest ?? false,
        }));

        setDev(s => ({ ...s, devWebhook: p.devWebhook || "" }));
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // shared saver
  const savePart = async (patch, key) => {
    setErr("");
    setSaving(s => ({ ...s, [key]: true }));
    setSaved(s => ({ ...s, [key]: false }));
    try {
      await api("/api/agents/me/profile", { method: "PUT", body: patch });
      setSaved(s => ({ ...s, [key]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 1200);
    } catch (e) {
      setErr(e.message || "Failed to save");
    } finally {
      setSaving(s => ({ ...s, [key]: false }));
    }
  };

  if (loading) {
    return (
      <div className="container2">
        <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <Spinner size={18} /> Loading…
        </div>
      </div>
    );
  }

  return (
    <form className="set" onSubmit={(e)=>e.preventDefault()}>
      <header className="set-head">
        <div>
          <h2 className="set-title">Settings</h2>
          <p className="set-sub">Manage your partner profile, verification, payouts, notifications, and preferences.</p>
        </div>
        {/* Save-all removed; each section has its own Save */}
      </header>

      {err && (
        <div className="card" style={{ padding: 12, borderColor: "#e11d48", color: "#b91c1c" }}>
          ⚠ {err}
        </div>
      )}

      {/* ===== Grid ===== */}
      <div className="set-grid">
        {/* Profile */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiUser /> Profile</h3>
            <SaveButton
              saving={saving.profile}
              saved={saved.profile}
              onClick={() => savePart(profile, "profile")}
            >
              Save
            </SaveButton>
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
            <SaveButton
              saving={saving.org}
              saved={saved.org}
              onClick={() => savePart(org, "org")}
            >
              Save
            </SaveButton>
          </header>
          <label>Legal/Trading name
            <input className="input" value={org.orgName}
                   onChange={(e)=>update(setOrg)("orgName", e.target.value)} />
          </label>
          <div className="set-row">
            <label><FiGlobe /> Website
              <input className="input" value={org.website}
                     onChange={(e)=>update(setOrg)("website", e.target.value)} />
            </label>
            <label><FiMail /> Support email
              <input className="input" value={org.supportEmail}
                     onChange={(e)=>update(setOrg)("supportEmail", e.target.value)} />
            </label>
          </div>
        </section>

        {/* Verification (display stub) */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiShield /> Verification</h3>
            <span className="badge badge--ok"><FiCheckCircle /> KYC partially verified</span>
          </header>
          <p className="mini muted">Upload a government ID (front + back) and one proof of business.</p>
          <div className="set-upload">
            <button type="button" className="btn btn--light"><FiUpload /> Upload ID (front)</button>
            <button type="button" className="btn btn--light"><FiUpload /> Upload ID (back)</button>
            <button type="button" className="btn btn--light"><FiUpload /> Upload business doc</button>
          </div>
          <div className="set-hint mini"><FiAlertTriangle /> Only encrypted, watermarked previews are visible to students.</div>
        </section>

        {/* Payouts */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiCreditCard /> Payouts</h3>
            <SaveButton
              saving={saving.payout}
              saved={saved.payout}
              onClick={() => savePart(payout, "payout")}
            >
              Save
            </SaveButton>
          </header>

          <div className="set-payout__tabs">
            <label className={`chip ${payout.payoutMethod === "BANK" ? "chip--active" : ""}`}>
              <input type="radio" name="paym" checked={payout.payoutMethod==="BANK"}
                     onChange={()=>update(setPayout)("payoutMethod","BANK")} /> Bank account
            </label>
            <label className={`chip ${payout.payoutMethod === "MPESA" ? "chip--active" : ""}`}>
              <input type="radio" name="paym" checked={payout.payoutMethod==="MPESA"}
                     onChange={()=>update(setPayout)("payoutMethod","MPESA")} /> M-Pesa
            </label>
          </div>

          {payout.payoutMethod === "BANK" ? (
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
            <SaveButton
              saving={saving.notify}
              saved={saved.notify}
              onClick={() => savePart(notify, "notify")}
            >
              Save
            </SaveButton>
          </header>
          <div className="set-toggle">
            <Toggle label="New inquiry" checked={notify.notifyNewInquiry}
                    onChange={(v)=>update(setNotify)("notifyNewInquiry", v)} />
            <Toggle label="Document uploaded" checked={notify.notifyDocUploaded}
                    onChange={(v)=>update(setNotify)("notifyDocUploaded", v)} />
            <Toggle label="Offer emailed / E-sign events" checked={notify.notifyOfferEmailed}
                    onChange={(v)=>update(setNotify)("notifyOfferEmailed", v)} />
            <Toggle label="Payout sent" checked={notify.notifyPayoutPaid}
                    onChange={(v)=>update(setNotify)("notifyPayoutPaid", v)} />
            <Toggle label="Weekly digest" checked={notify.notifyWeeklyDigest}
                    onChange={(v)=>update(setNotify)("notifyWeeklyDigest", v)} />
          </div>
        </section>

        {/* Security (UI only) */}
        <section className="card set-box">
          <header className="set-box__head"><h3><FiLock /> Security</h3></header>
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
              <Toggle label="Enable 2-factor auth (TOTP)" checked={true} onChange={()=>{}} icon={<FiKey />} />
              <button type="button" className="btn btn--light"><FiShield /> Manage devices</button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiGlobe /> Preferences</h3>
            <SaveButton
              saving={saving.prefs}
              saved={saved.prefs}
              onClick={() => savePart(prefs, "prefs")}
            >
              Save
            </SaveButton>
          </header>
          <div className="set-row">
            <label>Timezone
              <select className="select" value={prefs.prefsTimezone}
                      onChange={(e)=>update(setPrefs)("prefsTimezone", e.target.value)}>
                <option value="Africa/Nairobi">Africa/Nairobi</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </label>
            <label>Currency
              <select className="select" value={prefs.prefsCurrency}
                      onChange={(e)=>update(setPrefs)("prefsCurrency", e.target.value)}>
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
                <label className={`chip ${prefs.prefsUnit === "IMPERIAL" ? "chip--active" : ""}`}>
                  <input type="radio" name="units" checked={prefs.prefsUnit==="IMPERIAL"}
                         onChange={()=>update(setPrefs)("prefsUnit","IMPERIAL")} /> Imperial
                </label>
                <label className={`chip ${prefs.prefsUnit === "METRIC" ? "chip--active" : ""}`}>
                  <input type="radio" name="units" checked={prefs.prefsUnit==="METRIC"}
                         onChange={()=>update(setPrefs)("prefsUnit","METRIC")} /> Metric
                </label>
              </div>
            </label>
          </div>
        </section>

        {/* Developer */}
        <section className="card set-box">
          <header className="set-box__head">
            <h3><FiLink /> Developer</h3>
            <SaveButton
              saving={saving.dev}
              saved={saved.dev}
              onClick={() => savePart(dev, "dev")}
            >
              Save
            </SaveButton>
          </header>
          <label>Webhook URL (application events)
            <input
              className="input"
              placeholder="https://example.com/webhooks/homebridge"
              value={dev.devWebhook}
              onChange={(e)=>update(setDev)("devWebhook", e.target.value)}
            />
          </label>
          <p className="mini muted">We’ll POST JSON when applications change stage (New → Reviewing, Offer Sent, E-signed).</p>
        </section>

        {/* Danger zone (UI only) */}
        <section className="card set-box set-danger">
          <header className="set-box__head"><h3><FiAlertTriangle /> Danger zone</h3></header>
          <p className="muted">Deactivate your partner account. Listings will be hidden and future payouts halted.</p>
          <button type="button" className="btn btn--danger"><FiTrash2 /> Deactivate account</button>
        </section>
      </div>
    </form>
  );
}
