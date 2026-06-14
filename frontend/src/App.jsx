// frontend/src/App.jsx — COMPLETE FILE with ChatPage added

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodosPage from "./pages/TodosPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import ChatPage from "./pages/ChatPage";          // ← ADD THIS
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/"         element={<HomePage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/todos"   element={<TodosPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/chat"    element={<ChatPage />} />   {/* ← ADD THIS */}
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </>
  );
}
