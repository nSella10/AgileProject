import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/PageLayout";

const NotFoundPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  return (
    <PageLayout>
      <div
        className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t("not_found.title")}
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          {t("not_found.subtitle")}
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {t("not_found.back_home")}
        </Link>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;
