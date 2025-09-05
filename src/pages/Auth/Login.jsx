import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiBriefcase,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { FaUniversity } from "react-icons/fa";
import "./Login.css";
import { useAuth } from "../../Context/AuthContext.jsx";
import loginSideImg from "../../assets/images/register-side.jpg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, routeForRole } = useAuth();

  // Visual only — backend role decides redirect
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [err, setErr] = useState("");

  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "";
  const canSubmit = useMemo(() => Boolean(form.email && form.password), [form]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErr("");
    if (!canSubmit) return;

    setLoading(true); // ⬅️ Start loading

    try {
      const { user, redirect } = await login(form.email, form.password, from);
      const dest = redirect || routeForRole(user?.role, from);
      navigate(dest, { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false); // ⬅️ Stop loading, regardless of outcome
    }
  };

  return (
    <section className="lg-wrap section">
      <div className="container lg-shell">
        {/* LEFT */}
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

        {/* RIGHT */}
        <main className="lg-main card">
          {/* Role tabs (visual only) */}
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

          {/* Email form only */}
          <form className="lg-form" onSubmit={handleEmailLogin}>
            {err && <div className="lg-error">{err}</div>}

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
              disabled={!canSubmit || loading} // ⬅️ Disable when loading
            >
              {loading ? ( // ⬅️ Conditional rendering
                <div className="spinner"></div>
              ) : (
                <>
                  Log in <FiArrowRight />
                </>
              )}
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
