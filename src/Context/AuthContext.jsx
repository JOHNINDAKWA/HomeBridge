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

const login = async (email, password, role = "student") => {
  // FRONTEND-ONLY MOCK: Replace with real API later
  const mockUser = { id: "u_" + Date.now(), role, email };
  setUser(mockUser);
  return mockUser;
};
  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout, profile, setProfile, documents, setDocuments }), [user, profile, documents]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){ const v = useContext(AuthContext); if(!v) throw new Error("useAuth outside provider"); return v; }
