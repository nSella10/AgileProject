import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";

const LanguageToggle = ({ className = "" }) => {
  const { i18n, t } = useTranslation();
  const isHebrew = i18n.language === "he";

  // Update document direction on language change
  useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;

    // Add Hebrew font class to body when Hebrew is selected
    if (currentLang === "he") {
      document.body.classList.add("hebrew-font");
    } else {
      document.body.classList.remove("hebrew-font");
    }
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "he" ? "en" : "he";
    i18n.changeLanguage(newLang);

    // Update document direction and language
    document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    // Store language preference
    localStorage.setItem("language", newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl ${
        isHebrew
          ? "space-x-reverse space-x-2"
          : "space-x-2 transform hover:scale-105"
      } ${className}`}
      title={isHebrew ? "Switch to English" : "עבור לעברית"}
    >
      <FaGlobe className="text-sm" />
      <span className="text-sm font-bold">{t("navbar.language_toggle")}</span>
    </button>
  );
};

export default LanguageToggle;
