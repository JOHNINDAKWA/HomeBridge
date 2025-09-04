import { useEffect, useMemo, useState } from "react";
import {
  FiSave, FiRefreshCw, FiUpload, FiTrash2, FiAlertTriangle, FiCheckCircle,
  FiMail, FiPhone, FiGlobe, FiLock, FiShield, FiCreditCard, FiKey, FiDatabase,
  FiClock, FiInfo, FiLink, FiDollarSign, FiImage
} from "react-icons/fi";
import "./AdminSettings.css";

/* ----------------- Storage helpers (frontend mock) ----------------- */
const KEY = "admin:settings";

const DEFAULTS = {
  org: {
    name: "HomeBridge",
    logo: "", // dataURL stored here
    supportEmail: "support@homebridge.test",
    supportPhone: "+1 (555) 010-2323",
    website: "https://homebridge.test",
    timezone: "UTC",
  },
  security: {
    twoFactorRequired: false,
    sessionTimeoutMins: 60,
    allowIpRanges: "", // CSV ranges (mock)
  },
  fees: {
    currency: "USD",
    applicationFeeCents: 2500,
    escrowEnabled: true,
    escrowReleaseDays: 2,
  },
  kyc: {
    passport: true,
    admission: true,
    financial: true,
    i20: false,
    visa: false,
  },
  notifications: {
    newBookingEmail: true,
    newBookingSMS: false,
    statusChangeEmail: true,
    statusChangeSMS: false,
  },
  providers: {
    stripe: { publishableKey: "", webhookSecret: "" },
    mpesa: { shortcode: "", consumerKey: "", consumerSecret: "" },
  },
  webhooks: {
    bookingCreatedUrl: "",
    bookingUpdatedUrl: "",
    signatureSecret: "",
  },
  data: {
    retentionDays: 365,
    exportEmail: "",
  },
  maintenance: {
    enabled: false,
    message: "We’re down for scheduled maintenance. Please check back soon.",
  },
};

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

/* ----------------- Small UI helpers ----------------- */
const Toggle = ({ checked, onChange, label, desc }) => (
  <label className="asx-toggle">
    <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} />
    <span className="asx-slider" />
    <div className="asx-tmeta">
      <b>{label}</b>
      {desc && <small>{desc}</small>}
    </div>
  </label>
);

const Field = ({ label, hint, children }) => (
  <label className="asx-field">
    <span className="asx-label">{label}</span>
    {children}
    {hint && <small className="asx-hint">{hint}</small>}
  </label>
);

const Grid2 = ({ children }) => <div className="asx-grid2">{children}</div>;
const Grid3 = ({ children }) => <div className="asx-grid3">{children}</div>;

export default function AdminSettings() {
  const [settings, setSettings] = useState(loadSettings);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedBlink, setSavedBlink] = useState(false);

  // derived fee label
  const fee = (settings?.fees?.applicationFeeCents ?? 0) / 100;
  const feeLabel = useMemo(() => {
    const c = settings?.fees?.currency || "USD";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(fee);
  }, [fee, settings?.fees?.currency]);

  useEffect(() => {
    setDirty(true);
  }, [settings]);

  function upd(path, value) {
    setSettings(prev => {
      const next = structuredClone(prev);
      // set by path: e.g. "org.name"
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  }

  const onLogoPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => upd("org.logo", reader.result);
    reader.readAsDataURL(f);
  };
  const removeLogo = () => upd("org.logo", "");

  const save = async () => {
    setSaving(true);
    saveSettings(settings);
    setDirty(false);
    setSaving(false);
    setSavedBlink(true);
    setTimeout(() => setSavedBlink(false), 1200);
  };
  const resetUnsaved = () => {
    const current = loadSettings();
    setSettings(current);
    setDirty(false);
  };
  const restoreDefaults = () => {
    if (!confirm("Restore default settings? Unsaved changes will be lost.")) return;
    setSettings(DEFAULTS);
    saveSettings(DEFAULTS);
    setDirty(false);
  };

  // Demo testers
  const testEmail = () => alert("Demo: would send a test email to " + (settings.notificationsEmail || settings.org.supportEmail));
  const testWebhook = () => alert("Demo: would POST a sample payload to configured webhook URLs.");
  const testKeys = () => alert("Demo: would verify Stripe/M-Pesa keys with providers.");

  // Danger zone
  const clearDemoData = () => {
    if (!confirm("This will clear demo localStorage data (bookings, students). Continue?")) return;
    const keep = localStorage.getItem(KEY);
    localStorage.clear();
    if (keep) localStorage.setItem(KEY, keep);
    alert("Demo data cleared. (Settings preserved.)");
  };

  return (
    <section className="asx-wrap">
      {/* Page head */}
      <header className="asx-head card">
        <div className="asx-hleft">
          <h1>Admin Settings</h1>
          <p className="asx-sub">Configure your organization, security, fees, KYC, notifications and integrations.</p>
        </div>
        <div className="asx-cta">
          <button className="btn btn--light" onClick={resetUnsaved} title="Reset unsaved">
            <FiRefreshCw /> Reset
          </button>
          <button className="btn" onClick={save} disabled={!dirty || saving}>
            <FiSave /> {saving ? "Saving…" : "Save changes"}
          </button>
          <div className={`asx-savepill ${savedBlink ? "flash" : ""}`}>
            <FiCheckCircle /> Saved
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="asx-grid">
        {/* ===== ORG ===== */}
        <section className="card asx-card">
          <div className="asx-cardhead">
            <div className="asx-cardtitle"><FiGlobe /> Organization</div>
            <small>Branding & support info</small>
          </div>

          <div className="asx-brand">
            <div className="asx-logo">
              <div className="asx-logo__img">
                {settings.org.logo ? (
                  <img src={settings.org.logo} alt="Logo" />
                ) : (
                  <span className="asx-logo__ph"><FiImage /></span>
                )}
              </div>
              <div className="asx-logo__btns">
                <label className="btn btn--light">
                  <FiUpload /> Upload logo
                  <input hidden type="file" accept="image/*" onChange={onLogoPick} />
                </label>
                {settings.org.logo && (
                  <button className="btn btn--light" onClick={removeLogo}><FiTrash2 /> Remove</button>
                )}
              </div>
            </div>

            <div className="asx-brandform">
              <Grid2>
                <Field label="Organization name">
                  <input className="asx-input" value={settings.org.name}
                    onChange={e => upd("org.name", e.target.value)} placeholder="HomeBridge" />
                </Field>

                <Field label="Website">
                  <div className="asx-input asx-ico">
                    <FiLink />
                    <input value={settings.org.website}
                      onChange={e => upd("org.website", e.target.value)}
                      placeholder="https://yourdomain.com" />
                  </div>
                </Field>
              </Grid2>

              <Grid3>
                <Field label="Support email">
                  <div className="asx-input asx-ico">
                    <FiMail />
                    <input value={settings.org.supportEmail}
                      onChange={e => upd("org.supportEmail", e.target.value)}
                      placeholder="support@company.com" />
                  </div>
                </Field>

                <Field label="Support phone">
                  <div className="asx-input asx-ico">
                    <FiPhone />
                    <input value={settings.org.supportPhone}
                      onChange={e => upd("org.supportPhone", e.target.value)}
                      placeholder="+1 (555) 010-2323" />
                  </div>
                </Field>

                <Field label="Timezone" hint="Used for timestamps across the admin panel">
                  <select className="asx-select" value={settings.org.timezone}
                    onChange={e => upd("org.timezone", e.target.value)}>
                    {["UTC","America/New_York","Europe/London","Africa/Nairobi","Asia/Dubai"].map(z=>(
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </Field>
              </Grid3>
            </div>
          </div>
        </section>

        {/* ===== SECURITY ===== */}
        <section className="card asx-card">
          <div className="asx-cardhead">
            <div className="asx-cardtitle"><FiLock /> Security</div>
            <small>Admin access & sessions (mock)</small>
          </div>

          <Grid3>
            <Field label="Two-factor required">
              <Toggle
                checked={settings.security.twoFactorRequired}
                onChange={v => upd("security.twoFactorRequired", v)}
                label="Require 2FA for admin accounts"
                desc="Recommended: adds an additional verification step on login."
              />
            </Field>

            <Field label="Session timeout (mins)">
              <div className="asx-input asx-ico">
                <FiClock />
                <input type="number" min={10} max={480}
                  value={settings.security.sessionTimeoutMins}
                  onChange={e => upd("security.sessionTimeoutMins", Number(e.target.value) || 60)} />
              </div>
            </Field>

            <Field label="Allowed IP ranges (optional)" hint="Comma-separated list of CIDR ranges e.g. 192.168.0.0/16">
              <input className="asx-input" value={settings.security.allowIpRanges}
                onChange={e => upd("security.allowIpRanges", e.target.value)} placeholder=""/>
            </Field>
          </Grid3>
        </section>

        {/* ===== FEES & ESCROW ===== */}
        <section className="card asx-card">
          <div className="asx-cardhead">
            <div className="asx-cardtitle"><FiDollarSign /> Fees & Escrow</div>
            <small>Application fee, currency & escrow</small>
          </div>

          <Grid3>
            <Field label="Currency">
              <select className="asx-select" value={settings.fees.currency}
                onChange={e => upd("fees.currency", e.target.value)}>
                {["USD","KES","EUR","GBP"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Application fee" hint={`Shown to students as a one-time fee (${settings.fees.currency})`}>
              <div className="asx-input asx-ico">
                <FiCreditCard />
                <input type="number" min={0} step={1}
                  value={settings.fees.applicationFeeCents}
                  onChange={e => upd("fees.applicationFeeCents", Math.max(0, Number(e.target.value)||0))}
                />
              </div>
              <div className="asx-inlinehint">Current: <b>{feeLabel}</b></div>
            </Field>

            <Field label="Escrow enabled">
              <Toggle
                checked={settings.fees.escrowEnabled}
                onChange={v => upd("fees.escrowEnabled", v)}
                label="Hold funds in escrow (mock)"
                desc="Funds release after move-in confirmation or grace period."
              />
            </Field>
          </Grid3>

          <Field label="Escrow release (days)">
            <input className="asx-input" type="number" min={0} max={30}
              value={settings.fees.escrowReleaseDays}
              onChange={e => upd("fees.escrowReleaseDays", Math.max(0, Number(e.target.value)||0))}
            />
          </Field>
        </section>

        {/* ===== KYC ===== */}
        <section className="card asx-card">
          <div className="asx-cardhead">
            <div className="asx-cardtitle"><FiShield /> KYC Requirements</div>
            <small>Documents required for verification</small>
          </div>

          <div className="asx-checkgrid">
            <Toggle
              checked={settings.kyc.passport}
              onChange={v => upd("kyc.passport", v)}
              label="Passport / Government ID"
              desc="Primary identity document."
            />
            <Toggle
              checked={settings.kyc.admission}
              onChange={v => upd("kyc.admission", v)}
              label="Admission / Offer Letter"
              desc="Confirms current student status."
            />
            <Toggle
              checked={settings.kyc.financial}
              onChange={v => upd("kyc.financial", v)}
              label="Financial Statement"
              desc="Proof of funds for rent/fees."
            />
            <Toggle
              checked={settings.kyc.i20}
              onChange={v => upd("kyc.i20", v)}
              label="I-20 / CAS"
              desc="For US/UK visa-support documents."
            />
            <Toggle
              checked={settings.kyc.visa}
              onChange={v => upd("kyc.visa", v)}
              label="Student Visa (if issued)"
              desc="Optional if visa is pending."
            />
          </div>
        </section>

        {/* ===== NOTIFICATIONS ===== */}
        <section className="card asx-card">
          <div className="asx-cardhead">
            <div className="asx-cardtitle"><FiMail /> Notifications</div>
            <small>Admin alerts (demo)</small>
          </div>

          <div className="asx-checkgrid">
            <Toggle
              checked={settings.notifications.newBookingEmail}
              onChange={v => upd("notifications.newBookingEmail", v)}
              label="Email: New booking"
              desc="Send an email when a new booking is created."
            />
            <Toggle
              checked={settings.notifications.newBookingSMS}
              onChange={v => upd("notifications.newBookingSMS", v)}
              label="SMS: New booking"
              desc="Send an SMS when a new booking is created."
            />
            <Toggle
              checked={settings.notifications.statusChangeEmail}
              onChange={v => upd("notifications.statusChangeEmail", v)}
              label="Email: Status updates"
              desc="Notify on payment & review status changes."
            />
            <Toggle
              checked={settings.notifications.statusChangeSMS}
              onChange={v => upd("notifications.statusChangeSMS", v)}
              label="SMS: Status updates"
              desc="Notify on payment & review status changes."
            />
          </div>

          <div className="asx-row">
            <button className="btn btn--light" onClick={testEmail}><FiMail /> Send test email</button>
          </div>
        </section>

        {/* ===== PROVIDERS ===== */}
        <section className="card asx-card">
          <div className="asx-cardhead">
            <div className="asx-cardtitle"><FiKey /> Providers</div>
            <small>Stripe & M-Pesa keys (mock)</small>
          </div>

          <h4 className="asx-h4">Stripe</h4>
          <Grid2>
            <Field label="Publishable Key" hint="Use test keys in development.">
              <input className="asx-input"
                value={settings.providers.stripe.publishableKey}
                onChange={e => upd("providers.stripe.publishableKey", e.target.value)}
                placeholder="pk_test_..." />
            </Field>
            <Field label="Webhook Secret" hint="For verifying webhook signatures.">
              <input className="asx-input"
                value={settings.providers.stripe.webhookSecret}
                onChange={e => upd("providers.stripe.webhookSecret", e.target.value)}
                placeholder="whsec_..." />
            </Field>
          </Grid2>

          <h4 className="asx-h4">M-Pesa</h4>
          <Grid3>
            <Field label="Shortcode">
              <input className="asx-input"
                value={settings.providers.mpesa.shortcode}
                onChange={e => upd("providers.mpesa.shortcode", e.target.value)}
                placeholder="123456" />
            </Field>
            <Field label="Consumer Key">
              <input className="asx-input"
                value={settings.providers.mpesa.consumerKey}
                onChange={e => upd("providers.mpesa.consumerKey", e.target.value)}
                placeholder="CK_..." />
            </Field>
            <Field label="Consumer Secret">
              <input className="asx-input"
                value={settings.providers.mpesa.consumerSecret}
                onChange={e => upd("providers.mpesa.consumerSecret", e.target.value)}
                placeholder="CS_..." />
            </Field>
          </Grid3>

          <div className="asx-row">
            <button className="btn btn--light" onClick={testKeys}><FiCheckCircle /> Test keys (demo)</button>
          </div>
        </section>

        {/* ===== WEBHOOKS ===== */}
        <section className="card asx-card">
          <div className="asx-cardhead">
            <div className="asx-cardtitle"><FiLink /> Webhooks</div>
            <small>Events & signature (mock)</small>
          </div>

          <Grid2>
            <Field label="Booking Created URL">
              <input className="asx-input"
                value={settings.webhooks.bookingCreatedUrl}
                onChange={e => upd("webhooks.bookingCreatedUrl", e.target.value)}
                placeholder="https://api.yourdomain.com/hooks/booking-created" />
            </Field>
            <Field label="Booking Updated URL">
              <input className="asx-input"
                value={settings.webhooks.bookingUpdatedUrl}
                onChange={e => upd("webhooks.bookingUpdatedUrl", e.target.value)}
                placeholder="https://api.yourdomain.com/hooks/booking-updated" />
            </Field>
          </Grid2>

          <Field label="Signature Secret" hint="Used to sign webhook payloads (mock).">
            <input className="asx-input"
              value={settings.webhooks.signatureSecret}
              onChange={e => upd("webhooks.signatureSecret", e.target.value)}
              placeholder="whsig_..." />
          </Field>

          <div className="asx-row">
            <button className="btn btn--light" onClick={testWebhook}><FiInfo /> Send test webhook (demo)</button>
          </div>
        </section>

        {/* ===== DATA & MAINTENANCE ===== */}
        <section className="card asx-card">
          <div className="asx-cardhead">
            <div className="asx-cardtitle"><FiDatabase /> Data & Maintenance</div>
            <small>Retention & downtime banner</small>
          </div>

          <Grid3>
            <Field label="Retention (days)">
              <input className="asx-input" type="number" min={30} max={3650}
                value={settings.data.retentionDays}
                onChange={e => upd("data.retentionDays", Math.max(0, Number(e.target.value)||0))}
              />
            </Field>
            <Field label="Export email (optional)" hint="Where data exports will be sent.">
              <input className="asx-input"
                value={settings.data.exportEmail}
                onChange={e => upd("data.exportEmail", e.target.value)}
                placeholder="privacy@yourdomain.com" />
            </Field>
            <Field label="Maintenance mode">
              <Toggle
                checked={settings.maintenance.enabled}
                onChange={v => upd("maintenance.enabled", v)}
                label="Enable maintenance banner"
                desc="Shows a downtime message across the app (demo)."
              />
            </Field>
          </Grid3>

          <Field label="Maintenance message">
            <textarea className="asx-textarea" rows={3}
              value={settings.maintenance.message}
              onChange={e => upd("maintenance.message", e.target.value)} />
          </Field>
        </section>

        {/* ===== DANGER ZONE ===== */}
        <section className="card asx-card asx-danger">
          <div className="asx-cardhead">
            <div className="asx-cardtitle"><FiAlertTriangle /> Danger Zone</div>
            <small>Demo-only destructive actions</small>
          </div>

          <p className="asx-danger__copy">
            This demo stores data in your browser’s localStorage. You can clear the mock data below.
          </p>

          <div className="asx-row">
            <button className="btn btn--light" onClick={restoreDefaults}>
              <FiRefreshCw /> Restore default settings
            </button>
            <button className="btn" onClick={clearDemoData}>
              <FiTrash2 /> Clear demo data (keep settings)
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
