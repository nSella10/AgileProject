// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { apiSlice } from "../slices/apiSlice";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaPlus,
  FaGamepad,
  FaChartLine,
  FaUser,
  FaSignOutAlt,
  FaUserPlus,
  FaSignInAlt,
  FaNewspaper,
  FaTachometerAlt,
  FaEnvelope,
  FaInfoCircle,
  FaList,
} from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  const [logoutApiCall] = useLogoutMutation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { path: "/create", label: t("navbar.create"), icon: FaPlus },
    { path: "/mygames", label: t("navbar.my_games"), icon: FaList },
    { path: "/dashboard", label: t("navbar.dashboard"), icon: FaTachometerAlt },
    { path: "/analytics", label: t("navbar.analytics"), icon: FaChartLine },
  ];

  // Navigation items for non-authenticated users
  const publicNavItems = [
    { path: "/", label: t("navbar.home"), icon: FaHome },
    { path: "/about", label: t("navbar.about"), icon: FaInfoCircle },
    { path: "/contact", label: t("navbar.contact"), icon: FaEnvelope },
    { path: "/join", label: t("navbar.join_game"), icon: FaGamepad },
  ];

  // Check if current path is active
  const isActivePath = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200"
          : "bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to={userInfo ? "/dashboard" : "/"}
            className={`flex items-center group ${
              isRTL ? "space-x-reverse space-x-3" : "space-x-2"
            }`}
          >
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-indigo-700 transition-all duration-300">
              🎵 Guessify!
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {(userInfo ? authenticatedNavItems : publicNavItems).map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center ${
                    isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                  } px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700"
                  }`}
                >
                  <Icon
                    className={`text-sm ${
                      isActive ? "text-white" : "text-purple-600"
                    }`}
                  />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* News Button - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/blog">
              <button
                className={`bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center ${
                  isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                } shadow-lg hover:shadow-xl ${
                  isRTL ? "" : "transform hover:scale-105"
                }`}
              >
                <FaNewspaper className="text-sm" />
                <span className="text-sm">{t("navbar.news")}</span>
                <span className="bg-red-500 text-xs px-2 py-1 rounded-full animate-pulse">
                  3
                </span>
              </button>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {userInfo ? (
              <>
                {/* User Info */}
                <div
                  className={`flex items-center ${
                    isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                  } bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-xl border border-purple-200`}
                >
                  <FaUser className="text-purple-600 text-sm" />
                  <span className="text-purple-700 font-medium text-sm">
                    {t("navbar.hi_user", { name: userInfo.firstName })}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logoutHandler}
                  className={`flex items-center ${
                    isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                  } bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isRTL ? "" : "transform hover:scale-105"
                  }`}
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="text-sm">{t("navbar.logout")}</span>
                </button>
              </>
            ) : (
              <>
                {/* Sign Up Button */}
                <Link to="/register">
                  <button
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                    } bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isRTL ? "" : "transform hover:scale-105"
                    }`}
                  >
                    <FaUserPlus className="text-sm" />
                    <span className="text-sm">{t("navbar.sign_up_free")}</span>
                  </button>
                </Link>

                {/* Login Button */}
                <Link to="/login">
                  <button
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                    } text-purple-600 hover:text-purple-700 font-medium px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300`}
                  >
                    <FaSignInAlt className="text-sm" />
                    <span className="text-sm">{t("navbar.log_in")}</span>
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* User Info - Mobile */}
            {userInfo && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div
                  className={`flex items-center ${
                    isRTL ? "space-x-reverse space-x-4" : "space-x-3"
                  }`}
                >
                  <FaUser className="text-purple-600" />
                  <span className="text-purple-700 font-medium">
                    {t("navbar.hi_user", { name: userInfo.firstName })}!
                  </span>
                </div>
              </div>
            )}

            {/* News Button - Mobile */}
            <Link to="/blog" className="block mb-4">
              <button
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
                  isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                } shadow-lg`}
              >
                <FaNewspaper />
                <span>{t("navbar.news")}</span>
                <span className="bg-red-500 text-xs px-2 py-1 rounded-full animate-pulse">
                  3
                </span>
              </button>
            </Link>

            {/* Navigation Links - Mobile */}
            <nav className="space-y-2 mb-6">
              {(userInfo ? authenticatedNavItems : publicNavItems).map(
                (item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center ${
                        isRTL ? "space-x-reverse space-x-4" : "space-x-3"
                      } py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700"
                      }`}
                    >
                      <Icon
                        className={`${
                          isActive ? "text-white" : "text-purple-600"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                }
              )}
            </nav>

            {/* Action Buttons - Mobile */}
            <div className="space-y-3">
              {userInfo ? (
                <button
                  onClick={() => {
                    logoutHandler();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center ${
                    isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                  } bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg`}
                >
                  <FaSignOutAlt />
                  <span>{t("navbar.logout")}</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <Link to="/register">
                    <button
                      className={`w-full flex items-center justify-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                      } bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg`}
                    >
                      <FaUserPlus />
                      <span>{t("navbar.sign_up_free")}</span>
                    </button>
                  </Link>
                  <Link to="/login">
                    <button
                      className={`w-full flex items-center justify-center ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                      } text-purple-600 hover:text-purple-700 font-medium py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300`}
                    >
                      <FaSignInAlt />
                      <span>{t("navbar.log_in")}</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
