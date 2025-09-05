// src/pages/Admin/Auth/AdminLogin.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext.jsx";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { login, routeForRole } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => !!(form.email && form.password), [form]);
  const from = loc.state?.from?.pathname || "/admin";

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const { user } = await login(form.email, form.password, from);

      // Admin gate
      const role = String(user?.role || "").toUpperCase();
      if (role !== "ADMIN" && role !== "SUPERADMIN") {
        setErr("This account is not authorized for admin access.");
        return;
      }

      // First-login branch
      if (user.mustChangePassword) {
        nav("/admin/first-login", { replace: true, state: { from } });
        return;
      }

      // Normal branch
      const dest = routeForRole(user.role, from); // your existing helper
      nav(dest, { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adlogin-wrap">
      <main className="adlogin card">
        <div className="adlogin-head">
          <div className="adlogin-badge"><FiShield/> Admin</div>
          <h1>Sign in to Admin</h1>
          <p className="adlogin-sub">Restricted area for operations admins.</p>
        </div>

        <form className="adlogin-form" onSubmit={handleSubmit}>
          {err && <div className="adlogin-error">{err}</div>}

          <label className="ad-field">
            <span>Email</span>
            <div className="ad-input">
              <FiMail />
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="admin@homebridge.com"
                required
              />
            </div>
          </label>

          <label className="ad-field">
            <span>Password</span>
            <div className="ad-input">
              <FiLock />
              <input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
          </label>

          <button className="btn adlogin-submit" type="submit" disabled={!canSubmit || loading}>
            {loading ? <span className="spinner" aria-label="Signing in…" /> : <>Sign in <FiArrowRight /></>}
          </button>
        </form>
      </main>
    </div>
  );
}
