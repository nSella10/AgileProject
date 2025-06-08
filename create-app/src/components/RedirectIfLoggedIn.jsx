// src/components/RedirectIfLoggedIn.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RedirectIfLoggedIn = ({ redirectTo = "/dashboard" }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export default RedirectIfLoggedIn;
