import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslations from "./locales/en.json";
import heTranslations from "./locales/he.json";

const resources = {
  eng: {
    translation: enTranslations,
  },
  he: {
    translation: heTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "eng",
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      lookupQuerystring: "lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
