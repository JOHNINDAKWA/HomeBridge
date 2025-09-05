import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** Point this to your backend (Vite env or fallback) */
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:4000";

/** LocalStorage keys (namespace to avoid collisions) */
const LS = {
  token: "hb:token",
  user: "hb:user",
  profile: "student:profile",
  documents: "student:documents",
  role: "auth:role",       // legacy from older UI; we clear it on logout
  userLegacy: "auth:user", // legacy seed; we clear it on logout
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(LS.token) || "");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS.user) || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Student “profile” + “documents” (client-only helpers for student dashboard)
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS.profile) || "null") || {}; } catch { return {}; }
  });
  const [documents, setDocuments] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS.documents) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(LS.profile, JSON.stringify(profile || {})); }, [profile]);
  useEffect(() => { localStorage.setItem(LS.documents, JSON.stringify(documents || [])); }, [documents]);

  /** Small helper that always sends Authorization when token is present */
// in AuthContext.jsx
const api = useCallback(async (path, { method = "GET", headers = {}, body } = {}) => {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    let msg = "Request failed";
    try { const data = await res.json(); msg = data?.error || data?.message || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}, [token]);



  /** One true source of role → default route (and “from path” honor if allowed) */
  const routeForRole = useCallback((role, fromPath = "") => {
    const upper = String(role || "").toUpperCase();
    const base = upper === "ADMIN" ? "/admin"
               : upper === "AGENT" ? "/dashboard/agent"
               : "/dashboard/student";
    const home = upper === "ADMIN" ? "/admin"
               : upper === "AGENT" ? "/dashboard/agent/overview"
               : "/dashboard/student";
    if (fromPath && fromPath.startsWith(base)) return fromPath;
    return home;
  }, []);

  /** Hydrate current user on refresh when token exists */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!token) { setLoading(false); return; }
        const data = await api("/api/auth/me");
        if (!active) return;
        setUser(data?.user || null);

        // prime profile email for student UI if empty
        if (data?.user?.email && !profile?.email) {
          setProfile((p) => ({ ...p, email: data.user.email, fullName: p.fullName || data.user.name || "" }));
        }
      } catch {
        setToken("");
        localStorage.removeItem(LS.token);
        localStorage.removeItem(LS.user);
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

 
// NEW: register() – mirrors login()
const register = useCallback(async ({ name, email, password, role = "STUDENT" }) => {
  const data = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  }).then(async (r) => {
    if (!r.ok) {
      let msg = "Registration failed";
      try { const j = await r.json(); msg = j?.error || j?.message || msg; } catch {}
      throw new Error(msg);
    }
    return r.json();
  });

  const tok = data?.token || "";
  const usr = data?.user || null;

  setToken(tok);
  setUser(usr);
  localStorage.setItem(LS.token, tok);
  localStorage.setItem(LS.user, JSON.stringify(usr));
  localStorage.removeItem(LS.role);
  localStorage.removeItem(LS.userLegacy);

  return { user: usr, token: tok };
}, []);


  /** LOGIN — POST /api/auth/login */
  const login = useCallback(async (email, password, fromPath = "") => {
    const r = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      let msg = "Login failed";
      try { const j = await r.json(); msg = j?.error || j?.message || msg; } catch {}
      throw new Error(msg);
    }
    const data = await r.json();

    const tok = data?.token || "";
    const usr = data?.user || null;

    setToken(tok);
    setUser(usr);
    localStorage.setItem(LS.token, tok);
    localStorage.setItem(LS.user, JSON.stringify(usr));
    localStorage.removeItem(LS.role);
    localStorage.removeItem(LS.userLegacy);

    const redirect = routeForRole(usr?.role, fromPath);
    return { user: usr, token: tok, redirect };
  }, [routeForRole]);

  /** LOGOUT — clears local session */
  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    localStorage.removeItem(LS.token);
    localStorage.removeItem(LS.user);
    // (optional) keep student profile/docs; uncomment to wipe:
    // localStorage.removeItem(LS.profile);
    // localStorage.removeItem(LS.documents);
    localStorage.removeItem(LS.role);
    localStorage.removeItem(LS.userLegacy);
  }, []);

const value = useMemo(() => ({
  API_URL, token, user, loading,
  login, register, logout, routeForRole,   // ← added register
  profile, setProfile,
  documents, setDocuments,
  api,
}), [API_URL, token, user, loading, login, register, logout, routeForRole, profile, documents, api]);


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
