// src/pages/Admin/Auth/AdminFirstLogin.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiLock, FiArrowRight, FiShield } from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "./AdminLogin.css";

export default function AdminFirstLogin() {
  const { api, routeForRole } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/admin";

  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = pw.next.length >= 8 && pw.next === pw.confirm;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      // current is optional when mustChangePassword = true
      await api("/api/auth/password/change", {
        method: "POST",
        body: { next: pw.next },
      });
      setOk(true);
      // small pause for UX
      setTimeout(() => {
        const dest = routeForRole("ADMIN", from); // send to admin home/desired page
        nav(dest, { replace: true });
      }, 600);
    } catch (e) {
      setErr(e.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adlogin-wrap">
      <main className="adlogin card">
        <div className="adlogin-head">
          <div className="adlogin-badge"><FiShield/> Admin</div>
          <h1>Set your password</h1>
          <p className="adlogin-sub">Welcome! Please set a new password to finish activation.</p>
        </div>

        <form className="adlogin-form" onSubmit={submit}>
          {err && <div className="adlogin-error">{err}</div>}
          {ok && <div className="adlogin-ok">Password updated ✓</div>}

          <label className="ad-field">
            <span>New password</span>
            <div className="ad-input">
              <FiLock />
              <input
                type="password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>
          </label>

          <label className="ad-field">
            <span>Confirm new password</span>
            <div className="ad-input">
              <FiLock />
              <input
                type="password"
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                placeholder="Repeat new password"
                minLength={8}
                required
              />
            </div>
          </label>

          <button className="btn adlogin-submit" type="submit" disabled={!canSubmit || loading}>
            {loading ? <span className="spinner" aria-label="Saving…" /> : <>Save & continue <FiArrowRight /></>}
          </button>
        </form>
      </main>
    </div>
  );
}
