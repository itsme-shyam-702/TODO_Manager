import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const [formData,   setFormData]   = useState({ email: "", password: "" });
  const [errorMsg,   setErrorMsg]   = useState("");
  const [isLoading,  setIsLoading]  = useState(false);

  const navigate    = useNavigate();
  const { setAuth } = useAuthStore();

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axiosClient.post("/auth/login", formData);
      setAuth(data.user, data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/todos");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h2 className="mb-4 fw-bold">Sign In</h2>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-3 text-center">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
