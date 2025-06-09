import React from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const PrivacyPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  return (
    <PageLayout>
      <div
        className="bg-gradient-to-b from-blue-700 to-indigo-900 py-16 text-white"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("privacy.title")}
          </h1>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            {t("privacy.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16" dir={isRTL ? "rtl" : "ltr"}>
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("privacy.sections.information_collect.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("privacy.sections.information_collect.content")}
            </p>

            <h3 className="text-xl font-semibold mb-3">
              {t("privacy.sections.information_collect.personal_info.title")}
            </h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("privacy.sections.information_collect.personal_info.items", {
                returnObjects: true,
              })?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mb-3">
              {t("privacy.sections.information_collect.usage_info.title")}
            </h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("privacy.sections.information_collect.usage_info.items", {
                returnObjects: true,
              })?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("privacy.sections.how_we_use.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("privacy.sections.how_we_use.content")}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("privacy.sections.how_we_use.purposes", {
                returnObjects: true,
              })?.map((purpose, idx) => (
                <li key={idx}>{purpose}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("privacy.sections.information_sharing.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("privacy.sections.information_sharing.content")}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("privacy.sections.information_sharing.circumstances", {
                returnObjects: true,
              })?.map((circumstance, idx) => (
                <li key={idx}>{circumstance}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("privacy.sections.educational_data.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("privacy.sections.educational_data.content")}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("privacy.sections.educational_data.commitments", {
                returnObjects: true,
              })?.map((commitment, idx) => (
                <li key={idx}>{commitment}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("privacy.sections.data_security.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("privacy.sections.data_security.content")}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("privacy.sections.data_security.measures", {
                returnObjects: true,
              })?.map((measure, idx) => (
                <li key={idx}>{measure}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("privacy.sections.your_rights.title")}
            </h2>
            <p className="text-gray-700 mb-4">
              {t("privacy.sections.your_rights.content")}
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              {t("privacy.sections.your_rights.rights", {
                returnObjects: true,
              })?.map((right, idx) => (
                <li key={idx}>{right}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPage;
