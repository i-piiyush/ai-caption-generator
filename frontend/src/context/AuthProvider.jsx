import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api"; // Import our centralized API client
import Loader from "../components/Loader"; // Your loading component

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Single loading state for simplicity
  const navigate = useNavigate();

  // This function checks for an active session when the app loads.
  const checkSession = useCallback(async () => {
    try {
      const response = await apiClient.get("/auth/user");
      setUser(response.data);
    } catch (error) {
      console.log("No active session or server is asleep.", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { username, password });
      await checkSession(); // Re-check session to get user data
      toast.success(response.data.message);
      navigate("/"); // Navigate to the main page
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await checkSession(); // Re-check session after registering
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
      setUser(null);
      toast.success("Logout successful");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  const value = { user, loading, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
