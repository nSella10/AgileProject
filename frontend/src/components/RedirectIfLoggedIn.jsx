// src/components/RedirectIfLoggedIn.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RedirectIfLoggedIn = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default RedirectIfLoggedIn;
