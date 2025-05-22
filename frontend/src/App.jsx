import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateGamePage from "./pages/CreateGamePage";
import MyGamesPage from "./pages/MyGamesPage";
import LaunchGamePage from "./pages/LaunchGamePage";
import FinalLeaderboardPage from "./pages/FinalLeaderboardPage"; // ✅ חדש

import PrivateRoute from "./components/PrivateRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import NotFoundPage from "./pages/NotFoundPage";
import JoinGamePage from "./pages/JoinGamePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route element={<RedirectIfLoggedIn />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/join" element={<JoinGamePage />} />
        <Route element={<RedirectIfLoggedIn />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create" element={<CreateGamePage />} />
          <Route path="/mygames" element={<MyGamesPage />} />
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
