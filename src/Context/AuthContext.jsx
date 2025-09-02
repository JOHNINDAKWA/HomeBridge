import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("auth:user")) || null; } catch { return null; }
  });
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("auth:profile")) || {}; } catch { return {}; }
  });
  const [documents, setDocuments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("auth:documents")) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("auth:user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("auth:profile", JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem("auth:documents", JSON.stringify(documents)); }, [documents]);

  const login = async (email, password) => {
    // mock user until backend is ready
    const mock = { id: "u_1", email, role: "student" };
    setUser(mock);
    return mock;
  };
  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout, profile, setProfile, documents, setDocuments }), [user, profile, documents]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){ const v = useContext(AuthContext); if(!v) throw new Error("useAuth outside provider"); return v; }
