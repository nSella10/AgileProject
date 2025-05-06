import React from "react";
import PageLayout from "../components/PageLayout";
import { Link } from "react-router-dom";
import { FaPlus, FaChartLine, FaGamepad } from "react-icons/fa";

const DashboardPage = () => {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-purple-700 to-purple-900 py-10 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-md md:text-lg text-purple-200">
            Manage your games, track performance, and create something awesome.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/create"
          className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col items-start"
        >
          <FaPlus className="text-purple-600 text-2xl mb-3" />
          <h2 className="font-semibold text-lg mb-1">Create a new game</h2>
          <p className="text-sm text-gray-600">
            Start a new music quiz for your friends or students.
          </p>
        </Link>

        <Link
          to="/my-games"
          className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col items-start"
        >
          <FaGamepad className="text-purple-600 text-2xl mb-3" />
          <h2 className="font-semibold text-lg mb-1">Your existing games</h2>
          <p className="text-sm text-gray-600">
            View and manage your previously created games.
          </p>
        </Link>

        <Link
          to="/analytics"
          className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col items-start"
        >
          <FaChartLine className="text-purple-600 text-2xl mb-3" />
          <h2 className="font-semibold text-lg mb-1">Performance analytics</h2>
          <p className="text-sm text-gray-600">
            Track scores, participation, and engagement.
          </p>
        </Link>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
