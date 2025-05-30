import React from "react";
import PageLayout from "../components/PageLayout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMyGamesQuery } from "../slices/gamesApiSlice";
import {
  FaPlus,
  FaChartLine,
  FaGamepad,
  FaUsers,
  FaMusic,
  FaTrophy,
  FaArrowRight,
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";

const DashboardPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: myGames = [], isLoading: gamesLoading } = useMyGamesQuery();

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate real statistics
  const totalGames = myGames.length;
  const totalPlayers = myGames.reduce(
    (sum, game) => sum + (game.playersCount || 0),
    0
  );
  const avgScore =
    myGames.length > 0
      ? Math.round(
          myGames.reduce((sum, game) => sum + (game.avgScore || 0), 0) /
            myGames.length
        )
      : 0;
  const activeToday = myGames.filter((game) => {
    const today = new Date().toDateString();
    const gameDate = new Date(game.lastPlayed || game.createdAt).toDateString();
    return gameDate === today;
  }).length;

  return (
    <PageLayout>
      {/* Dashboard Container */}
      <div className="min-h-screen bg-gray-50">
        {/* Personal Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUserCircle className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {userInfo?.firstName || "User"}! 👋
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{currentDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-gray-400" />
                      <span>{currentTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-3">
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-green-800 text-sm font-medium">
                    ● Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">My Games</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {gamesLoading ? "..." : totalGames}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Total created</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <FaGamepad className="text-blue-600 text-lg" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Players
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {gamesLoading ? "..." : totalPlayers}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">All time</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <FaUsers className="text-green-600 text-lg" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {gamesLoading
                      ? "..."
                      : avgScore > 0
                      ? `${avgScore}%`
                      : "N/A"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Across all games</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <FaTrophy className="text-yellow-600 text-lg" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Active Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {gamesLoading ? "..." : activeToday}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">Games played</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <FaMusic className="text-purple-600 text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create Game Card */}
            <Link
              to="/create"
              className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaPlus className="text-blue-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Create New Game
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Start a new music quiz
                  </p>
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>

            {/* My Games Card */}
            <Link
              to="/mygames"
              className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaGamepad className="text-green-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    My Games
                  </h3>
                  <p className="text-gray-600 text-sm">Manage existing games</p>
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </Link>

            {/* Analytics Card */}
            <Link
              to="/analytics"
              className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaChartLine className="text-purple-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Analytics
                  </h3>
                  <p className="text-gray-600 text-sm">View performance data</p>
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Activity
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                {gamesLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading recent activity...</p>
                  </div>
                ) : myGames.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Create your first game to see activity here
                    </p>
                  </div>
                ) : (
                  myGames.slice(0, 3).map((game, index) => (
                    <div
                      key={game._id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="bg-green-100 p-2 rounded-full">
                        <FaGamepad className="text-green-600 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Created "{game.title}"
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(game.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
