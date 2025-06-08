// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLayout from "../components/PageLayout";

const NotFoundPage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const content = (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to={userInfo ? "/dashboard" : "/"}
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {userInfo ? "Back to Dashboard" : "Back to Login"}
      </Link>
    </div>
  );

  return userInfo ? (
    <PageLayout>{content}</PageLayout>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
      {content}
    </div>
  );
};

export default NotFoundPage;
