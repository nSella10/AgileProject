// src/pages/HomePage2.jsx (Guessify! at home)
import React from "react";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaHeart,
  FaBirthdayCake,
  FaMusic,
  FaTrophy,
  FaArrowRight,
  FaPlay,
  FaUserFriends,
  FaGift,
  FaGraduationCap,
  FaMicrophone,
  FaGamepad,
} from "react-icons/fa";

const HomePage2 = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaUserFriends,
      title: "Family Fun",
      description:
        "Bring the whole family together with music games that span generations and musical tastes.",
    },
    {
      icon: FaBirthdayCake,
      title: "Party Entertainment",
      description:
        "Perfect for birthday parties, family gatherings, and special celebrations that create lasting memories.",
    },
    {
      icon: FaHeart,
      title: "Bonding Activities",
      description:
        "Strengthen family relationships through shared musical experiences and friendly competition.",
    },
    {
      icon: FaGift,
      title: "Easy Setup",
      description:
        "Quick and simple setup means more time for fun and less time preparing activities.",
    },
  ];

  const benefits = [
    "Create memorable family moments",
    "Bridge generational gaps through music",
    "Encourage family interaction and communication",
    "Discover new music together",
    "Build lasting traditions and memories",
    "Perfect for all ages and musical knowledge levels",
  ];

  const occasions = [
    {
      title: "Family Game Night",
      description: "Add musical excitement to your regular family game nights",
    },
    {
      title: "Birthday Parties",
      description:
        "Entertainment that keeps guests of all ages engaged and happy",
    },
    {
      title: "Holiday Gatherings",
      description:
        "Bring relatives together with fun activities everyone can enjoy",
    },
    {
      title: "Weekend Fun",
      description: "Turn ordinary weekends into special family bonding time",
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <FaHome className="text-6xl text-white" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                🎵 Guessify! at Home
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
                Create memorable family moments with music games that bring
                everyone together, from grandparents to grandchildren.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Start Family Fun
                </button>
                <button
                  onClick={() => navigate("/join")}
                  className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
                >
                  Join a Game
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* New Features Section */}
        <div className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                🎵 New: Music Education with AI
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience our revolutionary dual-purpose platform: Fun games +
                Professional music education with AI vocal analysis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Games Gallery */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <FaGamepad className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Games Gallery
                </h3>
                <p className="text-gray-600 mb-6">
                  Browse and play from our collection of music guessing games
                  with friends and family.
                </p>
                <button
                  onClick={() => navigate("/games")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Explore Games</span>
                  <FaArrowRight />
                </button>
              </div>

              {/* Teacher Dashboard */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <FaGraduationCap className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  For Teachers
                </h3>
                <p className="text-gray-600 mb-6">
                  Create vocal lessons, track student progress, and use AI
                  analysis for professional music education.
                </p>
                <button
                  onClick={() => navigate("/teacher-dashboard")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Start Teaching</span>
                  <FaArrowRight />
                </button>
              </div>

              {/* Student Dashboard */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <FaMicrophone className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  For Students
                </h3>
                <p className="text-gray-600 mb-6">
                  Learn vocal techniques, track your progress, and get AI
                  feedback on your singing performance.
                </p>
                <button
                  onClick={() => navigate("/student-dashboard")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Start Learning</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Perfect for Family Entertainment
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how Guessify! brings families closer together through
                the universal language of music.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
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
        <div className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Perfect for Every Family Occasion
              </h2>
              <p className="text-xl text-gray-600">
                From everyday fun to special celebrations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {occasions.map((occasion, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <FaHeart className="text-white text-lg" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {occasion.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {occasion.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Family Benefits
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Strengthen family bonds and create lasting memories through
                  shared musical experiences that everyone can enjoy.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaPlay className="text-white text-xs" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
                <div className="text-center">
                  <FaUserFriends className="text-6xl text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready for Family Fun?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of families who are creating magical musical
                    memories together.
                  </p>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                  >
                    <span>Start Playing Now</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <FaMusic className="text-6xl mx-auto mb-6 text-green-200" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Bring Your Family Together Today
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Create magical moments and lasting memories through the joy of
              music.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate("/register");
                }}
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate("/join");
                }}
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
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

export default HomePage2;
