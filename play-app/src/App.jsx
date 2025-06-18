import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import JoinGamePage from "./pages/JoinGamePage";
import NotFoundPage from "./pages/NotFoundPage";
import ScrollToTop from "./components/ScrollToTop";

// Play App - Game participation platform
function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  useEffect(() => {
    // Check for language parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");

    if (langParam && (langParam === "he" || langParam === "eng")) {
      i18n.changeLanguage(langParam);
    }

    // Set document direction and language
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [i18n, isRTL]);

  return (
    <Router>
      <div dir={isRTL ? "rtl" : "ltr"}>
        <ScrollToTop />
        <Routes>
          {/* Play App Routes - No authentication required */}
          <Route path="/" element={<JoinGamePage />} />
          <Route path="/join" element={<JoinGamePage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
