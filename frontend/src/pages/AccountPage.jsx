import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuthStore } from "../store/authStore";

export default function AccountPage() {
  const { user, updateUser, logout } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [successMsg,   setSuccessMsg]   = useState("");

  async function handleAvatarUpload(e) {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    setUploading(true);
    try {
      const { data } = await axiosClient.patch("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ avatarUrl: data.user.avatarUrl });
      setSuccessMsg("Avatar updated!");
    } catch {
      setSuccessMsg("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 500 }}>
      <h2 className="fw-bold mb-4">My Account</h2>

      {/* Avatar */}
      <div className="text-center mb-4">
        <img
          src={user?.avatarUrl || "https://ui-avatars.com/api/?name=" + user?.name}
          alt="avatar"
          className="rounded-circle"
          width={90}
          height={90}
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* User info */}
      <div className="card mb-4">
        <div className="card-body">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong>
            <span className={`badge ms-2 ${user?.role === "admin" ? "bg-danger" : "bg-primary"}`}>
              {user?.role}
            </span>
          </p>
        </div>
      </div>

      {/* Upload avatar */}
      <form onSubmit={handleAvatarUpload}>
        <div className="mb-3">
          <label className="form-label">Change Avatar</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </div>
        {successMsg && <p className="text-success">{successMsg}</p>}
        <button className="btn btn-primary" disabled={uploading || !selectedFile}>
          {uploading ? "Uploading…" : "Upload Avatar"}
        </button>
      </form>

      <hr className="my-4" />
      <button className="btn btn-outline-danger w-100" onClick={logout}>
        Sign Out
      </button>
    </div>
  );
}
