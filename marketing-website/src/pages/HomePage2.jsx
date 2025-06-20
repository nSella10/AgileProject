// src/pages/HomePage2.jsx (Guessify! at home)
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaHeart,
  FaBirthdayCake,
  FaMusic,
  FaArrowRight,
  FaPlay,
  FaUserFriends,
  FaGift,
} from "react-icons/fa";
import PageLayout from "../components/PageLayout";

const HomePage2 = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "he";

  // Handle Create/Register button click - redirect to create app
  const handleCreateClick = () => {
    const createAppUrl =
      process.env.NODE_ENV === "production"
        ? "https://create.guessifyapp.com"
        : "http://localhost:3001";
    window.location.href = createAppUrl;
  };

  // Handle Play/Join button click - redirect to play app
  const handlePlayClick = () => {
    const playAppUrl =
      process.env.NODE_ENV === "production"
        ? "https://play.guessifyapp.com"
        : "http://localhost:3002";
    window.location.href = playAppUrl;
  };

  const features = [
    {
      icon: FaUserFriends,
      title: t("home.features.family_fun.title"),
      description: t("home.features.family_fun.description"),
    },
    {
      icon: FaBirthdayCake,
      title: t("home.features.party_entertainment.title"),
      description: t("home.features.party_entertainment.description"),
    },
    {
      icon: FaHeart,
      title: t("home.features.bonding_activities.title"),
      description: t("home.features.bonding_activities.description"),
    },
    {
      icon: FaGift,
      title: t("home.features.easy_setup.title"),
      description: t("home.features.easy_setup.description"),
    },
  ];

  const benefits = t("home.benefits", { returnObjects: true });

  const occasions = [
    {
      title: t("home.occasions.family_game_night.title"),
      description: t("home.occasions.family_game_night.description"),
    },
    {
      title: t("home.occasions.birthday_parties.title"),
      description: t("home.occasions.birthday_parties.description"),
    },
    {
      title: t("home.occasions.holiday_gatherings.title"),
      description: t("home.occasions.holiday_gatherings.description"),
    },
    {
      title: t("home.occasions.weekend_fun.title"),
      description: t("home.occasions.weekend_fun.description"),
    },
  ];

  return (
    <PageLayout>
      <div
        className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
        dir={isRTL ? "rtl" : "ltr"}
      >
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
                {t("home.title")}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
                {t("home.subtitle")}
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-6 justify-center ${
                  isRTL ? "sm:flex-row-reverse" : ""
                }`}
              >
                <button
                  onClick={handleCreateClick}
                  className="bg-white text-green-600 hover:bg-green-50 px-12 py-5 rounded-2xl font-bold text-xl md:text-2xl transition-all duration-300 transform hover:scale-105 shadow-xl min-w-[260px]"
                >
                  {t("home.start_family_fun")}
                </button>
                <button
                  onClick={handlePlayClick}
                  className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-12 py-5 rounded-2xl font-bold text-xl md:text-2xl transition-all duration-300 min-w-[260px]"
                >
                  {t("home.join_game")}
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
                {t("home.perfect_for_family")}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("home.perfect_subtitle")}
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
                {t("home.perfect_for_occasions")}
              </h2>
              <p className="text-xl text-gray-600">
                {t("home.occasions_subtitle")}
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
                  {t("home.family_benefits")}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {t("home.benefits_description")}
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className={`flex items-center ${
                        isRTL ? "gap-4" : "space-x-3"
                      }`}
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {isRTL ? (
                        // Hebrew RTL: Icon on right pointing left, text on left
                        <>
                          <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaPlay className="text-white text-xs transform rotate-180" />
                          </div>
                          <span className="text-gray-700 font-medium text-right">
                            {benefit}
                          </span>
                        </>
                      ) : (
                        // English LTR: Icon on left pointing right, text on right
                        <>
                          <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaPlay className="text-white text-xs" />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {benefit}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
                <div className="text-center">
                  <FaUserFriends className="text-6xl text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t("home.ready_for_fun")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("home.ready_description")}
                  </p>
                  <button
                    onClick={handleCreateClick}
                    className={`bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto ${
                      isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                    }`}
                  >
                    <span>{t("home.start_playing_now")}</span>
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
              {t("home.bring_family_together")}
            </h2>
            <p className="text-xl text-green-100 mb-8">
              {t("home.bring_description")}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  handleCreateClick();
                }}
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
              >
                {t("home.get_started_free")}
              </button>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  handlePlayClick();
                }}
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                {t("home.join_game_now")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage2;
