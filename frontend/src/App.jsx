import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateGamePage from "./pages/CreateGamePage";
import EditGamePage from "./pages/EditGamePage";
import MyGamesPage from "./pages/MyGamesPage";
import LaunchGamePage from "./pages/LaunchGamePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import FinalLeaderboardPage from "./pages/FinalLeaderboardPage";
import AboutPage from "./pages/AboutPage";
import HelpPage from "./pages/HelpPage";
import BlogPage from "./pages/BlogPage";
import PricingPage from "./pages/PricingPage";
import SolutionsPage from "./pages/SolutionsPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SchoolPage from "./pages/SchoolPage";
import WorkPage from "./pages/WorkPage";
import HomePage2 from "./pages/HomePage2";
import CommunityPage from "./pages/CommunityPage";
import GamesPage from "./pages/GamesPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import CreateLessonPage from "./pages/CreateLessonPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import LiveSessionPage from "./pages/LiveSessionPage";

import PrivateRoute from "./components/PrivateRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import ScrollToTop from "./components/ScrollToTop";
import NotFoundPage from "./pages/NotFoundPage";
import JoinGamePage from "./pages/JoinGamePage";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route element={<RedirectIfLoggedIn />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/join" element={<JoinGamePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/school" element={<SchoolPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/home" element={<HomePage2 />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
        <Route path="/create-lesson" element={<CreateLessonPage />} />
        <Route path="/student-dashboard" element={<StudentDashboardPage />} />
        <Route path="/live-session" element={<LiveSessionPage />} />
        <Route element={<RedirectIfLoggedIn />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected */}
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
          />{" "}
          {/* ✅ חדש */}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
