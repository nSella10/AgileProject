import React from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const SolutionsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  const solutions =
    t("solutions.solutions_data", { returnObjects: true }) || [];

  const useCases = t("solutions.use_cases_data", { returnObjects: true }) || [];

  return (
    <PageLayout>
      <div
        className={`bg-gradient-to-b from-indigo-600 to-purple-700 py-20 text-white ${
          isRTL ? "hebrew-hero" : ""
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              isRTL ? "hebrew-title" : ""
            }`}
          >
            {t("solutions.title")}
          </h1>
          <p
            className={`text-xl md:text-2xl text-indigo-200 max-w-4xl mx-auto leading-relaxed ${
              isRTL ? "hebrew-subtitle" : ""
            }`}
          >
            {t("solutions.subtitle")}
          </p>
        </div>
      </div>

      <div
        className={`max-w-7xl mx-auto px-6 py-20 ${
          isRTL ? "hebrew-content" : ""
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Main Solutions */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20 ${
            isRTL ? "hebrew-grid" : ""
          }`}
        >
          {solutions.map((solution, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl shadow-xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 ${
                isRTL ? "hebrew-card" : ""
              }`}
            >
              <div
                className={`flex items-center mb-8 ${
                  isRTL ? "text-right" : ""
                }`}
              >
                {isRTL ? (
                  <>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 flex-1">
                      {solution.title}
                    </h2>
                    <span className="text-5xl mr-6">{solution.icon}</span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl mr-6">{solution.icon}</span>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                      {solution.title}
                    </h2>
                  </>
                )}
              </div>

              <p
                className={`text-gray-600 mb-8 text-lg lg:text-xl leading-relaxed ${
                  isRTL ? "hebrew-card-description text-right" : ""
                }`}
              >
                {solution.description}
              </p>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
                  isRTL ? "hebrew-features-grid" : ""
                }`}
              >
                <div className={isRTL ? "text-right" : ""}>
                  <h3
                    className={`font-bold text-gray-800 mb-4 text-lg ${
                      isRTL ? "hebrew-section-title" : ""
                    }`}
                  >
                    {t("solutions.key_features")}
                  </h3>
                  <ul className="space-y-3">
                    {solution.features.map((feature, featureIdx) => (
                      <li
                        key={featureIdx}
                        className={`flex items-start text-gray-600 ${
                          isRTL ? "text-right" : ""
                        }`}
                      >
                        {isRTL ? (
                          <>
                            <svg
                              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 ml-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-base leading-relaxed flex-1">
                              {feature}
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-base leading-relaxed">
                              {feature}
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={isRTL ? "text-right" : ""}>
                  <h3
                    className={`font-bold text-gray-800 mb-4 text-lg ${
                      isRTL ? "hebrew-section-title" : ""
                    }`}
                  >
                    {t("solutions.benefits")}
                  </h3>
                  <ul className="space-y-3">
                    {solution.benefits.map((benefit, benefitIdx) => (
                      <li
                        key={benefitIdx}
                        className={`flex items-start text-gray-600 ${
                          isRTL ? "text-right" : ""
                        }`}
                      >
                        {isRTL ? (
                          <>
                            <svg
                              className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 ml-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-base leading-relaxed flex-1">
                              {benefit}
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-base leading-relaxed">
                              {benefit}
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className={`mt-8 pt-6 border-t border-gray-100 ${
                  isRTL ? "text-center" : ""
                }`}
              >
                <button
                  className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg w-full md:w-auto ${
                    isRTL ? "hebrew-button" : ""
                  }`}
                >
                  {t("solutions.learn_more")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="mb-20">
          <h2
            className={`text-3xl lg:text-4xl font-bold text-center mb-16 ${
              isRTL ? "hebrew-section-title" : ""
            }`}
          >
            {t("solutions.popular_use_cases")}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 ${
              isRTL ? "hebrew-use-cases-grid" : ""
            }`}
          >
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 ${
                  isRTL ? "hebrew-use-case-card" : ""
                }`}
              >
                <h3
                  className={`text-xl lg:text-2xl font-bold mb-6 text-indigo-700 ${
                    isRTL ? "text-center hebrew-category-title" : ""
                  }`}
                >
                  {useCase.category}
                </h3>
                <ul className="space-y-4">
                  {useCase.examples.map((example, exampleIdx) => (
                    <li
                      key={exampleIdx}
                      className={`text-gray-700 flex items-start text-base leading-relaxed ${
                        isRTL ? "text-right" : ""
                      }`}
                    >
                      {isRTL ? (
                        <>
                          <span className="w-3 h-3 bg-indigo-400 rounded-full flex-shrink-0 mt-2 ml-4"></span>
                          <span className="flex-1">{example}</span>
                        </>
                      ) : (
                        <>
                          <span className="w-3 h-3 bg-indigo-400 rounded-full flex-shrink-0 mt-2 mr-4"></span>
                          <span>{example}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div
          className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-10 lg:p-12 mb-20 ${
            isRTL ? "hebrew-success-stories" : ""
          }`}
        >
          <h2
            className={`text-3xl lg:text-4xl font-bold text-center mb-12 ${
              isRTL ? "hebrew-section-title" : ""
            }`}
          >
            {t("solutions.success_stories")}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-10 ${
              isRTL ? "hebrew-stories-grid" : ""
            }`}
          >
            <div
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isRTL ? "hebrew-story-card" : ""
              }`}
            >
              <h3
                className={`font-bold mb-4 text-lg ${
                  isRTL ? "text-center hebrew-story-title" : ""
                }`}
              >
                {t("solutions.story1_title")}
              </h3>
              <p
                className={`text-gray-600 mb-6 text-base leading-relaxed ${
                  isRTL ? "text-center hebrew-story-text" : ""
                }`}
              >
                {t("solutions.story1_quote")}
              </p>
              <p
                className={`text-sm text-gray-500 font-medium ${
                  isRTL ? "text-center hebrew-story-author" : ""
                }`}
              >
                {t("solutions.story1_author")}
              </p>
            </div>
            <div
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isRTL ? "hebrew-story-card" : ""
              }`}
            >
              <h3
                className={`font-bold mb-4 text-lg ${
                  isRTL ? "text-center hebrew-story-title" : ""
                }`}
              >
                {t("solutions.story2_title")}
              </h3>
              <p
                className={`text-gray-600 mb-6 text-base leading-relaxed ${
                  isRTL ? "text-center hebrew-story-text" : ""
                }`}
              >
                {t("solutions.story2_quote")}
              </p>
              <p
                className={`text-sm text-gray-500 font-medium ${
                  isRTL ? "text-center hebrew-story-author" : ""
                }`}
              >
                {t("solutions.story2_author")}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`text-center py-16 ${isRTL ? "hebrew-cta-section" : ""}`}
        >
          <h2
            className={`text-3xl lg:text-4xl font-bold mb-6 ${
              isRTL ? "hebrew-cta-title" : ""
            }`}
          >
            {t("solutions.ready_to_start")}
          </h2>
          <p
            className={`text-gray-600 mb-12 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed ${
              isRTL ? "hebrew-cta-description" : ""
            }`}
          >
            {t("solutions.cta_description")}
          </p>
          <div
            className={`flex flex-col md:flex-row justify-center items-center gap-6 ${
              isRTL ? "md:flex-row-reverse" : ""
            }`}
          >
            <button
              className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg ${
                isRTL ? "hebrew-cta-button-primary" : ""
              }`}
            >
              {t("solutions.start_free_trial")}
            </button>
            <button
              className={`border-2 border-indigo-600 text-indigo-600 px-10 py-4 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg ${
                isRTL ? "hebrew-cta-button-secondary" : ""
              }`}
            >
              {t("solutions.schedule_demo")}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SolutionsPage;
