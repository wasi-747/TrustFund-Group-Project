import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      // Check if the token has the role 'admin'
      if (decoded.user && decoded.user.role === "admin") {
        isAdmin = true;
      }
    } catch (e) {
      console.error("Token invalid");
    }
  }

  // If verified admin, show content. Otherwise, redirect to dashboard.
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
