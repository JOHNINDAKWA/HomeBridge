// src/pages/Auth/Register.jsx
import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiBriefcase, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { FaUniversity } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext.jsx";
import "./Register.css";
import registerSideImg from "../../assets/images/register-side.jpg";

export default function Register() {
  const navigate = useNavigate();
  const { register: registerApi, setProfile } = useAuth();

  const [role, setRole] = useState("student"); // "student" | "agent"
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    terms: false,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const canSubmit = useMemo(() => {
    return (
      !!form.first &&
      !!form.last &&
      !!form.email &&
      !!form.password &&
      form.password.length >= 8 &&
      form.terms
    );
  }, [form]);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setErr("");
    setLoading(true);

    try {
      const payload = {
        name: `${form.first} ${form.last}`.trim(),
        email: form.email,
        password: form.password,
        role: role === "agent" ? "AGENT" : "STUDENT",
      };
      const { user } = await registerApi(payload);

      // nice-to-have: prime local student profile shell (email/name) for UI
      if (user.role === "STUDENT") {
        setProfile((p) => ({
          ...p,
          fullName: payload.name,
          email: payload.email,
        }));
        navigate("/dashboard/student/profile", { replace: true });
      } else if (user.role === "AGENT") {
        navigate("/dashboard/agent/settings", { replace: true });
      } else {
        navigate("/dashboard/student", { replace: true });
      }
    } catch (e) {
      setErr(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rg-wrap section">
      <div className="container rg-shell">
        {/* LEFT: copy/art */}
        <aside
          className="rg-side rg-side--photo card"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.72) 55%, rgba(255,255,255,.38) 75%, rgba(255,255,255,0) 100%),
            radial-gradient(80% 60% at 10% 0%, rgba(20,184,166,.10) 0%, rgba(20,184,166,0) 70%),
              url(${registerSideImg})
            `,
          }}
        >
          <div className="rg-side__badge">New here?</div>
          <h1 className="rg-side__title">Create your HomeBridge account</h1>
          <p className="rg-side__p">
            Sign up in seconds. You’ll add the rest of your details on the next page.
          </p>
          <ul className="rg-side__points">
            <li><FiCheckCircle /> Verified listings & partners</li>
            <li><FiCheckCircle /> Escrowed payments & clear refunds</li>
            <li><FiCheckCircle /> Document vault & e-sign</li>
          </ul>
          <div className="rg-side__note">
            Already have an account? <Link to="/login" className="rg-link">Log in</Link>
          </div>
        </aside>

        {/* RIGHT: form */}
        <main className="rg-main card">
          {/* Role tabs */}
          <div className="rg-tabs" role="tablist" aria-label="Choose account type">
            <button
              className={`rg-tab ${role === "student" ? "active" : ""}`}
              role="tab"
              aria-selected={role === "student"}
              onClick={() => setRole("student")}
              type="button"
            >
              <FaUniversity /> I’m a Student
            </button>
            <button
              className={`rg-tab ${role === "agent" ? "active" : ""}`}
              role="tab"
              aria-selected={role === "agent"}
              onClick={() => setRole("agent")}
              type="button"
            >
              <FiBriefcase /> I’m an Agent / Landlord
            </button>
          </div>

          <form className="rg-form" onSubmit={handleEmailRegister}>
            {err && <div className="lg-error" style={{ marginBottom: 10 }}>{err}</div>}

            <div className="rg-row rg-row--2">
              <label className="rg-field">
                <span>First name</span>
                <div className="rg-input">
                  <FiUser />
                  <input
                    value={form.first}
                    onChange={(e) => update("first", e.target.value)}
                    required
                    placeholder="Amina"
                  />
                </div>
              </label>
              <label className="rg-field">
                <span>Last name</span>
                <div className="rg-input">
                  <FiUser />
                  <input
                    value={form.last}
                    onChange={(e) => update("last", e.target.value)}
                    required
                    placeholder="Njoroge"
                  />
                </div>
              </label>
            </div>

            <label className="rg-field">
              <span>Email</span>
              <div className="rg-input">
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

            <label className="rg-field">
              <span>Password</span>
              <div className="rg-input">
                <FiLock />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                />
              </div>
            </label>

            <label className="rg-check">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => update("terms", e.target.checked)}
              />
              <span>
                I agree to the <Link to="/legal/terms" className="rg-link">Terms</Link> and{" "}
                <Link to="/legal/privacy" className="rg-link">Privacy</Link>.
              </span>
            </label>

            <button
              className={`btn rg-submit ${loading ? "btn--loading" : ""}`}
              type="submit"
              disabled={!canSubmit || loading}
              aria-busy={loading}
              aria-live="polite"
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  <span className="sr-only">Creating account…</span>
                  Creating…
                </>
              ) : (
                <>
                  Create account <FiArrowRight />
                </>
              )}
            </button>

            <div className="rg-alt">
              Already have an account? <Link to="/login" className="rg-link">Log in</Link>
            </div>
          </form>
        </main>
      </div>
    </section>
  );
}
