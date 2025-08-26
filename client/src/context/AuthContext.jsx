// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("adminUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const user = response.data.user;
      setCurrentUser(user);
      localStorage.setItem("adminUser", JSON.stringify(user));
      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.error || "Login failed";
      toast.error(errMsg);
      return {
        success: false,
        message: errMsg,
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.get("/auth/logout"); // 👈 Backend call to clear cookie
      setCurrentUser(null);
      localStorage.removeItem("adminUser");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
