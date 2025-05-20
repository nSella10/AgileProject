// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { apiSlice } from "../slices/apiSlice";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinkClass = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
      : "hover:text-blue-600";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Guessify!
          </Link>

          {userInfo && (
            <span className="md:hidden text-blue-600 font-medium text-sm">
              Hi, {userInfo.firstName}
            </span>
          )}

          <button className="hidden md:flex bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
            News{" "}
            <span className="ml-1 text-xs bg-red-500 px-2 py-0.5 rounded-full">
              3
            </span>
          </button>
        </div>

        {/* Hamburger button (mobile only) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Right side (desktop) */}
        <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-700">
          <nav className="flex space-x-4">
            {!userInfo && (
              <Link to="/" className={navLinkClass("/")}>
                Home
              </Link>
            )}
            {userInfo && (
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>
            )}
            <Link to="/create" className={navLinkClass("/create")}>
              Create
            </Link>
            <Link to="/mygames" className={navLinkClass("/mygames")}>
              My Games
            </Link>
          </nav>

          <Link to="/join">
            <button className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
              Join a game
            </button>
          </Link>

          {userInfo ? (
            <>
              <span className="text-blue-600 font-semibold">
                Hi, {userInfo.firstName}
              </span>
              <button
                onClick={logoutHandler}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register">
                <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  Sign up FREE
                </button>
              </Link>
              <Link to="/login">Log in</Link>
            </>
          )}

          <button className="border px-2 py-1 rounded-full">🌐 EN</button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium text-gray-700">
          <nav className="flex flex-col space-y-1">
            {!userInfo && (
              <Link to="/" className={navLinkClass("/")}>
                Home
              </Link>
            )}
            {userInfo && (
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>
            )}
            <Link to="/create" className={navLinkClass("/create")}>
              Create
            </Link>
            <Link to="/mygames" className={navLinkClass("/mygames")}>
              My Games
            </Link>
          </nav>

          <Link to="/join">
            <button className="w-full border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
              Join a game
            </button>
          </Link>

          {userInfo ? (
            <button
              onClick={logoutHandler}
              className="w-full bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/register">
                <button className="w-full bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  Sign up FREE
                </button>
              </Link>
              <Link to="/login">Log in</Link>
            </>
          )}

          <button className="w-full border px-2 py-1 rounded-full">
            🌐 EN
          </button>
        </div>
      )}
    </header>
  );
};
export default Navbar;
