// src/pages/SchoolPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
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

  const features = [
    {
      icon: FaChalkboardTeacher,
      title: t("school.features.interactive_learning.title"),
      description: t("school.features.interactive_learning.description"),
    },
    {
      icon: FaUsers,
      title: t("school.features.classroom_collaboration.title"),
      description: t("school.features.classroom_collaboration.description"),
    },
    {
      icon: FaBookOpen,
      title: t("school.features.educational_content.title"),
      description: t("school.features.educational_content.description"),
    },
    {
      icon: FaTrophy,
      title: t("school.features.progress_tracking.title"),
      description: t("school.features.progress_tracking.description"),
    },
  ];

  const benefitsFromBenefits = t("school.benefits", { returnObjects: true });
  const benefitsFromBenefitsList = t("school.benefits_list", {
    returnObjects: true,
  });

  console.log("benefitsFromBenefits:", benefitsFromBenefits);
  console.log("benefitsFromBenefitsList:", benefitsFromBenefitsList);

  const benefitsRaw = benefitsFromBenefits || benefitsFromBenefitsList || [];
  const benefits = Array.isArray(benefitsRaw) ? benefitsRaw : [];

  return (
    <PageLayout>
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        dir={isRTL ? "rtl" : "ltr"}
      >
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
                {t("school.title")}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                {t("school.subtitle")}
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center ${
                  isRTL ? "sm:flex-row-reverse" : ""
                }`}
              >
                <button
                  onClick={handleCreateClick}
                  className={`bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    isRTL ? "hover:shadow-xl" : "transform hover:scale-105"
                  } shadow-xl`}
                >
                  {t("school.start_free_trial")}
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
                >
                  {t("school.contact_education_team")}
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
                {t("school.revolutionize_title")}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("school.revolutionize_subtitle")}
              </p>
            </div>

            <div
              className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 ${
                isRTL ? "rtl" : ""
              }`}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 ${
                      isRTL
                        ? "hover:shadow-xl transition-shadow duration-300"
                        : "hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    }`}
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
            <div
              className={`grid lg:grid-cols-2 gap-16 items-center ${
                isRTL ? "rtl" : ""
              }`}
            >
              <div
                className={isRTL ? "text-right" : ""}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  {t("school.educational_benefits")}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {t("school.benefits_description")}
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`bg-green-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isRTL ? "ml-4" : "mr-3"
                        }`}
                      >
                        <FaPlay
                          className={`text-white text-xs ${
                            isRTL ? "transform rotate-180" : ""
                          }`}
                        />
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
                    {t("school.ready_to_start")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("school.ready_description")}
                  </p>
                  <button
                    onClick={handleCreateClick}
                    className={`bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                      isRTL ? "hover:shadow-lg" : "transform hover:scale-105"
                    } shadow-lg flex items-center ${
                      isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                    } mx-auto`}
                  >
                    <span>{t("school.start_your_free_trial")}</span>
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
              {t("school.transform_classroom")}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t("school.transform_description")}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={handleCreateClick}
                className={`bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  isRTL ? "hover:shadow-lg" : "transform hover:scale-105"
                }`}
              >
                {t("school.get_started_free")}
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                {t("school.schedule_demo")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SchoolPage;
