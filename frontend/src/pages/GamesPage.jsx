import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import {
  FaGamepad,
  FaUsers,
  FaMusic,
  FaTrophy,
  FaPlay,
  FaArrowRight,
  FaStar,
  FaHeart,
  FaLaugh,
  FaGift,
} from "react-icons/fa";

const GamesPage = () => {
  const navigate = useNavigate();

  const gameTypes = [
    {
      title: "Quick Play",
      icon: FaPlay,
      color: "from-green-500 to-emerald-500",
      description: "Jump into a quick music guessing game",
      action: () => navigate("/join"),
    },
    {
      title: "Create Game",
      icon: FaGamepad,
      color: "from-blue-500 to-cyan-500",
      description: "Create your own custom music game",
      action: () => navigate("/create"),
    },
    {
      title: "My Games",
      icon: FaTrophy,
      color: "from-purple-500 to-pink-500",
      description: "View and manage your created games",
      action: () => navigate("/mygames"),
    },
    {
      title: "Join Friends",
      icon: FaUsers,
      color: "from-orange-500 to-red-500",
      description: "Join a game with friends using a room code",
      action: () => navigate("/join"),
    },
  ];

  const features = [
    {
      icon: FaMusic,
      title: "Vast Music Library",
      description: "Access millions of songs from various genres and eras",
    },
    {
      icon: FaUsers,
      title: "Multiplayer Fun",
      description: "Play with friends and family in real-time",
    },
    {
      icon: FaTrophy,
      title: "Competitive Scoring",
      description: "Track your progress and compete for high scores",
    },
    {
      icon: FaHeart,
      title: "Family Friendly",
      description: "Safe and enjoyable for all ages",
    },
  ];

  const occasions = [
    {
      icon: FaLaugh,
      title: "Family Game Night",
      description: "Perfect entertainment for the whole family",
    },
    {
      icon: FaGift,
      title: "Parties & Events",
      description: "Add musical fun to any celebration",
    },
    {
      icon: FaStar,
      title: "Date Night",
      description: "Discover each other's music taste",
    },
    {
      icon: FaUsers,
      title: "Friend Hangouts",
      description: "Test your music knowledge together",
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <FaGamepad className="text-6xl text-white" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                🎮 Music Games & Fun
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
                Challenge your music knowledge, compete with friends, and create
                unforgettable musical moments together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Start Playing Now
                </button>
                <button
                  onClick={() => navigate("/join")}
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
                >
                  Join a Game
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Types Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Game Mode
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you want a quick game or a custom experience, we've got
                you covered.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {gameTypes.map((game, index) => {
                const Icon = game.icon;
                return (
                  <div
                    key={index}
                    onClick={game.action}
                    className={`bg-gradient-to-br ${game.color} p-8 rounded-2xl text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group`}
                  >
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-all duration-300">
                      <Icon className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{game.title}</h3>
                    <p className="text-white/90 mb-4">{game.description}</p>
                    <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Get Started</span>
                      <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Music Games?
              </h2>
              <p className="text-xl text-gray-600">
                Experience the best in musical entertainment
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Occasions Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Perfect for Every Occasion
              </h2>
              <p className="text-xl text-gray-600">
                Bring musical fun to any gathering
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {occasions.map((occasion, index) => {
                const Icon = occasion.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="text-white text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {occasion.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {occasion.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <FaMusic className="text-6xl mx-auto mb-6 text-purple-200" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Start Playing?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of music lovers having fun with our games!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/join")}
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                Join a Game Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GamesPage;
