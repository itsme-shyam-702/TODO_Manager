import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
  const [formData,  setFormData]  = useState({ name: "", email: "", password: "" });
  const [errorMsg,  setErrorMsg]  = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      const { data } = await axiosClient.post("/auth/register", formData);
      setAuth(data.user, data.token);
      navigate("/todos");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h2 className="mb-4 fw-bold">Create Account</h2>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
            minLength={6}
            required
          />
        </div>
        <button className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? "Creating account…" : "Register"}
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
