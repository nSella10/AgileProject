import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateGamePage from "./pages/CreateGamePage";
import EditGamePage from "./pages/EditGamePage";
import MyGamesPage from "./pages/MyGamesPage";
import LaunchGamePage from "./pages/LaunchGamePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import FinalLeaderboardPage from "./pages/FinalLeaderboardPage";

import PrivateRoute from "./components/PrivateRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import ScrollToTop from "./components/ScrollToTop";
import NotFoundPage from "./pages/NotFoundPage";

// Create App - Game creation and management platform
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
          {/* Authentication Routes - Redirect to dashboard if already logged in */}
          <Route element={<RedirectIfLoggedIn redirectTo="/dashboard" />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes - All require authentication */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create" element={<CreateGamePage />} />
            <Route path="/edit-game/:gameId" element={<EditGamePage />} />
            <Route path="/mygames" element={<MyGamesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/launch/:gameId" element={<LaunchGamePage />} />
            <Route
              path="/final-leaderboard"
              element={<FinalLeaderboardPage />}
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
