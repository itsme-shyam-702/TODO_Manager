import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="container py-5 text-center">
      <h1 className="display-4 fw-bold mb-3">📋 Todo Manager</h1>
      <p className="lead text-muted mb-4">
        Organize your tasks simply and effectively.
      </p>

      {user ? (
        <Link to="/todos" className="btn btn-primary btn-lg">
          Go to My Todos
        </Link>
      ) : (
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
          <Link to="/login"    className="btn btn-outline-secondary btn-lg">Sign In</Link>
        </div>
      )}

      {/* Features */}
      <div className="row mt-5 g-4">
        {[
          { icon: "✅", title: "Track Tasks", desc: "Create, update and complete todos." },
          { icon: "🔒", title: "Secure Auth",  desc: "JWT-based login with role access." },
          { icon: "☁️", title: "Attachments", desc: "Upload files via Cloudinary." },
        ].map((feature) => (
          <div key={feature.title} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="fs-1 mb-2">{feature.icon}</div>
                <h5 className="card-title">{feature.title}</h5>
                <p className="card-text text-muted">{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
