import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary px-3">
      <Link className="navbar-brand fw-bold" to="/">📋 TodoApp</Link>

      <div className="ms-auto d-flex align-items-center gap-3">
        {user ? (
          <>
            <Link className="text-white text-decoration-none" to="/todos">Todos</Link>
            <Link className="text-white text-decoration-none" to="/account">Account</Link>
            <Link className="text-white text-decoration-none" to="/chat">AI Chat</Link>
            {user.role === "admin" && (
              <Link className="text-warning text-decoration-none" to="/admin">Admin</Link>
            )}
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link className="text-white text-decoration-none" to="/login">Login</Link>
            <Link className="btn btn-light btn-sm" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
