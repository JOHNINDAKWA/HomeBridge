import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

/**
 * FRONTEND-ONLY guard for admin area.
 * Passes if:
 *  - context.user?.role === 'admin' | 'superadmin', OR
 *  - localStorage.getItem('auth:role') === 'admin' | 'superadmin'
 */
export default function RequireAdmin({ children }) {
  const { user } = useAuth?.() || {};
  const loc = useLocation();

  const role =
    user?.role ||
    (typeof window !== "undefined" ? localStorage.getItem("auth:role") : null);

  const ok = role === "admin" || role === "superadmin";
  if (!ok) {
    return <Navigate to="/admin/login" replace state={{ from: loc, reason: "admin_only" }} />;
  }
  return children;
}
