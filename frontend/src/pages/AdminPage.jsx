import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/admin/users");
      return data.users;
    },
  });
}

function useAdminTodos() {
  return useQuery({
    queryKey: ["admin-todos"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/admin/todos");
      return data.todos;
    },
  });
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const queryClient = useQueryClient();

  const { data: users, isLoading: loadingUsers } = useAdminUsers();
  const { data: todos, isLoading: loadingTodos } = useAdminTodos();

  const { mutate: deleteUser } = useMutation({
    mutationFn: (userId) => axiosClient.delete(`/admin/users/${userId}`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  function confirmDelete(userId, userName) {
    if (window.confirm(`Delete ${userName} and all their todos?`)) {
      deleteUser(userId);
    }
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">👑 Admin Dashboard</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users ({users?.length ?? "…"})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "todos" ? "active" : ""}`}
            onClick={() => setActiveTab("todos")}
          >
            All Todos ({todos?.length ?? "…"})
          </button>
        </li>
      </ul>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          {loadingUsers && <p>Loading…</p>}
          <table className="table table-hover">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "bg-danger" : "bg-primary"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== "admin" && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => confirmDelete(u._id, u.name)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Todos Tab */}
      {activeTab === "todos" && (
        <div>
          {loadingTodos && <p>Loading…</p>}
          <table className="table table-hover">
            <thead>
              <tr><th>Title</th><th>Owner</th><th>Priority</th><th>Done</th></tr>
            </thead>
            <tbody>
              {todos?.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.owner?.name ?? "—"}</td>
                  <td><span className="badge bg-secondary">{t.priority}</span></td>
                  <td>{t.isCompleted ? "✅" : "🔲"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
