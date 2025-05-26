// src/pages/CommunityPage.jsx
import React from "react";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "react-router-dom";
import { 
  FaGlobe, 
  FaUsers, 
  FaComments, 
  FaShare,
  FaMusic,
  FaTrophy,
  FaArrowRight,
  FaPlay,
  FaHeart,
  FaStar
} from "react-icons/fa";

const CommunityPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaUsers,
      title: "Global Community",
      description: "Connect with music lovers from around the world and share your passion for music discovery."
    },
    {
      icon: FaComments,
      title: "Social Features",
      description: "Chat, share playlists, and discuss music with fellow players in our vibrant community."
    },
    {
      icon: FaShare,
      title: "Share & Discover",
      description: "Share your favorite games and discover new music through community recommendations."
    },
    {
      icon: FaTrophy,
      title: "Competitions",
      description: "Participate in global tournaments and community challenges to showcase your music knowledge."
    }
  ];

  const benefits = [
    "Connect with music enthusiasts worldwide",
    "Discover new genres and artists",
    "Share your musical knowledge and passion",
    "Participate in global music challenges",
    "Build lasting friendships through music",
    "Access exclusive community content and events"
  ];

  const communityStats = [
    {
      number: "50K+",
      label: "Active Players",
      icon: FaUsers
    },
    {
      number: "100+",
      label: "Countries",
      icon: FaGlobe
    },
    {
      number: "1M+",
      label: "Songs Played",
      icon: FaMusic
    },
    {
      number: "10K+",
      label: "Games Created",
      icon: FaPlay
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <FaGlobe className="text-6xl text-white" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                🎵 Guessify! Community
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
                Join a global community of music lovers where passion meets discovery, and every game creates new connections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Join Community
                </button>
                <button
                  onClick={() => navigate("/join")}
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Join Our Growing Community
              </h2>
              <p className="text-xl text-gray-600">
                Be part of something bigger than just a game
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {communityStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-2xl text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
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
                Community Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover all the ways you can connect, share, and grow with fellow music enthusiasts.
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
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Community Benefits
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Experience the power of music to bring people together from all corners of the world.
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
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
                <div className="text-center">
                  <FaHeart className="text-6xl text-purple-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Connect?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of music lovers who are already part of our amazing community.
                  </p>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                  >
                    <span>Join Community</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What Our Community Says
              </h2>
              <p className="text-xl text-gray-600">
                Real stories from real music lovers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I've discovered so many new artists through Guessify! The community is amazing and so welcoming.",
                  author: "Sarah M.",
                  location: "New York, USA"
                },
                {
                  quote: "Playing with people from different countries has opened my eyes to music I never knew existed.",
                  author: "Carlos R.",
                  location: "Madrid, Spain"
                },
                {
                  quote: "The friendships I've made here are real. We even meet up at concerts now!",
                  author: "Yuki T.",
                  location: "Tokyo, Japan"
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <FaMusic className="text-6xl mx-auto mb-6 text-purple-200" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Your Musical Journey Starts Here
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join a community where music brings people together from every corner of the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Join Community
              </button>
              <button
                onClick={() => navigate("/join")}
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CommunityPage;
