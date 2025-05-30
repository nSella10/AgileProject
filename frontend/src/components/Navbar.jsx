// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setCredentials } from "../slices/authSlice";
import { useLogoutMutation, useProfileQuery } from "../slices/usersApiSlice";
import { useMyGamesQuery } from "../slices/gamesApiSlice";
import { apiSlice } from "../slices/apiSlice";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaPlus,
  FaGamepad,
  FaChartLine,
  FaUser,
  FaUsers,
  FaSignOutAlt,
  FaUserPlus,
  FaSignInAlt,
  FaNewspaper,
  FaTachometerAlt,
  FaEnvelope,
  FaInfoCircle,
  FaList,
  FaGraduationCap,
  FaMusic,
  FaMicrophone,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();

  // Fetch user profile to get updated info including isMusicTeacher
  const { data: profileData, refetch: refetchProfile } = useProfileQuery(
    undefined,
    {
      skip: !userInfo, // Skip if user is not logged in
    }
  );

  // Fetch user's games for stats
  const { data: myGames = [] } = useMyGamesQuery(undefined, {
    skip: !userInfo, // Skip if user is not logged in
  });

  // Update user info when profile data changes
  useEffect(() => {
    if (profileData && userInfo) {
      console.log("Profile data received:", profileData);
      console.log("Current userInfo:", userInfo);
      dispatch(setCredentials(profileData));
    }
  }, [profileData, userInfo, dispatch]);

  // Force refresh profile when component mounts
  useEffect(() => {
    if (userInfo && refetchProfile) {
      console.log("Force refreshing profile for user:", userInfo.email);
      refetchProfile();
    }
  }, [userInfo?.email, refetchProfile]);

  // Debug: Log current user info
  useEffect(() => {
    console.log("Current userInfo in Navbar:", userInfo);
    console.log("Is music teacher?", userInfo?.isMusicTeacher);
    console.log("Profile data:", profileData);
  }, [userInfo, profileData]);

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

  // Handle auth required navigation
  const handleAuthRequired = (path, label) => {
    navigate("/login", {
      state: {
        from: path,
        message: `Please log in to access ${label}`,
        redirectAfterLogin: path,
      },
    });
  };

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/create", label: "Create", icon: FaPlus },
    { path: "/mygames", label: "My Games", icon: FaList },
    { path: "/analytics", label: "Analytics", icon: FaChartLine },
  ];

  // Join items (separate for better organization)
  const joinItems = [
    { path: "/join", label: "Join Game", icon: FaGamepad },
    { path: "/join-lesson", label: "Join Lesson", icon: FaMicrophone },
  ];

  // Additional navigation items for music teachers
  // Temporary fix: Check email directly for known teachers
  const isKnownTeacher =
    userInfo &&
    (userInfo.email === "omripeer12@gmail.com" ||
      userInfo.email === "nharell@email.com");

  const teacherNavItems =
    userInfo?.isMusicTeacher || isKnownTeacher
      ? [
          {
            path: "/teacher-dashboard",
            label: "Teaching",
            icon: FaGraduationCap,
          },
        ]
      : [];

  // Navigation items for non-authenticated users
  const publicNavItems = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/join", label: "Join Game", icon: FaGamepad },
    { path: "/join-lesson", label: "Join Lesson", icon: FaMicrophone },
  ];

  // Items that require authentication (will redirect to login)
  const authRequiredItems = [
    { path: "/create", label: "Create Game", icon: FaPlus },
    { path: "/mygames", label: "My Games", icon: FaList },
    { path: "/analytics", label: "Analytics", icon: FaChartLine },
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
            className="flex items-center space-x-2 group"
          >
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-indigo-700 transition-all duration-300">
              🎵 Guessify!
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Regular navigation items */}
            {(userInfo
              ? [...authenticatedNavItems, ...teacherNavItems]
              : publicNavItems
            ).map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
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

            {/* Auth required items for non-authenticated users */}
            {!userInfo &&
              authRequiredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleAuthRequired(item.path, item.label)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-300"
                  >
                    <Icon className="text-sm text-purple-600" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}

            {/* Join Dropdown for authenticated users */}
            {userInfo && (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-300">
                  <FaGamepad className="text-sm text-purple-600" />
                  <span className="text-sm">Join</span>
                  <FaChevronDown className="text-xs" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {joinItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 first:rounded-t-xl last:rounded-b-xl transition-all duration-200"
                      >
                        <Icon className="text-sm text-purple-600" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {userInfo ? (
              <>
                {/* Quick Stats */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-1">
                    <FaGamepad className="text-blue-600 text-sm" />
                    <span className="text-sm font-medium text-gray-700">
                      {myGames.length}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center space-x-1">
                    <FaUsers className="text-green-600 text-sm" />
                    <span className="text-sm font-medium text-gray-700">
                      {myGames.reduce(
                        (sum, game) => sum + (game.playersCount || 0),
                        0
                      )}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-xl border border-purple-200">
                  <FaUser className="text-purple-600 text-sm" />
                  <span className="text-purple-700 font-medium text-sm">
                    Hi, {userInfo.firstName}
                    {(userInfo.isMusicTeacher || isKnownTeacher) && (
                      <span className="ml-2 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full">
                        🎼 Teacher
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => refetchProfile()}
                    className="ml-2 text-xs text-purple-600 hover:text-purple-800"
                    title="Refresh profile"
                  >
                    🔄
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logoutHandler}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Sign Up Button */}
                <Link to="/register">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <FaUserPlus className="text-sm" />
                    <span className="text-sm">Sign up FREE</span>
                  </button>
                </Link>

                {/* Login Button */}
                <Link to="/login">
                  <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                    <FaSignInAlt className="text-sm" />
                    <span className="text-sm">Log in</span>
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
                <div className="flex items-center space-x-3">
                  <FaUser className="text-purple-600" />
                  <div className="flex flex-col">
                    <span className="text-purple-700 font-medium">
                      Hi, {userInfo.firstName}!
                    </span>
                    {(userInfo.isMusicTeacher || isKnownTeacher) && (
                      <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full mt-1 self-start">
                        🎼 Music Teacher
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links - Mobile */}
            <nav className="space-y-2 mb-6">
              {/* Regular navigation items */}
              {(userInfo
                ? [...authenticatedNavItems, ...teacherNavItems]
                : publicNavItems
              ).map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
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
              })}

              {/* Auth required items for non-authenticated users - Mobile */}
              {!userInfo &&
                authRequiredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        handleAuthRequired(item.path, item.label);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 py-3 px-4 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-300"
                    >
                      <Icon className="text-purple-600" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

              {/* Join Items - Mobile */}
              {userInfo && (
                <>
                  <div className="border-t border-gray-200 pt-2 mt-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
                      Join Activities
                    </div>
                    {joinItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
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
                    })}
                  </div>
                </>
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
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <Link to="/register">
                    <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg">
                      <FaUserPlus />
                      <span>Sign up FREE</span>
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="w-full flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-700 font-medium py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                      <FaSignInAlt />
                      <span>Log in</span>
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
