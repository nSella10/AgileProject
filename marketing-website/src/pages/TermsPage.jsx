import React from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const TermsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  return (
    <PageLayout>
      <div
        className="bg-gradient-to-b from-gray-700 to-gray-900 py-16 text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("terms.title")}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t("terms.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16" dir={isRTL ? "rtl" : "ltr"}>
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.acceptance.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.acceptance.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.service_description.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.service_description.content")}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("terms.sections.service_description.features", {
                returnObjects: true,
              })?.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.user_accounts.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.user_accounts.content")}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("terms.sections.user_accounts.requirements", {
                returnObjects: true,
              })?.map((requirement, idx) => (
                <li key={idx}>{requirement}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.acceptable_use.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.acceptable_use.content")}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("terms.sections.acceptable_use.restrictions", {
                returnObjects: true,
              })?.map((restriction, idx) => (
                <li key={idx}>{restriction}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.intellectual_property.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.intellectual_property.content")}
            </p>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.intellectual_property.music_content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.privacy_policy.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.privacy_policy.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.subscription_payment.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.subscription_payment.content")}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("terms.sections.subscription_payment.terms", {
                returnObjects: true,
              })?.map((term, idx) => (
                <li key={idx}>{term}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.termination.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.termination.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.disclaimer.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.disclaimer.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.limitation_liability.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.limitation_liability.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.changes_terms.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.changes_terms.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("terms.sections.contact_info.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("terms.sections.contact_info.content")}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {t("terms.sections.contact_info.email")}
                <br />
                {t("terms.sections.contact_info.address")}
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsPage;
