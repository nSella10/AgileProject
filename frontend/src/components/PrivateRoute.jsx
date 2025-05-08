// src/components/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{
        fromCreate: location.pathname === "/create",
      }}
      replace
    />
  );
};

export default PrivateRoute;
