import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  const getPriceUnit = () => {
    if (i18n.language === "he") return isAnnual ? "שנה" : "לחודש";
    return isAnnual ? "/year" : "/month";
  };

  const plans = [
    {
      name: t("pricing.plans.free.name"),
      price: { monthly: 0, annual: 0 },
      description: t("pricing.plans.free.description"),
      features: t("pricing.plans.free.features", { returnObjects: true }),
      buttonText: t("pricing.plans.free.button"),
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      popular: false,
    },
    {
      name: t("pricing.plans.educator.name"),
      price: { monthly: 9.99, annual: 99.99 },
      description: t("pricing.plans.educator.description"),
      features: t("pricing.plans.educator.features", { returnObjects: true }),
      buttonText: t("pricing.plans.educator.button"),
      buttonStyle: "bg-blue-600 text-white hover:bg-blue-700",
      popular: true,
    },
    {
      name: t("pricing.plans.institution.name"),
      price: { monthly: 29.99, annual: 299.99 },
      description: t("pricing.plans.institution.description"),
      features: t("pricing.plans.institution.features", {
        returnObjects: true,
      }),
      buttonText: t("pricing.plans.institution.button"),
      buttonStyle: "bg-purple-600 text-white hover:bg-purple-700",
      popular: false,
    },
  ];

  const faqs = t("pricing.faq.questions", { returnObjects: true });

  return (
    <PageLayout>
      <div
        className="bg-gradient-to-b from-blue-600 to-purple-700 py-16 text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("pricing.title")}
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            {t("pricing.subtitle")}
          </p>

          {/* Billing Toggle */}
          <div
            className={`flex items-center justify-center gap-4 mb-8 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <span className={`${!isAnnual ? "text-white" : "text-blue-200"}`}>
              {t("pricing.monthly")}
            </span>

            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? "bg-green-500" : "bg-blue-400"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                  isRTL
                    ? isAnnual
                      ? "right-1"
                      : "right-7"
                    : isAnnual
                    ? "left-7"
                    : "left-1"
                }`}
              />
            </button>

            <span className={`${isAnnual ? "text-white" : "text-blue-200"}`}>
              {isAnnual
                ? i18n.language === "he"
                  ? "שנה"
                  : t("pricing.annual")
                : t("pricing.annual")}
              <span
                className={`${
                  isRTL ? "mr-2" : "ml-2"
                } bg-green-500 text-white px-2 py-1 rounded-full text-xs`}
              >
                {t("pricing.save_percent")}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Pricing Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-lg shadow-lg p-8 flex flex-col h-full ${
                plan.popular ? "ring-2 ring-blue-500" : ""
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t("pricing.most_popular")}
                  </span>
                </div>
              )}

              <div className={`mb-6 ${isRTL ? "text-right" : "text-center"}`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {plan.price.monthly === 0 ? "" : getPriceUnit()}
                  </span>
                </div>
              </div>

              <ul className={`space-y-3 mb-8 flex-grow`}>
                {plan.features.map((feature, featureIdx) => (
                  <li
                    key={featureIdx}
                    className={`flex items-start ${
                      isRTL ? "flex-row text-right justify-start" : "flex-row"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 text-green-500 mt-1 ${
                        isRTL ? "mr-2" : "mr-2"
                      } flex-shrink-0`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className="text-gray-700"
                      style={isRTL ? { flex: 1 } : {}}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full h-12 px-4 rounded-lg font-medium transition-colors mt-auto ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise Section */}
        <div
          className="bg-gray-50 rounded-lg p-8 text-center mb-16"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h2 className="text-2xl font-bold mb-4">
            {t("pricing.enterprise.title")}
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            {t("pricing.enterprise.description")}
          </p>
          <button className="bg-gray-800 text-white px-8 h-12 rounded-lg hover:bg-gray-900 transition-colors">
            {t("pricing.enterprise.button")}
          </button>
        </div>

        {/* FAQ Section */}
        <div dir={isRTL ? "rtl" : "ltr"}>
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("pricing.faq.title")}
          </h2>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
              isRTL ? "rtl" : ""
            }`}
          >
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PricingPage;
