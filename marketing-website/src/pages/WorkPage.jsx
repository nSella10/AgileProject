// src/pages/WorkPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaUsers,
  FaHandshake,
  FaLightbulb,
  FaMusic,
  FaTrophy,
  FaArrowRight,
  FaPlay,
  FaBuilding,
  FaChartLine,
} from "react-icons/fa";

const WorkPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaUsers,
      title: "Team Building",
      description:
        "Strengthen team bonds through fun, collaborative music challenges that bring colleagues together.",
    },
    {
      icon: FaHandshake,
      title: "Corporate Events",
      description:
        "Perfect for company parties, team retreats, and corporate entertainment that everyone will remember.",
    },
    {
      icon: FaLightbulb,
      title: "Creative Breaks",
      description:
        "Boost creativity and productivity with engaging music breaks that refresh and energize your team.",
    },
    {
      icon: FaChartLine,
      title: "Performance Analytics",
      description:
        "Track team engagement and participation with detailed analytics and performance insights.",
    },
  ];

  const benefits = [
    "Improve team communication and collaboration",
    "Reduce workplace stress and boost morale",
    "Enhance creative thinking and problem-solving",
    "Build stronger interpersonal relationships",
    "Create memorable shared experiences",
    "Increase employee engagement and retention",
  ];

  const useCases = [
    {
      title: "Team Building Sessions",
      description:
        "Regular team building activities that strengthen workplace relationships",
    },
    {
      title: "Corporate Events",
      description:
        "Entertainment for company parties, conferences, and special occasions",
    },
    {
      title: "Lunch & Learn",
      description:
        "Fun educational breaks that combine learning with entertainment",
    },
    {
      title: "Remote Team Building",
      description: "Connect distributed teams through virtual music challenges",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <FaBriefcase className="text-6xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
              🎵 Guessify! at Work
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Build stronger teams through engaging music activities that boost
              morale, creativity, and collaboration in the workplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Start Team Building
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                Book Corporate Demo
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
              Strengthen Your Team Through Music
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Guessify! creates meaningful connections and boosts
              team performance through shared musical experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
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

      {/* Use Cases Section */}
      <div className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Workplace Occasion
            </h2>
            <p className="text-xl text-gray-600">
              From daily team building to special corporate events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <FaBuilding className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 text-sm">{useCase.description}</p>
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
                Workplace Benefits
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Transform your workplace culture with activities that bring
                measurable improvements to team dynamics and productivity.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaPlay className="text-white text-xs" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100">
              <div className="text-center">
                <FaTrophy className="text-6xl text-orange-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Boost Team Morale?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join companies worldwide who are using Guessify! to create
                  stronger, more connected teams.
                </p>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <span>Start Team Building</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FaMusic className="text-6xl mx-auto mb-6 text-orange-200" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Transform Your Workplace Culture Today
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Create a more connected, creative, and productive team through the
            power of music.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
            >
              Book Corporate Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPage;
