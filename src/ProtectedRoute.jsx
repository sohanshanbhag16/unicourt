import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  // ⛔ wait until auth finishes loading
  if (authLoading) return null; // or spinner

  // ⛔ if not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // ✅ allow access
  return children;
}
