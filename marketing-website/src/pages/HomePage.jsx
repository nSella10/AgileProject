import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";
import { getRoute } from "../utils/routes";

const Homepage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "he";

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
    // Get translated button texts
    const tryNowText = t("homepage.cards.friends_family.button");
    const joinNowText = t("homepage.cards.students.button");
    const createGameText = t("homepage.cards.teachers.button");
    const startCreatingText = t("homepage.cards.creators.button");

    switch (buttonText) {
      case "Try now":
      case "Join now":
      case tryNowText:
      case joinNowText:
        handlePlayClick();
        break;
      case "Create game":
      case "Start creating":
      case createGameText:
      case startCreatingText:
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

  const handleFooterClick = (item) => {
    // Create mapping for both English and Hebrew
    const routeMapping = {
      // About section
      [t("homepage.footer.about.company")]: getRoute("about", i18n.language),
      [t("homepage.footer.about.careers")]: getRoute("careers", i18n.language),
      [t("homepage.footer.about.contact_us")]: getRoute(
        "contact",
        i18n.language
      ),

      // Solutions section
      [t("homepage.footer.solutions.at_home")]: getRoute("home", i18n.language),
      [t("homepage.footer.solutions.at_school")]: getRoute(
        "school",
        i18n.language
      ),
      [t("homepage.footer.solutions.at_work")]: getRoute("work", i18n.language),
      [t("homepage.footer.solutions.community")]: getRoute(
        "community",
        i18n.language
      ),
      [t("homepage.footer.solutions.marketplace")]: getRoute(
        "solutions",
        i18n.language
      ),

      // Resources section
      [t("homepage.footer.resources.blog")]: getRoute("blog", i18n.language),
      [t("homepage.footer.resources.help_center")]: getRoute(
        "help",
        i18n.language
      ),

      // Terms section
      [t("homepage.footer.terms.terms_conditions")]: getRoute(
        "terms",
        i18n.language
      ),
      [t("homepage.footer.terms.privacy_policy")]: getRoute(
        "privacy",
        i18n.language
      ),
    };

    const route = routeMapping[item];
    if (route) {
      navigate(route);
    }
  };

  return (
    <PageLayout>
      <div
        className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
          </div>

          {/* Hero Content */}
          <div
            className="relative w-full px-6 py-20 text-center"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="max-w-6xl mx-auto">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight text-center">
                {t("homepage.hero.title")}
                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  {t("homepage.hero.title_highlight")}
                </span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-purple-200 mb-12 max-w-5xl mx-auto leading-relaxed text-center">
                {t("homepage.hero.subtitle")}
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 ${
                  isRTL ? "sm:flex-row-reverse" : ""
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <button
                  onClick={handleCreateClick}
                  className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-2xl hover:shadow-pink-500/25 text-center ${
                    isRTL ? "" : "transform hover:scale-105"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("homepage.hero.start_creating")}
                </button>
                <button
                  onClick={handlePlayClick}
                  className={`bg-white bg-opacity-20 backdrop-blur-sm text-white border-2 border-white border-opacity-30 px-12 py-5 rounded-full font-bold text-xl hover:bg-opacity-30 transition-all duration-200 text-center ${
                    isRTL ? "" : "transform hover:scale-105"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("homepage.hero.join_game")}
                </button>
              </div>

              {/* Stats Section */}
              <div
                className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto ${
                  isRTL ? "rtl" : ""
                }`}
              >
                <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    10K+
                  </div>
                  <div className="text-purple-200 text-lg">
                    {t("homepage.stats.games_created")}
                  </div>
                </div>
                <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    50K+
                  </div>
                  <div className="text-purple-200 text-lg">
                    {t("homepage.stats.happy_players")}
                  </div>
                </div>
                <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    500+
                  </div>
                  <div className="text-purple-200 text-lg">
                    {t("homepage.stats.schools_using")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="w-full px-6 py-20 bg-gradient-to-b from-purple-900 to-indigo-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
              {t("homepage.cards.title")}
            </h2>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${
                isRTL ? "rtl" : ""
              }`}
            >
              {[
                {
                  title: t("homepage.cards.friends_family.title"),
                  color: "from-emerald-500 to-teal-600",
                  icon: "👨‍👩‍👧‍👦",
                  description: t("homepage.cards.friends_family.description"),
                  btn: t("homepage.cards.friends_family.button"),
                },
                {
                  title: t("homepage.cards.students.title"),
                  color: "from-orange-500 to-red-500",
                  icon: "🎓",
                  description: t("homepage.cards.students.description"),
                  btn: t("homepage.cards.students.button"),
                },
                {
                  title: t("homepage.cards.teachers.title"),
                  color: "from-red-500 to-pink-600",
                  icon: "👩‍🏫",
                  description: t("homepage.cards.teachers.description"),
                  btn: t("homepage.cards.teachers.button"),
                },
                {
                  title: t("homepage.cards.creators.title"),
                  color: "from-blue-500 to-indigo-600",
                  icon: "🎨",
                  description: t("homepage.cards.creators.description"),
                  btn: t("homepage.cards.creators.button"),
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`relative rounded-2xl bg-gradient-to-br ${card.color} text-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[320px]`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <div className="text-center flex flex-col flex-1">
                    {/* Icon centered at top for both Hebrew and English */}
                    <div className="text-5xl mb-6 text-center">{card.icon}</div>
                    {/* Title centered below icon for both Hebrew and English */}
                    <h3 className="text-xl lg:text-2xl font-bold mb-4 text-center">
                      {card.title}
                    </h3>
                    {/* Description centered for both Hebrew and English */}
                    <p className="text-base opacity-95 mb-8 leading-relaxed text-center flex-1">
                      {card.description}
                    </p>
                    {/* Button centered for both Hebrew and English */}
                    <div className="text-center mt-auto">
                      <button
                        className="bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white border-opacity-30 rounded-xl px-8 py-3 font-semibold hover:bg-opacity-30 transition-colors duration-200"
                        onClick={() => handleCardButtonClick(card.btn)}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        {card.btn}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise Section */}
        <div
          className={`bg-gradient-to-r from-slate-50 to-blue-50 py-20 ${
            isRTL ? "hebrew-enterprise-section" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className={`text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 ${
                isRTL ? "text-right" : ""
              }`}
            >
              {t("homepage.enterprise.title")}
            </h2>
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${
                isRTL ? "hebrew-enterprise-section" : ""
              }`}
            >
              <div
                className={`bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 ${
                  isRTL ? "hebrew-enterprise-card" : ""
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div
                  className="flex items-center mb-6"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? (
                    // Hebrew RTL: Icon first (right), then title (left) - using RTL direction
                    <>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800 mr-4">
                        {t("homepage.enterprise.education.title")}
                      </h4>
                    </>
                  ) : (
                    // English LTR: Icon on left, title on right
                    <>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800">
                        {t("homepage.enterprise.education.title")}
                      </h4>
                    </>
                  )}
                </div>
                <p
                  className={`text-gray-600 mb-6 text-lg leading-relaxed ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  {t("homepage.enterprise.education.description")}
                </p>
                <div className="space-y-3 mb-6">
                  <div
                    className="flex items-center text-gray-600"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL ? (
                      // Hebrew RTL: Checkmark on right, text on left with spacing
                      <>
                        <span className="text-green-500 ml-3">✓</span>
                        <span className="text-right">
                          {t(
                            "homepage.enterprise.education.features.unlimited_accounts"
                          )}
                        </span>
                      </>
                    ) : (
                      // English LTR: Checkmark on left, text on right
                      <>
                        <span className="text-green-500 mr-2">✓</span>
                        <span>
                          {t(
                            "homepage.enterprise.education.features.unlimited_accounts"
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className="flex items-center text-gray-600"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL ? (
                      <>
                        <span className="text-green-500 ml-3">✓</span>
                        <span className="text-right">
                          {t(
                            "homepage.enterprise.education.features.analytics"
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-green-500 mr-2">✓</span>
                        <span>
                          {t(
                            "homepage.enterprise.education.features.analytics"
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className="flex items-center text-gray-600"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL ? (
                      <>
                        <span className="text-green-500 ml-3">✓</span>
                        <span className="text-right">
                          {t(
                            "homepage.enterprise.education.features.curriculum"
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-green-500 mr-2">✓</span>
                        <span>
                          {t(
                            "homepage.enterprise.education.features.curriculum"
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-8 py-4 font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200 shadow-lg"
                    onClick={handleEducationClick}
                  >
                    {t("homepage.enterprise.education.button")}
                  </button>
                </div>
              </div>

              <div
                className={`bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 ${
                  isRTL ? "hebrew-enterprise-card" : ""
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div
                  className="flex items-center mb-6"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? (
                    // Hebrew RTL: Icon first (right), then title (left) - using RTL direction
                    <>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏢</span>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800 mr-4">
                        {t("homepage.enterprise.enterprise.title")}
                      </h4>
                    </>
                  ) : (
                    // English LTR: Icon on left, title on right
                    <>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">🏢</span>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800">
                        {t("homepage.enterprise.enterprise.title")}
                      </h4>
                    </>
                  )}
                </div>
                <p
                  className={`text-gray-600 mb-6 text-lg leading-relaxed ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  {t("homepage.enterprise.enterprise.description")}
                </p>
                <div className="space-y-3 mb-6">
                  <div
                    className="flex items-center text-gray-600"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL ? (
                      // Hebrew RTL: Checkmark on right, text on left with spacing
                      <>
                        <span className="text-green-500 ml-3">✓</span>
                        <span className="text-right">
                          {t(
                            "homepage.enterprise.enterprise.features.branding"
                          )}
                        </span>
                      </>
                    ) : (
                      // English LTR: Checkmark on left, text on right
                      <>
                        <span className="text-green-500 mr-2">✓</span>
                        <span>
                          {t(
                            "homepage.enterprise.enterprise.features.branding"
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className="flex items-center text-gray-600"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL ? (
                      <>
                        <span className="text-green-500 ml-3">✓</span>
                        <span className="text-right">
                          {t(
                            "homepage.enterprise.enterprise.features.security"
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-green-500 mr-2">✓</span>
                        <span>
                          {t(
                            "homepage.enterprise.enterprise.features.security"
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className="flex items-center text-gray-600"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL ? (
                      <>
                        <span className="text-green-500 ml-3">✓</span>
                        <span className="text-right">
                          {t("homepage.enterprise.enterprise.features.manager")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-green-500 mr-2">✓</span>
                        <span>
                          {t("homepage.enterprise.enterprise.features.manager")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-8 py-4 font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors duration-200 shadow-lg"
                    onClick={handleEnterpriseClick}
                  >
                    {t("homepage.enterprise.enterprise.button")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-16">
            <h3
              className={`text-2xl font-bold text-center text-gray-800 mb-8 ${
                isRTL ? "text-right" : ""
              }`}
            >
              {t("homepage.solutions.title")}
            </h3>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${
                isRTL ? "rtl" : ""
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {[
                {
                  title: t("homepage.solutions.school.title"),
                  icon: "🏫",
                  description: t("homepage.solutions.school.description"),
                  color: "border-blue-500",
                },
                {
                  title: t("homepage.solutions.work.title"),
                  icon: "💼",
                  description: t("homepage.solutions.work.description"),
                  color: "border-green-500",
                },
                {
                  title: t("homepage.solutions.home.title"),
                  icon: "🏠",
                  description: t("homepage.solutions.home.description"),
                  color: "border-purple-500",
                },
                {
                  title: t("homepage.solutions.community.title"),
                  icon: "🌍",
                  description: t("homepage.solutions.community.description"),
                  color: "border-pink-500",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white shadow-lg rounded-xl p-6 border-t-4 ${
                    item.color
                  } hover:shadow-xl transition-shadow duration-300 ${
                    isRTL ? "hebrew-solutions-card" : ""
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <div
                    className={`text-3xl mb-3 ${isRTL ? "text-center" : ""}`}
                  >
                    {item.icon}
                  </div>
                  <h4
                    className={`font-bold text-gray-800 mb-3 text-lg ${
                      isRTL ? "hebrew-solutions-title text-center" : ""
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={`text-gray-600 text-sm mb-4 leading-relaxed ${
                      isRTL ? "hebrew-solutions-description text-center" : ""
                    }`}
                  >
                    {item.description}
                  </p>
                  <button
                    className={`text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors duration-200 ${
                      isRTL ? "hebrew-solutions-button" : ""
                    }`}
                    onClick={() => {
                      const routes = {
                        [t("homepage.solutions.school.title")]: getRoute(
                          "school",
                          i18n.language
                        ),
                        [t("homepage.solutions.work.title")]: getRoute(
                          "work",
                          i18n.language
                        ),
                        [t("homepage.solutions.home.title")]: "/",
                        [t("homepage.solutions.community.title")]: getRoute(
                          "community",
                          i18n.language
                        ),
                      };
                      const route = routes[item.title];
                      if (route) {
                        navigate(route);
                      }
                    }}
                  >
                    {t("homepage.solutions.learn_more")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="bg-gray-900 text-gray-300 py-8"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div
            className={`max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 ${
              isRTL ? "rtl text-right" : ""
            }`}
          >
            <div>
              <h5 className={`font-semibold mb-4 ${isRTL ? "text-right" : ""}`}>
                {t("homepage.footer.about.title")}
              </h5>
              {[
                { key: "company", label: t("homepage.footer.about.company") },
                { key: "careers", label: t("homepage.footer.about.careers") },
                {
                  key: "contact_us",
                  label: t("homepage.footer.about.contact_us"),
                },
              ].map((item) => (
                <p
                  key={item.key}
                  className={`text-sm mb-2 cursor-pointer hover:text-white transition-colors ${
                    isRTL ? "text-right" : ""
                  }`}
                  onClick={() => handleFooterClick(item.label)}
                >
                  {item.label}
                </p>
              ))}
            </div>
            <div>
              <h5 className={`font-semibold mb-4 ${isRTL ? "text-right" : ""}`}>
                {t("homepage.footer.solutions.title")}
              </h5>
              {[
                {
                  key: "at_home",
                  label: t("homepage.footer.solutions.at_home"),
                },
                {
                  key: "at_school",
                  label: t("homepage.footer.solutions.at_school"),
                },
                {
                  key: "at_work",
                  label: t("homepage.footer.solutions.at_work"),
                },
                {
                  key: "community",
                  label: t("homepage.footer.solutions.community"),
                },
                {
                  key: "marketplace",
                  label: t("homepage.footer.solutions.marketplace"),
                },
              ].map((item) => (
                <p
                  key={item.key}
                  className={`text-sm mb-2 cursor-pointer hover:text-white transition-colors ${
                    isRTL ? "text-right" : ""
                  }`}
                  onClick={() => handleFooterClick(item.label)}
                >
                  {item.label}
                </p>
              ))}
            </div>
            <div>
              <h5 className={`font-semibold mb-4 ${isRTL ? "text-right" : ""}`}>
                {t("homepage.footer.resources.title")}
              </h5>
              {[
                { key: "blog", label: t("homepage.footer.resources.blog") },
                {
                  key: "help_center",
                  label: t("homepage.footer.resources.help_center"),
                },
              ].map((item) => (
                <p
                  key={item.key}
                  className={`text-sm mb-2 cursor-pointer hover:text-white transition-colors ${
                    isRTL ? "text-right" : ""
                  }`}
                  onClick={() => handleFooterClick(item.label)}
                >
                  {item.label}
                </p>
              ))}
            </div>
            <div>
              <h5 className={`font-semibold mb-4 ${isRTL ? "text-right" : ""}`}>
                {t("homepage.footer.terms.title")}
              </h5>
              {[
                {
                  key: "terms_conditions",
                  label: t("homepage.footer.terms.terms_conditions"),
                },
                {
                  key: "privacy_policy",
                  label: t("homepage.footer.terms.privacy_policy"),
                },
              ].map((item) => (
                <p
                  key={item.key}
                  className={`text-sm mb-2 cursor-pointer hover:text-white transition-colors ${
                    isRTL ? "text-right" : ""
                  }`}
                  onClick={() => handleFooterClick(item.label)}
                >
                  {item.label}
                </p>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </PageLayout>
  );
};

export default Homepage;
