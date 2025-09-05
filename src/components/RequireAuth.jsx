import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { token, user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return null; // or a spinner
  if (!token || !user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
