import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

const PageLayout = ({ children }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-100"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
    </div>
  );
};

export default PageLayout;
