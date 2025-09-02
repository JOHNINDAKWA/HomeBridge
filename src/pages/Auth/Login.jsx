import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiBriefcase,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { FaUniversity } from "react-icons/fa";
import "./Login.css";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";

// Optional: background photo for the left panel (use the same aesthetic as Register)
import loginSideImg from "../../assets/images/register-side.jpg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // from AuthContext
  const [role, setRole] = useState("student"); // "student" | "agent"
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const fallbackByRole =
    role === "student" ? "/dashboard/student" : "/dashboard/agent/overview";
  const from = location.state?.from?.pathname || fallbackByRole;

  const canSubmit = useMemo(
    () => Boolean(form.email && form.password),
    [form.email, form.password]
  );

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  const handleGoogleLogin = async () => {
    // Mock success; use real provider later
    await login(`${role}@example.com`, "oauth");
    navigate(from, { replace: true });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    await login(form.email, form.password);
    navigate(from, { replace: true });
  };

  return (
    <section className="lg-wrap section">
      <div className="container lg-shell">
        {/* LEFT: brand/story with pale photo */}
        <aside
          className="lg-side card lg-side--photo"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.72) 55%, rgba(255,255,255,.38) 75%, rgba(255,255,255,0) 100%),
              radial-gradient(80% 60% at 10% 0%, rgba(20,184,166,.10) 0%, rgba(20,184,166,0) 70%),
              url(${loginSideImg})
            `,
          }}
        >
          <div className="lg-side__badge">Welcome back</div>
          <h1 className="lg-side__title">Log in to HomeBridge</h1>
          <p className="lg-side__p">
            Book, manage, and track your student housing with escrowed payments,
            document vault, and clear audit trails.
          </p>
          <ul className="lg-side__points">
            <li>
              <FiCheckCircle /> Secure, verified listings
            </li>
            <li>
              <FiCheckCircle /> Escrow & refund rules
            </li>
            <li>
              <FiCheckCircle /> Messaging & e-sign
            </li>
          </ul>
          <div className="lg-side__note">
            New here?{" "}
            <Link to="/register" className="lg-link">
              Create an account
            </Link>
          </div>
        </aside>

        {/* RIGHT: form */}
        <main className="lg-main card">
          {/* Role tabs */}
          <div className="lg-tabs" role="tablist" aria-label="Choose role">
            <button
              className={`lg-tab ${role === "student" ? "active" : ""}`}
              role="tab"
              aria-selected={role === "student"}
              onClick={() => setRole("student")}
            >
              <FaUniversity /> I’m a Student
            </button>
            <button
              className={`lg-tab ${role === "agent" ? "active" : ""}`}
              role="tab"
              aria-selected={role === "agent"}
              onClick={() => setRole("agent")}
            >
              <FiBriefcase /> I’m an Agent / Landlord
            </button>
          </div>

          {/* Google first */}
          <div className="lg-oauth">
            <button
              type="button"
              className="lg-google"
              onClick={handleGoogleLogin}
            >
              <svg
                className="lg-google__g"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C34.5 31.9 30 35 24 35c-7.2 0-13-5.8-13-13S16.8 9 24 9c3.3 0 6.3 1.2 8.7 3.3l5.7-5.7C34.5 3.6 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22 22-9.8 22-22c0-1.2-.1-2.3-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.8 16.2 19 13 24 13c3.3 0 6.3 1.2 8.7 3.3l5.7-5.7C34.5 7.6 29.6 6 24 6c-7 0-13.1 3.8-16.4 8.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 42c5.5 0 10.2-1.8 13.6-4.8l-6.3-5.2C29.7 33 27.1 34 24 34c-6 0-10.9-4.1-12.6-9.6l-6.7 5.2C7.9 36.5 15.4 42 24 42z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-4.9 6.5-9.3 6.5-3.6 0-6.8-1.8-8.6-4.6l-6.7 5.2C13 39.9 18.1 43 24 43c9 0 16.5-6.1 18.9-14.4.4-1.2.7-2.6.7-4.1 0-1.2-.1-2.3-.4-3.5z"
                />
              </svg>
              Continue with Google
            </button>
            <div className="lg-sep">
              <span>or</span>
            </div>
          </div>

          {/* Email form */}
          <form className="lg-form" onSubmit={handleEmailLogin}>
            <label className="lg-field">
              <span>Email</span>
              <div className="lg-input">
                <FiMail />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  placeholder="you@gmail.com"
                />
              </div>
            </label>

            <label className="lg-field">
              <span>Password</span>
              <div className="lg-input">
                <FiLock />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  placeholder="Your password"
                />
              </div>
              <div className="lg-row lg-row--actions">
                <label className="lg-check">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => update("remember", e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot" className="lg-link">
                  Forgot password?
                </Link>
              </div>
            </label>

            <button
              className="btn lg-submit"
              type="submit"
              disabled={!canSubmit}
            >
              Log in <FiArrowRight />
            </button>

            <div className="lg-alt">
              New to HomeBridge?{" "}
              <Link to="/register" className="lg-link">
                Create an account
              </Link>
            </div>
          </form>
        </main>
      </div>
    </section>
  );
}
