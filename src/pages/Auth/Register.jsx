// src/pages/Auth/Register.jsx
import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser, FiMail, FiLock, FiMapPin, FiCalendar, FiBriefcase,
  FiShield, FiGlobe, FiArrowRight, FiCheckCircle
} from "react-icons/fi";
import { FaUniversity } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext.jsx"; // ✅ add this
import "./Register.css";

import registerSideImg from "../../assets/images/register-side.jpg";

export default function Register() {
  const navigate = useNavigate();
  const { login, setProfile } = useAuth(); // ✅ add this
  const [role, setRole] = useState("student"); // "student" | "agent"
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    university: "",
    targetCity: "",
    intake: "",
    company: "",
    businessType: "",
    website: "",
    kycAck: false,
    terms: false,
  });

  const canSubmit = useMemo(() => {
    if (!form.email || !form.password || !form.terms) return false;
    if (role === "student") return !!(form.first && form.last);
    return !!(form.company && form.first && form.last && form.kycAck);
  }, [form, role]);

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // Build a student profile object from the form
  const buildStudentProfile = () => ({
    fullName: `${form.first} ${form.last}`.trim(),
    email: form.email,
    school: form.university || "",
    program: "", // you can add a field for this later in the form if needed
    phone: "",   // optional field you may add to the form
    targetCity: form.targetCity || "",
    intake: form.intake || "",
  });

  // OAuth register
  const handleGoogleRegister = async () => {
    if (role === "student") {
      await login(form.email || "student@example.com", "oauth", "student");
      setProfile((p) => ({ ...p, ...buildStudentProfile() }));
      navigate("/dashboard/student/profile", { replace: true });
    } else {
      await login(form.email || "agent@example.com", "oauth", "agent");
      navigate("/dashboard/agent/overview", { replace: true });
    }
  };

  // Email/password register
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // TODO: send to your real API; on success:
    if (role === "student") {
      await login(form.email, form.password, "student");
      setProfile((p) => ({ ...p, ...buildStudentProfile() }));
      navigate("/dashboard/student/profile", { replace: true }); // 👈 lands on details
    } else {
      await login(form.email, form.password, "agent");
      navigate("/dashboard/agent/overview", { replace: true });
    }
  };

  return (
    <section className="rg-wrap section">
      <div className="container rg-shell">
        {/* LEFT: Art / pitch */}
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
            One account to book verified housing before you land. Payments are escrowed,
            documents secured, and every step leaves an audit trail.
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

        {/* RIGHT: Form */}
        <main className="rg-main card">
          {/* Role Tabs */}
          <div className="rg-tabs" role="tablist" aria-label="Choose account type">
            <button
              className={`rg-tab ${role === "student" ? "active" : ""}`}
              role="tab"
              aria-selected={role === "student"}
              onClick={() => setRole("student")}
            >
              <FaUniversity /> I’m a Student
            </button>
            <button
              className={`rg-tab ${role === "agent" ? "active" : ""}`}
              role="tab"
              aria-selected={role === "agent"}
              onClick={() => setRole("agent")}
            >
              <FiBriefcase /> I’m an Agent / Landlord
            </button>
          </div>

          {/* Google first CTA */}
          <div className="rg-oauth">
            <button type="button" className="rg-google" onClick={handleGoogleRegister}>
              <svg className="rg-google__g" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C34.5 31.9 30 35 24 35c-7.2 0-13-5.8-13-13S16.8 9 24 9c3.3 0 6.3 1.2 8.7 3.3l5.7-5.7C34.5 3.6 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22 22-9.8 22-22c0-1.2-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16.2 19 13 24 13c3.3 0 6.3 1.2 8.7 3.3l5.7-5.7C34.5 7.6 29.6 6 24 6c-7 0-13.1 3.8-16.4 8.7z"/>
                <path fill="#4CAF50" d="M24 42c5.5 0 10.2-1.8 13.6-4.8l-6.3-5.2C29.7 33 27.1 34 24 34c-6 0-10.9-4.1-12.6-9.6l-6.7 5.2C7.9 36.5 15.4 42 24 42z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-4.9 6.5-9.3 6.5-3.6 0-6.8-1.8-8.6-4.6l-6.7 5.2C13 39.9 18.1 43 24 43c9 0 16.5-6.1 18.9-14.4.4-1.2.7-2.6.7-4.1 0-1.2-.1-2.3-.4-3.5z"/>
              </svg>
              Continue with Google
            </button>
            <div className="rg-sep"><span>or</span></div>
          </div>

          {/* Email form */}
          <form className="rg-form" onSubmit={handleEmailRegister}>
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
                  placeholder="Create a strong password"
                />
              </div>
              <small className="rg-help">At least 8 characters recommended.</small>
            </label>

            {/* Role-specific blocks */}
            {role === "student" ? (
              <>
                <div className="rg-row rg-row--2">
                  <label className="rg-field">
                    <span>University (target)</span>
                    <div className="rg-input">
                      <FaUniversity />
                      <input
                        value={form.university}
                        onChange={(e) => update("university", e.target.value)}
                        placeholder="Rutgers University – Newark"
                      />
                    </div>
                  </label>
                  <label className="rg-field">
                    <span>City (abroad)</span>
                    <div className="rg-input">
                      <FiMapPin />
                      <input
                        value={form.targetCity}
                        onChange={(e) => update("targetCity", e.target.value)}
                        placeholder="Newark, NJ"
                      />
                    </div>
                  </label>
                </div>

                <label className="rg-field">
                  <span>Intake / Academic Year</span>
                  <div className="rg-input">
                    <FiCalendar />
                    <input
                      value={form.intake}
                      onChange={(e) => update("intake", e.target.value)}
                      placeholder="2025–26"
                    />
                  </div>
                </label>
              </>
            ) : (
              <>
                <label className="rg-field">
                  <span>Company / Agency</span>
                  <div className="rg-input">
                    <FiBriefcase />
                    <input
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      required
                      placeholder="Bridge Housing Partners"
                    />
                  </div>
                </label>

                <div className="rg-row rg-row--2">
                  <label className="rg-field">
                    <span>Business type</span>
                    <div className="rg-input">
                      <FiGlobe />
                      <input
                        value={form.businessType}
                        onChange={(e) => update("businessType", e.target.value)}
                        placeholder="Property manager / Agent / Landlord"
                      />
                    </div>
                  </label>

                  <label className="rg-field">
                    <span>Website (optional)</span>
                    <div className="rg-input">
                      <FiGlobe />
                      <input
                        value={form.website}
                        onChange={(e) => update("website", e.target.value)}
                        placeholder="https://youragency.com"
                      />
                    </div>
                  </label>
                </div>

                <label className="rg-check">
                  <input
                    type="checkbox"
                    checked={form.kycAck}
                    onChange={(e) => update("kycAck", e.target.checked)}
                  />
                  <span><FiShield /> I acknowledge we’ll complete KYC/KYB verification.</span>
                </label>
              </>
            )}

            <label className="rg-check">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => update("terms", e.target.checked)}
              />
              <span>
                I agree to the <a href="legal/terms" className="rg-link">Terms</a> and{" "}
                <a href="legal/privacy" className="rg-link">Privacy</a>.
              </span>
            </label>

            <button
              className="btn rg-submit"
              type="submit"
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
            >
              Create account <FiArrowRight />
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
