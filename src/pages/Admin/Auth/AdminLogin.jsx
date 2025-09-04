// src/pages/Admin/Auth/AdminLogin.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext.jsx";

import "./AdminLogin.css";

export default function AdminLogin(){
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const canSubmit = useMemo(() => !!(form.email && form.password), [form]);
  const from = loc.state?.from?.pathname || "/admin";

  const update = (k,v)=>setForm(f=>({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
await login(form.email, form.password, "admin");
localStorage.setItem("auth:role", "admin");

    nav(from, { replace: true });
  };

  const quickSuper = async () => {
await login("superadmin@homebridge.test", "dev", "superadmin");
localStorage.setItem("auth:role", "superadmin");

    nav(from, { replace: true });
  };

  return (
    <div className="adlogin-wrap">
      <main className="adlogin card">
        <div className="adlogin-head">
          <div className="adlogin-badge"><FiShield/> Admin</div>
          <h1>Sign in to Admin</h1>
          <p className="adlogin-sub">Restricted area for operations/super admins.</p>
        </div>

        <form className="adlogin-form" onSubmit={handleSubmit}>
          <label className="ad-field">
            <span>Email</span>
            <div className="ad-input">
              <FiMail />
              <input type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="admin@homebridge.com" required />
            </div>
          </label>
          <label className="ad-field">
            <span>Password</span>
            <div className="ad-input">
              <FiLock />
              <input type="password" value={form.password} onChange={e=>update("password",e.target.value)} placeholder="Your password" required />
            </div>
          </label>
          <button className="btn adlogin-submit" type="submit" disabled={!canSubmit}>
            Sign in <FiArrowRight />
          </button>
          <button className="btn btn--light adlogin-dev" type="button" onClick={quickSuper}>
            Continue as Super Admin (dev)
          </button>
        </form>
      </main>
    </div>
  );
}
