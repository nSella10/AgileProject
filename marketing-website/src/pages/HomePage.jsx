import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

const Homepage = () => {
  const navigate = useNavigate();

  // Handle Create button click - redirect to create app
  const handleCreateClick = () => {
    const createAppUrl =
      process.env.NODE_ENV === "production"
        ? "https://create.guessifyapp.com"
        : "http://localhost:3001";
    window.location.href = createAppUrl;
  };

  // Handle Play button click - redirect to play app
  const handlePlayClick = () => {
    const playAppUrl =
      process.env.NODE_ENV === "production"
        ? "https://play.guessifyapp.com"
        : "http://localhost:3002";
    window.location.href = playAppUrl;
  };

  const handleCardButtonClick = (buttonText) => {
    switch (buttonText) {
      case "Try now":
      case "Join now":
        handlePlayClick();
        break;
      case "Create game":
      case "Start creating":
        handleCreateClick();
        break;
      default:
        break;
    }
  };

  const handleEducationClick = () => {
    navigate("/pricing");
  };

  const handleEnterpriseClick = () => {
    navigate("/about");
  };

  const handleFooterClick = (section, item) => {
    const routes = {
      About: {
        Company: "/about",
        Leadership: "/about",
        Careers: "/careers",
        "Open positions": "/careers",
        Press: "/about",
        "Company events": "/about",
        "Contact us": "/contact",
      },
      Solutions: {
        "At home": "/home",
        "At school": "/school",
        "At work": "/work",
        Community: "/community",
        Marketplace: "/solutions",
      },
      Resources: {
        "Explore Content": "/solutions",
        Blog: "/blog",
        Webinars: "/blog",
        "Trust Center": "/help",
        "Help Center": "/help",
      },
      "Terms and conditions": {
        "Terms and conditions": "/terms",
        "Privacy policy": "/privacy",
        "Cookie notice": "/privacy",
      },
    };

    const route = routes[section]?.[item];
    if (route) {
      navigate(route);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
          </div>

          {/* Hero Content */}
          <div className="relative w-full px-6 py-20 text-center">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
                Make Music Games
                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  Magical
                </span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-purple-200 mb-12 max-w-5xl mx-auto leading-relaxed">
                Create engaging music quiz games that bring people together
                through the universal language of music. Perfect for classrooms,
                families, and friends!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <button
                  onClick={handleCreateClick}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-pink-500/25"
                >
                  🎵 Start Creating Now
                </button>
                <button
                  onClick={handlePlayClick}
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-2 border-white border-opacity-30 px-12 py-5 rounded-full font-bold text-xl hover:bg-opacity-30 transform hover:scale-105 transition-all duration-200"
                >
                  🎯 Join a Game
                </button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    10K+
                  </div>
                  <div className="text-purple-200 text-lg">Games Created</div>
                </div>
                <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    50K+
                  </div>
                  <div className="text-purple-200 text-lg">Happy Players</div>
                </div>
                <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    500+
                  </div>
                  <div className="text-purple-200 text-lg">Schools Using</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="w-full px-6 py-20 bg-gradient-to-b from-purple-900 to-indigo-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
              Perfect for Every Occasion
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "For Friends & Family",
                  color: "from-emerald-500 to-teal-600",
                  icon: "👨‍👩‍👧‍👦",
                  description:
                    "Create memorable moments with loved ones through interactive music games",
                  btn: "Try now",
                },
                {
                  title: "For Students",
                  color: "from-orange-500 to-red-500",
                  icon: "🎓",
                  description:
                    "Make learning music theory fun and engaging in the classroom",
                  btn: "Join now",
                },
                {
                  title: "For Teachers",
                  color: "from-red-500 to-pink-600",
                  icon: "👩‍🏫",
                  description:
                    "Transform your music lessons with interactive quiz games",
                  btn: "Create game",
                },
                {
                  title: "For Creators",
                  color: "from-blue-500 to-indigo-600",
                  icon: "🎨",
                  description:
                    "Build custom music experiences and share them with the world",
                  btn: "Start creating",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`relative rounded-2xl bg-gradient-to-br ${card.color} text-white p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 group overflow-hidden`}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>

                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{card.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                    <p className="text-sm opacity-90 mb-6 leading-relaxed">
                      {card.description}
                    </p>
                    <button
                      className="bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white border-opacity-30 rounded-full px-6 py-3 font-semibold hover:bg-opacity-30 transform hover:scale-105 transition-all duration-200"
                      onClick={() => handleCardButtonClick(card.btn)}
                    >
                      {card.btn} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Trusted by Educational Institutions & Enterprises
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white shadow-2xl rounded-2xl p-8 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">
                    FOR HIGHER EDUCATION
                  </h4>
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Transform your music curriculum with interactive learning
                  experiences. Inspire your students with Guessify!+ premium
                  features designed for academic excellence.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited student accounts
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced analytics & reporting
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Curriculum integration tools
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-8 py-4 font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  onClick={handleEducationClick}
                >
                  View Pricing Plans →
                </button>
              </div>

              <div className="bg-white shadow-2xl rounded-2xl p-8 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">
                    FOR ENTERPRISES
                  </h4>
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Drive business growth and team engagement with custom music
                  experiences. Perfect for team building, training, and
                  corporate events.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom branding & themes
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Enterprise-grade security
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    Dedicated account manager
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-8 py-4 font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  onClick={handleEnterpriseClick}
                >
                  Learn More →
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Explore Our Solutions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Guessify! at school",
                  icon: "🏫",
                  description:
                    "Transform classroom learning with interactive music education",
                  color: "border-blue-500",
                },
                {
                  title: "Guessify! at work",
                  icon: "💼",
                  description:
                    "Build stronger teams through engaging music activities",
                  color: "border-green-500",
                },
                {
                  title: "Guessify! at home",
                  icon: "🏠",
                  description:
                    "Create memorable family moments with music games",
                  color: "border-purple-500",
                },
                {
                  title: "Guessify! community",
                  icon: "🌍",
                  description:
                    "Connect with music lovers worldwide through shared experiences",
                  color: "border-pink-500",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white shadow-lg rounded-xl p-6 border-t-4 ${item.color} hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-bold text-gray-800 mb-3 text-lg">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <button
                    className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:translate-x-1 transform duration-200"
                    onClick={() => {
                      const routes = {
                        "Guessify! at school": "/school",
                        "Guessify! at work": "/work",
                        "Guessify! at home": "/home",
                        "Guessify! community": "/community",
                      };
                      const route = routes[item.title];
                      if (route) {
                        navigate(route);
                      }
                    }}
                  >
                    Learn more →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-8">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h5 className="font-semibold mb-4">About</h5>
              {[
                "Company",
                "Leadership",
                "Careers",
                "Open positions",
                "Press",
                "Company events",
                "Contact us",
              ].map((item) => (
                <p
                  key={item}
                  className="text-sm mb-2 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleFooterClick("About", item)}
                >
                  {item}
                </p>
              ))}
            </div>
            <div>
              <h5 className="font-semibold mb-4">Solutions</h5>
              {[
                "At home",
                "At school",
                "At work",
                "Community",
                "Marketplace",
              ].map((item) => (
                <p
                  key={item}
                  className="text-sm mb-2 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleFooterClick("Solutions", item)}
                >
                  {item}
                </p>
              ))}
            </div>
            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              {[
                "Explore Content",
                "Blog",
                "Webinars",
                "Trust Center",
                "Help Center",
              ].map((item) => (
                <p
                  key={item}
                  className="text-sm mb-2 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleFooterClick("Resources", item)}
                >
                  {item}
                </p>
              ))}
            </div>
            <div>
              <h5 className="font-semibold mb-4">Terms and conditions</h5>
              {["Terms and conditions", "Privacy policy", "Cookie notice"].map(
                (item) => (
                  <p
                    key={item}
                    className="text-sm mb-2 cursor-pointer hover:text-white transition-colors"
                    onClick={() =>
                      handleFooterClick("Terms and conditions", item)
                    }
                  >
                    {item}
                  </p>
                )
              )}
            </div>
          </div>
        </footer>
      </div>
    </PageLayout>
  );
};

export default Homepage;
