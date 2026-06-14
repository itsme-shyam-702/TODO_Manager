import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/todos" replace />;
  }

  return <Outlet />;
}
