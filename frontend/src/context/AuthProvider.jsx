import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wokeUp, setWokeUp] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const api = "http://localhost:3000"; // your backend URL
  const navigate = useNavigate();

  // check server health + fetch user
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get(`${api}/health`, { withCredentials: true });
        if (res.data.status === "ready") {
          setWokeUp(true);
        } else {
          setWokeUp(false);
        }
      } catch (error) {
        console.log("health check failed", error);
        setWokeUp(false);
      }
    };

    // poll health until backend is up
    checkHealth();
    let interval;
    if (!wokeUp) {
      interval = setInterval(checkHealth, 5000);
    }

    return () => clearInterval(interval);
  }, [wokeUp]); // <— notice: no fetchUser here
  useEffect(() => {
    if (!wokeUp) return; // only run when server is ready

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${api}/auth/user`, {
          withCredentials: true,
        });
        setUser(res.data);
        console.log("user logged in", res.data);
      } catch (error) {
        console.log("error fetching user: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [wokeUp, refresh]);

  // auth actions
  const login = async (username, password) => {
    try {
      const res = await axios.post(
        `${api}/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      navigate("/");
      setRefresh((r) => !r);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (username, password, fullname, bio, pfp) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("fullname", fullname);
      formData.append("bio", bio);
      if (pfp) formData.append("pfp", pfp);

      const res = await axios.post(`${api}/auth/register`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      navigate("/");
      setRefresh((r) => !r);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post(`${api}/auth/logout`, null, {
        withCredentials: true,
      });
      setUser(null);
      toast.success("Logout successful");
      console.log(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, wokeUp }}
    >
      {!loading && wokeUp ? children : <Loader />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
