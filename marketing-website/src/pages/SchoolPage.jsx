// src/pages/SchoolPage.jsx
import React from "react";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
  FaMusic,
  FaTrophy,
  FaArrowRight,
  FaPlay,
  FaUserGraduate,
  FaSchool,
} from "react-icons/fa";

const SchoolPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaChalkboardTeacher,
      title: "Interactive Learning",
      description:
        "Transform traditional music lessons into engaging, interactive experiences that students love.",
    },
    {
      icon: FaUsers,
      title: "Classroom Collaboration",
      description:
        "Foster teamwork and collaboration through group music challenges and competitions.",
    },
    {
      icon: FaBookOpen,
      title: "Educational Content",
      description:
        "Curated music content that aligns with educational standards and learning objectives.",
    },
    {
      icon: FaTrophy,
      title: "Progress Tracking",
      description:
        "Monitor student progress and engagement with detailed analytics and reports.",
    },
  ];

  const benefits = [
    "Increase student engagement in music education",
    "Develop listening skills and musical knowledge",
    "Encourage collaborative learning",
    "Make music theory fun and accessible",
    "Support diverse learning styles",
    "Build confidence in musical abilities",
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <FaSchool className="text-6xl text-white" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                🎵 Guessify! at School
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Transform classroom learning with interactive music education
                that engages students and enhances their musical journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
                >
                  Contact Education Team
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
                Revolutionize Music Education
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how Guessify! transforms traditional music lessons into
                dynamic, interactive learning experiences.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
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

        {/* Benefits Section */}
        <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Educational Benefits
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Guessify! provides measurable educational outcomes that
                  enhance student learning and engagement.
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
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                  <FaUserGraduate className="text-6xl text-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of educators who are already using Guessify!
                    to enhance their music programs.
                  </p>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                  >
                    <span>Start Your Free Trial</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <FaMusic className="text-6xl mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Transform Your Music Classroom Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Give your students the engaging, interactive music education they
              deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolPage;
