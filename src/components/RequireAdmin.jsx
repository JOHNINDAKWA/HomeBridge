import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

export default function RequireAdmin({ children }) {
  const { token, user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return null;
  if (!token || !user) return <Navigate to="/admin/login" state={{ from: loc }} replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}
