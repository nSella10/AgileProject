import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const WorkPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  const benefits = t("work.benefits", { returnObjects: true }) || [];
  const useCases = t("work.use_cases.cases", { returnObjects: true }) || [];
  const features = t("work.features.list", { returnObjects: true }) || [];
  const successStories =
    t("work.success_stories.stories", { returnObjects: true }) || [];

  return (
    <PageLayout>
      <div
        className="bg-gradient-to-b from-orange-600 to-red-700 py-16 text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("work.title")}
          </h1>
          <p className="text-xl text-orange-200 max-w-3xl mx-auto">
            {t("work.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16" dir={isRTL ? "rtl" : "ltr"}>
        {/* Transform Workplace Section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("work.transform_workplace")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t("work.transform_subtitle")}
          </p>
          <div
            className={`flex flex-col md:flex-row justify-center items-center gap-4 ${
              isRTL ? "md:flex-row-reverse" : ""
            }`}
          >
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors">
              {t("work.start_team_building")}
            </button>
            <button className="border border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors">
              {t("work.schedule_demo")}
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("work.workplace_benefits")}
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
            {t("work.benefits_description")}
          </p>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${
              isRTL ? "rtl" : ""
            }`}
          >
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg p-6 text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("work.use_cases.title")}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${
              isRTL ? "rtl" : ""
            }`}
          >
            {useCases.map((useCase, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features?.map((feature, featureIdx) => (
                    <li
                      key={featureIdx}
                      className={`text-sm text-gray-600 flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`w-2 h-2 bg-orange-400 rounded-full ${
                          isRTL ? "ml-2" : "mr-2"
                        }`}
                      ></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("work.success_stories.title")}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
              isRTL ? "rtl" : ""
            }`}
          >
            {successStories.map((story, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg">
                <h3 className="font-bold mb-2">{story.company}</h3>
                <p className="text-gray-600 text-sm mb-3 italic">
                  "{story.quote}"
                </p>
                <p className="text-xs text-gray-500 mb-2">- {story.author}</p>
                <p className="text-sm font-medium text-orange-600">
                  {story.results}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("work.features.title")}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${
              isRTL ? "rtl" : ""
            }`}
          >
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("work.pricing.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t("work.pricing.description")}
          </p>
          <div
            className={`flex flex-col md:flex-row justify-center items-center gap-4 ${
              isRTL ? "md:flex-row-reverse" : ""
            }`}
          >
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors">
              {t("work.pricing.contact_sales")}
            </button>
            <button className="border border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors">
              {t("work.pricing.custom_quote")}
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("work.ready_to_start")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t("work.ready_description")}
          </p>
          <div
            className={`flex flex-col md:flex-row justify-center items-center gap-4 ${
              isRTL ? "md:flex-row-reverse" : ""
            }`}
          >
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors">
              {t("work.get_started")}
            </button>
            <button className="border border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors">
              {t("work.book_demo")}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WorkPage;
