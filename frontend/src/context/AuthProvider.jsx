import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../services/api";
import Loader from "../components/Loader";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkSession = useCallback(async () => {
    try {
      const response = await apiClient.get("/auth/user");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      if (loading) setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      await apiClient.post("/auth/login", { username, password });
      await checkSession();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      await apiClient.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await checkSession();
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
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, checkSession }),
    [user, loading, checkSession]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
