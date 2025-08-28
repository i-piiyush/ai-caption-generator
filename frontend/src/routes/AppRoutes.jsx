import React from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useAuth } from "../context/AuthProvider";
import Profile from "../components/Profile";
import ViewPost from "../components/ViewPost";
import CreatePost from "../components/CreatePost";
import Loader from "../components/Loader";

// Component to protect routes that require authentication
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Component to handle routes for users who are not logged in
const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Protected Routes (visible only when logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Profile />} />
        <Route path="/post/:id" element={<ViewPost />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Route>

      {/* Public-Only Routes (login/register) */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Route>
      
      {/* Fallback for any other route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
