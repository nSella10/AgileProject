import React from "react";
import PageLayout from "../components/PageLayout";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaChartLine,
  FaGamepad,
  FaUsers,
  FaMusic,
  FaTrophy,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

const DashboardPage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 py-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="mb-6">
              <span className="text-6xl">🎵</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Welcome to Your Music Studio
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Create amazing music games, track performance, and bring people
              together through the power of music
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FaStar className="text-yellow-300" />
                <span className="text-sm font-medium">Premium Experience</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FaUsers className="text-blue-300" />
                <span className="text-sm font-medium">Multiplayer Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <FaMusic className="text-green-300" />
                <span className="text-sm font-medium">Unlimited Songs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Games
                  </p>
                  <p className="text-3xl font-bold text-gray-800">12</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-2xl">
                  <FaGamepad className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Players Reached
                  </p>
                  <p className="text-3xl font-bold text-gray-800">248</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Success Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-800">94%</p>
                </div>
                <div className="bg-green-100 p-3 rounded-2xl">
                  <FaTrophy className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What would you like to do today?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Create Game Card */}
            <Link
              to="/create"
              className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl w-fit mb-6">
                  <FaPlus className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Create New Game
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Start a new music quiz adventure. Add your favorite songs and
                  challenge your friends!
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                  <span>Get Started</span>
                  <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* My Games Card */}
            <Link
              to="/mygames"
              className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-2xl w-fit mb-6">
                  <FaGamepad className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  My Games
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Manage your existing games, edit details, and launch exciting
                  music sessions.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>View Games</span>
                  <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Analytics Card */}
            <Link
              to="/analytics"
              className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl w-fit mb-6">
                  <FaChartLine className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Analytics
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Track performance, analyze player engagement, and optimize
                  your games.
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                  <span>View Analytics</span>
                  <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
