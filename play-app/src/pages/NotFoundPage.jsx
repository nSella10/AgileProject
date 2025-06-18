// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-lg text-purple-200 mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
        >
          Back to Join Game
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
