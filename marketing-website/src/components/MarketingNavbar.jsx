// Marketing Website Navbar - Only Create and Play buttons
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaGamepad,
  FaNewspaper,
  FaEnvelope,
  FaInfoCircle,
  FaSignInAlt,
} from "react-icons/fa";
import LanguageToggle from "./LanguageToggle";
import { getRoute } from "../utils/routes";

const MarketingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "he";

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

  // Navigation items for marketing website
  const marketingNavItems = [
    {
      path: getRoute("home", i18n.language),
      label: t("navbar.home"),
      icon: FaHome,
    },
    {
      path: getRoute("about", i18n.language),
      label: t("navbar.about"),
      icon: FaInfoCircle,
    },
    {
      path: getRoute("pricing", i18n.language),
      label: t("navbar.pricing"),
      icon: FaNewspaper,
    },
    {
      path: getRoute("contact", i18n.language),
      label: t("navbar.contact"),
      icon: FaEnvelope,
    },
  ];

  // Check if current path is active
  const isActivePath = (path) => location.pathname === path;

  // Handle Create button click - redirect to create app
  const handleCreateClick = () => {
    // In development: redirect to localhost:3001
    // In production: redirect to create.guessifyapp.com
    const createAppUrl =
      process.env.NODE_ENV === "production"
        ? "https://create.guessifyapp.com"
        : "http://localhost:3001";
    const langParam = i18n.language === "he" ? "?lang=he" : "?lang=eng";
    window.location.href = createAppUrl + langParam;
  };

  // Handle Play button click - redirect to play app
  const handlePlayClick = () => {
    // In development: redirect to localhost:3002
    // In production: redirect to play.guessifyapp.com
    const playAppUrl =
      process.env.NODE_ENV === "production"
        ? "https://play.guessifyapp.com"
        : "http://localhost:3002";
    window.location.href = playAppUrl;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200"
          : "bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-100"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center group ${
              isRTL ? "space-x-reverse space-x-3" : "space-x-2"
            }`}
          >
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-indigo-700 transition-all duration-300">
              🎵 Guessify!
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className={`hidden lg:flex items-center ${
              isRTL ? "space-x-reverse space-x-1" : "space-x-1"
            }`}
          >
            {marketingNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                  } ${
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

          {/* Desktop Action Buttons */}
          <div
            className={`hidden lg:flex items-center ${
              isRTL ? "space-x-reverse space-x-3" : "space-x-3"
            }`}
          >
            {/* Language Toggle */}
            <LanguageToggle />

            {/* Create Button */}
            <button
              onClick={handleCreateClick}
              className={`flex items-center ${
                isRTL ? "space-x-reverse space-x-3" : "space-x-2"
              } bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                isRTL ? "" : "transform hover:scale-105"
              }`}
            >
              <FaSignInAlt className="text-sm" />
              <span className="text-sm">{t("navbar.login")}</span>
            </button>

            {/* Play Button */}
            <button
              onClick={handlePlayClick}
              className={`flex items-center ${
                isRTL ? "space-x-reverse space-x-2" : "space-x-2"
              } bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                isRTL ? "" : "transform hover:scale-105"
              }`}
            >
              <FaGamepad className="text-sm" />
              <span className="text-sm">{t("navbar.play")}</span>
            </button>
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
            {/* Navigation Links - Mobile */}
            <nav className="space-y-2 mb-6">
              {marketingNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      isRTL ? "space-x-reverse space-x-4" : "space-x-3"
                    } ${
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
            </nav>

            {/* Action Buttons - Mobile */}
            <div className="space-y-3">
              {/* Language Toggle - Mobile */}
              <div className="flex justify-center">
                <LanguageToggle />
              </div>

              <button
                onClick={handleCreateClick}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                  isRTL ? "space-x-reverse space-x-3" : "space-x-2"
                } bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white`}
              >
                <FaSignInAlt />
                <span>{t("navbar.login")}</span>
              </button>

              <button
                onClick={handlePlayClick}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                  isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                } bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white`}
              >
                <FaGamepad />
                <span>{t("navbar.play")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingNavbar;
