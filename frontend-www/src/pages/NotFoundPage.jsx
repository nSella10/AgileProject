// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

const NotFoundPage = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;
